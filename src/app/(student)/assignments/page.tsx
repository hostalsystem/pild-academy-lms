import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ClipboardList,
  CheckCircle,
  Clock,
  AlertCircle,
  BookOpen,
  FileText,
  Download,
  Star,
} from "lucide-react";
import Image from "next/image";
import { SubmissionForm } from "@/components/assignments/submission-form";

async function getAssignments(userId: string) {
  const enrollments = await prisma.enrollment.findMany({
    where: { userId, status: "APPROVED" },
    select: { courseId: true },
  });

  const courseIds = enrollments.map((e) => e.courseId);
  if (courseIds.length === 0) return [];

  return await prisma.assignment.findMany({
    where: { courseId: { in: courseIds } },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          slug: true,
          thumbnail: true,
        },
      },
      submissions: {
        where: { userId },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export default async function AssignmentsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const assignments = await getAssignments(session.user.id);

  const total = assignments.length;
  const submitted = assignments.filter((a) => a.submissions.length > 0).length;
  const pending = total - submitted;
  const graded = assignments.filter(
    (a) => a.submissions[0]?.status === "GRADED"
  ).length;
  const gradedSubmissions = assignments.filter(
    (a) => a.submissions[0]?.marks != null
  );
  const avgMarks =
    gradedSubmissions.length > 0
      ? Math.round(
          gradedSubmissions.reduce(
            (sum, a) => sum + (a.submissions[0]?.marks || 0),
            0
          ) / gradedSubmissions.length
        )
      : 0;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Assignments</h1>
        <p className="text-gray-500 mt-1">
          View, download, and submit your course assignments.
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
            <ClipboardList className="h-8 w-8 text-blue-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Submitted</p>
              <p className="text-2xl font-bold">{submitted}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Pending</p>
              <p className="text-2xl font-bold">{pending}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Avg Marks</p>
              <p className="text-2xl font-bold">
                {avgMarks > 0 ? `${avgMarks}%` : "—"}
              </p>
            </div>
            <Star className="h-8 w-8 text-pild-primary" />
          </CardContent>
        </Card>
      </div>

      {/* Assignments List */}
      {assignments.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <ClipboardList className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-500 mb-2">
              No Assignments
            </h3>
            <p className="text-gray-400">
              You don't have any assignments for your enrolled courses.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {assignments.map((assignment) => {
            const submission = assignment.submissions[0];
            const isSubmitted = !!submission;
            const isGraded = submission?.status === "GRADED";
            const isOverdue =
              assignment.dueDate &&
              new Date(assignment.dueDate) < new Date() &&
              !isSubmitted;

            return (
              <Card key={assignment.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    {/* Course Image */}
                    <div className="relative w-full md:w-44 h-44 md:h-auto bg-gray-200 shrink-0">
                      {assignment.course.thumbnail ? (
                        <Image
                          src={assignment.course.thumbnail}
                          alt={assignment.course.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <BookOpen className="h-10 w-10 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-5 space-y-4">
                      {/* Header */}
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">
                            {assignment.course.title}
                          </p>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {assignment.title}
                          </h3>
                        </div>
                        <div className="flex gap-2">
                          {isGraded ? (
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                              <CheckCircle className="h-3 w-3 mr-1" /> Graded
                            </Badge>
                          ) : isSubmitted ? (
                            <Badge
                              variant="secondary"
                              className="bg-blue-100 text-blue-700 hover:bg-blue-100"
                            >
                              <Clock className="h-3 w-3 mr-1" /> Submitted
                            </Badge>
                          ) : (
                            <Badge
                              variant="secondary"
                              className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                            >
                              <AlertCircle className="h-3 w-3 mr-1" /> Pending
                            </Badge>
                          )}
                          {isOverdue && (
                            <Badge variant="destructive">Overdue</Badge>
                          )}
                        </div>
                      </div>

                      <p className="text-sm text-gray-600">
                        {assignment.description || "No description provided."}
                      </p>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1.5">
                          <Star className="h-4 w-4 text-pild-secondary" />
                          Max Marks: {assignment.maxMarks}
                        </span>
                        {assignment.dueDate && (
                          <span className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4" />
                            Due:{" "}
                            {new Date(assignment.dueDate).toLocaleDateString(
                              "en-PK",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </span>
                        )}
                      </div>

                      <Separator />

                      {/* Actions */}
                      <div className="space-y-4">
                        {assignment.fileUrl && (
                          <a
                            href={assignment.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-pild-primary hover:underline font-medium"
                          >
                            <FileText className="h-4 w-4" />
                            Download Assignment
                            <Download className="h-3 w-3" />
                          </a>
                        )}

                        {isGraded ? (
                          <div className="bg-green-50 rounded-lg p-4 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-green-800">
                                Graded
                              </span>
                              <span className="text-lg font-bold text-green-700">
                                {submission.marks} / {assignment.maxMarks}
                              </span>
                            </div>
                            {submission.feedback && (
                              <div>
                                <p className="text-xs text-green-600 font-medium mb-1">
                                  Feedback:
                                </p>
                                <p className="text-sm text-green-800">
                                  {submission.feedback}
                                </p>
                              </div>
                            )}
                            <p className="text-xs text-green-600">
                              Submitted on{" "}
                              {new Date(
                                submission.submittedAt
                              ).toLocaleDateString("en-PK")}
                            </p>
                          </div>
                        ) : isSubmitted ? (
                          <div className="bg-blue-50 rounded-lg p-4 space-y-2">
                            <div className="flex items-center gap-2 text-blue-700">
                              <CheckCircle className="h-4 w-4" />
                              <span className="text-sm font-medium">
                                Submitted on{" "}
                                {new Date(
                                  submission.submittedAt
                                ).toLocaleDateString("en-PK")}
                              </span>
                            </div>
                            {submission.fileUrl && (
                              <a
                                href={submission.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline"
                              >
                                <FileText className="h-4 w-4" />
                                View Your Submission
                              </a>
                            )}
                            {submission.notes && (
                              <p className="text-sm text-blue-600">
                                <span className="font-medium">Notes:</span>{" "}
                                {submission.notes}
                              </p>
                            )}
                            <p className="text-xs text-blue-500">
                              Awaiting grading from instructor...
                            </p>
                          </div>
                        ) : (
                          <SubmissionForm assignmentId={assignment.id} />
                        )}
                      </div>
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