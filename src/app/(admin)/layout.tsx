import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { AdminSidebar } from "@/components/shared/admin-sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/admin/dashboard");
  }

//   if (session.user.role !== "ADMIN") {
//     redirect("/dashboard");
//   }  

  return (
    <div className="min-h-screen bg-gray-100 flex">
  <AdminSidebar />
  <main className="flex-1 overflow-y-auto p-6 md:p-8 lg:ml-64">
    {children}
  </main>
</div>
  );
}