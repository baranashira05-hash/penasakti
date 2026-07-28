"use client";

import { useState } from "react";
import { Image as ImageIcon, Upload, FolderOpen, Grid3X3, List, Search, Filter, Trash2, Download, Eye } from "lucide-react";

const DEMO_MEDIA = [
  { id: "1", name: "hero-ekonomi.jpg", url: "https://picsum.photos/seed/m1/400/300", type: "image", size: "245 KB", date: "28 Jul 2026", dimensions: "1200×800" },
  { id: "2", name: "banner-olahraga.jpg", url: "https://picsum.photos/seed/m2/400/300", type: "image", size: "312 KB", date: "28 Jul 2026", dimensions: "1920×1080" },
  { id: "3", name: "thumbnail-politik.jpg", url: "https://picsum.photos/seed/m3/400/300", type: "image", size: "178 KB", date: "27 Jul 2026", dimensions: "800×600" },
  { id: "4", name: "infografis-apbn.png", url: "https://picsum.photos/seed/m4/400/300", type: "image", size: "1.2 MB", date: "27 Jul 2026", dimensions: "1080×1920" },
  { id: "5", name: "foto-presiden.jpg", url: "https://picsum.photos/seed/m5/400/300", type: "image", size: "456 KB", date: "26 Jul 2026", dimensions: "1600×1200" },
  { id: "6", name: "gedung-dpr.jpg", url: "https://picsum.photos/seed/m6/400/300", type: "image", size: "389 KB", date: "26 Jul 2026", dimensions: "1920×1080" },
  { id: "7", name: "stadion-gbk.jpg", url: "https://picsum.photos/seed/m7/400/300", type: "image", size: "567 KB", date: "25 Jul 2026", dimensions: "2400×1600" },
  { id: "8", name: "tech-event.jpg", url: "https://picsum.photos/seed/m8/400/300", type: "image", size: "234 KB", date: "25 Jul 2026", dimensions: "1200×800" },
  { id: "9", name: "bencana-banjir.jpg", url: "https://picsum.photos/seed/m9/400/300", type: "image", size: "678 KB", date: "24 Jul 2026", dimensions: "1600×1067" },
  { id: "10", name: "pasar-modal.jpg", url: "https://picsum.photos/seed/m10/400/300", type: "image", size: "345 KB", date: "24 Jul 2026", dimensions: "1280×720" },
  { id: "11", name: "kampus-ui.jpg", url: "https://picsum.photos/seed/m11/400/300", type: "image", size: "412 KB", date: "23 Jul 2026", dimensions: "1920×1080" },
  { id: "12", name: "wisata-bali.jpg", url: "https://picsum.photos/seed/m12/400/300", type: "image", size: "789 KB", date: "23 Jul 2026", dimensions: "2000×1333" },
];

const FOLDERS = [
  { name: "Artikel", count: 1240 },
  { name: "Thumbnail", count: 890 },
  { name: "Infografis", count: 234 },
  { name: "Video Thumbnail", count: 156 },
  { name: "Banner Iklan", count: 67 },
];

export default function MediaPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-blue-600" /> Media Library
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Kelola semua file media • 12,456 file • 4.8 GB digunakan</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors">
          <Upload className="w-4 h-4" /> Upload File
        </button>
      </div>

      {/* Folders */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-lg text-xs font-medium flex-shrink-0">
          <FolderOpen className="w-3.5 h-3.5" /> Semua File
        </button>
        {FOLDERS.map(f => (
          <button key={f.name} className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300 hover:border-blue-300 dark:hover:border-blue-600 transition-colors flex-shrink-0">
            <FolderOpen className="w-3.5 h-3.5" /> {f.name} <span className="text-gray-400">({f.count})</span>
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="search" placeholder="Cari file..." className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-blue-500" />
        </div>
        <div className="flex border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden">
          <button onClick={() => setView("grid")} className={`p-2 ${view === "grid" ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600" : "text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-800"}`}>
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button onClick={() => setView("list")} className={`p-2 ${view === "list" ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600" : "text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-800"}`}>
            <List className="w-4 h-4" />
          </button>
        </div>
        {selected.length > 0 && (
          <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <Trash2 className="w-3.5 h-3.5" /> Hapus ({selected.length})
          </button>
        )}
      </div>

      {/* Grid View */}
      {view === "grid" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {DEMO_MEDIA.map(file => (
            <div
              key={file.id}
              onClick={() => setSelected(prev => prev.includes(file.id) ? prev.filter(i => i !== file.id) : [...prev, file.id])}
              className={`group relative rounded-xl overflow-hidden border cursor-pointer transition-all ${selected.includes(file.id) ? "border-blue-500 ring-2 ring-blue-500/20" : "border-gray-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600"}`}
            >
              <div className="aspect-square bg-gray-100 dark:bg-slate-800">
                <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <Eye className="w-5 h-5 text-white" />
              </div>
              <div className="p-2">
                <p className="text-[10px] font-medium text-gray-900 dark:text-white truncate">{file.name}</p>
                <p className="text-[9px] text-gray-400">{file.size} • {file.dimensions}</p>
              </div>
              {selected.includes(file.id) && (
                <div className="absolute top-2 left-2 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-[10px]">✓</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {view === "list" && (
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-slate-700 text-xs text-gray-500 dark:text-gray-400">
                <th className="text-left px-4 py-2.5 font-medium">File</th>
                <th className="text-left px-4 py-2.5 font-medium hidden md:table-cell">Ukuran</th>
                <th className="text-left px-4 py-2.5 font-medium hidden md:table-cell">Dimensi</th>
                <th className="text-left px-4 py-2.5 font-medium">Tanggal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-slate-700/50">
              {DEMO_MEDIA.map(file => (
                <tr key={file.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                  <td className="px-4 py-2.5 flex items-center gap-3">
                    <img src={file.url} alt="" className="w-10 h-10 rounded-lg object-cover" />
                    <span className="text-xs font-medium text-gray-900 dark:text-white truncate max-w-32">{file.name}</span>
                  </td>
                  <td className="px-4 py-2.5 text-xs text-gray-500 hidden md:table-cell">{file.size}</td>
                  <td className="px-4 py-2.5 text-xs text-gray-500 hidden md:table-cell">{file.dimensions}</td>
                  <td className="px-4 py-2.5 text-xs text-gray-500">{file.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
