"use client";

import { useState, useEffect } from "react";
import { Type, Plus, Trash2, Save, GripVertical, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function RunningTextPage() {
  const [texts, setTexts] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/running-text");
        if (res.ok) {
          const json = await res.json();
          setTexts(json.data || []);
        }
      } catch {} finally { setLoading(false); }
    }
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/running-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texts: texts.filter(t => t.trim()) }),
      });
      if (res.ok) {
        toast.success("Running text berhasil disimpan!");
      } else {
        toast.error("Gagal menyimpan");
      }
    } catch { toast.error("Error"); } finally { setSaving(false); }
  };

  const addText = () => setTexts([...texts, ""]);
  const removeText = (index: number) => setTexts(texts.filter((_, i) => i !== index));
  const updateText = (index: number, value: string) => {
    const newTexts = [...texts];
    newTexts[index] = value;
    setTexts(newTexts);
  };

  return (
    <div className="space-y-5 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Type className="w-6 h-6 text-red-600" /> Running Text (Breaking News)
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Kelola teks berjalan di bagian atas website</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-70">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Simpan
        </button>
      </div>

      {/* Preview */}
      <div className="bg-red-600 text-white py-2 px-4 rounded-xl overflow-hidden">
        <div className="flex items-center gap-3">
          <span className="flex-shrink-0 bg-white text-red-600 text-[10px] font-bold px-2 py-0.5 rounded">BREAKING</span>
          <div className="overflow-hidden flex-1">
            <div className="ticker-animate text-sm">
              {texts.filter(t => t.trim()).map((t, i) => (
                <span key={i} className="mx-6">▸ {t}</span>
              ))}
              {texts.filter(t => t.trim()).length === 0 && <span className="mx-6 text-white/50">Belum ada running text...</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 dark:text-white text-sm">Daftar Teks ({texts.length})</h3>
          <button onClick={addText} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-medium hover:bg-blue-100 dark:hover:bg-blue-900/30">
            <Plus className="w-3.5 h-3.5" /> Tambah
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-400 py-8">Memuat...</p>
        ) : texts.length === 0 ? (
          <div className="text-center py-8">
            <Type className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Belum ada running text. Klik "Tambah" untuk mulai.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {texts.map((text, index) => (
              <div key={index} className="flex items-center gap-2">
                <GripVertical className="w-4 h-4 text-gray-300 flex-shrink-0" />
                <span className="text-xs text-gray-400 w-6 flex-shrink-0">{index + 1}.</span>
                <input
                  type="text"
                  value={text}
                  onChange={(e) => updateText(index, e.target.value)}
                  placeholder="Ketik berita breaking di sini..."
                  className="flex-1 px-3 py-2.5 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-blue-500"
                />
                <button onClick={() => removeText(index)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-600 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <p className="text-[11px] text-gray-400 mt-4">Tips: Gunakan kalimat pendek dan jelas. Teks akan berjalan dari kanan ke kiri di bagian atas website.</p>
      </div>
    </div>
  );
}
