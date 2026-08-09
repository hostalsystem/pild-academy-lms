import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string; questionId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !["ADMIN", "INSTRUCTOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.question.delete({ where: { id: params.questionId } });

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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Question DELETE error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}