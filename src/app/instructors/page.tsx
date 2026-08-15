import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  ArrowRight,
  Briefcase,
  GraduationCap,
  User,
  Sparkles,
  Award,
  Users,
} from "lucide-react";

export default async function InstructorsPage() {
  const instructors = await prisma.instructor.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen overflow-hidden bg-[#050816] text-white">

      {/* =========================================================
          HERO SECTION
      ========================================================= */}
      <section className="relative isolate overflow-hidden border-b border-white/10">

        {/* Animated background */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#050816] via-[#0b1535] to-[#171047]" />

        {/* Large glowing circles */}
        <div className="absolute -left-32 top-10 -z-10 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl animate-pulse" />

        <div className="absolute -right-32 top-20 -z-10 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl animate-pulse" />

        <div className="absolute bottom-0 left-1/3 -z-10 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl animate-pulse" />

        {/* Decorative floating dots */}
        <div className="absolute left-[12%] top-[25%] h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_20px_rgba(96,165,250,0.9)] animate-pulse" />

        <div className="absolute right-[15%] top-[35%] h-3 w-3 rounded-full bg-purple-400 shadow-[0_0_25px_rgba(192,132,252,0.9)] animate-pulse" />

        <div className="absolute bottom-[20%] left-[20%] h-2 w-2 rounded-full bg-indigo-400 shadow-[0_0_20px_rgba(129,140,248,0.9)] animate-pulse" />

        {/* Hero content */}
        <div className="relative mx-auto max-w-7xl px-6 py-28 text-center sm:py-32 lg:py-36">

          {/* Badge */}
          <div className="mx-auto mb-7 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-5 py-2 text-sm font-semibold text-blue-300 shadow-lg shadow-blue-900/10 backdrop-blur-md transition duration-500 hover:scale-105 hover:border-blue-400/40 hover:bg-blue-500/15">

            <Sparkles className="h-4 w-4 animate-pulse" />

            <span className="tracking-wide">
              PILD ACADEMY
            </span>

          </div>

          {/* Main heading */}
          <h1 className="mx-auto max-w-5xl text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl">

            Meet Our

            <span className="mt-2 block bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Expert Instructors
            </span>

          </h1>

          {/* Description */}
          <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-gray-400 sm:text-lg">
            Learn from experienced professionals who are passionate about
            teaching, technology, and helping students build their future.
          </p>

          {/* Small stats */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">

            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-blue-400/30 hover:bg-white/[0.07]">
              <Users className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-gray-300">
                Professional Mentors
              </span>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-purple-400/30 hover:bg-white/[0.07]">
              <Award className="h-4 w-4 text-purple-400" />
              <span className="text-sm text-gray-300">
                Industry Experience
              </span>
            </div>

          </div>

        </div>

        {/* Bottom glow */}
        <div className="absolute bottom-0 left-1/2 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

      </section>


      {/* =========================================================
          INSTRUCTORS SECTION
      ========================================================= */}
      <section className="relative mx-auto max-w-7xl px-6 py-20 lg:py-24">

        {/* Section background glow */}
        <div className="pointer-events-none absolute left-1/4 top-20 -z-10 h-72 w-72 rounded-full bg-blue-600/5 blur-3xl" />

        <div className="pointer-events-none absolute right-1/4 bottom-20 -z-10 h-72 w-72 rounded-full bg-purple-600/5 blur-3xl" />


        {instructors.length === 0 ? (

          /* =====================================================
             EMPTY STATE
          ===================================================== */
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] px-6 py-20 text-center shadow-2xl shadow-black/20 backdrop-blur-xl">

            <div className="absolute left-1/2 top-0 h-32 w-64 -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />

            <div className="relative">

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] shadow-xl">
                <User className="h-10 w-10 text-gray-500" />
              </div>

              <h2 className="mt-7 text-2xl font-bold">
                No instructors available
              </h2>

              <p className="mx-auto mt-3 max-w-lg text-gray-400">
                Instructor profiles will appear here once they are added by
                the academy administration.
              </p>

            </div>

          </div>

        ) : (

          /* =====================================================
             INSTRUCTOR GRID
          ===================================================== */
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

            {instructors.map((instructor) => (

              <article
                key={instructor.id}
                className="
                  group relative overflow-hidden rounded-3xl
                  border border-white/10
                  bg-white/[0.035]
                  shadow-2xl shadow-black/20
                  backdrop-blur-xl
                  transition-all duration-500
                  hover:-translate-y-3
                  hover:border-blue-400/30
                  hover:bg-white/[0.06]
                  hover:shadow-blue-950/30
                "
              >

                {/* Animated card glow */}
                <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl transition duration-700 group-hover:bg-blue-500/20" />

                <div className="pointer-events-none absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-purple-500/10 blur-3xl transition duration-700 group-hover:bg-purple-500/20" />


                {/* =================================================
                    IMAGE
                ================================================= */}
                <div className="relative h-80 overflow-hidden bg-gradient-to-br from-blue-950/50 via-indigo-950/40 to-purple-950/50">

                  {instructor.image ? (

                    <Image
                      src={instructor.image}
                      alt={instructor.name}
                      fill
                      className="
                        object-cover
                        transition-all
                        duration-700
                        ease-out
                        group-hover:scale-110
                        group-hover:rotate-1
                      "
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />

                  ) : (

                    <div className="flex h-full items-center justify-center">

                      <div className="flex h-32 w-32 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
                        <User className="h-20 w-20 text-gray-600" />
                      </div>

                    </div>

                  )}


                  {/* Image dark gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050816] via-transparent to-transparent opacity-90" />

                  {/* Hover glow */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/0 via-transparent to-purple-500/0 transition duration-700 group-hover:from-blue-600/10 group-hover:to-purple-500/20" />

                  {/* Floating badge */}
                  <div className="absolute left-5 top-5">

                    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-xs font-semibold text-gray-200 backdrop-blur-xl transition duration-300 group-hover:border-blue-400/30 group-hover:bg-blue-950/40">

                      <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />

                      Instructor

                    </div>

                  </div>


                  {/* Name overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">

                    <h2 className="text-2xl font-black tracking-tight text-white transition duration-300 group-hover:text-blue-100">
                      {instructor.name}
                    </h2>

                    {instructor.designation && (
                      <p className="mt-1 text-sm font-semibold text-blue-300">
                        {instructor.designation}
                      </p>
                    )}

                  </div>

                </div>


                {/* =================================================
                    CARD CONTENT
                ================================================= */}
                <div className="relative p-6">


                  {/* Education */}
                  {instructor.education && (

                    <div className="mb-4 flex items-start gap-3 rounded-2xl border border-white/5 bg-white/[0.025] p-3.5 transition duration-300 hover:border-blue-400/20 hover:bg-blue-500/[0.04]">

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">

                        <GraduationCap className="h-5 w-5 text-blue-400" />

                      </div>

                      <div className="min-w-0">

                        <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                          Education
                        </p>

                        <p className="text-sm leading-5 text-gray-300">
                          {instructor.education}
                        </p>

                      </div>

                    </div>

                  )}


                  {/* Experience */}
                  {instructor.experience && (

                    <div className="mb-4 flex items-start gap-3 rounded-2xl border border-white/5 bg-white/[0.025] p-3.5 transition duration-300 hover:border-purple-400/20 hover:bg-purple-500/[0.04]">

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-500/10">

                        <Briefcase className="h-5 w-5 text-purple-400" />

                      </div>

                      <div className="min-w-0">

                        <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                          Experience
                        </p>

                        <p className="text-sm leading-5 text-gray-300">
                          {instructor.experience}
                        </p>

                      </div>

                    </div>

                  )}


                  {/* Bio */}
                  {instructor.bio && (

                    <div className="relative mt-5">

                      <p className="line-clamp-3 text-sm leading-7 text-gray-400">
                        {instructor.bio}
                      </p>

                    </div>

                  )}


                  {/* =================================================
                      VIEW PROFILE BUTTON
                  ================================================= */}
                  <div className="mt-7">

                    <Link
                      href={`/instructors/${instructor.id}`}
                      className="
                        group/button
                        relative
                        flex
                        w-full
                        items-center
                        justify-center
                        gap-2
                        overflow-hidden
                        rounded-2xl
                        bg-gradient-to-r
                        from-blue-600
                        via-indigo-600
                        to-purple-600
                        px-5
                        py-3.5
                        font-semibold
                        text-white
                        shadow-lg
                        shadow-blue-950/30
                        transition-all
                        duration-300
                        hover:-translate-y-1
                        hover:shadow-xl
                        hover:shadow-indigo-950/40
                      "
                    >

                      {/* Button shine */}
                      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover/button:translate-x-full" />

                      <span className="relative">
                        View Instructor Profile
                      </span>

                      <ArrowRight className="relative h-4 w-4 transition-transform duration-300 group-hover/button:translate-x-1" />

                    </Link>

                  </div>


                  {/* Bottom line */}
                  <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                </div>

              </article>

            ))}

          </div>

        )}

      </section>


      {/* =========================================================
          BOTTOM CTA
      ========================================================= */}
      {instructors.length > 0 && (
        <section className="relative mx-auto max-w-5xl px-6 pb-24">

          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-blue-600/10 via-indigo-600/10 to-purple-600/10 px-8 py-14 text-center shadow-2xl shadow-black/20 backdrop-blur-xl">

            {/* Glow */}
            <div className="absolute left-1/2 top-0 h-40 w-80 -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />

            <div className="relative">

              <Sparkles className="mx-auto h-8 w-8 text-blue-400 animate-pulse" />

              <h2 className="mt-5 text-3xl font-bold">
                Learn From The Best
              </h2>

              <p className="mx-auto mt-3 max-w-xl text-gray-400">
                Explore our instructor profiles and discover the people
                helping students at PILD Academy build real skills for the
                future.
              </p>

            </div>

          </div>

        </section>
      )}

    </main>
  );
}