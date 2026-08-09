"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  BookOpen,
  Loader2,
  Save,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface Course {
  id: string;
  title: string;
  thumbnail: string | null;
}

interface Student {
  userId: string;
  name: string | null;
  email: string;
  image: string | null;
  enrollmentId: string;
  status: string | null;
  notes: string | null;
  attendanceId: string | null;
}

interface Stats {
  totalClassDays: number;
  totalRecords: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  attendanceRate: number;
}

export function AttendanceManager({ courses }: { courses: Course[] }) {
  const router = useRouter();
  const [selectedCourse, setSelectedCourse] = useState(courses[0]?.id || "");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [students, setStudents] = useState<Student[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const fetchAttendance = async () => {
    if (!selectedCourse || !selectedDate) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/attendance?courseId=${selectedCourse}&date=${selectedDate}`
      );
      const data = await res.json();
      setStudents(data.students || []);

      const statsRes = await fetch(
        `/api/admin/attendance/stats?courseId=${selectedCourse}`
      );
      const statsData = await statsRes.json();
      setStats(statsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [selectedCourse, selectedDate]);

  const markAttendance = async (
    userId: string,
    status: "PRESENT" | "ABSENT" | "LATE"
  ) => {
    setSaving(userId);
    try {
      const res = await fetch("/api/admin/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          courseId: selectedCourse,
          date: selectedDate,
          status,
        }),
      });

      if (res.ok) {
        setStudents((prev) =>
          prev.map((s) =>
            s.userId === userId ? { ...s, status } : s
          )
        );
        setMessage("Attendance saved");
        setTimeout(() => setMessage(""), 2000);
        // Refresh stats
        const statsRes = await fetch(
          `/api/admin/attendance/stats?courseId=${selectedCourse}`
        );
        const statsData = await statsRes.json();
        setStats(statsData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(null);
    }
  };

  const getStatusButton = (student: Student) => {
    if (saving === student.userId) {
      return <Loader2 className="h-4 w-4 animate-spin text-gray-400" />;
    }

    return (
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => markAttendance(student.userId, "PRESENT")}
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center transition-all border-2",
            student.status === "PRESENT"
              ? "bg-green-500 border-green-500 text-white shadow-md"
              : "bg-white border-gray-200 text-gray-300 hover:border-green-300 hover:text-green-400"
          )}
          title="Present"
        >
          <CheckCircle className="h-4 w-4" />
        </button>
        <button
          onClick={() => markAttendance(student.userId, "LATE")}
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center transition-all border-2",
            student.status === "LATE"
              ? "bg-orange-500 border-orange-500 text-white shadow-md"
              : "bg-white border-gray-200 text-gray-300 hover:border-orange-300 hover:text-orange-400"
          )}
          title="Late"
        >
          <Clock className="h-4 w-4" />
        </button>
        <button
          onClick={() => markAttendance(student.userId, "ABSENT")}
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center transition-all border-2",
            student.status === "ABSENT"
              ? "bg-red-500 border-red-500 text-white shadow-md"
              : "bg-white border-gray-200 text-gray-300 hover:border-red-300 hover:text-red-400"
          )}
          title="Absent"
        >
          <XCircle className="h-4 w-4" />
        </button>
      </div>
    );
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "PRESENT":
        return (
          <Badge className="bg-green-100 text-green-700 gap-1">
            <CheckCircle className="h-3 w-3" /> Present
          </Badge>
        );
      case "ABSENT":
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-700 gap-1">
            <XCircle className="h-3 w-3" /> Absent
          </Badge>
        );
      case "LATE":
        return (
          <Badge className="bg-orange-100 text-orange-700 gap-1">
            <Clock className="h-3 w-3" /> Late
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-gray-400">
            <AlertCircle className="h-3 w-3 mr-1" /> Not Marked
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Course & Date Selector */}
      <Card>
        <CardContent className="p-5">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 space-y-1.5">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                <BookOpen className="h-4 w-4 text-gray-400" />
                Course
              </label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5 sm:w-48">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-gray-400" />
                Date
              </label>
              <input
                type="date"
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Class Days</p>
                <p className="text-2xl font-bold">{stats.totalClassDays}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Records</p>
                <p className="text-2xl font-bold">{stats.totalRecords}</p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Present</p>
                <p className="text-2xl font-bold text-green-600">{stats.presentCount}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Absent</p>
                <p className="text-2xl font-bold text-red-600">{stats.absentCount}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Rate</p>
                <p className="text-2xl font-bold text-gray-900">{stats.attendanceRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-pild-primary" />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Message */}
      {message && (
        <div className="bg-green-50 text-green-800 border border-green-200 rounded-lg px-4 py-2 text-sm flex items-center gap-2">
          <CheckCircle className="h-4 w-4" />
          {message}
        </div>
      )}

      {/* Students Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50/50">
                <th className="text-left px-6 py-3 font-medium text-gray-500">Student</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Email</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Status</th>
                <th className="text-right px-6 py-3 font-medium text-gray-500">Mark</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto" />
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No approved students for this course.</p>
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr
                    key={student.userId}
                    className="border-b last:border-0 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200 shrink-0">
                          {student.image ? (
                            <Image
                              src={student.image}
                              alt={student.name || ""}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <Users className="h-5 w-5 text-gray-400 m-auto" />
                          )}
                        </div>
                        <span className="font-medium text-gray-900">
                          {student.name || "Unnamed"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{student.email}</td>
                    <td className="px-6 py-4">{getStatusBadge(student.status)}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end">{getStatusButton(student)}</div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}