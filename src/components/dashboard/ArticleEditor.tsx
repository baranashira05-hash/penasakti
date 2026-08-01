"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { ResizableImage } from "@/components/dashboard/ResizableImage";
import Placeholder from "@tiptap/extension-placeholder";
import Youtube from "@tiptap/extension-youtube";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { toast } from "sonner";
import {
  Bold, Italic, Strikethrough, Quote, Code, Link2,
  Image as ImageIcon, Table as TableIcon,
  List, ListOrdered, Heading1, Heading2, Heading3,
  Undo, Redo, Eye, Save, Send,
  Sparkles, X, ChevronDown, ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ArticleEditorProps {
  mode: "create" | "edit";
  initialData?: {
    id?: string;
    title?: string;
    excerpt?: string;
    content?: string;
    categoryId?: string;
    tags?: string[];
    featuredImage?: string;
    status?: string;
    metaTitle?: string;
    metaDesc?: string;
    metaKeywords?: string;
  };
}

export default function ArticleEditor({ mode, initialData }: ArticleEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title || "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [category, setCategory] = useState(initialData?.categoryId || "");
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [featuredImage, setFeaturedImage] = useState(initialData?.featuredImage || "");
  const [metaTitle, setMetaTitle] = useState(initialData?.metaTitle || "");
  const [metaDesc, setMetaDesc] = useState(initialData?.metaDesc || "");
  const [metaKeywords, setMetaKeywords] = useState(initialData?.metaKeywords || "");
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"content" | "seo" | "settings">("content");
  const [aiLoading, setAiLoading] = useState<string | null>(null);
  // Mobile: sidebar panel toggle
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        if (res.ok) {
          const data = await res.json();
          setCategories(data.data || []);
        }
      } catch {
        toast.error("Gagal memuat kategori");
      }
    };
    fetchCategories();
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      ResizableImage,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: "Mulai menulis artikel Anda..." }),
      Youtube.configure({ controls: false }),
      Table.configure({ resizable: true }),
      TableRow, TableCell, TableHeader,
    ],
    content: initialData?.content || "",
    editorProps: {
      attributes: { class: "ProseMirror min-h-[400px] focus:outline-none" },
    },
  });

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const tag = tagInput.trim().toLowerCase();
      if (tag && !tags.includes(tag)) setTags([...tags, tag]);
      setTagInput("");
    }
  };

  const handleSave = async (saveStatus = "DRAFT") => {
    if (!title.trim()) { toast.error("Judul artikel harus diisi"); return; }
    if (!category) { toast.error("Pilih kategori artikel"); return; }
    setSaving(true);
    try {
      const content = editor?.getHTML() || "";
      const payload = { title, excerpt, content, categoryId: category, tags, featuredImage, metaTitle, metaDesc, metaKeywords, status: saveStatus };
      const url = mode === "create" ? "/api/articles" : `/api/articles/${initialData?.id}`;
      const method = mode === "create" ? "POST" : "PUT";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error();

      if (saveStatus === "PUBLISHED") {
        toast.success("✅ Artikel berhasil ditayangkan! Google akan mengindeks dalam beberapa menit.", { duration: 6000 });
        router.push("/dashboard/artikel");
      } else {
        toast.success("Tersimpan sebagai draft");
      }
    } catch {
      toast.error("Gagal menyimpan artikel");
    } finally {
      setSaving(false);
    }
  };

  const generateAI = async (type: string) => {
    setAiLoading(type);
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, title, content: editor?.getText().slice(0, 500) }),
      });
      const data = await res.json();
      if (data.result) {
        if (type === "meta-title") setMetaTitle(data.result);
        if (type === "meta-desc") setMetaDesc(data.result);
        if (type === "excerpt") setExcerpt(data.result);
        if (type === "tags") setTags(data.result.split(",").map((t: string) => t.trim()));
        toast.success("AI berhasil membuat konten!");
      }
    } catch {
      toast.error("AI tidak tersedia saat ini");
    } finally {
      setAiLoading(null);
    }
  };

  // ── Toolbar buttons config ──────────────────────────────────────────
  const toolbarButtons = editor ? [
    { icon: Undo, action: () => editor.chain().focus().undo().run(), title: "Undo" },
    { icon: Redo, action: () => editor.chain().focus().redo().run(), title: "Redo" },
    { type: "sep" as const },
    { icon: Heading1, action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), title: "H1", active: editor.isActive("heading", { level: 1 }) },
    { icon: Heading2, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), title: "H2", active: editor.isActive("heading", { level: 2 }) },
    { icon: Heading3, action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), title: "H3", active: editor.isActive("heading", { level: 3 }) },
    { type: "sep" as const },
    { icon: Bold, action: () => editor.chain().focus().toggleBold().run(), title: "Bold", active: editor.isActive("bold") },
    { icon: Italic, action: () => editor.chain().focus().toggleItalic().run(), title: "Italic", active: editor.isActive("italic") },
    { icon: Strikethrough, action: () => editor.chain().focus().toggleStrike().run(), title: "Coret", active: editor.isActive("strike") },
    { icon: Code, action: () => editor.chain().focus().toggleCode().run(), title: "Kode", active: editor.isActive("code") },
    { type: "sep" as const },
    { icon: List, action: () => editor.chain().focus().toggleBulletList().run(), title: "Bullet", active: editor.isActive("bulletList") },
    { icon: ListOrdered, action: () => editor.chain().focus().toggleOrderedList().run(), title: "Nomor", active: editor.isActive("orderedList") },
    { icon: Quote, action: () => editor.chain().focus().toggleBlockquote().run(), title: "Kutipan", active: editor.isActive("blockquote") },
    { type: "sep" as const },
    { icon: Link2, action: () => { const url = prompt("Masukkan URL:"); if (url) editor.chain().focus().setLink({ href: url }).run(); }, title: "Link", active: editor.isActive("link") },
    { icon: ImageIcon, action: () => { const url = prompt("URL gambar:"); if (url) editor.chain().focus().insertContent({ type: "resizableImage", attrs: { src: url, alt: "", width: "100%", align: "center" } }).run(); }, title: "Gambar" },
    { icon: TableIcon, action: () => { const url = prompt("URL YouTube:"); if (url) editor.commands.setYoutubeVideo({ src: url }); }, title: "YouTube" },
    { icon: TableIcon, action: () => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(), title: "Tabel" },
  ] : [];

  // ── Sidebar content (shared between desktop sidebar & mobile drawer) ──
  const SidebarContent = () => (
    <div className="space-y-4">
      {/* Publish Actions */}
      <div className="bg-card rounded-2xl border border-border p-4 space-y-3">
        <h3 className="font-bold text-sm">Terbitkan</h3>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleSave("DRAFT")}
            disabled={saving}
            className="flex items-center justify-center gap-1.5 py-2.5 border border-border rounded-xl text-sm font-medium hover:bg-muted transition-colors disabled:opacity-70"
          >
            <Save className="w-4 h-4" />
            Simpan Draft
          </button>
          <button className="flex items-center justify-center gap-1.5 py-2.5 border border-border rounded-xl text-sm font-medium hover:bg-muted transition-colors">
            <Eye className="w-4 h-4" />
            Preview
          </button>
        </div>
        <button
          onClick={() => handleSave("PUBLISHED")}
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 py-3 bg-penasakti-blue text-white rounded-xl font-semibold hover:bg-penasakti-blue/90 transition-colors disabled:opacity-70 text-sm"
        >
          <Send className="w-4 h-4" />
          {saving ? "Menyimpan..." : "Tayangkan Sekarang"}
        </button>
      </div>

      {/* Category */}
      <div className="bg-card rounded-2xl border border-border p-4">
        <label className="text-sm font-bold block mb-2">
          Kategori <span className="text-red-500">*</span>
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl border border-border bg-background focus:outline-none text-sm"
        >
          <option value="">Pilih Kategori</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Tags */}
      <div className="bg-card rounded-2xl border border-border p-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-bold">Tags</label>
          <button
            onClick={() => generateAI("tags")}
            disabled={aiLoading === "tags"}
            className="text-xs flex items-center gap-1 text-penasakti-blue hover:underline"
          >
            <Sparkles className="w-3 h-3" />
            AI
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5 mb-2 min-h-[24px]">
          {tags.map((tag) => (
            <span key={tag} className="flex items-center gap-1 bg-muted px-2 py-1 rounded-full text-xs">
              #{tag}
              <button onClick={() => setTags(tags.filter((t) => t !== tag))} className="hover:text-destructive">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        <input
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleAddTag}
          placeholder="Ketik tag, tekan Enter..."
          className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none text-sm"
        />
      </div>

      {/* Featured Image */}
      <div className="bg-card rounded-2xl border border-border p-4">
        <label className="text-sm font-bold block mb-2">Foto Utama</label>
        {featuredImage ? (
          <div className="relative">
            <img src={featuredImage} alt="Featured" className="w-full aspect-video object-cover rounded-xl" />
            <button
              onClick={() => setFeaturedImage("")}
              className="absolute top-2 right-2 w-7 h-7 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-black/80"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <label className="w-full aspect-video bg-muted rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 hover:bg-muted/80 transition-colors cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const fd = new FormData();
                fd.append("file", file);
                toast.loading("Mengupload gambar...", { id: "upload" });
                try {
                  const res = await fetch("/api/upload", { method: "POST", body: fd });
                  const data = await res.json();
                  if (data.success) {
                    setFeaturedImage(data.data.url);
                    toast.success("Gambar berhasil diupload!", { id: "upload" });
                  } else {
                    toast.error(data.error || "Upload gagal", { id: "upload" });
                  }
                } catch {
                  toast.error("Upload gagal", { id: "upload" });
                }
              }}
            />
            <ImageIcon className="w-8 h-8 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Klik untuk pilih gambar</span>
            <span className="text-xs text-muted-foreground">JPG, PNG, WebP — Maks 10MB</span>
          </label>
        )}
        <div className="mt-2">
          <input
            type="url"
            placeholder="Atau paste URL gambar..."
            className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-background focus:outline-none focus:ring-1 focus:ring-penasakti-blue/30"
            onBlur={(e) => { if (e.target.value) setFeaturedImage(e.target.value); }}
          />
        </div>
      </div>

      {/* Excerpt */}
      <div className="bg-card rounded-2xl border border-border p-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-bold">Ringkasan</label>
          <button
            onClick={() => generateAI("excerpt")}
            disabled={aiLoading === "excerpt"}
            className="text-xs flex items-center gap-1 text-penasakti-blue hover:underline"
          >
            <Sparkles className="w-3 h-3" />
            {aiLoading === "excerpt" ? "Membuat..." : "AI Generate"}
          </button>
        </div>
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={3}
          placeholder="Ringkasan artikel..."
          className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none text-sm resize-none"
        />
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">

      {/* ── MOBILE: sticky action bar di atas ─────────────────────────── */}
      <div className="lg:hidden sticky top-0 z-20 bg-background border-b border-border px-0 py-2 -mx-4 px-4 shadow-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSave("DRAFT")}
            disabled={saving}
            className="flex items-center gap-1.5 px-3 py-2 border border-border rounded-xl text-xs font-medium hover:bg-muted transition-colors disabled:opacity-70 flex-shrink-0"
          >
            <Save className="w-3.5 h-3.5" />
            Draft
          </button>
          <button
            onClick={() => handleSave("PUBLISHED")}
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-penasakti-blue text-white rounded-xl font-semibold text-xs hover:bg-penasakti-blue/90 transition-colors disabled:opacity-70"
          >
            <Send className="w-3.5 h-3.5" />
            {saving ? "Menyimpan..." : "Tayangkan Sekarang"}
          </button>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex items-center gap-1 px-3 py-2 border border-border rounded-xl text-xs font-medium hover:bg-muted transition-colors flex-shrink-0"
          >
            Pengaturan
            {sidebarOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* ── MOBILE: Collapsible sidebar panel ─────────────────────────── */}
      {sidebarOpen && (
        <div className="lg:hidden space-y-4 pb-2">
          <SidebarContent />
        </div>
      )}

      {/* ── MAIN EDITOR ───────────────────────────────────────────────── */}
      <div className="flex-1 min-w-0 space-y-4">
        {/* Title */}
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Judul artikel yang menarik..."
            className="w-full text-2xl md:text-3xl font-black border-0 border-b-2 border-border pb-3 bg-transparent focus:outline-none focus:border-penasakti-blue placeholder:text-muted-foreground/40 transition-colors"
          />
          <p className="text-xs text-muted-foreground mt-1">{title.length}/100 karakter</p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-border overflow-x-auto">
          {(["content", "seo", "settings"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-2.5 text-sm font-medium capitalize transition-colors border-b-2 -mb-px whitespace-nowrap",
                activeTab === tab
                  ? "border-penasakti-blue text-penasakti-blue"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {tab === "content" ? "Konten" : tab === "seo" ? "SEO" : "Pengaturan"}
            </button>
          ))}
        </div>

        {/* ── Konten Tab ── */}
        {activeTab === "content" && (
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            {/* Toolbar */}
            {editor && (
              <div className="border-b border-border p-2 flex flex-wrap gap-1 bg-muted/30">
                {toolbarButtons.map((btn, i) => {
                  if (btn.type === "sep") return <div key={i} className="w-px h-6 bg-border mx-0.5 self-center" />;
                  const Icon = btn.icon!;
                  return (
                    <button
                      key={i}
                      onClick={btn.action}
                      title={btn.title}
                      className={cn(
                        "p-1.5 rounded-lg transition-colors",
                        btn.active
                          ? "bg-penasakti-blue text-white"
                          : "hover:bg-muted text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                    </button>
                  );
                })}
              </div>
            )}
            <div className="p-4 min-h-[400px]">
              <EditorContent editor={editor} />
            </div>
          </div>
        )}

        {/* ── SEO Tab ── */}
        {activeTab === "seo" && (
          <div className="bg-card rounded-2xl border border-border p-5 space-y-4">
            <h3 className="font-bold">Pengaturan SEO</h3>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium">Meta Title</label>
                <button onClick={() => generateAI("meta-title")} disabled={aiLoading === "meta-title"} className="text-xs flex items-center gap-1 text-penasakti-blue hover:underline">
                  <Sparkles className="w-3 h-3" />
                  {aiLoading === "meta-title" ? "Membuat..." : "AI Generate"}
                </button>
              </div>
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder={title || "Meta title untuk SEO..."}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-penasakti-blue/20 text-sm"
              />
              <p className={cn("text-xs mt-1", metaTitle.length > 60 ? "text-destructive" : "text-muted-foreground")}>{metaTitle.length}/60 karakter</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium">Meta Description</label>
                <button onClick={() => generateAI("meta-desc")} disabled={aiLoading === "meta-desc"} className="text-xs flex items-center gap-1 text-penasakti-blue hover:underline">
                  <Sparkles className="w-3 h-3" />
                  {aiLoading === "meta-desc" ? "Membuat..." : "AI Generate"}
                </button>
              </div>
              <textarea
                value={metaDesc}
                onChange={(e) => setMetaDesc(e.target.value)}
                placeholder="Deskripsi singkat untuk hasil pencarian..."
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-penasakti-blue/20 text-sm resize-none"
              />
              <p className={cn("text-xs mt-1", metaDesc.length > 160 ? "text-destructive" : "text-muted-foreground")}>{metaDesc.length}/160 karakter</p>
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">Meta Keywords</label>
              <input
                type="text"
                value={metaKeywords}
                onChange={(e) => setMetaKeywords(e.target.value)}
                placeholder="kata kunci, dipisah, dengan koma"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-penasakti-blue/20 text-sm"
              />
            </div>

            {(metaTitle || title) && (
              <div className="p-4 bg-muted/30 rounded-xl">
                <p className="text-xs font-medium text-muted-foreground mb-2">Preview Google</p>
                <p className="text-blue-600 text-base font-medium line-clamp-1">{metaTitle || title}</p>
                <p className="text-green-700 text-sm">penasakti.com/artikel/...</p>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{metaDesc || excerpt || "Deskripsi artikel akan muncul di sini..."}</p>
              </div>
            )}

            {/* SEO Checklist */}
            <div className="p-4 bg-muted/20 rounded-xl border border-border">
              <p className="text-xs font-bold mb-3 flex items-center gap-1.5">
                <span>📋</span> SEO Checklist Google News
              </p>
              <ul className="space-y-1.5">
                {[
                  { ok: title.trim().length >= 10 && title.trim().length <= 100, label: `Judul 10–100 karakter (${title.trim().length})` },
                  { ok: (metaTitle || title).length <= 60, label: `Meta title ≤60 karakter (${(metaTitle || title).length})` },
                  { ok: (metaDesc || excerpt).length >= 50 && (metaDesc || excerpt).length <= 160, label: `Meta description 50–160 karakter (${(metaDesc || excerpt).length})` },
                  { ok: !!featuredImage, label: "Foto utama (featured image) tersedia" },
                  { ok: !!category, label: "Kategori dipilih" },
                  { ok: tags.length >= 2, label: `Minimal 2 tag (${tags.length} tag)` },
                  { ok: (editor?.getText().trim().length ?? 0) >= 300, label: `Konten minimal 300 karakter` },
                ].map(({ ok, label }) => (
                  <li key={label} className="flex items-center gap-2 text-xs">
                    <span className={ok ? "text-green-500" : "text-amber-500"}>{ok ? "✅" : "⚠️"}</span>
                    <span className={ok ? "text-foreground" : "text-muted-foreground"}>{label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* ── Settings Tab ── */}
        {activeTab === "settings" && (
          <div className="bg-card rounded-2xl border border-border p-5 space-y-4">
            <h3 className="font-bold">Pengaturan Artikel</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium block mb-1">Jadwalkan</label>
                <input type="datetime-local" className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none text-sm" />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Editor</label>
                <select className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none text-sm">
                  <option>Pilih Editor</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: "Berita Utama (Breaking)", key: "breaking" },
                { label: "Featured", key: "featured" },
                { label: "Pilihan Editor", key: "editorChoice" },
                { label: "Izinkan Komentar", key: "comments", default: true },
              ].map((item) => (
                <label key={item.key} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked={item.default} className="rounded" />
                  <span className="text-sm">{item.label}</span>
                </label>
              ))}
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Sumber Berita</label>
              <input type="text" placeholder="Contoh: Antara, Reuters" className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none text-sm" />
            </div>
          </div>
        )}
      </div>

      {/* ── DESKTOP SIDEBAR ───────────────────────────────────────────── */}
      <div className="hidden lg:block w-72 flex-shrink-0">
        <SidebarContent />
      </div>
    </div>
  );
}
