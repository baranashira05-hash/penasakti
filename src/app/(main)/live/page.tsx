"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Radio, Eye, Clock, MapPin, Share2, ThumbsUp, Heart,
  MessageSquare, Play, Calendar, User
} from "lucide-react";

const DEMO_LIVE = {
  id: "1",
  title: "Breaking: Banjir Bandang Terjang Kota Bandung, Ratusan Warga Dievakuasi",
  slug: "banjir-bandang-bandung",
  description: "Siaran langsung dari lokasi banjir bandang yang melanda kawasan Bandung Selatan. Reporter PenaSakti melaporkan langsung perkembangan situasi terkini.",
  locationName: "Bandung Selatan, Jawa Barat",
  reporterName: "Ahmad Fauzi",
  thumbnail: "https://picsum.photos/seed/live1/1280/720",
  viewers: 3842,
  status: "LIVE" as const,
  startedAt: "2026-07-28T14:30:00Z",
  isBreaking: true,
  category: "Bencana",
};

const DEMO_UPCOMING = [
  { id: "2", title: "Konferensi Pers Presiden tentang Kebijakan Ekonomi Baru", scheduledAt: "2026-07-29T10:00:00Z", category: "Politik", thumbnail: "https://picsum.photos/seed/live2/400/225" },
  { id: "3", title: "Debat Calon Gubernur DKI Jakarta 2026", scheduledAt: "2026-07-30T19:00:00Z", category: "Politik", thumbnail: "https://picsum.photos/seed/live3/400/225" },
];

const DEMO_RECORDINGS = [
  { id: "4", title: "Liputan Gempa Cianjur M5.6 - Evakuasi Korban", slug: "gempa-cianjur", thumbnail: "https://picsum.photos/seed/rec1/400/225", viewers: 156000, duration: "1:23:45", date: "2026-07-25" },
  { id: "5", title: "Rapat Paripurna DPR - RUU Kesehatan", slug: "rapat-dpr-ruu", thumbnail: "https://picsum.photos/seed/rec2/400/225", viewers: 89000, duration: "2:05:12", date: "2026-07-23" },
  { id: "6", title: "Final Piala AFF 2026 - Indonesia vs Thailand", slug: "final-aff-2026", thumbnail: "https://picsum.photos/seed/rec3/400/225", viewers: 450000, duration: "3:15:00", date: "2026-07-20" },
];

const REACTIONS = ["👍", "❤️", "😮", "🔥"];

export default function LivePage() {
  const [activeReaction, setActiveReaction] = useState<string | null>(null);
  const [chatMessage, setChatMessage] = useState("");
  const [messages, setMessages] = useState([
    { id: "1", user: "Budi", msg: "Semoga warga semua selamat 🙏", time: "14:35" },
    { id: "2", user: "Rina", msg: "Banjirnya parah banget ya", time: "14:36" },
    { id: "3", user: "Dani", msg: "Bantuan sudah datang belum?", time: "14:37" },
    { id: "4", user: "Siti", msg: "Turut prihatin, semoga cepat surut", time: "14:38" },
  ]);
  const [viewerCount, setViewerCount] = useState(DEMO_LIVE.viewers);

  // Simulate viewer count changes
  useEffect(() => {
    const i = setInterval(() => {
      setViewerCount(v => v + Math.floor(Math.random() * 5) - 2);
    }, 3000);
    return () => clearInterval(i);
  }, []);

  const sendMessage = () => {
    if (!chatMessage.trim()) return;
    setMessages([...messages, { id: Date.now().toString(), user: "Anda", msg: chatMessage, time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) }]);
    setChatMessage("");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      {/* Main Live Section */}
      <div className="bg-black">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3">
            {/* Video Player */}
            <div className="lg:col-span-2 relative aspect-video bg-gray-900">
              <img src={DEMO_LIVE.thumbnail} alt={DEMO_LIVE.title} className="w-full h-full object-cover opacity-80" />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30">
                {/* Top bar */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="flex items-center gap-1.5 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg animate-pulse">
                    <span className="w-2 h-2 bg-white rounded-full" /> LIVE
                  </span>
                  {DEMO_LIVE.isBreaking && (
                    <span className="bg-amber-500 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg">BREAKING</span>
                  )}
                  <span className="bg-black/50 text-white text-xs px-2.5 py-1.5 rounded-lg backdrop-blur-sm">{DEMO_LIVE.category}</span>
                </div>
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <span className="bg-black/60 text-white text-xs px-2.5 py-1.5 rounded-lg flex items-center gap-1 backdrop-blur-sm">
                    <Eye className="w-3 h-3" /> {viewerCount.toLocaleString()}
                  </span>
                </div>

                {/* Bottom info */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h1 className="text-white text-lg md:text-xl font-bold mb-2 line-clamp-2">{DEMO_LIVE.title}</h1>
                  <div className="flex flex-wrap items-center gap-3 text-white/70 text-xs">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-red-400" />{DEMO_LIVE.locationName}</span>
                    <span className="flex items-center gap-1"><User className="w-3 h-3" />{DEMO_LIVE.reporterName}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Mulai 14:30 WIB</span>
                  </div>
                </div>
              </div>

              {/* Play button overlay (for mobile) */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Play className="w-8 h-8 text-white fill-white ml-1" />
                </div>
              </div>
            </div>

            {/* Live Chat */}
            <div className="flex flex-col h-[400px] lg:h-auto bg-gray-900 border-l border-gray-800">
              <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between">
                <h3 className="text-white font-semibold text-sm flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" /> Live Chat
                </h3>
                <span className="text-xs text-gray-400">{viewerCount.toLocaleString()} menonton</span>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {messages.map(m => (
                  <div key={m.id} className="text-xs">
                    <span className="font-semibold text-blue-400">{m.user}</span>
                    <span className="text-gray-300 ml-1.5">{m.msg}</span>
                    <span className="text-gray-600 ml-1.5">{m.time}</span>
                  </div>
                ))}
              </div>

              {/* Reactions */}
              <div className="px-3 py-2 border-t border-gray-800 flex items-center gap-2">
                {REACTIONS.map(r => (
                  <button key={r} onClick={() => setActiveReaction(r)} className={`text-lg hover:scale-125 transition-transform ${activeReaction === r ? "scale-125" : ""}`}>
                    {r}
                  </button>
                ))}
              </div>

              {/* Input */}
              <div className="p-3 border-t border-gray-800">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={e => setChatMessage(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && sendMessage()}
                    placeholder="Kirim pesan..."
                    className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-xs placeholder:text-gray-500 focus:outline-none focus:border-blue-500"
                  />
                  <button onClick={sendMessage} className="px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700">
                    Kirim
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Share & Actions */}
      <div className="container mx-auto px-4 py-4 flex flex-wrap items-center gap-3 border-b border-gray-200 dark:border-slate-800">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Bagikan:</span>
        {["Facebook", "X", "WhatsApp", "Telegram"].map(p => (
          <button key={p} className="px-3 py-1.5 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 text-xs rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors">
            {p}
          </button>
        ))}
      </div>

      <div className="container mx-auto px-4 py-8 space-y-10">
        {/* Upcoming */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-500" /> Live Akan Datang
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DEMO_UPCOMING.map(item => (
              <div key={item.id} className="flex gap-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
                <div className="w-28 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-slate-700">
                  <img src={item.thumbnail} alt="" className="w-full h-full object-cover" />
                </div>
                <div>
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400">{item.category}</span>
                  <h3 className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-2 mt-0.5">{item.title}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {new Date(item.scheduledAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recordings */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
            <Play className="w-5 h-5 text-red-500" /> Rekaman Sebelumnya
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {DEMO_RECORDINGS.map(rec => (
              <Link key={rec.id} href={`/live/${rec.slug}`} className="group bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden hover:shadow-md transition-all">
                <div className="relative aspect-video bg-gray-100 dark:bg-slate-700">
                  <img src={rec.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] px-2 py-0.5 rounded font-mono">{rec.duration}</span>
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{rec.title}</h3>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-0.5"><Eye className="w-3 h-3" />{(rec.viewers / 1000).toFixed(0)}K</span>
                    <span>{rec.date}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
