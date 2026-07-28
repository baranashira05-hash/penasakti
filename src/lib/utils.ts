import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow, format, parseISO } from "date-fns";
import { id } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date, formatStr = "dd MMMM yyyy") {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, formatStr, { locale: id });
}

export function formatDateRelative(date: string | Date) {
  if (typeof window === "undefined") {
    const d = typeof date === "string" ? parseISO(date) : date;
    return format(d, "dd MMM yyyy, HH:mm", { locale: id });
  }
  const d = typeof date === "string" ? parseISO(date) : date;
  return formatDistanceToNow(d, { addSuffix: true, locale: id });
}

export function formatNumber(num: number | bigint): string {
  const n = typeof num === "bigint" ? Number(num) : Number(num) || 0;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

export function estimateReadTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

export function generateExcerpt(content: string, length = 160): string {
  const stripped = content.replace(/<[^>]+>/g, "");
  return truncate(stripped, length);
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function absoluteUrl(path: string): string {
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`;
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function getDeviceType(userAgent: string): string {
  if (/mobile/i.test(userAgent)) return "mobile";
  if (/tablet/i.test(userAgent)) return "tablet";
  return "desktop";
}

export function getBrowser(userAgent: string): string {
  if (userAgent.includes("Chrome")) return "Chrome";
  if (userAgent.includes("Firefox")) return "Firefox";
  if (userAgent.includes("Safari")) return "Safari";
  if (userAgent.includes("Edge")) return "Edge";
  return "Other";
}

export const CATEGORIES = [
  { name: "Nasional", slug: "nasional", color: "#e74c3c" },
  { name: "Politik", slug: "politik", color: "#8e44ad" },
  { name: "Ekonomi", slug: "ekonomi", color: "#27ae60" },
  { name: "Internasional", slug: "internasional", color: "#2980b9" },
  { name: "Teknologi", slug: "teknologi", color: "#16a085" },
  { name: "Pendidikan", slug: "pendidikan", color: "#f39c12" },
  { name: "Hukum", slug: "hukum", color: "#c0392b" },
  { name: "Olahraga", slug: "olahraga", color: "#d35400" },
  { name: "Otomotif", slug: "otomotif", color: "#7f8c8d" },
  { name: "Lifestyle", slug: "lifestyle", color: "#e91e63" },
  { name: "Hiburan", slug: "hiburan", color: "#9b59b6" },
  { name: "Daerah", slug: "daerah", color: "#1abc9c" },
  { name: "Opini", slug: "opini", color: "#34495e" },
  { name: "Video", slug: "video", color: "#e74c3c" },
  { name: "Foto", slug: "foto", color: "#2ecc71" },
  { name: "Infografis", slug: "infografis", color: "#3498db" },
];

export function nanoid(size = 8): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";
  for (let i = 0; i < size; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}
