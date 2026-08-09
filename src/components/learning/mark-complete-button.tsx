"use client";

import { useState } from "react";
import { CheckCircle, Loader2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface MarkCompleteButtonProps {
  lessonId: string;
  enrollmentId: string;
  isCompleted: boolean;
}

export function MarkCompleteButton({
  lessonId,
  enrollmentId,
  isCompleted: initialCompleted,
}: MarkCompleteButtonProps) {
  const [isCompleted, setIsCompleted] = useState(initialCompleted);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId,
          enrollmentId,
          completed: !isCompleted,
        }),
      });

      if (response.ok) {
        setIsCompleted(!isCompleted);
        router.refresh();
      }
    } catch (error) {
      console.error("Progress update failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isCompleted) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="gap-2 text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
        onClick={handleToggle}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <CheckCircle className="h-4 w-4" />
        )}
        Completed
      </Button>
    );
  }

  return (
    <Button
      size="sm"
      className="gap-2 bg-pild-primary hover:bg-pild-primary/90"
      onClick={handleToggle}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <CheckCircle className="h-4 w-4" />
      )}
      Mark as Complete
    </Button>
  );
}