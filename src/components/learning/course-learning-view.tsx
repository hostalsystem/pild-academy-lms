"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle,
  Circle,
  PlayCircle,
  FileText,
  Code,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  BookOpen,
  Clock,
  Download,
} from "lucide-react";
// import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { LessonPlayer } from "./lesson-player";
import { MarkCompleteButton } from "./mark-complete-button";

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

interface ProgressItem {
  id: string;
  lessonId: string;
  completed: boolean;
  completedAt: Date | null;
}

interface CourseLearningViewProps {
  course: {
    id: string;
    title: string;
    slug: string;
    lessons: Lesson[];
  };
  enrollment: {
    id: string;
  };
  progress: ProgressItem[];
  totalLessons: number;
  completedLessons: number;
  progressPercent: number;
}

export function CourseLearningView({
  course,
  enrollment,
  progress,
  totalLessons,
  completedLessons,
  progressPercent,
}: CourseLearningViewProps) {
  const progressMap = new Map(progress.map((p) => [p.lessonId, p]));

  const firstIncompleteIndex = course.lessons.findIndex(
    (l) => !progressMap.get(l.id)?.completed
  );
  const [activeLessonId, setActiveLessonId] = useState(
    course.lessons[firstIncompleteIndex === -1 ? 0 : firstIncompleteIndex]?.id || ""
  );

  const activeLesson = course.lessons.find((l) => l.id === activeLessonId);
  const activeLessonIndex = course.lessons.findIndex((l) => l.id === activeLessonId);
  const activeProgress = progressMap.get(activeLessonId);

  const isFirstLesson = activeLessonIndex === 0;
  const isLastLesson = activeLessonIndex === course.lessons.length - 1;

  const goToLesson = (lessonId: string) => setActiveLessonId(lessonId);
  const goToPrev = () => {
    if (!isFirstLesson) goToLesson(course.lessons[activeLessonIndex - 1].id);
  };
  const goToNext = () => {
    if (!isLastLesson) goToLesson(course.lessons[activeLessonIndex + 1].id);
  };

  return (
    <>
      {/* Lesson Sidebar */}
      <aside className="w-full lg:w-80 bg-white border-r shrink-0 flex flex-col lg:h-[calc(100vh-73px)] lg:sticky lg:top-0">
        <div className="p-4 border-b shrink-0">
          <Link
            href="/my-learning"
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-pild-primary mb-3 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to My Learning
          </Link>
          <h2 className="font-semibold text-gray-900 line-clamp-1">{course.title}</h2>
          <div className="mt-3 space-y-2">
            <div className="flex justify-between text-xs text-gray-600">
              <span>
                {completedLessons} of {totalLessons} completed
              </span>
              <span className="font-medium text-pild-primary">{progressPercent}%</span>
            </div>
            <Progress value={progressPercent} className="h-1.5" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {course.lessons.map((lesson, index) => {
            const lessonProgress = progressMap.get(lesson.id);
            const isCompleted = lessonProgress?.completed || false;
            const isActive = lesson.id === activeLessonId;

            return (
              <button
                key={lesson.id}
                onClick={() => goToLesson(lesson.id)}
                className={cn(
                  "w-full flex items-start gap-3 px-4 py-3 text-left transition-colors border-b border-gray-50",
                  isActive
                    ? "bg-blue-50 border-l-4 border-l-pild-primary"
                    : "hover:bg-gray-50 border-l-4 border-l-transparent"
                )}
              >
                <div className="mt-0.5 shrink-0">
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : isActive ? (
                    <PlayCircle className="h-5 w-5 text-pild-primary" />
                  ) : (
                    <Circle className="h-5 w-5 text-gray-300" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      "text-sm font-medium line-clamp-2",
                      isActive ? "text-pild-primary" : "text-gray-700"
                    )}
                  >
                    {index + 1}. {lesson.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {lesson.duration} min
                    </span>
                    {lesson.isPreview && (
                      <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
                        Preview
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50">
        {activeLesson ? (
          <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* Lesson Header */}
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <span>
                  Lesson {activeLessonIndex + 1} of {totalLessons}
                </span>
                <Separator orientation="vertical" className="h-4" />
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {activeLesson.duration} min
                </span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{activeLesson.title}</h1>
            </div>

            Video Player
            {/* <LessonPlayer lesson={activeLesson} isLocked={false} /> */}

            {/* Lesson Actions */}
            {/* <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={goToPrev} disabled={isFirstLesson}>
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <Button variant="outline" size="sm" onClick={goToNext} disabled={isLastLesson}>
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              <MarkCompleteButton
                lessonId={activeLesson.id}
                enrollmentId={enrollment.id}
                isCompleted={activeProgress?.completed || false}
              />
            </div> */}

            {/* Lesson Content */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">About this lesson</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {activeLesson.description || "No description available for this lesson."}
                  </p>
                </div>

                {/* Resources */}
                {(activeLesson.pdfUrl || activeLesson.codeFiles.length > 0) && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Resources</h3>
                      <div className="space-y-2">
                        {activeLesson.pdfUrl && (
                          <a
                            href={activeLesson.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors group"
                          >
                            <div className="bg-red-50 p-2 rounded-lg group-hover:bg-red-100">
                              <FileText className="h-5 w-5 text-red-500" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">Lesson PDF</p>
                              <p className="text-xs text-gray-500">Click to view or download</p>
                            </div>
                            <Download className="h-4 w-4 text-gray-400" />
                          </a>
                        )}
                        {activeLesson.codeFiles.map((file, idx) => (
                          <a
                            key={idx}
                            href={file}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors group"
                          >
                            <div className="bg-blue-50 p-2 rounded-lg group-hover:bg-blue-100">
                              <Code className="h-5 w-5 text-blue-500" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">Code File {idx + 1}</p>
                              <p className="text-xs text-gray-500">Click to download</p>
                            </div>
                            <Download className="h-4 w-4 text-gray-400" />
                          </a>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-500">Select a lesson to start</h3>
            </div>
          </div>
        )}
      </main>
    </>
  );
}