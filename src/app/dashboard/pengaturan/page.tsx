"use client";

import { useState } from "react";
import { Settings, Globe, Mail, Palette, Shield, Database, Bell, Save } from "lucide-react";

export default function PengaturanPage() {
  const [activeTab, setActiveTab] = useState("general");

  const tabs = [
    { id: "general", label: "Umum", icon: Globe },
    { id: "appearance", label: "Tampilan", icon: Palette },
    { id: "email", label: "Email/SMTP", icon: Mail },
    { id: "notification", label: "Notifikasi", icon: Bell },
    { id: "security", label: "Keamanan", icon: Shield },
    { id: "database", label: "Database", icon: Database },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-gray-600 dark:text-gray-400" /> Pengaturan Situs
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Konfigurasi global website PenaSakti</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Tabs */}
        <div className="lg:col-span-1">
          <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab.id ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400" : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800"}`}>
                <tab.icon className="w-4 h-4" /> {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-5 sm:p-6">
          {activeTab === "general" && (
            <div className="space-y-5">
              <h2 className="font-bold text-gray-900 dark:text-white">Pengaturan Umum</h2>
              <div className="grid gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">Nama Situs</label>
                  <input type="text" defaultValue="PenaSakti" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">URL Situs</label>
                  <input type="url" defaultValue="https://penasakti-cnrk.vercel.app" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">Deskripsi Situs</label>
                  <textarea defaultValue="Portal berita nasional terpercaya Indonesia" rows={3} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 resize-none" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">Google Analytics ID</label>
                    <input type="text" placeholder="G-XXXXXXXXXX" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">Google AdSense ID</label>
                    <input type="text" placeholder="ca-pub-XXXXXXXXXX" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-blue-500" />
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Maintenance Mode</p>
                    <p className="text-xs text-gray-500">Aktifkan untuk menonaktifkan situs sementara</p>
                  </div>
                  <button className="w-10 h-5 bg-gray-300 dark:bg-slate-600 rounded-full relative">
                    <span className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow" />
                  </button>
                </div>
              </div>
              <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors">
                <Save className="w-4 h-4" /> Simpan Pengaturan
              </button>
            </div>
          )}

          {activeTab !== "general" && (
            <div className="text-center py-12">
              <Settings className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">Pengaturan {tabs.find(t => t.id === activeTab)?.label} akan tersedia segera.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
