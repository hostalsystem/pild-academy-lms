import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { v2 as cloudinary } from "cloudinary";

export const runtime = "nodejs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function requireAdmin() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return null;
  }

  return session;
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAdmin();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      console.error("Cloudinary environment variables are missing.");

      return NextResponse.json(
        {
          error:
            "Cloudinary configuration is missing. Check .env.local.",
        },
        { status: 500 }
      );
    }

    const formData = await req.formData();

    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "No valid file was provided." },
        { status: 400 }
      );
    }

    const maxVideoSize = 500 * 1024 * 1024;
    const maxPdfSize = 50 * 1024 * 1024;

    const isVideo = file.type.startsWith("video/");
    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!isVideo && !isPdf) {
      return NextResponse.json(
        {
          error:
            "Only video files and PDF files are allowed.",
        },
        { status: 400 }
      );
    }

    if (isVideo && file.size > maxVideoSize) {
      return NextResponse.json(
        {
          error:
            "Video is too large. Maximum allowed size is 500 MB.",
        },
        { status: 413 }
      );
    }

    if (isPdf && file.size > maxPdfSize) {
      return NextResponse.json(
        {
          error:
            "PDF is too large. Maximum allowed size is 50 MB.",
        },
        { status: 413 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const resourceType = isVideo ? "video" : "image";

    const folder = isVideo
      ? "pild-academy/lectures/videos"
      : "pild-academy/lectures/pdfs";

    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: resourceType,

          use_filename: true,
          unique_filename: true,

          ...(isPdf
            ? {
                format: "pdf",
              }
            : {}),
        },
        (error, result) => {
          if (error) {
            reject(error);
            return;
          }

          resolve(result);
        }
      );

      uploadStream.end(buffer);
    });

    if (!result?.secure_url) {
      console.error("Cloudinary returned no secure URL:", result);

      return NextResponse.json(
        {
          error: "Cloudinary did not return a file URL.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      resourceType: result.resource_type,
      format: result.format,
      originalFilename: file.name,
    });
  } catch (error: any) {
    console.error("Cloudinary upload error:", error);

    const cloudinaryMessage =
      error?.error?.message ||
      error?.message ||
      "Unknown Cloudinary error";

    return NextResponse.json(
      {
        error: `Upload failed: ${cloudinaryMessage}`,
      },
      { status: 500 }
    );
  }
}