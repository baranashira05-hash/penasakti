# SEO Checklist - penasakti.com

Panduan optimasi Google Search Console dan keterbacaan situs.

---

## ✅ Yang Sudah Dioptimasi (Kode)

### robots.txt (`/robots.ts`)
- Googlebot & Googlebot-News diizinkan crawl `/artikel/`, `/berita/`, `/kategori/`, `/tag/`, `/penulis/`
- Halaman private (`/dashboard/`, `/api/`, `/profil`, `/bookmark`) di-disallow
- Mencantumkan 3 sitemap: `sitemap-index.xml`, `sitemap.xml`, `news-sitemap.xml`

### Sitemap
- `/sitemap.xml` — semua halaman (artikel, kategori, tag, penulis, statis)
- `/news-sitemap.xml` — artikel 48 jam terakhir untuk Google News
- `/sitemap-index.xml` — index sitemap, daftarkan URL ini di Search Console

### Structured Data (JSON-LD)
- **Root layout** — `NewsMediaOrganization` + `WebSite` + `SearchAction`
- **Artikel** (`/artikel/[slug]`) — `NewsArticle` + `BreadcrumbList`
- **Berita WP** (`/berita/[slug]`) — `NewsArticle`
- **Kategori** — `CollectionPage`
- **Tag** — `CollectionPage` + `BreadcrumbList`
- **Penulis** — `Person` + `BreadcrumbList`

### Metadata
- Title template: `Judul Artikel | PenaSakti`
- Canonical URL di semua halaman
- OpenGraph lengkap (title, description, image, locale `id_ID`)
- Twitter Card `summary_large_image`
- Google Search Console verification tag di `layout.tsx`

### RSS Feed
- `/rss.xml` — feed artikel terbaru dengan `media:content` image

---

## 🔧 Yang Harus Dilakukan di Google Search Console

### 1. Submit Sitemap
Buka: **Search Console → Sitemaps → Add a new sitemap**

Submit URL-URL berikut (PENTING - hanya submit yang ini):
```
https://penasakti.com/sitemap-index.xml
```

**Info:** `sitemap-index.xml` sudah mencakup `sitemap.xml` dan `news-sitemap.xml` secara otomatis.
Anda **tidak perlu** submit `/sitemap.xml` dan `/news-sitemap.xml` secara terpisah.

### 2. Test Sitemap Bisa Diakses
Sebelum submit ke Google, tes dulu URL ini di browser:
- https://penasakti.com/sitemap-index.xml
- https://penasakti.com/sitemap.xml
- https://penasakti.com/news-sitemap.xml
- https://penasakti.com/robots.txt

**Semuanya harus** mengembalikan XML yang valid. Kalau "404 Not Found", artinya website belum di-deploy atau build belum selesai.

### 3. Request Indexing Halaman Prioritas
Buka: **Search Console → URL Inspection**

Tempel URL artikel terpenting dan klik **"Request Indexing"**.
Lakukan untuk 10-20 artikel terbaru dan halaman utama.

### 3. Verifikasi robots.txt
Buka: **Search Console → Settings → robots.txt Tester**
- Pastikan `/artikel/*` di-allow untuk Googlebot
- Pastikan `/dashboard/` di-disallow

### 4. Core Web Vitals
Pantau di: **Search Console → Core Web Vitals**
- Target LCP < 2.5 detik
- Target CLS < 0.1
- Target INP < 200ms

### 5. Google News Publisher Center
Daftarkan di: https://publishercenter.google.com
- Klaim publikasi `penasakti.com`
- Verifikasi konten berita
- Aktifkan Google News Sitemap (`/news-sitemap.xml`)

---

## 📋 Checklist Per Artikel (Untuk Editor)

Sebelum publish artikel, pastikan:

- [ ] **Judul** mengandung kata kunci utama (50-60 karakter)
- [ ] **Excerpt/ringkasan** ditulis manual (120-155 karakter)
- [ ] **Featured image** diisi + alt text deskriptif
- [ ] **Kategori** dipilih dengan benar
- [ ] **Tag** ditambahkan (3-5 tag relevan)
- [ ] **Meta Title** diisi jika berbeda dari judul (opsional)
- [ ] **Meta Description** diisi (120-155 karakter)
- [ ] **Slug** URL pendek, mengandung kata kunci, tanpa angka acak

### Contoh Slug yang Baik
✅ `presiden-umumkan-stimulus-ekonomi-2026`
❌ `artikel-12345-presiden-umumkan-berita`

---

## 🚀 Tips Agar Berita Muncul di Google Cepat

1. **Publish artikel saat jam sibuk** (06:00–09:00 atau 19:00–22:00 WIB)
2. **Share ke media sosial** setelah publish untuk sinyal sosial
3. **Internal linking** — setiap artikel wajib ada 2-3 link ke artikel lain
4. **Update artikel lama** agar `updatedAt` berubah, Google crawl ulang
5. **Gunakan breaking news flag** untuk berita penting (meningkatkan priority di sitemap)

---

## 📊 URL Penting untuk Dipantau

| URL | Fungsi |
|-----|--------|
| `https://penasakti.com/sitemap.xml` | Sitemap utama |
| `https://penasakti.com/news-sitemap.xml` | Sitemap Google News |
| `https://penasakti.com/sitemap-index.xml` | Index sitemap |
| `https://penasakti.com/robots.txt` | Aturan crawler |
| `https://penasakti.com/rss.xml` | RSS feed |
