import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  BookOpen,
  CreditCard,
  ClipboardList,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  DollarSign,
  Award,
  Video,
} from "lucide-react";
import Link from "next/link";

async function getAdminStats() {
  const [
    totalStudents,
    totalInstructors,
    totalCourses,
    totalEnrollments,
    pendingEnrollments,
    approvedEnrollments,
    totalPayments,
    pendingPayments,
    paidPayments,
    rejectedPayments,
    totalRevenue,
  ] = await Promise.all([
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.user.count({ where: { role: "INSTRUCTOR" } }),
    prisma.course.count(),
    prisma.enrollment.count(),
    prisma.enrollment.count({ where: { status: "PENDING" } }),
    prisma.enrollment.count({ where: { status: "APPROVED" } }),
    prisma.payment.count(),
    prisma.payment.count({ where: { status: "PENDING" } }),
    prisma.payment.count({ where: { status: "PAID" } }),
    prisma.payment.count({ where: { status: "REJECTED" } }),
    prisma.payment.aggregate({
      where: { status: "PAID" },
      _sum: { amount: true },
    }),
  ]);

  return {
    totalStudents,
    totalInstructors,
    totalCourses,
    totalEnrollments,
    pendingEnrollments,
    approvedEnrollments,
    totalPayments,
    pendingPayments,
    paidPayments,
    rejectedPayments,
    totalRevenue: totalRevenue._sum.amount || 0,
  };
}

async function getRecentActivity() {
  const [recentPayments, recentEnrollments] = await Promise.all([
    prisma.payment.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
        course: { select: { title: true } },
      },
    }),
    prisma.enrollment.findMany({
      take: 5,
      orderBy: { enrolledAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
        course: { select: { title: true } },
      },
    }),
  ]);

  return { recentPayments, recentEnrollments };
}

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();
  const activity = await getRecentActivity();

  const statCards = [
    {
      title: "Total Students",
      value: stats.totalStudents,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
      link: "/admin/students",
    },
    {
      title: "Total Courses",
      value: stats.totalCourses,
      icon: BookOpen,
      color: "text-green-600",
      bg: "bg-green-50",
      link: "/admin/courses",
    },
    {
      title: "Total Enrollments",
      value: stats.totalEnrollments,
      icon: ClipboardList,
      color: "text-purple-600",
      bg: "bg-purple-50",
      link: "/admin/enrollments",
    },
    {
      title: "Total Revenue",
      value: `PKR ${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      link: "/admin/payments",
    },
  ];

  const quickStats = [
    { label: "Pending Payments", value: stats.pendingPayments, color: "text-orange-600" },
    { label: "Pending Enrollments", value: stats.pendingEnrollments, color: "text-yellow-600" },
    { label: "Approved Enrollments", value: stats.approvedEnrollments, color: "text-green-600" },
    { label: "Paid Payments", value: stats.paidPayments, color: "text-blue-600" },
    { label: "Rejected Payments", value: stats.rejectedPayments, color: "text-red-600" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of your academy performance.</p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Link key={card.title} href={card.link}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{card.title}</p>
                    <p className="text-2xl font-bold mt-1">{card.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-full ${card.bg} flex items-center justify-center`}>
                    <card.icon className={`h-6 w-6 ${card.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Stats Row */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {quickStats.map((stat) => (
              <div key={stat.label} className="text-center p-4 bg-gray-50 rounded-lg">
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Payments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Recent Payments</CardTitle>
            <Link href="/admin/payments">
              <Button variant="ghost" size="sm" className="text-pild-primary">
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {activity.recentPayments.length === 0 ? (
              <p className="text-sm text-gray-400 py-4 text-center">No payments yet</p>
            ) : (
              <div className="space-y-3">
                {activity.recentPayments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{payment.user.name || payment.user.email}</p>
                      <p className="text-xs text-gray-400">{payment.course.title}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">PKR {payment.amount.toLocaleString()}</p>
                      <Badge
                        variant={
                          payment.status === "PAID"
                            ? "default"
                            : payment.status === "PENDING"
                            ? "secondary"
                            : "destructive"
                        }
                        className="text-xs"
                      >
                        {payment.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Enrollments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Recent Enrollments</CardTitle>
            <Link href="/admin/enrollments">
              <Button variant="ghost" size="sm" className="text-pild-primary">
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {activity.recentEnrollments.length === 0 ? (
              <p className="text-sm text-gray-400 py-4 text-center">No enrollments yet</p>
            ) : (
              <div className="space-y-3">
                {activity.recentEnrollments.map((enrollment) => (
                  <div key={enrollment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{enrollment.user.name || enrollment.user.email}</p>
                      <p className="text-xs text-gray-400">{enrollment.course.title}</p>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          enrollment.status === "APPROVED"
                            ? "default"
                            : enrollment.status === "PENDING"
                            ? "secondary"
                            : "destructive"
                        }
                        className="text-xs"
                      >
                        {enrollment.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/admin/payments">
              <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center gap-2">
                <CreditCard className="h-6 w-6 text-orange-600" />
                <span className="text-xs">Verify Payments</span>
              </Button>
            </Link>
            <Link href="/admin/enrollments">
              <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center gap-2">
                <ClipboardList className="h-6 w-6 text-blue-600" />
                <span className="text-xs">Approve Enrollments</span>
              </Button>
            </Link>
            <Link href="/admin/courses">
              <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center gap-2">
                <BookOpen className="h-6 w-6 text-green-600" />
                <span className="text-xs">Manage Courses</span>
              </Button>
            </Link>
            <Link href="/admin/students">
              <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center gap-2">
                <Users className="h-6 w-6 text-purple-600" />
                <span className="text-xs">Manage Students</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}