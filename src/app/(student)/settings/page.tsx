import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SettingsForm } from "@/components/settings/settings-form";

async function getSettings(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { settings: true },
  });

  const defaultSettings = {
    emailNotifications: {
      assignments: true,
      classes: true,
      payments: true,
      grades: true,
      certificates: true,
    },
    theme: "system",
    language: "en",
  };

  return user?.settings
    ? { ...defaultSettings, ...(user.settings as any) }
    : defaultSettings;
}

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const settings = await getSettings(session.user.id);

  return (
    <div className="space-y-6 p-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">
          Manage your preferences and account settings.
        </p>
      </div>

      <SettingsForm initialSettings={settings} />
    </div>
  );
}