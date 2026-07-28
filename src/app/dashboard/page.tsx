import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import DashboardStats from "@/components/dashboard/DashboardStats";
import DashboardCharts from "@/components/dashboard/DashboardCharts";
import RecentArticles from "@/components/dashboard/RecentArticles";
import TopArticles from "@/components/dashboard/TopArticles";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold">Overview Dashboard</h1>
        <p className="text-muted-foreground">
          Pantau performa website PenaSakti secara real-time
        </p>
      </div>

      {/* Stats */}
      <DashboardStats />

      {/* Charts */}
      <DashboardCharts />

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentArticles />
        <TopArticles />
      </div>
    </div>
  );
}
