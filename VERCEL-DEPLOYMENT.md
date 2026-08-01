# Vercel Deployment Guide

## ⚠️ PENTING: Environment Variables di Vercel

Setelah deploy ke Vercel, **WAJIB** set environment variable berikut di Vercel Dashboard:

### 1. Buka Vercel Dashboard
- Masuk ke project `penasakti`
- Klik **Settings** → **Environment Variables**

### 2. Tambahkan Variable Ini

| Variable Name | Value | Scope |
|---------------|-------|-------|
| `NEXT_PUBLIC_APP_URL` | `https://penasakti.com` | Production, Preview, Development |
| `NEXTAUTH_URL` | `https://penasakti.com` | Production |
| `DATABASE_URL` | `postgresql://...` | Production, Preview |
| `NEXTAUTH_SECRET` | `your-secret-key-min-32-chars` | Production, Preview |

### 3. Redeploy

Setelah menambahkan environment variables:
1. Klik **Deployments** tab
2. Pilih deployment terakhir
3. Klik **...** (titik tiga) → **Redeploy**
4. Centang **Use existing Build Cache** (opsional)
5. Klik **Redeploy**

---

## 🔧 Canonical Domain Redirect

Kode sudah diupdate untuk **redirect 301** otomatis dari `penasakti.vercel.app` ke `penasakti.com`.

Cek file berikut:
- `src/middleware.ts` — redirect 301 canonical domain
- `src/lib/site-url.ts` — hard-coded canonical URL
- `src/app/robots.ts` — sitemap canonical URL
- `src/app/sitemap.ts` — sitemap canonical URL
- `src/app/api/seo/news-sitemap/route.ts` — news sitemap canonical URL
- `src/app/api/seo/sitemap-index/route.ts` — sitemap index canonical URL

---

## 🔍 Google Search Console

### Hapus Indexing Vercel.app

1. Buka [Google Search Console](https://search.google.com/search-console)
2. Pilih property `https://penasakti.vercel.app` (jika ada)
3. Klik **Settings** → **Remove property**
4. Atau submit URL removal request untuk semua halaman `penasakti.vercel.app`

### Submit Sitemap penasakti.com

1. Pilih property `https://penasakti.com`
2. Klik **Sitemaps** di sidebar kiri
3. Hapus semua sitemap yang masih mengarah ke `vercel.app`
4. Tambahkan sitemap baru:
   - `https://penasakti.com/sitemap-index.xml`
5. Klik **Submit**

### Request Re-crawl

Untuk mempercepat update di Google:
1. Klik **URL Inspection** di sidebar kiri
2. Masukkan URL: `https://penasakti.com`
3. Klik **Request Indexing**
4. Ulangi untuk 5-10 URL artikel terpenting

---

## 📊 Monitoring SEO

### 1. Cek Canonical URL di Live Site

```bash
curl -I https://penasakti.com
# Expected: HTTP/2 200

curl -I https://penasakti.vercel.app
# Expected: HTTP/2 301
# Location: https://penasakti.com
```

### 2. Cek Sitemap

```bash
curl https://penasakti.com/sitemap-index.xml
curl https://penasakti.com/sitemap.xml
curl https://penasakti.com/news-sitemap.xml
curl https://penasakti.com/robots.txt
```

Pastikan **SEMUA** URL di dalam sitemap menggunakan `https://penasakti.com`, bukan `vercel.app`.

### 3. Cek Meta Tags di HTML

Buka browser dan inspect halaman:
- Homepage: `https://penasakti.com`
- Artikel: `https://penasakti.com/artikel/[slug-contoh]`

Cek meta tags berikut di `<head>`:

```html
<link rel="canonical" href="https://penasakti.com/artikel/..." />
<meta property="og:url" content="https://penasakti.com/..." />
<meta name="twitter:url" content="https://penasakti.com/..." />
```

**Harus semua `penasakti.com`, BUKAN `vercel.app`**.

---

## 🤖 GEO & AI Readability

### Structured Data (JSON-LD)

Website sudah menggunakan structured data untuk meningkatkan keterbacaan AI:

1. **Organization Schema** — di `layout.tsx`
2. **WebSite Schema** dengan SearchAction — di `layout.tsx`
3. **NewsArticle Schema** — di setiap halaman artikel
4. **BreadcrumbList Schema** — di setiap halaman dengan breadcrumb

### OpenGraph & Twitter Cards

Semua halaman sudah punya:
- `og:title`, `og:description`, `og:image`
- `twitter:card`, `twitter:title`, `twitter:description`

### Robots Meta Tags

- Homepage & kategori: `index, follow`
- Artikel: `index, follow, max-image-preview:large, max-snippet:-1`
- Dashboard & private pages: `noindex, nofollow`

---

## ✅ Checklist Post-Deployment

- [ ] Set `NEXT_PUBLIC_APP_URL=https://penasakti.com` di Vercel
- [ ] Redeploy setelah set environment variable
- [ ] Cek redirect 301: `curl -I https://penasakti.vercel.app`
- [ ] Cek sitemap: `https://penasakti.com/sitemap-index.xml`
- [ ] Cek robots.txt: `https://penasakti.com/robots.txt`
- [ ] Submit sitemap di Google Search Console
- [ ] Request removal `penasakti.vercel.app` di Google Search Console
- [ ] Request re-indexing homepage & 10 artikel top
- [ ] Monitoring 7 hari untuk memastikan Google index `penasakti.com`

---

## 📞 Troubleshooting

### Masalah: Google masih index vercel.app

**Solusi:**
1. Pastikan redirect 301 sudah jalan di production
2. Request URL removal di Google Search Console untuk semua URL vercel.app
3. Submit sitemap baru `penasakti.com/sitemap-index.xml`
4. Tunggu 3-7 hari untuk Google recrawl

### Masalah: Sitemap masih mengandung vercel.app

**Penyebab:** Environment variable `NEXT_PUBLIC_APP_URL` masih di-set ke vercel.app

**Solusi:**
1. Set `NEXT_PUBLIC_APP_URL=https://penasakti.com` di Vercel
2. Redeploy
3. Clear Vercel cache (optional): `vercel dev --force`

### Masalah: Artikel tidak muncul di Google News

**Solusi:**
1. Cek `news-sitemap.xml` hanya berisi artikel < 48 jam
2. Pastikan artikel punya `publishedAt` yang valid
3. Submit `https://penasakti.com/news-sitemap.xml` ke Google News Publisher Center
4. Pastikan sudah verifikasi ownership di Google News

---

## 🚀 Google Fast Indexing — Setup IndexNow & Publish Hooks

### Fitur yang sudah diimplementasikan:

Setiap kali admin klik **"Tayangkan Sekarang"**, sistem otomatis melakukan:

1. ✅ **ISR Cache Revalidation** — halaman artikel, homepage, kategori langsung diperbarui
2. ✅ **IndexNow ping** — memberitahu Google, Bing, Yandex artikel baru secara instan
3. ✅ **Google Indexing API** (opsional) — push langsung ke Google Search

### Environment Variables Wajib untuk Fast Indexing:

| Variable | Value | Keterangan |
|---|---|---|
| `REVALIDATE_SECRET` | string acak panjang | Secret untuk endpoint `/api/revalidate` |
| `INDEXNOW_KEY` | hex 32-64 karakter | Daftarkan di [indexnow.org](https://www.indexnow.org/) |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | JSON string | Opsional — Google Indexing API |

### Cara Generate INDEXNOW_KEY:

```bash
# Di terminal, generate key hex 32 karakter:
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
```

Contoh output: `a1b2c3d4e5f6...` (32 karakter hex)

Tambahkan key ini ke Vercel env vars sebagai `INDEXNOW_KEY`.

### Cara Setup Google Indexing API (Opsional tapi sangat direkomendasikan):

1. Buka [Google Cloud Console](https://console.cloud.google.com)
2. Aktifkan **Indexing API**
3. Buat **Service Account** → download JSON credentials
4. Di [Search Console](https://search.google.com/search-console) → Settings → Users and permissions → tambahkan email service account sebagai **Owner**
5. Paste isi JSON ke env var `GOOGLE_SERVICE_ACCOUNT_JSON` di Vercel

### Submit Sitemap ke Google Search Console:

```
https://www.penasakti.com/sitemap-index.xml
https://www.penasakti.com/news-sitemap.xml
```

### Submit ke Google News Publisher Center:

1. Buka [Google News Publisher Center](https://publishercenter.google.com)
2. Klaim property `penasakti.com`
3. Submit URL News Sitemap: `https://www.penasakti.com/news-sitemap.xml`

---

**Last Updated:** 2026-08-01
