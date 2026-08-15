"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  Save,
} from "lucide-react";

type InstructorForm = {
  name: string;
  designation: string;
  email: string;
  phone: string;
  address: string;
  image: string;
  bio: string;
  education: string;
  experience: string;
  portfolioUrl: string;
};

const emptyForm: InstructorForm = {
  name: "",
  designation: "",
  email: "",
  phone: "",
  address: "",
  image: "",
  bio: "",
  education: "",
  experience: "",
  portfolioUrl: "",
};

export default function EditInstructorPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [form, setForm] =
    useState<InstructorForm>(emptyForm);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadInstructor() {
      try {
        const response = await fetch(
          `/api/admin/instructors/${id}`,
          {
            cache: "no-store",
          }
        );

        const text = await response.text();

        let data: any = {};

        try {
          data = text ? JSON.parse(text) : {};
        } catch {
          throw new Error(
            "Server returned an invalid response."
          );
        }

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to load instructor."
          );
        }

        const instructor = data.instructor;

        setForm({
          name: instructor.name || "",
          designation:
            instructor.designation || "",
          email: instructor.email || "",
          phone: instructor.phone || "",
          address: instructor.address || "",
          image: instructor.image || "",
          bio: instructor.bio || "",
          education:
            instructor.education || "",
          experience:
            instructor.experience || "",
          portfolioUrl:
            instructor.portfolioUrl || "",
        });
      } catch (error) {
        console.error(error);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load instructor."
        );
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadInstructor();
    }
  }, [id]);

  function updateField(
    field: keyof InstructorForm,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
  // new change 
      const response = await fetch(
  `/api/admin/instructors/${id}`,
  {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(form),
  }
);

      const text = await response.text();

      let data: any = {};

      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        throw new Error(
          "Server returned an invalid response."
        );
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update instructor."
        );
      }

      router.push("/admin/instructors");
      router.refresh();
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/instructors"
          className="flex h-10 w-10 items-center justify-center rounded-lg border bg-white hover:bg-gray-50"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>

        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Edit Instructor
          </h1>

          <p className="mt-1 text-gray-500">
            Update instructor information and portfolio.
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold">
            Basic Information
          </h2>

          <div className="grid gap-5 md:grid-cols-2">
            <Input
              label="Full Name"
              value={form.name}
              required
              onChange={(value) =>
                updateField("name", value)
              }
            />

            <Input
              label="Designation"
              value={form.designation}
              onChange={(value) =>
                updateField("designation", value)
              }
            />

            <Input
              label="Email"
              value={form.email}
              type="email"
              onChange={(value) =>
                updateField("email", value)
              }
            />

            <Input
              label="Phone"
              value={form.phone}
              onChange={(value) =>
                updateField("phone", value)
              }
            />

            <Input
              label="Address"
              value={form.address}
              onChange={(value) =>
                updateField("address", value)
              }
            />

            <Input
              label="Profile Image URL"
              value={form.image}
              onChange={(value) =>
                updateField("image", value)
              }
            />
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold">
            Portfolio Website
          </h2>

          <Input
            label="Portfolio Website URL"
            value={form.portfolioUrl}
            placeholder="https://hostalsystem.github.io/AzizRAhi/"
            onChange={(value) =>
              updateField("portfolioUrl", value)
            }
          />

          {form.portfolioUrl && (
            <a
              href={form.portfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-sm font-medium text-blue-600 hover:underline"
            >
              Open current portfolio
            </a>
          )}
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold">
            Professional Information
          </h2>

          <div className="space-y-5">
            <Textarea
              label="Biography"
              value={form.bio}
              onChange={(value) =>
                updateField("bio", value)
              }
            />

            <Textarea
              label="Education"
              value={form.education}
              onChange={(value) =>
                updateField("education", value)
              }
            />

            <Textarea
              label="Professional Experience"
              value={form.experience}
              onChange={(value) =>
                updateField("experience", value)
              }
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Link
            href="/admin/instructors"
            className="rounded-lg border px-5 py-3 font-medium hover:bg-gray-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Save className="h-5 w-5" />
            )}

            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
}

function Textarea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <textarea
        value={value}
        rows={5}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
}