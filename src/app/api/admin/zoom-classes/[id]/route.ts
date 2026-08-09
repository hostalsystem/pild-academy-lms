import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      description,
      meetingUrl,
      meetingId,
      passcode,
      startTime,
      endTime,
      duration,
      courseId,
    } = body;

    // Calculate endTime from duration if provided
    let calculatedEndTime = endTime ? new Date(endTime) : null;
    if (!calculatedEndTime && duration) {
      calculatedEndTime = new Date(new Date(startTime).getTime() + parseInt(duration) * 60000);
    }

    const updated = await prisma.zoomClass.update({
      where: { id: params.id },
      data: {
        title,
        description: description || null,
        meetingUrl,
        meetingId: meetingId || null,
        passcode: passcode || null,
        startTime: new Date(startTime),
        endTime: calculatedEndTime,
        courseId,
      },
      include: {
        course: { select: { id: true, title: true } },
      },
    });

    return NextResponse.json({ class: updated });
  } catch (error: any) {
    console.error("Zoom class PUT error:", error);
    return NextResponse.json({ error: error.message || "Failed to update" }, { status: 500 });
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

    await prisma.zoomClass.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error: any) {
    console.error("Zoom class DELETE error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete" }, { status: 500 });
  }
}