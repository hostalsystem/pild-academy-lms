"use client";

import { motion } from "framer-motion";
import {
  Users,
  BookOpen,
  Award,
  TrendingUp,
} from "lucide-react";

const stats = [
  {
    icon: Users,
    label: "Active Students",
    value: "2,500+",
    color: "text-cyan-400",
    border: "border-cyan-500/20",
    hoverBorder: "hover:border-cyan-400",
    glow: "hover:shadow-[0_0_40px_rgba(34,211,238,0.15)]",
  },
  {
    icon: BookOpen,
    label: "Total Courses",
    value: "12+",
    color: "text-blue-400",
    border: "border-blue-500/20",
    hoverBorder: "hover:border-blue-400",
    glow: "hover:shadow-[0_0_40px_rgba(59,130,246,0.15)]",
  },
  {
    icon: Award,
    label: "Certified Graduates",
    value: "600+",
    color: "text-purple-400",
    border: "border-purple-500/20",
    hoverBorder: "hover:border-purple-400",
    glow: "hover:shadow-[0_0_40px_rgba(168,85,247,0.15)]",
  },
  {
    icon: TrendingUp,
    label: "Success Rate",
    value: "95%",
    color: "text-green-400",
    border: "border-green-500/20",
    hoverBorder: "hover:border-green-400",
    glow: "hover:shadow-[0_0_40px_rgba(74,222,128,0.15)]",
  },
];

export function StatsSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 py-20 text-white sm:py-24">

      {/* Background glow */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-cyan-500/20 blur-[140px]" />

      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-purple-500/20 blur-[140px]" />

      <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-[120px]" />

      {/* Grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)
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

          <span className="font-bold uppercase tracking-[5px] text-cyan-400 sm:tracking-[6px]">
            Our Achievements
          </span>

          <h2 className="mt-5 text-4xl font-black leading-tight sm:text-5xl md:text-6xl">

            Making An

            <span className="block bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Impact Together
            </span>

          </h2>

          <p className="mt-6 text-base leading-7 text-gray-300 sm:text-lg sm:leading-8">
            Thousands of students trust PILD Academy to build practical
            skills, advance their careers and prepare for the modern
            digital world.
          </p>

        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-7">

          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={stat.label}
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
                  amount: 0.2,
                }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                }}
                whileHover={{
                  y: -8,
                  scale: 1.02,
                }}
                className={`
                  group relative overflow-hidden rounded-3xl
                  border ${stat.border} ${stat.hoverBorder}
                  bg-white/5 p-7 text-center
                  backdrop-blur-xl
                  transition-all duration-500
                  ${stat.glow}
                  sm:p-8
                `}
              >

                {/* Card glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="relative z-10">

                  {/* Icon */}
                  <div
                    className={`
                      mx-auto mb-5 flex h-16 w-16
                      items-center justify-center
                      rounded-2xl bg-white/5
                      ${stat.color}
                      transition-all duration-500
                      group-hover:scale-110
                      group-hover:bg-white/10
                    `}
                  >
                    <Icon className="h-8 w-8" />
                  </div>

                  {/* Number */}
                  <motion.h3
                    initial={{
                      opacity: 0,
                    }}
                    whileInView={{
                      opacity: 1,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.1 + 0.2,
                    }}
                    className={`text-4xl font-black sm:text-5xl ${stat.color}`}
                  >
                    {stat.value}
                  </motion.h3>

                  {/* Label */}
                  <p className="mt-3 text-sm font-medium text-gray-300 sm:text-base">
                    {stat.label}
                  </p>

                </div>

              </motion.div>
            );
          })}

        </div>

      </div>

    </section>
  );
}