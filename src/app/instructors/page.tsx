import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Mail,
  Award,
  User,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

async function getInstructors() {
  return await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
    take: 12,
  });
}

export default async function InstructorsPage() {
  const instructors = await getInstructors();

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 text-white">

        {/* Background grid */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        {/* Glow effects */}
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8 md:py-28">

          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-white/10 px-5 py-2 text-sm font-medium backdrop-blur-sm">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
            Learn From The Best
          </div>

          <h1 className="text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">
            Our
            <span className="block bg-gradient-to-r from-cyan-300 to-white bg-clip-text text-transparent">
              Expert Instructors
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-blue-100 sm:text-lg">
            Learn from experienced educators and industry professionals
            dedicated to helping you build real skills and achieve your goals.
          </p>

        </div>
      </section>

      {/* Instructor Grid */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">

        {instructors.length === 0 ? (
          <div className="rounded-2xl border bg-white p-12 text-center shadow-sm">
            <User className="mx-auto mb-4 h-12 w-12 text-blue-500" />

            <h2 className="text-xl font-bold text-gray-900">
              No instructors available
            </h2>

            <p className="mt-2 text-gray-500">
              Instructor profiles will appear here once they are added.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">

            {instructors.map((instructor) => (
              <Card
                key={instructor.id}
                className="group overflow-hidden rounded-2xl border-0 bg-white shadow-md transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
              >

                {/* Top gradient */}
                <div className="relative h-28 overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">

                  <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-400/20 blur-2xl" />

                  <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-purple-500/20 blur-2xl" />

                </div>

                <CardContent className="relative px-6 pb-7 pt-0">

                  {/* Profile Image */}
                  <div className="-mt-14 mb-5 flex justify-center">

                    <div className="relative">

                      {/* Glow */}
                      <div className="absolute inset-0 rounded-full bg-cyan-400/40 blur-xl transition-all duration-500 group-hover:bg-cyan-400/60" />

                      <div className="relative h-28 w-28 overflow-hidden rounded-full border-4 border-white bg-gray-100 shadow-xl">

                        {instructor.image ? (
                          <Image
                            src={instructor.image}
                            alt={instructor.name || "Instructor"}
                            width={112}
                            height={112}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
                            <User className="h-12 w-12 text-blue-500" />
                          </div>
                        )}

                      </div>

                    </div>
                  </div>

                  {/* Content */}
                  <div className="text-center">

                    <h3 className="text-xl font-bold text-gray-900 transition-colors group-hover:text-blue-600">
                      {instructor.name || "Instructor"}
                    </h3>

                    <p className="mt-1 text-sm font-medium text-blue-600">
                      {instructor.email}
                    </p>

                    <div className="mx-auto mt-4 h-1 w-12 rounded-full bg-gradient-to-r from-cyan-400 to-blue-600" />

                    <p className="mt-4 text-sm leading-6 text-gray-500">
                      Experienced educator dedicated to providing quality
                      learning experiences at PILD Academy.
                    </p>

                    {/* Button */}
                    <div className="mt-6">

                      <Link
                        href={`/courses?instructor=${instructor.id}`}
                        className="block"
                      >
                        <Button
                          variant="outline"
                          className="w-full gap-2 border-blue-200 text-blue-600 transition-all duration-300 hover:border-blue-600 hover:bg-blue-600 hover:text-white"
                        >
                          <BookOpen className="h-4 w-4" />
                          View Courses
                          <ArrowRight className="ml-auto h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </Link>

                    </div>

                  </div>

                </CardContent>
              </Card>
            ))}

          </div>
        )}

      </section>

      {/* CTA */}
      <section className="border-t bg-white">

        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">

          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 shadow-lg shadow-blue-500/20">
            <Award className="h-8 w-8 text-white" />
          </div>

          <h2 className="text-3xl font-black text-gray-900 sm:text-4xl">
            Want to Become an Instructor?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-gray-500">
            Share your knowledge, inspire students, and become part of the
            PILD Academy instructor community.
          </p>

          <div className="mt-8">
            <Link href="/contact">
              <Button
                size="lg"
                className="gap-2 bg-blue-600 px-7 hover:bg-blue-700"
              >
                <Mail className="h-5 w-5" />
                Contact Us
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>

        </div>

      </section>

    </div>
  );
}