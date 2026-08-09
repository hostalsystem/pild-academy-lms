import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const DEFAULT_SETTINGS = {
  academyName: "PILD Academy",
  academyTagline: "Professional Institute of Learning & Development",
  contactEmail: "support@pildacademy.com",
  contactPhone: "",
  contactAddress: "",
  facebookUrl: "",
  youtubeUrl: "",
  linkedinUrl: "",
  whatsappNumber: "",
  easypaisaNumber: "",
  jazzcashNumber: "",
  ublAccount: "",
  maintenanceMode: "false",
  allowRegistration: "true",
  defaultCourseFee: "15000",
};

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const settings = await prisma.siteSetting.findMany();
    const settingsMap: Record<string, string> = {};

    settings.forEach((s) => {
      settingsMap[s.key] = s.value;
    });

    // Merge with defaults
    const merged = { ...DEFAULT_SETTINGS, ...settingsMap };

    return NextResponse.json({ settings: merged });
  } catch (error) {
    console.error("Settings GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const updates = Object.entries(body).map(([key, value]) =>
      prisma.siteSetting.upsert({
        where: { key },
        update: {
          value: String(value),
          updatedBy: session.user.id,
        },
        create: {
          key,
          value: String(value),
          category: "general",
          updatedBy: session.user.id,
        },
      })
    );

    await prisma.$transaction(updates);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Settings PUT error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}