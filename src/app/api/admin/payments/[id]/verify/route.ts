import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const payment = await prisma.payment.update({
      where: { id: params.id },
      data: {
        status: "VERIFIED",
        verifiedBy: session.user.id,
        verifiedAt: new Date(),
      },
      include: { enrollment: true },
    });

    // Approve the enrollment too
    if (payment.enrollmentId) {
      await prisma.enrollment.update({
        where: { id: payment.enrollmentId },
        data: { status: "APPROVED" },
      });
    }

    revalidatePath("/admin/payments");
    revalidatePath("/dashboard");

    return NextResponse.json({ message: "Payment verified and course unlocked", payment });
  } catch (error) {
    console.error("Verify payment error:", error);
    return NextResponse.json({ message: "Failed to verify payment" }, { status: 500 });
  }
}