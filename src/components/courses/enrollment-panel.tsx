"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import {
  CheckCircle,
  Lock,
  PlayCircle,
  FileText,
  Award,
  ShieldCheck,
  Clock,
  CreditCard,
  Sparkles,
  ArrowRight,
} from "lucide-react";

interface EnrollmentPanelProps {
  course: {
    id: string;
    fee: number;
    duration?: string | null;
    lessons: { id: string }[];
    objectives: string[];
    skills: string[];
  };
}

export function EnrollmentPanel({ course }: EnrollmentPanelProps) {
  return (
    <div className="sticky top-24">

      <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.10)]">

        {/* Top gradient accent */}
        <div className="h-1.5 bg-gradient-to-r from-cyan-400 via-blue-600 to-purple-600" />

        {/* Background glow */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative p-6 sm:p-7">

          {/* ================= PRICE ================= */}

          <div className="mb-6">

            <div className="mb-3 flex items-center gap-2">

              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600">
                <Sparkles className="h-4 w-4" />
              </div>

              <span className="text-xs font-bold uppercase tracking-[2px] text-gray-500">
                Course Enrollment
              </span>

            </div>

            <div className="flex items-end gap-2">

              <span className="text-4xl font-black tracking-tight text-gray-900">
                PKR {course.fee.toLocaleString()}
              </span>

            </div>

            <p className="mt-2 text-sm text-gray-500">
              One-time payment
              <span className="mx-2 text-gray-300">•</span>
              Lifetime access
            </p>

          </div>

          {/* ================= ENROLL BUTTON ================= */}

          <Link
            href={`/payment/${course.id}`}
            className="block"
          >
            <Button
              size="lg"
              className="group h-14 w-full rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-base font-bold text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/30"
            >
              Enroll Now

              <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </Link>

          {/* Guarantee */}

          <div className="mt-4 flex items-center justify-center gap-2 text-xs font-medium text-green-600">

            <ShieldCheck className="h-4 w-4" />

            <span>Enroll here to start Classes</span>

          </div>

          <Separator className="my-7" />

          {/* ================= COURSE INCLUDES ================= */}

          <div>

            <h4 className="text-sm font-black uppercase tracking-[2px] text-gray-900">
              This course includes
            </h4>

            <div className="mt-5 space-y-4">

              {/* Video lessons */}

              <div className="flex items-center gap-3">

                <FeatureIcon>
                  <PlayCircle className="h-4 w-4" />
                </FeatureIcon>

                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">
                    Video lessons
                  </p>

                  <p className="text-xs text-gray-400">
                    {course.lessons.length} lessons included
                  </p>
                </div>

              </div>

              {/* Resources */}

              <div className="flex items-center gap-3">

                <FeatureIcon>
                  <FileText className="h-4 w-4" />
                </FeatureIcon>

                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">
                    Downloadable resources
                  </p>

                  <p className="text-xs text-gray-400">
                    PDFs, exercises and learning materials
                  </p>
                </div>

              </div>

              {/* Lifetime access */}

              <div className="flex items-center gap-3">

                <FeatureIcon>
                  <CheckCircle className="h-4 w-4" />
                </FeatureIcon>

                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">
                    Lifetime access
                  </p>

                  <p className="text-xs text-gray-400">
                    Learn at your own pace
                  </p>
                </div>

              </div>

              {/* Certificate */}

              <div className="flex items-center gap-3">

                <FeatureIcon>
                  <Award className="h-4 w-4" />
                </FeatureIcon>

                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">
                    Certificate of completion
                  </p>

                  <p className="text-xs text-gray-400">
                    Receive your certificate after completion
                  </p>
                </div>

              </div>

              {/* Payment */}

              <div className="flex items-center gap-3">

                <FeatureIcon>
                  <CreditCard className="h-4 w-4" />
                </FeatureIcon>

                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">
                    Secure payment
                  </p>

                  <p className="text-xs text-gray-400">
                    EasyPaisa, JazzCash and UBL
                  </p>
                </div>

              </div>

            </div>

          </div>

          <Separator className="my-7" />

          {/* ================= COURSE INFO ================= */}

          <div className="grid grid-cols-2 gap-3">

            <div className="rounded-2xl bg-gray-50 p-4">

              <Clock className="h-5 w-5 text-blue-600" />

              <p className="mt-3 text-xs text-gray-400">
                Duration
              </p>

              <p className="mt-1 text-sm font-bold text-gray-800">
                {course.duration || "Self-paced"}
              </p>

            </div>

            <div className="rounded-2xl bg-gray-50 p-4">

              <PlayCircle className="h-5 w-5 text-cyan-600" />

              <p className="mt-3 text-xs text-gray-400">
                Lessons
              </p>

              <p className="mt-1 text-sm font-bold text-gray-800">
                {course.lessons.length}
              </p>

            </div>

          </div>

          {/* Secure payment note */}

          <div className="mt-5 flex items-center justify-center gap-2 text-xs text-gray-400">

            <Lock className="h-3.5 w-3.5" />

            Secure and protected enrollment

          </div>

        </div>

      </div>

    </div>
  );
}


/* ========================================================= */
/* FEATURE ICON                                               */
/* ========================================================= */

function FeatureIcon({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-50 to-blue-50 text-blue-600">
      {children}
    </div>
  );
}