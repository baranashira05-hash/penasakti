"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, Mail, Lock, Loader2, Shield } from "lucide-react";
import { toast } from "sonner";

function RedaksiLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/redaksi";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Email atau password salah");
        setLoading(false);
        return;
      }

      // Verifikasi role SUPER_ADMIN setelah login berhasil
      const res = await fetch("/api/auth/session");
      const session = await res.json();

      if (session?.user?.role !== "SUPER_ADMIN") {
        // Bukan SUPER_ADMIN — sign out dan tolak akses
        await fetch("/api/auth/signout", { method: "POST" });
        toast.error("Akses ditolak. Hanya owner yang dapat masuk ke panel ini.");
        setLoading(false);
        return;
      }

      toast.success("Selamat datang, Admin!");
      router.push(redirect);
      router.refresh();
    } catch {
      toast.error("Terjadi kesalahan, coba lagi");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-8">
            <img src="/logo-penasakti.png" alt="PenaSakti" className="h-10 w-auto" />
          </Link>

          {/* Badge admin */}
          <div className="flex items-center gap-2 mb-6 px-4 py-2.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl">
            <Shield className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <p className="text-sm text-amber-700 dark:text-amber-400 font-medium">
              Panel khusus — hanya untuk owner PenaSakti
            </p>
          </div>

          <h1 className="text-2xl font-bold mb-1">Login Admin Redaksi</h1>
          <p className="text-muted-foreground mb-6 text-sm">
            Masuk untuk mengelola tim redaksi PenaSakti
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="text-sm font-medium block mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="owner@penasakti.com"
                  required
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-penasakti-blue/20 focus:border-penasakti-blue transition-all text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium block mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full pl-10 pr-12 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-penasakti-blue/20 focus:border-penasakti-blue transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-penasakti-blue text-white rounded-xl font-semibold hover:bg-penasakti-blue/90 transition-colors disabled:opacity-70 text-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Memverifikasi...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  Masuk ke Panel Admin
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-6">
            Halaman ini hanya untuk owner PenaSakti.{" "}
            <Link href="/" className="text-penasakti-blue hover:underline">
              Kembali ke beranda
            </Link>
          </p>
        </div>
      </div>

      {/* Right — Hero */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-gray-900 to-penasakti-blue/80 items-center justify-center p-12 relative overflow-hidden">
        <div className="relative z-10 text-white text-center">
          <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/20">
            <Shield className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold mb-3">Panel Admin Redaksi</h2>
          <p className="text-white/70 text-base max-w-xs mx-auto">
            Kelola tim redaksi PenaSakti — tambah, edit, dan atur foto serta jabatan anggota.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4 text-sm text-white/60">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <p className="text-white font-semibold text-lg">Edit</p>
              <p>Foto &amp; Nama</p>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <p className="text-white font-semibold text-lg">Atur</p>
              <p>Jabatan</p>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <p className="text-white font-semibold text-lg">Kelola</p>
              <p>Tim Redaksi</p>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-penasakti-blue/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        </div>
      </div>
    </div>
  );
}

export default function RedaksiAdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-penasakti-blue" />
        </div>
      }
    >
      <RedaksiLoginForm />
    </Suspense>
  );
}
