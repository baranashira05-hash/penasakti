"use client";

import { useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Search, Bell, Sun, Moon, User, LogOut, ChevronDown, ExternalLink } from "lucide-react";

interface Props {
  user: { id: string; name: string; email: string; image: string | null; role: string };
}

export default function DashboardHeader({ user }: Props) {
  const { theme, setTheme } = useTheme();
  const [showProfile, setShowProfile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useState(() => { setMounted(true); });

  return (
    <header className="h-16 border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex items-center justify-between px-6 flex-shrink-0">
      {/* Left - Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="search"
            placeholder="Cari artikel, pengguna, pengaturan... (⌘K)"
            className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <Link href="/" target="_blank" className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg transition-colors">
          <ExternalLink className="w-3.5 h-3.5" /> Lihat Situs
        </Link>

        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-400 transition-colors"
        >
          {mounted && theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-400 transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Profile */}
        <div className="relative ml-2">
          <button onClick={() => setShowProfile(!showProfile)} className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">{user.name?.[0] || "A"}</span>
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold text-gray-900 dark:text-white leading-none">{user.name}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">{user.role.replace("_", " ")}</p>
            </div>
            <ChevronDown className="w-3 h-3 text-gray-400 hidden md:block" />
          </button>

          {showProfile && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-lg overflow-hidden z-50">
              <div className="px-3 py-2 border-b border-gray-100 dark:border-slate-700">
                <p className="text-xs font-medium text-gray-900 dark:text-white">{user.email}</p>
              </div>
              <Link href="/profil" className="flex items-center gap-2 px-3 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700">
                <User className="w-3.5 h-3.5" /> Profil
              </Link>
              <button className="flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 w-full">
                <LogOut className="w-3.5 h-3.5" /> Keluar
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
