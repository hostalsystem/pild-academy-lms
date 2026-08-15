import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function checkAdmin() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return false;
  }

  return session.user.role === "ADMIN";
}

// GET instructor
export async function GET(req: Request) {
  try {
    if (!(await checkAdmin())) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const instructor = await prisma.instructor.findUnique({
        where: {
          id,
        },
      });

      if (!instructor) {
        return NextResponse.json(
          { message: "Instructor not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        instructor,
      });
    }

    const instructors = await prisma.instructor.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      instructors,
    });
  } catch (error) {
    console.error("Get instructor error:", error);

    return NextResponse.json(
      {
        message: "Failed to load instructor",
      },
      { status: 500 }
    );
  }
}

// CREATE instructor
export async function POST(req: Request) {
  try {
    if (!(await checkAdmin())) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const {
      name,
      designation,
      email,
      phone,
      address,
      image,
      bio,
      education,
      experience,
    } = body;

    if (!name?.trim()) {
      return NextResponse.json(
        { message: "Instructor name is required" },
        { status: 400 }
      );
    }

    const instructor = await prisma.instructor.create({
      data: {
        name: name.trim(),
        designation: designation?.trim() || null,
        email: email?.trim() || null,
        phone: phone?.trim() || null,
        address: address?.trim() || null,
        image: image?.trim() || null,
        bio: bio?.trim() || null,
        education: education?.trim() || null,
        experience: experience?.trim() || null,
      },
    });

    return NextResponse.json(
      {
        message: "Instructor created successfully",
        instructor,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create instructor error:", error);

    return NextResponse.json(
      {
        message: "Failed to create instructor",
      },
      { status: 500 }
    );
  }
}

// UPDATE instructor
export async function PATCH(req: Request) {
  try {
    if (!(await checkAdmin())) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Instructor ID is required" },
        { status: 400 }
      );
    }

    const body = await req.json();

    const {
      name,
      designation,
      email,
      phone,
      address,
      image,
      bio,
      education,
      experience,
    } = body;

    if (!name?.trim()) {
      return NextResponse.json(
        { message: "Instructor name is required" },
        { status: 400 }
      );
    }

    const existingInstructor =
      await prisma.instructor.findUnique({
        where: {
          id,
        },
      });

    if (!existingInstructor) {
      return NextResponse.json(
        { message: "Instructor not found" },
        { status: 404 }
      );
    }

    const instructor = await prisma.instructor.update({
      where: {
        id,
      },
      data: {
        name: name.trim(),
        designation: designation?.trim() || null,
        email: email?.trim() || null,
        phone: phone?.trim() || null,
        address: address?.trim() || null,
        image: image?.trim() || null,
        bio: bio?.trim() || null,
        education: education?.trim() || null,
        experience: experience?.trim() || null,
      },
    });

    return NextResponse.json({
      message: "Instructor updated successfully",
      instructor,
    });
  } catch (error) {
    console.error("Update instructor error:", error);

    return NextResponse.json(
      {
        message: "Failed to update instructor",
      },
      { status: 500 }
    );
  }
}

// DELETE instructor
export async function DELETE(req: Request) {
  try {
    if (!(await checkAdmin())) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Instructor ID is required" },
        { status: 400 }
      );
    }

    const instructor = await prisma.instructor.findUnique({
      where: {
        id,
      },
    });

    if (!instructor) {
      return NextResponse.json(
        { message: "Instructor not found" },
        { status: 404 }
      );
    }

    await prisma.instructor.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      message: "Instructor deleted successfully",
    });
  } catch (error) {
    console.error("Delete instructor error:", error);

    return NextResponse.json(
      {
        message: "Failed to delete instructor",
      },
      { status: 500 }
    );
  }
}