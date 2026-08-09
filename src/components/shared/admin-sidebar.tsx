"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  CreditCard,
  ClipboardList,
  FileText,
  CalendarCheck,
  HelpCircle,
  Video,
  Award,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  Menu,
  ChevronRight,
  Shield,
} from "lucide-react";

const adminNavItems = [
  { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Students", href: "/admin/students", icon: Users },
  { title: "Instructors", href: "/admin/instructors", icon: GraduationCap },
  { title: "Courses", href: "/admin/courses", icon: BookOpen },
  { title: "Payments", href: "/admin/payments", icon: CreditCard },
  { title: "Enrollments", href: "/admin/enrollments", icon: ClipboardList },
  { title: "Assignments", href: "/admin/assignments", icon: FileText },
  { title: "Attendance", href: "/admin/attendance", icon: CalendarCheck },
  { title: "Quizzes", href: "/admin/quizzes", icon: HelpCircle },
  { title: "Zoom Classes", href: "/admin/zoom-classes", icon: Video },
  { title: "Certificates", href: "/admin/certificates", icon: Award },
  { title: "Reports", href: "/admin/reports", icon: BarChart3 },
  { title: "Notifications", href: "/admin/notifications", icon: Bell },
  { title: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/admin/dashboard") return pathname === "/admin/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 text-white fixed h-full z-40">
        {/* Logo */}
        <div className="p-5 border-b border-slate-800">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-amber-500 rounded-lg flex items-center justify-center">
              <Shield className="h-5 w-5 text-slate-900" />
            </div>
            <div>
              <h1 className="font-bold text-base leading-tight">PILD Academy</h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">Admin Panel</p>
            </div>
          </Link>
        </div>

        <ScrollArea className="flex-1 px-3 py-4">
          <div className="space-y-1">
            {adminNavItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? "bg-blue-600 text-white"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <item.icon className={`h-5 w-5 ${active ? "text-white" : "text-slate-400"}`} />
                  <span className="flex-1">{item.title}</span>
                  {active && <ChevronRight className="h-4 w-4" />}
                </Link>
              );
            })}
          </div>
        </ScrollArea>

        {/* Logout */}
        <div className="p-3 border-t border-slate-800">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-red-400 hover:bg-slate-800 hover:text-red-300"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </Button>
        </div>
      </aside>

      {/* Mobile Header + Drawer */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b">
        <div className="flex items-center justify-between h-16 px-4">
          {/* Hamburger - Opens ADMIN mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0 bg-slate-900 text-white border-slate-800">
              <div className="p-5 border-b border-slate-800">
                <Link href="/admin/dashboard" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
                  <div className="w-9 h-9 bg-amber-500 rounded-lg flex items-center justify-center">
                    <Shield className="h-5 w-5 text-slate-900" />
                  </div>
                  <div>
                    <h1 className="font-bold text-base">PILD Academy</h1>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">Admin Panel</p>
                  </div>
                </Link>
              </div>
              <ScrollArea className="h-[calc(100vh-140px)] px-3 py-4">
                <div className="space-y-1">
                  {adminNavItems.map((item) => {
                    const active = isActive(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                          active
                            ? "bg-blue-600 text-white"
                            : "text-slate-300 hover:bg-slate-800 hover:text-white"
                        }`}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                      </Link>
                    );
                  })}
                </div>
                <Separator className="my-4 bg-slate-800" />
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-red-400 hover:bg-slate-800 hover:text-red-300"
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
            {adminNavItems.find((i) => isActive(i.href))?.title || "Admin Panel"}
          </h2>

          {/* Right side icons */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-gray-600" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-[10px]">
                3
              </Badge>
            </Button>
            <Avatar className="h-8 w-8 border-2 border-blue-600/20">
              <AvatarImage src="" />
              <AvatarFallback className="bg-blue-600 text-white text-xs font-bold">
                AD
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