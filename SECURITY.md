# 🔐 Security Documentation — PenaSakti.com

## Arsitektur Keamanan

```
                    ┌─────────────────────┐
                    │   Cloudflare WAF    │ ← Layer 1: DDoS, Bot, WAF
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │   Vercel Edge       │ ← Layer 2: CDN, SSL/TLS
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │   Next.js Middleware │ ← Layer 3: Rate limit, Bot block,
                    │                     │    CSP, HSTS, Hotlink protection
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │   Route Handlers    │ ← Layer 4: Auth, CSRF, Input validation
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │   Prisma ORM        │ ← Layer 5: Parameterized queries (anti SQLi)
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │   PostgreSQL        │ ← Layer 6: Database-level security
                    └─────────────────────┘
```

---

## 1. Proteksi Konten (Client-side)

### File: `src/components/shared/ContentProtection.tsx`

| Proteksi | Shortcut/Aksi |
|---|---|
| Copy | Ctrl+C / Cmd+C |
| Select All | Ctrl+A / Cmd+A |
| Cut | Ctrl+X / Cmd+X |
| Save | Ctrl+S / Cmd+S |
| Print | Ctrl+P / Cmd+P |
| Right-click | Context menu |
| Inspect Element | F12, Ctrl+Shift+I/J/C, Ctrl+U |
| Text selection | CSS user-select + JS selectstart |
| Drag text | dragstart event |
| Drag image | dragstart + CSS pointer-events |
| DevTools detection | outerWidth/innerWidth diff |

### Notifikasi:
> "Konten PenaSakti.com dilindungi hak cipta."

### Penting — SEO Safe:
- Proteksi **hanya client-side JavaScript**
- Googlebot tidak menjalankan proteksi ini
- Schema.org JSON-LD tetap di-render server-side
- `<article>` content tetap ada di HTML source (untuk indexing)

---

## 2. Invisible Watermark

### File: `src/components/shared/InvisibleWatermark.tsx`

- Menyisipkan **zero-width Unicode characters** yang mengandung encoded source URL
- Saat konten di-copy (jika berhasil bypass proteksi), watermark ikut tercopy
- Watermark juga menyisipkan `© PenaSakti Media Digital` + URL artikel
- Tidak terlihat di browser, tapi terdeteksi saat paste

---

## 3. Image Protection

### File: `src/components/shared/ImageProtection.tsx`

- CSS `pointer-events: none` pada gambar artikel
- CSS `user-drag: none` / `-webkit-user-drag: none`
- CSS `-webkit-touch-callout: none` (mobile long-press)
- Transparent overlay `::after` di atas figure
- Print: artikel di-hide, tampilkan copyright notice

### Hotlinking Protection (Server-side):
- Middleware cek `Referer` header
- Jika bukan dari domain sendiri atau platform legitimate → redirect ke homepage
- Platform yang diizinkan: Google, Facebook, Twitter, WhatsApp, Telegram, Pinterest

---

## 4. Security Headers (Middleware)

| Header | Value |
|---|---|
| `Content-Security-Policy` | Strict CSP dengan whitelist |
| `X-Frame-Options` | SAMEORIGIN |
| `X-Content-Type-Options` | nosniff |
| `Referrer-Policy` | strict-origin-when-cross-origin |
| `Strict-Transport-Security` | max-age=63072000; includeSubDomains; preload |
| `Permissions-Policy` | camera=(), microphone=(), geolocation=(), payment=() |
| `X-XSS-Protection` | 1; mode=block |
| `Cross-Origin-Opener-Policy` | same-origin |
| `Cross-Origin-Resource-Policy` | same-origin |

---

## 5. Rate Limiting

| Route | Limit per IP | Window |
|---|---|---|
| `/api/auth/*`, `/login` | 5 req | 60 detik |
| `/api/upload/*` | 5 req | 60 detik |
| `/api/comments/*` | 20 req | 60 detik |
| `/api/*` (general) | 60 req | 60 detik |
| `/artikel/*` (scrape protection) | 30 req | 60 detik |
| Default (halaman) | 120 req | 60 detik |
| `/api/og` | 500 req | 60 detik |

Implementasi: Redis (Upstash) sliding window counter.

---

## 6. Bot Protection

### Blocked User Agents:
- Attack tools: sqlmap, nmap, nikto, nuclei, ffuf, dirbuster, gobuster
- Scrapers: scrapy, httrack, copier, harvest, extractorpro
- Headless browsers: PhantomJS, HeadlessChrome, Selenium, WebDriver
- AI crawlers: GPTBot, ClaudeBot, CCBot
- SEO bots: SemrushBot, AhrefsBot, DotBot, MJ12bot, ByteSpider, PetalBot

### Allowed Bots (TIDAK DIBLOKIR):
- Googlebot, Google-InspectionTool, Google-Structured-Data-Testing-Tool
- Bingbot
- YandexBot
- Facebookexternalhit, TwitterBot, WhatsApp
- LinkedInBot, TelegramBot, PinterestBot, DiscordBot
- Applebot, Slurp (Yahoo)

---

## 7. Brute Force Protection

- **5 gagal login** dalam 15 menit → IP diblokir sementara
- Counter di-reset setelah login berhasil
- Storage: Redis key `security:brute:{ip}` dengan TTL 900 detik
- Response: HTTP 429 + pesan "Terlalu banyak percobaan login"

---

## 8. Login Security

| Feature | Implementation |
|---|---|
| Password hashing | bcryptjs (sudah ada) |
| Session | JWT via NextAuth, maxAge 30 hari |
| Session timeout | 30 hari (configurable) |
| Login attempt limit | 5 per 15 menit per IP |
| Brute force protection | Redis-based counter |
| OAuth | Google + Facebook (sudah ada) |
| Banned user check | `user.isBanned` check di authorize() |

---

## 9. API Security

| Protection | Implementation |
|---|---|
| Rate limiting | Redis sliding window (middleware) |
| CSRF | Origin header check (production) |
| XSS | Input sanitization + CSP header |
| SQL Injection | Prisma ORM (parameterized queries) + pattern detection |
| Input validation | Zod schemas (sudah digunakan di forms) |
| Input sanitization | `src/lib/sanitize.ts` — sanitizeText, sanitizeObject |
| Auth check | `getServerSession()` pada semua mutating endpoints |

---

## 10. Blocked Paths

Request ke path berikut langsung mendapat `403 Forbidden`:

```
/.env, /.git, /wp-admin, /phpmyadmin, /.env.local,
/server-status, /.htaccess, /.htpasswd, /wp-login.php,
/xmlrpc.php, /wp-includes, /wp-json, /administrator,
/admin.php, /backup, /.svn, /.DS_Store,
/cgi-bin, /etc/passwd, /proc/self
```

---

## 11. Cloudflare Configuration

### Setup Cloudflare (Rekomendasi):

1. **DNS**: Arahkan domain `penasakti.com` ke Cloudflare (proxy ON / orange cloud)
2. **SSL/TLS**: Mode "Full (strict)"
3. **WAF Rules** (buat di Security → WAF):

```
Rule 1: Block known bad bots
Expression: (http.user_agent contains "sqlmap") or (http.user_agent contains "nikto") or (http.user_agent contains "nuclei")
Action: Block

Rule 2: Rate limit login
Expression: (http.request.uri.path contains "/api/auth") and (http.request.method eq "POST")
Action: Rate limit — 5 requests per 10 seconds → Challenge

Rule 3: Protect admin
Expression: (http.request.uri.path contains "/dashboard") and not (ip.src in {ADMIN_IP_LIST})
Action: Challenge (CAPTCHA)

Rule 4: Block countries (optional)
Expression: (ip.geoip.country ne "ID") and (http.request.uri.path contains "/api/auth")
Action: Challenge
```

4. **Bot Fight Mode**: ON
5. **Browser Integrity Check**: ON
6. **Hotlink Protection**: ON
7. **Scrape Shield** → Email Address Obfuscation: ON
8. **Under Attack Mode**: OFF (gunakan saat DDoS)

### Page Rules:

```
penasakti.com/dashboard/* → Security Level: High, Cache Level: Bypass
penasakti.com/api/* → Security Level: Medium, Cache Level: Bypass
penasakti.com/artikel/* → Cache Level: Standard, Edge Cache TTL: 5 min
```

### Firewall Rules (IP Access):
- Whitelist IP admin untuk akses `/dashboard` tanpa CAPTCHA
- Whitelist IP Vercel untuk deployment hooks

---

## 12. Monitoring & Logging

### Security Dashboard: `GET /api/admin/security`

Menampilkan:
- Login failures today
- Brute force blocks today
- Rate limited requests
- XSS attempts
- Scraping attempts
- Hotlink blocks

### Log Storage:
- Redis keys dengan TTL 7 hari
- Format: `security:count:{event}:{date}`
- Per-IP tracking: `security:ip:{ip}:{event}:{date}`

### Console Warnings (server logs):
```
[SECURITY:blocked_path] ip=1.2.3.4 path=/.env ...
[SECURITY:suspicious_ua] ip=1.2.3.4 path=/ sqlmap/1.0
[SECURITY:rate_limited] ip=1.2.3.4 path=/api/articles bucket=api
[SECURITY:brute_force_blocked] ip=1.2.3.4 path=/api/auth/...
[SECURITY:xss_attempt] ip=1.2.3.4 path=/search q=<script>
[SECURITY:scrape_attempt] ip=1.2.3.4 path=/artikel/... 
[SECURITY:hotlink_blocked] ip=1.2.3.4 path=/images/...
```

---

## 13. Testing Checklist

### Content Protection:
- [ ] Ctrl+C pada artikel → notifikasi muncul, copy diblokir
- [ ] Klik kanan pada artikel → notifikasi muncul
- [ ] F12 → notifikasi muncul
- [ ] Select text pada artikel → tidak bisa
- [ ] Drag gambar → tidak bisa
- [ ] Print (Ctrl+P) → konten di-hide
- [ ] Copy berhasil (bypass) → ada watermark source URL

### Security:
- [ ] `curl -I https://www.penasakti.com` → CSP, HSTS, X-Frame-Options
- [ ] 6x gagal login → 429 "Terlalu banyak percobaan"
- [ ] Request `/wp-admin` → 403
- [ ] Request dengan UA "sqlmap" → 403
- [ ] 31+ request ke `/artikel/...` dalam 1 menit → 429
- [ ] POST `/api/articles` tanpa session → 401
- [ ] Query param `?q=<script>alert(1)</script>` → redirect tanpa param

### SEO (harus tetap berfungsi):
- [ ] `curl -A "Googlebot" https://www.penasakti.com/artikel/...` → 200 + full HTML
- [ ] `https://www.penasakti.com/robots.txt` → valid
- [ ] `https://www.penasakti.com/sitemap.xml` → valid
- [ ] `https://www.penasakti.com/news-sitemap.xml` → valid
- [ ] Google Rich Results Test → pass
- [ ] Schema.org JSON-LD ada di page source

---

## 14. Limitasi & Catatan

1. **Proteksi konten client-side tidak 100%** — user teknis bisa bypass via devtools disable JS, curl, atau extension browser. Ini standar industri (Kompas, Detik, CNN juga begitu).

2. **Googlebot tetap bisa crawl** — proteksi hanya JavaScript-based, tidak memblokir server-side rendering.

3. **Rate limiting membutuhkan Redis** — jika Redis down, rate limiting di-bypass (fail-open, bukan fail-close) agar website tetap accessible.

4. **Cloudflare WAF adalah layer tambahan** — bukan pengganti middleware. Keduanya bekerja berlapis.

---

**Last Updated:** 2026-08-03
