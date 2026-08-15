import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  CheckCircle,
  XCircle,
  Clock,
  CreditCard,
  Image as ImageIcon,
  ExternalLink,
} from "lucide-react";

async function getPayments(status?: string) {
  return await prisma.payment.findMany({
    where: status ? { status } : {},
    include: {
      user: {
        select: {
          name: true,
          email: true,
          image: true,
        },
      },
      course: {
        select: {
          title: true,
          slug: true,
          fee: true,
        },
      },
      enrollment: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

async function verifyPayment(
  paymentId: string,
  action: "verify" | "reject"
) {
  "use server";

  const status = action === "verify" ? "PAID" : "REJECTED";

  await prisma.payment.update({
    where: {
      id: paymentId,
    },
    data: {
      status,
      verifiedAt: new Date(),
    },
  });

  if (action === "verify") {
    const payment = await prisma.payment.findUnique({
      where: {
        id: paymentId,
      },
      select: {
        enrollmentId: true,
      },
    });

    if (payment?.enrollmentId) {
      await prisma.enrollment.update({
        where: {
          id: payment.enrollmentId,
        },
        data: {
          status: "APPROVED",
        },
      });
    }
  }
}

export default async function AdminPaymentsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const [pendingPayments, allPayments] = await Promise.all([
    getPayments("PENDING"),
    getPayments(),
  ]);

  const stats = {
    total: allPayments.length,

    pending: allPayments.filter(
      (p) => p.status === "PENDING"
    ).length,

    paid: allPayments.filter(
      (p) => p.status === "PAID"
    ).length,

    rejected: allPayments.filter(
      (p) => p.status === "REJECTED"
    ).length,

    totalRevenue: allPayments
      .filter((p) => p.status === "PAID")
      .reduce((sum, p) => sum + p.amount, 0),
  };

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}

      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Payment Management
        </h1>

        <p className="mt-1 text-gray-500">
          Verify and manage student payments.
        </p>
      </div>

      {/* STATS */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* TOTAL */}

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Total Payments
                </p>

                <p className="text-2xl font-bold">
                  {stats.total}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* PENDING */}

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Pending
                </p>

                <p className="text-2xl font-bold text-orange-600">
                  {stats.pending}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-50">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* VERIFIED */}

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Verified
                </p>

                <p className="text-2xl font-bold text-green-600">
                  {stats.paid}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* REVENUE */}

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Total Revenue
                </p>

                <p className="text-2xl font-bold text-purple-600">
                  PKR {stats.totalRevenue.toLocaleString()}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-50">
                <CreditCard className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* PAYMENT TABS */}

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="pending">
            Pending ({stats.pending})
          </TabsTrigger>

          <TabsTrigger value="verified">
            Verified ({stats.paid})
          </TabsTrigger>

          <TabsTrigger value="all">
            All ({stats.total})
          </TabsTrigger>
        </TabsList>

        {/* PENDING */}

        <TabsContent value="pending" className="mt-6">
          <PaymentsTable
            payments={pendingPayments}
            showActions={true}
          />
        </TabsContent>

        {/* VERIFIED */}

        <TabsContent value="verified" className="mt-6">
          <PaymentsTable
            payments={allPayments.filter(
              (p) => p.status === "PAID"
            )}
            showActions={false}
          />
        </TabsContent>

        {/* ALL */}

        <TabsContent value="all" className="mt-6">
          <PaymentsTable
            payments={allPayments}
            showActions={false}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function PaymentsTable({
  payments,
  showActions,
}: {
  payments: any[];
  showActions: boolean;
}) {
  if (payments.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <CreditCard className="mx-auto mb-4 h-12 w-12 text-gray-300" />

          <p className="text-gray-500">
            No payments found.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="p-4 text-left text-sm font-medium text-gray-500">
                  Student
                </th>

                <th className="p-4 text-left text-sm font-medium text-gray-500">
                  Course
                </th>

                <th className="p-4 text-left text-sm font-medium text-gray-500">
                  Amount
                </th>

                <th className="p-4 text-left text-sm font-medium text-gray-500">
                  Method
                </th>

                <th className="p-4 text-left text-sm font-medium text-gray-500">
                  Transaction ID
                </th>

                {/* NEW SCREENSHOT COLUMN */}

                <th className="p-4 text-left text-sm font-medium text-gray-500">
                  Payment Proof
                </th>

                <th className="p-4 text-left text-sm font-medium text-gray-500">
                  Status
                </th>

                <th className="p-4 text-left text-sm font-medium text-gray-500">
                  Date
                </th>

                {showActions && (
                  <th className="p-4 text-left text-sm font-medium text-gray-500">
                    Actions
                  </th>
                )}
              </tr>
            </thead>

            <tbody className="divide-y">
              {payments.map((payment) => (
                <tr
                  key={payment.id}
                  className="hover:bg-gray-50"
                >
                  {/* STUDENT */}

                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs font-bold">
                        {payment.user.name?.[0] || "?"}
                      </div>

                      <div>
                        <p className="text-sm font-medium">
                          {payment.user.name || "Unknown"}
                        </p>

                        <p className="text-xs text-gray-400">
                          {payment.user.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* COURSE */}

                  <td className="p-4">
                    <p className="text-sm font-medium">
                      {payment.course.title}
                    </p>
                  </td>

                  {/* AMOUNT */}

                  <td className="p-4">
                    <p className="text-sm font-bold">
                      PKR {payment.amount.toLocaleString()}
                    </p>
                  </td>

                  {/* METHOD */}

                  <td className="p-4">
                    <Badge variant="outline">
                      {payment.method}
                    </Badge>
                  </td>

                  {/* TRANSACTION ID */}

                  <td className="p-4">
                    <p className="max-w-[180px] break-all font-mono text-sm">
                      {payment.transactionId || "N/A"}
                    </p>
                  </td>

                  {/* PAYMENT SCREENSHOT */}

                  <td className="p-4">
                    {payment.screenshotUrl ? (
                      <div className="flex flex-col items-start gap-2">
                        <a
                          href={payment.screenshotUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group relative block"
                        >
                          <img
                            src={payment.screenshotUrl}
                            alt="Payment screenshot"
                            className="h-20 w-28 rounded-lg border border-gray-200 bg-gray-100 object-cover transition-all group-hover:scale-105 group-hover:shadow-lg"
                          />

                          <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/0 transition-all group-hover:bg-black/30">
                            <ExternalLink className="h-5 w-5 text-white opacity-0 transition-all group-hover:opacity-100" />
                          </div>
                        </a>

                        <span className="flex items-center gap-1 text-xs font-medium text-green-600">
                          <CheckCircle className="h-3.5 w-3.5" />
                          Uploaded
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-3">
                        <ImageIcon className="mb-1 h-5 w-5 text-gray-400" />

                        <span className="text-xs text-gray-400">
                          No screenshot
                        </span>
                      </div>
                    )}
                  </td>

                  {/* STATUS */}

                  <td className="p-4">
                    {payment.status === "PENDING" && (
                      <Badge
                        variant="secondary"
                        className="bg-yellow-100 text-yellow-700"
                      >
                        <Clock className="mr-1 h-3 w-3" />
                        Pending
                      </Badge>
                    )}

                    {payment.status === "PAID" && (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Verified
                      </Badge>
                    )}

                    {payment.status === "REJECTED" && (
                      <Badge variant="destructive">
                        <XCircle className="mr-1 h-3 w-3" />
                        Rejected
                      </Badge>
                    )}
                  </td>

                  {/* DATE */}

                  <td className="p-4">
                    <p className="text-sm text-gray-400">
                      {new Date(
                        payment.createdAt
                      ).toLocaleDateString()}
                    </p>
                  </td>

                  {/* ACTIONS */}

                  {showActions && (
                    <td className="p-4">
                      <div className="flex gap-2">
                        {/* VERIFY */}

                        <form
                          action={async () => {
                            "use server";

                            await verifyPayment(
                              payment.id,
                              "verify"
                            );
                          }}
                        >
                          <Button
                            type="submit"
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        </form>

                        {/* REJECT */}

                        <form
                          action={async () => {
                            "use server";

                            await verifyPayment(
                              payment.id,
                              "reject"
                            );
                          }}
                        >
                          <Button
                            type="submit"
                            size="sm"
                            variant="destructive"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </form>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}