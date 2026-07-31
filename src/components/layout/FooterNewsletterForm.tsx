"use client";

import { useState } from "react";
import { CheckCircle, Send } from "lucide-react";
import { toast } from "sonner";

type Status = "idle" | "loading" | "success";

export default function FooterNewsletterForm() {
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
      <div className="flex flex-col items-center gap-3 py-4 max-w-md mx-auto">
        <CheckCircle className="w-10 h-10 text-green-400" />
        <p className="text-white/80 text-sm text-center leading-relaxed">
          Email konfirmasi sudah dikirim. Silakan cek inbox Anda dan klik tautan untuk mengaktifkan langganan.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="text-xs text-white/40 hover:text-white underline underline-offset-2 transition-colors"
        >
          Daftar dengan email lain
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Masukkan email Anda"
        required
        disabled={status === "loading"}
        className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all disabled:opacity-60"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors whitespace-nowrap disabled:opacity-70"
      >
        {status === "loading" ? (
          <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
        ) : (
          <Send className="w-4 h-4" />
        )}
        {status === "loading" ? "Mendaftar..." : "Daftar"}
      </button>
    </form>
  );
}
