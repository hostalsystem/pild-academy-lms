import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Star,
  Eye,
  EyeOff,
  Trash2,
  Users,
  FileText,
  DollarSign,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CourseForm } from "@/components/admin/course-form";

async function getAdminCourses() {
  return await prisma.course.findMany({
    include: {
      _count: {
        select: { enrollments: true, lessons: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export default async function AdminCoursesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const courses = await getAdminCourses();

  const totalCourses = courses.length;
  const publishedCount = courses.filter((c) => c.published).length;
  const featuredCount = courses.filter((c) => c.featured).length;
  const totalRevenue = courses.reduce((sum, c) => sum + c.fee * c._count.enrollments, 0);

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Courses</h1>
          <p className="text-gray-500 mt-1">
            Manage all academy courses.
          </p>
        </div>
        <CourseForm />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Total Courses</p>
              <p className="text-2xl font-bold">{totalCourses}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Published</p>
              <p className="text-2xl font-bold text-green-600">{publishedCount}</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <Eye className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Featured</p>
              <p className="text-2xl font-bold text-pild-secondary">{featuredCount}</p>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Est. Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                PKR {totalRevenue.toLocaleString()}
              </p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Courses Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50/50">
                <th className="text-left px-6 py-3 font-medium text-gray-500">
                  Course
                </th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">
                  Slug
                </th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">
                  Fee
                </th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">
                  Students
                </th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">
                  Lessons
                </th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">
                  Status
                </th>
                <th className="text-right px-6 py-3 font-medium text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr
                  key={course.id}
                  className="border-b last:border-0 hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-200 shrink-0">
                        {course.thumbnail ? (
                          <Image
                            src={course.thumbnail}
                            alt={course.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <BookOpen className="h-6 w-6 text-gray-400 m-auto" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {course.title}
                        </p>
                        {course.featured && (
                          <Badge className="bg-yellow-100 text-yellow-700 text-[10px] hover:bg-yellow-100 mt-0.5">
                            <Star className="h-2.5 w-2.5 mr-0.5" />
                            Featured
                          </Badge>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-mono text-xs">
                    {course.slug}
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    PKR {course.fee.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <Users className="h-3.5 w-3.5" />
                      {course._count.enrollments}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <FileText className="h-3.5 w-3.5" />
                      {course._count.lessons}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1.5">
                      {course.published ? (
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 gap-1">
                          <Eye className="h-3 w-3" /> Live
                        </Badge>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="bg-gray-100 text-gray-600 hover:bg-gray-100 gap-1"
                        >
                          <EyeOff className="h-3 w-3" /> Draft
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <CourseForm existingCourse={course as any} />
                      <form
                        action={async () => {
                          "use server";
                          await prisma.course.delete({ where: { id: course.id } });
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
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}