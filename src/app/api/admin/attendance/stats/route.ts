import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!["ADMIN", "INSTRUCTOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");

    const where: any = {};
    if (courseId) where.courseId = courseId;

    const totalClasses = await prisma.attendance.groupBy({
      by: ["date"],
      where,
      _count: { date: true },
    });

    const totalRecords = await prisma.attendance.count({ where });

    const presentCount = await prisma.attendance.count({
      where: { ...where, status: "PRESENT" },
    });

    const absentCount = await prisma.attendance.count({
      where: { ...where, status: "ABSENT" },
    });

    const lateCount = await prisma.attendance.count({
      where: { ...where, status: "LATE" },
    });

    return NextResponse.json({
      totalClassDays: totalClasses.length,
      totalRecords,
      presentCount,
      absentCount,
      lateCount,
      attendanceRate: totalRecords > 0 ? Math.round((presentCount / totalRecords) * 100) : 0,
    });
  } catch (error) {
    console.error("Attendance stats error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}