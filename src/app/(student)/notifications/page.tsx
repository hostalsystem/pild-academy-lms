import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, CheckCircle, Info, AlertTriangle, AlertCircle, Clock } from "lucide-react";
import { MarkAllReadButton } from "@/components/notifications/mark-all-read";

async function getNotifications(userId: string) {
  return await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

function getTypeIcon(type: string) {
  switch (type) {
    case "SUCCESS": return <CheckCircle className="h-5 w-5 text-green-500" />;
    case "WARNING": return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    case "ERROR": return <AlertCircle className="h-5 w-5 text-red-500" />;
    default: return <Info className="h-5 w-5 text-blue-500" />;
  }
}

function getTypeBg(type: string) {
  switch (type) {
    case "SUCCESS": return "bg-green-50 border-green-200";
    case "WARNING": return "bg-yellow-50 border-yellow-200";
    case "ERROR": return "bg-red-50 border-red-200";
    default: return "bg-blue-50 border-blue-200";
  }
}

export default async function NotificationsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const notifications = await getNotifications(session.user.id);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6 p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-500 mt-1">
            You have {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}.
          </p>
        </div>
        {unreadCount > 0 && <MarkAllReadButton />}
      </div>

      {notifications.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-500 mb-2">No Notifications</h3>
            <p className="text-gray-400">You don't have any notifications yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`border-l-4 ${notification.read ? "border-l-gray-300" : "border-l-pild-primary"}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg shrink-0 ${getTypeBg(notification.type)}`}>
                    {getTypeIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-semibold ${notification.read ? "text-gray-600" : "text-gray-900"}`}>
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <Badge className="bg-pild-primary text-white text-[10px]">New</Badge>
                      )}
                    </div>
                    <p className={`text-sm ${notification.read ? "text-gray-500" : "text-gray-700"}`}>
                      {notification.message}
                    </p>
                    <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-400">
                      <Clock className="h-3 w-3" />
                      {new Date(notification.createdAt).toLocaleDateString("en-PK", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
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