"use client";

import { useState, useEffect, Suspense } from "react";
import { Mail, Send, CheckCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

type Status = "idle" | "loading" | "success";

/**
 * Komponen kecil yang menggunakan useSearchParams.
 * Dibungkus Suspense agar tidak memblokir rendering parent.
 * Bertugas menampilkan toast saat user kembali dari link verifikasi/unsubscribe.
 */
function NewsletterToast() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const param = searchParams.get("newsletter");
    if (!param) return;
    if (param === "verified") {
      toast.success("Email berhasil dikonfirmasi! Selamat bergabung 🎉");
    } else if (param === "already-verified") {
      toast.info("Email Anda sudah dikonfirmasi sebelumnya.");
    } else if (param === "unsubscribed") {
      toast.success("Anda telah berhenti berlangganan.");
    } else if (param === "invalid" || param === "error") {
      toast.error("Tautan tidak valid atau sudah kadaluarsa.");
    }
  }, [searchParams]);

  return null;
}

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status === "loading") return;

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const json = await res.json();

      if (json.success) {
        setStatus("success");
        setEmail("");
        toast.success(json.message || "Berhasil mendaftar! Cek email Anda.");
      } else {
        setStatus("idle");
        toast.error(json.error || "Gagal mendaftar. Coba lagi.");
      }
    } catch {
      setStatus("idle");
      toast.error("Terjadi kesalahan. Coba beberapa saat lagi.");
    }
  };

  if (status === "success") {
    return (
      <div className="bg-gradient-to-br from-penasakti-blue to-penasakti-blue/80 text-white rounded-2xl p-5">
        <Suspense>
          <NewsletterToast />
        </Suspense>
        <div className="flex flex-col items-center text-center gap-3 py-2">
          <CheckCircle className="w-10 h-10 text-green-300" />
          <h3 className="font-bold text-base">Hampir selesai!</h3>
          <p className="text-white/80 text-sm leading-relaxed">
            Email konfirmasi sudah dikirim.
            <br />
            Silakan klik tautan di email untuk mengaktifkan langganan.
          </p>
          <button
            onClick={() => setStatus("idle")}
            className="text-xs text-white/60 hover:text-white underline underline-offset-2 transition-colors mt-1"
          >
            Daftar dengan email lain
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-penasakti-blue to-penasakti-blue/80 text-white rounded-2xl p-5">
      <Suspense>
        <NewsletterToast />
      </Suspense>
      <div className="flex items-center gap-2 mb-3">
        <Mail className="w-5 h-5" />
        <h3 className="font-bold">Newsletter</h3>
      </div>
      <p className="text-white/80 text-sm mb-4">
        Dapatkan ringkasan berita terpenting setiap hari langsung di inbox Anda.
      </p>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@anda.com"
          required
          disabled={status === "loading"}
          className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-white/60 text-sm transition-colors disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-penasakti-red hover:bg-red-600 rounded-xl text-sm font-semibold transition-colors disabled:opacity-70"
        >
          <Send className="w-4 h-4" />
          {status === "loading" ? "Mendaftarkan..." : "Daftar Gratis"}
        </button>
      </form>
    </div>
  );
}
