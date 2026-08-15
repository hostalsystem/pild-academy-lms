import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  HelpCircle,
  ArrowLeft,
  CheckCircle,
  Clock,
  Target,
  Users,
  Trash2,
  Award,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { QuestionForm } from "@/components/admin/question-form";

interface PageProps {
  params: { id: string };
}

async function getQuizData(id: string) {
  return await prisma.quiz.findUnique({
    where: { id },
    include: {
      course: { select: { id: true, title: true, thumbnail: true } },
      questions: { orderBy: { order: "asc" } },
      attempts: {
        include: {
          user: { select: { id: true, name: true, email: true, image: true } },
        },
        orderBy: { startedAt: "desc" },
      },
    },
  });
}

export default async function QuizDetailPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !["ADMIN", "INSTRUCTOR"].includes(session.user.role)) {
    redirect("/dashboard");
  }

  const quiz = await getQuizData(params.id);
  if (!quiz) notFound();

  const passedCount = quiz.attempts.filter((a) => a.status === "PASSED").length;
  const failedCount = quiz.attempts.filter((a) => a.status === "FAILED").length;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link
            href="/admin/quizzes"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-pild-primary transition-colors mb-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Quizzes
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{quiz.title}</h1>
          <p className="text-gray-500 mt-1">{quiz.course.title}</p>
        </div>
        <div className="flex gap-2">
          {quiz.isPublished ? (
            <Badge className="bg-green-100 text-green-700 gap-1">
              <CheckCircle className="h-3 w-3" /> Published
            </Badge>
          ) : (
            <Badge variant="secondary" className="bg-gray-100 text-gray-600 gap-1">
              <AlertCircle className="h-3 w-3" /> Draft
            </Badge>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Questions</p>
              <p className="text-2xl font-bold">{quiz.questions.length}</p>
            </div>
            <HelpCircle className="h-8 w-8 text-blue-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Total Marks</p>
              <p className="text-2xl font-bold">{quiz.totalMarks}</p>
            </div>
            <Target className="h-8 w-8 text-purple-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Attempts</p>
              <p className="text-2xl font-bold">{quiz.attempts.length}</p>
            </div>
            <Users className="h-8 w-8 text-orange-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Pass Rate</p>
              <p className="text-2xl font-bold text-green-600">
                {quiz.attempts.length > 0
                  ? Math.round((passedCount / quiz.attempts.length) * 100)
                  : 0}
                %
              </p>
            </div>
            <Award className="h-8 w-8 text-green-500" />
          </CardContent>
        </Card>
      </div>

      {/* Questions Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Questions</h2>
          <QuestionForm quizId={quiz.id} />
        </div>

        {quiz.questions.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <HelpCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No questions yet. Add your first question above.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {quiz.questions.map((q, idx) => (
              <Card key={q.id} className="overflow-hidden">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-pild-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                          {idx + 1}
                        </span>
                        <Badge variant="outline" className="text-pild-primary border-pild-primary/30 text-[10px]">
                          {q.marks} marks
                        </Badge>
                      </div>
                      <p className="font-medium text-gray-900 mb-3">{q.question}</p>
                      <div className="space-y-1.5 ml-8">
  {Array.isArray(q.options) &&
    q.options.map((opt, optIdx) => (
      <div
        key={optIdx}
        className={`flex items-center gap-2 text-sm p-2 rounded-lg ${
          String(opt) === String(q.correctAnswer)
            ? "bg-green-50 text-green-800 border border-green-200"
            : "bg-gray-50 text-gray-600"
        }`}
      >
        <span className="font-medium text-xs w-5">
          {String.fromCharCode(65 + optIdx)}.
        </span>

        <span>{String(opt)}</span>

        {String(optIdx) === String(q.correctAnswer) && (
          <CheckCircle className="h-4 w-4 text-green-500 ml-auto" />
        )}
      </div>
    ))}
</div>
                      {q.explanation && (
                        <div className="ml-8 mt-2 bg-blue-50 rounded-lg p-2 text-xs text-blue-800">
                          <span className="font-medium">Explanation:</span> {q.explanation}
                        </div>
                      )}
                    </div>
                    <form
                      action={async () => {
                        "use server";
                        await prisma.question.delete({ where: { id: q.id } });
                        // Recalculate total marks
                        const remaining = await prisma.question.findMany({
                          where: { quizId: quiz.id },
                          select: { marks: true },
                        });
                        const newTotal = remaining.reduce((s, q) => s + q.marks, 0);
                        await prisma.quiz.update({
                          where: { id: quiz.id },
                          data: { totalMarks: newTotal },
                        });
                      }}
                    >
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 shrink-0"
                        type="submit"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Attempts Section */}
      {quiz.attempts.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Student Attempts</h2>
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50/50">
                    <th className="text-left px-6 py-3 font-medium text-gray-500">Student</th>
                    <th className="text-left px-6 py-3 font-medium text-gray-500">Score</th>
                    <th className="text-left px-6 py-3 font-medium text-gray-500">Percentage</th>
                    <th className="text-left px-6 py-3 font-medium text-gray-500">Status</th>
                    <th className="text-left px-6 py-3 font-medium text-gray-500">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {quiz.attempts.map((attempt) => (
                    <tr
                      key={attempt.id}
                      className="border-b last:border-0 hover:bg-gray-50/50"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {attempt.user.name || "Unnamed"}
                      </td>
                      <td className="px-6 py-4">
                        {attempt.score} / {attempt.totalMarks}
                      </td>
                      <td className="px-6 py-4 font-semibold">
                        {Math.round(attempt.percentage)}%
                      </td>
                      <td className="px-6 py-4">
                        {attempt.status === "PASSED" ? (
                          <Badge className="bg-green-100 text-green-700 gap-1">
                            <CheckCircle className="h-3 w-3" /> Passed
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="bg-red-100 text-red-700 gap-1">
                            <AlertCircle className="h-3 w-3" /> Failed
                          </Badge>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {attempt.completedAt
                          ? new Date(attempt.completedAt).toLocaleDateString("en-PK")
                          : new Date(attempt.startedAt).toLocaleDateString("en-PK")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}