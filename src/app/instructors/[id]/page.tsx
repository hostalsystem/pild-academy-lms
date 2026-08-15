import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  ExternalLink,
  ArrowLeft,
  Sparkles,
  Globe,
  Award,
} from "lucide-react";
import Link from "next/link";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function InstructorProfilePage({
  params,
}: PageProps) {
  const { id } = await params;

  const instructor = await prisma.instructor.findUnique({
    where: {
      id,
    },
  });

  if (!instructor) {
    notFound();
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#f8fafc] text-gray-900">

      {/* =========================================================
          HERO SECTION
      ========================================================= */}
      <section className="relative isolate overflow-hidden bg-[#070b1d] text-white">

        {/* Main gradient */}
        <div className="absolute inset-0 -z-20 bg-gradient-to-br from-[#07102d] via-[#172554] to-[#3b0764]" />

        {/* Animated glow 1 */}
        <div className="absolute -left-40 top-0 -z-10 h-[500px] w-[500px] rounded-full bg-blue-600/20 blur-[120px] animate-pulse" />

        {/* Animated glow 2 */}
        <div className="absolute -right-40 top-10 -z-10 h-[500px] w-[500px] rounded-full bg-purple-600/20 blur-[120px] animate-pulse" />

        {/* Bottom glow */}
        <div className="absolute bottom-[-200px] left-1/2 -z-10 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-indigo-500/20 blur-[120px]" />

        {/* Decorative dots */}
        <div className="absolute left-[10%] top-[25%] h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_20px_rgba(96,165,250,1)] animate-pulse" />

        <div className="absolute right-[15%] top-[30%] h-3 w-3 rounded-full bg-purple-400 shadow-[0_0_25px_rgba(192,132,252,1)] animate-pulse" />

        <div className="absolute bottom-[20%] left-[20%] h-2 w-2 rounded-full bg-indigo-400 shadow-[0_0_20px_rgba(129,140,248,1)] animate-pulse" />


        <div className="relative mx-auto max-w-6xl px-6 py-14 sm:py-20 lg:py-24">

          {/* Back button */}
          <Link
            href="/instructors"
            className="
              group
              mb-12
              inline-flex
              items-center
              gap-2
              rounded-xl
              border
              border-white/10
              bg-white/[0.06]
              px-4
              py-2.5
              text-sm
              font-medium
              text-gray-200
              backdrop-blur-xl
              transition-all
              duration-300
              hover:-translate-x-1
              hover:border-blue-400/30
              hover:bg-white/10
            "
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />

            Back to Instructors
          </Link>


          {/* Profile */}
          <div className="flex flex-col items-center gap-10 md:flex-row md:items-center">

            {/* =====================================================
                PROFILE IMAGE
            ===================================================== */}
            <div className="relative shrink-0">

              {/* Outer glow */}
              <div className="absolute inset-[-15px] rounded-full bg-blue-500/20 blur-2xl transition duration-700 hover:bg-purple-500/30" />

              {/* Animated border */}
              <div className="relative rounded-full bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-500 p-[4px] shadow-2xl shadow-blue-950/50">

                <div className="flex h-44 w-44 items-center justify-center overflow-hidden rounded-full border-4 border-[#101735] bg-[#101735] sm:h-52 sm:w-52">

                  {instructor.image ? (
                    <img
                      src={instructor.image}
                      alt={instructor.name}
                      className="
                        h-full
                        w-full
                        object-cover
                        transition-all
                        duration-700
                        hover:scale-110
                      "
                    />
                  ) : (
                    <User className="h-24 w-24 text-white/50" />
                  )}

                </div>

              </div>

              {/* Online indicator */}
              <div className="absolute bottom-4 right-5 flex h-7 w-7 items-center justify-center rounded-full border-4 border-[#101735] bg-emerald-500 shadow-[0_0_15px_rgba(34,197,94,0.7)]">
                <span className="h-2 w-2 rounded-full bg-white" />
              </div>

            </div>


            {/* =====================================================
                BASIC INFORMATION
            ===================================================== */}
            <div className="flex-1 text-center md:text-left">

              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-blue-300 backdrop-blur-md">

                <Sparkles className="h-3.5 w-3.5" />

                PILD Academy Instructor

              </div>


              <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">

                {instructor.name}

              </h1>


              {instructor.designation && (
                <p className="mt-4 text-xl font-medium text-blue-200 sm:text-2xl">
                  {instructor.designation}
                </p>
              )}


              {/* Buttons */}
              <div className="mt-7 flex flex-wrap justify-center gap-3 md:justify-start">

                {instructor.email && (
                  <a
                    href={`mailto:${instructor.email}`}
                    className="
                      group
                      inline-flex
                      items-center
                      gap-2
                      rounded-xl
                      border
                      border-white/10
                      bg-white/[0.07]
                      px-5
                      py-3
                      text-sm
                      font-semibold
                      text-white
                      backdrop-blur-xl
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:border-blue-400/30
                      hover:bg-white/10
                    "
                  >
                    <Mail className="h-4 w-4 text-blue-300" />

                    Email

                  </a>
                )}


                {instructor.phone && (
                  <a
                    href={`tel:${instructor.phone}`}
                    className="
                      group
                      inline-flex
                      items-center
                      gap-2
                      rounded-xl
                      border
                      border-white/10
                      bg-white/[0.07]
                      px-5
                      py-3
                      text-sm
                      font-semibold
                      text-white
                      backdrop-blur-xl
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:border-purple-400/30
                      hover:bg-white/10
                    "
                  >
                    <Phone className="h-4 w-4 text-purple-300" />

                    Contact

                  </a>
                )}


                {instructor.portfolioUrl && (
                  <a
                    href={instructor.portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      group
                      relative
                      inline-flex
                      items-center
                      gap-2
                      overflow-hidden
                      rounded-xl
                      bg-gradient-to-r
                      from-blue-500
                      via-indigo-500
                      to-purple-600
                      px-5
                      py-3
                      text-sm
                      font-bold
                      text-white
                      shadow-lg
                      shadow-indigo-950/40
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:shadow-xl
                      hover:shadow-purple-950/50
                    "
                  >

                    {/* Shine */}
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                    <Globe className="relative h-4 w-4" />

                    <span className="relative">
                      Visit Portfolio
                    </span>

                    <ExternalLink className="relative h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />

                  </a>
                )}

              </div>

            </div>

          </div>

        </div>

        {/* Bottom line */}
        <div className="absolute bottom-0 left-1/2 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />

      </section>


      {/* =========================================================
          CONTENT SECTION
      ========================================================= */}
      <section className="relative mx-auto max-w-6xl px-6 py-14 lg:py-20">

        {/* Background glows */}
        <div className="pointer-events-none absolute left-0 top-20 -z-10 h-72 w-72 rounded-full bg-blue-500/5 blur-3xl" />

        <div className="pointer-events-none absolute right-0 bottom-20 -z-10 h-72 w-72 rounded-full bg-purple-500/5 blur-3xl" />


        <div className="grid gap-8 lg:grid-cols-3">


          {/* =====================================================
              MAIN INFORMATION
          ===================================================== */}
          <div className="space-y-8 lg:col-span-2">


            {/* ===================================================
                ABOUT
            =================================================== */}
            {instructor.bio && (
              <div
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-3xl
                  border
                  border-gray-200/80
                  bg-white
                  p-8
                  shadow-xl
                  shadow-gray-200/40
                  transition-all
                  duration-500
                  hover:-translate-y-1
                  hover:shadow-2xl
                  hover:shadow-blue-100
                "
              >

                {/* Hover glow */}
                <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-blue-500/5 blur-3xl transition duration-500 group-hover:bg-blue-500/10" />

                <div className="relative">

                  <div className="mb-6 flex items-center gap-4">

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition duration-300 group-hover:scale-110 group-hover:bg-blue-100">

                      <User className="h-6 w-6" />

                    </div>

                    <div>

                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-500">
                        Profile
                      </p>

                      <h2 className="mt-1 text-2xl font-black text-gray-900">
                        About the Instructor
                      </h2>

                    </div>

                  </div>

                  <p className="whitespace-pre-line text-base leading-8 text-gray-600">
                    {instructor.bio}
                  </p>

                </div>

              </div>
            )}


            {/* ===================================================
                EDUCATION
            =================================================== */}
            {instructor.education && (
              <div
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-3xl
                  border
                  border-gray-200/80
                  bg-white
                  p-8
                  shadow-xl
                  shadow-gray-200/40
                  transition-all
                  duration-500
                  hover:-translate-y-1
                  hover:shadow-2xl
                  hover:shadow-indigo-100
                "
              >

                <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-indigo-500/5 blur-3xl transition duration-500 group-hover:bg-indigo-500/10" />

                <div className="relative">

                  <div className="mb-6 flex items-center gap-4">

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 transition duration-300 group-hover:scale-110 group-hover:bg-indigo-100">

                      <GraduationCap className="h-6 w-6" />

                    </div>

                    <div>

                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-500">
                        Academic Background
                      </p>

                      <h2 className="mt-1 text-2xl font-black text-gray-900">
                        Education
                      </h2>

                    </div>

                  </div>

                  <p className="whitespace-pre-line text-base leading-8 text-gray-600">
                    {instructor.education}
                  </p>

                </div>

              </div>
            )}


            {/* ===================================================
                EXPERIENCE
            =================================================== */}
            {instructor.experience && (
              <div
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-3xl
                  border
                  border-gray-200/80
                  bg-white
                  p-8
                  shadow-xl
                  shadow-gray-200/40
                  transition-all
                  duration-500
                  hover:-translate-y-1
                  hover:shadow-2xl
                  hover:shadow-purple-100
                "
              >

                <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-purple-500/5 blur-3xl transition duration-500 group-hover:bg-purple-500/10" />

                <div className="relative">

                  <div className="mb-6 flex items-center gap-4">

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 transition duration-300 group-hover:scale-110 group-hover:bg-purple-100">

                      <Briefcase className="h-6 w-6" />

                    </div>

                    <div>

                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-500">
                        Professional Background
                      </p>

                      <h2 className="mt-1 text-2xl font-black text-gray-900">
                        Professional Experience
                      </h2>

                    </div>

                  </div>

                  <p className="whitespace-pre-line text-base leading-8 text-gray-600">
                    {instructor.experience}
                  </p>

                </div>

              </div>
            )}

          </div>


          {/* =====================================================
              SIDEBAR
          ===================================================== */}
          <aside>

            <div
              className="
                sticky
                top-8
                overflow-hidden
                rounded-3xl
                border
                border-gray-200/80
                bg-white
                p-7
                shadow-xl
                shadow-gray-200/40
              "
            >

              {/* Sidebar heading */}
              <div className="mb-7">

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

                    <Award className="h-5 w-5" />

                  </div>

                  <div>

                    <p className="text-xs font-bold uppercase tracking-widest text-blue-500">
                      Contact
                    </p>

                    <h2 className="text-xl font-black text-gray-900">
                      Instructor Information
                    </h2>

                  </div>

                </div>

              </div>


              <div className="space-y-6">


                {/* Email */}
                {instructor.email && (
                  <div className="group flex gap-4">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition duration-300 group-hover:scale-110 group-hover:bg-blue-100">

                      <Mail className="h-5 w-5" />

                    </div>

                    <div className="min-w-0">

                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                        Email
                      </p>

                      <p className="mt-1 break-all text-sm font-medium text-gray-700">
                        {instructor.email}
                      </p>

                    </div>

                  </div>
                )}


                {/* Phone */}
                {instructor.phone && (
                  <div className="group flex gap-4">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition duration-300 group-hover:scale-110 group-hover:bg-indigo-100">

                      <Phone className="h-5 w-5" />

                    </div>

                    <div>

                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                        Phone
                      </p>

                      <p className="mt-1 text-sm font-medium text-gray-700">
                        {instructor.phone}
                      </p>

                    </div>

                  </div>
                )}


                {/* Location */}
                {instructor.address && (
                  <div className="group flex gap-4">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600 transition duration-300 group-hover:scale-110 group-hover:bg-purple-100">

                      <MapPin className="h-5 w-5" />

                    </div>

                    <div>

                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                        Location
                      </p>

                      <p className="mt-1 text-sm leading-6 text-gray-700">
                        {instructor.address}
                      </p>

                    </div>

                  </div>
                )}

              </div>


              {/* Divider */}
              {instructor.portfolioUrl && (
                <>
                  <div className="my-7 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

                  {/* Portfolio card */}
                  <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-5">

                    <div className="flex items-start gap-3">

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">

                        <Globe className="h-5 w-5" />

                      </div>

                      <div>

                        <h3 className="font-bold text-gray-900">
                          Personal Portfolio
                        </h3>

                        <p className="mt-1 text-xs leading-5 text-gray-500">
                          Explore the instructor's personal website,
                          projects, skills and professional work.
                        </p>

                      </div>

                    </div>


                    <a
                      href={instructor.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                        group
                        relative
                        mt-5
                        flex
                        w-full
                        items-center
                        justify-center
                        gap-2
                        overflow-hidden
                        rounded-xl
                        bg-gradient-to-r
                        from-blue-600
                        via-indigo-600
                        to-purple-600
                        px-5
                        py-3.5
                        text-sm
                        font-bold
                        text-white
                        shadow-lg
                        shadow-blue-200
                        transition-all
                        duration-300
                        hover:-translate-y-1
                        hover:shadow-xl
                      "
                    >

                      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                      <Globe className="relative h-4 w-4" />

                      <span className="relative">
                        Visit Portfolio Website
                      </span>

                      <ExternalLink className="relative h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />

                    </a>

                  </div>
                </>
              )}

            </div>

          </aside>

        </div>

      </section>


      {/* =========================================================
          BOTTOM PORTFOLIO CTA
      ========================================================= */}
      {instructor.portfolioUrl && (
        <section className="mx-auto max-w-5xl px-6 pb-20">

          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 px-8 py-12 text-center text-white shadow-2xl shadow-indigo-200">

            {/* Glow */}
            <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

            <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

            <div className="relative">

              <Globe className="mx-auto h-9 w-9 animate-pulse" />

              <h2 className="mt-5 text-3xl font-black">
                Want to Know More?
              </h2>

              <p className="mx-auto mt-3 max-w-xl leading-7 text-blue-100">
                Visit the instructor's personal portfolio to explore their
                professional journey, projects, skills and achievements.
              </p>

              <a
                href={instructor.portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  group
                  mt-7
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-white
                  px-7
                  py-3.5
                  font-bold
                  text-indigo-700
                  shadow-xl
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:bg-blue-50
                  hover:shadow-2xl
                "
              >

                Visit Personal Portfolio

                <ExternalLink className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />

              </a>

            </div>

          </div>

        </section>
      )}

    </main>
  );
}