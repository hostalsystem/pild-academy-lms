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

    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");

    const classes = await prisma.zoomClass.findMany({
      where: courseId ? { courseId } : {},
      include: {
        course: {
          select: { id: true, title: true },
        },
      },
      orderBy: { startTime: "desc" },
    });

    return NextResponse.json({ classes });
  } catch (error: any) {
    console.error("Zoom classes GET error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    console.log("Received body:", body);

    const {
      title,
      description,
      meetingUrl,
      meetingId,
      passcode,
      startTime,
      endTime,
      duration, // we accept duration and calculate endTime
      courseId,
    } = body;

    // Validation
    const missing = [];
    if (!title) missing.push("title");
    if (!meetingUrl) missing.push("meetingUrl");
    if (!startTime) missing.push("startTime");
    if (!courseId) missing.push("courseId");

    if (missing.length > 0) {
      return NextResponse.json(
        { error: "Missing required fields: " + missing.join(", ") },
        { status: 400 }
      );
    }

    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });
    if (!course) {
      return NextResponse.json(
        { error: `Course with ID '${courseId}' not found` },
        { status: 400 }
      );
    }

    // Calculate endTime from duration if provided
    let calculatedEndTime = endTime ? new Date(endTime) : null;
    if (!calculatedEndTime && duration) {
      calculatedEndTime = new Date(new Date(startTime).getTime() + parseInt(duration) * 60000);
    }

    // Create zoom class
    const zoomClass = await prisma.zoomClass.create({
      data: {
        title,
        description: description || null,
        meetingUrl,
        meetingId: meetingId || null,
        passcode: passcode || null,
        startTime: new Date(startTime),
        endTime: calculatedEndTime,
        courseId,
        createdBy: session.user.id,
      },
      include: {
        course: { select: { id: true, title: true } },
      },
    });

    return NextResponse.json({ class: zoomClass }, { status: 201 });
  } catch (error: any) {
    console.error("Zoom class POST error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create" },
      { status: 500 }
    );
  }
}