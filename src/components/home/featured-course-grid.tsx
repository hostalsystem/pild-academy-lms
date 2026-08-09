"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Clock,
  Star,
} from "lucide-react";

type Course = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  thumbnail: string | null;
  duration: string | null;
  fee: number | string;
};

interface FeaturedCourseGridProps {
  courses: Course[];
}

export function FeaturedCourseGrid({
  courses,
}: FeaturedCourseGridProps) {
  return (
    <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {courses.map((course, index) => (
        <motion.div
          key={course.id}
          initial={{
            opacity: 0,
            y: 40,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.15,
          }}
          transition={{
            duration: 0.6,
            delay: index * 0.08,
          }}
        >
          <Link
            href={`/courses/${course.slug}`}
            className="group block h-full"
          >
            <article className="relative h-full overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)] transition-all duration-500 hover:-translate-y-3 hover:border-cyan-300 hover:shadow-[0_25px_60px_rgba(15,23,42,0.14)]">

              {/* Course image */}
              <div className="relative h-52 overflow-hidden bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600">

                {course.thumbnail ? (
                  <Image
                    src={course.thumbnail}
                    alt={course.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <BookOpen className="h-16 w-16 text-white/80" />
                  </div>
                )}

                {/* Image overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                {/* Featured badge */}
                <div className="absolute right-4 top-4">
                  <span className="rounded-full bg-yellow-400 px-3 py-1.5 text-xs font-bold text-gray-900 shadow-lg">
                    Featured
                  </span>
                </div>

                {/* Bottom category */}
                <div className="absolute bottom-4 left-4">
                  <span className="rounded-full border border-white/30 bg-white/15 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
                    Professional Course
                  </span>
                </div>

              </div>

              {/* Content */}
              <div className="flex h-[280px] flex-col p-6">

                {/* Course title */}
                <h3 className="line-clamp-2 text-xl font-black leading-snug text-gray-900 transition-colors duration-300 group-hover:text-blue-600">
                  {course.title}
                </h3>

                {/* Description */}
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-500">
                  {course.description ||
                    "Learn practical skills through expert instruction and hands-on learning."}
                </p>

                {/* Course information */}
                <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4 text-sm text-gray-500">

                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-cyan-500" />

                    <span>
                      {course.duration || "Self-paced"}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />

                    <span>
                      4.8
                    </span>
                  </div>

                </div>

                {/* Bottom row */}
                <div className="mt-auto flex items-center justify-between pt-5">

                  <div>
                    <p className="text-xs font-medium text-gray-400">
                      Course Fee
                    </p>

                    <p className="mt-1 text-xl font-black text-blue-600">
                      PKR{" "}
                      {Number(course.fee).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-blue-600 transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white">
                    <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>

                </div>

              </div>

            </article>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}