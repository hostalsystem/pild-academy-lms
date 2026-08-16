import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
// import { Prisma } from "@prisma/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Award,
  FileText,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Download,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { IssueCertificate } from "@/components/admin/issue-certificate";

async function getCertificates() {
  return await prisma.certificate.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      course: {
        select: {
          id: true,
          title: true,
          thumbnail: true,
          duration: true,
        },
      },
      enrollment: {
        select: {
          id: true,
          completedAt: true,
        },
      },
    },
    orderBy: {
      issuedAt: "desc",
    },
  });
}

async function getPending() {
  return await prisma.enrollment.findMany({
    where: {
      status: "COMPLETED",
      certificate: null,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      course: {
        select: {
          id: true,
          title: true,
          thumbnail: true,
          duration: true,
        },
      },
    },
    orderBy: {
      completedAt: "desc",
    },
  });
}
type Certificates = Awaited<ReturnType<typeof getCertificates>>;
type Certificate = Certificates[number];

type PendingEnrollments = Awaited<ReturnType<typeof getPending>>;
type PendingEnrollment = PendingEnrollments[number];
export default async function AdminCertificatesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const certificates = await getCertificates();
  const pending = await getPending();

  const totalIssued = certificates.length;
  const totalPending = pending.length;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Certificates</h1>
        <p className="text-gray-500 mt-1">
          Issue and manage student certificates.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Issued</p>
              <p className="text-2xl font-bold text-green-600">{totalIssued}</p>
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
              <p className="text-2xl font-bold text-yellow-600">{totalPending}</p>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Students</p>
              <p className="text-2xl font-bold text-blue-600">
                {new Set(
  certificates.map((c: Certificate) => c.userId)
).size}
              </p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Courses</p>
              <p className="text-2xl font-bold text-purple-600">
                {new Set(
  certificates.map((c: Certificate) => c.courseId)
).size}
              </p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <BookOpen className="h-6 w-6 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Certifications */}
      {totalPending > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Clock className="h-5 w-5 text-yellow-500" />
            Pending Certification
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
              {totalPending}
            </Badge>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pending.map((enrollment: PendingEnrollment) => (
              <Card key={enrollment.id} className="overflow-hidden border-yellow-200">
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
                        <p className="text-xs text-gray-500 mb-1">{enrollment.course.title}</p>
                        <h3 className="font-semibold text-gray-900">
                          {enrollment.user.name || "Unnamed"}
                        </h3>
                        <p className="text-xs text-gray-500">{enrollment.user.email}</p>
                      </div>
                      {enrollment.completedAt && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                          Completed {new Date(enrollment.completedAt).toLocaleDateString("en-PK")}
                        </div>
                      )}
                      <IssueCertificate enrollment={enrollment as any} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Issued Certificates */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Award className="h-5 w-5 text-pild-primary" />
          Issued Certificates
        </h2>

        {certificates.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <Award className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No certificates issued yet.</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50/50">
                    <th className="text-left px-6 py-3 font-medium text-gray-500">Student</th>
                    <th className="text-left px-6 py-3 font-medium text-gray-500">Course</th>
                    <th className="text-left px-6 py-3 font-medium text-gray-500">Cert #</th>
                    <th className="text-left px-6 py-3 font-medium text-gray-500">Issued</th>
                    <th className="text-right px-6 py-3 font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {certificates.map((cert) => (
                    <tr
                      key={cert.id}
                      className="border-b last:border-0 hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200 shrink-0">
                            {cert.user.image ? (
                              <Image
                                src={cert.user.image}
                                alt={cert.user.name || ""}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <Users className="h-5 w-5 text-gray-400 m-auto" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 truncate">
                              {cert.user.name || "Unnamed"}
                            </p>
                            <p className="text-xs text-gray-500 truncate">{cert.user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-8 h-8 rounded overflow-hidden bg-gray-200 shrink-0">
                            {cert.course.thumbnail ? (
                              <Image
                                src={cert.course.thumbnail}
                                alt={cert.course.title}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <BookOpen className="h-4 w-4 text-gray-400 m-auto" />
                            )}
                          </div>
                          <span className="text-gray-700">{cert.course.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant="outline"
                          className="font-mono text-pild-primary border-pild-primary/30 text-xs"
                        >
                          <FileText className="h-3 w-3 mr-1" />
                          {cert.certificateNumber}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(cert.issuedAt).toLocaleDateString("en-PK", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/certificates/verify/${cert.certificateNumber}`}>
                            <Button size="sm" variant="outline" className="gap-1.5">
                              <Award className="h-3.5 w-3.5" />
                              View
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}