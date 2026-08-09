"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, Loader2, FileText } from "lucide-react";
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

interface Submission {
  id: string;
  user: {
    name: string | null;
    email: string;
    image: string | null;
  };
  fileUrl: string | null;
  notes: string | null;
  submittedAt: Date;
  marks: number | null;
  feedback: string | null;
  status: string;
}

interface GradeSubmissionProps {
  assignmentId: string;
  maxMarks: number;
  submission: Submission;
}

export function GradeSubmission({ assignmentId, maxMarks, submission }: GradeSubmissionProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [marks, setMarks] = useState(submission.marks?.toString() || "");
  const [feedback, setFeedback] = useState(submission.feedback || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!marks) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/assignments/${assignmentId}/grade`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionId: submission.id,
          marks,
          feedback,
        }),
      });

      if (res.ok) {
        setOpen(false);
        router.refresh();
      } else {
        alert("Failed to grade");
      }
    } catch {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const isGraded = submission.status === "GRADED";

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          size="sm"
          className={isGraded ? "bg-blue-600 hover:bg-blue-700 gap-1.5" : "bg-pild-primary gap-1.5"}
        >
          <Star className="h-3.5 w-3.5" />
          {isGraded ? "Update Grade" : "Grade"}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{isGraded ? "Update Grade" : "Grade Submission"}</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <p className="text-sm font-medium text-gray-900">
              {submission.user.name || "Unnamed"}
            </p>
            <p className="text-xs text-gray-500">{submission.user.email}</p>
            <p className="text-xs text-gray-500">
              Submitted on {new Date(submission.submittedAt).toLocaleDateString("en-PK")}
            </p>
            {submission.fileUrl && (
              <a
                href={submission.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-pild-primary hover:underline"
              >
                <FileText className="h-4 w-4" />
                View Submission
              </a>
            )}
            {submission.notes && (
              <p className="text-sm text-gray-600 bg-white rounded p-2 border">
                <span className="font-medium">Student Notes:</span> {submission.notes}
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Marks (out of {maxMarks})</Label>
              <Input
                type="number"
                value={marks}
                onChange={(e) => setMarks(e.target.value)}
                min="0"
                max={maxMarks}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label>Feedback</Label>
              <textarea
                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Feedback for the student..."
                rows={3}
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
                <Star className="h-4 w-4" />
              )}
              {loading ? "Saving..." : isGraded ? "Update Grade" : "Submit Grade"}
            </Button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}