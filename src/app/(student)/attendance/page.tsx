import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  BookOpen,
  TrendingUp,
  CalendarDays,
} from "lucide-react";
import Image from "next/image";

async function getAttendanceData(userId: string) {
  const attendances = await prisma.attendance.findMany({
    where: { userId },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          slug: true,
          thumbnail: true,
        },
      },
    },
    orderBy: { date: "desc" },
  });

  const enrollments = await prisma.enrollment.findMany({
    where: { userId, status: "APPROVED" },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          slug: true,
          thumbnail: true,
        },
      },
    },
  });

  return { attendances, enrollments };
}

export default async function AttendancePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const { attendances, enrollments } = await getAttendanceData(session.user.id);

  // Overall stats
  const totalRecords = attendances.length;
  const presentCount = attendances.filter((a) => a.status === "PRESENT").length;
  const absentCount = attendances.filter((a) => a.status === "ABSENT").length;
  const lateCount = attendances.filter((a) => a.status === "LATE").length;
  const overallPercentage =
    totalRecords > 0 ? Math.round((presentCount / totalRecords) * 100) : 0;

  // Course-wise stats
  const courseStats = enrollments.map((enrollment) => {
    const courseAttendances = attendances.filter(
      (a) => a.courseId === enrollment.courseId
    );
    const total = courseAttendances.length;
    const present = courseAttendances.filter((a) => a.status === "PRESENT").length;
    const absent = courseAttendances.filter((a) => a.status === "ABSENT").length;
    const late = courseAttendances.filter((a) => a.status === "LATE").length;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

    return {
      ...enrollment.course,
      total,
      present,
      absent,
      late,
      percentage,
    };
  });

  // Monthly breakdown
  const monthlyMap = attendances.reduce((acc, record) => {
    const key = new Date(record.date).toLocaleDateString("en-PK", {
      year: "numeric",
      month: "long",
    });
    if (!acc[key]) acc[key] = { present: 0, absent: 0, late: 0, total: 0 };
    acc[key].total++;
    if (record.status === "PRESENT") acc[key].present++;
    else if (record.status === "ABSENT") acc[key].absent++;
    else if (record.status === "LATE") acc[key].late++;
    return acc;
  }, {} as Record<string, { present: number; absent: number; late: number; total: number }>);

  const monthlyData = Object.entries(monthlyMap).map(([month, stats]) => ({
    month,
    ...stats,
    percentage: stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0,
  }));

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PRESENT":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 gap-1">
            <CheckCircle className="h-3 w-3" /> Present
          </Badge>
        );
      case "ABSENT":
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-100 gap-1">
            <XCircle className="h-3 w-3" /> Absent
          </Badge>
        );
      case "LATE":
        return (
          <Badge
            variant="secondary"
            className="bg-orange-100 text-orange-700 hover:bg-orange-100 gap-1"
          >
            <Clock className="h-3 w-3" /> Late
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>
        <p className="text-gray-500 mt-1">
          Track your class attendance across all enrolled courses.
        </p>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Attendance %</p>
              <p className="text-2xl font-bold text-gray-900">
                {overallPercentage}%
              </p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Present</p>
              <p className="text-2xl font-bold text-green-600">{presentCount}</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Absent</p>
              <p className="text-2xl font-bold text-red-600">{absentCount}</p>
            </div>
            <div className="bg-red-50 p-3 rounded-lg">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Late</p>
              <p className="text-2xl font-bold text-orange-600">{lateCount}</p>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course-wise Attendance */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-pild-primary" />
          Course-wise Attendance
        </h2>

        {courseStats.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No enrolled courses found.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courseStats.map((course) => (
              <Card key={course.id} className="overflow-hidden">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-200 shrink-0">
                      {course.thumbnail ? (
                        <Image
                          src={course.thumbnail}
                          alt={course.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <BookOpen className="h-8 w-8 text-gray-400 m-auto" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 line-clamp-1 mb-2">
                        {course.title}
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>
                            {course.present} of {course.total} present
                          </span>
                          <span className="font-medium text-pild-primary">
                            {course.percentage}%
                          </span>
                        </div>
                        <Progress value={course.percentage} className="h-2" />
                        <div className="flex gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1 text-green-600">
                            <CheckCircle className="h-3 w-3" /> {course.present}
                          </span>
                          <span className="flex items-center gap-1 text-red-600">
                            <XCircle className="h-3 w-3" /> {course.absent}
                          </span>
                          <span className="flex items-center gap-1 text-orange-600">
                            <Clock className="h-3 w-3" /> {course.late}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Separator />

      {/* Monthly Report */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-pild-primary" />
          Monthly Report
        </h2>

        {monthlyData.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No attendance records available yet.</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50/50">
                    <th className="text-left px-6 py-3 font-medium text-gray-500">
                      Month
                    </th>
                    <th className="text-left px-6 py-3 font-medium text-gray-500">
                      Present
                    </th>
                    <th className="text-left px-6 py-3 font-medium text-gray-500">
                      Absent
                    </th>
                    <th className="text-left px-6 py-3 font-medium text-gray-500">
                      Late
                    </th>
                    <th className="text-left px-6 py-3 font-medium text-gray-500">
                      Total
                    </th>
                    <th className="text-left px-6 py-3 font-medium text-gray-500">
                      %
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyData.map((month) => (
                    <tr
                      key={month.month}
                      className="border-b last:border-0 hover:bg-gray-50/50"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {month.month}
                      </td>
                      <td className="px-6 py-4 text-green-600 font-medium">
                        {month.present}
                      </td>
                      <td className="px-6 py-4 text-red-600 font-medium">
                        {month.absent}
                      </td>
                      <td className="px-6 py-4 text-orange-600 font-medium">
                        {month.late}
                      </td>
                      <td className="px-6 py-4 text-gray-900 font-semibold">
                        {month.total}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Progress
                            value={month.percentage}
                            className="h-1.5 w-20"
                          />
                          <span className="text-xs font-medium text-gray-600">
                            {month.percentage}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>

      <Separator />

      {/* Recent Records */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-pild-primary" />
          Recent Records
        </h2>

        {attendances.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">
                No attendance records found. Records will appear here once your
                instructor marks attendance.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50/50">
                    <th className="text-left px-6 py-3 font-medium text-gray-500">
                      Date
                    </th>
                    <th className="text-left px-6 py-3 font-medium text-gray-500">
                      Course
                    </th>
                    <th className="text-left px-6 py-3 font-medium text-gray-500">
                      Status
                    </th>
                    <th className="text-left px-6 py-3 font-medium text-gray-500">
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {attendances.slice(0, 20).map((record) => (
                    <tr
                      key={record.id}
                      className="border-b last:border-0 hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 text-gray-900">
                        {new Date(record.date).toLocaleDateString("en-PK", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {record.course.title}
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(record.status)}</td>
                      <td className="px-6 py-4 text-gray-500">
                        {record.notes || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}