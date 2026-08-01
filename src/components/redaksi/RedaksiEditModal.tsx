"use client";

import { useState, useRef } from "react";
import { X, Upload, Loader2, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

export type RedaksiGroup =
  | "PIMPINAN"
  | "EDITOR"
  | "REPORTER"
  | "FOTOGRAFER"
  | "DESAIN"
  | "TEKNIK"
  | "KONTRIBUTOR";

export interface RedaksiMember {
  id: string;
  name: string;
  jabatan: string;
  group: RedaksiGroup;
  photo: string | null;
  email: string | null;
  order: number;
  isActive: boolean;
}

interface Props {
  member?: RedaksiMember | null; // null = mode tambah baru
  onClose: () => void;
  onSaved: (member: RedaksiMember) => void;
  onDeleted?: (id: string) => void;
}

const GROUP_OPTIONS: { value: RedaksiGroup; label: string }[] = [
  { value: "PIMPINAN", label: "Pimpinan Redaksi" },
  { value: "EDITOR", label: "Editor & Kontributor" },
  { value: "REPORTER", label: "Reporter" },
  { value: "FOTOGRAFER", label: "Fotografer" },
  { value: "DESAIN", label: "Tim Desain" },
  { value: "TEKNIK", label: "Tim Teknik" },
  { value: "KONTRIBUTOR", label: "Kontributor" },
];

export default function RedaksiEditModal({ member, onClose, onSaved, onDeleted }: Props) {
  const isEdit = !!member;
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: member?.name ?? "",
    jabatan: member?.jabatan ?? "",
    group: member?.group ?? ("EDITOR" as RedaksiGroup),
    email: member?.email ?? "",
    order: member?.order ?? 0,
    isActive: member?.isActive ?? true,
  });
  const [photo, setPhoto] = useState<string | null>(member?.photo ?? null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/redaksi/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload gagal");
      setPhoto(data.url);
      toast.success("Foto berhasil diupload");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload gagal";
      toast.error(msg);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.jabatan.trim()) {
      toast.error("Nama dan jabatan wajib diisi");
      return;
    }

    setSaving(true);
    try {
      const body = { ...form, photo };
      const url = isEdit ? `/api/redaksi/${member!.id}` : "/api/redaksi";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan");

      toast.success(isEdit ? "Anggota berhasil diperbarui" : "Anggota berhasil ditambahkan");
      onSaved(data.member);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menyimpan";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!member) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/redaksi/${member.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menghapus");
      toast.success("Anggota berhasil dihapus");
      onDeleted?.(member.id);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menghapus";
      toast.error(msg);
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-background rounded-2xl shadow-2xl border border-border overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2">
            {isEdit ? (
              <span className="text-lg font-bold">Edit Anggota Redaksi</span>
            ) : (
              <span className="flex items-center gap-2 text-lg font-bold">
                <Plus className="w-5 h-5 text-penasakti-blue" />
                Tambah Anggota
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSave} className="px-6 py-5 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Foto */}
          <div className="flex flex-col items-center gap-3">
            <div
              className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-dashed border-border bg-muted cursor-pointer group hover:border-penasakti-blue/50 transition-colors"
              onClick={() => fileRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && fileRef.current?.click()}
            >
              {uploading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-background/70">
                  <Loader2 className="w-6 h-6 animate-spin text-penasakti-blue" />
                </div>
              ) : photo ? (
                <>
                  <img src={photo} alt="Foto" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Upload className="w-5 h-5 text-white" />
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-muted-foreground group-hover:text-penasakti-blue transition-colors">
                  <Upload className="w-6 h-6" />
                  <span className="text-xs font-medium">Upload</span>
                </div>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <p className="text-xs text-muted-foreground">JPG/PNG/WebP, maks 5MB</p>
          </div>

          {/* Nama */}
          <div>
            <label className="text-sm font-medium block mb-1.5">
              Nama <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Nama lengkap"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-penasakti-blue/20 focus:border-penasakti-blue transition-all text-sm"
            />
          </div>

          {/* Jabatan */}
          <div>
            <label className="text-sm font-medium block mb-1.5">
              Jabatan <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.jabatan}
              onChange={(e) => setForm((f) => ({ ...f, jabatan: e.target.value }))}
              placeholder="Contoh: Pemimpin Redaksi"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-penasakti-blue/20 focus:border-penasakti-blue transition-all text-sm"
            />
          </div>

          {/* Group */}
          <div>
            <label className="text-sm font-medium block mb-1.5">Grup / Divisi</label>
            <select
              value={form.group}
              onChange={(e) => setForm((f) => ({ ...f, group: e.target.value as RedaksiGroup }))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-penasakti-blue/20 focus:border-penasakti-blue transition-all text-sm"
            >
              {GROUP_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium block mb-1.5">Email (opsional)</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="email@penasakti.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-penasakti-blue/20 focus:border-penasakti-blue transition-all text-sm"
            />
          </div>

          {/* Order + isActive */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium block mb-1.5">Urutan</label>
              <input
                type="number"
                min={0}
                value={form.order}
                onChange={(e) => setForm((f) => ({ ...f, order: Number(e.target.value) }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-penasakti-blue/20 focus:border-penasakti-blue transition-all text-sm"
              />
            </div>
            <div className="flex flex-col justify-end pb-0.5">
              <label className="text-sm font-medium block mb-1.5">Status</label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                  className="w-4 h-4 rounded accent-penasakti-blue"
                />
                <span className="text-sm text-muted-foreground">Aktif</span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-border mt-2">
            {isEdit && !confirmDelete && (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 font-medium transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Hapus
              </button>
            )}

            {isEdit && confirmDelete && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-red-500 font-medium">Yakin hapus?</span>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 disabled:opacity-60 transition-colors"
                >
                  {deleting ? <Loader2 className="w-3 h-3 animate-spin" /> : "Ya, hapus"}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="px-3 py-1 border border-border text-sm rounded-lg hover:bg-muted transition-colors"
                >
                  Batal
                </button>
              </div>
            )}

            {!isEdit && <div />}

            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm border border-border rounded-xl hover:bg-muted transition-colors font-medium"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={saving || uploading}
                className="px-5 py-2 bg-penasakti-blue text-white text-sm rounded-xl font-semibold hover:bg-penasakti-blue/90 disabled:opacity-60 transition-colors flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  isEdit ? "Simpan Perubahan" : "Tambah Anggota"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
