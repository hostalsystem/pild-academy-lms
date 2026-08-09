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
        status: "REJECTED",
        verifiedBy: session.user.id,
        verifiedAt: new Date(),
      },
    });

    revalidatePath("/admin/payments");

    return NextResponse.json({ message: "Payment rejected", payment });
  } catch (error) {
    console.error("Reject payment error:", error);
    return NextResponse.json({ message: "Failed to reject payment" }, { status: 500 });
  }
}