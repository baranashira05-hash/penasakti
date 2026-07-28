"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Radio, Play, MessageCircle, Users, Clock,
  Tv, Newspaper, MessageSquare, Share2, Calendar
} from "lucide-react";
import { formatDateRelative, formatNumber } from "@/lib/utils";

const LIVE_UPDATES = [
  { id: 1, time: "14:32 WIB", type: "BREAKING", text: "Pemerintah umumkan perubahan kebijakan BBM bersubsidi mulai Agustus 2026" },
  { id: 2, time: "14:18 WIB", type: "UPDATE", text: "Rapat paripurna DPR tentang RUU Kesehatan berakhir, lanjut ke rapat Komisi IX besok" },
  { id: 3, time: "14:05 WIB", type: "INFO", text: "Pasar saham Asia berakhir menguat, IHSG ditutup di level 8.752 (+1,8%)" },
  { id: 4, time: "13:55 WIB", type: "SPORT", text: "Timnas U-19 menang 2-0 atas Vietnam di laga pembinaan di Stadion Madya" },
  { id: 5, time: "13:40 WIB", type: "BREAKING", text: "KPK panggil 3 pejabat Kementerian PUPR terkait kasus suap proyek infrastruktur" },
  { id: 6, time: "13:22 WIB", type: "UPDATE", text: "Konferensi pers Bank Indonesia: BI Rate dipertahankan di level 6,25%" },
  { id: 7, time: "13:08 WIB", type: "CUACA", text: "BMKG: waspada hujan deras disertai petir di wilayah Jabodetabek sore ini" },
];

const UPCOMING_EVENTS = [
  {
    id: "ev1",
    title: "Live: Konferensi Pers Pemerintah tentang Ekonomi Q2 2026",
    datetime: "Hari Ini · 16.00 WIB",
    duration: "± 90 menit",
    participants: ["Menko Perekonomian", "Menteri Keuangan", "Kepala BPS", "Gubernur BI"],
    category: "Ekonomi",
  },
  {
    id: "ev2",
    title: "Live Streaming: Debat Kandidat Gubernur DKI Jakarta",
    datetime: "Rabu, 30 Jul 2026 · 19.30 WIB",
    duration: "± 120 menit",
    participants: ["3 Paslon Gubernur & Wagub DKI"],
    category: "Politik",
  },
  {
    id: "ev3",
    title: "Live Blog: Laga Timnas Indonesia vs Malaysia - Friendly Match",
    datetime: "Kamis, 31 Jul 2026 · 20.00 WIB",
    duration: "± 110 menit",
    participants: ["Timnas Senior", "Shin Tae-yong"],
    category: "Olahraga",
  },
  {
    id: "ev4",
    title: "Talkshow Spesial: HUT Ke-59 BUMN Indonesia",
    datetime: "Sabtu, 2 Agu 2026 · 14.00 WIB",
    duration: "± 150 menit",
    participants: ["Menteri BUMN", "CEO BUMN Papan Atas"],
    category: "BUMN",
  },
];

const CHANNELS = [
  { id: "c1", name: "PenaSakti News", viewers: 12543, status: "LIVE", current: "Berita Siang dan Analisis Hari Ini" },
  { id: "c2", name: "PenaSakti Business", viewers: 4521, status: "LIVE", current: "Laporan Pasar & Update Pergerakan Saham" },
  { id: "c3", name: "PenaSakti Sports", viewers: 8976, status: "LIVE", current: "Replay Final SEA Games: Indonesia vs Thailand" },
  { id: "c4", name: "PenaSakti Tech", viewers: 2134, status: "REPLAY", current: "Podcast AI Series Episode 140 (Ulang)" },
];

export default function LivePage() {
  const [viewerCount, setViewerCount] = useState(24567);

  useEffect(() => {
    const interval = setInterval(() => {
      setViewerCount((v) => v + Math.floor(Math.random() * 10 - 3));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-penasakti-red/10 text-penasakti-red mb-3">
            <span className="w-2 h-2 rounded-full bg-penasakti-red animate-pulse" />
            Live & Real-time
          </div>
          <h1 className="text-3xl md:text-4xl font-black font-heading mb-2">
            <span className="text-penasakti-red">Live</span> TV & Siaran Langsung
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Ikuti liputan peristiwa terkini secara real-time, mulai dari konferensi pers,
            pertandingan olahraga, hingga talkshow eksklusif PenaSakti.
          </p>
        </div>
      </div>

      {/* Main Live Player */}
      <section className="mb-10">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Video Player */}
          <div className="lg:col-span-2 rounded-2xl overflow-hidden bg-slate-900 border border-border">
            <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
              {/* Fake Video Stream */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-black">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 rounded-3xl border border-dashed border-white/15 opacity-40" />
                <div className="absolute inset-8 rounded-2xl bg-gradient-to-br from-penasakti-blue/30 via-penasakti-red/20 to-transparent" />
              </div>

              {/* Top Badge */}
              <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-penasakti-red text-white text-xs font-bold uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  ON AIR
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/50 backdrop-blur text-white text-xs font-semibold border border-white/15">
                  <Users className="w-3 h-3" />
                  {viewerCount.toLocaleString("id-ID")} menonton
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/50 backdrop-blur text-white text-xs font-semibold border border-white/15">
                  <Clock className="w-3 h-3" />
                  01:47:22
                </div>
              </div>

              {/* Live Title */}
              <div className="absolute top-4 right-4 z-10">
                <div className="px-4 py-2 rounded-xl bg-black/60 backdrop-blur border border-white/15 max-w-xs">
                  <p className="text-[10px] text-penasakti-gold font-bold uppercase tracking-wider mb-1">Siaran Langsung</p>
                  <p className="text-white text-sm font-semibold line-clamp-2 leading-snug">
                    Konferensi Pers: Paket Stimulus Ekonomi Rp 500 Triliun - Istana Negara
                  </p>
                </div>
              </div>

              {/* Center Play / Thumb */}
              <button className="relative z-10 flex flex-col items-center gap-4 group">
                <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur border-2 border-white/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <div className="w-18 h-18 p-5 rounded-full bg-penasakti-red text-white flex items-center justify-center shadow-2xl ring-4 ring-penasakti-red/30">
                    <Play className="w-8 h-8 fill-current ml-1" />
                  </div>
                </div>
                <span className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur text-white text-xs font-semibold border border-white/20">
                  Klik untuk tonton siaran langsung
                </span>
              </button>

              {/* Live Caption */}
              <div className="absolute bottom-16 left-4 right-4 z-10 max-w-2xl">
                <div className="px-4 py-2 rounded-lg bg-black/70 backdrop-blur text-white text-sm leading-relaxed border border-white/10">
                  <span className="text-penasakti-gold font-semibold">[Terjemah Otomatis] </span>
                  "...kami pastikan setiap rupiah stimulus ini tepat sasaran dan dapat dinikmati seluruh lapisan masyarakat,"
                </div>
              </div>

              {/* Video Controls */}
              <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10">
                <div className="flex items-center gap-3 text-white text-xs">
                  <span className="font-bold">HD · 1080p</span>
                  <div className="flex-1 h-1.5 rounded-full bg-white/20 overflow-hidden">
                    <div className="w-[42%] h-full bg-penasakti-red" />
                  </div>
                  <button className="p-1.5 rounded-lg hover:bg-white/15 transition-colors">
                    <Tv className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 rounded-lg hover:bg-white/15 transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Live Text Updates */}
          <div className="rounded-2xl bg-card border border-border overflow-hidden flex flex-col max-h-[40rem]">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-gradient-to-r from-penasakti-red/5 to-transparent">
              <div className="flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-penasakti-red" />
                <h2 className="font-bold">Live Text: Breaking News</h2>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-penasakti-red/10 text-penasakti-red">
                <span className="w-1.5 h-1.5 rounded-full bg-penasakti-red animate-pulse" />
                Real-time
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {LIVE_UPDATES.map((update) => (
                <div
                  key={update.id}
                  className={`p-3.5 rounded-xl border text-sm ${
                    update.type === "BREAKING"
                      ? "bg-penasakti-red/5 border-penasakti-red/30"
                      : "bg-muted/50 border-border/70"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-mono font-bold text-muted-foreground">
                      {update.time}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full tracking-wider ${
                        update.type === "BREAKING"
                          ? "bg-penasakti-red text-white"
                          : update.type === "SPORT"
                          ? "bg-orange-500 text-white"
                          : update.type === "CUACA"
                          ? "bg-blue-500 text-white"
                          : "bg-slate-500 text-white"
                      }`}
                    >
                      {update.type}
                    </span>
                  </div>
                  <p className="leading-relaxed">{update.text}</p>
                </div>
              ))}
            </div>
            <div className="px-4 py-3 border-t border-border">
              <div className="flex gap-2 items-center">
                <div className="flex-1 relative">
                  <MessageSquare className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Bergabung diskusi di kolom komentar..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-penasakti-red/30 focus:border-penasakti-red text-sm"
                  />
                </div>
                <button className="px-3 py-2 bg-penasakti-red text-white rounded-xl text-sm font-semibold hover:bg-penasakti-red/90 transition-colors">
                  <MessageCircle className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Channels */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
          <Tv className="w-5 h-5 text-indigo-500" />
          Channel PenaSakti
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CHANNELS.map((ch) => (
            <button
              key={ch.id}
              className="group text-left p-4 rounded-2xl bg-card border border-border hover:border-indigo-500/40 hover:shadow-card-hover transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold">{ch.name}</span>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    ch.status === "LIVE"
                      ? "bg-penasakti-red/10 text-penasakti-red"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {ch.status === "LIVE" && <span className="w-1.5 h-1.5 rounded-full bg-penasakti-red animate-pulse" />}
                  {ch.status}
                </span>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2 mb-3 min-h-[2rem] leading-relaxed">
                {ch.current}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-2 border-t border-border/50">
                <Users className="w-3 h-3" />
                {formatNumber(ch.viewers)} penonton
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Upcoming Events */}
      <section>
        <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-purple-500" />
          Jadwal Siaran Mendatang
        </h2>
        <div className="space-y-3">
          {UPCOMING_EVENTS.map((ev) => (
            <div
              key={ev.id}
              className="group flex flex-col md:flex-row gap-5 p-5 rounded-2xl bg-card border border-border hover:shadow-card-hover hover:border-purple-500/30 transition-all"
            >
              <div className="flex gap-4 md:gap-5 flex-1 min-w-0">
                <div className="hidden sm:flex flex-col items-center gap-1 px-3 py-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex-shrink-0 min-w-[4.5rem] self-start">
                  <Radio className="w-5 h-5" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Live</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-500">
                      {ev.category}
                    </span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {ev.datetime}
                    </span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-xs text-muted-foreground">{ev.duration}</span>
                  </div>
                  <h3 className="font-bold text-lg leading-snug mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {ev.title}
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {ev.participants.map((p) => (
                      <span
                        key={p}
                        className="px-2.5 py-0.5 bg-muted rounded-full text-xs font-medium"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex md:flex-col items-center md:items-end gap-2 md:gap-2 flex-shrink-0">
                <Link
                  href="#"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-700 transition-colors whitespace-nowrap"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Ingatkan Saya
                </Link>
                <Link
                  href="#"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-muted hover:bg-muted/70 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap"
                >
                  Detail
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
