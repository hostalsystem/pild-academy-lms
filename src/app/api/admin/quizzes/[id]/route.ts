import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !["ADMIN", "INSTRUCTOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const quiz = await prisma.quiz.findUnique({
      where: { id: params.id },
      include: {
        course: { select: { id: true, title: true, thumbnail: true } },
        questions: { orderBy: { order: "asc" } },
        attempts: {
          include: {
            user: { select: { id: true, name: true, email: true, image: true } },
          },
          orderBy: { startedAt: "desc" },
        },
      },
    });

    if (!quiz) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ quiz });
  } catch (error) {
    console.error("Quiz GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !["ADMIN", "INSTRUCTOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, timeLimit, passingScore, isPublished, totalMarks } = body;

    const quiz = await prisma.quiz.update({
      where: { id: params.id },
      data: {
        title: title || undefined,
        description: description !== undefined ? description : undefined,
        timeLimit: timeLimit !== undefined ? (timeLimit ? parseInt(timeLimit) : null) : undefined,
        passingScore: passingScore !== undefined ? parseInt(passingScore) : undefined,
        isPublished: isPublished !== undefined ? isPublished : undefined,
        totalMarks: totalMarks !== undefined ? parseInt(totalMarks) : undefined,
      },
    });

    return NextResponse.json({ success: true, quiz });
  } catch (error) {
    console.error("Quiz PUT error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !["ADMIN", "INSTRUCTOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.quiz.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Quiz DELETE error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}