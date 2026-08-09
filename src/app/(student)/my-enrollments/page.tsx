import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BookOpen, ArrowRight, Clock, CheckCircle, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

async function getMyEnrollments(userId: string) {
  return await prisma.enrollment.findMany({
    where: { userId },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          slug: true,
          thumbnail: true,
          description: true,
          duration: true,
          fee: true,
        },
      },
      payments: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: { enrolledAt: "desc" },
  });
}

export default async function MyEnrollmentsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const enrollments = await getMyEnrollments(session.user.id);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100"><CheckCircle className="h-3 w-3 mr-1" /> Approved</Badge>;
      case "PENDING":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
      case "REJECTED":
        return <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-100"><XCircle className="h-3 w-3 mr-1" /> Rejected</Badge>;
      case "COMPLETED":
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100"><CheckCircle className="h-3 w-3 mr-1" /> Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (payment: any) => {
    if (!payment) return <Badge variant="outline">Not Paid</Badge>;
    switch (payment.status) {
      case "PAID":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Paid</Badge>;
      case "PENDING":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Payment Pending</Badge>;
      case "REJECTED":
        return <Badge variant="destructive">Payment Rejected</Badge>;
      default:
        return <Badge variant="outline">{payment.status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Enrollments</h1>
        <p className="text-gray-500 mt-1">Track all your course enrollments and their status.</p>
      </div>

      {enrollments.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-500 mb-2">No Enrollments Yet</h3>
            <p className="text-gray-400 mb-6">You haven't enrolled in any courses yet.</p>
            <Link href="/courses">
              <Button className="bg-pild-primary">
                Browse Courses <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {enrollments.map((enrollment) => (
            <Card key={enrollment.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  {/* Course Image */}
                  <div className="relative w-full md:w-48 h-48 md:h-auto bg-gray-200 shrink-0">
                    {enrollment.course.thumbnail ? (
                      <Image
                        src={enrollment.course.thumbnail}
                        alt={enrollment.course.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <BookOpen className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">{enrollment.course.title}</h3>
                        <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                          {enrollment.course.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {getStatusBadge(enrollment.status)}
                          {getPaymentStatusBadge(enrollment.payments[0])}
                          <Badge variant="outline">{enrollment.course.duration}</Badge>
                        </div>

                        <div className="text-sm text-gray-400">
                          Enrolled on {new Date(enrollment.enrolledAt).toLocaleDateString("en-PK", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 shrink-0">
                        {enrollment.status === "APPROVED" && (
                          <Link href={`/my-learning/${enrollment.course.slug}`}>
                            <Button className="bg-pild-primary w-full md:w-auto">
                              Continue Learning
                            </Button>
                          </Link>
                        )}
                        {enrollment.status === "PENDING" && (
                          <Link href={`/courses/${enrollment.course.slug}`}>
                            <Button variant="outline" className="w-full md:w-auto">
                              View Course
                            </Button>
                          </Link>
                        )}
                        {enrollment.payments[0]?.status === "PENDING" && (
                          <Link href={`/payment/${enrollment.course.id}`}>
                            <Button variant="outline" className="w-full md:w-auto text-orange-600 border-orange-200 hover:bg-orange-50">
                              Check Payment Status
                            </Button>
                          </Link>
                        )}
                        {enrollment.payments[0]?.status === "REJECTED" && (
                          <Link href={`/payment/${enrollment.course.id}`}>
                            <Button variant="outline" className="w-full md:w-auto text-red-600 border-red-200 hover:bg-red-50">
                              Resubmit Payment
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}