"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ImagePlus,
  Loader2,
  Pencil,
  Plus,
  Upload,
  X,
} from "lucide-react";

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
  slug: string;
  description: string | null;
  thumbnail: string | null;
  banner: string | null;
  duration: string | null;
  fee: number;
  objectives: string[];
  requirements: string[];
  outcomes: string[];
  syllabus: unknown;
  featured: boolean;
  published: boolean;
}

interface CourseFormProps {
  existingCourse?: Course;
}

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function CourseForm({ existingCourse }: CourseFormProps) {
  const router = useRouter();

  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState(existingCourse?.title || "");
  const [slug, setSlug] = useState(existingCourse?.slug || "");

  const [description, setDescription] = useState(
    existingCourse?.description || ""
  );

  const [thumbnail, setThumbnail] = useState(
    existingCourse?.thumbnail || ""
  );

  const [banner, setBanner] = useState(
    existingCourse?.banner || ""
  );

  const [duration, setDuration] = useState(
    existingCourse?.duration || ""
  );

  const [fee, setFee] = useState(
    existingCourse?.fee?.toString() || "0"
  );

  const [objectives, setObjectives] = useState(
    existingCourse?.objectives?.join("\n") || ""
  );

  const [requirements, setRequirements] = useState(
    existingCourse?.requirements?.join("\n") || ""
  );

  const [outcomes, setOutcomes] = useState(
    existingCourse?.outcomes?.join("\n") || ""
  );

  const [syllabus, setSyllabus] = useState(
    existingCourse?.syllabus
      ? JSON.stringify(existingCourse.syllabus, null, 2)
      : ""
  );

  const [featured, setFeatured] = useState(
    existingCourse?.featured || false
  );

  const [published, setPublished] = useState(
    existingCourse?.published || false
  );

  useEffect(() => {
    if (!existingCourse && title && !slug) {
      setSlug(generateSlug(title));
    }
  }, [title, slug, existingCourse]);

  const resetForm = () => {
    if (existingCourse) {
      setTitle(existingCourse.title || "");
      setSlug(existingCourse.slug || "");
      setDescription(existingCourse.description || "");
      setThumbnail(existingCourse.thumbnail || "");
      setBanner(existingCourse.banner || "");
      setDuration(existingCourse.duration || "");
      setFee(existingCourse.fee?.toString() || "0");
      setObjectives(existingCourse.objectives?.join("\n") || "");
      setRequirements(existingCourse.requirements?.join("\n") || "");
      setOutcomes(existingCourse.outcomes?.join("\n") || "");

      setSyllabus(
        existingCourse.syllabus
          ? JSON.stringify(existingCourse.syllabus, null, 2)
          : ""
      );

      setFeatured(existingCourse.featured || false);
      setPublished(existingCourse.published || false);
    } else {
      setTitle("");
      setSlug("");
      setDescription("");
      setThumbnail("");
      setBanner("");
      setDuration("");
      setFee("0");
      setObjectives("");
      setRequirements("");
      setOutcomes("");
      setSyllabus("");
      setFeatured(false);
      setPublished(false);
    }

    setError("");
  };

  const uploadImage = async (
    file: File,
    type: "thumbnail" | "banner"
  ) => {
    if (!file) return;

    setError("");

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB.");
      return;
    }

    if (type === "thumbnail") {
      setUploadingThumbnail(true);
    } else {
      setUploadingBanner(true);
    }

    try {
      const formData = new FormData();

      formData.append("file", file);

      const response = await fetch(
        "/api/admin/upload-image",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to upload image."
        );
      }

      if (type === "thumbnail") {
        setThumbnail(data.url);
      } else {
        setBanner(data.url);
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to upload image."
      );
    } finally {
      if (type === "thumbnail") {
        setUploadingThumbnail(false);
      } else {
        setUploadingBanner(false);
      }
    }
  };

  const handleThumbnailChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      uploadImage(file, "thumbnail");
    }

    event.target.value = "";
  };

  const handleBannerChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      uploadImage(file, "banner");
    }

    event.target.value = "";
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    if (!title.trim()) {
      setError("Course title is required.");
      return;
    }

    if (!slug.trim()) {
      setError("Course slug is required.");
      return;
    }

    if (uploadingThumbnail || uploadingBanner) {
      setError(
        "Please wait until the image upload is finished."
      );
      return;
    }

    const numericFee = Number(fee);

    if (
      Number.isNaN(numericFee) ||
      numericFee < 0
    ) {
      setError("Please enter a valid course fee.");
      return;
    }

    let parsedSyllabus = null;

    if (syllabus.trim()) {
      try {
        parsedSyllabus = JSON.parse(syllabus);
      } catch {
        setError("Syllabus contains invalid JSON.");
        return;
      }
    }

    const payload = {
      title: title.trim(),
      slug: slug.trim(),
      description: description.trim() || null,

      thumbnail: thumbnail.trim() || null,

      banner: banner.trim() || null,

      duration: duration.trim() || null,

      fee: numericFee,

      objectives: objectives
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),

      requirements: requirements
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),

      outcomes: outcomes
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),

      syllabus: parsedSyllabus,

      featured,

      published,
    };

    setLoading(true);

    try {
      const url = existingCourse
        ? `/api/admin/courses/${existingCourse.id}`
        : "/api/admin/courses";

      const method = existingCourse
        ? "PUT"
        : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to save course."
        );
      }

      setOpen(false);

      resetForm();

      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong while saving the course."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(value) => {
        setOpen(value);

        if (!value) {
          setError("");
        }
      }}
    >
      <SheetTrigger asChild>
        {existingCourse ? (
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5"
          >
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

      <SheetContent
        side="right"
        className="w-full overflow-y-auto sm:max-w-xl"
      >
        <SheetHeader>
          <SheetTitle>
            {existingCourse
              ? "Edit Course"
              : "Create New Course"}
          </SheetTitle>
        </SheetHeader>

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-6 pb-8"
        >
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Basic Information */}

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-900">
              Basic Information
            </h3>

            <div className="space-y-2">
              <Label>Course Title *</Label>

              <Input
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
                placeholder="Full Stack Web Development"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Course Slug *</Label>

              <Input
                value={slug}
                onChange={(event) =>
                  setSlug(event.target.value)
                }
                placeholder="full-stack-web-development"
                required
              />

              <p className="text-xs text-gray-400">
                This is used in the course URL.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>

              <textarea
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                placeholder="Describe what students will learn in this course..."
                rows={5}
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* Course Media */}

          <div className="space-y-5">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-900">
              Course Media
            </h3>

            {/* Thumbnail */}

            <div className="space-y-3">
              <Label>Course Thumbnail</Label>

              <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4">
                {thumbnail ? (
                  <div className="space-y-3">
                    <div className="relative overflow-hidden rounded-lg border bg-white">
                      <img
                        src={thumbnail}
                        alt="Course thumbnail preview"
                        className="h-48 w-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setThumbnail("")
                        }
                        className="absolute right-3 top-3 rounded-full bg-black/70 p-2 text-white transition hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full gap-2"
                      disabled={uploadingThumbnail}
                      onClick={() =>
                        thumbnailInputRef.current?.click()
                      }
                    >
                      <ImagePlus className="h-4 w-4" />
                      Change Thumbnail
                    </Button>
                  </div>
                ) : (
                  <button
                    type="button"
                    disabled={uploadingThumbnail}
                    onClick={() =>
                      thumbnailInputRef.current?.click()
                    }
                    className="flex w-full flex-col items-center justify-center rounded-lg border border-gray-200 bg-white px-6 py-10 text-center transition hover:border-blue-400 hover:bg-blue-50"
                  >
                    {uploadingThumbnail ? (
                      <>
                        <Loader2 className="mb-3 h-10 w-10 animate-spin text-blue-600" />

                        <span className="font-medium text-gray-700">
                          Uploading thumbnail...
                        </span>
                      </>
                    ) : (
                      <>
                        <div className="mb-3 rounded-full bg-blue-100 p-3">
                          <Upload className="h-6 w-6 text-blue-600" />
                        </div>

                        <span className="font-semibold text-gray-800">
                          Select Thumbnail
                        </span>

                        <span className="mt-1 text-xs text-gray-500">
                          Choose an image from your computer
                        </span>

                        <span className="mt-2 text-xs text-gray-400">
                          JPG, PNG or WEBP • Maximum 5MB
                        </span>
                      </>
                    )}
                  </button>
                )}

                <input
                  ref={thumbnailInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleThumbnailChange}
                  className="hidden"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-gray-500">
                  Or use an image URL
                </Label>

                <Input
                  value={thumbnail}
                  onChange={(event) =>
                    setThumbnail(event.target.value)
                  }
                  placeholder="https://example.com/course-thumbnail.jpg"
                />
              </div>
            </div>

            {/* Banner */}

            <div className="space-y-3">
              <Label>Course Banner</Label>

              <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4">
                {banner ? (
                  <div className="space-y-3">
                    <div className="relative overflow-hidden rounded-lg border bg-white">
                      <img
                        src={banner}
                        alt="Course banner preview"
                        className="h-48 w-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setBanner("")
                        }
                        className="absolute right-3 top-3 rounded-full bg-black/70 p-2 text-white transition hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full gap-2"
                      disabled={uploadingBanner}
                      onClick={() =>
                        bannerInputRef.current?.click()
                      }
                    >
                      <ImagePlus className="h-4 w-4" />
                      Change Banner
                    </Button>
                  </div>
                ) : (
                  <button
                    type="button"
                    disabled={uploadingBanner}
                    onClick={() =>
                      bannerInputRef.current?.click()
                    }
                    className="flex w-full flex-col items-center justify-center rounded-lg border border-gray-200 bg-white px-6 py-10 text-center transition hover:border-indigo-400 hover:bg-indigo-50"
                  >
                    {uploadingBanner ? (
                      <>
                        <Loader2 className="mb-3 h-10 w-10 animate-spin text-indigo-600" />

                        <span className="font-medium text-gray-700">
                          Uploading banner...
                        </span>
                      </>
                    ) : (
                      <>
                        <div className="mb-3 rounded-full bg-indigo-100 p-3">
                          <Upload className="h-6 w-6 text-indigo-600" />
                        </div>

                        <span className="font-semibold text-gray-800">
                          Select Banner
                        </span>

                        <span className="mt-1 text-xs text-gray-500">
                          Choose an image from your computer
                        </span>

                        <span className="mt-2 text-xs text-gray-400">
                          JPG, PNG or WEBP • Maximum 5MB
                        </span>
                      </>
                    )}
                  </button>
                )}

                <input
                  ref={bannerInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleBannerChange}
                  className="hidden"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-gray-500">
                  Or use an image URL
                </Label>

                <Input
                  value={banner}
                  onChange={(event) =>
                    setBanner(event.target.value)
                  }
                  placeholder="https://example.com/course-banner.jpg"
                />
              </div>
            </div>
          </div>

          {/* Pricing */}

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-900">
              Pricing & Duration
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Fee (PKR)</Label>

                <Input
                  type="number"
                  min="0"
                  value={fee}
                  onChange={(event) =>
                    setFee(event.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Duration</Label>

                <Input
                  value={duration}
                  onChange={(event) =>
                    setDuration(event.target.value)
                  }
                  placeholder="12 weeks"
                />
              </div>
            </div>
          </div>

          {/* Objectives */}

          <div className="space-y-2">
            <Label>Course Objectives</Label>

            <textarea
              value={objectives}
              onChange={(event) =>
                setObjectives(event.target.value)
              }
              rows={4}
              placeholder={`Learn HTML
Learn CSS
Learn JavaScript
Build real projects`}
              className="w-full rounded-md border border-input px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />

            <p className="text-xs text-gray-400">
              Enter one objective per line.
            </p>
          </div>

          {/* Requirements */}

          <div className="space-y-2">
            <Label>Requirements</Label>

            <textarea
              value={requirements}
              onChange={(event) =>
                setRequirements(event.target.value)
              }
              rows={4}
              placeholder={`Basic computer knowledge
Laptop or computer
Internet connection`}
              className="w-full rounded-md border border-input px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />

            <p className="text-xs text-gray-400">
              Enter one requirement per line.
            </p>
          </div>

          {/* Outcomes */}

          <div className="space-y-2">
            <Label>Learning Outcomes</Label>

            <textarea
              value={outcomes}
              onChange={(event) =>
                setOutcomes(event.target.value)
              }
              rows={4}
              placeholder={`Build professional websites
Create full stack applications
Deploy projects online`}
              className="w-full rounded-md border border-input px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />

            <p className="text-xs text-gray-400">
              Enter one outcome per line.
            </p>
          </div>

          {/* Syllabus */}

          <div className="space-y-2">
            <Label>Syllabus</Label>

            <textarea
              value={syllabus}
              onChange={(event) =>
                setSyllabus(event.target.value)
              }
              rows={8}
              placeholder={`[
  {
    "title": "Module 1: HTML",
    "lessons": [
      "Introduction to HTML",
      "HTML Elements",
      "Forms"
    ]
  }
]`}
              className="w-full rounded-md border border-input px-3 py-2 text-sm font-mono outline-none focus:ring-2 focus:ring-ring"
            />

            <p className="text-xs text-gray-400">
              Optional JSON format.
            </p>
          </div>

          {/* Status */}

          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-900">
              Course Status
            </h3>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() =>
                  setFeatured((current) => !current)
                }
                className={cn(
                  "rounded-lg border px-4 py-3 text-sm font-medium transition",
                  featured
                    ? "border-yellow-400 bg-yellow-50 text-yellow-700"
                    : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                )}
              >
                {featured
                  ? "★ Featured Course"
                  : "☆ Mark as Featured"}
              </button>

              <button
                type="button"
                onClick={() =>
                  setPublished((current) => !current)
                }
                className={cn(
                  "rounded-lg border px-4 py-3 text-sm font-medium transition",
                  published
                    ? "border-green-300 bg-green-50 text-green-700"
                    : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                )}
              >
                {published
                  ? "● Published"
                  : "○ Save as Draft"}
              </button>
            </div>
          </div>

          {/* Submit */}

          <Button
            type="submit"
            disabled={
              loading ||
              uploadingThumbnail ||
              uploadingBanner
            }
            className="w-full bg-pild-primary gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving Course...
              </>
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