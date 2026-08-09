import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Video,
  Calendar,
  Clock,
  PlayCircle,
  CheckCircle,
  AlertCircle,
  BookOpen,
  ExternalLink,
  Lock,
  Unlock,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

async function getZoomClasses(userId: string) {
  const enrollments = await prisma.enrollment.findMany({
    where: { userId, status: "APPROVED" },
    select: { courseId: true },
  });

  const courseIds = enrollments.map((e) => e.courseId);
  if (courseIds.length === 0) return [];

  return await prisma.zoomClass.findMany({
    where: { courseId: { in: courseIds } },
    include: {
      course: {
        select: { id: true, title: true, thumbnail: true, slug: true },
      },
    },
    orderBy: { startTime: "asc" },
  });
}

function getClassStatus(startTime: Date, endTime: Date | null) {
  const now = new Date();
  const start = new Date(startTime);
  const end = endTime ? new Date(endTime) : null;

  if (now < start) return "UPCOMING";
  if (!end || now <= end) return "LIVE";
  return "ENDED";
}

function formatTimeUntil(startTime: Date) {
  const now = new Date();
  const diff = new Date(startTime).getTime() - now.getTime();

  if (diff <= 0) return "Starting now...";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `Starts in ${days} day${days > 1 ? "s" : ""} ${hours}h`;
  if (hours > 0) return `Starts in ${hours}h ${minutes}m`;
  return `Starts in ${minutes} minute${minutes > 1 ? "s" : ""}`;
}

function formatDateTime(date: Date) {
  return new Date(date).toLocaleDateString("en-PK", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function ZoomClassesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const classes = await getZoomClasses(session.user.id);

  const now = new Date();
  const liveClasses = classes.filter(
    (c) => getClassStatus(c.startTime, c.endTime) === "LIVE"
  );
  const upcomingClasses = classes.filter(
    (c) => getClassStatus(c.startTime, c.endTime) === "UPCOMING"
  );
  const endedClasses = classes.filter(
    (c) => getClassStatus(c.startTime, c.endTime) === "ENDED"
  );

  const total = classes.length;
  const upcomingCount = upcomingClasses.length;
  const liveCount = liveClasses.length;
  const endedCount = endedClasses.length;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Zoom Classes</h1>
        <p className="text-gray-500 mt-1">
          Join live sessions and watch recorded classes.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Total</p>
              <p className="text-2xl font-bold">{total}</p>
            </div>
            <Video className="h-8 w-8 text-blue-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Upcoming</p>
              <p className="text-2xl font-bold">{upcomingCount}</p>
            </div>
            <Calendar className="h-8 w-8 text-yellow-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Live Now</p>
              <p className="text-2xl font-bold text-red-600">{liveCount}</p>
            </div>
            <div className="relative">
              <Video className="h-8 w-8 text-red-500" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Completed</p>
              <p className="text-2xl font-bold">{endedCount}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </CardContent>
        </Card>
      </div>

      {/* Live Now Section */}
      {liveCount > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
            </span>
            Live Now
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {liveClasses.map((cls) => (
              <Card
                key={cls.id}
                className="overflow-hidden border-red-200 bg-red-50/30"
              >
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row">
                    <div className="relative w-full sm:w-44 h-44 sm:h-auto bg-gray-200 shrink-0">
                      {cls.course.thumbnail ? (
                        <Image
                          src={cls.course.thumbnail}
                          alt={cls.course.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Video className="h-10 w-10 text-gray-400" />
                        </div>
                      )}
                      <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                        <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        LIVE
                      </div>
                    </div>
                    <div className="flex-1 p-5 space-y-3">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          {cls.course.title}
                        </p>
                        <h3 className="font-semibold text-lg text-gray-900">
                          {cls.title}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600">
                        {cls.description || "Join the live class now."}
                      </p>
                      <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          Started at {formatDateTime(cls.startTime)}
                        </span>
                        {cls.meetingId && (
                          <span className="flex items-center gap-1 font-mono">
                            <Lock className="h-3.5 w-3.5" />
                            ID: {cls.meetingId}
                          </span>
                        )}
                      </div>
                      <a
                        href={cls.meetingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button className="w-full bg-red-600 hover:bg-red-700 gap-2 mt-2">
                          <PlayCircle className="h-4 w-4" />
                          Join Live Class
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Button>
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Classes */}
      {upcomingCount > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-pild-primary" />
            Upcoming Classes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingClasses.map((cls) => {
              const status = getClassStatus(cls.startTime, cls.endTime);
              const timeUntil = formatTimeUntil(cls.startTime);

              return (
                <Card
                  key={cls.id}
                  className="overflow-hidden hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row">
                      <div className="relative w-full sm:w-40 h-40 sm:h-auto bg-gray-200 shrink-0">
                        {cls.course.thumbnail ? (
                          <Image
                            src={cls.course.thumbnail}
                            alt={cls.course.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <Video className="h-10 w-10 text-gray-400" />
                          </div>
                        )}
                        <div className="absolute top-3 left-3 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          UPCOMING
                        </div>
                      </div>
                      <div className="flex-1 p-5 space-y-3">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">
                            {cls.course.title}
                          </p>
                          <h3 className="font-semibold text-gray-900">
                            {cls.title}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {cls.description || "Class will start soon."}
                        </p>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm font-medium text-yellow-700 bg-yellow-50 rounded-lg px-3 py-2">
                            <Clock className="h-4 w-4" />
                            {timeUntil}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Calendar className="h-3.5 w-3.5" />
                            {formatDateTime(cls.startTime)}
                          </div>
                          {cls.meetingId && (
                            <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
                              <Lock className="h-3.5 w-3.5" />
                              Meeting ID: {cls.meetingId}
                            </div>
                          )}
                          {cls.passcode && (
                            <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
                              <Unlock className="h-3.5 w-3.5" />
                              Passcode: {cls.passcode}
                            </div>
                          )}
                        </div>
                        <Button
                          disabled
                          variant="outline"
                          className="w-full gap-2 text-gray-400"
                        >
                          <AlertCircle className="h-4 w-4" />
                          Not Started Yet
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Past / Recorded Classes */}
      {endedCount > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Recorded Classes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {endedClasses.map((cls) => (
              <Card
                key={cls.id}
                className="overflow-hidden hover:shadow-md transition-shadow"
              >
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row">
                    <div className="relative w-full sm:w-40 h-40 sm:h-auto bg-gray-200 shrink-0">
                      {cls.course.thumbnail ? (
                        <Image
                          src={cls.course.thumbnail}
                          alt={cls.course.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Video className="h-10 w-10 text-gray-400" />
                        </div>
                      )}
                      <div className="absolute top-3 left-3 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                        ENDED
                      </div>
                    </div>
                    <div className="flex-1 p-5 space-y-3">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          {cls.course.title}
                        </p>
                        <h3 className="font-semibold text-gray-900">
                          {cls.title}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {cls.description || "Class has ended."}
                      </p>
                      <div className="text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDateTime(cls.startTime)}
                        </span>
                      </div>
                      {cls.recordingUrl ? (
                        <a
                          href={cls.recordingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button
                            variant="outline"
                            className="w-full gap-2 text-pild-primary border-pild-primary/30 hover:bg-blue-50"
                          >
                            <PlayCircle className="h-4 w-4" />
                            Watch Recording
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Button>
                        </a>
                      ) : (
                        <Button
                          disabled
                          variant="outline"
                          className="w-full gap-2 text-gray-400"
                        >
                          <AlertCircle className="h-4 w-4" />
                          Recording Not Available
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {total === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Video className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-500 mb-2">
              No Zoom Classes
            </h3>
            <p className="text-gray-400 mb-4">
              Your instructor hasn't scheduled any live classes yet.
            </p>
            <Link href="/my-learning">
              <Button variant="outline" className="gap-2">
                <BookOpen className="h-4 w-4" />
                Go to My Learning
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}