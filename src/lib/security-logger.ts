/**
 * security-logger.ts
 *
 * Logging aktivitas keamanan ke Redis untuk monitoring.
 * Data bisa ditampilkan di admin security dashboard.
 */

import { cache } from "@/lib/redis";

export type SecurityEvent =
  | "login_failed"
  | "login_success"
  | "brute_force_blocked"
  | "rate_limited"
  | "suspicious_ua"
  | "blocked_path"
  | "xss_attempt"
  | "scrape_attempt"
  | "hotlink_blocked"
  | "bot_blocked"
  | "csrf_invalid";

interface SecurityLogEntry {
  event: SecurityEvent;
  ip: string;
  path: string;
  userAgent?: string;
  details?: string;
  timestamp: number;
}

/**
 * Log security event ke Redis.
 * Non-blocking — fire and forget.
 */
export async function logSecurityEvent(entry: Omit<SecurityLogEntry, "timestamp">): Promise<void> {
  try {
    const log: SecurityLogEntry = {
      ...entry,
      timestamp: Date.now(),
    };

    // Simpan ke list di Redis (max 1000 entries, auto-trim)
    const key = `security:logs:${entry.event}`;
    const allKey = "security:logs:all";

    // Simpan sebagai string JSON
    const value = JSON.stringify(log);

    // Gunakan cache.set untuk setiap log entry dengan TTL 7 hari
    const entryKey = `security:log:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
    await cache.set(entryKey, value, 604800); // 7 hari

    // Increment counter per event type per hari
    const today = new Date().toISOString().split("T")[0];
    const counterKey = `security:count:${entry.event}:${today}`;
    const current = await cache.get<number>(counterKey);
    await cache.set(counterKey, (current || 0) + 1, 604800);

    // Increment IP-specific counter (untuk brute force detection)
    const ipCounterKey = `security:ip:${entry.ip}:${entry.event}:${today}`;
    const ipCount = await cache.get<number>(ipCounterKey);
    await cache.set(ipCounterKey, (ipCount || 0) + 1, 86400);
  } catch {
    // Non-fatal: logging gagal tidak boleh mengganggu request
  }
}

/**
 * Cek apakah IP sudah melebihi batas login gagal (brute force protection).
 * Returns true jika IP harus diblokir.
 */
export async function isIPBruteForceBlocked(ip: string): Promise<boolean> {
  try {
    const today = new Date().toISOString().split("T")[0];
    const key = `security:ip:${ip}:login_failed:${today}`;
    const failCount = await cache.get<number>(key);
    // Blokir setelah 5 gagal login per hari
    return (failCount || 0) >= 5;
  } catch {
    return false;
  }
}

/**
 * Cek apakah IP melakukan scraping (request terlalu cepat ke halaman artikel).
 */
export async function detectScraping(ip: string): Promise<boolean> {
  try {
    const windowKey = `security:scrape:${ip}`;
    const count = await cache.get<number>(windowKey);

    if ((count || 0) > 30) {
      // Lebih dari 30 halaman artikel dalam 1 menit = scraping
      return true;
    }

    // Increment
    await cache.set(windowKey, (count || 0) + 1, 60); // TTL 60 detik
    return false;
  } catch {
    return false;
  }
}

/**
 * Get security stats untuk admin dashboard.
 */
export async function getSecurityStats(): Promise<Record<string, number>> {
  try {
    const today = new Date().toISOString().split("T")[0];
    const events: SecurityEvent[] = [
      "login_failed",
      "brute_force_blocked",
      "rate_limited",
      "suspicious_ua",
      "blocked_path",
      "xss_attempt",
      "scrape_attempt",
      "hotlink_blocked",
    ];

    const stats: Record<string, number> = {};
    for (const event of events) {
      const key = `security:count:${event}:${today}`;
      stats[event] = (await cache.get<number>(key)) || 0;
    }

    return stats;
  } catch {
    return {};
  }
}
