import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEFAULTS = {
  academyName: "PILD Academy",
  contactEmail: "",
  contactPhone: "",
  whatsappNumber: "",
  easypaisaNumber: "",
  jazzcashNumber: "",
  ublAccount: "",
};

export async function GET() {
  try {
    const settings = await prisma.siteSetting.findMany();
    const map: Record<string, string> = {};
    settings.forEach((s) => {
      map[s.key] = s.value;
    });
    const merged = { ...DEFAULTS, ...map };
    return NextResponse.json(merged);
  } catch (error) {
    console.error("Public settings error:", error);
    return NextResponse.json(DEFAULTS);
  }
}