import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const range = searchParams.get("range") || "30"; // days

    const since = new Date();
    since.setDate(since.getDate() - parseInt(range));

    // Revenue by month
    const payments = await prisma.payment.findMany({
      where: { createdAt: { gte: since } },
      select: { amount: true, status: true, createdAt: true, courseId: true },
    });

    const revenueByMonth: Record<string, number> = {};
    payments.forEach((p) => {
      if (p.status === "PAID" || p.status === "VERIFIED") {
        const key = p.createdAt.toISOString().slice(0, 7); // YYYY-MM
        revenueByMonth[key] = (revenueByMonth[key] || 0) + p.amount;
      }
    });

    // Enrollments by month
    const enrollments = await prisma.enrollment.findMany({
      where: { enrolledAt: { gte: since } },
      select: { status: true, enrolledAt: true },
    });

    const enrollmentsByMonth: Record<string, { total: number; approved: number; pending: number }> = {};
    enrollments.forEach((e) => {
      const key = e.enrolledAt.toISOString().slice(0, 7);
      if (!enrollmentsByMonth[key]) enrollmentsByMonth[key] = { total: 0, approved: 0, pending: 0 };
      enrollmentsByMonth[key].total++;
      if (e.status === "APPROVED") enrollmentsByMonth[key].approved++;
      else if (e.status === "PENDING") enrollmentsByMonth[key].pending++;
    });

    // Course performance
    const courses = await prisma.course.findMany({
      include: {
        _count: { select: { enrollments: true, lessons: true } },
        enrollments: { select: { status: true } },
      },
    });

    const coursePerformance = courses.map((c) => ({
      name: c.title,
      enrollments: c._count.enrollments,
      revenue: c.fee * c._count.enrollments,
      completed: c.enrollments.filter((e) => e.status === "COMPLETED").length,
    }));

    // Student growth
    const users = await prisma.user.findMany({
      where: { createdAt: { gte: since }, role: "STUDENT" },
      select: { createdAt: true },
    });

    const studentsByMonth: Record<string, number> = {};
    users.forEach((u) => {
      const key = u.createdAt.toISOString().slice(0, 7);
      studentsByMonth[key] = (studentsByMonth[key] || 0) + 1;
    });

    // Payment status breakdown
    const paymentStats = {
      paid: payments.filter((p) => p.status === "PAID" || p.status === "VERIFIED").length,
      pending: payments.filter((p) => p.status === "PENDING").length,
      rejected: payments.filter((p) => p.status === "REJECTED").length,
      totalAmount: payments
        .filter((p) => p.status === "PAID" || p.status === "VERIFIED")
        .reduce((sum, p) => sum + p.amount, 0),
    };

    // Attendance summary
    const attendanceRecords = await prisma.attendance.findMany({
      where: { createdAt: { gte: since } },
      select: { status: true },
    });

    const attendanceStats = {
      present: attendanceRecords.filter((a) => a.status === "PRESENT").length,
      absent: attendanceRecords.filter((a) => a.status === "ABSENT").length,
      late: attendanceRecords.filter((a) => a.status === "LATE").length,
    };

    // Quiz performance
    const quizAttempts = await prisma.quizAttempt.findMany({
      where: { startedAt: { gte: since } },
      select: { score: true, totalMarks: true, status: true },
    });

    const quizStats = {
      total: quizAttempts.length,
      passed: quizAttempts.filter((q) => q.status === "PASSED").length,
      failed: quizAttempts.filter((q) => q.status === "FAILED").length,
      avgScore:
        quizAttempts.length > 0
          ? Math.round(
              quizAttempts.reduce((sum, q) => sum + (q.score / (q.totalMarks || 1)) * 100, 0) /
                quizAttempts.length
            )
          : 0,
    };

    return NextResponse.json({
      revenueByMonth,
      enrollmentsByMonth,
      coursePerformance,
      studentsByMonth,
      paymentStats,
      attendanceStats,
      quizStats,
    });
  } catch (error) {
    console.error("Reports API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}