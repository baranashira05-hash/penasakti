import { NextRequest, NextResponse } from "next/server";
import { cache } from "@/lib/redis";

// Domain canonical — redirect 301 jika diakses via domain lain
const CANONICAL_HOST = "www.penasakti.com";

// ── Blocked paths (vulnerability scanning) ────────────────────────────
const BLOCKED_PATHS = [
  "/.env", "/.git", "/wp-admin", "/phpmyadmin", "/.env.local",
  "/server-status", "/.htaccess", "/.htpasswd", "/wp-login.php",
  "/xmlrpc.php", "/wp-includes", "/wp-json", "/administrator",
  "/admin.php", "/backup", "/.svn", "/.DS_Store",
  "/cgi-bin", "/etc/passwd", "/proc/self",
];

// ── Blocked user agents (attack tools & bad bots) ─────────────────────
const BLOCKED_UA_PATTERNS = [
  /sqlmap/i,
  /nmap/i,
  /nikto/i,
  /masscan/i,
  /python-requests\/0/i,
  /zgrab/i,
  /curl\/7\.(?:2[0-9]|3[0-9])\./i,
  /scrapy/i,
  /phantomjs/i,
  /headlesschrome/i,
  /selenium/i,
  /webdriver/i,
  /httrack/i,
  /wget(?!\/)/i,
  /harvest/i,
  /emailcollector/i,
  /extractorpro/i,
  /copier/i,
  /sitecopier/i,
  /websitemirrorer/i,
  /dirbuster/i,
  /gobuster/i,
  /nuclei/i,
  /httpx/i,
  /ffuf/i,
  /wfuzz/i,
  /semrush/i,
  /ahrefsbot/i,
  /dotbot/i,
  /mj12bot/i,
  /bytespider/i,
  /petalbot/i,
  /gptbot/i,
  /claudebot/i,
  /ccbot/i,
];

// ── Legitimate bots yang HARUS diizinkan ──────────────────────────────
const ALLOWED_BOT_PATTERNS = /googlebot|google-inspectiontool|bingbot|yandexbot|duckduckbot|baiduspider|facebookexternalhit|twitterbot|whatsapp|slurp|applebot|linkedinbot|telegrambot|pinterestbot|discordbot|google-structured-data-testing-tool|google-adwords|mediapartners-google|adsbot-google/i;

// ── Rate limiting configuration ───────────────────────────────────────
const RATE_LIMIT_WINDOW = 60; // seconds
const RATE_LIMIT_MAX = {
  default: 300,
  api: 120,
  auth: 20,      // Login — cukup longgar untuk NextAuth internal requests
  comments: 30,
  upload: 10,
  scrape: 60,    // Halaman artikel per menit per IP
};

// ── Helper functions ──────────────────────────────────────────────────

function getClientIp(req: NextRequest): string {
  // Cloudflare
  const cfConnecting = req.headers.get("cf-connecting-ip");
  if (cfConnecting) return cfConnecting;
  // Vercel
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const xri = req.headers.get("x-real-ip");
  if (xri) return xri;
  const trueClient = req.headers.get("true-client-ip");
  if (trueClient) return trueClient;
  const forwarded = req.headers.get("forwarded");
  if (forwarded) {
    const match = forwarded.match(/for=([^;,]+)/);
    if (match) return match[1].trim().replace(/^\[|\]$/g, "");
  }
  return "127.0.0.1";
}

function getRateLimitBucket(req: NextRequest): { key: string; limit: number } {
  const path = req.nextUrl.pathname;
  if (path === "/login" || path === "/register") {
    return { key: "auth", limit: RATE_LIMIT_MAX.auth };
  }
  // NextAuth internal routes — lebih longgar karena 1 login = banyak internal request
  if (path.startsWith("/api/auth/")) {
    return { key: "auth", limit: RATE_LIMIT_MAX.auth };
  }
  if (path.startsWith("/api/og")) {
    return { key: "default", limit: 500 };
  }
  if (path.startsWith("/api/comments")) {
    return { key: "comments", limit: RATE_LIMIT_MAX.comments };
  }
  if (path.startsWith("/api/uploadthing") || path.startsWith("/api/media") || path.startsWith("/api/upload")) {
    return { key: "upload", limit: RATE_LIMIT_MAX.upload };
  }
  if (path.startsWith("/api/")) {
    return { key: "api", limit: RATE_LIMIT_MAX.api };
  }
  if (path.startsWith("/artikel/")) {
    return { key: "scrape", limit: RATE_LIMIT_MAX.scrape };
  }
  return { key: "default", limit: RATE_LIMIT_MAX.default };
}

async function checkRateLimit(ip: string, bucket: string, limit: number): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  const now = Math.floor(Date.now() / 1000);
  const windowStart = Math.floor(now / RATE_LIMIT_WINDOW) * RATE_LIMIT_WINDOW;
  const cacheKey = `rate:${bucket}:${ip}:${windowStart}`;

  try {
    const current = await cache.get<number>(cacheKey);
    const nextCount = (current || 0) + 1;
    const remaining = Math.max(0, limit - nextCount);

    if (nextCount > limit) {
      return { allowed: false, remaining: 0, resetAt: windowStart + RATE_LIMIT_WINDOW };
    }

    await cache.set(cacheKey, nextCount, RATE_LIMIT_WINDOW + 5);
    return { allowed: true, remaining, resetAt: windowStart + RATE_LIMIT_WINDOW };
  } catch {
    // Redis down → allow request
    return { allowed: true, remaining: limit, resetAt: windowStart + RATE_LIMIT_WINDOW };
  }
}

/**
 * Brute force protection: cek apakah IP sudah terlalu banyak gagal login.
 */
async function checkBruteForce(ip: string): Promise<boolean> {
  try {
    const key = `security:brute:${ip}`;
    const count = await cache.get<number>(key);
    return (count || 0) >= 5; // 5 gagal dalam 15 menit = blocked
  } catch {
    return false;
  }
}

/**
 * Record login gagal untuk brute force detection.
 */
async function recordLoginAttempt(ip: string, success: boolean): Promise<void> {
  try {
    if (!success) {
      const key = `security:brute:${ip}`;
      const count = await cache.get<number>(key);
      await cache.set(key, (count || 0) + 1, 900); // TTL 15 menit
    } else {
      // Reset on success
      await cache.del(`security:brute:${ip}`);
    }
  } catch {}
}

function applySecurityHeaders(res: NextResponse, pathname: string): NextResponse {
  // Security headers untuk semua response
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-Frame-Options", "SAMEORIGIN");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()"
  );
  res.headers.set("X-XSS-Protection", "1; mode=block");
  res.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );

  // CSP — ketat tapi kompatibel dengan Next.js + dependencies
  const isAPI = pathname.startsWith("/api/");
  if (!isAPI) {
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.uploadthing.com https://news.google.com https://pagead2.googlesyndication.com https://www.googletagmanager.com https://www.google-analytics.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: blob: https: http:",
      "media-src 'self' data: blob: https:",
      "connect-src 'self' https: wss: ws:",
      "frame-ancestors 'self'",
      "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://player.vimeo.com https://accounts.google.com blob:",
      "form-action 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      process.env.NODE_ENV === "production" ? "upgrade-insecure-requests" : "",
    ]
      .filter(Boolean)
      .join("; ");

    res.headers.set("Content-Security-Policy", csp);
  }

  return res;
}

/**
 * Cek apakah request adalah image hotlinking dari domain lain.
 */
function isHotlinkAttempt(req: NextRequest): boolean {
  const referer = req.headers.get("referer") || "";
  const pathname = req.nextUrl.pathname;

  // Hanya cek untuk image paths
  if (!pathname.match(/\.(jpg|jpeg|png|gif|webp|avif|svg)$/i)) {
    return false;
  }

  // Jika tidak ada referer, izinkan (direct access, search engine)
  if (!referer) return false;

  try {
    const refUrl = new URL(referer);
    const refHost = refUrl.hostname.toLowerCase();

    // Izinkan dari domain sendiri
    if (refHost === "www.penasakti.com" || refHost === "penasakti.com" || refHost === "localhost") {
      return false;
    }

    // Izinkan dari platform yang legitimate
    const allowedReferers = [
      "google.com", "google.co.id",
      "facebook.com", "fb.com",
      "twitter.com", "x.com",
      "linkedin.com",
      "t.co",
      "instagram.com",
      "whatsapp.com", "web.whatsapp.com",
      "telegram.org", "t.me",
      "pinterest.com",
      "ampproject.org",
      "cache.google.com",
      "webcache.googleusercontent.com",
      "vercel.app",
    ];

    if (allowedReferers.some((d) => refHost.includes(d))) {
      return false;
    }

    // Semua referer lain = hotlink
    return true;
  } catch {
    return false;
  }
}

// ══════════════════════════════════════════════════════════════════════════
// MAIN MIDDLEWARE
// ══════════════════════════════════════════════════════════════════════════

export async function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;
  const host = req.headers.get("host") || "";
  const userAgent = req.headers.get("user-agent") || "";
  const ip = getClientIp(req);

  // ── 1. Canonical domain redirect ───────────────────────────────────
  // Redirect ke domain canonical HANYA jika custom domain sudah aktif.
  // Izinkan *.vercel.app agar preview/production tanpa custom domain tetap jalan.
  if (
    host &&
    !host.includes(CANONICAL_HOST) &&
    !host.includes("localhost") &&
    !host.includes("vercel.app") &&
    process.env.NODE_ENV === "production"
  ) {
    const url = req.nextUrl.clone();
    url.host = CANONICAL_HOST;
    url.protocol = "https:";
    url.port = "";
    return NextResponse.redirect(url, {
      status: 301,
      headers: { "Cache-Control": "public, max-age=31536000, immutable" },
    });
  }

  // ── 2. Block vulnerable paths ──────────────────────────────────────
  if (BLOCKED_PATHS.some((p) => pathname.toLowerCase().includes(p.toLowerCase()))) {
    // Log security event (fire and forget)
    logToConsole("blocked_path", ip, pathname, userAgent);
    return new NextResponse("Forbidden", { status: 403 });
  }

  // ── 3. Block malicious user agents ─────────────────────────────────
  // Tapi izinkan legitimate bots (Google, Bing, dll)
  if (!ALLOWED_BOT_PATTERNS.test(userAgent)) {
    if (BLOCKED_UA_PATTERNS.some((p) => p.test(userAgent))) {
      logToConsole("suspicious_ua", ip, pathname, userAgent);
      return new NextResponse("Forbidden", { status: 403 });
    }
  }

  // ── 4. Image hotlinking protection ─────────────────────────────────
  if (isHotlinkAttempt(req)) {
    logToConsole("hotlink_blocked", ip, pathname, userAgent);
    // Redirect ke halaman utama instead of 403 (less aggressive)
    return NextResponse.redirect(new URL("/", req.url));
  }

  // ── 5. XSS/SQLi detection di query parameters ─────────────────────
  for (const [key, value] of searchParams) {
    if (/<script|javascript:|on\w+\s*=|union\s+select|drop\s+table|insert\s+into|delete\s+from|1=1|or\s+1/i.test(value)) {
      logToConsole("xss_attempt", ip, pathname, `${key}=${value.substring(0, 50)}`);
      const url = req.nextUrl.clone();
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  // ── 6. Rate limiting ───────────────────────────────────────────────
  const { key: bucket, limit } = getRateLimitBucket(req);
  const rateResult = await checkRateLimit(ip, bucket, limit);

  if (!rateResult.allowed) {
    logToConsole("rate_limited", ip, pathname, `bucket=${bucket}`);

    // Untuk artikel, mungkin scraping
    if (pathname.startsWith("/artikel/")) {
      logToConsole("scrape_attempt", ip, pathname, userAgent);
    }

    return new NextResponse(
      JSON.stringify({ error: "Too Many Requests", retryAfter: rateResult.resetAt }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(RATE_LIMIT_WINDOW),
          "X-RateLimit-Limit": String(limit),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(rateResult.resetAt),
        },
      }
    );
  }

  // ── 7. Brute force protection (login routes) ──────────────────────
  if (pathname.startsWith("/api/auth/callback/credentials") && req.method === "POST") {
    const blocked = await checkBruteForce(ip);
    if (blocked) {
      logToConsole("brute_force_blocked", ip, pathname, userAgent);
      return new NextResponse(
        JSON.stringify({ error: "Terlalu banyak percobaan login. Coba lagi dalam 15 menit." }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  // ── 8. CSRF protection untuk API POST ──────────────────────────────
  if (req.method === "POST" && pathname.startsWith("/api/") && !pathname.startsWith("/api/auth/")) {
    const origin = req.headers.get("origin");
    const referer = req.headers.get("referer");

    // Pastikan request berasal dari domain sendiri (CORS origin check)
    if (origin && process.env.NODE_ENV === "production") {
      try {
        const originHost = new URL(origin).hostname;
        if (originHost !== "www.penasakti.com" && originHost !== "penasakti.com") {
          logToConsole("csrf_invalid", ip, pathname, `origin=${origin}`);
          return new NextResponse(
            JSON.stringify({ error: "Forbidden" }),
            { status: 403, headers: { "Content-Type": "application/json" } }
          );
        }
      } catch {}
    }
  }

  // ── 9. Build response with security headers ────────────────────────
  const res = NextResponse.next();
  applySecurityHeaders(res, pathname);

  // Rate limit headers
  res.headers.set("X-RateLimit-Limit", String(limit));
  res.headers.set("X-RateLimit-Remaining", String(rateResult.remaining));
  res.headers.set("X-RateLimit-Reset", String(rateResult.resetAt));

  // ── 10. Bot-specific headers ───────────────────────────────────────
  if (ALLOWED_BOT_PATTERNS.test(userAgent) && pathname.startsWith("/artikel/")) {
    res.headers.set(
      "X-Robots-Tag",
      "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
    );
  }

  // ── 11. Anti-embedding header (mencegah iframe dari situs lain) ────
  if (!pathname.startsWith("/api/")) {
    res.headers.set("X-Frame-Options", "SAMEORIGIN");
    res.headers.set("Cross-Origin-Opener-Policy", "same-origin");
    res.headers.set("Cross-Origin-Resource-Policy", "same-origin");
  }

  return res;
}

/**
 * Console log untuk security events.
 * Di production, bisa diganti dengan logSecurityEvent() ke Redis.
 */
function logToConsole(event: string, ip: string, path: string, details: string) {
  console.warn(`[SECURITY:${event}] ip=${ip} path=${path} ${details}`);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|manifest.json|sw.js|icon-\\d+x\\d+\\.png|apple-icon.png|og-image\\.jpg|logo\\.png|robots\\.txt|sitemap\\.xml|rss\\.xml|logo-penasakti\\.png|logo-penasakti-white\\.png).*)",
  ],
};
