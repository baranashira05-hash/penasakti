"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Search, Bell, Sun, Moon, User, LogOut, ChevronDown, ExternalLink,
  Menu, X, LayoutDashboard, FileText, Image, Users, MessageSquare,
  BarChart2, Settings, Radio, ShoppingBag, Megaphone, Mail, Shield, Wallet, ClipboardList
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  user: { id: string; name: string; email: string; image: string | null; role: string };
}

const mobileNav = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Artikel", href: "/dashboard/artikel", icon: FileText },
  { label: "Live Video", href: "/dashboard/live", icon: Radio },
  { label: "Media", href: "/dashboard/media", icon: Image },
  { label: "Komentar", href: "/dashboard/komentar", icon: MessageSquare },
  { label: "Pengguna", href: "/dashboard/pengguna", icon: Users },
  { label: "Iklan", href: "/dashboard/iklan", icon: Megaphone },
  { label: "Store", href: "/dashboard/store", icon: ShoppingBag },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart2 },
  { label: "Newsletter", href: "/dashboard/newsletter", icon: Mail },
  { label: "Keuangan", href: "/dashboard/keuangan", icon: Wallet },
  { label: "Task", href: "/dashboard/task", icon: ClipboardList },
  { label: "Keamanan", href: "/dashboard/keamanan", icon: Shield },
  { label: "Pengaturan", href: "/dashboard/pengaturan", icon: Settings },
];

export default function DashboardHeader({ user }: Props) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [showProfile, setShowProfile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  return (
    <>
      <header className="h-14 md:h-16 border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex items-center justify-between px-4 md:px-6 flex-shrink-0">
        {/* Left */}
        <div className="flex items-center gap-3">
          {/* Mobile menu button */}
          <button onClick={() => setShowMobileMenu(true)} className="md:hidden p-2 -ml-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300">
            <Menu className="w-5 h-5" />
          </button>

          {/* Search - hidden on small mobile */}
          <div className="hidden sm:block flex-1 max-w-sm">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="search"
                placeholder="Cari... (⌘K)"
                className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-1.5">
          <Link href="/" target="_blank" className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg transition-colors">
            <ExternalLink className="w-3.5 h-3.5" /> Situs
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
          <div className="relative ml-1">
            <button onClick={() => setShowProfile(!showProfile)} className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
                <span className="text-white text-xs font-bold">{user.name?.[0] || "A"}</span>
              </div>
              <span className="hidden md:block text-xs font-semibold text-gray-900 dark:text-white">{user.name}</span>
            </button>

            {showProfile && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-lg overflow-hidden z-50">
                <div className="px-3 py-2 border-b border-gray-100 dark:border-slate-700">
                  <p className="text-xs font-medium text-gray-900 dark:text-white truncate">{user.name}</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">{user.role.replace("_", " ")}</p>
                </div>
                <Link href="/profil" onClick={() => setShowProfile(false)} className="flex items-center gap-2 px-3 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700">
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

      {/* Mobile Sidebar Overlay */}
      {showMobileMenu && (
        <>
          <div className="fixed inset-0 z-[200] bg-black/50 md:hidden" onClick={() => setShowMobileMenu(false)} />
          <div className="fixed inset-y-0 left-0 z-[201] w-64 bg-white dark:bg-slate-900 shadow-2xl border-r border-gray-200 dark:border-slate-700 overflow-y-auto md:hidden">
            <div className="p-4 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs">P</span>
                </div>
                <span className="font-bold text-sm text-gray-900 dark:text-white">PenaSakti CMS</span>
              </div>
              <button onClick={() => setShowMobileMenu(false)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="p-3 space-y-0.5">
              {mobileNav.map(item => {
                const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setShowMobileMenu(false)}
                    className={cn(
                      "flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </>
      )}
    </>
  );
}
