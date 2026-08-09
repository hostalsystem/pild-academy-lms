import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CourseLearningView } from "@/components/learning/course-learning-view";

interface PageProps {
  params: { slug: string };
}

async function getCourseLearningData(slug: string, userId: string) {
  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      lessons: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!course) return null;

  const enrollment = await prisma.enrollment.findFirst({
    where: {
      userId,
      courseId: course.id,
      status: "APPROVED",
    },
  });

  if (!enrollment) return null;

  const progress = await prisma.progress.findMany({
    where: { enrollmentId: enrollment.id },
  });

  const totalLessons = course.lessons.length;
  const completedLessons = progress.filter((p) => p.completed).length;
  const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return {
    course,
    enrollment,
    progress,
    totalLessons,
    completedLessons,
    progressPercent,
  };
}

export default async function CourseLearningPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const data = await getCourseLearningData(params.slug, session.user.id);

  if (!data) {
    notFound();
  }

  return (
    <div className="flex flex-col lg:flex-row">
      <CourseLearningView
        course={data.course}
        enrollment={data.enrollment}
        progress={data.progress}
        totalLessons={data.totalLessons}
        completedLessons={data.completedLessons}
        progressPercent={data.progressPercent}
      />
    </div>
  );
}