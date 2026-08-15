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

/*
|--------------------------------------------------------------------------
| GET
|--------------------------------------------------------------------------
| Get all lessons for a course
*/
export async function GET(
  req: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const session = await requireAdmin();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const lessons = await prisma.lesson.findMany({
      where: {
        courseId: params.courseId,
      },
      orderBy: {
        order: "asc",
      },
    });

    return NextResponse.json({ lessons });
  } catch (error) {
    console.error("Admin lessons GET error:", error);

    return NextResponse.json(
      { error: "Failed to fetch lessons" },
      { status: 500 }
    );
  }
}

/*
|--------------------------------------------------------------------------
| POST
|--------------------------------------------------------------------------
| Create a new lesson for a course
*/
export async function POST(
  req: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const session = await requireAdmin();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const course = await prisma.course.findUnique({
      where: {
        id: params.courseId,
      },
    });

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    const body = await req.json();

    const title = String(body.title || "").trim();

    if (!title) {
      return NextResponse.json(
        { error: "Lecture title is required" },
        { status: 400 }
      );
    }

    const lesson = await prisma.lesson.create({
      data: {
        courseId: params.courseId,
        title,
        description: body.description || null,
        videoUrl: body.videoUrl || null,
        pdfUrl: body.pdfUrl || null,
        duration: Number(body.duration) || 0,
        order: Number(body.order) || 0,
      },
    });

    return NextResponse.json({
      success: true,
      lesson,
    });
  } catch (error) {
    console.error("Admin lessons POST error:", error);

    return NextResponse.json(
      { error: "Failed to create lesson" },
      { status: 500 }
    );
  }
}

/*
|--------------------------------------------------------------------------
| PUT
|--------------------------------------------------------------------------
| Update an existing course
*/
export async function PUT(
  req: NextRequest,
  { params }: { params: { courseId: string } }
) {
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

    const existing = await prisma.course.findUnique({
      where: {
        id: params.courseId,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    if (slug && slug !== existing.slug) {
      const slugTaken = await prisma.course.findUnique({
        where: {
          slug,
        },
      });

      if (slugTaken) {
        return NextResponse.json(
          { error: "Slug already exists" },
          { status: 409 }
        );
      }
    }

    const course = await prisma.course.update({
      where: {
        id: params.courseId,
      },
      data: {
        title: title || undefined,
        slug: slug || undefined,
        description:
          description !== undefined ? description : undefined,
        thumbnail:
          thumbnail !== undefined ? thumbnail : undefined,
        banner:
          banner !== undefined ? banner : undefined,
        duration:
          duration !== undefined ? duration : undefined,
        fee:
          fee !== undefined ? parseFloat(fee) : undefined,
        objectives:
          objectives !== undefined ? objectives : undefined,
        requirements:
          requirements !== undefined ? requirements : undefined,
        outcomes:
          outcomes !== undefined ? outcomes : undefined,
        syllabus:
          syllabus !== undefined ? syllabus : undefined,
        featured:
          featured !== undefined ? featured : undefined,
        published:
          published !== undefined ? published : undefined,
      },
    });

    return NextResponse.json({
      success: true,
      course,
    });
  } catch (error) {
    console.error("Admin courses PUT error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/*
|--------------------------------------------------------------------------
| DELETE
|--------------------------------------------------------------------------
| Delete a course
*/
export async function DELETE(
  req: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const session = await requireAdmin();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await prisma.course.delete({
      where: {
        id: params.courseId,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Admin courses DELETE error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}