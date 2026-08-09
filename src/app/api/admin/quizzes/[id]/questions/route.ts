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
    if (!session?.user?.id || !["ADMIN", "INSTRUCTOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { question, options, correctAnswer, explanation, marks, order } = await req.json();

    if (!question || !options || correctAnswer === undefined) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const newQuestion = await prisma.question.create({
      data: {
        quizId: params.id,
        question,
        options,
        correctAnswer: String(correctAnswer),
        explanation: explanation || null,
        marks: marks ? parseInt(marks) : 10,
        order: order !== undefined ? parseInt(order) : 0,
      },
    });

    // Update quiz total marks
    const allQuestions = await prisma.question.findMany({
      where: { quizId: params.id },
      select: { marks: true },
    });
    const totalMarks = allQuestions.reduce((sum, q) => sum + q.marks, 0);

    await prisma.quiz.update({
      where: { id: params.id },
      data: { totalMarks },
    });

    return NextResponse.json({ success: true, question: newQuestion });
  } catch (error) {
    console.error("Question POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}