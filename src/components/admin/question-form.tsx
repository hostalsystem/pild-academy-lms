"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2, Trash2 } from "lucide-react";
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

interface QuestionFormProps {
  quizId: string;
}

export function QuestionForm({ quizId }: QuestionFormProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("0");
  const [explanation, setExplanation] = useState("");
  const [marks, setMarks] = useState("10");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question || options.some((o) => !o.trim())) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/quizzes/${quizId}/questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          options: options.filter((o) => o.trim()),
          correctAnswer,
          explanation,
          marks,
        }),
      });

      if (res.ok) {
        setOpen(false);
        setQuestion("");
        setOptions(["", "", "", ""]);
        setCorrectAnswer("0");
        setExplanation("");
        setMarks("10");
        router.refresh();
      } else {
        alert("Failed to add question");
      }
    } catch {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="sm" className="bg-pild-primary gap-1.5">
          <Plus className="h-3.5 w-3.5" />
          Add Question
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Add Question</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div className="space-y-1.5">
            <Label>Question</Label>
            <textarea
              className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter your question"
              rows={2}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Options</Label>
            {options.map((opt, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-500 w-6">
                  {String.fromCharCode(65 + idx)}.
                </span>
                <Input
                  value={opt}
                  onChange={(e) => updateOption(idx, e.target.value)}
                  placeholder={`Option ${idx + 1}`}
                  required
                />
              </div>
            ))}
          </div>

          <div className="space-y-1.5">
            <Label>Correct Answer</Label>
            <select
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
            >
              {options.map((_, idx) => (
                <option key={idx} value={String(idx)}>
                  {String.fromCharCode(65 + idx)} - Option {idx + 1}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label>Explanation (optional)</Label>
            <textarea
              className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm"
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Explain why this is the correct answer"
              rows={2}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Marks</Label>
            <Input
              type="number"
              value={marks}
              onChange={(e) => setMarks(e.target.value)}
              min="1"
              required
            />
          </div>

          <Button type="submit" className="w-full bg-pild-primary gap-2" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            {loading ? "Adding..." : "Add Question"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}