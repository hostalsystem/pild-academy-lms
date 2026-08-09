import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CreditCard,
  ArrowRight,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Wallet,
  BookOpen,
  Receipt,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

async function getPaymentData(userId: string) {
  // Get all enrollments with their latest payment
  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          slug: true,
          thumbnail: true,
          description: true,
          fee: true,
        },
      },
      payments: {
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { enrolledAt: "desc" },
  });

  const needsPayment = enrollments.filter(
    (e) =>
      e.status === "PENDING" ||
      (e.payments.length > 0 && e.payments[0].status === "REJECTED")
  );

  const paymentHistory = await prisma.payment.findMany({
    where: { userId },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          slug: true,
          thumbnail: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const totalPaid = paymentHistory
    .filter((p) => p.status === "PAID" || p.status === "VERIFIED")
    .reduce((sum, p) => sum + p.amount, 0);

  return { needsPayment, paymentHistory, totalPaid };
}

export default async function PaymentsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { needsPayment, paymentHistory, totalPaid } = await getPaymentData(
    session.user.id
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PAID":
      case "VERIFIED":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            <CheckCircle className="h-3 w-3 mr-1" /> Paid
          </Badge>
        );
      case "PENDING":
        return (
          <Badge
            variant="secondary"
            className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
          >
            <Clock className="h-3 w-3 mr-1" /> Pending
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-100">
            <XCircle className="h-3 w-3 mr-1" /> Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Make Payment</h1>
        <p className="text-gray-500 mt-1">
          Manage your course payments and view transaction history.
        </p>
      </div>

      {/* Stats Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Paid</p>
                <p className="text-2xl font-bold text-gray-900">
                  PKR {totalPaid.toLocaleString()}
                </p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <Wallet className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending Payments</p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    paymentHistory.filter((p) => p.status === "PENDING")
                      .length
                  }
                </p>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Transactions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {paymentHistory.length}
                </p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <Receipt className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Needs Payment Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-pild-primary" />
          Payment Required
        </h2>

        {needsPayment.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <CheckCircle className="h-12 w-12 text-green-300 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-500 mb-1">
                All Caught Up!
              </h3>
              <p className="text-gray-400 text-sm">
                You have no pending payments. Great job!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {needsPayment.map((enrollment) => {
              const latestPayment = enrollment.payments[0];
              const isRejected = latestPayment?.status === "REJECTED";

              return (
                <Card
                  key={enrollment.id}
                  className="overflow-hidden hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row">
                      <div className="relative w-full sm:w-40 h-40 sm:h-auto bg-gray-200 shrink-0">
                        {enrollment.course.thumbnail ? (
                          <Image
                            src={enrollment.course.thumbnail}
                            alt={enrollment.course.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <BookOpen className="h-10 w-10 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 p-5">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {enrollment.course.title}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                          {enrollment.course.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-2 mb-4">
                          <Badge
                            variant="outline"
                            className="text-pild-primary border-pild-primary/30"
                          >
                            PKR {enrollment.course.fee.toLocaleString()}
                          </Badge>
                          {latestPayment && getStatusBadge(latestPayment.status)}
                        </div>

                        <Link href={`/payment/${enrollment.course.id}`}>
                          <Button
                            className="w-full sm:w-auto bg-pild-primary gap-2"
                          >
                            <CreditCard className="h-4 w-4" />
                            {isRejected ? "Resubmit Payment" : "Pay Now"}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <Separator />

      {/* Payment History */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Receipt className="h-5 w-5 text-pild-primary" />
          Payment History
        </h2>

        {paymentHistory.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <Receipt className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-500 mb-1">
                No Transactions Yet
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Your payment history will appear here.
              </p>
              <Link href="/courses">
                <Button variant="outline" className="gap-2">
                  Browse Courses <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50/50">
                    <th className="text-left px-6 py-3 font-medium text-gray-500">
                      Course
                    </th>
                    <th className="text-left px-6 py-3 font-medium text-gray-500">
                      Method
                    </th>
                    <th className="text-left px-6 py-3 font-medium text-gray-500">
                      Transaction ID
                    </th>
                    <th className="text-left px-6 py-3 font-medium text-gray-500">
                      Amount
                    </th>
                    <th className="text-left px-6 py-3 font-medium text-gray-500">
                      Status
                    </th>
                    <th className="text-left px-6 py-3 font-medium text-gray-500">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paymentHistory.map((payment) => (
                    <tr
                      key={payment.id}
                      className="border-b last:border-0 hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-200 shrink-0">
                            {payment.course.thumbnail ? (
                              <Image
                                src={payment.course.thumbnail}
                                alt={payment.course.title}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <BookOpen className="h-5 w-5 text-gray-400 m-auto" />
                            )}
                          </div>
                          <span className="font-medium text-gray-900 line-clamp-1">
                            {payment.course.title}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 uppercase text-xs tracking-wide">
                        {payment.method}
                      </td>
                      <td className="px-6 py-4 text-gray-600 font-mono text-xs">
                        {payment.transactionId || "—"}
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        PKR {payment.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(payment.status)}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(payment.createdAt).toLocaleDateString(
                          "en-PK",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}