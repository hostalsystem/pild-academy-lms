import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  HelpCircle,
  CheckCircle,
  Clock,
  AlertCircle,
  BookOpen,
  PlayCircle,
  Trophy,
  Target,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

async function getQuizzes(userId: string) {
  const enrollments = await prisma.enrollment.findMany({
    where: { userId, status: "APPROVED" },
    select: { courseId: true },
  });

  const courseIds = enrollments.map((e) => e.courseId);
  if (courseIds.length === 0) return [];

  return await prisma.quiz.findMany({
    where: { courseId: { in: courseIds }, isPublished: true },
    include: {
      course: {
        select: { id: true, title: true, slug: true, thumbnail: true },
      },
      questions: { select: { id: true, marks: true } },
      attempts: {
        where: { userId },
        orderBy: { startedAt: "desc" },
        take: 1,
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export default async function QuizzesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const quizzes = await getQuizzes(session.user.id);

  const total = quizzes.length;
  const completed = quizzes.filter(
    (q) =>
      q.attempts.length > 0 &&
      q.attempts[0].status !== "IN_PROGRESS"
  ).length;
  const passed = quizzes.filter(
    (q) => q.attempts.length > 0 && q.attempts[0].status === "PASSED"
  ).length;
  const avgScore =
    quizzes.filter((q) => q.attempts.length > 0 && q.attempts[0].percentage > 0)
      .length > 0
      ? Math.round(
          quizzes
            .filter((q) => q.attempts.length > 0 && q.attempts[0].percentage > 0)
            .reduce((sum, q) => sum + (q.attempts[0]?.percentage || 0), 0) /
            quizzes.filter(
              (q) => q.attempts.length > 0 && q.attempts[0].percentage > 0
            ).length
        )
      : 0;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Quizzes</h1>
        <p className="text-gray-500 mt-1">
          Test your knowledge with course quizzes.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Total</p>
              <p className="text-2xl font-bold">{total}</p>
            </div>
            <HelpCircle className="h-8 w-8 text-blue-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Completed</p>
              <p className="text-2xl font-bold">{completed}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Passed</p>
              <p className="text-2xl font-bold">{passed}</p>
            </div>
            <Trophy className="h-8 w-8 text-pild-secondary" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Avg Score</p>
              <p className="text-2xl font-bold">
                {avgScore > 0 ? `${avgScore}%` : "—"}
              </p>
            </div>
            <Target className="h-8 w-8 text-pild-primary" />
          </CardContent>
        </Card>
      </div>

      {/* Quiz List */}
      {quizzes.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <HelpCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-500 mb-2">
              No Quizzes Available
            </h3>
            <p className="text-gray-400">
              Quizzes will appear here once your instructor publishes them.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quizzes.map((quiz) => {
            const attempt = quiz.attempts[0];
            const isCompleted = attempt && attempt.status !== "IN_PROGRESS";
            const isPassed = attempt?.status === "PASSED";
            const totalQuestions = quiz.questions.length;
            const totalQuizMarks = quiz.questions.reduce(
              (sum, q) => sum + q.marks,
              0
            );

            return (
              <Card key={quiz.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row">
                    <div className="relative w-full sm:w-40 h-40 sm:h-auto bg-gray-200 shrink-0">
                      {quiz.course.thumbnail ? (
                        <Image
                          src={quiz.course.thumbnail}
                          alt={quiz.course.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <BookOpen className="h-10 w-10 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 p-5 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">
                            {quiz.course.title}
                          </p>
                          <h3 className="font-semibold text-gray-900">
                            {quiz.title}
                          </h3>
                        </div>
                        {isCompleted ? (
                          isPassed ? (
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                              <CheckCircle className="h-3 w-3 mr-1" /> Passed
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-100">
                              <AlertCircle className="h-3 w-3 mr-1" /> Failed
                            </Badge>
                          )
                        ) : attempt ? (
                          <Badge
                            variant="secondary"
                            className="bg-blue-100 text-blue-700 hover:bg-blue-100"
                          >
                            <Clock className="h-3 w-3 mr-1" /> In Progress
                          </Badge>
                        ) : (
                          <Badge
                            variant="secondary"
                            className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                          >
                            <AlertCircle className="h-3 w-3 mr-1" /> Not Started
                          </Badge>
                        )}
                      </div>

                      <p className="text-sm text-gray-600 line-clamp-2">
                        {quiz.description || "No description provided."}
                      </p>

                      <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <HelpCircle className="h-3.5 w-3.5" />
                          {totalQuestions} Questions
                        </span>
                        <span className="flex items-center gap-1">
                          <Target className="h-3.5 w-3.5" />
                          {totalQuizMarks} Marks
                        </span>
                        {quiz.timeLimit && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {quiz.timeLimit} min
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Trophy className="h-3.5 w-3.5 text-pild-secondary" />
                          Pass: {quiz.passingScore}%
                        </span>
                      </div>

                      {isCompleted && attempt && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Score</span>
                            <span
                              className={`font-bold ${
                                isPassed ? "text-green-600" : "text-red-600"
                              }`}
                            >
                              {attempt.score} / {attempt.totalMarks} (
                              {Math.round(attempt.percentage)}%)
                            </span>
                          </div>
                          <Progress
                            value={attempt.percentage}
                            className="h-2"
                          />
                        </div>
                      )}

                      <Link href={`/quizzes/${quiz.id}`}>
                        <Button
                          className={`w-full gap-2 ${
                            isCompleted
                              ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              : "bg-pild-primary"
                          }`}
                          variant={isCompleted ? "outline" : "default"}
                        >
                          {isCompleted ? (
                            <>
                              <CheckCircle className="h-4 w-4" />
                              View Results
                            </>
                          ) : (
                            <>
                              <PlayCircle className="h-4 w-4" />
                              {attempt ? "Continue Quiz" : "Start Quiz"}
                            </>
                          )}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}