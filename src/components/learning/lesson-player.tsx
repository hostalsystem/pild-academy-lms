"use client";

import { useState } from "react";
import { Lock, Play, Volume2, VolumeX, Maximize, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  videoUrl: string | null;
  duration: number;
  isPreview: boolean;
}

interface LessonPlayerProps {
  lesson: Lesson | undefined;
  isLocked: boolean;
}

export function LessonPlayer({ lesson, isLocked }: LessonPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!lesson) {
    return (
      <div className="aspect-video bg-gray-900 flex items-center justify-center rounded-lg">
        <div className="text-center">
          <Loader2 className="h-8 w-8 text-gray-500 animate-spin mx-auto mb-3" />
          <p className="text-gray-400 text-sm">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (isLocked) {
    return (
      <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex flex-col items-center justify-center relative overflow-hidden rounded-lg">
        <div className="relative z-10 text-center p-8">
          <div className="bg-white/10 backdrop-blur-sm p-5 rounded-2xl inline-flex mb-5 border border-white/10">
            <Lock className="h-10 w-10 text-white/90" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">Premium Content Locked</h3>
          <p className="text-gray-400 max-w-sm mx-auto mb-6 leading-relaxed">
            This lesson is part of the paid course content. Complete your enrollment and payment verification to unlock all lessons.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-black aspect-video group rounded-lg overflow-hidden">
      {lesson.videoUrl ? (
        <video
          src={lesson.videoUrl}
          className="w-full h-full object-contain"
          controls
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onWaiting={() => setIsLoading(true)}
          onCanPlay={() => setIsLoading(false)}
          muted={isMuted}
          preload="metadata"
        >
          Your browser does not support the video tag.
        </video>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="bg-white/10 hover:bg-white/20 p-6 rounded-full mb-4 transition-all hover:scale-105"
          >
            <Play className="h-10 w-10 text-white ml-1" />
          </button>
          <p className="text-gray-400 font-medium">Video coming soon</p>
          <p className="text-gray-500 text-sm mt-1">{lesson.title}</p>
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <div className="h-1 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-pild-primary w-0 rounded-full" />
            </div>
          </div>
        </div>
      )}
      {isLoading && lesson.videoUrl && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
          <Loader2 className="h-10 w-10 text-white animate-spin" />
        </div>
      )}
    </div>
  );
}