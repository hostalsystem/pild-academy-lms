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

interface Course {
  id: string;
  title: string;
}

interface ZoomClass {
  id: string;
  courseId: string;
  title: string;
  description: string | null;
  meetingUrl: string;
  meetingId: string | null;
  passcode: string | null;
  startTime: Date;
  endTime: Date | null;
  recordingUrl: string | null;
}

interface ZoomClassFormProps {
  courses: Course[];
  existingClass?: ZoomClass;
}

export function ZoomClassForm({ courses, existingClass }: ZoomClassFormProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [courseId, setCourseId] = useState(existingClass?.courseId || "");
  const [title, setTitle] = useState(existingClass?.title || "");
  const [description, setDescription] = useState(existingClass?.description || "");
  const [meetingUrl, setMeetingUrl] = useState(existingClass?.meetingUrl || "");
  const [meetingId, setMeetingId] = useState(existingClass?.meetingId || "");
  const [passcode, setPasscode] = useState(existingClass?.passcode || "");
  const [startTime, setStartTime] = useState(
    existingClass
      ? new Date(existingClass.startTime).toISOString().slice(0, 16)
      : ""
  );
  const [endTime, setEndTime] = useState(
    existingClass?.endTime
      ? new Date(existingClass.endTime).toISOString().slice(0, 16)
      : ""
  );
  const [recordingUrl, setRecordingUrl] = useState(
    existingClass?.recordingUrl || ""
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId || !title || !meetingUrl || !startTime) return;

    setLoading(true);
    try {
      const url = existingClass
        ? `/api/zoom/${existingClass.id}`
        : "/api/zoom";
      const method = existingClass ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId,
          title,
          description,
          meetingUrl,
          meetingId,
          passcode,
          startTime,
          endTime: endTime || null,
          recordingUrl: recordingUrl || null,
        }),
      });

      if (res.ok) {
        setOpen(false);
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to save class");
      }
    } catch (err) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {existingClass ? (
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5"
            onClick={() => setOpen(true)}
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </Button>
        ) : (
          <Button className="bg-pild-primary gap-2">
            <Plus className="h-4 w-4" />
            Schedule Class
          </Button>
        )}
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {existingClass ? "Edit Zoom Class" : "Schedule New Zoom Class"}
          </SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div className="space-y-1.5">
            <Label>Course</Label>
            <select
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
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
            <Label>Class Title</Label>
            <Input
              placeholder="e.g. Week 3: React Hooks Live Session"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label>Description</Label>
            <textarea
              className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              placeholder="What will be covered in this session?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Zoom Meeting URL</Label>
            <Input
              placeholder="https://zoom.us/j/..."
              value={meetingUrl}
              onChange={(e) => setMeetingUrl(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Meeting ID</Label>
              <Input
                placeholder="Optional"
                value={meetingId}
                onChange={(e) => setMeetingId(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Passcode</Label>
              <Input
                placeholder="Optional"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Start Time</Label>
              <Input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>End Time</Label>
              <Input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>

          {existingClass && (
            <div className="space-y-1.5">
              <Label>Recording URL</Label>
              <Input
                placeholder="Paste recording link after class ends"
                value={recordingUrl}
                onChange={(e) => setRecordingUrl(e.target.value)}
              />
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-pild-primary gap-2"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : existingClass ? (
              <>
                <Pencil className="h-4 w-4" />
                Update Class
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Schedule Class
              </>
            )}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}