"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Megaphone, CheckCircle, AlertCircle, ArrowLeft, Building2 } from "lucide-react";
import { toast } from "sonner";

export default function AdvertiserRegisterPage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    companyName: "",
    companyDesc: "",
    website: "",
    phone: "",
    address: "",
    contactPerson: "",
    npwp: "",
  });

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-8">
          <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Login Diperlukan</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Anda harus login terlebih dahulu untuk mendaftar sebagai advertiser.</p>
          <Link href="/login?redirect=/pasang-iklan/daftar" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors">
            Login Sekarang
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-8">
          <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Pendaftaran Berhasil! 🎉</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Akun advertiser Anda sedang dalam proses verifikasi. Tim kami akan menghubungi Anda dalam 1 hari kerja.</p>
          <Link href="/pasang-iklan" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors">
            Kembali ke Halaman Iklan
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.companyName || !form.phone || !form.contactPerson) {
      toast.error("Nama perusahaan, nomor HP, dan contact person wajib diisi");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/advertiser/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
      } else {
        toast.error(data.error || "Gagal mendaftar");
      }
    } catch {
      toast.error("Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const updateForm = (key: string, value: string) => setForm({ ...form, [key]: value });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Link href="/pasang-iklan" className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-6">
          <ArrowLeft className="w-4 h-4" /> Kembali
        </Link>

        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 overflow-hidden">
          {/* Banner */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-700 p-6 text-white">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Megaphone className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Daftar Sebagai Advertiser</h1>
                <p className="text-indigo-100 text-sm">Mulai beriklan di PenaSakti</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1.5">Nama Perusahaan / Brand *</label>
              <input type="text" value={form.companyName} onChange={(e) => updateForm("companyName", e.target.value)} placeholder="PT. Contoh Indonesia" required className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1.5">Deskripsi Perusahaan</label>
              <textarea value={form.companyDesc} onChange={(e) => updateForm("companyDesc", e.target.value)} placeholder="Jelaskan bisnis Anda secara singkat..." rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm resize-none" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1.5">Contact Person *</label>
                <input type="text" value={form.contactPerson} onChange={(e) => updateForm("contactPerson", e.target.value)} placeholder="Nama PIC" required className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1.5">No. HP / WhatsApp *</label>
                <input type="tel" value={form.phone} onChange={(e) => updateForm("phone", e.target.value)} placeholder="08xxxxxxxxxx" required className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1.5">Website</label>
                <input type="url" value={form.website} onChange={(e) => updateForm("website", e.target.value)} placeholder="https://contoh.com" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1.5">NPWP (Opsional)</label>
                <input type="text" value={form.npwp} onChange={(e) => updateForm("npwp", e.target.value)} placeholder="00.000.000.0-000.000" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1.5">Alamat Perusahaan</label>
              <textarea value={form.address} onChange={(e) => updateForm("address", e.target.value)} placeholder="Alamat lengkap perusahaan" rows={2} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm resize-none" />
            </div>

            <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-semibold transition-colors disabled:opacity-70">
              <Building2 className="w-4 h-4" />
              {loading ? "Mendaftar..." : "Daftar Sebagai Advertiser"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
