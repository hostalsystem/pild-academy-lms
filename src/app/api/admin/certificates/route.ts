import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const certificates = await prisma.certificate.findMany({
      include: {
        user: { select: { id: true, name: true, email: true, image: true } },
        course: { select: { id: true, title: true, thumbnail: true, duration: true } },
        enrollment: { select: { id: true, status: true, completedAt: true } },
      },
      orderBy: { issuedAt: "desc" },
    });

    return NextResponse.json({ certificates });
  } catch (error) {
    console.error("Admin certificates GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { enrollmentId } = await req.json();
    if (!enrollmentId) {
      return NextResponse.json({ error: "Enrollment ID required" }, { status: 400 });
    }

    const enrollment = await prisma.enrollment.findUnique({
      where: { id: enrollmentId },
      include: { course: true, user: true },
    });

    if (!enrollment) {
      return NextResponse.json({ error: "Enrollment not found" }, { status: 404 });
    }

    if (enrollment.status !== "COMPLETED") {
      return NextResponse.json({ error: "Course not completed" }, { status: 400 });
    }

    const existing = await prisma.certificate.findUnique({
      where: { enrollmentId },
    });

    if (existing) {
      return NextResponse.json({ error: "Already issued", certificate: existing }, { status: 409 });
    }

    const certNumber = `PILD-${new Date().getFullYear()}-${Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()}`;

    const certificate = await prisma.certificate.create({
      data: {
        userId: enrollment.userId,
        courseId: enrollment.courseId,
        enrollmentId,
        certificateNumber: certNumber,
        createdBy: session.user.id,
      },
    });

    return NextResponse.json({ success: true, certificate });
  } catch (error) {
    console.error("Certificate issue error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}