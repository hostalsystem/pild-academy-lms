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
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Allow both ADMIN and INSTRUCTOR
    if (!["ADMIN", "INSTRUCTOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { submissionId, marks, feedback } = await req.json();

    if (!submissionId || marks === undefined) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // If instructor, verify they own the course (optional check for now)
    if (session.user.role === "INSTRUCTOR") {
      const assignment = await prisma.assignment.findUnique({
        where: { id: params.id },
        select: { courseId: true },
      });
      // In future, check if instructor teaches this course
      // For now, allow all instructors to grade
    }

    const submission = await prisma.submission.update({
      where: { id: submissionId },
      data: {
        marks: parseInt(marks),
        feedback: feedback || null,
        status: "GRADED",
        gradedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, submission });
  } catch (error) {
    console.error("Grade error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}