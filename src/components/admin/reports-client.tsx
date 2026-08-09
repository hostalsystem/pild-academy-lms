"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Users,
  BookOpen,
  DollarSign,
  CreditCard,
  Calendar,
  Award,
  BarChart3,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const COLORS = ["#1e40af", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6", "#ec4899"];

export function ReportsClient() {
  const [range, setRange] = useState("30");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [range]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/reports?range=${range}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatMonth = (key: string) => {
    const [year, month] = key.split("-");
    return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString("en-PK", {
      month: "short",
      year: "numeric",
    });
  };

  const revenueChartData = data?.revenueByMonth
    ? Object.entries(data.revenueByMonth).map(([key, value]) => ({
        name: formatMonth(key),
        revenue: value,
      }))
    : [];

  const enrollmentChartData = data?.enrollmentsByMonth
    ? Object.entries(data.enrollmentsByMonth).map(([key, value]: [string, any]) => ({
        name: formatMonth(key),
        total: value.total,
        approved: value.approved,
        pending: value.pending,
      }))
    : [];

  const studentChartData = data?.studentsByMonth
    ? Object.entries(data.studentsByMonth).map(([key, value]) => ({
        name: formatMonth(key),
        students: value,
      }))
    : [];

  const paymentPieData = data?.paymentStats
    ? [
        { name: "Paid", value: data.paymentStats.paid, color: "#10b981" },
        { name: "Pending", value: data.paymentStats.pending, color: "#f59e0b" },
        { name: "Rejected", value: data.paymentStats.rejected, color: "#ef4444" },
      ].filter((d) => d.value > 0)
    : [];

  const attendancePieData = data?.attendanceStats
    ? [
        { name: "Present", value: data.attendanceStats.present, color: "#10b981" },
        { name: "Absent", value: data.attendanceStats.absent, color: "#ef4444" },
        { name: "Late", value: data.attendanceStats.late, color: "#f59e0b" },
      ].filter((d) => d.value > 0)
    : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-10 w-10 text-gray-400 animate-spin" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Range Selector */}
      <div className="flex gap-2">
        {[
          { value: "7", label: "Last 7 Days" },
          { value: "30", label: "Last 30 Days" },
          { value: "90", label: "Last 3 Months" },
          { value: "365", label: "Last Year" },
        ].map((r) => (
          <Button
            key={r.value}
            variant={range === r.value ? "default" : "outline"}
            size="sm"
            onClick={() => setRange(r.value)}
            className={range === r.value ? "bg-pild-primary" : ""}
          >
            {r.label}
          </Button>
        ))}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-500">Total Revenue</p>
              <DollarSign className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              PKR {data.paymentStats?.totalAmount?.toLocaleString() || 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-500">New Students</p>
              <Users className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {Object.values(data.studentsByMonth || {}).reduce((a: any, b: any) => a + b, 0)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-500">Enrollments</p>
              <BookOpen className="h-5 w-5 text-purple-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {Object.values(data.enrollmentsByMonth || {}).reduce(
                (a: any, b: any) => a + b.total,
                0
              )}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-500">Quiz Avg Score</p>
              <Award className="h-5 w-5 text-pild-secondary" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {data.quizStats?.avgScore || 0}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-pild-primary" />
            Revenue Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          {revenueChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value: any) => `PKR ${value.toLocaleString()}`} />
                <Bar dataKey="revenue" fill="#1e40af" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-gray-400">No revenue data for this period</div>
          )}
        </CardContent>
      </Card>

      {/* Enrollments Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5 text-pild-primary" />
            Enrollment Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          {enrollmentChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={enrollmentChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#1e40af" radius={[4, 4, 0, 0]} />
                <Bar dataKey="approved" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pending" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-gray-400">No enrollment data for this period</div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Student Growth */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-pild-primary" />
              Student Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            {studentChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={studentChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="students"
                    stroke="#1e40af"
                    strokeWidth={2}
                    dot={{ fill: "#1e40af" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-12 text-gray-400">No data</div>
            )}
          </CardContent>
        </Card>

        {/* Payment Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-pild-primary" />
              Payment Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {paymentPieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={paymentPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {paymentPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-12 text-gray-400">No payment data</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Attendance & Quiz */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-pild-primary" />
              Attendance Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            {attendancePieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={attendancePieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label
                  >
                    {attendancePieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-12 text-gray-400">No attendance data</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="h-5 w-5 text-pild-primary" />
              Quiz Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-700">{data.quizStats?.total || 0}</p>
                <p className="text-xs text-blue-600">Total Attempts</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-700">{data.quizStats?.passed || 0}</p>
                <p className="text-xs text-green-600">Passed</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <p className="text-2xl font-bold text-red-700">{data.quizStats?.failed || 0}</p>
                <p className="text-xs text-red-600">Failed</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <BarChart3 className="h-5 w-5 text-pild-primary" />
              <span className="text-sm text-gray-600">Average Score:</span>
              <span className="text-lg font-bold text-gray-900">{data.quizStats?.avgScore || 0}%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-pild-primary" />
            Course Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50/50">
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Course</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Enrollments</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Completed</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {data.coursePerformance?.map((course: any, idx: number) => (
                  <tr key={idx} className="border-b last:border-0 hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-medium text-gray-900">{course.name}</td>
                    <td className="px-4 py-3 text-gray-600">{course.enrollments}</td>
                    <td className="px-4 py-3 text-green-600 font-medium">{course.completed}</td>
                    <td className="px-4 py-3 text-gray-900 font-semibold">
                      PKR {course.revenue.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}