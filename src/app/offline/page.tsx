import { Metadata } from "next";
import Link from "next/link";
import { WifiOff, RefreshCw, Home, TrendingUp, Clock, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Offline Mode - PenaSakti",
  description: "Anda sedang offline. Beberapa konten mungkin tidak tersedia.",
  robots: { index: false, follow: false },
};

const OFFLINE_ARTICLES = [
  {
    title: "Presiden Umumkan Paket Stimulus Ekonomi Rp 500 Triliun untuk Pemulihan Nasional",
    category: "Nasional",
    color: "#e74c3c",
    time: "1 jam lalu",
  },
  {
    title: "Timnas Indonesia Lolos ke Final Piala AFF 2026, Siap Rebut Gelar Perdana",
    category: "Olahraga",
    color: "#d35400",
    time: "2 jam lalu",
  },
  {
    title: "Startup Indonesia Raih Valuasi Unicorn Ketiga Tahun Ini, Sektor Fintech Mendominasi",
    category: "Teknologi",
    color: "#16a085",
    time: "3 jam lalu",
  },
];

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-10 flex items-center justify-center">
        <div className="max-w-2xl w-full text-center">
          {/* Icon */}
          <div className="w-24 h-24 mx-auto rounded-full bg-muted flex items-center justify-center mb-6">
            <WifiOff className="w-12 h-12 text-muted-foreground" />
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-black font-heading mb-3">
            Anda Sedang <span className="text-penasakti-red">Offline</span>
          </h1>
          <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
            Sepertinya koneksi internet Anda terputus. Silakan cek koneksi dan coba lagi,
            atau lihat konten yang tersimpan di bawah ini.
          </p>

          {/* Actions */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-penasakti-blue text-white font-semibold rounded-lg hover:bg-penasakti-blue/90 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Coba Lagi
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-muted hover:bg-muted/70 font-semibold rounded-lg transition-colors"
            >
              <Home className="w-4 h-4" />
              Ke Beranda
            </Link>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 px-6 py-2.5 border border-border hover:bg-muted/50 font-semibold rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </button>
          </div>

          {/* Saved Content */}
          <div className="text-left bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border">
              <Clock className="w-5 h-5 text-penasakti-gold" />
              <h2 className="font-bold text-lg">Konten Tersimpan (Cache)</h2>
            </div>
            <div className="space-y-3">
              {OFFLINE_ARTICLES.map((article, i) => (
                <div
                  key={i}
                  className="group flex items-start gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors"
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                    style={{ backgroundColor: article.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span
                        className="text-xs font-bold uppercase tracking-wider"
                        style={{ color: article.color }}
                      >
                        {article.category}
                      </span>
                      <span className="text-xs text-muted-foreground">· {article.time}</span>
                    </div>
                    <p className="font-semibold group-hover:text-penasakti-blue transition-colors line-clamp-2 leading-snug">
                      {article.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="mt-8 p-5 rounded-2xl bg-gradient-to-br from-penasakti-blue/5 to-penasakti-red/5 border border-border">
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-500" />
              Tips Membaca Tanpa Internet
            </h3>
            <ul className="text-sm text-muted-foreground space-y-2 text-left max-w-md mx-auto">
              <li className="flex gap-2">
                <span className="text-purple-500">•</span>
                Gunakan fitur "Reading List" untuk menyimpan artikel favorit Anda
              </li>
              <li className="flex gap-2">
                <span className="text-purple-500">•</span>
                Install PWA PenaSakti untuk akses lebih cepat dan hemat kuota
              </li>
              <li className="flex gap-2">
                <span className="text-purple-500">•</span>
                Aktifkan notifikasi untuk mendapatkan update berita penting
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
