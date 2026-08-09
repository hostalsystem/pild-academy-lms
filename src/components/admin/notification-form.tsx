"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send, Loader2, Users, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface Student {
  id: string;
  name: string | null;
  email: string;
}

interface NotificationFormProps {
  students: Student[];
}

export function NotificationForm({ students }: NotificationFormProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("INFO");
  const [target, setTarget] = useState<"all" | "specific">("all");
  const [userId, setUserId] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;

    setLoading(true);
    try {
      const res = await fetch("/api/admin/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          message,
          type,
          userId: target === "specific" ? userId : null,
        }),
      });

      if (res.ok) {
        setOpen(false);
        setTitle("");
        setMessage("");
        setType("INFO");
        setTarget("all");
        setUserId("");
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to send");
      }
    } catch {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const typeOptions = [
    { value: "INFO", label: "Info", color: "bg-blue-100 text-blue-700 border-blue-200" },
    { value: "SUCCESS", label: "Success", color: "bg-green-100 text-green-700 border-green-200" },
    { value: "WARNING", label: "Warning", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
    { value: "ERROR", label: "Error", color: "bg-red-100 text-red-700 border-red-200" },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="bg-pild-primary gap-2">
          <Send className="h-4 w-4" />
          Send Notification
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Send Notification</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-5 mt-6">
          {/* Target */}
          <div className="space-y-2">
            <Label>Target</Label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setTarget("all")}
                className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  target === "all"
                    ? "bg-purple-100 border-purple-300 text-purple-700"
                    : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Users className="h-4 w-4" />
                All Students
              </button>
              <button
                type="button"
                onClick={() => setTarget("specific")}
                className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  target === "specific"
                    ? "bg-purple-100 border-purple-300 text-purple-700"
                    : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <User className="h-4 w-4" />
                Specific Student
              </button>
            </div>
          </div>

          {target === "specific" && (
            <div className="space-y-1.5">
              <Label>Select Student</Label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required={target === "specific"}
              >
                <option value="">Choose a student</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name || s.email}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Type */}
          <div className="space-y-2">
            <Label>Notification Type</Label>
            <div className="grid grid-cols-2 gap-2">
              {typeOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setType(opt.value)}
                  className={`py-2 rounded-lg border text-sm font-medium transition-all ${
                    type === opt.value ? opt.color + " ring-1" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <Label>Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. New Assignment Posted"
              required
            />
          </div>

          {/* Message */}
          <div className="space-y-1.5">
            <Label>Message</Label>
            <textarea
              className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your notification message..."
              rows={4}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-pild-primary gap-2"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            {loading ? "Sending..." : "Send Notification"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}