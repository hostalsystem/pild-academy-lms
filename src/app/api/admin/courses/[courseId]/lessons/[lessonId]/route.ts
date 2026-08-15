import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return null;
  }

  return session;
}

export async function PUT(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      courseId: string;
      lessonId: string;
    };
  }
) {
  try {
    const session = await requireAdmin();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const existingLesson = await prisma.lesson.findFirst({
      where: {
        id: params.lessonId,
        courseId: params.courseId,
      },
    });

    if (!existingLesson) {
      return NextResponse.json(
        { error: "Lesson not found" },
        { status: 404 }
      );
    }

    const body = await req.json();

    const title = String(body.title || "").trim();

    if (!title) {
      return NextResponse.json(
        { error: "Lecture title is required" },
        { status: 400 }
      );
    }

    const lesson = await prisma.lesson.update({
      where: {
        id: params.lessonId,
      },
      data: {
        title,
        description: body.description || null,
        videoUrl: body.videoUrl || null,
        pdfUrl: body.pdfUrl || null,
        duration: Number(body.duration) || 0,
        order: Number(body.order) || 0,
      },
    });

    return NextResponse.json({
      success: true,
      lesson,
    });
  } catch (error) {
    console.error("Admin lesson PUT error:", error);

    return NextResponse.json(
      { error: "Failed to update lesson" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      courseId: string;
      lessonId: string;
    };
  }
) {
  try {
    const session = await requireAdmin();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const lesson = await prisma.lesson.findFirst({
      where: {
        id: params.lessonId,
        courseId: params.courseId,
      },
    });

    if (!lesson) {
      return NextResponse.json(
        { error: "Lesson not found" },
        { status: 404 }
      );
    }

    await prisma.lesson.delete({
      where: {
        id: params.lessonId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Lesson deleted",
    });
  } catch (error) {
    console.error("Admin lesson DELETE error:", error);

    return NextResponse.json(
      { error: "Failed to delete lesson" },
      { status: 500 }
    );
  }
}