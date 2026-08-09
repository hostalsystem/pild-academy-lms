import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { AttendanceManager } from "@/components/admin/attendance-manager";

async function getCourses() {
  return await prisma.course.findMany({
    where: { published: true },
    select: { id: true, title: true, thumbnail: true },
    orderBy: { title: "asc" },
  });
}

export default async function AdminAttendancePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !["ADMIN", "INSTRUCTOR"].includes(session.user.role)) {
    redirect("/dashboard");
  }

  const courses = await getCourses();

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>
        <p className="text-gray-500 mt-1">
          Mark and manage student attendance for your courses.
        </p>
      </div>

      <AttendanceManager courses={courses} />
    </div>
  );
}