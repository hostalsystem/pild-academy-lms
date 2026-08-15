import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  CheckCircle,
  Clock,
  CreditCard,
  Award,
  Video,
  Bell,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

async function getDashboardData(userId: string) {
  const [
    activeEnrollments,
    completedEnrollments,
    pendingPayments,
    totalPaid,
    certificates,
    recentEnrollments,
    recentPayments,
  ] = await Promise.all([
    // Active courses (approved enrollments)
    prisma.enrollment.count({
      where: { userId, status: "APPROVED" },
    }),
    // Completed courses
    prisma.enrollment.count({
      where: { userId, status: "COMPLETED" },
    }),
    // Pending payments
    prisma.payment.count({
      where: { userId, status: "PENDING" },
    }),
    // Total fees paid
    prisma.payment.aggregate({
      where: { userId, status: "PAID" },
      _sum: { amount: true },
    }),
    // Certificates
    0, // Will add Certificate model later
    // Recent enrollments
    prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          select: { title: true, thumbnail: true, slug: true },
        },
      },
      orderBy: { enrolledAt: "desc" },
      take: 3,
    }),
    // Recent payments
    prisma.payment.findMany({
      where: { userId },
      include: {
        course: {
          select: { title: true, slug: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
  ]);

  return {
    activeEnrollments,
    completedEnrollments,
    pendingPayments,
    totalPaid: totalPaid._sum.amount || 0,
    certificates,
    recentEnrollments,
    recentPayments,
  };
}

export default async function StudentDashboard() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const data = await getDashboardData(session.user.id);

  const statsCards = [
    {
      title: "Active Courses",
      value: data.activeEnrollments,
      icon: BookOpen,
      color: "text-blue-600",
      bg: "bg-blue-50",
      link: "/my-learning",
    },
    {
      title: "Completed",
      value: data.completedEnrollments,
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-50",
      link: "/certificates",
    },
    {
      title: "Pending Payments",
      value: data.pendingPayments,
      icon: Clock,
      color: "text-orange-600",
      bg: "bg-orange-50",
      link: "/payments",
    },
    {
      title: "Total Paid",
      value: `PKR ${data.totalPaid.toLocaleString()}`,
      icon: CreditCard,
      color: "text-purple-600",
      bg: "bg-purple-50",
      link: "/payments",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {session.user.name || "Student"}!</h1>
        <p className="text-gray-500 mt-1">Here's what's happening with your learning journey.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((card) => (
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Enrollments */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Recent Enrollments</CardTitle>
            <Link href="/my-enrollments">
              <Button variant="ghost" size="sm" className="text-pild-primary">
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {data.recentEnrollments.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <BookOpen className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>You are not enrolled in any course yet.</p>
                <Link href="/courses">
                  <Button className="mt-4 bg-pild-primary">Browse Courses</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {data.recentEnrollments.map((enrollment) => (
                  <div
                    key={enrollment.id}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-200 shrink-0">
                      {enrollment.course.thumbnail ? (
                        <Image
                          src={enrollment.course.thumbnail}
                          alt={enrollment.course.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <BookOpen className="h-8 w-8 m-4 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{enrollment.course.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant={
                            enrollment.status === "APPROVED"
                              ? "default"
                              : enrollment.status === "PENDING"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {enrollment.status}
                        </Badge>
                        <span className="text-xs text-gray-400">
                          {new Date(enrollment.enrolledAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Link href={`/my-learning/${enrollment.course.slug}`}>
                      <Button size="sm" variant="outline">
                        {enrollment.status === "APPROVED" ? "Continue" : "View"}
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Recent Payments */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Recent Payments</CardTitle>
            </CardHeader>
            <CardContent>
              {data.recentPayments.length === 0 ? (
                <p className="text-sm text-gray-400 py-4 text-center">No payments yet</p>
              ) : (
                <div className="space-y-3">
                  {data.recentPayments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium truncate max-w-[150px]">{payment.course.title}</p>
                        <p className="text-xs text-gray-400">{payment.method}</p>
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

          {/* Quick Links */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/my-learning">
                <Button variant="outline" className="w-full justify-start">
                  <BookOpen className="h-4 w-4 mr-2" /> Continue Learning
                </Button>
              </Link>
              <Link href="/zoom-classes">
                <Button variant="outline" className="w-full justify-start">
                  <Video className="h-4 w-4 mr-2" /> Upcoming Classes
                </Button>
              </Link>
              <Link href="/certificates">
                <Button variant="outline" className="w-full justify-start">
                  <Award className="h-4 w-4 mr-2" /> My Certificates
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}