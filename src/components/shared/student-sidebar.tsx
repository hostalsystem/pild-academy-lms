"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NotificationBell } from "@/components/shared/notification-bell";
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  ClipboardList,
  CreditCard,
  FileText,
  CalendarCheck,
  HelpCircle,
  Video,
  Award,
  UserCircle,
  Settings,
  LogOut,
  Menu,
  ChevronRight,
} from "lucide-react";

const studentNavItems = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Browse Courses", href: "/courses", icon: BookOpen },
  { title: "My Learning", href: "/my-learning", icon: GraduationCap },
  { title: "My Enrollments", href: "/my-enrollments", icon: ClipboardList },
  { title: "Make Payment", href: "/payments", icon: CreditCard },
  { title: "Assignments", href: "/assignments", icon: FileText },
  { title: "Attendance", href: "/attendance", icon: CalendarCheck },
  { title: "Quizzes", href: "/quizzes", icon: HelpCircle },
  { title: "Zoom Classes", href: "/zoom-classes", icon: Video },
  { title: "Certificates", href: "/certificates", icon: Award },
  { title: "Profile", href: "/profile", icon: UserCircle },
  { title: "Settings", href: "/settings", icon: Settings },
];

export function StudentSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* ========== DESKTOP SIDEBAR ========== */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 fixed h-full z-40">
        {/* Logo */}
        <div className="p-5 border-b border-gray-100">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-base leading-tight text-gray-900">PILD Academy</h1>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Student Panel</p>
            </div>
          </Link>
        </div>

        <ScrollArea className="flex-1 px-3 py-4">
          <div className="space-y-1">
            {studentNavItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <item.icon className={`h-5 w-5 ${active ? "text-white" : "text-gray-400"}`} />
                  <span className="flex-1">{item.title}</span>
                  {active && <ChevronRight className="h-4 w-4" />}
                </Link>
              );
            })}
          </div>
        </ScrollArea>

        {/* Logout */}
        <div className="p-3 border-t border-gray-100">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </Button>
        </div>
      </aside>

      {/* ========== MOBILE HEADER + DRAWER ========== */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b">
        <div className="flex items-center justify-between h-16 px-4">
          {/* Hamburger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0 bg-white border-gray-200">
              <div className="p-5 border-b border-gray-100">
                <Link href="/dashboard" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
                  <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
                    <GraduationCap className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h1 className="font-bold text-base text-gray-900">PILD Academy</h1>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">Student Panel</p>
                  </div>
                </Link>
              </div>

              <ScrollArea className="h-[calc(100vh-140px)] px-3 py-4">
                <div className="space-y-1">
                  {studentNavItems.map((item) => {
                    const active = isActive(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                          active
                            ? "bg-blue-600 text-white"
                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                        }`}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                      </Link>
                    );
                  })}
                </div>

                <Separator className="my-4" />

                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-red-600 hover:bg-red-50 hover:text-red-700"
                  onClick={() => signOut({ callbackUrl: "/login" })}
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </Button>
              </ScrollArea>
            </SheetContent>
          </Sheet>

          {/* Page Title */}
          <h2 className="text-lg font-semibold text-gray-900">
            {studentNavItems.find((i) => isActive(i.href))?.title || "Dashboard"}
          </h2>

          {/* Right side - FIXED: Now uses NotificationBell component */}
          <div className="flex items-center gap-2">
            <NotificationBell />
            <Avatar className="h-8 w-8 border-2 border-blue-600/20">
              <AvatarImage src="" />
              <AvatarFallback className="bg-blue-600 text-white text-xs font-bold">
                ST
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      {/* Spacer for mobile header */}
      <div className="lg:hidden h-16" />
    </>
  );
}