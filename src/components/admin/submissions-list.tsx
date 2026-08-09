"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Users, Loader2, FileText, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import { GradeSubmission } from "./grade-submission";

interface Submission {
  id: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
  fileUrl: string | null;
  notes: string | null;
  submittedAt: string;
  marks: number | null;
  feedback: string | null;
  status: string;
}

interface SubmissionsListProps {
  assignmentId: string;
  maxMarks: number;
}

export function SubmissionsList({ assignmentId, maxMarks }: SubmissionsListProps) {
  const [open, setOpen] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/assignments/${assignmentId}/submissions`);
      const data = await res.json();
      setSubmissions(data.submissions || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="gap-1.5"
          onClick={fetchSubmissions}
        >
          <Users className="h-3.5 w-3.5" />
          Submissions
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Submissions</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No submissions yet.</p>
            </div>
          ) : (
            submissions.map((sub) => (
              <div
                key={sub.id}
                className="border rounded-lg p-4 space-y-3 bg-white"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200 shrink-0">
                      {sub.user.image ? (
                        <Image
                          src={sub.user.image}
                          alt={sub.user.name || ""}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <Users className="h-5 w-5 text-gray-400 m-auto" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {sub.user.name || "Unnamed"}
                      </p>
                      <p className="text-xs text-gray-500">{sub.user.email}</p>
                    </div>
                  </div>
                  {sub.status === "GRADED" ? (
                    <Badge className="bg-green-100 text-green-700">Graded</Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                      Pending
                    </Badge>
                  )}
                </div>

                <div className="text-xs text-gray-500 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  Submitted {new Date(sub.submittedAt).toLocaleDateString("en-PK")}
                </div>

                {sub.fileUrl && (
                  <a
                    href={sub.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-pild-primary hover:underline"
                  >
                    <FileText className="h-4 w-4" />
                    View Submission
                  </a>
                )}

                {sub.status === "GRADED" && (
                  <div className="bg-green-50 rounded-lg p-3 space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-green-700 font-medium">Marks</span>
                      <span className="text-green-800 font-bold">
                        {sub.marks} / {maxMarks}
                      </span>
                    </div>
                    {sub.feedback && (
                      <p className="text-xs text-green-700">
                        <span className="font-medium">Feedback:</span> {sub.feedback}
                      </p>
                    )}
                  </div>
                )}

                <GradeSubmission
                  assignmentId={assignmentId}
                  maxMarks={maxMarks}
                  submission={sub as any}
                />
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}