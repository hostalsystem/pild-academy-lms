"use client";

import { useState } from "react";
import {
  Upload,
  Video,
  FileText,
  Loader2,
  Save,
  Trash2,
  Plus,
  CheckCircle,
  BookOpen,
} from "lucide-react";

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  videoUrl: string | null;
  pdfUrl: string | null;
  codeFiles: string[];
  duration: number;
  order: number;
  isPreview: boolean;
}

interface CourseLessonManagerProps {
  courseId: string;
  courseTitle: string;
  initialLessons: Lesson[];
}

export function CourseLessonManager({
  courseId,
  courseTitle,
  initialLessons,
}: CourseLessonManagerProps) {
  const [lessons, setLessons] = useState<Lesson[]>(initialLessons);
  const [selectedLessonId, setSelectedLessonId] = useState<string>(
    initialLessons[0]?.id || ""
  );

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("0");
  const [order, setOrder] = useState("1");
  const [videoUrl, setVideoUrl] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");

  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState("");

  const selectedLesson = lessons.find(
    (lesson) => lesson.id === selectedLessonId
  );

  const clearForm = () => {
    setSelectedLessonId("");
    setTitle("");
    setDescription("");
    setDuration("0");
    setOrder(String(lessons.length + 1));
    setVideoUrl("");
    setPdfUrl("");
    setMessage("");
  };

  const loadLesson = (lesson: Lesson) => {
    setSelectedLessonId(lesson.id);
    setTitle(lesson.title);
    setDescription(lesson.description || "");
    setDuration(String(lesson.duration || 0));
    setOrder(String(lesson.order || 0));
    setVideoUrl(lesson.videoUrl || "");
    setPdfUrl(lesson.pdfUrl || "");
    setMessage("");
  };

  const uploadFile = async (
  file: File,
  type: "video" | "pdf"
) => {
  if (!file) return;

  if (type === "video") {
    setUploadingVideo(true);
  } else {
    setUploadingPdf(true);
  }

  setMessage("");

  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    let data: any = {};

    try {
      data = await response.json();
    } catch {
      throw new Error(
        `Server returned status ${response.status}.`
      );
    }

    if (!response.ok) {
      throw new Error(
        data.error ||
          `Upload failed with status ${response.status}.`
      );
    }

    if (!data.url) {
      throw new Error(
        "Upload succeeded but no file URL was returned."
      );
    }

    if (type === "video") {
      setVideoUrl(data.url);
    } else {
      setPdfUrl(data.url);
    }

    setMessage(
      `${type === "video" ? "Video" : "PDF"} uploaded successfully.`
    );
  } catch (error) {
    console.error("Upload error:", error);

    setMessage(
      error instanceof Error
        ? error.message
        : "File upload failed."
    );
  } finally {
    if (type === "video") {
      setUploadingVideo(false);
    } else {
      setUploadingPdf(false);
    }
  }
};

  const handleVideoUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("video/")) {
      setMessage("Please select a valid video file.");
      return;
    }

    uploadFile(file, "video");
  };

  const handlePdfUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      setMessage("Please select a PDF file.");
      return;
    }

    uploadFile(file, "pdf");
  };

  const saveLesson = async () => {
    if (!title.trim()) {
      setMessage("Lecture title is required.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const payload = {
        title: title.trim(),
        description: description.trim() || null,
        videoUrl: videoUrl || null,
        pdfUrl: pdfUrl || null,
        duration: Number(duration) || 0,
        order: Number(order) || 0,
      };

      const url = selectedLessonId
        ? `/api/admin/courses/${courseId}/lessons/${selectedLessonId}`
        : `/api/admin/courses/${courseId}/lessons`;

      const method = selectedLessonId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save lecture.");
      }

      if (selectedLessonId) {
        setLessons((current) =>
          current.map((lesson) =>
            lesson.id === selectedLessonId ? data.lesson : lesson
          )
        );
      } else {
        setLessons((current) =>
          [...current, data.lesson].sort((a, b) => a.order - b.order)
        );

        setSelectedLessonId(data.lesson.id);
      }

      setMessage("Lecture saved successfully.");
    } catch (error) {
      console.error(error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to save lecture."
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteLesson = async () => {
    if (!selectedLessonId) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this lecture?"
    );

    if (!confirmed) return;

    setDeleting(true);
    setMessage("");

    try {
      const response = await fetch(
        `/api/admin/courses/${courseId}/lessons/${selectedLessonId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete lecture.");
      }

      setLessons((current) =>
        current.filter((lesson) => lesson.id !== selectedLessonId)
      );

      clearForm();

      setMessage("Lecture deleted successfully.");
    } catch (error) {
      console.error(error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to delete lecture."
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-3 rounded-xl">
            <BookOpen className="h-6 w-6 text-blue-600" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Manage Lectures
            </h1>

            <p className="text-gray-500 mt-1">
              {courseTitle}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Lecture List */}

        <div className="lg:col-span-1">
          <div className="bg-white border rounded-xl overflow-hidden">

            <div className="p-4 border-b flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-gray-900">
                  Course Lectures
                </h2>

                <p className="text-xs text-gray-500 mt-1">
                  {lessons.length} lecture
                  {lessons.length === 1 ? "" : "s"}
                </p>
              </div>

              <button
                type="button"
                onClick={clearForm}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                New
              </button>
            </div>

            <div className="divide-y">
              {lessons.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <BookOpen className="h-8 w-8 mx-auto mb-2 text-gray-300" />

                  <p className="text-sm">
                    No lectures yet.
                  </p>

                  <p className="text-xs mt-1">
                    Create your first lecture.
                  </p>
                </div>
              ) : (
                lessons
                  .sort((a, b) => a.order - b.order)
                  .map((lesson) => (
                    <button
                      key={lesson.id}
                      type="button"
                      onClick={() => loadLesson(lesson)}
                      className={`w-full text-left p-4 transition ${
                        selectedLessonId === lesson.id
                          ? "bg-blue-50 border-l-4 border-blue-600"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-600">
                          {lesson.order}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900 truncate">
                            {lesson.title}
                          </p>

                          <div className="flex gap-2 mt-2 text-xs">
                            {lesson.videoUrl && (
                              <span className="inline-flex items-center gap-1 text-purple-600">
                                <Video className="h-3 w-3" />
                                Video
                              </span>
                            )}

                            {lesson.pdfUrl && (
                              <span className="inline-flex items-center gap-1 text-red-600">
                                <FileText className="h-3 w-3" />
                                PDF
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))
              )}
            </div>
          </div>
        </div>

        {/* Lecture Editor */}

        <div className="lg:col-span-2">
          <div className="bg-white border rounded-xl">

            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900">
                {selectedLessonId
                  ? "Edit Lecture"
                  : "Create New Lecture"}
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Upload the lecture recording and class notes.
              </p>
            </div>

            <div className="p-6 space-y-6">

              {/* Basic Information */}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Lecture Title
                  </label>

                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Lecture 1: Introduction to HTML"
                    className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Lecture Order
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={order}
                    onChange={(e) => setOrder(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Explain what students will learn in this lecture..."
                  className="w-full border rounded-lg px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="w-full md:w-48">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Duration
                </label>

                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2.5 pr-16 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <span className="absolute right-3 top-2.5 text-sm text-gray-400">
                    minutes
                  </span>
                </div>
              </div>

              {/* Video */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lecture Video
                </label>

                <div className="border-2 border-dashed rounded-xl p-5">

                  {videoUrl ? (
                    <div className="space-y-3">

                      <div className="flex items-center gap-3 bg-purple-50 border border-purple-100 rounded-lg p-3">
                        <Video className="h-5 w-5 text-purple-600" />

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800">
                            Video uploaded
                          </p>

                          <p className="text-xs text-gray-500 truncate">
                            {videoUrl}
                          </p>
                        </div>

                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>

                      <video
                        src={videoUrl}
                        controls
                        className="w-full max-h-72 rounded-lg bg-black"
                      />

                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <Video className="h-10 w-10 mx-auto text-gray-300 mb-3" />

                      <p className="text-sm text-gray-600 mb-3">
                        Upload the recorded class video
                      </p>
                    </div>
                  )}

                  <label className="mt-3 flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 text-white rounded-lg cursor-pointer hover:bg-gray-800 text-sm font-medium">

                    {uploadingVideo ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Uploading video...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4" />
                        {videoUrl ? "Replace Video" : "Upload Video"}
                      </>
                    )}

                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={handleVideoUpload}
                      disabled={uploadingVideo}
                    />

                  </label>

                  <p className="text-xs text-gray-400 text-center mt-2">
                    MP4 is recommended for best browser compatibility.
                  </p>

                </div>
              </div>

              {/* PDF */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lecture PDF / Notes
                </label>

                <div className="border-2 border-dashed rounded-xl p-5">

                  {pdfUrl && (
                    <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-lg p-3 mb-3">
                      <FileText className="h-5 w-5 text-red-600" />

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800">
                          PDF uploaded
                        </p>

                        <p className="text-xs text-gray-500 truncate">
                          {pdfUrl}
                        </p>
                      </div>

                      <a
                        href={pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        View
                      </a>

                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                  )}

                  <label className="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg cursor-pointer hover:bg-red-700 text-sm font-medium">

                    {uploadingPdf ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Uploading PDF...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4" />
                        {pdfUrl ? "Replace PDF" : "Upload PDF"}
                      </>
                    )}

                    <input
                      type="file"
                      accept="application/pdf,.pdf"
                      className="hidden"
                      onChange={handlePdfUpload}
                      disabled={uploadingPdf}
                    />

                  </label>

                  <p className="text-xs text-gray-400 text-center mt-2">
                    Upload class notes, slides, assignments, or lecture PDFs.
                  </p>

                </div>
              </div>

              {/* Message */}

              {message && (
                <div className="rounded-lg bg-gray-50 border p-3 text-sm text-gray-700">
                  {message}
                </div>
              )}

              {/* Actions */}

              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t">

                <div>
                  {selectedLessonId && (
                    <button
                      type="button"
                      onClick={deleteLesson}
                      disabled={deleting}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-sm font-medium"
                    >
                      {deleting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}

                      Delete Lecture
                    </button>
                  )}
                </div>

                <div className="flex gap-2">

                  <button
                    type="button"
                    onClick={clearForm}
                    className="px-4 py-2.5 rounded-lg border text-gray-700 hover:bg-gray-50 text-sm font-medium"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={saveLesson}
                    disabled={saving || uploadingVideo || uploadingPdf}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 text-sm font-medium"
                  >
                    {saving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}

                    Save Lecture
                  </button>

                </div>

              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}