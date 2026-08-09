import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  HelpCircle,
  Eye,
  EyeOff,
  Clock,
  Target,
  BookOpen,
  Trash2,
  Users,
  FileQuestion,
  Award,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { QuizForm } from "@/components/admin/quiz-form";

async function getAdminQuizzes() {
  return await prisma.quiz.findMany({
    include: {
      course: { select: { id: true, title: true, thumbnail: true } },
      _count: { select: { questions: true, attempts: true } },
      questions: { select: { marks: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

async function getCourses() {
  return await prisma.course.findMany({
    where: { published: true },
    select: { id: true, title: true },
    orderBy: { title: "asc" },
  });
}

export default async function AdminQuizzesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !["ADMIN", "INSTRUCTOR"].includes(session.user.role)) {
    redirect("/dashboard");
  }

  const quizzes = await getAdminQuizzes();
  const courses = await getCourses();

  const total = quizzes.length;
  const published = quizzes.filter((q) => q.isPublished).length;
  const totalQuestions = quizzes.reduce((sum, q) => sum + q._count.questions, 0);
  const totalAttempts = quizzes.reduce((sum, q) => sum + q._count.attempts, 0);

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quizzes</h1>
          <p className="text-gray-500 mt-1">Create and manage course quizzes.</p>
        </div>
        <QuizForm courses={courses} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Total Quizzes</p>
              <p className="text-2xl font-bold">{total}</p>
            </div>
            <HelpCircle className="h-8 w-8 text-blue-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Published</p>
              <p className="text-2xl font-bold text-green-600">{published}</p>
            </div>
            <Eye className="h-8 w-8 text-green-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Questions</p>
              <p className="text-2xl font-bold text-purple-600">{totalQuestions}</p>
            </div>
            <FileQuestion className="h-8 w-8 text-purple-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Attempts</p>
              <p className="text-2xl font-bold text-orange-600">{totalAttempts}</p>
            </div>
            <Users className="h-8 w-8 text-orange-500" />
          </CardContent>
        </Card>
      </div>

      {/* Quizzes Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50/50">
                <th className="text-left px-6 py-3 font-medium text-gray-500">Quiz</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Course</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Questions</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Attempts</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Pass %</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Status</th>
                <th className="text-right px-6 py-3 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {quizzes.map((quiz) => {
                const totalMarks = quiz.questions.reduce((sum, q) => sum + q.marks, 0);
                return (
                  <tr
                    key={quiz.id}
                    className="border-b last:border-0 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-200 shrink-0">
                          {quiz.course.thumbnail ? (
                            <Image
                              src={quiz.course.thumbnail}
                              alt={quiz.course.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <HelpCircle className="h-5 w-5 text-gray-400 m-auto" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 truncate">{quiz.title}</p>
                          {quiz.timeLimit && (
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {quiz.timeLimit} min
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{quiz.course.title}</td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className="text-pild-primary border-pild-primary/30">
                        <FileQuestion className="h-3 w-3 mr-1" />
                        {quiz._count.questions}
                      </Badge>
                      {totalMarks > 0 && (
                        <span className="text-xs text-gray-400 ml-2">{totalMarks} marks</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-900 font-semibold">
                      {quiz._count.attempts}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className="text-green-600 border-green-200">
                        <Target className="h-3 w-3 mr-1" />
                        {quiz.passingScore}%
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      {quiz.isPublished ? (
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 gap-1">
                          <Eye className="h-3 w-3" /> Live
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-gray-100 text-gray-600 hover:bg-gray-100 gap-1">
                          <EyeOff className="h-3 w-3" /> Draft
                        </Badge>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/quizzes/${quiz.id}`}>
                          <Button size="sm" variant="outline" className="gap-1.5">
                            <Award className="h-3.5 w-3.5" />
                            Manage
                          </Button>
                        </Link>
                        <QuizForm courses={courses} existingQuiz={quiz as any} />
                        <form
                          action={async () => {
                            "use server";
                            await prisma.quiz.delete({ where: { id: quiz.id } });
                          }}
                        >
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            type="submit"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}