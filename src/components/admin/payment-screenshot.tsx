"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { X, Maximize2, ImageIcon } from "lucide-react";

interface PaymentScreenshotProps {
  src: string | null | undefined;
  studentName?: string;
}

export function PaymentScreenshot({
  src,
  studentName = "Payment Screenshot",
}: PaymentScreenshotProps) {
  const [open, setOpen] = useState(false);

  if (!src) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <ImageIcon className="h-4 w-4" />
        No screenshot
      </div>
    );
  }

  return (
    <>
      {/* Thumbnail */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group relative h-14 w-20 overflow-hidden rounded-lg border border-gray-200 bg-gray-100 hover:border-blue-400 hover:shadow-md transition-all"
      >
        <Image
          src={src}
          alt={studentName}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          unoptimized
        />

        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all group-hover:bg-black/30">
          <Maximize2 className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </button>

      {/* Fullscreen Preview */}
      {open && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4"
          onClick={() => setOpen(false)}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute right-5 top-5 z-[10000] flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 transition"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Image container */}
          <div
            className="relative max-h-[90vh] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={src}
              alt={studentName}
              className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
            />
          </div>
        </div>
      )}
    </>
  );
}