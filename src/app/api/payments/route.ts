import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized. Please sign in." }, { status: 401 });
    }

    const body = await req.json();
    const { courseId, method, transactionId, screenshotUrl, amount } = body;

    // Validation
    if (!courseId || !method || !transactionId || !amount) {
      return NextResponse.json(
        { message: "Missing required fields: courseId, method, transactionId, amount" },
        { status: 400 }
      );
    }

    const validMethods = ["EASYPAYSA", "JAZZCASH", "UBL_BANK"];
    if (!validMethods.includes(method)) {
      return NextResponse.json(
        { message: "Invalid payment method" },
        { status: 400 }
      );
    }

    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json({ message: "Course not found" }, { status: 404 });
    }

    // Check if enrollment exists, create if not
    let enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId: courseId,
        },
      },
    });

    if (!enrollment) {
      enrollment = await prisma.enrollment.create({
        data: {
          userId: session.user.id,
          courseId: courseId,
          status: "PENDING",
        },
      });
    }

    // Check if payment already submitted for this enrollment
    const existingPayment = await prisma.payment.findFirst({
      where: {
        userId: session.user.id,
        courseId: courseId,
        status: "PENDING",
      },
    });

    if (existingPayment) {
      return NextResponse.json(
        { message: "Payment already submitted and pending verification", payment: existingPayment },
        { status: 200 }
      );
    }

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        userId: session.user.id,
        courseId: courseId,
        enrollmentId: enrollment.id,
        amount: amount,
        method: method,
        transactionId: transactionId,
        screenshotUrl: screenshotUrl || null,
        status: "PENDING",
      },
    });

    return NextResponse.json(
      {
        message: "Payment submitted successfully. Pending admin verification.",
        payment: {
          id: payment.id,
          amount: payment.amount,
          method: payment.method,
          status: payment.status,
          createdAt: payment.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Payment submission error:", error);
    return NextResponse.json(
      { message: "Failed to submit payment. Please try again." },
      { status: 500 }
    );
  }
}

// GET - Fetch user's payment history
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const payments = await prisma.payment.findMany({
      where: {
        userId: session.user.id,
        ...(status && { status }),
      },
      include: {
        course: {
          select: {
            title: true,
            slug: true,
            thumbnail: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ payments });
  } catch (error) {
    console.error("Fetch payments error:", error);
    return NextResponse.json(
      { message: "Failed to fetch payments" },
      { status: 500 }
    );
  }
}