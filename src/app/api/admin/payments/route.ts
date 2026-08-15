import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Please login before submitting payment." },
        { status: 401 }
      );
    }

    const body = await req.json();

    console.log("========== PAYMENT REQUEST ==========");
    console.log("Payment body:", body);
    console.log("User ID:", session.user.id);
    console.log("=====================================");

    const {
      courseId,
      method,
      transactionId,
      screenshotUrl,
      amount,
    } = body;

    // Validate course
    if (!courseId) {
      return NextResponse.json(
        { message: "Course ID is missing." },
        { status: 400 }
      );
    }

    // Validate payment method
    if (!method) {
      return NextResponse.json(
        { message: "Payment method is missing." },
        { status: 400 }
      );
    }

    // Validate transaction ID
    if (!transactionId || !transactionId.trim()) {
      return NextResponse.json(
        { message: "Transaction ID is missing." },
        { status: 400 }
      );
    }

    // Validate amount
    if (amount === undefined || amount === null || Number(amount) <= 0) {
      return NextResponse.json(
        { message: "Payment amount is missing or invalid." },
        { status: 400 }
      );
    }

    // Find course
    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
    });

    if (!course) {
      return NextResponse.json(
        { message: "Course not found." },
        { status: 404 }
      );
    }

    // Find student's enrollment
    let enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId: course.id,
        },
      },
    });

    // Create enrollment if it does not exist
    if (!enrollment) {
      enrollment = await prisma.enrollment.create({
        data: {
          userId: session.user.id,
          courseId: course.id,
          status: "PENDING",
        },
      });
    }

    // Check duplicate transaction
    const existingPayment = await prisma.payment.findFirst({
      where: {
        transactionId: transactionId.trim(),
      },
    });

    if (existingPayment) {
      return NextResponse.json(
        {
          message: "This transaction ID has already been submitted.",
        },
        { status: 409 }
      );
    }

    // Create payment
    const payment = await prisma.payment.create({
      data: {
        userId: session.user.id,
        courseId: course.id,
        enrollmentId: enrollment.id,
        amount: Number(amount),
        method,
        transactionId: transactionId.trim(),
        screenshotUrl: screenshotUrl || null,
        status: "PENDING",
      },
    });

    revalidatePath("/admin/payments");
    revalidatePath("/dashboard");

    return NextResponse.json(
      {
        message: "Payment submitted successfully.",
        payment,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE PAYMENT ERROR:", error);

    return NextResponse.json(
      {
        message: "Failed to submit payment.",
      },
      { status: 500 }
    );
  }
}