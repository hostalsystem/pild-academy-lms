import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { EnrollmentPanel } from "@/components/courses/enrollment-panel";
import { CourseTabs } from "@/components/courses/course-tabs";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Star } from "lucide-react";
import Image from "next/image";

export default async function CourseDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const course = await prisma.course.findUnique({
    where: { slug: params.slug },
  });

  if (!course) return notFound();

  // Get lesson count separately
  const lessonCount = await prisma.lesson.count({
    where: { courseId: course.id },
  });

  // Get enrollment count
  const enrollmentCount = await prisma.enrollment.count({
    where: {
      courseId: course.id,
      status: "APPROVED",
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ===================================================== */}
      {/* COURSE HERO */}
      {/* ===================================================== */}

      <div className="bg-gradient-to-r from-pild-dark to-pild-primary text-white">
        <div className="container mx-auto px-4 py-12 md:py-16">

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

            {/* Hero Content */}
            <div className="space-y-4 lg:col-span-2">

              <Badge className="bg-pild-secondary text-black hover:bg-pild-secondary">
                {enrollmentCount} students enrolled
              </Badge>

              <h1 className="text-3xl font-bold md:text-4xl">
                {course.title}
              </h1>

              <p className="text-lg text-blue-100">
                {course.description}
              </p>

              <div className="flex flex-wrap gap-4 text-sm text-blue-200">

                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {course.duration}
                </span>

                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {enrollmentCount} students
                </span>

                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400" />
                  4.8 Rating
                </span>

              </div>
            </div>

            {/* Empty desktop column */}
            <div className="hidden lg:block" />

          </div>
        </div>
      </div>


      {/* ===================================================== */}
      {/* COURSE CONTENT */}
      {/* ===================================================== */}

      <div className="container mx-auto px-4 py-8">

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">


          {/* ================================================= */}
          {/* THUMBNAIL */}
          {/* ================================================= */}

          <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1">

            <div className="relative aspect-video overflow-hidden rounded-xl bg-gray-200 shadow-sm">

              {course.thumbnail ? (
                <Image
                  src={course.thumbnail}
                  alt={course.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-400">
                  <span className="text-6xl">📚</span>
                </div>
              )}

            </div>

          </div>


          {/* ================================================= */}
          {/* ENROLLMENT PANEL */}
          {/* ================================================= */}

          <div
            className="
              lg:col-span-1
              lg:col-start-3
              lg:row-start-1
              lg:row-span-2
            "
          >

            <div className="lg:sticky lg:top-24">

              <EnrollmentPanel
                course={{
                  id: course.id,
                  fee: course.fee,
                  duration: course.duration,
                  lessons: Array(lessonCount).fill({
                    id: "x",
                  }),
                  objectives:
                    (course.objectives as string[]) || [],
                  skills:
                    (course.skills as string[]) || [],
                }}
              />

            </div>

          </div>


          {/* ================================================= */}
          {/* COURSE TABS */}
          {/* ================================================= */}

          <div
            className="
              lg:col-span-2
              lg:col-start-1
              lg:row-start-2
            "
          >

            <CourseTabs
              course={{
                ...course,

                lessons: [],

                objectives:
                  (course.objectives as string[]) || [],

                skills:
                  (course.skills as string[]) || [],

                requirements:
                  (course.requirements as string[]) || [],

                outcomes:
                  (course.outcomes as string[]) || [],
              }}
            />

          </div>

        </div>

      </div>

    </div>
  );
}