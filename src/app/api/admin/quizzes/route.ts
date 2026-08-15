import { createNotification } from "@/lib/notifications";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !["ADMIN", "INSTRUCTOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const quizzes = await prisma.quiz.findMany({
      include: {
        course: { select: { id: true, title: true, thumbnail: true } },
        _count: { select: { questions: true, attempts: true } },
        questions: { select: { marks: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ quizzes });
  } catch (error) {
    console.error("Admin quizzes GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !["ADMIN", "INSTRUCTOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { courseId, title, description, timeLimit, passingScore, isPublished } = body;

    if (!courseId || !title) {
      return NextResponse.json({ error: "Course and title required" }, { status: 400 });
    }

    const quiz = await prisma.quiz.create({
      data: {
        courseId,
        title,
        description: description || null,
        timeLimit: timeLimit ? parseInt(timeLimit) : null,
        passingScore: passingScore ? parseInt(passingScore) : 60,
        isPublished: isPublished || false,
        totalMarks: 0,
      },
    });
if (isPublished) {
  await createNotification({
    courseId,
    title: "New Quiz Available",
    message: `${quiz.title} has been added to your course.`,
    type: "INFO",
  });
}
    return NextResponse.json({ success: true, quiz });
  } catch (error) {
    console.error("Admin quizzes POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}