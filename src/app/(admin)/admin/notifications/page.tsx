import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Bell,
  Send,
  Users,
  CheckCircle,
  AlertCircle,
  Info,
  AlertTriangle,
  Trash2,
  Clock,
  MessageSquare,
} from "lucide-react";
import { NotificationForm } from "@/components/admin/notification-form";

async function getAdminNotifications() {
  const notifications = await prisma.notification.findMany({
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const students = await prisma.user.findMany({
    where: { role: "STUDENT" },
    select: { id: true, name: true, email: true },
    orderBy: { name: "asc" },
  });

  return { notifications, students };
}

function getTypeBadge(type: string) {
  switch (type) {
    case "SUCCESS":
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 gap-1">
          <CheckCircle className="h-3 w-3" /> Success
        </Badge>
      );
    case "WARNING":
      return (
        <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 gap-1">
          <AlertTriangle className="h-3 w-3" /> Warning
        </Badge>
      );
    case "ERROR":
      return (
        <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-100 gap-1">
          <AlertCircle className="h-3 w-3" /> Error
        </Badge>
      );
    default:
      return (
        <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100 gap-1">
          <Info className="h-3 w-3" /> Info
        </Badge>
      );
  }
}

export default async function AdminNotificationsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const { notifications, students } = await getAdminNotifications();

  const total = notifications.length;
  const broadcast = notifications.filter((n) => !n.userId).length;
  const direct = notifications.filter((n) => n.userId).length;
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-500 mt-1">
            Send and manage notifications to students.
          </p>
        </div>
        <NotificationForm students={students} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Total Sent</p>
              <p className="text-2xl font-bold">{total}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <Bell className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Broadcasts</p>
              <p className="text-2xl font-bold text-purple-600">{broadcast}</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Direct</p>
              <p className="text-2xl font-bold text-green-600">{direct}</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <MessageSquare className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Unread</p>
              <p className="text-2xl font-bold text-yellow-600">{unread}</p>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <AlertCircle className="h-6 w-6 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-5 w-5 text-pild-primary" />
            Sent Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No notifications sent yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-start justify-between gap-4 p-4 border rounded-lg hover:bg-gray-50/50 transition-colors"
                >
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      {getTypeBadge(notification.type)}
                      {!notification.read && (
                        <Badge
                          variant="secondary"
                          className="bg-red-100 text-red-700 text-[10px]"
                        >
                          Unread
                        </Badge>
                      )}
                    </div>
                    <h4 className="font-semibold text-gray-900">
                      {notification.title}
                    </h4>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {notification.message}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(notification.createdAt).toLocaleDateString("en-PK", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {notification.user ? (
                        <span className="text-pild-primary">
                          To: {notification.user.name || notification.user.email}
                        </span>
                      ) : (
                        <span className="text-purple-600 font-medium">
                          Broadcast to all students
                        </span>
                      )}
                    </div>
                  </div>
                  <form
                    action={async () => {
                      "use server";
                      await prisma.notification.delete({
                        where: { id: notification.id },
                      });
                    }}
                  >
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 shrink-0"
                      type="submit"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}