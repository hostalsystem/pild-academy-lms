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

    const enrollments = await prisma.enrollment.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true, image: true },
        },
        course: {
          select: { id: true, title: true, thumbnail: true, fee: true },
        },
        payments: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { enrolledAt: "desc" },
    });

    return NextResponse.json({ enrollments });
  } catch (error) {
    console.error("Admin enrollments GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, status } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const enrollment = await prisma.enrollment.update({
      where: { id },
      data: {
        status,
        completedAt: status === "COMPLETED" ? new Date() : undefined,
      },
    });

    return NextResponse.json({ success: true, enrollment });
  } catch (error) {
    console.error("Admin enrollments PUT error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}