import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const zoomClass = await prisma.zoomClass.findUnique({
      where: { id: params.id },
      include: {
        course: { select: { id: true, title: true, thumbnail: true } },
      },
    });

    if (!zoomClass) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (session.user.role !== "ADMIN" && session.user.role !== "INSTRUCTOR") {
      const enrollment = await prisma.enrollment.findFirst({
        where: {
          userId: session.user.id,
          courseId: zoomClass.courseId,
          status: "APPROVED",
        },
      });
      if (!enrollment) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    return NextResponse.json({ zoomClass });
  } catch (error) {
    console.error("Zoom single GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!["ADMIN", "INSTRUCTOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { title, description, meetingUrl, meetingId, passcode, startTime, endTime, recordingUrl } = body;

    const zoomClass = await prisma.zoomClass.update({
      where: { id: params.id },
      data: {
        title,
        description,
        meetingUrl,
        meetingId,
        passcode,
        startTime: startTime ? new Date(startTime) : undefined,
        endTime: endTime ? new Date(endTime) : null,
        recordingUrl,
      },
    });

    return NextResponse.json({ success: true, zoomClass });
  } catch (error) {
    console.error("Zoom PUT error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!["ADMIN", "INSTRUCTOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.zoomClass.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Zoom DELETE error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}