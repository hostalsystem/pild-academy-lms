"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Pencil,
  Trash2,
  User,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Search,
  Loader2,
  GraduationCap,
} from "lucide-react";

type Instructor = {
  id: string;
  name: string;
  designation: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  image: string | null;
  bio: string | null;
  education: string | null;
  experience: string | null;
  specialization: string | null;
  skills: string[];
  courses: string[];
  portfolioUrl: string | null;
  facebook: string | null;
  instagram: string | null;
  linkedin: string | null;
  youtube: string | null;
  github: string | null;
  createdAt: string;
  updatedAt: string;
};

export default function InstructorsAdminPage() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  async function loadInstructors() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/instructors", {
        method: "GET",
        cache: "no-store",
      });

      const text = await response.text();

      let data: {
        instructors?: Instructor[];
        message?: string;
      } = {};

      if (text) {
        try {
          data = JSON.parse(text);
        } catch {
          throw new Error("Server returned an invalid response.");
        }
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load instructors."
        );
      }

      setInstructors(data.instructors || []);
    } catch (error) {
      console.error("Load instructors error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load instructors."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadInstructors();
  }, []);

  async function handleDelete(id: string) {
    const instructor = instructors.find(
      (item) => item.id === id
    );

    const confirmed = window.confirm(
      `Are you sure you want to delete ${
        instructor?.name || "this instructor"
      }?\n\nThis will permanently remove the instructor profile from the website.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);

      const response = await fetch(
        `/api/admin/instructors/${id}`,
        {
          method: "DELETE",
        }
      );

      const text = await response.text();

      let data: { message?: string } = {};

      if (text) {
        try {
          data = JSON.parse(text);
        } catch {
          throw new Error("Server returned an invalid response.");
        }
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete instructor."
        );
      }

      setInstructors((current) =>
        current.filter((item) => item.id !== id)
      );
    } catch (error) {
      console.error("Delete instructor error:", error);

      window.alert(
        error instanceof Error
          ? error.message
          : "Failed to delete instructor."
      );
    } finally {
      setDeletingId(null);
    }
  }

  const filteredInstructors = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return instructors;
    }

    return instructors.filter((instructor) => {
      return (
        instructor.name.toLowerCase().includes(value) ||
        instructor.designation
          ?.toLowerCase()
          .includes(value) ||
        instructor.specialization
          ?.toLowerCase()
          .includes(value) ||
        instructor.email
          ?.toLowerCase()
          .includes(value) ||
        instructor.courses.some((course) =>
          course.toLowerCase().includes(value)
        )
      );
    });
  }, [instructors, search]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <GraduationCap className="h-6 w-6" />
            </div>

            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Instructors
              </h1>

              <p className="mt-1 text-gray-500">
                Manage instructor profiles displayed on your public
                website.
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/admin/instructors/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          Add Instructor
        </Link>
      </div>

      {/* Search and statistics */}
      {!loading && (
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Total Instructors
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {instructors.length}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Showing
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {filteredInstructors.length}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search instructors..."
                className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-5 text-red-700 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold">
              Unable to load instructors
            </p>

            <p className="mt-1 text-sm">
              {error}
            </p>
          </div>

          <button
            type="button"
            onClick={loadInstructors}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex min-h-[350px] items-center justify-center rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-col items-center gap-3 text-gray-500">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />

            <p className="font-medium">
              Loading instructors...
            </p>
          </div>
        </div>
      ) : filteredInstructors.length === 0 ? (
        /* Empty state */
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            {search ? (
              <Search className="h-7 w-7 text-gray-400" />
            ) : (
              <User className="h-7 w-7 text-gray-400" />
            )}
          </div>

          <h2 className="mt-5 text-xl font-bold text-gray-900">
            {search
              ? "No instructors found"
              : "No instructors yet"}
          </h2>

          <p className="mx-auto mt-2 max-w-md text-gray-500">
            {search
              ? "Try searching with another instructor name, specialization, or course."
              : "Create your first instructor profile. It will become available on the public instructors page."}
          </p>

          {search ? (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="mt-6 rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Clear Search
            </button>
          ) : (
            <Link
              href="/admin/instructors/new"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
            >
              <Plus className="h-5 w-5" />
              Add Instructor
            </Link>
          )}
        </div>
      ) : (
        /* Instructor cards */
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredInstructors.map((instructor) => (
            <div
              key={instructor.id}
              className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Cover */}
              <div className="relative h-28 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700">
                <div className="absolute inset-0 bg-black/10" />
              </div>

              {/* Profile */}
              <div className="px-6 pb-6">
                <div className="-mt-14">
                  <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-gray-100 shadow-lg">
                    {instructor.image ? (
                      <img
                        src={instructor.image}
                        alt={instructor.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User className="h-12 w-12 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Name */}
                <div className="mt-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    {instructor.name}
                  </h2>

                  {instructor.designation && (
                    <p className="mt-1 text-sm font-medium text-blue-600">
                      {instructor.designation}
                    </p>
                  )}
                </div>

                {/* Information */}
                <div className="mt-5 space-y-3 text-sm text-gray-500">
                  {instructor.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 shrink-0 text-gray-400" />

                      <span className="truncate">
                        {instructor.email}
                      </span>
                    </div>
                  )}

                  {instructor.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 shrink-0 text-gray-400" />

                      <span>
                        {instructor.phone}
                      </span>
                    </div>
                  )}

                  {instructor.address && (
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 shrink-0 text-gray-400" />

                      <span className="truncate">
                        {instructor.address}
                      </span>
                    </div>
                  )}
                </div>

                {/* Specialization */}
                {instructor.specialization && (
                  <div className="mt-5 rounded-lg bg-blue-50 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-500">
                      Specialization
                    </p>

                    <p className="mt-1 text-sm font-medium text-blue-900">
                      {instructor.specialization}
                    </p>
                  </div>
                )}

                {/* Skills */}
                {instructor.skills.length > 0 && (
                  <div className="mt-5">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Skills
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {instructor.skills
                        .slice(0, 5)
                        .map((skill) => (
                          <span
                            key={skill}
                            className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600"
                          >
                            {skill}
                          </span>
                        ))}

                      {instructor.skills.length > 5 && (
                        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-500">
                          +{instructor.skills.length - 5}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <Link
                    href={`/admin/instructors/${instructor.id}/edit`}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-blue-200 px-4 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Link>

                  {instructor.portfolioUrl ? (
                    <a
                      href={instructor.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Portfolio
                    </a>
                  ) : (
                    <Link
                      href={`/instructors/${instructor.id}`}
                      target="_blank"
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Public Profile
                    </Link>
                  )}
                </div>

                {/* Delete */}
                <button
                  type="button"
                  onClick={() =>
                    handleDelete(instructor.id)
                  }
                  disabled={
                    deletingId === instructor.id
                  }
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {deletingId === instructor.id ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
                      Delete Instructor
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}