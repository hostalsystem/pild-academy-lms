import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { FeaturedCourseGrid } from "./featured-course-grid";

async function getFeaturedCourses() {
  noStore();

  return await prisma.course.findMany({
    where: {
      featured: true,
      published: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 6,
  });
}

export async function FeaturedCourses() {
  const courses = await getFeaturedCourses();

  return (
    <section className="relative overflow-hidden bg-white py-20 lg:py-28">

      {/* Decorative background glow */}
      <div className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-cyan-100/50 blur-[100px]" />

      <div className="pointer-events-none absolute -right-40 bottom-20 h-80 w-80 rounded-full bg-purple-100/50 blur-[100px]" />

      <div className="container relative z-10 mx-auto px-5 sm:px-6 lg:px-8">

        {/* Section heading */}
        <div className="mb-14 flex flex-col gap-8 lg:mb-16 lg:flex-row lg:items-end lg:justify-between">

          <div>

            {/* Small heading */}
            <div className="mb-5 flex items-center gap-4">

              <div className="h-[2px] w-14 bg-gradient-to-r from-cyan-500 to-blue-600" />

              <span className="text-sm font-bold uppercase tracking-[5px] text-cyan-600">
                Featured Courses
              </span>

            </div>

            {/* Main heading */}
            <h2 className="text-4xl font-black leading-tight text-gray-900 sm:text-5xl lg:text-6xl">

              Learn Skills

              <br />

              <span className="bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                That Build Careers
              </span>

            </h2>

            {/* Description */}
            <p className="mt-6 max-w-2xl text-base leading-8 text-gray-600 sm:text-lg">
              Discover our most popular professional courses designed to
              develop practical skills, strengthen your career and prepare
              you for the modern digital world.
            </p>

          </div>

          {/* View all button */}
          <Link href="/courses">

            <Button
              size="lg"
              className="group rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-7 py-6 font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              View All Courses

              <ArrowRight className="ml-3 h-5 w-5 transition-transform duration-300 group-hover:translate-x-2" />
            </Button>

          </Link>

        </div>

        {/* Courses */}
        {courses.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-300 bg-gray-50 py-20 text-center">

            <p className="text-lg font-medium text-gray-500">
              No featured courses available yet.
            </p>

            <Link href="/courses" className="mt-5 inline-block">
              <Button variant="outline">
                Browse All Courses
              </Button>
            </Link>

          </div>
        ) : (
          <FeaturedCourseGrid courses={courses} />
        )}

      </div>

    </section>
  );
}