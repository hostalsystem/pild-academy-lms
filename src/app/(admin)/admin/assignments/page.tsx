import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ClipboardList,
  Clock,
  CheckCircle,
  Star,
  BookOpen,
  FileText,
  Trash2,
  Users,
  Calendar,
} from "lucide-react";
import Image from "next/image";
import { AssignmentForm } from "@/components/admin/assignment-form";
import { SubmissionsList } from "@/components/admin/submissions-list";

async function getAdminAssignments() {
  return await prisma.assignment.findMany({
    include: {
      course: { select: { id: true, title: true, thumbnail: true } },
      _count: { select: { submissions: true } },
      submissions: { select: { status: true } },
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

export default async function AdminAssignmentsPage() {
  const session = await getServerSession(authOptions);
    if (!session?.user?.id || !["ADMIN", "INSTRUCTOR"].includes(session.user.role)) {
    redirect("/dashboard");
  }

  const assignments = await getAdminAssignments();
  const courses = await getCourses();

 const total = assignments.length;

const pendingGrading = assignments.reduce(
  (sum: number, assignment: any) => {
    const pending = assignment.submissions.filter(
      (submission: any) => submission.status !== "GRADED"
    ).length;

    return sum + pending;
  },
  0
);

const graded = assignments.reduce(
  (sum: number, assignment: any) => {
    const gradedCount = assignment.submissions.filter(
      (submission: any) => submission.status === "GRADED"
    ).length;

    return sum + gradedCount;
  },
  0
);

const totalSubmissions = assignments.reduce(
  (sum: number, assignment: any) => {
    return sum + assignment._count.submissions;
  },
  0
);
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Assignments</h1>
          <p className="text-gray-500 mt-1">
            Create and grade course assignments.
          </p>
        </div>
        <AssignmentForm courses={courses} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Total</p>
              <p className="text-2xl font-bold">{total}</p>
            </div>
            <ClipboardList className="h-8 w-8 text-blue-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Submissions</p>
              <p className="text-2xl font-bold">{totalSubmissions}</p>
            </div>
            <Users className="h-8 w-8 text-purple-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Pending Grade</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingGrading}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Graded</p>
              <p className="text-2xl font-bold text-green-600">{graded}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </CardContent>
        </Card>
      </div>

      {/* Assignments Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50/50">
                <th className="text-left px-6 py-3 font-medium text-gray-500">Assignment</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Course</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Due Date</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Max Marks</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Submissions</th>
                <th className="text-right px-6 py-3 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((assignment: any) => {
  const pendingCount = assignment.submissions.filter(
    (s: any) => s.status !== "GRADED"
  ).length;

                return (
                  <tr
                    key={assignment.id}
                    className="border-b last:border-0 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-200 shrink-0">
                          {assignment.course.thumbnail ? (
                            <Image
                              src={assignment.course.thumbnail}
                              alt={assignment.course.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <FileText className="h-5 w-5 text-gray-400 m-auto" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {assignment.title}
                          </p>
                          {assignment.fileUrl && (
                            <a
                              href={assignment.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-pild-primary hover:underline"
                            >
                              Download File
                            </a>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {assignment.course.title}
                    </td>
                    <td className="px-6 py-4">
                      {assignment.dueDate ? (
                        <span className="flex items-center gap-1.5 text-gray-600">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(assignment.dueDate).toLocaleDateString("en-PK", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">No due date</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant="outline"
                        className="text-pild-primary border-pild-primary/30"
                      >
                        <Star className="h-3 w-3 mr-1" />
                        {assignment.maxMarks}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-900 font-semibold">
                          {assignment._count.submissions}
                        </span>
                        {pendingCount > 0 && (
                          <Badge
                            variant="secondary"
                            className="bg-yellow-100 text-yellow-700 text-[10px]"
                          >
                            {pendingCount} pending
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <SubmissionsList
                          assignmentId={assignment.id}
                          maxMarks={assignment.maxMarks}
                        />
                        <form
                          action={async () => {
                            "use server";
                            await prisma.assignment.delete({
                              where: { id: assignment.id },
                            });
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