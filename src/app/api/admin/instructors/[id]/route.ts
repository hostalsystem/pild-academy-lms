import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

async function checkAdmin() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return {
      authorized: false,
      response: NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      ),
    };
  }

  const role = (session.user as { role?: string }).role;

  if (role !== "ADMIN") {
    return {
      authorized: false,
      response: NextResponse.json(
        {
          message: "Admin access required",
        },
        {
          status: 403,
        }
      ),
    };
  }

  return {
    authorized: true,
    session,
  };
}

export async function GET(
  req: Request,
  { params }: RouteContext
) {
  try {
    const auth = await checkAdmin();

    if (!auth.authorized) {
      return auth.response;
    }

    const { id } = await params;

    const instructor = await prisma.instructor.findUnique({
      where: {
        id,
      },
    });

    if (!instructor) {
      return NextResponse.json(
        {
          message: "Instructor not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      instructor,
    });
  } catch (error) {
    console.error("Get instructor error:", error);

    return NextResponse.json(
      {
        message: "Failed to load instructor",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: RouteContext
) {
  try {
    const auth = await checkAdmin();

    if (!auth.authorized) {
      return auth.response;
    }

    const { id } = await params;

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
      specialization,
      skills,
      courses,
      portfolioUrl,
      facebook,
      instagram,
      linkedin,
      youtube,
      github,
    } = body;

    if (!name?.trim()) {
      return NextResponse.json(
        {
          message: "Instructor name is required",
        },
        {
          status: 400,
        }
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
        {
          message: "Instructor not found",
        },
        {
          status: 404,
        }
      );
    }

    const instructor = await prisma.instructor.update({
      where: {
        id,
      },

      data: {
        name: name.trim(),

        designation:
          designation?.trim() || null,

        email:
          email?.trim() || null,

        phone:
          phone?.trim() || null,

        address:
          address?.trim() || null,

        image:
          image?.trim() || null,

        bio:
          bio?.trim() || null,

        education:
          education?.trim() || null,

        experience:
          experience?.trim() || null,

        specialization:
          specialization?.trim() || null,

        skills:
          Array.isArray(skills)
            ? skills
            : [],

        courses:
          Array.isArray(courses)
            ? courses
            : [],

        portfolioUrl:
          portfolioUrl?.trim() || null,

        facebook:
          facebook?.trim() || null,

        instagram:
          instagram?.trim() || null,

        linkedin:
          linkedin?.trim() || null,

        youtube:
          youtube?.trim() || null,

        github:
          github?.trim() || null,
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
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: RouteContext
) {
  try {
    const auth = await checkAdmin();

    if (!auth.authorized) {
      return auth.response;
    }

    const { id } = await params;

    const existingInstructor =
      await prisma.instructor.findUnique({
        where: {
          id,
        },
      });

    if (!existingInstructor) {
      return NextResponse.json(
        {
          message: "Instructor not found",
        },
        {
          status: 404,
        }
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
      {
        status: 500,
      }
    );
  }
}