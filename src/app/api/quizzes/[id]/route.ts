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

    const quiz = await prisma.quiz.findUnique({
      where: { id: params.id, isPublished: true },
      include: {
        course: { select: { id: true, title: true } },
        questions: { orderBy: { order: "asc" } },
        attempts: {
          where: { userId: session.user.id },
          orderBy: { startedAt: "desc" },
          take: 1,
        },
      },
    });

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    const enrollment = await prisma.enrollment.findFirst({
      where: {
        userId: session.user.id,
        courseId: quiz.courseId,
        status: "APPROVED",
      },
    });

    if (!enrollment) {
      return NextResponse.json({ error: "Not enrolled" }, { status: 403 });
    }

    return NextResponse.json({ quiz });
  } catch (error) {
    console.error("Quiz GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}