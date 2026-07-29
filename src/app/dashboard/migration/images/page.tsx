"use client";

import { useState, useEffect } from "react";
import { ImageIcon, Play, RefreshCw, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface Stats {
  totalBroken: number;
  migrated: number;
  valid: number;
}

export default function MigrateImagesPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [running, setRunning] = useState(false);
  const [offset, setOffset] = useState(0);
  const [log, setLog] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/migrate-images");
      const data = await res.json();
      setStats(data);
    } catch {}
  };

  useEffect(() => { fetchStats(); }, []);

  const runBatch = async (currentOffset: number) => {
    try {
      const res = await fetch("/api/admin/migrate-images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret: prompt("Masukkan NEXTAUTH_SECRET untuk otorisasi:"),
          batch: 10,
          offset: currentOffset,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Gagal");
        setRunning(false);
        return;
      }

      const msg = `Batch offset ${currentOffset}: ✅ ${data.success} berhasil, ❌ ${data.failed} gagal | Sisa: ${Math.max(0, data.remaining)}`;
      setLog(prev => [msg, ...prev]);
      await fetchStats();

      if (data.done || data.remaining <= 0) {
        setDone(true);
        setRunning(false);
        toast.success("Migrasi selesai!");
      } else {
        setOffset(data.nextOffset);
        // Lanjut batch berikutnya
        setTimeout(() => runBatch(data.nextOffset), 1000);
      }
    } catch (e: any) {
      toast.error("Error: " + e.message);
      setRunning(false);
    }
  };

  const startMigration = async () => {
    setRunning(true);
    setDone(false);
    setLog([]);
    setOffset(0);
    await runBatch(0);
  };

  const progress = stats ? Math.round(((stats.migrated) / Math.max(1, stats.totalBroken + stats.migrated)) * 100) : 0;

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-purple-600" />
          Migrasi Gambar WordPress → Cloudinary
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Download gambar dari WordPress lama dan upload ke Cloudinary agar tayang di website
        </p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
            <p className="text-2xl font-bold text-red-500">{stats.totalBroken}</p>
            <p className="text-xs text-gray-500">Gambar Broken</p>
          </div>
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
            <p className="text-2xl font-bold text-emerald-500">{stats.migrated}</p>
            <p className="text-xs text-gray-500">Sudah Migrasi</p>
          </div>
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
            <p className="text-2xl font-bold text-blue-500">{stats.valid}</p>
            <p className="text-xs text-gray-500">Gambar Valid</p>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      {stats && stats.totalBroken > 0 && (
        <div>
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Progress migrasi</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-3 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Info */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
        <div className="flex gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-amber-800 dark:text-amber-300 space-y-1">
            <p className="font-semibold">Cara kerja migrasi:</p>
            <ol className="list-decimal pl-4 space-y-0.5">
              <li>Script mencoba download gambar dari URL WordPress lama</li>
              <li>Jika gagal, mencoba dari Wayback Machine (arsip internet)</li>
              <li>Gambar yang berhasil diupload ke Cloudinary dan URL di database diperbarui</li>
              <li>Gambar yang tidak ditemukan tetap menggunakan placeholder</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Action */}
      <div className="flex gap-3">
        <button
          onClick={startMigration}
          disabled={running || (stats?.totalBroken === 0)}
          className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold disabled:opacity-60 transition-colors"
        >
          {running ? (
            <><RefreshCw className="w-4 h-4 animate-spin" /> Migrasi berjalan...</>
          ) : (
            <><Play className="w-4 h-4" /> Mulai Migrasi Gambar</>
          )}
        </button>
        <button
          onClick={fetchStats}
          className="flex items-center gap-2 px-4 py-3 border border-gray-200 dark:border-slate-700 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Log */}
      {log.length > 0 && (
        <div className="bg-gray-900 rounded-xl p-4 space-y-1 max-h-64 overflow-y-auto">
          {log.map((l, i) => (
            <p key={i} className="text-xs text-green-400 font-mono">{l}</p>
          ))}
          {done && <p className="text-xs text-yellow-400 font-mono font-bold mt-2">✅ Migrasi selesai!</p>}
        </div>
      )}

      {stats?.totalBroken === 0 && (
        <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4">
          <CheckCircle className="w-5 h-5" />
          <p className="text-sm font-medium">Semua gambar sudah berhasil dimigrasi!</p>
        </div>
      )}
    </div>
  );
}
