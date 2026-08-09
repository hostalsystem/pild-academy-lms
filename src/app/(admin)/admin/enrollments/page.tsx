import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ClipboardList,
  Clock,
  CheckCircle,
  XCircle,
  Award,
  Users,
  BookOpen,
  ArrowRight,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { EnrollmentActions } from "@/components/admin/enrollment-actions";

async function getAdminEnrollments() {
  return await prisma.enrollment.findMany({
    include: {
      user: {
        select: { id: true, name: true, email: true, image: true },
      },
      course: {
        select: { id: true, title: true, thumbnail: true, fee: true },
      },
      payments: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: { enrolledAt: "desc" },
  });
}

function getStatusBadge(status: string) {
  switch (status) {
    case "APPROVED":
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 gap-1">
          <CheckCircle className="h-3 w-3" /> Approved
        </Badge>
      );
    case "PENDING":
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 gap-1">
          <Clock className="h-3 w-3" /> Pending
        </Badge>
      );
    case "REJECTED":
      return (
        <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-100 gap-1">
          <XCircle className="h-3 w-3" /> Rejected
        </Badge>
      );
    case "COMPLETED":
      return (
        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 gap-1">
          <Award className="h-3 w-3" /> Completed
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

function getPaymentStatusBadge(status: string | undefined) {
  if (!status) return <Badge variant="outline">Not Paid</Badge>;
  switch (status) {
    case "PAID":
    case "VERIFIED":
      return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Paid</Badge>;
    case "PENDING":
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
          Pending
        </Badge>
      );
    case "REJECTED":
      return <Badge variant="destructive">Rejected</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

export default async function AdminEnrollmentsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const enrollments = await getAdminEnrollments();

  const total = enrollments.length;
  const pending = enrollments.filter((e) => e.status === "PENDING").length;
  const approved = enrollments.filter((e) => e.status === "APPROVED").length;
  const completed = enrollments.filter((e) => e.status === "COMPLETED").length;
  const rejected = enrollments.filter((e) => e.status === "REJECTED").length;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Enrollments</h1>
        <p className="text-gray-500 mt-1">
          Manage all student enrollments and their status.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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
              <p className="text-xs text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{pending}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Approved</p>
              <p className="text-2xl font-bold text-green-600">{approved}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Completed</p>
              <p className="text-2xl font-bold text-blue-600">{completed}</p>
            </div>
            <Award className="h-8 w-8 text-blue-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Rejected</p>
              <p className="text-2xl font-bold text-red-600">{rejected}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-500" />
          </CardContent>
        </Card>
      </div>

      {/* Enrollments Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50/50">
                <th className="text-left px-6 py-3 font-medium text-gray-500">Student</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Course</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Fee</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Payment</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Status</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Enrolled</th>
                <th className="text-right px-6 py-3 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.map((enrollment) => (
                <tr
                  key={enrollment.id}
                  className="border-b last:border-0 hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200 shrink-0">
                        {enrollment.user.image ? (
                          <Image
                            src={enrollment.user.image}
                            alt={enrollment.user.name || ""}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <Users className="h-5 w-5 text-gray-400 m-auto" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {enrollment.user.name || "Unnamed"}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {enrollment.user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-200 shrink-0">
                        {enrollment.course.thumbnail ? (
                          <Image
                            src={enrollment.course.thumbnail}
                            alt={enrollment.course.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <BookOpen className="h-5 w-5 text-gray-400 m-auto" />
                        )}
                      </div>
                      <span className="font-medium text-gray-900 line-clamp-1">
                        {enrollment.course.title}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    PKR {enrollment.course.fee.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    {getPaymentStatusBadge(enrollment.payments[0]?.status)}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(enrollment.status)}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(enrollment.enrolledAt).toLocaleDateString("en-PK", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <EnrollmentActions
                      enrollmentId={enrollment.id}
                      currentStatus={enrollment.status}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}