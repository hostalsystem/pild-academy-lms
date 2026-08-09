"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Loader2 } from "lucide-react";
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
import { cn } from "@/lib/utils";

interface Course {
  id: string;
  title: string;
}

interface Quiz {
  id: string;
  courseId: string;
  title: string;
  description: string | null;
  timeLimit: number | null;
  passingScore: number;
  isPublished: boolean;
}

interface QuizFormProps {
  courses: Course[];
  existingQuiz?: Quiz;
}

export function QuizForm({ courses, existingQuiz }: QuizFormProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [courseId, setCourseId] = useState(existingQuiz?.courseId || "");
  const [title, setTitle] = useState(existingQuiz?.title || "");
  const [description, setDescription] = useState(existingQuiz?.description || "");
  const [timeLimit, setTimeLimit] = useState(existingQuiz?.timeLimit?.toString() || "");
  const [passingScore, setPassingScore] = useState(existingQuiz?.passingScore?.toString() || "60");
  const [isPublished, setIsPublished] = useState(existingQuiz?.isPublished || false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId || !title) return;

    setLoading(true);
    try {
      const url = existingQuiz ? `/api/admin/quizzes/${existingQuiz.id}` : "/api/admin/quizzes";
      const method = existingQuiz ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId,
          title,
          description,
          timeLimit,
          passingScore,
          isPublished,
        }),
      });

      if (res.ok) {
        setOpen(false);
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to save quiz");
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
        {existingQuiz ? (
          <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setOpen(true)}>
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </Button>
        ) : (
          <Button className="bg-pild-primary gap-2">
            <Plus className="h-4 w-4" />
            Create Quiz
          </Button>
        )}
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{existingQuiz ? "Edit Quiz" : "Create Quiz"}</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div className="space-y-1.5">
            <Label>Course</Label>
            <select
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              required
            >
              <option value="">Select a course</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label>Quiz Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. JavaScript Fundamentals Quiz"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label>Description</Label>
            <textarea
              className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the quiz"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Time Limit (minutes)</Label>
              <Input
                type="number"
                value={timeLimit}
                onChange={(e) => setTimeLimit(e.target.value)}
                placeholder="Optional"
                min="1"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Passing Score (%)</Label>
              <Input
                type="number"
                value={passingScore}
                onChange={(e) => setPassingScore(e.target.value)}
                min="1"
                max="100"
                required
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsPublished(!isPublished)}
            className={cn(
              "w-full py-3 rounded-lg border text-sm font-medium transition-all",
              isPublished
                ? "bg-green-50 border-green-300 text-green-700"
                : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
            )}
          >
            {isPublished ? "● Published" : "○ Draft"}
          </button>

          <Button type="submit" className="w-full bg-pild-primary gap-2" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            {loading ? "Saving..." : existingQuiz ? "Update Quiz" : "Create Quiz"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}