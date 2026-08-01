"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Bell, Sun, Moon, Menu, X, ChevronDown,
  LogIn, LogOut, User, Settings, Bookmark, ShoppingBag, PenLine, Megaphone
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CATEGORIES } from "@/lib/utils";

const NAV_CATEGORIES = CATEGORIES.slice(0, 9);

export default function Header() {
  const router = useRouter();
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    const h = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  useEffect(() => { if (isSearchOpen && searchRef.current) searchRef.current.focus(); }, [isSearchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/pencarian?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      {/* Breaking News Bar */}
      <div className="bg-red-600 text-white py-2 px-4 overflow-hidden">
        <div className="container mx-auto flex items-center gap-3">
          <span className="flex-shrink-0 bg-white text-red-600 text-[10px] font-extrabold px-2.5 py-1 rounded uppercase tracking-wider">
            Breaking
          </span>
          <div className="overflow-hidden flex-1 relative">
            <div className="ticker-animate">
              <span className="mx-6">▸ Pemerintah Umumkan Kebijakan Baru Ekonomi Digital 2026</span>
              <span className="mx-6">▸ Indonesia Juara SEA Games Cabang Badminton</span>
              <span className="mx-6">▸ Harga BBM Turun Mulai Besok</span>
              <span className="mx-6">▸ KPK Tangkap Tersangka Korupsi Dana Desa</span>
              <span className="mx-6">▸ Pemerintah Umumkan Kebijakan Baru Ekonomi Digital 2026</span>
              <span className="mx-6">▸ Indonesia Juara SEA Games Cabang Badminton</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={cn(
          "sticky top-0 z-[100] w-full transition-all duration-300",
          isScrolled
            ? "bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-lg border-b border-gray-200 dark:border-slate-700"
            : "bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700"
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <div className="bg-white dark:bg-white rounded-lg p-1.5">
                <img src="/logo-penasakti.png" alt="PenaSakti" className="h-8 w-auto" />
              </div>
            </Link>

            {/* Center - Date */}
            <div className="hidden lg:block text-sm text-gray-600 dark:text-gray-300 font-medium">
              {mounted && (
                <span suppressHydrationWarning>
                  {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                </span>
              )}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-1 min-w-0">
              <button onClick={() => setIsSearchOpen(true)} className="p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-gray-700 dark:text-gray-200" aria-label="Cari">
                <Search className="w-5 h-5" />
              </button>

              <Link href="/store" className="hidden sm:block p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-gray-700 dark:text-gray-200" aria-label="Store">
                <ShoppingBag className="w-5 h-5" />
              </Link>

              <Link href="/pasang-iklan" className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors text-sm font-medium" aria-label="Pasang Iklan">
                <Megaphone className="w-4 h-4" />
                <span>Iklan</span>
              </Link>

              <Link href="/tulis-berita" className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors text-sm font-medium" aria-label="Tulis Berita">
                <PenLine className="w-4 h-4" />
                <span>Tulis</span>
              </Link>

              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="hidden sm:block p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-gray-700 dark:text-gray-200"
                aria-label="Toggle tema"
              >
                {mounted && theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {session && (
                <button className="relative hidden sm:block p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-gray-700 dark:text-gray-200">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                </button>
              )}

              {session ? (
                <div className="relative ml-1">
                  <button
                    onClick={() => setActiveDropdown(activeDropdown === "user" ? null : "user")}
                    className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm"
                  >
                    {session.user.name?.[0]?.toUpperCase() || "U"}
                  </button>
                  <AnimatePresence>
                    {activeDropdown === "user" && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-200 dark:border-slate-700 overflow-hidden"
                      >
                        <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-700">
                          <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">{session.user.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{session.user.email}</p>
                        </div>
                        <div className="py-1">
                          <Link href="/profil" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700" onClick={() => setActiveDropdown(null)}>
                            <User className="w-4 h-4" /> Profil
                          </Link>
                          <Link href="/bookmark" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700" onClick={() => setActiveDropdown(null)}>
                            <Bookmark className="w-4 h-4" /> Bookmark
                          </Link>
                          {["SUPER_ADMIN", "ADMIN", "EDITOR", "JOURNALIST"].includes(session.user.role) && (
                            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700" onClick={() => setActiveDropdown(null)}>
                              <Settings className="w-4 h-4" /> Dashboard
                            </Link>
                          )}
                        </div>
                        <div className="border-t border-gray-100 dark:border-slate-700 py-1">
                          <button onClick={() => signOut({ callbackUrl: "/" })} className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 w-full">
                            <LogOut className="w-4 h-4" /> Keluar
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link href="/login" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors ml-2">
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">Masuk</span>
                </Link>
              )}

              <button
                className="lg:hidden p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-gray-700 dark:text-gray-200 ml-1"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Bar */}
        <nav className="hidden lg:block border-t border-gray-100 dark:border-slate-700/50">
          <div className="container mx-auto px-4">
            <ul className="flex items-center gap-1 h-10 overflow-x-auto scrollbar-none">
              {NAV_CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/kategori/${cat.slug}`} className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-md transition-all whitespace-nowrap">
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <div className="relative group">
                  <button className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-md transition-all">
                    Lainnya <ChevronDown className="w-3 h-3" />
                  </button>
                  <div className="absolute left-0 top-full pt-1 hidden group-hover:block z-50">
                    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-xl p-2 w-44">
                      {CATEGORIES.slice(9).map((cat) => (
                        <Link key={cat.slug} href={`/kategori/${cat.slug}`} className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg">
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </nav>
      </header>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-white/98 dark:bg-slate-900/98 backdrop-blur-sm">
            <div className="container mx-auto px-4 pt-24">
              <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  ref={searchRef}
                  type="search"
                  placeholder="Cari berita, topik, penulis..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-14 py-4 text-lg border-2 border-gray-200 dark:border-slate-600 rounded-2xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
                <button type="button" onClick={() => setIsSearchOpen(false)} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-gray-500">
                  <X className="w-5 h-5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-y-0 right-0 z-[150] w-72 bg-white dark:bg-slate-900 shadow-2xl border-l border-gray-200 dark:border-slate-700 overflow-y-auto"
          >
            <div className="p-5">
              <div className="flex items-center justify-between mb-6">
                <span className="font-bold text-lg text-gray-900 dark:text-white">Menu</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg text-gray-700 dark:text-gray-200">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-3 gap-2 mb-6">
                <Link href="/tulis-berita" onClick={() => setIsMobileMenuOpen(false)} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors">
                  <PenLine className="w-5 h-5" />
                  <span className="text-[11px] font-semibold">Tulis</span>
                </Link>
                <Link href="/pasang-iklan" onClick={() => setIsMobileMenuOpen(false)} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
                  <Megaphone className="w-5 h-5" />
                  <span className="text-[11px] font-semibold">Iklan</span>
                </Link>
                <Link href="/store" onClick={() => setIsMobileMenuOpen(false)} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                  <ShoppingBag className="w-5 h-5" />
                  <span className="text-[11px] font-semibold">Store</span>
                </Link>
              </div>

              {/* Categories */}
              <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 px-3">Kategori</p>
              <div className="space-y-0.5">
                {CATEGORIES.map((cat) => (
                  <Link key={cat.slug} href={`/kategori/${cat.slug}`} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 text-sm font-medium text-gray-800 dark:text-gray-200">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isMobileMenuOpen && <div className="fixed inset-0 z-[140] bg-black/40" onClick={() => setIsMobileMenuOpen(false)} />}
    </>
  );
}
