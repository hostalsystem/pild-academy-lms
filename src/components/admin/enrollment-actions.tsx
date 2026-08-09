"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, Award, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EnrollmentActionsProps {
  enrollmentId: string;
  currentStatus: string;
}

export function EnrollmentActions({
  enrollmentId,
  currentStatus,
}: EnrollmentActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleUpdate = async (status: string) => {
    setLoading(status);
    try {
      const res = await fetch("/api/admin/enrollments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: enrollmentId, status }),
      });

      if (res.ok) {
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(null);
    }
  };

  if (currentStatus === "PENDING") {
    return (
      <div className="flex items-center justify-end gap-2">
        <Button
          size="sm"
          className="bg-green-600 hover:bg-green-700 gap-1.5 h-8"
          onClick={() => handleUpdate("APPROVED")}
          disabled={loading !== null}
        >
          {loading === "APPROVED" ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <CheckCircle className="h-3.5 w-3.5" />
          )}
          Approve
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="text-red-600 border-red-200 hover:bg-red-50 gap-1.5 h-8"
          onClick={() => handleUpdate("REJECTED")}
          disabled={loading !== null}
        >
          {loading === "REJECTED" ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <XCircle className="h-3.5 w-3.5" />
          )}
          Reject
        </Button>
      </div>
    );
  }

  if (currentStatus === "APPROVED") {
    return (
      <div className="flex items-center justify-end gap-2">
        <Button
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 gap-1.5 h-8"
          onClick={() => handleUpdate("COMPLETED")}
          disabled={loading !== null}
        >
          {loading === "COMPLETED" ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Award className="h-3.5 w-3.5" />
          )}
          Mark Complete
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="text-red-600 border-red-200 hover:bg-red-50 gap-1.5 h-8"
          onClick={() => handleUpdate("REJECTED")}
          disabled={loading !== null}
        >
          {loading === "REJECTED" ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <XCircle className="h-3.5 w-3.5" />
          )}
          Reject
        </Button>
      </div>
    );
  }

  if (currentStatus === "REJECTED") {
    return (
      <Button
        size="sm"
        className="bg-green-600 hover:bg-green-700 gap-1.5 h-8"
        onClick={() => handleUpdate("APPROVED")}
        disabled={loading !== null}
      >
        {loading === "APPROVED" ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <CheckCircle className="h-3.5 w-3.5" />
        )}
        Approve
      </Button>
    );
  }

  // COMPLETED
  return (
    <span className="text-xs text-gray-400 italic">No actions</span>
  );
}