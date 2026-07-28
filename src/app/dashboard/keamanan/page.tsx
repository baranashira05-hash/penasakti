"use client";

import { Shield, Activity, AlertTriangle, CheckCircle, Lock, Globe, Clock } from "lucide-react";

const AUDIT_LOG = [
  { id: "1", action: "Login berhasil", user: "admin@penasakti.com", ip: "103.28.xx.xx", time: "5 mnt lalu", status: "success" },
  { id: "2", action: "Artikel dipublish", user: "ahmad.fauzi@penasakti.com", ip: "114.12.xx.xx", time: "12 mnt lalu", status: "success" },
  { id: "3", action: "Login gagal (3x)", user: "unknown@gmail.com", ip: "45.67.xx.xx", time: "30 mnt lalu", status: "warning" },
  { id: "4", action: "Pengaturan diubah", user: "admin@penasakti.com", ip: "103.28.xx.xx", time: "1 jam lalu", status: "success" },
  { id: "5", action: "Brute force terdeteksi", user: "-", ip: "185.23.xx.xx", time: "2 jam lalu", status: "danger" },
  { id: "6", action: "User baru terdaftar", user: "budi.new@gmail.com", ip: "36.78.xx.xx", time: "3 jam lalu", status: "success" },
];

export default function KeamananPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Shield className="w-6 h-6 text-red-600" /> Keamanan
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Audit log, proteksi, dan manajemen keamanan</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Keamanan", value: "Baik", icon: Shield, cls: "text-emerald-600" },
          { label: "Login Gagal (24h)", value: "7", icon: AlertTriangle, cls: "text-amber-600" },
          { label: "IP Diblokir", value: "23", icon: Lock, cls: "text-red-600" },
          { label: "Sesi Aktif", value: "12", icon: Globe, cls: "text-blue-600" },
        ].map(s => (
          <div key={s.label} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
            <s.icon className={`w-5 h-5 mb-2 ${s.cls}`} />
            <p className="text-lg font-bold text-gray-900 dark:text-white">{s.value}</p>
            <p className="text-[11px] text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-5">
        <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4" /> Audit Log
        </h3>
        <div className="space-y-2">
          {AUDIT_LOG.map(log => (
            <div key={log.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 dark:border-slate-700">
              {log.status === "success" && <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />}
              {log.status === "warning" && <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />}
              {log.status === "danger" && <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-900 dark:text-white">{log.action}</p>
                <p className="text-[10px] text-gray-400">{log.user} • IP: {log.ip}</p>
              </div>
              <span className="text-[10px] text-gray-400 flex items-center gap-1 flex-shrink-0"><Clock className="w-3 h-3" />{log.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
