"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, Globe, Camera, Share2, PlayCircle } from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    category: "pertanyaan",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success("Pesan Anda telah terkirim! Kami akan segera merespons.", {
      description: `Terima kasih, ${formData.name}`,
    });

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
      category: "pertanyaan",
    });
    setIsSubmitting(false);
  };

  const contactInfo = [
    {
      icon: Mail,
      label: "Email Redaksi",
      value: "redaksi@penasakti.com",
      href: "mailto:redaksi@penasakti.com",
      color: "text-penasakti-blue",
    },
    {
      icon: Mail,
      label: "Email Kemitraan",
      value: "kerjasama@penasakti.com",
      href: "mailto:kerjasama@penasakti.com",
      color: "text-green-600",
    },
    {
      icon: Mail,
      label: "Pengaduan & Verifikasi",
      value: "koreksi@penasakti.com",
      href: "mailto:koreksi@penasakti.com",
      color: "text-penasakti-red",
    },
    {
      icon: Phone,
      label: "Telepon",
      value: "0895-3386-37405",
      href: "tel:+6289533863740",
      color: "text-purple-600",
    },
    {
      icon: Phone,
      label: "WhatsApp",
      value: "0895-3386-37405",
      href: "https://wa.me/6289533863740",
      color: "text-emerald-500",
    },
    {
      icon: MapPin,
      label: "Alamat Kantor",
      value: "Jalan Baladewa No. 07, Kec. Cicendo, Kota Bandung",
      href: "https://maps.google.com/?q=Jalan+Baladewa+No+07+Cicendo+Bandung",
      color: "text-orange-500",
    },
    {
      icon: Clock,
      label: "Jam Operasional",
      value: "Senin - Minggu, 24 Jam",
      href: null,
      color: "text-blue-500",
    },
  ];

  const socialMedia = [
    {
      label: "TikTok",
      href: "https://www.tiktok.com/@penasakti.com",
      color: "bg-black hover:bg-gray-800",
      svg: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/>
        </svg>
      ),
    },
    {
      label: "YouTube",
      href: "https://www.youtube.com/@mediapenasaktinews",
      color: "bg-red-600 hover:bg-red-700",
      svg: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-black mb-3 font-heading">
            Hubungi <span className="text-penasakti-red">Kami</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Kami senang mendengar dari Anda. Hubungi kami untuk pertanyaan, saran,
            kerjasama, atau pengaduan.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-2xl bg-card border border-border">
              <h2 className="text-xl font-bold mb-4">Informasi Kontak</h2>
              <div className="space-y-4">
                {contactInfo.map(({ icon: Icon, label, value, href, color }) => (
                  <a
                    key={label}
                    href={href || undefined}
                    target={href?.startsWith("http") ? "_blank" : undefined}
                    rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted transition-colors group"
                  >
                    <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform ${color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="font-medium text-sm group-hover:text-penasakti-blue transition-colors">
                        {value}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Social Media */}
            <div className="p-6 rounded-2xl bg-card border border-border">
              <h2 className="text-xl font-bold mb-4">Ikuti Kami</h2>
              <div className="grid grid-cols-2 gap-3">
                {socialMedia.map(({ label, href, color, svg }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-3 p-3 rounded-xl text-white ${color} transition-all`}
                  >
                    {svg}
                    <span className="font-medium text-sm">{label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className="p-6 md:p-8 rounded-2xl bg-card border border-border">
              <h2 className="text-xl font-bold mb-2">Kirim Pesan</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Isi formulir di bawah ini dan tim kami akan merespons dalam 1x24 jam kerja.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      Nama Lengkap <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-penasakti-blue/30 focus:border-penasakti-blue transition-all"
                      placeholder="Masukkan nama Anda"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      Email <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-penasakti-blue/30 focus:border-penasakti-blue transition-all"
                      placeholder="email@contoh.com"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      Kategori <span className="text-destructive">*</span>
                    </label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-penasakti-blue/30 focus:border-penasakti-blue transition-all"
                    >
                      <option value="pertanyaan">Pertanyaan Umum</option>
                      <option value="kerjasama">Kerjasama & Iklan</option>
                      <option value="koreksi">Koreksi & Pengaduan</option>
                      <option value="redaksi">Hubungi Redaksi</option>
                      <option value="karir">Peluang Karir</option>
                      <option value="lainnya">Lainnya</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      Subjek <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-penasakti-blue/30 focus:border-penasakti-blue transition-all"
                      placeholder="Tulis subjek pesan"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Pesan <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-penasakti-blue/30 focus:border-penasakti-blue transition-all resize-none"
                    placeholder="Tulis pesan Anda secara detail..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-penasakti-blue text-white font-semibold rounded-lg hover:bg-penasakti-blue/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Mengirim...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Kirim Pesan
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
