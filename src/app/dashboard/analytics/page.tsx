import DashboardCharts from "@/components/dashboard/DashboardCharts";

export const metadata = { title: "Analytics | Dashboard PenaSakti" };

export default function AnalyticsPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-muted-foreground text-sm">Pantau performa website secara detail</p>
      </div>
      <DashboardCharts />
    </div>
  );
}
