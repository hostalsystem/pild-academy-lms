"use client";

import { CheckCircle, Video, FileText, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Video,
    title: "HD Video Lessons",
    description:
      "Crystal clear video content with lifetime access so you can learn whenever and wherever you want.",
    number: "01",
  },
  {
    icon: FileText,
    title: "Downloadable Resources",
    description:
      "PDFs, source code, assignments and practical exercises to help you turn knowledge into real skills.",
    number: "02",
  },
  {
    icon: MessageCircle,
    title: "Live Support",
    description:
      "Get direct guidance from instructors through live Zoom sessions and practical learning support.",
    number: "03",
  },
  {
    icon: CheckCircle,
    title: "Verified Certificates",
    description:
      "Earn certificates after completing your courses and demonstrate your skills to employers and clients.",
    number: "04",
  },
];

export function WhyChooseUs() {
  return (
    <section className="relative overflow-hidden bg-gray-50 py-20 sm:py-24 lg:py-28">

      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-cyan-100/50 blur-[120px]" />

      <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-purple-100/50 blur-[120px]" />

      {/* Decorative grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(#2563eb 1px, transparent 1px),
            linear-gradient(90deg, #2563eb 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      <div className="container relative z-10 mx-auto px-5 sm:px-6 lg:px-8">

        {/* Heading */}
        <motion.div
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
            amount: 0.3,
          }}
          transition={{
            duration: 0.8,
          }}
          className="mx-auto mb-14 max-w-3xl text-center sm:mb-16"
        >

          {/* Eyebrow */}
          <div className="mb-5 flex items-center justify-center gap-4">

            <div className="h-[2px] w-12 bg-gradient-to-r from-transparent to-cyan-500 sm:w-16" />

            <span className="text-sm font-bold uppercase tracking-[4px] text-cyan-600 sm:tracking-[5px]">
              Why Choose Us
            </span>

            <div className="h-[2px] w-12 bg-gradient-to-l from-transparent to-cyan-500 sm:w-16" />

          </div>

          {/* Main heading */}
          <h2 className="text-4xl font-black leading-tight text-gray-900 sm:text-5xl lg:text-6xl">

            Everything You Need

            <span className="block bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              To Succeed
            </span>

          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
            We combine practical education, expert guidance and modern
            learning tools to give you everything you need to build your
            future.
          </p>

        </motion.div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                initial={{
                  opacity: 0,
                  y: 50,
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
                  delay: index * 0.1,
                }}
                whileHover={{
                  y: -10,
                }}
                className="group relative"
              >

                {/* Card */}
                <div className="relative h-full overflow-hidden rounded-3xl border border-gray-200 bg-white p-7 shadow-[0_10px_35px_rgba(15,23,42,0.05)] transition-all duration-500 group-hover:border-cyan-300 group-hover:shadow-[0_25px_60px_rgba(15,23,42,0.12)] sm:p-8">

                  {/* Number */}
                  <div className="absolute right-6 top-5 select-none text-5xl font-black text-gray-100 transition-colors duration-500 group-hover:text-cyan-50">
                    {feature.number}
                  </div>

                  {/* Icon */}
                  <div className="relative mb-7 flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-50 to-blue-100 text-blue-600 transition-all duration-500 group-hover:scale-110 group-hover:from-cyan-500 group-hover:to-blue-600 group-hover:text-white group-hover:shadow-lg">

                    <Icon className="relative z-10 h-8 w-8" />

                  </div>

                  {/* Title */}
                  <h3 className="relative text-xl font-black text-gray-900 transition-colors duration-300 group-hover:text-blue-600">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="relative mt-4 text-sm leading-7 text-gray-500">
                    {feature.description}
                  </p>

                  {/* Bottom line */}
                  <div className="mt-7 h-1 w-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-500 group-hover:w-full" />

                  {/* Hover glow */}
                  <div className="pointer-events-none absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                </div>

              </motion.div>
            );
          })}

        </div>

      </div>

    </section>
  );
}