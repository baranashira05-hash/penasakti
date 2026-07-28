import Link from "next/link";
import { Play } from "lucide-react";

const VIDEOS = [
  { id: "v1", title: "Presiden Tinjau Lokasi Banjir di Kalimantan Timur", youtubeId: "dQw4w9WgXcQ", thumb: "https://picsum.photos/seed/vid1/400/225", duration: "5:32", views: "125K" },
  { id: "v2", title: "Debat Panas RUU Cipta Kerja di Sidang Paripurna DPR", youtubeId: "dQw4w9WgXcQ", thumb: "https://picsum.photos/seed/vid2/400/225", duration: "12:45", views: "89K" },
  { id: "v3", title: "Kepala BMKG Jelaskan Fenomena Cuaca Ekstrem Indonesia 2026", youtubeId: "dQw4w9WgXcQ", thumb: "https://picsum.photos/seed/vid3/400/225", duration: "8:20", views: "67K" },
  { id: "v4", title: "Review Lengkap Samsung Galaxy S26 Ultra: Kamera 200MP", youtubeId: "dQw4w9WgXcQ", thumb: "https://picsum.photos/seed/vid4/400/225", duration: "18:10", views: "203K" },
];

export default function FeaturedVideo() {
  return (
    <section className="container mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-penasakti-red rounded-full" />
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="text-penasakti-red">▶</span> Video Terkini
          </h2>
        </div>
        <Link
          href="/video"
          className="text-sm text-penasakti-blue hover:underline font-medium"
        >
          Lihat Semua →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {VIDEOS.map((video, index) => (
          <Link
            key={video.id}
            href={`/video/${video.id}`}
            className="group"
          >
            <div className="relative aspect-video rounded-xl overflow-hidden bg-black mb-3">
              <img
                src={video.thumb}
                alt={video.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
              />
              {/* Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white flex items-center justify-center group-hover:bg-penasakti-red group-hover:border-penasakti-red transition-colors">
                  <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                </div>
              </div>
              {/* Duration */}
              <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-0.5 rounded font-mono">
                {video.duration}
              </span>
            </div>
            <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-penasakti-blue transition-colors leading-snug">
              {video.title}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              {video.views} penonton
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
