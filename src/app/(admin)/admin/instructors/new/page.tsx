"use client";
import InstructorImageUpload from "@/components/instructors/instructor-image-upload";
import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Loader2,
  Save,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  FileText,
  Image as ImageIcon,
} from "lucide-react";

export default function NewInstructorPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    email: "",
    phone: "",
    address: "",
    image: "",
    bio: "",
    education: "",
    experience: "",
    specialization: "",
    portfolioUrl: "",
    linkedinUrl: "",
    facebookUrl: "",
    instagramUrl: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/instructors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const text = await response.text();

      let data: any = {};

      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        throw new Error(
          "The server returned an invalid response. Please check the API route."
        );
      }

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to create instructor"
        );
      }

      router.push("/admin/instructors");
      router.refresh();
    } catch (error) {
      console.error("Create instructor error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong while creating instructor."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/admin/instructors"
            className="mb-3 inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Instructors
          </Link>

          <h1 className="text-3xl font-bold text-gray-900">
            Add Instructor
          </h1>

          <p className="mt-1 text-gray-500">
            Create a public instructor profile for your academy website.
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
              <User className="h-5 w-5 text-blue-600" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Basic Information
              </h2>

              <p className="text-sm text-gray-500">
                Main information displayed on the instructor profile.
              </p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {/* Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Full Name *
              </label>

              <div className="relative">
                <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter instructor name"
                  className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Designation */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Designation
              </label>

              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  placeholder="e.g. Senior Web Developer"
                  className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Email
              </label>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="instructor@example.com"
                  className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Phone
              </label>

              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+92 300 1234567"
                  className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Address
              </label>

              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />

                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter address"
                  className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Image */}
            <div className="md:col-span-2">
  <label className="mb-3 block text-sm font-medium text-gray-700">
    Profile Image
  </label>

  <InstructorImageUpload
    currentImage={formData.image}
    onUpload={(url) =>
      setFormData((current) => ({
        ...current,
        image: url,
      }))
    }
  />
</div>
          </div>
        </div>

        {/* Professional Information */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
              <Briefcase className="h-5 w-5 text-purple-600" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Professional Information
              </h2>

              <p className="text-sm text-gray-500">
                Information students can see on the public profile.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {/* Bio */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Biography
              </label>

              <div className="relative">
                <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />

                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Write a detailed biography about the instructor..."
                  className="w-full resize-none rounded-lg border border-gray-300 py-3 pl-10 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {/* Education */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Education
                </label>

                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                  <input
                    type="text"
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                    placeholder="e.g. BS Software Engineering"
                    className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* Experience */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Experience
                </label>

                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                  <input
                    type="text"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    placeholder="e.g. 5 years"
                    className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* Specialization */}
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Specialization
                </label>

                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  placeholder="e.g. Web Development, React, Next.js"
                  className="w-full rounded-lg border border-gray-300 py-3 px-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Portfolio and Social Links */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Portfolio and Social Links
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              These links will be visible on the public instructor profile.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {/* Portfolio */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Portfolio Website
              </label>

              <input
                type="url"
                name="portfolioUrl"
                value={formData.portfolioUrl}
                onChange={handleChange}
                placeholder="https://example.com"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* LinkedIn */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                LinkedIn
              </label>

              <input
                type="url"
                name="linkedinUrl"
                value={formData.linkedinUrl}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/..."
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Facebook */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Facebook
              </label>

              <input
                type="url"
                name="facebookUrl"
                value={formData.facebookUrl}
                onChange={handleChange}
                placeholder="https://facebook.com/..."
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Instagram */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Instagram
              </label>

              <input
                type="url"
                name="instagramUrl"
                value={formData.instagramUrl}
                onChange={handleChange}
                placeholder="https://instagram.com/..."
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            href="/admin/instructors"
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                Create Instructor
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}