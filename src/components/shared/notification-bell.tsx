"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function NotificationBell() {
  const [count, setCount] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchCount();
    fetchNotifications();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const fetchCount = async () => {
    try {
      const res = await fetch("/api/notifications/unread-count");

      if (!res.ok) return;

      const data = await res.json();
      setCount(data.count || 0);
    } catch (err) {
      console.error("Failed to fetch notification count:", err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");

      if (!res.ok) return;

      const data = await res.json();
      setNotifications(data.notifications || []);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  const markRead = async (id: string) => {
    try {
      const res = await fetch(`/api/notifications/${id}/read`, {
        method: "PUT",
      });

      if (!res.ok) return;

      await fetchCount();
      await fetchNotifications();
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  return (
    <div
      ref={notificationRef}
      className="relative flex items-center"
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => setOpen((prev) => !prev)}
        className="relative h-10 w-10 rounded-full text-gray-600 hover:bg-gray-100 hover:text-blue-600"
        aria-label="Notifications"
        aria-expanded={open}
      >
        <Bell className="h-5 w-5" />

        {count > 0 && (
          <span
            className="
              absolute
              -right-0.5
              -top-0.5
              flex
              h-5
              min-w-5
              items-center
              justify-center
              rounded-full
              bg-red-500
              px-1
              text-[10px]
              font-bold
              leading-none
              text-white
              ring-2
              ring-white
            "
          >
            {count > 99 ? "99+" : count}
          </span>
        )}
      </Button>

      {open && (
        <>
          {/* Mobile backdrop */}
          <div
            className="fixed inset-0 z-[90] bg-black/10 sm:hidden"
            onClick={() => setOpen(false)}
          />

          {/* Notification dropdown */}
          <div
            className="
              fixed
              left-4
              right-4
              top-[72px]
              z-[100]
              overflow-hidden
              rounded-xl
              border
              border-gray-200
              bg-white
              shadow-2xl
              sm:absolute
              sm:left-auto
              sm:right-0
              sm:top-full
              sm:mt-2
              sm:w-80
            "
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b bg-white p-3">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-blue-600" />

                <span className="text-sm font-semibold text-gray-900">
                  Notifications
                </span>

                {count > 0 && (
                  <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-600">
                    {count} new
                  </span>
                )}
              </div>

              <Link
                href="/notifications"
                onClick={() => setOpen(false)}
                className="text-xs font-medium text-blue-600 hover:underline"
              >
                View All
              </Link>
            </div>

            {/* Notifications list */}
            <div className="max-h-[calc(100vh-150px)] overflow-y-auto sm:max-h-96">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center px-6 py-10 text-center">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                    <Bell className="h-5 w-5 text-gray-400" />
                  </div>

                  <p className="text-sm font-medium text-gray-700">
                    No notifications
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    You are all caught up.
                  </p>
                </div>
              ) : (
                notifications.slice(0, 10).map((n) => (
                  <div
                    key={n.id}
                    className={`border-b p-3 transition-colors last:border-0 hover:bg-gray-50 ${
                      !n.read ? "bg-blue-50/60" : "bg-white"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Notification indicator */}
                      <div
                        className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                          !n.read ? "bg-blue-600" : "bg-gray-300"
                        }`}
                      />

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {n.title}
                        </p>

                        <p className="mt-0.5 line-clamp-2 text-xs text-gray-500">
                          {n.message}
                        </p>

                        <div className="mt-2 flex items-center justify-between gap-2">
                          <span className="text-[10px] text-gray-400">
                            {new Date(n.createdAt).toLocaleDateString(
                              "en-PK"
                            )}
                          </span>

                          {!n.read && (
                            <button
                              type="button"
                              onClick={() => markRead(n.id)}
                              className="flex items-center gap-1 text-[10px] font-medium text-blue-600 hover:underline"
                            >
                              <CheckCircle className="h-3 w-3" />
                              Mark read
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}