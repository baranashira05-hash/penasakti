"use client";

import { Bell, CheckCircle, MessageSquare, FileText, Users, AlertTriangle, Radio } from "lucide-react";

const NOTIFICATIONS = [
  { id: "1", type: "article", icon: FileText, title: "Artikel baru menunggu review", desc: 'Ahmad Fauzi mengirim artikel "Peluncuran Satelit Nusantara-3"', time: "5 mnt lalu", unread: true },
  { id: "2", type: "comment", icon: MessageSquare, title: "12 komentar baru perlu moderasi", desc: "Ada 3 komentar terdeteksi spam pada artikel trending", time: "15 mnt lalu", unread: true },
  { id: "3", type: "live", icon: Radio, title: "Live streaming dimulai", desc: "Reporter Ahmad Fauzi memulai live dari Bandung Selatan", time: "30 mnt lalu", unread: true },
  { id: "4", type: "user", icon: Users, title: "5 seller baru mendaftar", desc: "Perlu verifikasi: Toko ABC, Toko XYZ, dan 3 lainnya", time: "1 jam lalu", unread: false },
  { id: "5", type: "alert", icon: AlertTriangle, title: "Traffic spike terdeteksi", desc: "Lonjakan 300% pengunjung pada artikel stimulus ekonomi", time: "2 jam lalu", unread: false },
  { id: "6", type: "system", icon: CheckCircle, title: "Backup database berhasil", desc: "Auto-backup harian selesai. Ukuran: 2.4 GB", time: "3 jam lalu", unread: false },
];

export default function NotifikasiPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-amber-600" /> Notifikasi
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">3 notifikasi belum dibaca</p>
        </div>
        <button className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium">Tandai semua dibaca</button>
      </div>

      <div className="space-y-2">
        {NOTIFICATIONS.map(n => (
          <div key={n.id} className={`flex items-start gap-3 p-4 rounded-xl border transition-colors ${n.unread ? "bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30" : "bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700"}`}>
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${n.unread ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" : "bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400"}`}>
              <n.icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{n.title}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{n.desc}</p>
              <p className="text-[10px] text-gray-400 mt-1">{n.time}</p>
            </div>
            {n.unread && <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />}
          </div>
        ))}
      </div>
    </div>
  );
}
