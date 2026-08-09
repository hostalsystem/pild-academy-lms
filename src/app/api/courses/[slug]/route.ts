import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const course = await prisma.course.findFirst({
      where: {
        OR: [
          { slug: params.slug },
          { id: params.slug }
        ],
        published: true,
      },
      include: {
        lessons: { orderBy: { order: "asc" } },
      },
    });

    if (!course) {
      return NextResponse.json({ message: "Course not found" }, { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch course" }, { status: 500 });
  }
}