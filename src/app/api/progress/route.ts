import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { lessonId, enrollmentId, completed } = body;

    if (!lessonId || !enrollmentId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify enrollment belongs to current user
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        id: enrollmentId,
        userId: session.user.id,
      },
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: "Enrollment not found" },
        { status: 404 }
      );
    }

    // Upsert progress
    const progress = await prisma.progress.upsert({
      where: {
        enrollmentId_lessonId: {
          enrollmentId,
          lessonId,
        },
      },
      update: {
        completed,
        completedAt: completed ? new Date() : null,
      },
      create: {
        enrollmentId,
        lessonId,
        completed,
        completedAt: completed ? new Date() : null,
      },
    });

    // Auto-mark enrollment as COMPLETED if all lessons done
    if (completed) {
      const totalLessons = await prisma.lesson.count({
        where: { courseId: enrollment.courseId },
      });
      const completedLessons = await prisma.progress.count({
        where: { enrollmentId, completed: true },
      });

      if (completedLessons >= totalLessons) {
        await prisma.enrollment.update({
          where: { id: enrollmentId },
          data: { status: "COMPLETED", completedAt: new Date() },
        });
      }
    }

    return NextResponse.json({ success: true, progress });
  } catch (error) {
    console.error("Progress API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const enrollmentId = searchParams.get("enrollmentId");

    if (!enrollmentId) {
      return NextResponse.json(
        { error: "Enrollment ID required" },
        { status: 400 }
      );
    }

    const progress = await prisma.progress.findMany({
      where: { enrollmentId },
    });

    return NextResponse.json({ progress });
  } catch (error) {
    console.error("Progress GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}