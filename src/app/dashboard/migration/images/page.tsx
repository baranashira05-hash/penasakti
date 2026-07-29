"use client";

import { useState, useEffect, useRef } from "react";
import { ImageIcon, Play, RefreshCw, CheckCircle, AlertTriangle, Square } from "lucide-react";
import { toast } from "sonner";

interface Stats {
  totalBroken: number;
  migrated: number;
  valid: number;
}

export default function MigrateImagesPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [running, setRunning] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const stopRef = useRef(false);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/migrate-images");
      if (res.ok) setStats(await res.json());
    } catch {}
  };

  useEffect(() => { fetchStats(); }, []);

  const runBatch = async (currentOffset: number): Promise<void> => {
    if (stopRef.current) { setRunning(false); toast.info("Dihentikan"); return; }

    try {
      const res = await fetch("/api/admin/migrate-images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ batch: 10, offset: currentOffset }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Gagal");
        setRunning(false);
        return;
      }

      const msg = `[${currentOffset}→${currentOffset + data.processed}] ✅ ${data.migrated} OK  ❌ ${data.failed} gagal  |  Sisa: ${data.remaining}`;
      setLog(prev => [msg, ...prev]);
      await fetchStats();

      if (data.done || data.remaining <= 0) {
        setDone(true);
        setRunning(false);
        toast.success("🎉 Migrasi selesai!");
      } else {
        await new Promise(r => setTimeout(r, 2000));
        await runBatch(data.nextOffset);
      }
    } catch (e: any) {
      toast.error("Error: " + e.message);
      setRunning(false);
    }
  };

  const startMigration = async () => {
    stopRef.current = false;
    setRunning(true);
    setDone(false);
    setLog([]);
    await runBatch(0);
  };

  const progress = stats
    ? Math.round((stats.migrated / Math.max(1, stats.totalBroken + stats.migrated)) * 100)
    : 0;

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-purple-600" />
          Migrasi Gambar WordPress → Cloudinary
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Upload gambar artikel lama ke Cloudinary agar tayang di website
        </p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-800 border border-red-200 dark:border-red-800 rounded-xl p-4">
            <p className="text-2xl font-bold text-red-500">{stats.totalBroken.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-0.5">Gambar Broken</p>
          </div>
          <div className="bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4">
            <p className="text-2xl font-bold text-emerald-500">{stats.migrated.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-0.5">Sudah Migrasi ke Cloudinary</p>
          </div>
          <div className="bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <p className="text-2xl font-bold text-blue-500">{stats.valid.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-0.5">Total Punya Gambar</p>
          </div>
        </div>
      )}

      {/* Progress */}
      {stats && stats.totalBroken > 0 && (
        <div>
          <div className="flex justify-between text-xs text-gray-500 mb-1.5">
            <span>Progress migrasi</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <div className="w-full h-2.5 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
        <div className="flex gap-2">
          <AlertTriangle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-blue-800 dark:text-blue-300 space-y-1">
            <p className="font-semibold">Cara kerja:</p>
            <ol className="list-decimal pl-4 space-y-0.5">
              <li>Setiap gambar WordPress dicoba didownload langsung</li>
              <li>Jika gagal, dicoba dari Wayback Machine (arsip internet)</li>
              <li>Gambar yang berhasil diupload ke Cloudinary & URL di database diperbarui</li>
              <li>Berjalan 10 gambar per batch otomatis hingga selesai</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        {!running ? (
          <button
            onClick={startMigration}
            disabled={stats?.totalBroken === 0}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold disabled:opacity-50 transition-colors"
          >
            <Play className="w-4 h-4" />
            {stats?.totalBroken === 0 ? "Semua Sudah Migrasi ✅" : `Mulai Migrasi ${stats?.totalBroken.toLocaleString()} Gambar`}
          </button>
        ) : (
          <button
            onClick={() => { stopRef.current = true; }}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold"
          >
            <Square className="w-4 h-4" /> Hentikan
          </button>
        )}
        <button onClick={fetchStats} disabled={running}
          className="flex items-center gap-2 px-4 py-3 border border-gray-200 dark:border-slate-700 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
          <RefreshCw className={`w-4 h-4 ${running ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      {/* Log */}
      {log.length > 0 && (
        <div className="bg-gray-950 rounded-xl p-4 max-h-64 overflow-y-auto font-mono space-y-1">
          {running && <p className="text-xs text-yellow-400 animate-pulse mb-1">⏳ Sedang berjalan...</p>}
          {log.map((l, i) => <p key={i} className="text-xs text-green-400">{l}</p>)}
          {done && <p className="text-xs text-yellow-300 font-bold mt-2 pt-2 border-t border-gray-700">🎉 Selesai! Refresh halaman utama untuk lihat hasilnya.</p>}
        </div>
      )}

      {stats?.totalBroken === 0 && (
        <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 rounded-xl p-4">
          <CheckCircle className="w-5 h-5" />
          <p className="text-sm font-medium">Semua gambar sudah berhasil dimigrasi ke Cloudinary!</p>
        </div>
      )}
    </div>
  );
}
