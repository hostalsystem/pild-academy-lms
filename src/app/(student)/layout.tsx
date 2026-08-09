import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { StudentSidebar } from "@/components/shared/student-sidebar";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <StudentSidebar />
      <main className="flex-1 overflow-y-auto p-6 md:p-8 lg:ml-64">
        {children}
      </main>
    </div>
  );
}