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
  const [secret, setSecret] = useState("");
  const stopRef = useRef(false);
  const logRef = useRef<HTMLDivElement>(null);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/migrate-images");
      const data = await res.json();
      setStats(data);
    } catch {}
  };

  useEffect(() => { fetchStats(); }, []);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = 0;
  }, [log]);

  const runBatch = async (currentOffset: number): Promise<void> => {
    if (stopRef.current) {
      setRunning(false);
      toast.info("Migrasi dihentikan");
      return;
    }

    try {
      const res = await fetch("/api/admin/migrate-images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret, batch: 10, offset: currentOffset }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Gagal");
        setRunning(false);
        return;
      }

      const msg = `[offset ${currentOffset}] ✅ ${data.success} OK  ❌ ${data.failed} gagal  |  Sisa: ${Math.max(0, data.remaining)}`;
      setLog(prev => [msg, ...prev]);
      await fetchStats();

      if (data.done || data.remaining <= 0) {
        setDone(true);
        setRunning(false);
        toast.success("🎉 Migrasi selesai!");
      } else {
        await new Promise(r => setTimeout(r, 1500));
        await runBatch(data.nextOffset);
      }
    } catch (e: any) {
      toast.error("Error: " + e.message);
      setRunning(false);
    }
  };

  const startMigration = async () => {
    if (!secret.trim()) {
      toast.error("Masukkan NEXTAUTH_SECRET terlebih dahulu");
      return;
    }
    stopRef.current = false;
    setRunning(true);
    setDone(false);
    setLog([]);
    await runBatch(0);
  };

  const stopMigration = () => {
    stopRef.current = true;
    toast.info("Menghentikan migrasi setelah batch ini...");
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
            <p className="text-xs text-gray-500 mt-0.5">Sudah Migrasi</p>
          </div>
          <div className="bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <p className="text-2xl font-bold text-blue-500">{stats.valid.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-0.5">Gambar Valid</p>
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

      {/* Secret Input */}
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4 space-y-3">
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-1.5">
            NEXTAUTH_SECRET
          </label>
          <p className="text-xs text-gray-500 mb-2">
            Ambil dari Vercel → Settings → Environment Variables → klik titik tiga di NEXTAUTH_SECRET → Edit → tampilkan value
          </p>
          <input
            type="password"
            value={secret}
            onChange={e => setSecret(e.target.value)}
            placeholder="Paste NEXTAUTH_SECRET di sini..."
            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-sm font-mono focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Info */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
          <div className="flex gap-2">
            <AlertTriangle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-800 dark:text-blue-300">
              Script akan mencoba download gambar dari server WordPress lama, lalu upload ke Cloudinary.
              Gambar yang tidak bisa diakses akan tetap menggunakan placeholder.
              Proses berjalan 10 gambar per batch, otomatis lanjut hingga selesai.
            </p>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        {!running ? (
          <button
            onClick={startMigration}
            disabled={stats?.totalBroken === 0 || !secret.trim()}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold disabled:opacity-50 transition-colors"
          >
            <Play className="w-4 h-4" />
            {stats?.totalBroken === 0 ? "Semua Sudah Migrasi" : "Mulai Migrasi Gambar"}
          </button>
        ) : (
          <button
            onClick={stopMigration}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-colors"
          >
            <Square className="w-4 h-4" />
            Hentikan
          </button>
        )}
        <button
          onClick={fetchStats}
          disabled={running}
          className="flex items-center gap-2 px-4 py-3 border border-gray-200 dark:border-slate-700 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${running ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Log */}
      {log.length > 0 && (
        <div ref={logRef} className="bg-gray-950 rounded-xl p-4 space-y-1 max-h-64 overflow-y-auto font-mono">
          {running && (
            <p className="text-xs text-yellow-400 animate-pulse mb-2">⏳ Sedang berjalan...</p>
          )}
          {log.map((l, i) => (
            <p key={i} className="text-xs text-green-400">{l}</p>
          ))}
          {done && (
            <p className="text-xs text-yellow-300 font-bold mt-2 border-t border-gray-700 pt-2">
              🎉 Migrasi selesai! Refresh halaman untuk lihat hasilnya.
            </p>
          )}
        </div>
      )}

      {stats?.totalBroken === 0 && !running && (
        <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4">
          <CheckCircle className="w-5 h-5" />
          <p className="text-sm font-medium">Semua gambar sudah berhasil dimigrasi ke Cloudinary!</p>
        </div>
      )}
    </div>
  );
}
