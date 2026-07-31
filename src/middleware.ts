import { NextRequest, NextResponse } from "next/server";
import { cache } from "@/lib/redis";

// Domain canonical — redirect 301 jika diakses via domain lain (vercel.app, dll)
const CANONICAL_HOST = "penasakti.com";

const BLOCKED_PATHS = ["/.env", "/.git", "/wp-admin", "/phpmyadmin", "/.env.local", "/server-status"];
const BLOCKED_UA_PATTERNS = [
  /sqlmap/i,
  /nmap/i,
  /nikto/i,
  /masscan/i,
  /python-requests\/0/i,
  /zgrab/i,
  /curl\/7\.(?:2[0-9]|3[0-9])\./i,
];
const RATE_LIMIT_WINDOW = 60;
const RATE_LIMIT_MAX = {
  default: 120,
  api: 60,
  auth: 10,
  comments: 20,
  upload: 5,
};

function getClientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const xri = req.headers.get("x-real-ip");
  if (xri) return xri;
  const cfConnecting = req.headers.get("cf-connecting-ip");
  if (cfConnecting) return cfConnecting;
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
  if (path.startsWith("/api/auth/") || path.startsWith("/login") || path.startsWith("/register")) {
    return { key: "auth", limit: RATE_LIMIT_MAX.auth };
  }
  // OG image generation — tinggi limit karena dipanggil crawler WhatsApp/Telegram/Facebook
  if (path.startsWith("/api/og")) {
    return { key: "default", limit: 500 };
  }
  if (path.startsWith("/api/comments")) {
    return { key: "comments", limit: RATE_LIMIT_MAX.comments };
  }
  if (path.startsWith("/api/uploadthing") || path.startsWith("/api/media")) {
    return { key: "upload", limit: RATE_LIMIT_MAX.upload };
  }
  if (path.startsWith("/api/")) {
    return { key: "api", limit: RATE_LIMIT_MAX.api };
  }
  return { key: "default", limit: RATE_LIMIT_MAX.default };
}

async function checkRateLimit(req: NextRequest, ip: string): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  const { key: bucket, limit } = getRateLimitBucket(req);
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
    return { allowed: true, remaining: limit, resetAt: windowStart + RATE_LIMIT_WINDOW };
  }
}

function applySecurityHeaders(res: NextResponse, pathname: string): NextResponse {
  if (!pathname.startsWith("/api/")) {
    res.headers.set("X-Content-Type-Options", "nosniff");
    res.headers.set("X-Frame-Options", "SAMEORIGIN");
    res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    res.headers.set(
      "Permissions-Policy",
      "camera=(), microphone=(), geolocation=(), interest-cohort=()"
    );
    res.headers.set("X-XSS-Protection", "1; mode=block");
    res.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains"
    );
  }

  // NextAuth & TipTap + UploadThing membutuhkan blob: dan lebih longgar
  // Jangan terlalu strict CSP agar script inline dev/hmr bisa berjalan
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.uploadthing.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: blob: https: http:",
    "media-src 'self' data: blob: https:",
    "connect-src 'self' https: wss: ws:",
    "frame-ancestors 'self'",
    "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://player.vimeo.com blob:",
    "form-action 'self'",
    process.env.NODE_ENV === "production" ? "upgrade-insecure-requests" : "",
  ]
    .filter(Boolean)
    .join("; ");

  res.headers.set("Content-Security-Policy", csp);
  return res;
}

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;
  const host = req.headers.get("host") || "";

  // ── Canonical domain redirect ──────────────────────────────────────────
  // Jika diakses via vercel.app atau domain lain, redirect 301 ke penasakti.com
  // Ini KRUSIAL agar Google tidak mengindeks vercel.app
  if (
    host &&
    !host.includes(CANONICAL_HOST) &&
    !host.includes("localhost") &&
    process.env.NODE_ENV === "production"
  ) {
    const url = req.nextUrl.clone();
    url.host = CANONICAL_HOST;
    url.protocol = "https:";
    url.port = "";
    return NextResponse.redirect(url, {
      status: 301,
      headers: {
        // Pastikan search engine menyimpan redirect ini lama
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  }
  // ──────────────────────────────────────────────────────────────────────

  if (BLOCKED_PATHS.some((p) => pathname.includes(p))) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const userAgent = req.headers.get("user-agent") || "";
  if (BLOCKED_UA_PATTERNS.some((p) => p.test(userAgent))) {
    return new NextResponse("Bad Request", { status: 400 });
  }

  for (const [, value] of searchParams) {
    if (/<script|javascript:|on\w+\s*=|union\s+select/i.test(value)) {
      const url = req.nextUrl.clone();
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  const res = NextResponse.next();
  applySecurityHeaders(res, pathname);

  const ip = getClientIp(req);
  res.headers.set("X-Client-IP", ip);
  checkRateLimit(req, ip).then(({ remaining, resetAt, allowed }) => {
    res.headers.set("X-RateLimit-Limit", String(getRateLimitBucket(req).limit));
    res.headers.set("X-RateLimit-Remaining", String(remaining));
    res.headers.set("X-RateLimit-Reset", String(resetAt));
    if (!allowed) {
      console.warn(`[RATE LIMIT] ${ip} ${pathname}`);
    }
  });

  const token = req.cookies.get("next-auth.csrf-token")?.value;
  if (req.method === "POST" && pathname.startsWith("/api/")) {
    const xCsrf = req.headers.get("x-csrf-token");
    if (token && xCsrf && token.split("|")[0] !== xCsrf.split("|")[0]) {
      return new NextResponse(JSON.stringify({ error: "Invalid CSRF token" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  if (pathname === "/" || pathname === "") {
    const acceptLang = req.headers.get("accept-language")?.toLowerCase() || "id";
    if (!acceptLang.includes("id") && !acceptLang.includes("en")) {
      res.cookies.set("pref_lang", "en", { maxAge: 86400 * 30 });
    }
  }

  const botPattern = /googlebot|bingbot|yandexbot|duckduckbot|baiduspider|facebookexternalhit|twitterbot|whatsapp|slurp|applebot/i;
  if (botPattern.test(userAgent) && pathname.startsWith("/artikel/")) {
    res.headers.set("X-Robots-Tag", "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");
  }

  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|manifest.json|sw.js|icon-\\d+x\\d+\\.png|apple-icon.png|og-image\\.jpg|logo\\.png|robots\\.txt|sitemap\\.xml|rss\\.xml).*)",
  ],
};
