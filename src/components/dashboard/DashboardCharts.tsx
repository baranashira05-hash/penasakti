"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const VISITOR_DATA = [
  { date: "1 Jul", views: 320000, visitors: 85000 },
  { date: "5 Jul", views: 425000, visitors: 112000 },
  { date: "10 Jul", views: 380000, visitors: 98000 },
  { date: "15 Jul", views: 510000, visitors: 135000 },
  { date: "20 Jul", views: 475000, visitors: 125000 },
  { date: "22 Jul", views: 620000, visitors: 162000 },
  { date: "24 Jul", views: 580000, visitors: 152000 },
  { date: "26 Jul", views: 695000, visitors: 178000 },
  { date: "28 Jul", views: 720000, visitors: 185000 },
];

const CATEGORY_DATA = [
  { name: "Nasional", articles: 4521, views: 2850000 },
  { name: "Politik", articles: 2134, views: 1920000 },
  { name: "Ekonomi", articles: 3012, views: 2340000 },
  { name: "Teknologi", articles: 1876, views: 1650000 },
  { name: "Olahraga", articles: 2756, views: 2120000 },
  { name: "Hiburan", articles: 1543, views: 1380000 },
];

const DEVICE_DATA = [
  { name: "Mobile", value: 68, color: "#1a3a6b" },
  { name: "Desktop", value: 24, color: "#27ae60" },
  { name: "Tablet", value: 8, color: "#f39c12" },
];

const TRAFFIC_DATA = [
  { name: "Organik", value: 52, color: "#16a085" },
  { name: "Langsung", value: 23, color: "#2980b9" },
  { name: "Sosial Media", value: 15, color: "#8e44ad" },
  { name: "Referral", value: 10, color: "#d35400" },
];

const cardStyle = { borderRadius: "12px", border: "1px solid var(--border)", background: "var(--card)" };

// Recharts formatter — typed loosely to avoid ValueType|undefined friction
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fmtK = (v: any) => [`${(Number(v ?? 0) / 1000).toFixed(0)}K`];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fmtPct = (v: any) => [`${v ?? 0}%`];

export default function DashboardCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* ── Visitor Trend ── */}
      <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-lg">Tren Pengunjung</h2>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-penasakti-blue inline-block" />
              Views
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
              Pengunjung
            </span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={VISITOR_DATA}>
            <defs>
              <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1a3a6b" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#1a3a6b" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="visitorsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#27ae60" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#27ae60" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis
              tick={{ fontSize: 11 }}
              tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}K`}
            />
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <Tooltip formatter={fmtK as any} contentStyle={cardStyle} />
            <Area type="monotone" dataKey="views" stroke="#1a3a6b" strokeWidth={2} fill="url(#viewsGrad)" />
            <Area type="monotone" dataKey="visitors" stroke="#27ae60" strokeWidth={2} fill="url(#visitorsGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* ── Device + Traffic ── */}
      <div className="space-y-6">
        <div className="bg-card rounded-2xl border border-border p-5">
          <h3 className="font-bold mb-4">Perangkat</h3>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie
                data={DEVICE_DATA}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={65}
                dataKey="value"
                stroke="none"
              >
                {DEVICE_DATA.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <Tooltip formatter={fmtPct as any} contentStyle={{ borderRadius: "12px", border: "1px solid var(--border)" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {DEVICE_DATA.map((d) => (
              <div key={d.name} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                  {d.name}
                </span>
                <span className="font-semibold">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border p-5">
          <h3 className="font-bold mb-4">Sumber Traffic</h3>
          <div className="space-y-2">
            {TRAFFIC_DATA.map((d) => (
              <div key={d.name}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span>{d.name}</span>
                  <span className="font-semibold">{d.value}%</span>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${d.value}%`, background: d.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Category Stats ── */}
      <div className="lg:col-span-3 bg-card rounded-2xl border border-border p-5">
        <h2 className="font-bold text-lg mb-5">Performa per Kategori</h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={CATEGORY_DATA} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis
              tick={{ fontSize: 12 }}
              tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}K`}
            />
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <Tooltip formatter={fmtK as any} contentStyle={cardStyle} />
            <Bar dataKey="views" fill="#1a3a6b" radius={[6, 6, 0, 0]} name="Views" />
            <Bar dataKey="articles" fill="#27ae60" radius={[6, 6, 0, 0]} name="Artikel" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
