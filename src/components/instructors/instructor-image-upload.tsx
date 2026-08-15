"use client";

import { useRef, useState } from "react";
import { Camera, Loader2, User } from "lucide-react";
import Image from "next/image";

type InstructorImageUploadProps = {
  currentImage: string;
  onUpload: (url: string) => void;
};

export default function InstructorImageUpload({
  currentImage,
  onUpload,
}: InstructorImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");
    setUploading(true);

    try {
      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
      ];

      if (!allowedTypes.includes(file.type)) {
        throw new Error(
          "Only JPG, PNG, and WEBP images are allowed."
        );
      }

      // Validate file size
      const maxSize = 5 * 1024 * 1024;

      if (file.size > maxSize) {
        throw new Error(
          "Image size must be less than 5MB."
        );
      }

      const formData = new FormData();

      formData.append("file", file);

      // IMPORTANT:
      // This matches:
      // src/app/api/admin/upload-image/route.ts
      const response = await fetch(
        "/api/admin/upload-image",
        {
          method: "POST",
          body: formData,
        }
      );

      // Get response as text first.
      // This prevents the ugly:
      // Unexpected token '<'
      // error if the server returns HTML.
      const responseText = await response.text();

      let data: {
        success?: boolean;
        url?: string;
        error?: string;
      };

      try {
        data = JSON.parse(responseText);
      } catch {
        console.error(
          "Upload API returned non-JSON:",
          responseText
        );

        throw new Error(
          "The image upload server returned an invalid response. Please check the upload API route."
        );
      }

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to upload instructor image."
        );
      }

      if (!data.success || !data.url) {
        throw new Error(
          data.error ||
            "Image URL was not returned by the server."
        );
      }

      // Send uploaded image URL back to Add Instructor form
      onUpload(data.url);
    } catch (error) {
      console.error(
        "Instructor image upload error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to upload image."
      );
    } finally {
      setUploading(false);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
      <div className="flex flex-col items-center gap-4">

        <div className="relative">
          <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-gray-200 shadow-lg">

            {currentImage ? (
              <Image
                src={currentImage}
                alt="Instructor profile"
                width={128}
                height={128}
                className="h-full w-full object-cover"
              />
            ) : (
              <User className="h-14 w-14 text-gray-400" />
            )}

          </div>

          <button
            type="button"
            onClick={() =>
              inputRef.current?.click()
            }
            disabled={uploading}
            className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white shadow-md transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Camera className="h-5 w-5" />
            )}
          </button>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="text-center">
          <button
            type="button"
            onClick={() =>
              inputRef.current?.click()
            }
            disabled={uploading}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {uploading
              ? "Uploading..."
              : currentImage
              ? "Change Image"
              : "Choose Image"}
          </button>

          <p className="mt-2 text-xs text-gray-500">
            JPG, PNG or WEBP. Maximum 5MB.
          </p>
        </div>

        {error && (
          <p className="text-center text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}