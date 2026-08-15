import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return null;
  }

  return session;
}

export async function GET() {
  try {
    const session = await requireAdmin();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const courses = await prisma.course.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      courses,
    });
  } catch (error) {
    console.error("Admin courses GET error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch courses",
      },
      {
        status: 500,
      }
    );
  }
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

    const body = await req.json();

    const {
      title,
      slug,
      description,
      thumbnail,
      banner,
      duration,
      fee,
      objectives,
      requirements,
      outcomes,
      syllabus,
      featured,
      published,
    } = body;

    if (!title || !String(title).trim()) {
      return NextResponse.json(
        { error: "Course title is required." },
        { status: 400 }
      );
    }

    if (!slug || !String(slug).trim()) {
      return NextResponse.json(
        { error: "Course slug is required." },
        { status: 400 }
      );
    }

    const numericFee = Number(fee);

    if (Number.isNaN(numericFee) || numericFee < 0) {
      return NextResponse.json(
        { error: "Invalid course fee." },
        { status: 400 }
      );
    }

    const cleanSlug = String(slug)
      .trim()
      .toLowerCase();

    const existingCourse = await prisma.course.findUnique({
      where: {
        slug: cleanSlug,
      },
    });

    if (existingCourse) {
      return NextResponse.json(
        {
          error: "A course with this slug already exists.",
        },
        {
          status: 409,
        }
      );
    }

    const course = await prisma.course.create({
      data: {
        title: String(title).trim(),

        slug: cleanSlug,

        description:
  description !== undefined && description !== null
    ? String(description).trim()
    : "",

        thumbnail:
          thumbnail !== undefined && thumbnail !== null
            ? String(thumbnail).trim() || null
            : null,

        banner:
          banner !== undefined && banner !== null
            ? String(banner).trim() || null
            : null,

        duration:
          duration !== undefined && duration !== null
            ? String(duration).trim() || null
            : null,

        fee: numericFee,

        objectives: Array.isArray(objectives)
          ? objectives
          : [],

        requirements: Array.isArray(requirements)
          ? requirements
          : [],

        outcomes: Array.isArray(outcomes)
          ? outcomes
          : [],

        syllabus:
          syllabus !== undefined
            ? syllabus
            : null,

        featured: Boolean(featured),

        published: Boolean(published),
      },
    });

    return NextResponse.json(
      {
        success: true,
        course,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Admin courses POST error:", error);

    return NextResponse.json(
      {
        error: "Failed to create course.",
      },
      {
        status: 500,
      }
    );
  }
}