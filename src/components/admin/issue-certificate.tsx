"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Award, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface Enrollment {
  id: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
  course: {
    id: string;
    title: string;
    thumbnail: string | null;
  };
  completedAt: Date | null;
}

interface IssueCertificateProps {
  enrollment: Enrollment;
}

export function IssueCertificate({ enrollment }: IssueCertificateProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [issued, setIssued] = useState(false);

  const handleIssue = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/certificates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enrollmentId: enrollment.id }),
      });

      if (res.ok) {
        setIssued(true);
        setTimeout(() => {
          setOpen(false);
          router.refresh();
        }, 1500);
      } else {
        const data = await res.json();
        alert(data.error || "Failed to issue certificate");
      }
    } catch {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="sm" className="bg-pild-primary gap-1.5">
          <Award className="h-3.5 w-3.5" />
          Issue
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Issue Certificate</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <p className="text-sm text-gray-500">Student</p>
            <p className="font-semibold text-gray-900">{enrollment.user.name || "Unnamed"}</p>
            <p className="text-xs text-gray-500">{enrollment.user.email}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <p className="text-sm text-gray-500">Course</p>
            <p className="font-semibold text-gray-900">{enrollment.course.title}</p>
            {enrollment.completedAt && (
              <p className="text-xs text-gray-500">
                Completed on {new Date(enrollment.completedAt).toLocaleDateString("en-PK")}
              </p>
            )}
          </div>

          {issued ? (
            <div className="bg-green-50 text-green-800 rounded-lg p-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Certificate issued successfully!
            </div>
          ) : (
            <Button
              onClick={handleIssue}
              disabled={loading}
              className="w-full bg-pild-primary gap-2"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Award className="h-4 w-4" />
              )}
              {loading ? "Issuing..." : "Issue Certificate"}
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}