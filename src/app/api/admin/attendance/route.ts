import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET attendance for a course on a specific date
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
    const date = searchParams.get("date");

    if (!courseId || !date) {
      return NextResponse.json({ error: "Course and date required" }, { status: 400 });
    }

    // Get all approved enrollments for this course
    const enrollments = await prisma.enrollment.findMany({
      where: {
        courseId,
        status: "APPROVED",
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, image: true },
        },
      },
      orderBy: { enrolledAt: "desc" },
    });

    // Get attendance records for this course and date
    const attendanceRecords = await prisma.attendance.findMany({
      where: {
        courseId,
        date: new Date(date),
      },
    });

    const attendanceMap = new Map(attendanceRecords.map((a) => [a.userId, a]));

    const students = enrollments.map((enrollment) => {
      const record = attendanceMap.get(enrollment.userId);
      return {
        userId: enrollment.userId,
        name: enrollment.user.name,
        email: enrollment.user.email,
        image: enrollment.user.image,
        enrollmentId: enrollment.id,
        status: record?.status || null,
        notes: record?.notes || null,
        attendanceId: record?.id || null,
      };
    });

    return NextResponse.json({ students });
  } catch (error) {
    console.error("Admin attendance GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST mark attendance
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!["ADMIN", "INSTRUCTOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { userId, courseId, date, status, notes } = await req.json();

    if (!userId || !courseId || !date || !status) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Verify enrollment exists and is approved
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        userId,
        courseId,
        status: "APPROVED",
      },
    });

    if (!enrollment) {
      return NextResponse.json({ error: "Student not enrolled" }, { status: 404 });
    }

    const attendance = await prisma.attendance.upsert({
      where: {
        userId_courseId_date: {
          userId,
          courseId,
          date: new Date(date),
        },
      },
      update: {
        status,
        notes: notes || null,
      },
      create: {
        userId,
        courseId,
        date: new Date(date),
        status,
        notes: notes || null,
      },
    });

    return NextResponse.json({ success: true, attendance });
  } catch (error) {
    console.error("Admin attendance POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}