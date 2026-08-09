import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CheckCircle,
  XCircle,
  Clock,
  CreditCard,
  User,
  BookOpen,
  Calendar,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import Image from "next/image";

async function getPayments(status?: string) {
  return await prisma.payment.findMany({
    where: status ? { status } : {},
    include: {
      user: {
        select: { name: true, email: true, image: true },
      },
      course: {
        select: { title: true, slug: true, fee: true },
      },
      enrollment: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

async function verifyPayment(paymentId: string, action: "verify" | "reject") {
  "use server";
  
  const status = action === "verify" ? "PAID" : "REJECTED";
  
  await prisma.payment.update({
    where: { id: paymentId },
    data: {
      status,
      verifiedAt: new Date(),
    },
  });

  // If verified, also approve the enrollment
  if (action === "verify") {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      select: { enrollmentId: true },
    });
    
    if (payment?.enrollmentId) {
      await prisma.enrollment.update({
        where: { id: payment.enrollmentId },
        data: { status: "APPROVED" },
      });
    }
  }

  // If rejected, keep enrollment as PENDING so student can retry
}

export default async function AdminPaymentsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Simple role check - in production use proper admin middleware
  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const [pendingPayments, allPayments] = await Promise.all([
    getPayments("PENDING"),
    getPayments(),
  ]);

  const stats = {
    total: allPayments.length,
    pending: allPayments.filter((p) => p.status === "PENDING").length,
    paid: allPayments.filter((p) => p.status === "PAID").length,
    rejected: allPayments.filter((p) => p.status === "REJECTED").length,
    totalRevenue: allPayments
      .filter((p) => p.status === "PAID")
      .reduce((sum, p) => sum + p.amount, 0),
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Payment Management</h1>
        <p className="text-gray-500 mt-1">Verify and manage student payments.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Payments</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Verified</p>
                <p className="text-2xl font-bold text-green-600">{stats.paid}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold text-purple-600">PKR {stats.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payments Table */}
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
          <TabsTrigger value="verified">Verified ({stats.paid})</TabsTrigger>
          <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          <PaymentsTable payments={pendingPayments} showActions={true} />
        </TabsContent>

        <TabsContent value="verified" className="mt-6">
          <PaymentsTable payments={allPayments.filter((p) => p.status === "PAID")} showActions={false} />
        </TabsContent>

        <TabsContent value="all" className="mt-6">
          <PaymentsTable payments={allPayments} showActions={false} />
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
          <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No payments found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Student</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Course</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Amount</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Method</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Transaction ID</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Status</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Date</th>
                {showActions && <th className="text-left p-4 text-sm font-medium text-gray-500">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y">
              {payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold">
                        {payment.user.name?.[0] || "?"}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{payment.user.name || "Unknown"}</p>
                        <p className="text-xs text-gray-400">{payment.user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-sm font-medium">{payment.course.title}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-sm font-bold">PKR {payment.amount.toLocaleString()}</p>
                  </td>
                  <td className="p-4">
                    <Badge variant="outline">{payment.method}</Badge>
                  </td>
                  <td className="p-4">
                    <p className="text-sm font-mono">{payment.transactionId}</p>
                  </td>
                  <td className="p-4">
                    {payment.status === "PENDING" && (
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                        <Clock className="h-3 w-3 mr-1" /> Pending
                      </Badge>
                    )}
                    {payment.status === "PAID" && (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                        <CheckCircle className="h-3 w-3 mr-1" /> Verified
                      </Badge>
                    )}
                    {payment.status === "REJECTED" && (
                      <Badge variant="destructive">
                        <XCircle className="h-3 w-3 mr-1" /> Rejected
                      </Badge>
                    )}
                  </td>
                  <td className="p-4">
                    <p className="text-sm text-gray-400">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </p>
                  </td>
                  {showActions && (
                    <td className="p-4">
                      <div className="flex gap-2">
                        <form action={async () => {
                          "use server";
                          await verifyPayment(payment.id, "verify");
                        }}>
                          <Button type="submit" size="sm" className="bg-green-600 hover:bg-green-700">
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        </form>
                        <form action={async () => {
                          "use server";
                          await verifyPayment(payment.id, "reject");
                        }}>
                          <Button type="submit" size="sm" variant="destructive">
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