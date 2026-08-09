import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  BookOpen,
  Users,
  Award,
  Target,
  Lightbulb,
  Heart,
  Globe,
  ArrowRight,
  CheckCircle,
  Star,
  PlayCircle,
} from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "1,200+",
    label: "Students Enrolled",
  },
  {
    icon: BookOpen,
    value: "50+",
    label: "Courses Available",
  },
  {
    icon: GraduationCap,
    value: "25+",
    label: "Expert Instructors",
  },
  {
    icon: Award,
    value: "800+",
    label: "Certificates Issued",
  },
];

const features = [
  {
    icon: Target,
    title: "Mission Focused",
    description:
      "To provide accessible, high-quality education that empowers individuals to achieve their professional goals.",
  },
  {
    icon: Lightbulb,
    title: "Innovative Learning",
    description:
      "We use modern teaching methodologies, interactive content, and hands-on projects to ensure effective learning.",
  },
  {
    icon: Heart,
    title: "Student First",
    description:
      "Every decision we make is centered around our students' success, growth, and career advancement.",
  },
  {
    icon: Globe,
    title: "Global Community",
    description:
      "Join learners from across Pakistan and beyond. Connect, collaborate, and grow together.",
  },
];

const benefits = [
  "Industry-relevant curriculum designed by experts",
  "Live interactive classes with real instructors",
  "Hands-on projects and practical assignments",
  "Flexible learning schedule to fit your life",
  "Affordable pricing with payment plans",
  "Recognized certificates upon completion",
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-pild-primary via-blue-700 to-blue-900 text-white">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white blur-3xl" />
          <div className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-pild-secondary blur-3xl" />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-20 md:py-28">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm">
              <Star className="h-4 w-4 text-pild-secondary" />
              <span className="text-sm font-medium">
                About PILD Academy
              </span>
            </div>

            <h1 className="text-4xl font-bold leading-tight md:text-6xl">
              Empowering the Next Generation of{" "}
              <span className="text-pild-secondary">
                Future Leaders
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-blue-100 md:text-xl">
              PILD Academy is dedicated to providing accessible,
              practical, and high-quality education that helps students
              develop real-world skills and build successful careers.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/courses">
                <Button
                  size="lg"
                  className="bg-pild-secondary px-7 text-black hover:bg-pild-secondary/90"
                >
                  Explore Courses
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>

              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white bg-transparent px-7 text-white hover:bg-white/10"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-20 -mt-10 px-4">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((stat) => (
            <Card
              key={stat.label}
              className="border-0 bg-white shadow-xl"
            >
              <CardContent className="p-6 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
                  <stat.icon className="h-6 w-6 text-pild-primary" />
                </div>

                <p className="text-2xl font-bold text-gray-900 md:text-3xl">
                  {stat.value}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  {stat.label}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Who We Are */}
      <section className="container mx-auto px-4 py-20 md:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-pild-primary">
              <Star className="h-4 w-4" />
              Who We Are
            </div>

            <h2 className="text-3xl font-bold leading-tight text-gray-900 md:text-4xl">
              Building Careers Through{" "}
              <span className="text-pild-primary">
                Quality Education
              </span>
            </h2>

            <p className="leading-relaxed text-gray-600">
              Founded with a vision to bridge the gap between
              traditional education and industry demands, PILD Academy
              provides comprehensive learning opportunities taught by
              experienced instructors and professionals.
            </p>

            <p className="leading-relaxed text-gray-600">
              Our approach combines theoretical knowledge with
              practical application. Students do not simply learn
              concepts. They practice them, build projects, solve
              problems, and develop skills that can be applied in the
              real world.
            </p>

            <p className="leading-relaxed text-gray-600">
              Whether you are a beginner starting your first learning
              journey or a professional looking to upgrade your
              skills, PILD Academy provides the resources, guidance,
              and learning environment you need.
            </p>

            <div className="flex flex-col gap-3 pt-4 sm:flex-row">
              <Link href="/courses">
                <Button className="bg-pild-primary hover:bg-pild-primary/90">
                  Browse Courses
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>

              <Link href="/instructors">
                <Button variant="outline">
                  Meet Our Instructors
                </Button>
              </Link>
            </div>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="relative flex min-h-[400px] items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-blue-100 via-blue-50 to-white p-8">
              <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-blue-200/50 blur-3xl" />
              <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-pild-secondary/20 blur-3xl" />

              <div className="relative flex h-48 w-48 items-center justify-center rounded-full bg-white shadow-2xl">
                <GraduationCap className="h-28 w-28 text-pild-primary" />
              </div>

              {/* Floating card */}
              <div className="absolute bottom-6 left-6 rounded-2xl border border-white/50 bg-white/90 p-4 shadow-xl backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-green-100 p-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Trusted Learning
                    </p>
                    <p className="text-xs text-gray-500">
                      Practical education
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute right-6 top-6 rounded-2xl border border-white/50 bg-white/90 p-4 shadow-xl backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-blue-100 p-2">
                    <Award className="h-5 w-5 text-pild-primary" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Career Focused
                    </p>
                    <p className="text-xs text-gray-500">
                      Learn. Build. Grow.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="border-y bg-white">
        <div className="container mx-auto px-4 py-20 md:py-24">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-pild-primary">
              <Target className="h-4 w-4" />
              What Drives Us
            </div>

            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
              Our Core Values
            </h2>

            <p className="mt-3 text-gray-500">
              The principles that guide everything we do at PILD
              Academy.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="group border-0 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <CardContent className="p-6 text-center">
                  <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 transition-colors duration-300 group-hover:bg-pild-primary">
                    <feature.icon className="h-7 w-7 text-pild-primary transition-colors duration-300 group-hover:text-white" />
                  </div>

                  <h3 className="mb-2 text-lg font-bold text-gray-900">
                    {feature.title}
                  </h3>

                  <p className="text-sm leading-relaxed text-gray-500">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose PILD */}
      <section className="container mx-auto px-4 py-20 md:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Visual */}
          <div className="order-2 lg:order-1">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-100 to-blue-50 p-8">
              <div className="flex min-h-[380px] items-center justify-center">
                <div className="relative">
                  <div className="flex h-48 w-48 items-center justify-center rounded-full bg-white shadow-xl">
                    <BookOpen className="h-28 w-28 text-pild-primary" />
                  </div>

                  <div className="absolute -right-10 -top-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-pild-primary text-white shadow-lg">
                    <PlayCircle className="h-8 w-8" />
                  </div>

                  <div className="absolute -bottom-5 -left-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-lg">
                    <Award className="h-8 w-8 text-pild-primary" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="order-1 space-y-6 lg:order-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-pild-primary">
              <Award className="h-4 w-4" />
              Why Choose Us
            </div>

            <h2 className="text-3xl font-bold leading-tight text-gray-900 md:text-4xl">
              Everything You Need to{" "}
              <span className="text-pild-primary">
                Grow Your Career
              </span>
            </h2>

            <p className="leading-relaxed text-gray-600">
              We focus on more than simply delivering courses. Our
              goal is to create a complete learning experience that
              prepares students for real opportunities.
            </p>

            <div className="space-y-4 pt-2">
              {benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-start gap-3"
                >
                  <div className="mt-0.5 shrink-0 rounded-full bg-green-100 p-1">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>

                  <p className="text-gray-600">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden bg-gradient-to-br from-pild-primary via-blue-700 to-blue-900">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute left-10 top-10 h-64 w-64 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-0 right-10 h-72 w-72 rounded-full bg-pild-secondary blur-3xl" />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-20 text-center md:py-24">
          <div className="mx-auto max-w-3xl">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md">
              <GraduationCap className="h-8 w-8 text-pild-secondary" />
            </div>

            <h2 className="text-3xl font-bold text-white md:text-4xl">
              Ready to Start Your Learning Journey?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-blue-100">
              Join learners who are developing their skills,
              building their careers, and creating a better future
              through PILD Academy.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/courses">
                <Button
                  size="lg"
                  className="bg-white text-pild-primary hover:bg-gray-100"
                >
                  Browse Courses
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>

              <Link href="/register">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                >
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}