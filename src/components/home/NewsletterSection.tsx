"use client";

import { useState } from "react";
import { Mail, Send } from "lucide-react";
import { toast } from "sonner";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        toast.success("Berhasil mendaftar newsletter!");
        setEmail("");
      } else {
        toast.error("Gagal mendaftar. Coba lagi.");
      }
    } catch {
      toast.error("Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-penasakti-blue to-penasakti-blue/80 text-white rounded-2xl p-5">
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
          className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-white/60 text-sm transition-colors"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-penasakti-red hover:bg-red-600 rounded-xl text-sm font-semibold transition-colors disabled:opacity-70"
        >
          <Send className="w-4 h-4" />
          {loading ? "Mendaftar..." : "Daftar Gratis"}
        </button>
      </form>
    </div>
  );
}
