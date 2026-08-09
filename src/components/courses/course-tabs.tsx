"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import {
  BookOpen,
  Target,
  Lightbulb,
  ListChecks,
  MessageSquare,
  CheckCircle2,
  Lock,
  PlayCircle,
  UserRound,
} from "lucide-react";

import { motion } from "framer-motion";

interface CourseTabsProps {
  course: {
    objectives: string[];
    skills: string[];
    requirements: string[];
    syllabus: any;
    outcomes: string[];
    lessons: {
      id: string;
      title: string;
      duration: number;
      isPreview: boolean;
    }[];
  };
}

export function CourseTabs({ course }: CourseTabsProps) {
  return (
    <Tabs defaultValue="overview" className="w-full">

      {/* ================= TAB NAVIGATION ================= */}

      <div className="mb-8 overflow-x-auto">
        <TabsList className="inline-flex h-auto min-w-full justify-start gap-1 rounded-2xl border border-gray-200 bg-gray-100/80 p-1.5 sm:min-w-0">

          <TabsTrigger
            value="overview"
            className="gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-gray-500 transition-all duration-300 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-md"
          >
            <Target className="h-4 w-4" />
            Overview
          </TabsTrigger>

          <TabsTrigger
            value="syllabus"
            className="gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-gray-500 transition-all duration-300 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-md"
          >
            <BookOpen className="h-4 w-4" />
            Syllabus
          </TabsTrigger>

          <TabsTrigger
            value="instructor"
            className="gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-gray-500 transition-all duration-300 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-md"
          >
            <UserRound className="h-4 w-4" />
            Instructor
          </TabsTrigger>

          <TabsTrigger
            value="reviews"
            className="gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-gray-500 transition-all duration-300 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-md"
          >
            <MessageSquare className="h-4 w-4" />
            Reviews
          </TabsTrigger>

        </TabsList>
      </div>

      {/* ================= OVERVIEW ================= */}

      <TabsContent value="overview" className="mt-0 space-y-10">

        {/* Objectives */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <SectionHeader
            icon={Target}
            title="Course Objectives"
            description="What you will accomplish throughout this course."
          />

          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">

            {course.objectives.map((obj, i) => (
              <div
                key={i}
                className="group rounded-2xl border border-gray-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300 hover:shadow-lg"
              >
                <div className="flex items-start gap-4">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 transition-all duration-300 group-hover:bg-cyan-500 group-hover:text-white">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>

                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      Objective {i + 1}
                    </span>

                    <p className="mt-1 text-sm leading-6 text-gray-600">
                      {obj}
                    </p>
                  </div>

                </div>
              </div>
            ))}

          </div>
        </motion.div>

        {/* Skills */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <SectionHeader
            icon={Lightbulb}
            title="Skills You Will Learn"
            description="Practical skills you will develop during the course."
          />

          <div className="mt-5 flex flex-wrap gap-3">

            {course.skills.map((skill, i) => (
              <span
                key={i}
                className="rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 to-cyan-50 px-4 py-2.5 text-sm font-semibold text-blue-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
              >
                {skill}
              </span>
            ))}

          </div>
        </motion.div>

        {/* Requirements */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <SectionHeader
            icon={BookOpen}
            title="Requirements"
            description="What you need before starting this course."
          />

          <div className="mt-5 rounded-2xl border border-gray-200 bg-gray-50 p-5">

            <ul className="space-y-3">

              {course.requirements.map((req, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-sm leading-6 text-gray-600"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                  <span>{req}</span>
                </li>
              ))}

            </ul>

          </div>
        </motion.div>

        {/* Learning Outcomes */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <SectionHeader
            icon={Target}
            title="Learning Outcomes"
            description="What you will be able to do after completing the course."
          />

          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">

            {course.outcomes.map((out, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-xl border border-gray-100 bg-white p-4 transition-all duration-300 hover:border-green-200 hover:bg-green-50/30"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />

                <span className="text-sm leading-6 text-gray-600">
                  {out}
                </span>
              </div>
            ))}

          </div>
        </motion.div>

      </TabsContent>

      {/* ================= SYLLABUS ================= */}

      <TabsContent value="syllabus" className="mt-0">

        <div className="mb-7">

          <SectionHeader
            icon={BookOpen}
            title="Course Syllabus"
            description="Explore the lessons included in this course."
          />

        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

          <Accordion
            type="single"
            collapsible
            className="w-full"
          >

            {course.lessons.map((lesson, i) => (
              <AccordionItem
                key={lesson.id}
                value={lesson.id}
                className="border-b border-gray-100 px-5 last:border-b-0 sm:px-6"
              >

                <AccordionTrigger className="py-5 hover:no-underline">

                  <div className="flex min-w-0 items-center gap-4 text-left">

                    {/* Lesson number */}

                    <div
                      className={`
                        flex h-11 w-11 shrink-0 items-center
                        justify-center rounded-xl text-sm font-bold
                        ${
                          lesson.isPreview
                            ? "bg-cyan-50 text-cyan-600"
                            : "bg-gray-100 text-gray-500"
                        }
                      `}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </div>

                    {/* Lesson information */}

                    <div className="min-w-0">

                      <p className="truncate pr-3 text-sm font-semibold text-gray-800 sm:text-base">
                        {lesson.title}
                      </p>

                      <div className="mt-1 flex items-center gap-3">

                        <span className="text-xs text-gray-400">
                          {lesson.duration} min
                        </span>

                        {lesson.isPreview ? (
                          <span className="flex items-center gap-1 text-xs font-medium text-cyan-600">
                            <PlayCircle className="h-3.5 w-3.5" />
                            Preview
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs text-gray-400">
                            <Lock className="h-3.5 w-3.5" />
                            Locked
                          </span>
                        )}

                      </div>

                    </div>

                  </div>

                </AccordionTrigger>

                <AccordionContent className="pb-5 pl-[60px]">

                  {lesson.isPreview ? (
                    <div className="flex items-center gap-3 rounded-xl bg-cyan-50 p-4 text-sm text-cyan-700">
                      <PlayCircle className="h-5 w-5 shrink-0" />
                      <span>
                        Preview available. You can watch this lesson before
                        enrolling.
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-4 text-sm text-gray-500">
                      <Lock className="h-5 w-5 shrink-0" />
                      <span>
                        This lesson is locked. Enroll in the course to access
                        the complete lesson.
                      </span>
                    </div>
                  )}

                </AccordionContent>

              </AccordionItem>
            ))}

          </Accordion>

        </div>

      </TabsContent>

      {/* ================= INSTRUCTOR ================= */}

      <TabsContent value="instructor" className="mt-0">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm"
        >

          <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-slate-900 p-7 text-white sm:p-10">

            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">

              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg shadow-blue-500/20">
                <UserRound className="h-9 w-9 text-white" />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[3px] text-cyan-400">
                  Course Instructor
                </p>

                <h3 className="mt-2 text-2xl font-black">
                  About the Instructor
                </h3>

                <p className="mt-2 text-sm text-gray-300">
                  Learn from experienced instructors and industry
                  professionals.
                </p>
              </div>

            </div>

          </div>

          <div className="p-7 sm:p-10">

            <p className="leading-7 text-gray-600">
              Instructor details will be displayed here.
            </p>

          </div>

        </motion.div>

      </TabsContent>

      {/* ================= REVIEWS ================= */}

      <TabsContent value="reviews" className="mt-0">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm"
        >

          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-7 text-white sm:p-10">

            <div className="flex items-center gap-4">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
                <MessageSquare className="h-7 w-7" />
              </div>

              <div>

                <p className="text-xs font-bold uppercase tracking-[3px] text-blue-100">
                  Student Feedback
                </p>

                <h3 className="mt-1 text-2xl font-black">
                  Student Reviews
                </h3>

              </div>

            </div>

          </div>

          <div className="p-7 sm:p-10">

            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center">

              <MessageSquare className="mx-auto h-10 w-10 text-gray-300" />

              <p className="mt-4 text-sm font-medium text-gray-500">
                Reviews will appear here once students complete the course.
              </p>

            </div>

          </div>

        </motion.div>

      </TabsContent>

    </Tabs>
  );
}


/* ========================================================= */
/* SECTION HEADER                                             */
/* ========================================================= */

function SectionHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4">

      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-50 to-blue-100 text-blue-600">
        <Icon className="h-5 w-5" />
      </div>

      <div>

        <h3 className="text-xl font-black text-gray-900 sm:text-2xl">
          {title}
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          {description}
        </p>

      </div>

    </div>
  );
}