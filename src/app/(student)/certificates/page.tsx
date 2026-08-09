import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Award,
  BookOpen,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  FileText,
  TrendingUp,
  GraduationCap,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { CertificateDownloadButton } from "@/components/certificates/download-button";

async function getCertificates(userId: string) {
  const certificates = await prisma.certificate.findMany({
    where: { userId },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          slug: true,
          thumbnail: true,
          duration: true,
        },
      },
    },
    orderBy: { issuedAt: "desc" },
  });

  // Also get enrollments that are completed but not yet certified
  const completedEnrollments = await prisma.enrollment.findMany({
    where: {
      userId,
      status: "COMPLETED",
      certificate: null,
    },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          slug: true,
          thumbnail: true,
          duration: true,
        },
      },
    },
  });

  return { certificates, pendingCertification: completedEnrollments };
}

export default async function CertificatesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const { certificates, pendingCertification } = await getCertificates(
    session.user.id
  );

  const totalEarned = certificates.length;
  const pendingCount = pendingCertification.length;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Certificates</h1>
        <p className="text-gray-500 mt-1">
          Download your earned certificates and track your achievements.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Earned</p>
              <p className="text-2xl font-bold text-gray-900">{totalEarned}</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <Award className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {pendingCount}
              </p>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Total Courses</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalEarned + pendingCount}
              </p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Earned Certificates */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Award className="h-5 w-5 text-pild-primary" />
          Earned Certificates
        </h2>

        {certificates.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <Award className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-500 mb-1">
                No Certificates Yet
              </h3>
              <p className="text-gray-400 text-sm">
                Complete your courses to earn certificates.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certificates.map((cert) => (
              <Card
                key={cert.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row">
                    <div className="relative w-full sm:w-44 h-44 sm:h-auto bg-gray-200 shrink-0">
                      {cert.course.thumbnail ? (
                        <Image
                          src={cert.course.thumbnail}
                          alt={cert.course.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <BookOpen className="h-10 w-10 text-gray-400" />
                        </div>
                      )}
                      <div className="absolute top-3 left-3 bg-pild-primary text-white text-xs font-bold px-2 py-1 rounded-full">
                        CERTIFIED
                      </div>
                    </div>
                    <div className="flex-1 p-5 space-y-3">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          {cert.course.title}
                        </p>
                        <h3 className="font-semibold text-gray-900 text-lg">
                          Certificate of Completion
                        </h3>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
                          <FileText className="h-3.5 w-3.5" />
                          {cert.certificateNumber}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                          Issued on{" "}
                          {new Date(cert.issuedAt).toLocaleDateString("en-PK", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </div>
                        {cert.course.duration && (
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Clock className="h-3.5 w-3.5" />
                            Duration: {cert.course.duration}
                          </div>
                        )}
                      </div>

                      <CertificateDownloadButton
                        studentName={session.user.name || "Student"}
                        courseName={cert.course.title}
                        certificateNumber={cert.certificateNumber}
                        issuedDate={new Date(cert.issuedAt).toLocaleDateString(
                          "en-PK",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                        duration={cert.course.duration}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Pending Certification */}
      {pendingCount > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Clock className="h-5 w-5 text-yellow-500" />
            Pending Certification
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingCertification.map((enrollment) => (
              <Card
                key={enrollment.id}
                className="overflow-hidden border-yellow-200 bg-yellow-50/30"
              >
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row">
                    <div className="relative w-full sm:w-40 h-40 sm:h-auto bg-gray-200 shrink-0">
                      {enrollment.course.thumbnail ? (
                        <Image
                          src={enrollment.course.thumbnail}
                          alt={enrollment.course.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <BookOpen className="h-10 w-10 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 p-5 space-y-3">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          {enrollment.course.title}
                        </p>
                        <h3 className="font-semibold text-gray-900">
                          Awaiting Certificate
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600">
                        You have completed this course. Your certificate is being
                        processed by the admin.
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className="bg-yellow-100 text-yellow-700"
                        >
                          <Clock className="h-3 w-3 mr-1" /> Processing
                        </Badge>
                      </div>
                      <Link href={`/my-learning/${enrollment.course.slug}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 mt-2"
                        >
                          <GraduationCap className="h-4 w-4" />
                          Review Course
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}