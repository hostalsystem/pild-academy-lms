"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import { Typewriter } from "react-simple-typewriter";
import {
  ArrowRight,
  Play,
  CheckCircle2,
} from "lucide-react";

import {
  FaReact,
  FaPython,
  FaHtml5,
  FaCss3Alt,
  FaJsSquare,
  FaNodeJs,
} from "react-icons/fa";

const techIcons = [
  {
    icon: FaReact,
    color: "text-cyan-400",
    top: "8%",
    left: "5%",
  },
  {
    icon: FaPython,
    color: "text-yellow-400",
    top: "20%",
    right: "8%",
  },
  {
    icon: FaHtml5,
    color: "text-orange-500",
    bottom: "25%",
    left: "8%",
  },
  {
    icon: FaCss3Alt,
    color: "text-blue-400",
    bottom: "8%",
    right: "15%",
  },
  {
    icon: FaJsSquare,
    color: "text-yellow-300",
    top: "45%",
    left: "-4%",
  },
  {
    icon: FaNodeJs,
    color: "text-green-400",
    top: "45%",
    right: "-4%",
  },
];

export function HeroSection() {
  const handleWatchDemo = () => {
    const demoSection = document.getElementById("demo");

    if (demoSection) {
      demoSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      window.location.href = "/courses";
    }
  };

  return (
    <section className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 text-white">

      {/* Background glow */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-[450px] w-[450px] rounded-full bg-cyan-500/20 blur-[140px]" />

      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[450px] w-[450px] rounded-full bg-purple-500/20 blur-[140px]" />

      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-[150px]" />

      {/* Grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.25) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.25) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Floating particles */}
      <div className="absolute left-[8%] top-[18%] h-2 w-2 animate-pulse rounded-full bg-cyan-400" />

      <div className="absolute left-[20%] top-[70%] h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400" />

      <div className="absolute right-[15%] top-[22%] h-2 w-2 animate-pulse rounded-full bg-purple-400" />

      <div className="absolute right-[8%] top-[68%] h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-300" />

      <div className="absolute left-[48%] top-[12%] h-1.5 w-1.5 animate-pulse rounded-full bg-yellow-300" />

      <div className="container relative z-10 mx-auto px-5 py-16 sm:px-6 lg:px-8 lg:py-24">

        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20">

          {/* =====================================================
              LEFT SIDE
          ====================================================== */}

          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9 }}
          >

            {/* Founder badge */}

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.7,
                delay: 0.2,
              }}
              className="inline-flex flex-col items-start"
            >

              <motion.div
                animate={{
                  scale: [1, 1.06, 1],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                }}
                className="rounded-full border border-cyan-400/60 bg-cyan-500/10 px-5 py-2.5 backdrop-blur-xl"
              >
                <span className="font-semibold text-cyan-300">
                  🚀 Founder & CEO
                </span>
              </motion.div>

              <div className="mt-4 flex items-center gap-2 rounded-full border border-green-400/60 bg-green-500/10 px-5 py-2 backdrop-blur-xl">

                <span className="h-3 w-3 animate-pulse rounded-full bg-green-400" />

                <span className="font-semibold text-green-300">
                  Available for Live Classes
                </span>

              </div>

            </motion.div>

            {/* Heading */}

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.3,
              }}
              className="mt-8 text-5xl font-black leading-[1.05] sm:text-6xl lg:text-7xl"
            >

              Build Your

              <br />

              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                Future
              </span>

              <br />

              With

              <br />

              <motion.span
                animate={{
                  opacity: [1, 0.75, 1],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                }}
                className="text-yellow-300"
              >
                PILD Academy
              </motion.span>

            </motion.h1>

            {/* Typewriter */}

            <div className="mt-8 min-h-[40px] text-xl font-semibold text-gray-200 sm:text-2xl">

              <Typewriter
                words={[
                  "Software Engineering",
                  "Artificial Intelligence",
                  "Web Development",
                  "Programming",
                  "English Language",
                  "Career Development",
                  "Freelancing",
                ]}
                loop={0}
                cursor
                cursorStyle="|"
                typeSpeed={70}
                deleteSpeed={40}
                delaySpeed={1800}
              />

            </div>

            {/* Description */}

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.8,
                delay: 0.8,
              }}
              className="mt-7 max-w-xl text-lg leading-8 text-gray-300"
            >
              Transform your future with industry-focused education.
              Learn modern technologies, Artificial Intelligence,
              programming, English communication and digital skills
              through practical learning and expert guidance.
            </motion.p>

            {/* Buttons */}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 1,
              }}
              className="mt-10 flex flex-col gap-4 sm:flex-row"
            >

              <Link
                href="/courses"
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 font-bold text-white shadow-[0_0_40px_rgba(6,182,212,0.35)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_55px_rgba(6,182,212,0.55)]"
              >

                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />

                <span className="relative z-10">
                  Explore Courses
                </span>

                <ArrowRight className="relative z-10 ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />

              </Link>

              <button
                type="button"
                onClick={handleWatchDemo}
                className="group inline-flex items-center justify-center rounded-xl border border-cyan-400 px-8 py-4 font-semibold text-white backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:bg-cyan-500/20 hover:shadow-[0_0_35px_rgba(6,182,212,0.25)]"
              >

                <Play className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:scale-110" />

                Watch Demo

              </button>

            </motion.div>

            {/* Quick stats */}

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 1.2,
              }}
              className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4"
            >

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-yellow-400/40">
                <h3 className="text-2xl font-black text-yellow-300">
                  12K+
                </h3>
                <p className="mt-1 text-xs text-gray-400">
                  Students
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-purple-400/40">
                <h3 className="text-2xl font-black text-purple-300">
                  180+
                </h3>
                <p className="mt-1 text-xs text-gray-400">
                  Courses
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/40">
                <h3 className="text-2xl font-black text-cyan-300">
                  40+
                </h3>
                <p className="mt-1 text-xs text-gray-400">
                  Countries
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-green-400/40">
                <h3 className="text-2xl font-black text-green-300">
                  4.8/5
                </h3>
                <p className="mt-1 text-xs text-gray-400">
                  Rating
                </p>
              </div>

            </motion.div>

          </motion.div>

          {/* =====================================================
              RIGHT SIDE
          ====================================================== */}

          <motion.div
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 1,
              delay: 0.2,
            }}
            className="flex justify-center lg:justify-end"
          >

            <Tilt
              tiltMaxAngleX={12}
              tiltMaxAngleY={12}
              perspective={1200}
              scale={1.02}
              transitionSpeed={1500}
              gyroscope={false}
              className="w-full max-w-md"
            >

              <div className="relative overflow-hidden rounded-[40px] border border-cyan-400/30 bg-white/5 shadow-[0_0_120px_rgba(0,255,255,0.35)] backdrop-blur-3xl transition-all duration-500 hover:border-cyan-400/60 hover:shadow-[0_0_180px_rgba(0,255,255,0.5)]">

                {/* Card gradient */}

                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-purple-500/20" />

                <div className="relative p-7 sm:p-8">

                  {/* Profile image area */}

                  <div className="flex justify-center">

                    <div className="relative mx-auto w-fit">

                      {/* Pulse */}

                      <div className="absolute inset-0 animate-ping rounded-full bg-cyan-400 opacity-20" />

                      {/* Outer rotating ring */}

                      <div
                        className="absolute inset-[-28px] animate-spin rounded-full border-2 border-cyan-400/30"
                        style={{
                          animationDuration: "18s",
                        }}
                      />

                      {/* Inner rotating ring */}

                      <div
                        className="absolute inset-[-12px] animate-spin rounded-full border border-purple-500/40"
                        style={{
                          animationDirection: "reverse",
                          animationDuration: "12s",
                        }}
                      />

                      {/* Actual image */}

                      <motion.div
                        whileHover={{
                          scale: 1.05,
                          rotate: 2,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 250,
                        }}
                        className="relative h-52 w-52 overflow-hidden rounded-full border-4 border-cyan-400 shadow-[0_0_40px_#06b6d4] sm:h-60 sm:w-60 lg:h-64 lg:w-64"
                      >

                        <Image
                          src="/aziz-rahi.png"
                          alt="Aziz Rahi"
                          fill
                          priority
                          sizes="(max-width: 640px) 208px, (max-width: 1024px) 240px, 256px"
                          className="object-cover"
                        />

                      </motion.div>

                      {/* Floating technology icons */}

                      {techIcons.map((item, index) => {
                        const Icon = item.icon;

                        return (
                          <motion.div
                            key={index}
                            animate={{
                              y: [0, -12, 0],
                            }}
                            transition={{
                              repeat: Infinity,
                              duration: 3 + index,
                              ease: "easeInOut",
                            }}
                            className={`absolute z-20 text-3xl sm:text-4xl ${item.color}`}
                            style={{
                              top: item.top,
                              bottom: item.bottom,
                              left: item.left,
                              right: item.right,
                            }}
                          >
                            <Icon />
                          </motion.div>
                        );
                      })}

                    </div>

                  </div>

                  {/* Name */}

                  <div className="mt-8 flex items-center justify-center gap-3">

                    <h2 className="bg-gradient-to-r from-cyan-300 via-white to-purple-300 bg-clip-text text-3xl font-black text-transparent sm:text-4xl">
                      Aziz Rahi
                    </h2>

                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 shadow-lg">
                      <CheckCircle2 className="h-5 w-5 text-white" />
                    </div>

                  </div>

                  <p className="mt-2 text-center text-lg text-cyan-300">
                    Founder & CEO
                  </p>

                  <p className="mt-2 text-center text-gray-300">
                    Software Engineer
                  </p>

                  {/* Courses / Students */}

                  <div className="mt-8 grid grid-cols-2 gap-4">

                    <div className="rounded-xl bg-white/10 p-4 text-center backdrop-blur-lg">
                      <h3 className="text-2xl font-bold text-yellow-300">
                        100+
                      </h3>

                      <p className="mt-1 text-gray-300">
                        Courses
                      </p>
                    </div>

                    <div className="rounded-xl bg-white/10 p-4 text-center backdrop-blur-lg">
                      <h3 className="text-2xl font-bold text-cyan-300">
                        10000+
                      </h3>

                      <p className="mt-1 text-gray-300">
                        Students
                      </p>
                    </div>

                  </div>

                  {/* Experience / Projects */}

                  <div className="mt-8 grid grid-cols-2 gap-4">

                    <div className="rounded-2xl border border-cyan-400/20 bg-white/10 p-5 backdrop-blur-xl">
                      <h3 className="font-bold text-cyan-300">
                        Experience
                      </h3>

                      <p className="mt-2 text-3xl font-black">
                        5+
                      </p>

                      <p className="text-gray-300">
                        Years Teaching
                      </p>
                    </div>

                    <div className="rounded-2xl border border-purple-400/20 bg-white/10 p-5 backdrop-blur-xl">
                      <h3 className="font-bold text-purple-300">
                        Projects
                      </h3>

                      <p className="mt-2 text-3xl font-black">
                        50+
                      </p>

                      <p className="text-gray-300">
                        Completed
                      </p>
                    </div>

                  </div>

                </div>

              </div>

            </Tilt>

          </motion.div>

        </div>

      </div>

    </section>
  );
}