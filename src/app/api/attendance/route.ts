import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - Student views their own attendance
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");

    const where: any = { userId: session.user.id };
    if (courseId) where.courseId = courseId;

    const attendances = await prisma.attendance.findMany({
      where,
      include: {
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            thumbnail: true,
          },
        },
      },
      orderBy: { date: "desc" },
    });

    return NextResponse.json({ attendances });
  } catch (error) {
    console.error("Attendance GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Admin/Instructor marks attendance
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only ADMIN or INSTRUCTOR can mark attendance
    if (!["ADMIN", "INSTRUCTOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { userId, courseId, date, status, notes } = body;

    if (!userId || !courseId || !date || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
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
    console.error("Attendance POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}