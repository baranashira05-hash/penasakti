import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import authOptions from "@/lib/auth";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

const ALLOWED_ROLES = ["SUPER_ADMIN", "ADMIN", "EDITOR", "JOURNALIST", "SEO_TEAM", "MODERATOR"];

// Demo user for when database is not connected
const DEMO_USER = {
  id: "demo-admin",
  name: "Admin PenaSakti",
  email: "admin@penasakti.com",
  image: null,
  role: "SUPER_ADMIN",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user = DEMO_USER;

  try {
    const session = await getServerSession(authOptions);
    if (session?.user) {
      user = {
        id: session.user.id,
        name: session.user.name || "Admin",
        email: session.user.email || "",
        image: session.user.image || null,
        role: session.user.role,
      };
      if (!ALLOWED_ROLES.includes(session.user.role)) {
        redirect("/");
      }
    }
  } catch {
    // Database not available - use demo user
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-950 overflow-hidden">
      {/* Sidebar */}
      <DashboardSidebar userRole={user.role} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader user={user} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
