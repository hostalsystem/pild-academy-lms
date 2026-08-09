import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  User,
  CreditCard,
  ClipboardList,
  Calendar,
  Award,
  Mail,
  Phone,
  MapPin,
  Shield,
  Clock,
} from "lucide-react";
import { ProfileForm } from "@/components/profile/profile-form";
import { PasswordForm } from "@/components/profile/password-form";

async function getProfileData(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      phone: true,
      address: true,
      role: true,
      createdAt: true,
    },
  });

  const payments = await prisma.payment.findMany({
    where: { userId },
    include: {
      course: { select: { title: true, thumbnail: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    include: {
      course: { select: { title: true, thumbnail: true, slug: true } },
    },
    orderBy: { enrolledAt: "desc" },
    take: 5,
  });

  return { user, payments, enrollments };
}

function getPaymentStatusBadge(status: string) {
  switch (status) {
    case "PAID":
    case "VERIFIED":
      return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Paid</Badge>;
    case "PENDING":
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Pending</Badge>;
    case "REJECTED":
      return <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-100">Rejected</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

function getEnrollmentStatusBadge(status: string) {
  switch (status) {
    case "APPROVED":
      return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Approved</Badge>;
    case "PENDING":
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Pending</Badge>;
    case "COMPLETED":
      return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Completed</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const { user, payments, enrollments } = await getProfileData(session.user.id);

  if (!user) redirect("/login");

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-500 mt-1">
          Manage your personal information and account settings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile & Password */}
        <div className="lg:col-span-2 space-y-6">
          <ProfileForm
            initialUser={{
              ...user,
              createdAt: user.createdAt,
            }}
          />
          <PasswordForm />
        </div>

        {/* Right Column - Summary Cards */}
        <div className="space-y-6">
          {/* Account Info */}
          <Card>
            <CardContent className="p-5 space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <User className="h-4 w-4 text-pild-primary" />
                Account Summary
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="truncate">{user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Shield className="h-4 w-4 text-gray-400" />
                  <span className="uppercase text-xs tracking-wide">{user.role}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>
                    Joined{" "}
                    {new Date(user.createdAt).toLocaleDateString("en-PK", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                {user.phone && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>{user.phone}</span>
                  </div>
                )}
                {user.address && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="line-clamp-2">{user.address}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Payments */}
          <Card>
            <CardContent className="p-5 space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-pild-primary" />
                Recent Payments
              </h3>
              {payments.length === 0 ? (
                <p className="text-sm text-gray-400">No payments yet.</p>
              ) : (
                <div className="space-y-3">
                  {payments.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {payment.course.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(payment.createdAt).toLocaleDateString("en-PK")}
                        </p>
                      </div>
                      <div className="text-right shrink-0 ml-3">
                        <p className="text-sm font-bold text-gray-900">
                          PKR {payment.amount.toLocaleString()}
                        </p>
                        {getPaymentStatusBadge(payment.status)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Enrollments */}
          <Card>
            <CardContent className="p-5 space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-pild-primary" />
                Recent Enrollments
              </h3>
              {enrollments.length === 0 ? (
                <p className="text-sm text-gray-400">No enrollments yet.</p>
              ) : (
                <div className="space-y-3">
                  {enrollments.map((enrollment) => (
                    <div
                      key={enrollment.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {enrollment.course.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(enrollment.enrolledAt).toLocaleDateString("en-PK")}
                        </p>
                      </div>
                      <div className="shrink-0 ml-3">
                        {getEnrollmentStatusBadge(enrollment.status)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}