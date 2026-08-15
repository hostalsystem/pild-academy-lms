import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CourseLessonManager } from "@/components/admin/course-form";

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function AdminCoursePage({
  params,
}: PageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const course = await prisma.course.findUnique({
    where: {
      slug: params.slug,
    },
    include: {
      lessons: {
        orderBy: {
          order: "asc",
        },
      },
    },
  });

  if (!course) {
    notFound();
  }

  return (
    <div className="p-6 lg:p-8">
      <CourseLessonManager
        courseId={course.id}
        courseTitle={course.title}
        initialLessons={course.lessons}
      />
    </div>
  );
}