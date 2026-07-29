import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import authOptions from "@/lib/auth";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

const ALLOWED_ROLES = ["SUPER_ADMIN", "ADMIN", "EDITOR", "JOURNALIST", "SEO_TEAM", "MODERATOR"];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  
  // Redirect to login if not authenticated
  if (!session?.user) {
    redirect("/login");
  }

  // Check if user has allowed role
  if (!ALLOWED_ROLES.includes(session.user.role)) {
    redirect("/");
  }

  const user = {
    id: session.user.id,
    name: session.user.name || "Admin",
    email: session.user.email || "",
    image: session.user.image || null,
    role: session.user.role,
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-950 overflow-hidden">
      {/* Sidebar - hidden on mobile */}
      <div className="hidden md:block">
        <DashboardSidebar userRole={user.role} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <DashboardHeader user={user} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
