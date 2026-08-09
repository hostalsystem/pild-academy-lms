import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { QuizTaker } from "@/components/quizzes/quiz-taker";

interface PageProps {
  params: { id: string };
}

async function getQuizData(id: string, userId: string) {
  const quiz = await prisma.quiz.findUnique({
    where: { id, isPublished: true },
    include: {
      course: { select: { id: true, title: true } },
      questions: { orderBy: { order: "asc" } },
      attempts: {
        where: { userId },
        orderBy: { startedAt: "desc" },
        take: 1,
      },
    },
  });

  if (!quiz) return null;

  const enrollment = await prisma.enrollment.findFirst({
    where: { userId, courseId: quiz.courseId, status: "APPROVED" },
  });

  if (!enrollment) return null;

  return quiz;
}

export default async function QuizPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const quiz = await getQuizData(params.id, session.user.id);
  if (!quiz) notFound();

  const latestAttempt = quiz.attempts[0];
  const isCompleted = latestAttempt && latestAttempt.status !== "IN_PROGRESS";

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <QuizTaker
        quiz={quiz}
        initialAttempt={latestAttempt || null}
        isCompleted={isCompleted}
      />
    </div>
  );
}