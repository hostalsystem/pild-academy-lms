import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

    const existing = await prisma.course.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    if (slug && slug !== existing.slug) {
      const slugTaken = await prisma.course.findUnique({ where: { slug } });
      if (slugTaken) {
        return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
      }
    }

    const course = await prisma.course.update({
      where: { id: params.id },
      data: {
        title: title || undefined,
        slug: slug || undefined,
        description: description !== undefined ? description : undefined,
        thumbnail: thumbnail !== undefined ? thumbnail : undefined,
        banner: banner !== undefined ? banner : undefined,
        duration: duration !== undefined ? duration : undefined,
        fee: fee !== undefined ? parseFloat(fee) : undefined,
        objectives: objectives !== undefined ? objectives : undefined,
        requirements: requirements !== undefined ? requirements : undefined,
        outcomes: outcomes !== undefined ? outcomes : undefined,
        syllabus: syllabus !== undefined ? syllabus : undefined,
        featured: featured !== undefined ? featured : undefined,
        published: published !== undefined ? published : undefined,
      },
    });

    return NextResponse.json({ success: true, course });
  } catch (error) {
    console.error("Admin courses PUT error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.course.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin courses DELETE error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}