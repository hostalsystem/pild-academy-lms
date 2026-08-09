"use client";

import Link from "next/link";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";

import { Button } from "@/components/ui/button";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

import {
  Menu,
  User,
  LogOut,
  LayoutDashboard,
  Sparkles,
  Bell,
} from "lucide-react";

import { NotificationBell } from "./notification-bell";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Courses" },
  { href: "/instructors", label: "Instructors" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const { data: session, status } = useSession();

  const closeMobileMenu = () => {
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur-md">

      {/* Top glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

      <div className="container mx-auto flex h-20 items-center justify-between px-4">

        {/* ================= LOGO ================= */}

        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2 sm:gap-3"
          onClick={closeMobileMenu}
        >
          <Image
            src="/pild-logo.png"
            alt="PILD Academy"
            width={180}
            height={80}
            priority
            sizes="180px"
            className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.03] sm:h-14"
          />

          <div>
            <div className="text-base font-black tracking-tight text-gray-900 sm:text-lg">
              PILD
              <span className="text-blue-600"> Academy</span>
            </div>

            <div className="hidden text-[9px] font-bold uppercase tracking-[3px] text-gray-400 sm:block">
              Learn • Build • Grow
            </div>
          </div>
        </Link>

        {/* ================= DESKTOP NAV ================= */}

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group relative rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-600 transition-all duration-300 hover:bg-blue-50 hover:text-blue-600"
            >
              {link.label}

              <span className="absolute bottom-1 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-600 transition-all duration-300 group-hover:w-5" />
            </Link>
          ))}
        </nav>

        {/* ================= DESKTOP ACTIONS ================= */}

        <div className="hidden items-center gap-3 md:flex">

          {status === "loading" ? (
            <div className="h-9 w-24 animate-pulse rounded-xl bg-gray-100" />
          ) : status === "authenticated" && session?.user ? (

            <div className="flex items-center gap-3">

              {/* Notification */}
              <div className="rounded-xl border border-gray-100 bg-white p-1 shadow-sm transition-all duration-300 hover:border-blue-100 hover:shadow-md">
                <NotificationBell />
              </div>

              {/* Dashboard */}
              <Link href="/dashboard">
                <Button
                  variant="ghost"
                  size="sm"
                  className="group h-10 rounded-xl px-3 font-semibold text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                >
                  <div className="mr-2 flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                    <User className="h-4 w-4" />
                  </div>

                  <span className="max-w-[120px] truncate">
                    {session.user.name || "Dashboard"}
                  </span>
                </Button>
              </Link>

              {/* Logout */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="h-10 rounded-xl border-gray-200 px-4 font-semibold text-gray-600 transition-all duration-300 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>

            </div>

          ) : (

            <>
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-10 rounded-xl px-4 font-semibold text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                >
                  <User className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
              </Link>

              <Link href="/register">
                <Button
                  size="sm"
                  className="group h-10 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 px-5 font-bold text-white shadow-md shadow-blue-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/30"
                >
                  <Sparkles className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
                  Get Started
                </Button>
              </Link>
            </>
          )}

        </div>

        {/* ================= MOBILE MENU ================= */}

        <Sheet open={isOpen} onOpenChange={setIsOpen}>

          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-11 w-11 rounded-xl border border-gray-200 bg-white shadow-sm hover:bg-blue-50 md:hidden"
            >
              <Menu className="h-5 w-5 text-gray-700" />
            </Button>
          </SheetTrigger>

          <SheetContent
            side="right"
            className="w-[300px] border-l border-gray-200 bg-white p-0 sm:w-[340px]"
          >

            {/* ================= MOBILE LOGO ================= */}

            <div className="border-b border-gray-100 px-5 py-5">

              <Link
                href="/"
                onClick={closeMobileMenu}
                className="flex items-center gap-3"
              >

                <Image
                  src="/pild-logo.png"
                  alt="PILD Academy"
                  width={60}
                  height={60}
                  sizes="60px"
                  className="h-12 w-auto object-contain"
                />

                <div>
                  <div className="text-lg font-black text-gray-900">
                    PILD
                    <span className="text-blue-600"> Academy</span>
                  </div>

                  <div className="text-[8px] font-bold uppercase tracking-[2px] text-gray-400">
                    Learn • Build • Grow
                  </div>
                </div>

              </Link>

            </div>

            {/* ================= MOBILE NAVIGATION ================= */}

            <div className="flex flex-col p-5">

              <div className="mb-3 text-[10px] font-bold uppercase tracking-[3px] text-gray-400">
                Navigation
              </div>

              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className="group flex items-center rounded-xl px-4 py-3.5 text-base font-semibold text-gray-700 transition-all duration-200 hover:bg-blue-50 hover:text-blue-600"
                >
                  <span>{link.label}</span>

                  <span className="ml-auto text-gray-300 transition-all group-hover:translate-x-1 group-hover:text-blue-500">
                    →
                  </span>
                </Link>
              ))}

              <div className="my-4 h-px bg-gray-100" />

              {/* ================= LOGGED IN ================= */}

              {status === "authenticated" && session?.user ? (

                <>
                  {/* Notification */}
                  <div className="mb-3 flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">

                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-gray-500" />

                      <span className="text-sm font-semibold text-gray-700">
                        Notifications
                      </span>
                    </div>

                    <NotificationBell />

                  </div>

                  {/* Dashboard */}
                  <Link
                    href="/dashboard"
                    onClick={closeMobileMenu}
                  >
                    <Button
                      variant="outline"
                      className="h-12 w-full rounded-xl border-blue-100 bg-blue-50 font-semibold text-blue-600 hover:bg-blue-100"
                    >
                      <LayoutDashboard className="mr-2 h-5 w-5" />
                      Dashboard
                    </Button>
                  </Link>

                  {/* Logout */}
                  <Button
                    variant="outline"
                    className="mt-3 h-12 w-full rounded-xl border-red-100 text-red-600 hover:bg-red-50"
                    onClick={() => {
                      closeMobileMenu();
                      signOut({ callbackUrl: "/" });
                    }}
                  >
                    <LogOut className="mr-2 h-5 w-5" />
                    Logout
                  </Button>
                </>

              ) : (

                /* ================= LOGGED OUT ================= */

                <>
                  <Link
                    href="/login"
                    onClick={closeMobileMenu}
                  >
                    <Button
                      variant="outline"
                      className="h-12 w-full rounded-xl font-semibold"
                    >
                      <User className="mr-2 h-5 w-5" />
                      Sign In
                    </Button>
                  </Link>

                  <Link
                    href="/register"
                    onClick={closeMobileMenu}
                  >
                    <Button
                      className="mt-3 h-12 w-full rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 font-bold text-white shadow-lg"
                    >
                      <Sparkles className="mr-2 h-5 w-5" />
                      Get Started
                    </Button>
                  </Link>
                </>
              )}

            </div>

            {/* ================= MOBILE FOOTER ================= */}

            <div className="absolute bottom-0 left-0 right-0 border-t border-gray-100 bg-gray-50 p-5">

              <div className="text-center">

                <p className="text-xs font-semibold text-gray-500">
                  PILD Academy
                </p>

                <p className="mt-1 text-[10px] text-gray-400">
                  Empowering the next generation of learners
                </p>

              </div>

            </div>

          </SheetContent>
        </Sheet>

      </div>
    </header>
  );
}