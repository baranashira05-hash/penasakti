"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  User, Edit3, Mail, Calendar, Shield, Award, FileText,
  Bookmark, BookOpen, Eye, Heart, LogOut, Camera, Share2,
  Globe, Phone, BadgeCheck
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import { signOut } from "next-auth/react";

const TABS = [
  { id: "profil", label: "Profil", icon: User },
  { id: "aktivitas", label: "Aktivitas", icon: FileText },
  { id: "bookmark", label: "Bookmark", icon: Bookmark },
  { id: "readinglist", label: "Reading List", icon: BookOpen },
];

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState("profil");

  const isLoading = status === "loading";
  const isGuest = !session?.user;

  const demoUser = {
    name: "Pengguna Demo",
    email: "demo@penasakti.com",
    image: null,
    role: "USER",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    phone: "+62 812-xxx-xxxx",
    website: "https://contoh.com",
    twitter: "@contoh",
    instagram: "@contoh.id",
    facebook: "contoh.id",
    bio: "Pembaca setia PenaSakti yang suka dengan berita teknologi dan politik.",
  };

  const user = session?.user || demoUser;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-black font-heading">
                <span className="text-purple-600 dark:text-purple-400">Profil</span> Saya
              </h1>
              <p className="text-muted-foreground text-sm">
                Kelola informasi akun dan preferensi Anda
              </p>
            </div>
          </div>

          {isGuest && !isLoading && (
            <div className="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-sm">
              ⚠️ Anda masuk sebagai tamu (contoh data).
              <Link href="/login" className="ml-2 underline font-semibold hover:text-amber-800">
                Masuk untuk mengakses profil Anda yang sebenarnya
              </Link>
              .
            </div>
          )}
        </div>

        {/* Profile Card */}
        <div className="relative rounded-2xl overflow-hidden bg-card border border-border mb-6">
          {/* Cover */}
          <div className="h-32 md:h-44 bg-gradient-to-r from-purple-500 via-penasakti-blue to-penasakti-red" />

          <div className="px-6 pb-6">
            {/* Avatar & Basic Info */}
            <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-12 md:-mt-14">
              <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden ring-4 ring-background bg-card flex-shrink-0">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || "Profil"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-penasakti-blue text-white text-3xl font-bold">
                    {user.name?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
                <button
                  className="absolute bottom-1 right-1 w-7 h-7 rounded-lg bg-background/90 backdrop-blur border border-border flex items-center justify-center hover:bg-background transition-colors"
                  aria-label="Ubah foto profil"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex-1 min-w-0 pt-2 md:pb-2">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h2 className="text-2xl font-bold">{user.name}</h2>
                  {session?.user && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <BadgeCheck className="w-3.5 h-3.5" />
                      Terverifikasi
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" />
                  {user.email}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button className="inline-flex items-center gap-1.5 px-4 py-2 bg-penasakti-blue text-white text-sm font-semibold rounded-lg hover:bg-penasakti-blue/90 transition-colors">
                  <Edit3 className="w-4 h-4" />
                  Edit Profil
                </button>
                {session?.user && (
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="inline-flex items-center gap-1.5 px-4 py-2 border border-destructive/30 text-destructive text-sm font-semibold rounded-lg hover:bg-destructive/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Keluar
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-muted rounded-xl mb-6 overflow-x-auto scrollbar-none">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === id
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "profil" && (
          <div className="grid md:grid-cols-3 gap-6">
            {/* Info Detail */}
            <div className="md:col-span-2 space-y-4">
              <div className="p-5 rounded-2xl bg-card border border-border">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-purple-500" />
                  Informasi Dasar
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">Nama Lengkap</label>
                    <p className="font-medium">{user.name}</p>
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">Email</label>
                    <p className="font-medium">{user.email}</p>
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <Phone className="w-3 h-3" /> Nomor Telepon
                    </label>
                    <p className="font-medium">{(user as any).phone || "-"}</p>
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Bergabung Sejak
                    </label>
                    <p className="font-medium">
                      {formatDate((user as any).createdAt || new Date())}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-card border border-border">
                <h3 className="font-bold mb-3">Biodata</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {(user as any).bio || "Belum ada bio. Tekan tombol Edit Profil untuk menambahkan."}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-card border border-border">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-500" />
                  Media Sosial & Situs Web
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { icon: Globe, label: "Situs Web", value: (user as any).website, color: "text-blue-500" },
                    { icon: Share2, label: "Twitter/X", value: (user as any).twitter, color: "text-slate-700 dark:text-slate-300" },
                    { icon: Camera, label: "Instagram", value: (user as any).instagram, color: "text-pink-500" },
                    { icon: Globe, label: "Facebook", value: (user as any).facebook, color: "text-blue-700" },
                  ].map(({ icon: Icon, label, value, color }) => (
                    <div key={label} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                      <Icon className={`w-5 h-5 ${color}`} />
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">{label}</p>
                        <p className="text-sm font-medium truncate">{value || "-"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Stats */}
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-card border border-border">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-penasakti-gold" />
                  Status & Peran
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-purple-500/10">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-purple-500" />
                      <span className="text-sm">Peran</span>
                    </div>
                    <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                      {(session?.user as any)?.role || "USER"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10">
                    <div className="flex items-center gap-2">
                      <BadgeCheck className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm">Status</span>
                    </div>
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      {session?.user ? "Aktif" : "Tamu"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-card border border-border">
                <h3 className="font-bold mb-4">Statistik Aktivitas</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-muted/50 text-center">
                    <Eye className="w-5 h-5 mx-auto text-penasakti-blue mb-1" />
                    <p className="text-xl font-bold">312</p>
                    <p className="text-xs text-muted-foreground">Artikel Dibaca</p>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/50 text-center">
                    <Heart className="w-5 h-5 mx-auto text-penasakti-red mb-1" />
                    <p className="text-xl font-bold">48</p>
                    <p className="text-xs text-muted-foreground">Artikel Disukai</p>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/50 text-center">
                    <Bookmark className="w-5 h-5 mx-auto text-purple-500 mb-1" />
                    <p className="text-xl font-bold">16</p>
                    <p className="text-xs text-muted-foreground">Bookmark</p>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/50 text-center">
                    <FileText className="w-5 h-5 mx-auto text-emerald-500 mb-1" />
                    <p className="text-xl font-bold">7</p>
                    <p className="text-xs text-muted-foreground">Komentar</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab !== "profil" && (
          <div className="p-12 rounded-2xl bg-card border border-border text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-bold mb-2">
              Tab {TABS.find((t) => t.id === activeTab)?.label}
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto text-sm">
              Fitur ini akan menampilkan riwayat aktivitas, bookmark, dan reading list Anda secara detail.
              Data akan muncul ketika Anda sudah login dan mulai menggunakan fitur PenaSakti.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
