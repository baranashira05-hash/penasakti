/**
 * sanitize.ts
 *
 * Input sanitization utilities untuk proteksi XSS dan injection.
 * Digunakan di semua API endpoint yang menerima input user.
 */

/**
 * Strip HTML tags dari string untuk mencegah XSS.
 */
export function stripHtml(input: string): string {
  if (!input) return "";
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .trim();
}

/**
 * Sanitasi teks input — hapus karakter berbahaya tapi pertahankan teks.
 */
export function sanitizeText(input: string): string {
  if (!input) return "";
  return input
    .replace(/[<>]/g, "") // Hapus angle brackets
    .replace(/javascript:/gi, "") // Hapus javascript: protocol
    .replace(/on\w+\s*=/gi, "") // Hapus event handlers
    .replace(/data:text\/html/gi, "") // Hapus data URI HTML
    .trim();
}

/**
 * Sanitasi slug — hanya huruf, angka, dan tanda hubung.
 */
export function sanitizeSlug(input: string): string {
  if (!input) return "";
  return input
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Sanitasi email — validasi format basic.
 */
export function sanitizeEmail(input: string): string {
  if (!input) return "";
  const trimmed = input.trim().toLowerCase();
  // Basic email regex
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return trimmed;
  }
  return "";
}

/**
 * Sanitasi URL — pastikan hanya http/https.
 */
export function sanitizeUrl(input: string): string {
  if (!input) return "";
  const trimmed = input.trim();
  try {
    const url = new URL(trimmed);
    if (url.protocol === "https:" || url.protocol === "http:") {
      return url.toString();
    }
    return "";
  } catch {
    return "";
  }
}

/**
 * Cek apakah input mengandung pola SQL injection.
 */
export function hasSqlInjection(input: string): boolean {
  if (!input) return false;
  const patterns = [
    /(\b(union|select|insert|update|delete|drop|alter|create|exec|execute)\b.*\b(from|into|table|database|where)\b)/i,
    /('.*(\b(or|and)\b).*'.*=)/i,
    /(;\s*(drop|alter|create|truncate)\s)/i,
    /(\b(char|nchar|varchar|nvarchar|cast|convert)\s*\()/i,
    /(--\s*$|\/\*.*\*\/)/i,
    /(\bwaitfor\b\s+\bdelay\b)/i,
    /(\bsleep\s*\(\s*\d)/i,
    /(0x[0-9a-fA-F]+)/i,
  ];
  return patterns.some((p) => p.test(input));
}

/**
 * Sanitasi seluruh object (recursive) — untuk body request.
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const result = { ...obj };
  for (const key of Object.keys(result)) {
    const value = result[key];
    if (typeof value === "string") {
      // Jangan sanitasi field 'content' (HTML editor)
      if (key === "content") continue;
      (result as any)[key] = sanitizeText(value);
    } else if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      (result as any)[key] = sanitizeObject(value as Record<string, unknown>);
    }
  }
  return result;
}
