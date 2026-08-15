import { prisma } from "@/lib/prisma";

type NotificationType =
  | "INFO"
  | "SUCCESS"
  | "WARNING"
  | "ERROR";

interface CreateNotificationOptions {
  userId?: string;
  courseId?: string;
  title: string;
  message: string;
  type?: NotificationType;
}

/**
 * Create a notification for:
 *
 * 1. One specific student using userId
 * 2. Students enrolled in a specific course using courseId
 * 3. All students when neither userId nor courseId is supplied
 */
export async function createNotification({
  userId,
  courseId,
  title,
  message,
  type = "INFO",
}: CreateNotificationOptions) {
  try {
    // --------------------------------------------------
    // 1. Notification for one specific student
    // --------------------------------------------------
    if (userId) {
      return await prisma.notification.create({
        data: {
          userId,
          title,
          message,
          type,
          read: false,
        },
      });
    }

    // --------------------------------------------------
    // 2. Notification for students enrolled in a course
    // --------------------------------------------------
    if (courseId) {
      const enrollments = await prisma.enrollment.findMany({
        where: {
          courseId,
        },
        select: {
          userId: true,
        },
      });

      if (enrollments.length === 0) {
        return null;
      }

      return await prisma.notification.createMany({
        data: enrollments.map((enrollment) => ({
          userId: enrollment.userId,
          title,
          message,
          type,
          read: false,
        })),
      });
    }

    // --------------------------------------------------
    // 3. Broadcast notification to all students
    // --------------------------------------------------
    const students = await prisma.user.findMany({
      where: {
        role: "STUDENT",
      },
      select: {
        id: true,
      },
    });

    if (students.length === 0) {
      return null;
    }

    return await prisma.notification.createMany({
      data: students.map((student) => ({
        userId: student.id,
        title,
        message,
        type,
        read: false,
      })),
    });
  } catch (error) {
    console.error("Create notification error:", error);

    // Notification failure must never break
    // the original feature.
    return null;
  }
}