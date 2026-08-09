"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Video,
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  Calendar,
  Clock,
  Users,
  Loader2,
  Search,
} from "lucide-react";
import { format } from "date-fns";

interface ZoomClass {
  id: string;
  title: string;
  description: string | null;
  meetingUrl: string;
  meetingId: string | null;
  passcode: string | null;
  startTime: string;
  endTime: string | null;
  recordingUrl: string | null;
  courseId: string;
  course?: { title: string };
  createdAt: string;
}

export default function AdminZoomClassesPage() {
  const [classes, setClasses] = useState<ZoomClass[]>([]);
  const [courses, setCourses] = useState<{ id: string; title: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ZoomClass | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    meetingUrl: "",
    meetingId: "",
    passcode: "",
    startTime: "",
    duration: "60",
    courseId: "",
  });

  useEffect(() => {
    fetchClasses();
    fetchCourses();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await fetch("/api/admin/zoom-classes");
      const data = await res.json();
      console.log("Fetched classes:", data);
      setClasses(data.classes || []);
    } catch (error) {
      console.error("Failed to fetch classes:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await fetch("/api/admin/courses");
      const data = await res.json();
      setCourses(data.courses || []);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    }
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      meetingUrl: "",
      meetingId: "",
      passcode: "",
      startTime: "",
      duration: "60",
      courseId: "",
    });
    setEditing(null);
    setErrorMsg("");
  };

  const openCreate = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEdit = (item: ZoomClass) => {
    setEditing(item);

    // Calculate duration from start and end
    let duration = "60";
    if (item.endTime) {
      const start = new Date(item.startTime).getTime();
      const end = new Date(item.endTime).getTime();
      duration = String(Math.round((end - start) / 60000));
    }

    setForm({
      title: item.title,
      description: item.description || "",
      meetingUrl: item.meetingUrl,
      meetingId: item.meetingId || "",
      passcode: item.passcode || "",
      startTime: format(new Date(item.startTime), "yyyy-MM-dd'T'HH:mm"),
      duration,
      courseId: item.courseId,
    });
    setErrorMsg("");
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setErrorMsg("");

    try {
      const url = editing
        ? `/api/admin/zoom-classes/${editing.id}`
        : "/api/admin/zoom-classes";
      const method = editing ? "PUT" : "POST";

      const payload = {
        ...form,
        duration: parseInt(form.duration),
      };
      console.log("Sending payload:", payload);

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("Response:", res.status, data);

      if (!res.ok) {
        setErrorMsg(data.error || data.message || `Server error: ${res.status}`);
      } else {
        setDialogOpen(false);
        resetForm();
        fetchClasses();
      }
    } catch (error: any) {
      console.error("Submit error:", error);
      setErrorMsg(error.message || "Network error. Check console.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this class?")) return;
    try {
      const res = await fetch(`/api/admin/zoom-classes/${id}`, { method: "DELETE" });
      if (res.ok) fetchClasses();
      else alert("Failed to delete");
    } catch {
      alert("Something went wrong");
    }
  };

  const getStatus = (item: ZoomClass) => {
    const now = new Date();
    const start = new Date(item.startTime);
    const end = item.endTime ? new Date(item.endTime) : new Date(start.getTime() + 60 * 60000);

    if (now < start) return { label: "Upcoming", color: "bg-blue-100 text-blue-700" };
    if (now >= start && now <= end) return { label: "Live", color: "bg-green-100 text-green-700" };
    return { label: "Ended", color: "bg-gray-100 text-gray-600" };
  };

  const getDuration = (item: ZoomClass) => {
    if (item.endTime) {
      const mins = Math.round((new Date(item.endTime).getTime() - new Date(item.startTime).getTime()) / 60000);
      return `${mins} min`;
    }
    return "N/A";
  };

  const filtered = classes.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    (c.course?.title || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Zoom Classes</h1>
          <p className="text-gray-500 mt-1">Manage live classes and Zoom meetings.</p>
        </div>
        <Button onClick={openCreate} className="bg-blue-600 hover:bg-blue-700 gap-2">
          <Plus className="h-4 w-4" /> Schedule Class
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4 flex items-center gap-3"><div className="bg-blue-100 p-2 rounded-lg"><Video className="h-5 w-5 text-blue-600" /></div><div><p className="text-2xl font-bold">{classes.length}</p><p className="text-xs text-gray-500">Total</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><div className="bg-green-100 p-2 rounded-lg"><Calendar className="h-5 w-5 text-green-600" /></div><div><p className="text-2xl font-bold">{classes.filter((c) => getStatus(c).label === "Upcoming").length}</p><p className="text-xs text-gray-500">Upcoming</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><div className="bg-red-100 p-2 rounded-lg"><Clock className="h-5 w-5 text-red-600" /></div><div><p className="text-2xl font-bold">{classes.filter((c) => getStatus(c).label === "Live").length}</p><p className="text-xs text-gray-500">Live</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><div className="bg-gray-100 p-2 rounded-lg"><Users className="h-5 w-5 text-gray-600" /></div><div><p className="text-2xl font-bold">{classes.filter((c) => getStatus(c).label === "Ended").length}</p><p className="text-xs text-gray-500">Ended</p></div></CardContent></Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Search classes..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-gray-400" /></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <Video className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No Zoom classes found.</p>
              <Button onClick={openCreate} variant="outline" className="mt-4 gap-2"><Plus className="h-4 w-4" />Schedule First Class</Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Class</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((item) => {
                    const status = getStatus(item);
                    return (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-gray-900">{item.title}</p>
                            <p className="text-xs text-gray-500">ID: {item.meetingId || "N/A"}</p>
                          </div>
                        </TableCell>
                        <TableCell><Badge variant="outline">{item.course?.title || "N/A"}</Badge></TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>{format(new Date(item.startTime), "MMM dd, yyyy")}</p>
                            <p className="text-gray-500">{format(new Date(item.startTime), "h:mm a")}</p>
                          </div>
                        </TableCell>
                        <TableCell>{getDuration(item)}</TableCell>
                        <TableCell><Badge className={status.color}>{status.label}</Badge></TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <a href={item.meetingUrl} target="_blank" rel="noopener noreferrer">
                              <Button variant="ghost" size="icon" className="text-blue-600"><ExternalLink className="h-4 w-4" /></Button>
                            </a>
                            <Button variant="ghost" size="icon" onClick={() => openEdit(item)}><Pencil className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" className="text-red-600" onClick={() => handleDelete(item.id)}><Trash2 className="h-4 w-4" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Zoom Class" : "Schedule New Class"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <Alert variant="destructive"><AlertDescription>{errorMsg}</AlertDescription></Alert>
            )}
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g., Live Q&A Session" required />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What will be covered?" rows={3} />
            </div>
            <div className="space-y-2">
              <Label>Course *</Label>
              <Select value={form.courseId} onValueChange={(v) => setForm({ ...form, courseId: v })}>
                <SelectTrigger><SelectValue placeholder="Select a course" /></SelectTrigger>
                <SelectContent>
                  {courses.map((c) => <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Meeting URL *</Label>
                <Input value={form.meetingUrl} onChange={(e) => setForm({ ...form, meetingUrl: e.target.value })} placeholder="https://zoom.us/j/..." required />
              </div>
              <div className="space-y-2">
                <Label>Meeting ID</Label>
                <Input value={form.meetingId} onChange={(e) => setForm({ ...form, meetingId: e.target.value })} placeholder="123 456 7890" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Passcode</Label>
                <Input value={form.passcode} onChange={(e) => setForm({ ...form, passcode: e.target.value })} placeholder="Optional" />
              </div>
              <div className="space-y-2">
                <Label>Duration (min) *</Label>
                <Input type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} min="1" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Start Time *</Label>
              <Input type="datetime-local" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} required />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => { setDialogOpen(false); resetForm(); }}>Cancel</Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={formLoading}>
                {formLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : editing ? "Save Changes" : "Schedule Class"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}