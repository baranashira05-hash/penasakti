"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { Bell, ExternalLink, LogOut, Settings, User } from "lucide-react";
import { useState } from "react";

interface DashboardHeaderProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: string;
  };
}

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  EDITOR: "Editor",
  JOURNALIST: "Jurnalis",
  CONTRIBUTOR: "Kontributor",
  SEO_TEAM: "Tim SEO",
  MODERATOR: "Moderator",
};

export default function DashboardHeader({ user }: DashboardHeaderProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="h-16 border-b border-border bg-background flex items-center justify-between px-6">
      <div>
        <h1 className="font-semibold text-lg">Dashboard</h1>
        <p className="text-xs text-muted-foreground">
          Selamat datang, {user.name?.split(" ")[0]}
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* View Site */}
        <Link
          href="/"
          target="_blank"
          className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          Lihat Website
        </Link>

        {/* Notifications */}
        <button className="relative p-2 rounded-xl hover:bg-muted transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-penasakti-red rounded-full" />
        </button>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted transition-colors"
          >
            {user.image ? (
              <img
                src={user.image}
                alt={user.name || ""}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-penasakti-blue flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {user.name?.[0] || "U"}
                </span>
              </div>
            )}
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold leading-none">{user.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {ROLE_LABELS[user.role] || user.role}
              </p>
            </div>
          </button>

          {showDropdown && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-background border border-border rounded-xl shadow-card-hover overflow-hidden z-50">
              <Link
                href="/profil"
                className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted transition-colors"
                onClick={() => setShowDropdown(false)}
              >
                <User className="w-4 h-4" /> Profil
              </Link>
              <Link
                href="/dashboard/pengaturan"
                className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted transition-colors"
                onClick={() => setShowDropdown(false)}
              >
                <Settings className="w-4 h-4" /> Pengaturan
              </Link>
              <hr className="border-border" />
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center gap-3 px-4 py-3 text-sm text-destructive hover:bg-destructive/10 transition-colors w-full"
              >
                <LogOut className="w-4 h-4" /> Keluar
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
