import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Allow both ADMIN and INSTRUCTOR
    if (!["ADMIN", "INSTRUCTOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const where: any = {};
    
    // If instructor, filter by their courses (when instructor model is ready)
    // For now, show all

    const assignments = await prisma.assignment.findMany({
      where,
      include: {
        course: { select: { id: true, title: true, thumbnail: true } },
        _count: { select: { submissions: true } },
        submissions: { select: { status: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ assignments });
  } catch (error) {
    console.error("Admin assignments GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only ADMIN can create assignments (instructors will have separate create flow)
    if (!["ADMIN", "INSTRUCTOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { courseId, title, description, fileUrl, dueDate, maxMarks } = body;

    if (!courseId || !title) {
      return NextResponse.json({ error: "Course and title required" }, { status: 400 });
    }

    const assignment = await prisma.assignment.create({
      data: {
        courseId,
        title,
        description: description || null,
        fileUrl: fileUrl || null,
        dueDate: dueDate ? new Date(dueDate) : null,
        maxMarks: maxMarks ? parseInt(maxMarks) : 100,
      },
    });

    return NextResponse.json({ success: true, assignment });
  } catch (error) {
    console.error("Admin assignments POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}