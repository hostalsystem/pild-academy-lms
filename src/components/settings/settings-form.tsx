"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Save,
  Bell,
  Palette,
  Globe,
  Trash2,
  AlertTriangle,
  Moon,
  Sun,
  Monitor,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface SettingsData {
  emailNotifications: {
    assignments: boolean;
    classes: boolean;
    payments: boolean;
    grades: boolean;
    certificates: boolean;
  };
  theme: "light" | "dark" | "system";
  language: "en" | "ur";
}

interface SettingsFormProps {
  initialSettings: SettingsData;
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const router = useRouter();
  const [settings, setSettings] = useState<SettingsData>(initialSettings);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const toggleNotification = (key: keyof SettingsData["emailNotifications"]) => {
    setSettings((prev) => ({
      ...prev,
      emailNotifications: {
        ...prev.emailNotifications,
        [key]: !prev.emailNotifications[key],
      },
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setMessage({ type: "success", text: "Settings saved successfully!" });
        router.refresh();
      } else {
        setMessage({ type: "error", text: "Failed to save settings" });
      }
    } catch {
      setMessage({ type: "error", text: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletePassword) return;
    setDeleting(true);
    setDeleteError("");
    try {
      const res = await fetch("/api/profile/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: deletePassword }),
      });
      const data = await res.json();
      if (data.success) {
        window.location.href = "/";
      } else {
        setDeleteError(data.error || "Failed to delete account");
      }
    } catch {
      setDeleteError("Something went wrong");
    } finally {
      setDeleting(false);
    }
  };

  const notificationItems = [
    {
      key: "assignments" as const,
      label: "New Assignments",
      description: "Get notified when a new assignment is posted",
    },
    {
      key: "classes" as const,
      label: "Upcoming Classes",
      description: "Reminders before live Zoom sessions start",
    },
    {
      key: "payments" as const,
      label: "Payment Updates",
      description: "Status changes for your payments",
    },
    {
      key: "grades" as const,
      label: "Grades & Feedback",
      description: "When your assignments are graded",
    },
    {
      key: "certificates" as const,
      label: "Certificates",
      description: "When you earn a new certificate",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-5 w-5 text-pild-primary" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {notificationItems.map((item) => (
            <div
              key={item.key}
              className="flex items-start justify-between gap-4 py-3 border-b last:border-0"
            >
              <div>
                <p className="font-medium text-gray-900">{item.label}</p>
                <p className="text-xs text-gray-500">{item.description}</p>
              </div>
              <button
                onClick={() => toggleNotification(item.key)}
                className={cn(
                  "relative w-11 h-6 rounded-full transition-colors shrink-0",
                  settings.emailNotifications[item.key]
                    ? "bg-pild-primary"
                    : "bg-gray-300"
                )}
              >
                <span
                  className={cn(
                    "absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform",
                    settings.emailNotifications[item.key]
                      ? "translate-x-5"
                      : "translate-x-0"
                  )}
                />
              </button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Display */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Palette className="h-5 w-5 text-pild-primary" />
            Display
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="font-medium text-gray-900 mb-3">Theme</p>
            <div className="flex gap-2">
              {[
                { value: "light" as const, icon: Sun, label: "Light" },
                { value: "dark" as const, icon: Moon, label: "Dark" },
                { value: "system" as const, icon: Monitor, label: "System" },
              ].map((theme) => (
                <button
                  key={theme.value}
                  onClick={() =>
                    setSettings((prev) => ({ ...prev, theme: theme.value }))
                  }
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-medium transition-all",
                    settings.theme === theme.value
                      ? "bg-pild-primary text-white border-pild-primary"
                      : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                  )}
                >
                  <theme.icon className="h-4 w-4" />
                  {theme.label}
                </button>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <p className="font-medium text-gray-900 mb-3">Language</p>
            <div className="flex gap-2">
              {[
                { value: "en" as const, label: "English" },
                { value: "ur" as const, label: "اردو" },
              ].map((lang) => (
                <button
                  key={lang.value}
                  onClick={() =>
                    setSettings((prev) => ({ ...prev, language: lang.value }))
                  }
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-medium transition-all",
                    settings.language === lang.value
                      ? "bg-pild-primary text-white border-pild-primary"
                      : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                  )}
                >
                  {settings.language === lang.value && (
                    <Check className="h-4 w-4" />
                  )}
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      {message && (
        <Alert
          variant={message.type === "error" ? "destructive" : "default"}
          className={
            message.type === "success"
              ? "bg-green-50 text-green-800 border-green-200"
              : ""
          }
        >
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <Button
        onClick={handleSave}
        disabled={loading}
        className="bg-pild-primary gap-2 w-full sm:w-auto"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Save className="h-4 w-4" />
        )}
        {loading ? "Saving..." : "Save Settings"}
      </Button>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Once you delete your account, there is no going back. All your data,
            enrollments, and progress will be permanently removed.
          </p>
          <Button
            variant="outline"
            className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 gap-2"
            onClick={() => setShowDeleteModal(true)}
          >
            <Trash2 className="h-4 w-4" />
            Delete Account
          </Button>
        </CardContent>
      </Card>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-red-600 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Delete Account
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                This action cannot be undone. Please enter your password to
                confirm.
              </p>
              <input
                type="password"
                placeholder="Enter your password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
              {deleteError && (
                <p className="text-sm text-red-600">{deleteError}</p>
              )}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeletePassword("");
                    setDeleteError("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-red-600 hover:bg-red-700 gap-2"
                  onClick={handleDelete}
                  disabled={deleting || !deletePassword}
                >
                  {deleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  {deleting ? "Deleting..." : "Delete Forever"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}