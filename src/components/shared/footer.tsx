"use client";

import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="relative w-full overflow-hidden bg-[#020617] text-white">
      {/* Background Glow */}
      <div className="pointer-events-none absolute -left-40 top-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-[140px]" />

      <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-purple-500/10 blur-[140px]" />

      {/* Decorative Grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Main Footer */}
      <div className="relative mx-auto w-full max-w-7xl px-6 py-14 sm:px-8 lg:px-10">

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* ================= BRAND ================= */}
          <div className="lg:pr-6">

            <Link
              href="/"
              className="group inline-flex items-center gap-3"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 via-blue-600 to-purple-600 shadow-lg shadow-blue-500/20 transition-transform duration-300 group-hover:scale-105">
                <span className="text-lg font-black text-white">
                  P
                </span>
              </div>

              <div>
                <div className="text-xl font-black tracking-tight">
                  <span className="text-cyan-400">PILD</span>{" "}
                  <span className="text-white">Academy</span>
                </div>

                <div className="mt-0.5 text-[9px] font-bold uppercase tracking-[3px] text-slate-500">
                  Build Your Future
                </div>
              </div>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">
              Empowering learners with premium education,
              practical skills, and career focused learning
              experiences.
            </p>

          </div>

          {/* ================= QUICK LINKS ================= */}
          <div>

            <h3 className="mb-5 text-sm font-bold uppercase tracking-[3px] text-white">
              Quick Links
            </h3>

            <div className="space-y-3">

              <Link
                href="/courses"
                className="group flex items-center gap-1 text-sm text-slate-400 transition-colors hover:text-cyan-400"
              >
                All Courses

                <ArrowUpRight
                  className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100"
                />
              </Link>

              <Link
                href="/instructors"
                className="group flex items-center gap-1 text-sm text-slate-400 transition-colors hover:text-cyan-400"
              >
                Instructors

                <ArrowUpRight
                  className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100"
                />
              </Link>

              <Link
                href="/about"
                className="group flex items-center gap-1 text-sm text-slate-400 transition-colors hover:text-cyan-400"
              >
                About Us

                <ArrowUpRight
                  className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100"
                />
              </Link>

            </div>

          </div>

          {/* ================= SUPPORT ================= */}
        <div>
  <h3 className="mb-5 text-sm font-semibold uppercase tracking-[3px] text-white">
    Support
  </h3>

  <ul className="space-y-3">
    <li>
      <Link
        href="/contact"
        className="inline-block text-sm text-blue-200 transition-all duration-200 hover:translate-x-1 hover:text-white"
      >
        Help Center
      </Link>
    </li>

    <li>
      <Link
        href="/contact"
        className="inline-block text-sm text-blue-200 transition-all duration-200 hover:translate-x-1 hover:text-white"
      >
        Contact Us
      </Link>
    </li>

    <li>
      <Link
        href="/faqs"
        className="inline-block text-sm text-blue-200 transition-all duration-200 hover:translate-x-1 hover:text-white"
      >
        FAQs
      </Link>
    </li>
  </ul>
</div>
          {/* ================= CONTACT ================= */}
          <div>

            <h3 className="mb-5 text-sm font-bold uppercase tracking-[3px] text-white">
              Contact
            </h3>

            <div className="space-y-5">

              {/* Email */}
              <div className="flex items-start gap-3">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10">
                  <Mail className="h-4 w-4 text-cyan-400" />
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Email
                  </p>

                  <a
                    href="mailto:info@pildacademy.com"
                    className="text-sm text-slate-300 transition-colors hover:text-cyan-400"
                  >
                    pildacademy@gmail.com
                  </a>
                </div>

              </div>

              {/* Phone */}
              <div className="flex items-start gap-3">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
                  <Phone className="h-4 w-4 text-blue-400" />
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Phone
                  </p>

                  <a
                    href="tel:+923001234567"
                    className="text-sm text-slate-300 transition-colors hover:text-blue-400"
                  >
                    +92-301-8813795
                  </a>
                </div>

              </div>

              {/* Location */}
              <div className="flex items-start gap-3">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-500/10">
                  <MapPin className="h-4 w-4 text-purple-400" />
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Location
                  </p>

                  <p className="text-sm text-slate-300">
                    peshawar
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>

        {/* ================= BOTTOM ================= */}

        <div className="mt-12 border-t border-white/10 pt-6">

          <div className="flex flex-col gap-4 text-sm sm:flex-row sm:items-center sm:justify-between">

            <p className="text-slate-500">
                  © 2026 PILD Academy. All rights reserved.
            </p>

           <div className="flex items-center justify-center gap-6 border-t border-white/10 pt-6">
  <Link
    href="/privacy-policy"
    className="text-sm text-blue-200 transition-all duration-200 hover:text-white hover:underline hover:underline-offset-4"
  >
    Privacy Policy
  </Link>

  <span className="h-4 w-px bg-white/10" />

  <Link
    href="/terms"
    className="text-sm text-blue-200 transition-all duration-200 hover:text-white hover:underline hover:underline-offset-4"
  >
    Terms & Conditions
  </Link>
</div>
          </div>

        </div>

      </div>
    </footer>
  );
}