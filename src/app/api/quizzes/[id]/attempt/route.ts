import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const quiz = await prisma.quiz.findUnique({
      where: { id: params.id },
      include: { questions: true },
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

    const { answers } = await req.json(); // { [questionId]: selectedIndex }

    let score = 0;
    let totalMarks = 0;

    quiz.questions.forEach((q) => {
      totalMarks += q.marks;
      const selected = answers?.[q.id];
      if (selected !== undefined && String(selected) === q.correctAnswer) {
        score += q.marks;
      }
    });

    const percentage = totalMarks > 0 ? (score / totalMarks) * 100 : 0;
    const passed = percentage >= quiz.passingScore;
    const status = passed ? "PASSED" : "FAILED";

    // Upsert attempt
    const existing = await prisma.quizAttempt.findFirst({
      where: { quizId: params.id, userId: session.user.id },
      orderBy: { startedAt: "desc" },
    });

    let attempt;
    if (existing && existing.status === "IN_PROGRESS") {
      attempt = await prisma.quizAttempt.update({
        where: { id: existing.id },
        data: {
          score,
          totalMarks,
          percentage,
          status,
          answers: answers || {},
          completedAt: new Date(),
        },
      });
    } else {
      attempt = await prisma.quizAttempt.create({
        data: {
          quizId: params.id,
          userId: session.user.id,
          score,
          totalMarks,
          percentage,
          status,
          answers: answers || {},
          completedAt: new Date(),
        },
      });
    }

    return NextResponse.json({ success: true, attempt });
  } catch (error) {
    console.error("Quiz attempt error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}