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

    const pending = await prisma.enrollment.findMany({
      where: {
        status: "COMPLETED",
        certificate: null,
      },
      include: {
        user: { select: { id: true, name: true, email: true, image: true } },
        course: { select: { id: true, title: true, thumbnail: true, duration: true } },
      },
      orderBy: { completedAt: "desc" },
    });

    return NextResponse.json({ pending });
  } catch (error) {
    console.error("Pending certs GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}