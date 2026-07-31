"use client";

import { useState, useEffect } from "react";
import { Megaphone, Plus, Trash2, Eye, Copy, X, CheckCircle, Edit } from "lucide-react";
import { toast } from "sonner";

interface Ad {
  id: string;
  name: string;
  code: string;
  position: string;
  status: string;
  impressions: number;
  clicks: number;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
}

const POSITIONS = [
  { value: "HEADER", label: "Header (728×90)" },
  { value: "SIDEBAR", label: "Sidebar / Bawah Trending (300×250)" },
  { value: "IN_ARTICLE", label: "Dalam Artikel (468×60)" },
  { value: "FOOTER", label: "Footer (970×90)" },
  { value: "STICKY_BOTTOM", label: "Sticky Bottom (320×50)" },
  { value: "POPUP", label: "Popup" },
];

const AD_TEMPLATES = {
  manual: {
    label: "Manual / Sponsor",
    desc: "Upload gambar atau video banner iklan",
    template: "",
  },
  adsterra: {
    label: "Adsterra",
    desc: "Jaringan iklan Adsterra (native, banner, popunder)",
    template: `<!-- Adsterra -->
<script type="text/javascript">
  atOptions = {
    'key' : 'YOUR_ADSTERRA_KEY',
    'format' : 'iframe',
    'height' : 90,
    'width' : 728,
    'params' : {}
  };
</script>
<script type="text/javascript" src="//www.highperformanceformat.com/YOUR_ADSTERRA_KEY/invoke.js"></script>`,
  },
  google: {
    label: "Google Ads / AdSense",
    desc: "Google AdSense responsive atau display ads",
    template: `<!-- Google AdSense -->
<ins class="adsbygoogle"
  style="display:block"
  data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
  data-ad-slot="XXXXXXXXXX"
  data-ad-format="auto"
  data-full-width-responsive="true"></ins>
<script>(adsbygoogle = window.adsbygoogle || []).push({});</script>`,
  },
};

export default function IklanPage() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editAd, setEditAd] = useState<Ad | null>(null);
  const [adType, setAdType] = useState<"manual" | "adsterra" | "google">("manual");
  const [form, setForm] = useState({ name: "", code: "", linkUrl: "", position: "HEADER", status: "ACTIVE", startDate: "", endDate: "" });

  const fetchAds = async () => {
    try {
      const res = await fetch("/api/ads");
      const json = await res.json();
      setAds(json.data || []);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchAds(); }, []);

  const handleCreate = async () => {
    if (!form.name) { toast.error("Nama iklan wajib diisi"); return; }
    
    // For manual ads, generate HTML from image/video URL + link
    let finalCode = form.code;
    if (adType === "manual" && form.code && !form.code.startsWith("<")) {
      const isVideo = form.code.match(/\.(mp4|webm|ogg)$/i);
      if (isVideo) {
        finalCode = `<a href="${form.linkUrl || '#'}" target="_blank" rel="sponsored nofollow"><video src="${form.code}" autoplay muted loop playsinline style="width:100%;max-width:728px;height:auto;border-radius:8px;"></video></a>`;
      } else {
        finalCode = `<a href="${form.linkUrl || '#'}" target="_blank" rel="sponsored nofollow"><img src="${form.code}" alt="${form.name}" style="width:100%;max-width:728px;height:auto;border-radius:8px;" /></a>`;
      }
    }

    try {
      const method = editAd ? "PUT" : "POST";
      const payload = editAd ? { ...form, code: finalCode, id: editAd.id } : { ...form, code: finalCode };
      const res = await fetch("/api/ads", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(editAd ? "Iklan berhasil diupdate" : "Iklan berhasil dibuat");
        setShowCreate(false);
        setEditAd(null);
        setForm({ name: "", code: "", linkUrl: "", position: "HEADER", status: "ACTIVE", startDate: "", endDate: "" });
        fetchAds();
      } else {
        toast.error(json.error);
      }
    } catch { toast.error("Gagal menyimpan iklan"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus iklan ini?")) return;
    try {
      await fetch("/api/ads", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
      toast.success("Iklan dihapus");
      fetchAds();
    } catch {}
  };

  const applyTemplate = (type: "manual" | "adsterra" | "google") => {
    setAdType(type);
    setForm({ ...form, code: AD_TEMPLATES[type].template });
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-purple-600" /> Manajemen Iklan
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Kelola iklan manual, Adsterra, dan Google Ads</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg transition-colors">
          <Plus className="w-4 h-4" /> Buat Iklan Baru
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{ads.length}</p>
          <p className="text-[11px] text-gray-500">Total Iklan</p>
        </div>
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
          <p className="text-2xl font-bold text-emerald-600">{ads.filter(a => a.status === "ACTIVE").length}</p>
          <p className="text-[11px] text-gray-500">Aktif</p>
        </div>
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{ads.reduce((s, a) => s + a.impressions, 0).toLocaleString()}</p>
          <p className="text-[11px] text-gray-500">Total Impressi</p>
        </div>
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{ads.reduce((s, a) => s + a.clicks, 0).toLocaleString()}</p>
          <p className="text-[11px] text-gray-500">Total Klik</p>
        </div>
      </div>

      {/* Ads List */}
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden">
        {loading ? (
          <p className="p-8 text-center text-gray-400">Memuat...</p>
        ) : ads.length === 0 ? (
          <div className="p-8 text-center">
            <Megaphone className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 mb-4">Belum ada iklan. Buat iklan pertama Anda.</p>
            <button onClick={() => setShowCreate(true)} className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700">
              + Buat Iklan
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-xs text-gray-500">
                  <th className="text-left px-4 py-3 font-medium">Nama</th>
                  <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Posisi</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                  <th className="text-right px-4 py-3 font-medium hidden sm:table-cell">Impressi</th>
                  <th className="text-right px-4 py-3 font-medium hidden sm:table-cell">Klik</th>
                  <th className="text-right px-4 py-3 font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-slate-700/50">
                {ads.map(ad => (
                  <tr key={ad.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900 dark:text-white text-xs">{ad.name}</p>
                      <p className="text-[10px] text-gray-400">{new Date(ad.createdAt).toLocaleDateString("id-ID")}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-400 hidden md:table-cell">{ad.position}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${ad.status === "ACTIVE" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"}`}>
                        {ad.status === "ACTIVE" ? "Aktif" : ad.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-xs text-gray-600 hidden sm:table-cell">{ad.impressions.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-xs text-gray-600 hidden sm:table-cell">{ad.clicks.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setEditAd(ad);
                            setShowCreate(true);
                            setAdType("manual");
                            setForm({ name: ad.name, code: ad.code || "", linkUrl: "", position: ad.position, status: ad.status, startDate: "", endDate: "" });
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 transition-colors"
                          title="Edit Iklan"
                        >
                          <Edit className="w-3 h-3" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(ad.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 transition-colors"
                          title="Hapus Iklan"
                        >
                          <Trash2 className="w-3 h-3" />
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/50" onClick={() => setShowCreate(false)}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-slate-700">
              <h2 className="font-bold text-gray-900 dark:text-white">{editAd ? "Edit Iklan" : "Buat Iklan Baru"}</h2>
              <button onClick={() => { setShowCreate(false); setEditAd(null); }} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Ad Type Selection */}
              <div>
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-2">Jenis Iklan</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {(Object.entries(AD_TEMPLATES) as [keyof typeof AD_TEMPLATES, typeof AD_TEMPLATES[keyof typeof AD_TEMPLATES]][]).map(([key, val]) => (
                    <button
                      key={key}
                      onClick={() => applyTemplate(key as "manual" | "adsterra" | "google")}
                      className={`p-3 rounded-xl border text-left transition-colors ${adType === key ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20" : "border-gray-200 dark:border-slate-700 hover:border-purple-300"}`}
                    >
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{val.label}</p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">{val.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Form */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">Nama Iklan *</label>
                  <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Banner Sponsor ABC" className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-purple-500" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">Posisi</label>
                  <select value={form.position} onChange={e => setForm({ ...form, position: e.target.value })} className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-purple-500">
                    {POSITIONS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                  </select>
                </div>
              </div>

              {/* Media Upload or Code */}
              {adType === "manual" ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">URL Gambar / Video Iklan</label>
                    <p className="text-[10px] text-gray-400 mb-2">Upload gambar ke <a href="https://postimages.org" target="_blank" rel="noopener" className="text-blue-500 underline">PostImages.org</a> atau <a href="https://imgur.com/upload" target="_blank" rel="noopener" className="text-blue-500 underline">Imgur.com</a> lalu paste link di bawah</p>
                    <input
                      type="url"
                      value={form.code}
                      onChange={e => setForm({ ...form, code: e.target.value })}
                      placeholder="https://i.postimg.cc/xxxxx/banner.jpg"
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-purple-500"
                    />
                    {/* Preview */}
                    {form.code && (
                      <div className="mt-3 relative rounded-lg overflow-hidden border border-gray-200 dark:border-slate-600">
                        {form.code.match(/\.(mp4|webm|ogg)/i) ? (
                          <video src={form.code} className="w-full max-h-48 object-contain bg-black" controls />
                        ) : (
                          <img src={form.code} alt="Preview" className="w-full max-h-48 object-contain bg-gray-50 dark:bg-slate-900" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                        )}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">Link Tujuan (URL saat iklan diklik)</label>
                    <input
                      type="url"
                      value={form.linkUrl}
                      onChange={e => setForm({ ...form, linkUrl: e.target.value })}
                      placeholder="https://example.com/landing-page"
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">Kode Iklan (HTML/Script)</label>
                  <textarea
                    value={form.code}
                    onChange={e => setForm({ ...form, code: e.target.value })}
                    rows={6}
                    placeholder="Paste kode iklan Adsterra atau Google AdSense di sini..."
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-xs font-mono focus:outline-none focus:border-purple-500 resize-y"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">Mulai (opsional)</label>
                  <input type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-purple-500" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">Berakhir (opsional)</label>
                  <input type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-purple-500" />
                </div>
              </div>

              {/* Info */}
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                <p className="text-xs text-amber-800 dark:text-amber-300">
                  <strong>Penting:</strong> Untuk iklan gambar, gunakan URL dari hosting gambar (Imgur, Postimages, Cloudinary). Jangan upload file langsung karena batas server. Contoh: <code className="bg-amber-100 dark:bg-amber-800 px-1 rounded">https://i.imgur.com/xxxxx.jpg</code>
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setShowCreate(false)} className="px-4 py-2.5 border border-gray-200 dark:border-slate-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700">
                  Batal
                </button>
                <button onClick={handleCreate} className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-semibold">
                  <CheckCircle className="w-4 h-4 inline mr-1" /> Simpan Iklan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
