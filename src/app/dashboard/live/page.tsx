"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Video, VideoOff, Mic, MicOff, Radio, Square, Pause, Play,
  MapPin, Camera, SwitchCamera, Maximize, Share2, Save,
  Zap, Eye, MessageSquare, Settings, Flashlight
} from "lucide-react";
import { toast } from "sonner";

type StreamStatus = "idle" | "preparing" | "live" | "paused" | "ended";
type Quality = "480p" | "720p" | "1080p";

const CATEGORIES = ["Breaking News", "Politik", "Ekonomi", "Bencana", "Olahraga", "Teknologi", "Kriminal"];

export default function AdminLivePage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [status, setStatus] = useState<StreamStatus>("idle");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [locationName, setLocationName] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [quality, setQuality] = useState<Quality>("720p");
  const [isBreaking, setIsBreaking] = useState(false);
  const [isEmergency, setIsEmergency] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const [viewers, setViewers] = useState(0);
  const [streamId, setStreamId] = useState("");
  const [duration, setDuration] = useState(0);

  // Duration timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (status === "live") {
      timer = setInterval(() => setDuration(d => d + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [status]);

  // Get GPS location
  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      toast.error("Geolocation tidak didukung");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setLatitude(pos.coords.latitude);
        setLongitude(pos.coords.longitude);
        // Reverse geocode (simple)
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`);
          const data = await res.json();
          const addr = data.address || {};
          setCity(addr.city || addr.town || addr.county || "");
          setProvince(addr.state || "");
          setLocationName(`${addr.city || addr.town || ""}, ${addr.state || ""}`);
          toast.success(`Lokasi: ${addr.city || addr.town || "Unknown"}, ${addr.state || ""}`);
        } catch {
          setLocationName(`${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
        }
      },
      () => toast.error("Gagal mendapatkan lokasi"),
      { enableHighAccuracy: true }
    );
  }, []);

  // Start camera
  const startCamera = async () => {
    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode,
          width: quality === "1080p" ? 1920 : quality === "720p" ? 1280 : 854,
          height: quality === "1080p" ? 1080 : quality === "720p" ? 720 : 480,
        },
        audio: true,
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setStatus("preparing");
      getLocation();
      toast.success("Kamera aktif");
    } catch (err) {
      toast.error("Gagal mengakses kamera. Pastikan izin diberikan.");
    }
  };

  // Switch camera
  const switchCamera = async () => {
    const newMode = facingMode === "user" ? "environment" : "user";
    setFacingMode(newMode);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
    }
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: newMode, width: 1280, height: 720 },
      audio: true,
    });
    streamRef.current = stream;
    if (videoRef.current) videoRef.current.srcObject = stream;
  };

  // Go live
  const goLive = async () => {
    if (!title) { toast.error("Judul wajib diisi"); return; }
    try {
      const res = await fetch("/api/live/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title, description, locationName, latitude, longitude, city, province,
          category, quality, isBreaking, isEmergency,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStreamId(data.data.id);
        setStatus("live");
        setDuration(0);
        toast.success("🔴 LIVE SEKARANG!");
      } else {
        toast.error(data.error || "Gagal memulai live");
      }
    } catch {
      toast.error("Gagal memulai live");
    }
  };

  // End live
  const endLive = async () => {
    try {
      await fetch("/api/live/end", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ streamId }),
      });
      streamRef.current?.getTracks().forEach(t => t.stop());
      setStatus("ended");
      toast.success("Live berakhir. Rekaman tersimpan.");
    } catch {
      toast.error("Gagal mengakhiri live");
    }
  };

  // Toggle mute
  const toggleMute = () => {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach(t => { t.enabled = !t.enabled; });
      setIsMuted(!isMuted);
    }
  };

  const formatDuration = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h > 0 ? h + ":" : ""}${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Radio className="w-6 h-6 text-red-500" /> Live Video Berita
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Siaran langsung dari lokasi kejadian</p>
        </div>
        {status === "live" && (
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-sm font-bold text-red-600">
              <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" /> LIVE
            </span>
            <span className="text-sm font-mono text-gray-600 dark:text-gray-300">{formatDuration(duration)}</span>
            <span className="flex items-center gap-1 text-sm text-gray-500"><Eye className="w-4 h-4" />{viewers}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Preview */}
        <div className="lg:col-span-2">
          <div className="relative bg-black rounded-2xl overflow-hidden aspect-video">
            <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />

            {status === "idle" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-white">
                <Video className="w-16 h-16 text-gray-500 mb-4" />
                <p className="text-gray-400 mb-4">Klik tombol di bawah untuk mengaktifkan kamera</p>
                <button onClick={startCamera} className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-xl font-semibold transition-colors flex items-center gap-2">
                  <Camera className="w-5 h-5" /> Aktifkan Kamera
                </button>
              </div>
            )}

            {status === "live" && (
              <>
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="flex items-center gap-1.5 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse" /> LIVE
                  </span>
                  {isBreaking && <span className="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded">BREAKING</span>}
                </div>
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <span className="bg-black/60 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                    <Eye className="w-3 h-3" /> {viewers}
                  </span>
                  <span className="bg-black/60 text-white text-xs px-2 py-1 rounded font-mono">{formatDuration(duration)}</span>
                </div>
                {locationName && (
                  <div className="absolute bottom-4 left-4 bg-black/70 text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 backdrop-blur-sm">
                    <MapPin className="w-3 h-3 text-red-400" /> LIVE dari {locationName}
                  </div>
                )}
              </>
            )}

            {status === "ended" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/90 text-white">
                <Square className="w-12 h-12 text-gray-400 mb-3" />
                <p className="text-lg font-bold">Live Berakhir</p>
                <p className="text-gray-400 text-sm">Durasi: {formatDuration(duration)}</p>
              </div>
            )}
          </div>

          {/* Controls */}
          {(status === "preparing" || status === "live" || status === "paused") && (
            <div className="flex items-center justify-center gap-3 mt-4">
              <button onClick={toggleMute} className={`p-3 rounded-xl border transition-colors ${isMuted ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600" : "border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800"}`}>
                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
              <button onClick={switchCamera} className="p-3 rounded-xl border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                <SwitchCamera className="w-5 h-5" />
              </button>

              {status === "preparing" && (
                <button onClick={goLive} className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-colors flex items-center gap-2">
                  <Radio className="w-5 h-5" /> MULAI LIVE
                </button>
              )}
              {status === "live" && (
                <button onClick={endLive} className="px-8 py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-xl font-bold transition-colors flex items-center gap-2">
                  <Square className="w-5 h-5" /> AKHIRI LIVE
                </button>
              )}

              <button onClick={getLocation} className="p-3 rounded-xl border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                <MapPin className="w-5 h-5" />
              </button>
              <button className="p-3 rounded-xl border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                <Maximize className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Settings Panel */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-5">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Settings className="w-4 h-4" /> Pengaturan Live
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Judul Berita *</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Breaking: Kebakaran Besar di..." disabled={status === "live"} className="w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 disabled:opacity-50" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Deskripsi</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2} disabled={status === "live"} placeholder="Deskripsi singkat..." className="w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 resize-none disabled:opacity-50" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Kategori</label>
                  <select value={category} onChange={e => setCategory(e.target.value)} disabled={status === "live"} className="w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm focus:outline-none disabled:opacity-50">
                    <option value="">Pilih</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Kualitas</label>
                  <select value={quality} onChange={e => setQuality(e.target.value as Quality)} disabled={status === "live"} className="w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm focus:outline-none disabled:opacity-50">
                    <option value="480p">480p</option>
                    <option value="720p">720p</option>
                    <option value="1080p">1080p</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                <label className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${isBreaking ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400" : "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400"}`}>
                  <input type="checkbox" checked={isBreaking} onChange={e => setIsBreaking(e.target.checked)} className="sr-only" />
                  <Zap className="w-3 h-3" /> Breaking
                </label>
                <label className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${isEmergency ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400" : "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400"}`}>
                  <input type="checkbox" checked={isEmergency} onChange={e => setIsEmergency(e.target.checked)} className="sr-only" />
                  ⚠️ Darurat
                </label>
              </div>
            </div>
          </div>

          {/* Location Info */}
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-5">
            <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-500" /> Lokasi
            </h3>
            {latitude && longitude ? (
              <div className="space-y-2 text-sm">
                <p className="text-gray-700 dark:text-gray-200 font-medium">{locationName || "Memuat..."}</p>
                <p className="text-xs text-gray-400">{latitude.toFixed(6)}, {longitude.toFixed(6)}</p>
                <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700 h-32">
                  <iframe
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${longitude-0.01},${latitude-0.01},${longitude+0.01},${latitude+0.01}&layer=mapnik&marker=${latitude},${longitude}`}
                    className="w-full h-full"
                    style={{ border: 0 }}
                  />
                </div>
              </div>
            ) : (
              <button onClick={getLocation} className="w-full py-2.5 text-sm text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                📍 Ambil Lokasi GPS
              </button>
            )}
          </div>

          {/* Live Chat Preview */}
          {status === "live" && (
            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-5">
              <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" /> Live Chat
              </h3>
              <div className="h-32 flex items-center justify-center text-sm text-gray-400">
                Komentar penonton akan muncul di sini...
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
