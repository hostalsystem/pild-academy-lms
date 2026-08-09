"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  thumbnail: string | null;
  banner: string | null;
  duration: string | null;
  fee: number;
  objectives: string[];
  requirements: string[];
  outcomes: string[];
  syllabus: any;
  featured: boolean;
  published: boolean;
}

interface CourseFormProps {
  existingCourse?: Course;
}

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function CourseForm({ existingCourse }: CourseFormProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState(existingCourse?.title || "");
  const [slug, setSlug] = useState(existingCourse?.slug || "");
  const [description, setDescription] = useState(existingCourse?.description || "");
  const [thumbnail, setThumbnail] = useState(existingCourse?.thumbnail || "");
  const [banner, setBanner] = useState(existingCourse?.banner || "");
  const [duration, setDuration] = useState(existingCourse?.duration || "");
  const [fee, setFee] = useState(existingCourse?.fee?.toString() || "0");
  const [objectives, setObjectives] = useState(existingCourse?.objectives?.join("\n") || "");
  const [requirements, setRequirements] = useState(existingCourse?.requirements?.join("\n") || "");
  const [outcomes, setOutcomes] = useState(existingCourse?.outcomes?.join("\n") || "");
  const [syllabus, setSyllabus] = useState(
    existingCourse?.syllabus ? JSON.stringify(existingCourse.syllabus, null, 2) : ""
  );
  const [featured, setFeatured] = useState(existingCourse?.featured || false);
  const [published, setPublished] = useState(existingCourse?.published || false);

  useEffect(() => {
    if (!existingCourse && title && !slug) {
      setSlug(generateSlug(title));
    }
  }, [title, slug, existingCourse]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      title,
      slug,
      description: description || null,
      thumbnail: thumbnail || null,
      banner: banner || null,
      duration: duration || null,
      fee,
      objectives: objectives.split("\n").filter((s) => s.trim()),
      requirements: requirements.split("\n").filter((s) => s.trim()),
      outcomes: outcomes.split("\n").filter((s) => s.trim()),
      syllabus: syllabus ? JSON.parse(syllabus) : null,
      featured,
      published,
    };

    try {
      const url = existingCourse
        ? `/api/admin/courses/${existingCourse.id}`
        : "/api/admin/courses";
      const method = existingCourse ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setOpen(false);
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to save course");
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
        {existingCourse ? (
          <Button size="sm" variant="outline" className="gap-1.5">
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </Button>
        ) : (
          <Button className="bg-pild-primary gap-2">
            <Plus className="h-4 w-4" />
            Add Course
          </Button>
        )}
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {existingCourse ? "Edit Course" : "Create New Course"}
          </SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-5 mt-6">
          {/* Basic Info */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
              Basic Information
            </h4>
            <div className="space-y-1.5">
              <Label>Course Title *</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Full Stack Web Development"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>Slug *</Label>
              <Input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="full-stack-web-development"
                required
              />
              <p className="text-xs text-gray-400">URL-friendly identifier</p>
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <textarea
                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the course"
                rows={3}
              />
            </div>
          </div>

          {/* Media */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
              Media
            </h4>
            <div className="space-y-1.5">
              <Label>Thumbnail URL</Label>
              <Input
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-1.5">
              <Label>Banner URL</Label>
              <Input
                value={banner}
                onChange={(e) => setBanner(e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Pricing & Duration */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
              Pricing & Duration
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Fee (PKR)</Label>
                <Input
                  type="number"
                  value={fee}
                  onChange={(e) => setFee(e.target.value)}
                  placeholder="0"
                  min="0"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Duration</Label>
                <Input
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g. 12 weeks"
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
              Course Content
            </h4>
            <div className="space-y-1.5">
              <Label>Objectives (one per line)</Label>
              <textarea
                className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={objectives}
                onChange={(e) => setObjectives(e.target.value)}
                placeholder="Learn React&#10;Build real projects"
                rows={3}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Requirements (one per line)</Label>
              <textarea
                className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                placeholder="Basic HTML knowledge&#10;Laptop with internet"
                rows={3}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Outcomes (one per line)</Label>
              <textarea
                className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={outcomes}
                onChange={(e) => setOutcomes(e.target.value)}
                placeholder="Build full-stack apps&#10;Deploy to production"
                rows={3}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Syllabus (JSON)</Label>
              <textarea
                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring font-mono text-xs"
                value={syllabus}
                onChange={(e) => setSyllabus(e.target.value)}
                placeholder={`[{"title":"Module 1","lessons":["Intro","Setup"]}]`}
                rows={4}
              />
              <p className="text-xs text-gray-400">Optional. Leave empty if not needed.</p>
            </div>
          </div>

          {/* Status */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
              Status
            </h4>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setFeatured(!featured)}
                className={cn(
                  "flex-1 py-3 rounded-lg border text-sm font-medium transition-all",
                  featured
                    ? "bg-pild-secondary/10 border-pild-secondary text-pild-secondary"
                    : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                )}
              >
                {featured ? "★ Featured" : "☆ Mark Featured"}
              </button>
              <button
                type="button"
                onClick={() => setPublished(!published)}
                className={cn(
                  "flex-1 py-3 rounded-lg border text-sm font-medium transition-all",
                  published
                    ? "bg-green-50 border-green-300 text-green-700"
                    : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                )}
              >
                {published ? "● Published" : "○ Draft"}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-pild-primary gap-2"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : existingCourse ? (
              <>
                <Pencil className="h-4 w-4" />
                Update Course
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Create Course
              </>
            )}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}