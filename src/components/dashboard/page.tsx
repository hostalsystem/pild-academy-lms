import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BookOpen, 
  CheckCircle, 
  Clock, 
  CreditCard, 
  Award, 
  Video,
  TrendingUp,
  Bell
} from "lucide-react";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      enrollments: {
        include: {
          course: true,
        },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  const activeEnrollments = user.enrollments.filter((e) => e.status === "APPROVED");
  const pendingEnrollments = user.enrollments.filter((e) => e.status === "PENDING");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user.name || "Student"}!
          </h1>
          <p className="text-gray-500 mt-1">
            Here&apos;s what&apos;s happening with your learning
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Active Courses</p>
                  <p className="text-3xl font-bold text-pild-primary">{activeEnrollments.length}</p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Pending Payments</p>
                  <p className="text-3xl font-bold text-yellow-600">{pendingEnrollments.length}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Certificates</p>
                  <p className="text-3xl font-bold text-green-600">0</p>
                </div>
                <Award className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Progress</p>
                  <p className="text-3xl font-bold text-purple-600">0%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: My Courses */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">My Courses</CardTitle>
              </CardHeader>
              <CardContent>
                {activeEnrollments.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-500 mb-2">
                      You are not enrolled in any course yet.
                    </h3>
                    <p className="text-gray-400 mb-4">
                      Browse our courses and start your learning journey today.
                    </p>
                    <Link href="/courses">
                      <Button className="bg-pild-primary hover:bg-pild-primary/90">
                        Browse Courses
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeEnrollments.map((enrollment) => (
                      <div
                        key={enrollment.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <h4 className="font-semibold">{enrollment.course.title}</h4>
                          <p className="text-sm text-gray-500">
                            Enrolled on {new Date(enrollment.enrolledAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Link href={`/my-learning/${enrollment.course.id}`}>
                          <Button size="sm" variant="outline">Continue</Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-400">
                  <Bell className="h-12 w-12 mx-auto mb-2" />
                  <p>No recent activity</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Sidebar Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/courses">
                  <Button variant="outline" className="w-full justify-start">
                    <BookOpen className="mr-2 h-4 w-4" /> Browse Courses
                  </Button>
                </Link>
                <Link href="/my-learning">
                  <Button variant="outline" className="w-full justify-start">
                    <CheckCircle className="mr-2 h-4 w-4" /> My Learning
                  </Button>
                </Link>
                <Link href="/payments">
                  <Button variant="outline" className="w-full justify-start">
                    <CreditCard className="mr-2 h-4 w-4" /> Payments
                  </Button>
                </Link>
                <Link href="/zoom-classes">
                  <Button variant="outline" className="w-full justify-start">
                    <Video className="mr-2 h-4 w-4" /> Zoom Classes
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">No new notifications</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}