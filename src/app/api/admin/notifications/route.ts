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

    const notifications = await prisma.notification.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ notifications });
  } catch (error) {
    console.error("Admin notifications GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, message, type, userId } = await req.json();

    if (!title || !message) {
      return NextResponse.json({ error: "Title and message required" }, { status: 400 });
    }

    // If userId provided, send to specific user. Otherwise broadcast to all students.
    if (userId) {
      const notification = await prisma.notification.create({
        data: {
          userId,
          title,
          message,
          type: type || "INFO",
        },
      });
      return NextResponse.json({ success: true, notification });
    }

    // Broadcast: get all students and create notification for each
    const students = await prisma.user.findMany({
      where: { role: "STUDENT" },
      select: { id: true },
    });

    const notifications = await prisma.$transaction(
      students.map((student) =>
        prisma.notification.create({
          data: {
            userId: student.id,
            title,
            message,
            type: type || "INFO",
          },
        })
      )
    );

    return NextResponse.json({ success: true, count: notifications.length });
  } catch (error) {
    console.error("Admin notifications POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}