"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, PenLine, Megaphone, ShoppingBag, User, X, Grid } from "lucide-react";
import { cn } from "@/lib/utils";

const mainNav = [
  { href: "/", icon: Home, label: "Beranda" },
  { href: "/pencarian", icon: Search, label: "Cari" },
  { href: "/tulis-berita", icon: PenLine, label: "Tulis" },
  { href: "/store", icon: ShoppingBag, label: "Store" },
  { href: "/pasang-iklan", icon: Megaphone, label: "Iklan" },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  // Hide on dashboard
  if (pathname.startsWith("/dashboard")) return null;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-[100] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-gray-200 dark:border-slate-700">
      <div className="flex items-center justify-around px-1 py-1.5 pb-[env(safe-area-inset-bottom,4px)]">
        {mainNav.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "relative flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all min-w-[52px]",
                isActive
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-500 dark:text-gray-400"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive && "scale-110")} />
              <span className={cn("text-[10px]", isActive ? "font-bold" : "font-medium")}>{label}</span>
              {isActive && (
                <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
