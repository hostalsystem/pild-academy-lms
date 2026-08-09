"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

interface SubmissionFormProps {
  assignmentId: string;
}

export function SubmissionForm({ assignmentId }: SubmissionFormProps) {
  const [fileUrl, setFileUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileUrl.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/assignments/${assignmentId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileUrl, notes }),
      });

      if (res.ok) {
        setFileUrl("");
        setNotes("");
        router.refresh();
      }
    } catch (err) {
      console.error("Submit error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-1.5">
        <Label className="text-sm font-medium text-gray-700">
          Submission File URL
        </Label>
        <Input
          placeholder="Paste your Cloudinary file URL here..."
          value={fileUrl}
          onChange={(e) => setFileUrl(e.target.value)}
          required
        />
        <p className="text-xs text-gray-400">
          Upload your solution to Cloudinary and paste the link above.
        </p>
      </div>
      <div className="space-y-1.5">
        <Label className="text-sm font-medium text-gray-700">
          Notes (optional)
        </Label>
        <textarea
          className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Add any notes for the instructor..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
        />
      </div>
      <Button
        type="submit"
        className="bg-pild-primary gap-2"
        disabled={loading || !fileUrl.trim()}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
        Submit Assignment
      </Button>
    </form>
  );
}