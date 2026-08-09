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

    const enrollments = await prisma.enrollment.findMany({
      where: { userId: session.user.id, status: "APPROVED" },
      select: { courseId: true },
    });

    const courseIds = enrollments.map((e) => e.courseId);
    if (courseIds.length === 0) return NextResponse.json({ quizzes: [] });

    const quizzes = await prisma.quiz.findMany({
      where: { courseId: { in: courseIds }, isPublished: true },
      include: {
        course: { select: { id: true, title: true, slug: true, thumbnail: true } },
        questions: { select: { id: true } },
        attempts: {
          where: { userId: session.user.id },
          orderBy: { startedAt: "desc" },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ quizzes });
  } catch (error) {
    console.error("Quizzes GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}