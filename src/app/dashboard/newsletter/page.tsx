"use client";

import { useState, useEffect, useCallback } from "react";
import { Mail, Users, CheckCircle, Clock, Trash2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface Subscriber {
  id: string;
  email: string;
  name: string | null;
  isVerified: boolean;
  createdAt: string;
}

interface Meta {
  total: number;
  totalVerified: number;
  totalUnverified: number;
  page: number;
  totalPages: number;
}

export default function NewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "verified" | "unverified">("all");
  const [page, setPage] = useState(1);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchSubscribers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "50" });
      if (filter === "verified") params.set("verified", "true");
      if (filter === "unverified") params.set("verified", "false");

      const res = await fetch(`/api/newsletter?${params}`);
      const json = await res.json();

      if (json.success) {
        setSubscribers(json.data);
        setMeta(json.meta);
      } else {
        toast.error(json.error || "Gagal memuat data");
      }
    } catch {
      toast.error("Terjadi kesalahan saat memuat data");
    } finally {
      setLoading(false);
    }
  }, [filter, page]);

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  const handleDelete = async (id: string, email: string) => {
    if (!confirm(`Hapus subscriber ${email}?`)) return;
    setDeleting(id);
    try {
      const res = await fetch("/api/newsletter", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Subscriber dihapus");
        fetchSubscribers();
      } else {
        toast.error(json.error || "Gagal menghapus");
      }
    } catch {
      toast.error("Terjadi kesalahan");
    } finally {
      setDeleting(null);
    }
  };

  const stats = [
    { label: "Total Subscriber", value: meta?.total ?? "—", icon: Users, color: "text-indigo-600" },
    { label: "Terverifikasi", value: meta?.totalVerified ?? "—", icon: CheckCircle, color: "text-green-600" },
    { label: "Menunggu Verifikasi", value: meta?.totalUnverified ?? "—", icon: Clock, color: "text-amber-500" },
    { label: "Halaman", value: meta ? `${meta.page}/${meta.totalPages}` : "—", icon: Mail, color: "text-blue-600" },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Mail className="w-6 h-6 text-indigo-600" /> Newsletter
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Kelola subscriber newsletter PenaSakti</p>
        </div>
        <button
          onClick={fetchSubscribers}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-60"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
            <s.icon className={`w-5 h-5 mb-2 ${s.color}`} />
            <p className="text-lg font-bold text-gray-900 dark:text-white">{s.value.toLocaleString()}</p>
            <p className="text-[11px] text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {(["all", "verified", "unverified"] as const).map((f) => (
          <button
            key={f}
            onClick={() => { setFilter(f); setPage(1); }}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === f
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600"
            }`}
          >
            {f === "all" ? "Semua" : f === "verified" ? "Terverifikasi" : "Belum Verifikasi"}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden">
        {loading ? (
          <div className="py-16 flex items-center justify-center">
            <RefreshCw className="w-6 h-6 animate-spin text-indigo-500" />
          </div>
        ) : subscribers.length === 0 ? (
          <div className="py-16 text-center text-gray-400 dark:text-gray-500 text-sm">
            Belum ada subscriber
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-slate-700">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400">Email</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400">Nama</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400">Terdaftar</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                {subscribers.map((sub) => (
                  <tr key={sub.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{sub.email}</td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{sub.name || "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        sub.isVerified
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                      }`}>
                        {sub.isVerified ? (
                          <><CheckCircle className="w-3 h-3" /> Terverifikasi</>
                        ) : (
                          <><Clock className="w-3 h-3" /> Menunggu</>
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-xs">
                      {new Date(sub.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDelete(sub.id, sub.email)}
                        disabled={deleting === sub.id}
                        className="p-1.5 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                        title="Hapus subscriber"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {meta.total} subscriber, halaman {meta.page} dari {meta.totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-4 py-2 text-sm bg-gray-100 dark:bg-slate-700 rounded-lg disabled:opacity-40 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
            >
              ← Sebelumnya
            </button>
            <button
              onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
              disabled={page >= meta.totalPages}
              className="px-4 py-2 text-sm bg-gray-100 dark:bg-slate-700 rounded-lg disabled:opacity-40 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
            >
              Selanjutnya →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
