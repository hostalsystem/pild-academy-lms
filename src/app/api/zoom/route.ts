import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Student: list zoom classes for enrolled courses
// Admin: list all zoom classes
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role === "ADMIN" || session.user.role === "INSTRUCTOR") {
      const classes = await prisma.zoomClass.findMany({
        include: {
          course: { select: { id: true, title: true, thumbnail: true } },
        },
        orderBy: { startTime: "asc" },
      });
      return NextResponse.json({ classes });
    }

    const enrollments = await prisma.enrollment.findMany({
      where: { userId: session.user.id, status: "APPROVED" },
      select: { courseId: true },
    });

    const courseIds = enrollments.map((e) => e.courseId);
    if (courseIds.length === 0) return NextResponse.json({ classes: [] });

    const classes = await prisma.zoomClass.findMany({
      where: { courseId: { in: courseIds } },
      include: {
        course: { select: { id: true, title: true, thumbnail: true } },
      },
      orderBy: { startTime: "asc" },
    });

    return NextResponse.json({ classes });
  } catch (error) {
    console.error("Zoom GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Admin creates a zoom class
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!["ADMIN", "INSTRUCTOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { courseId, title, description, meetingUrl, meetingId, passcode, startTime, endTime } = body;

    if (!courseId || !title || !meetingUrl || !startTime) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const zoomClass = await prisma.zoomClass.create({
      data: {
        courseId,
        title,
        description,
        meetingUrl,
        meetingId,
        passcode,
        startTime: new Date(startTime),
        endTime: endTime ? new Date(endTime) : null,
        createdBy: session.user.id,
      },
    });

    return NextResponse.json({ success: true, zoomClass });
  } catch (error) {
    console.error("Zoom POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}