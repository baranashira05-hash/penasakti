"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  PenLine, Send, Image as ImageIcon, Tag, AlertCircle,
  CheckCircle, ArrowLeft, Info, Award
} from "lucide-react";
import { toast } from "sonner";

const CATEGORIES = [
  { id: "nasional", name: "Nasional" },
  { id: "politik", name: "Politik" },
  { id: "ekonomi", name: "Ekonomi" },
  { id: "teknologi", name: "Teknologi" },
  { id: "pendidikan", name: "Pendidikan" },
  { id: "olahraga", name: "Olahraga" },
  { id: "lifestyle", name: "Lifestyle" },
  { id: "opini", name: "Opini" },
  { id: "daerah", name: "Daerah" },
];

export default function TulisBeritaPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    title: "",
    content: "",
    excerpt: "",
    categoryId: "",
    tags: "",
    featuredImage: "",
  });

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-8">
          <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Login Diperlukan</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Anda harus login untuk menulis berita di PenaSakti.</p>
          <Link href="/login?redirect=/tulis-berita" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
            Login Sekarang
          </Link>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-8">
          <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Artikel Terkirim! 🎉</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Artikel Anda sedang direview oleh tim redaksi. Anda akan mendapat notifikasi saat artikel disetujui.</p>
          <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 mb-6 text-left">
            <p className="text-sm text-emerald-800 dark:text-emerald-300 flex items-start gap-2">
              <Award className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>Setiap 1.000 viewers, Anda mendapatkan reward <strong>Rp 50.000</strong>!</span>
            </p>
          </div>
          <div className="flex gap-3 justify-center">
            <button onClick={() => { setSubmitted(false); setForm({ title: "", content: "", excerpt: "", categoryId: "", tags: "", featuredImage: "" }); }} className="px-5 py-2.5 border border-gray-200 dark:border-slate-600 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
              Tulis Lagi
            </button>
            <Link href="/tulis-berita/artikel-saya" className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors">
              Lihat Artikel Saya
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title || !form.content || !form.categoryId) {
      toast.error("Judul, konten, dan kategori wajib diisi");
      return;
    }
    if (form.title.length < 10) {
      toast.error("Judul minimal 10 karakter");
      return;
    }
    if (form.content.length < 100) {
      toast.error("Konten minimal 100 karakter");
      return;
    }

    setLoading(true);
    try {
      const tags = form.tags ? form.tags.split(",").map(t => t.trim()).filter(Boolean) : [];
      const res = await fetch("/api/user-articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, tags }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        toast.error(data.error || "Gagal mengirim artikel");
      }
    } catch {
      toast.error("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const updateForm = (key: string, value: string) => setForm({ ...form, [key]: value });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
            <ArrowLeft className="w-4 h-4" /> Beranda
          </Link>
          <Link href="/tulis-berita/artikel-saya" className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline">
            Artikel Saya →
          </Link>
        </div>

        {/* Info Banner */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-5 mb-6">
          <div className="flex gap-3">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">Tulis & Dapatkan Reward</h3>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <li>• Artikel akan direview oleh tim redaksi sebelum ditayangkan</li>
                <li>• Setiap <strong>1.000 viewers</strong>, Anda mendapat reward <strong>Rp 50.000</strong></li>
                <li>• Reward berlaku kelipatan (2.000 viewers = Rp 100.000, dst)</li>
                <li>• Konten harus original, akurat, dan sesuai kode etik jurnalistik</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 flex items-center gap-3">
            <PenLine className="w-5 h-5 text-white" />
            <h1 className="text-lg font-bold text-white">Tulis Berita</h1>
          </div>

          <div className="p-6 space-y-5">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1.5">Judul Berita *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => updateForm("title", e.target.value)}
                placeholder="Tulis judul berita yang menarik dan informatif..."
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm"
              />
              <p className="text-xs text-gray-400 mt-1">{form.title.length}/100 karakter (min. 10)</p>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1.5">Kategori *</label>
              <select
                value={form.categoryId}
                onChange={(e) => updateForm("categoryId", e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm"
              >
                <option value="">Pilih Kategori</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1.5">Konten Berita *</label>
              <textarea
                value={form.content}
                onChange={(e) => updateForm("content", e.target.value)}
                placeholder="Tulis konten berita Anda di sini. Pastikan informasi akurat, berimbang, dan mencantumkan sumber yang jelas..."
                required
                rows={15}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm resize-y leading-relaxed"
              />
              <p className="text-xs text-gray-400 mt-1">{form.content.length} karakter (min. 100)</p>
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1.5">Ringkasan (Opsional)</label>
              <textarea
                value={form.excerpt}
                onChange={(e) => updateForm("excerpt", e.target.value)}
                placeholder="Ringkasan singkat berita yang akan tampil di halaman utama..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm resize-none"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1.5 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" /> Tags (Opsional)
              </label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => updateForm("tags", e.target.value)}
                placeholder="Pisahkan dengan koma: ekonomi, bisnis, startup"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm"
              />
            </div>

            {/* Featured Image */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1.5 flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5" /> URL Foto Utama (Opsional)
              </label>
              <input
                type="url"
                value={form.featuredImage}
                onChange={(e) => updateForm("featuredImage", e.target.value)}
                placeholder="https://contoh.com/gambar.jpg"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm"
              />
            </div>

            {/* Submit */}
            <div className="pt-3 border-t border-gray-200 dark:border-slate-700">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-semibold transition-colors disabled:opacity-70"
              >
                <Send className="w-4 h-4" />
                {loading ? "Mengirim..." : "Kirim untuk Review"}
              </button>
              <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-3">
                Artikel akan direview 1-2 hari kerja sebelum ditayangkan
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
