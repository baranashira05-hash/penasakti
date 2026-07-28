import { Metadata } from "next";
import HomeClient from "@/components/home/HomeClient";

export const metadata: Metadata = {
  title: "PenaSakti - Portal Berita Nasional Terpercaya",
  description: "Baca berita terkini Indonesia: politik, ekonomi, teknologi, olahraga, dan gaya hidup. Cepat, akurat, dan terpercaya.",
};

export default function HomePage() {
  return <HomeClient />;
}
