"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, Eye } from "lucide-react";
import { toast } from "sonner";

export default function EditArticlePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    content: "",
    excerpt: "",
    status: "PUBLISHED",
    metaTitle: "",
    metaDesc: "",
    featuredImage: "",
    slug: "",
  });

  useEffect(() => {
    async function loadArticle() {
      try {
        const res = await fetch(`/api/articles/${id}`);
        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            setForm({
              title: json.data.title || "",
              content: json.data.content || "",
              excerpt: json.data.excerpt || "",
              status: json.data.status || "PUBLISHED",
              metaTitle: json.data.metaTitle || "",
              metaDesc: json.data.metaDesc || "",
              featuredImage: json.data.featuredImage || "",
              slug: json.data.slug || "",
            });
          }
        }
      } catch (e) {
        toast.error("Gagal memuat artikel");
      } finally {
        setLoading(false);
      }
    }
    if (id) loadArticle();
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/articles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Artikel berhasil disimpan");
      } else {
        toast.error(data.error || "Gagal menyimpan");
      }
    } catch {
      toast.error("Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-4xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/artikel" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Edit Artikel</h1>
        </div>
        <div className="flex gap-2">
          {form.slug && (
            <Link href={`/artikel/${form.slug}`} target="_blank" className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800">
              <Eye className="w-4 h-4" /> Lihat
            </Link>
          )}
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold disabled:opacity-70">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Simpan
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-5 space-y-4">
        {/* Title */}
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-1.5">Judul</label>
          <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-blue-500" />
        </div>

        {/* Status */}
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-1.5">Status</label>
          <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="px-4 py-2.5 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-blue-500">
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
            <option value="REVIEW">Review</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>

        {/* Excerpt */}
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-1.5">Excerpt</label>
          <textarea value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} rows={3} className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 resize-none" />
        </div>

        {/* Featured Image */}
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-1.5">Featured Image URL</label>
          <input type="url" value={form.featuredImage} onChange={e => setForm({ ...form, featuredImage: e.target.value })} placeholder="https://..." className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-blue-500" />
          {form.featuredImage && <img src={form.featuredImage} alt="" className="mt-2 h-32 rounded-lg object-cover" />}
        </div>

        {/* Content */}
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-1.5">Konten (HTML)</label>
          <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={15} className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-xs font-mono focus:outline-none focus:border-blue-500 resize-y" />
        </div>

        {/* SEO */}
        <div className="pt-4 border-t border-gray-200 dark:border-slate-700">
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-3">SEO</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1">Meta Title</label>
              <input type="text" value={form.metaTitle} onChange={e => setForm({ ...form, metaTitle: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1">Meta Description</label>
              <textarea value={form.metaDesc} onChange={e => setForm({ ...form, metaDesc: e.target.value })} rows={2} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 resize-none" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
