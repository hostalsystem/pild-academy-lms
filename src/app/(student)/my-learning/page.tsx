import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, ArrowRight, GraduationCap, Clock, PlayCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

async function getMyLearningData(userId: string) {
  const enrollments = await prisma.enrollment.findMany({
    where: {
      userId,
      status: "APPROVED",
    },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          slug: true,
          thumbnail: true,
          description: true,
        },
      },
    },
    orderBy: { enrolledAt: "desc" },
  });

  const enrollmentsWithProgress = await Promise.all(
    enrollments.map(async (enrollment) => {
      const totalLessons = await prisma.lesson.count({
        where: { courseId: enrollment.courseId },
      });
      const completedLessons = await prisma.progress.count({
        where: {
          enrollmentId: enrollment.id,
          completed: true,
        },
      });
      const lastProgress = await prisma.progress.findFirst({
        where: { enrollmentId: enrollment.id },
        orderBy: { completedAt: "desc" },
        select: { completedAt: true },
      });

      return {
        ...enrollment,
        totalLessons,
        completedLessons,
        progressPercent: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
        lastActivity: lastProgress?.completedAt || enrollment.enrolledAt,
      };
    })
  );

  return enrollmentsWithProgress;
}

export default async function MyLearningPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const enrollments = await getMyLearningData(session.user.id);

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Learning</h1>
        <p className="text-gray-500 mt-1">Continue where you left off and track your progress.</p>
      </div>

      {enrollments.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <GraduationCap className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-500 mb-2">No Active Courses</h3>
            <p className="text-gray-400 mb-6">You don't have any approved enrollments yet.</p>
            <Link href="/courses">
              <Button className="bg-pild-primary">
                Browse Courses <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {enrollments.map((enrollment) => (
            <Card key={enrollment.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48 bg-gray-200">
                {enrollment.course.thumbnail ? (
                  <Image
                    src={enrollment.course.thumbnail}
                    alt={enrollment.course.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <BookOpen className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                <div className="absolute top-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                  {enrollment.progressPercent}%
                </div>
              </div>
              <CardContent className="p-5">
                <h3 className="font-semibold text-lg mb-2 line-clamp-1">{enrollment.course.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                  {enrollment.course.description || "No description available."}
                </p>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{enrollment.completedLessons} of {enrollment.totalLessons} lessons</span>
                    <span className="text-pild-primary font-medium">{enrollment.progressPercent}%</span>
                  </div>
                  <Progress value={enrollment.progressPercent} className="h-2" />

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <Clock className="h-3.5 w-3.5" />
                      <span>Last active {new Date(enrollment.lastActivity).toLocaleDateString("en-PK")}</span>
                    </div>
                    <Link href={`/my-learning/${enrollment.course.slug}`}>
                      <Button size="sm" className="bg-pild-primary gap-1.5">
                        <PlayCircle className="h-4 w-4" />
                        Continue
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}