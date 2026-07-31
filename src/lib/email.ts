/**
 * email.ts — Nodemailer utility untuk PenaSakti
 *
 * Dipakai oleh:
 * - /api/newsletter  → kirim email verifikasi subscriber
 * - (opsional) /api/newsletter/send → broadcast newsletter
 *
 * Konfigurasi via environment variables:
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM
 */

import nodemailer from "nodemailer";

// ─────────────────────────────────────────────────────────────
// Transporter — singleton agar koneksi SMTP tidak dibuat ulang
// ─────────────────────────────────────────────────────────────
function createTransporter() {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER || "";
  const pass = process.env.SMTP_PASS || "";

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // SSL untuk port 465, STARTTLS untuk 587
    auth: { user, pass },
    tls: {
      // Izinkan self-signed cert di development
      rejectUnauthorized: process.env.NODE_ENV === "production",
    },
  });
}

let _transporter: ReturnType<typeof nodemailer.createTransport> | null = null;

function getTransporter() {
  if (!_transporter) _transporter = createTransporter();
  return _transporter;
}

const FROM =
  process.env.EMAIL_FROM ||
  `PenaSakti <noreply@penasakti.com>`;

// ─────────────────────────────────────────────────────────────
// Kirim email verifikasi newsletter
// ─────────────────────────────────────────────────────────────
export async function sendNewsletterVerification(
  email: string,
  token: string
): Promise<void> {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://penasakti.com";
  const verifyUrl = `${baseUrl}/api/newsletter/verify?token=${token}`;
  const unsubUrl = `${baseUrl}/api/newsletter/unsubscribe?token=${token}`;

  await getTransporter().sendMail({
    from: FROM,
    to: email,
    subject: "✅ Konfirmasi Langganan Newsletter PenaSakti",
    text: `
Halo!

Terima kasih sudah mendaftar newsletter PenaSakti.

Klik tautan berikut untuk mengkonfirmasi email Anda:
${verifyUrl}

Tautan berlaku selama 24 jam.

Jika Anda tidak mendaftar, abaikan email ini atau batalkan langganan:
${unsubUrl}

—
Tim PenaSakti
penasakti.com
    `.trim(),
    html: `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Konfirmasi Newsletter PenaSakti</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1d4ed8 0%,#dc2626 100%);padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:800;letter-spacing:-0.5px;">
                📰 PenaSakti
              </h1>
              <p style="margin:6px 0 0;color:rgba(255,255,255,0.8);font-size:13px;">
                Portal Berita Nasional Terpercaya
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px 28px;">
              <h2 style="margin:0 0 12px;font-size:20px;font-weight:700;color:#111827;">
                Konfirmasi Langganan Newsletter
              </h2>
              <p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.6;">
                Terima kasih sudah mendaftar newsletter PenaSakti! Anda akan mendapatkan
                ringkasan berita terpenting langsung di inbox setiap hari.
              </p>
              <p style="margin:0 0 28px;font-size:15px;color:#374151;line-height:1.6;">
                Klik tombol di bawah untuk mengkonfirmasi alamat email Anda:
              </p>

              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <a href="${verifyUrl}"
                       style="display:inline-block;background:#dc2626;color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;padding:14px 36px;border-radius:10px;letter-spacing:0.3px;">
                      ✅ Konfirmasi Email Saya
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:28px 0 0;font-size:13px;color:#6b7280;text-align:center;">
                Tautan berlaku selama <strong>24 jam</strong>. Jika tidak bisa klik, copy tautan berikut:<br/>
                <a href="${verifyUrl}" style="color:#2563eb;word-break:break-all;font-size:12px;">${verifyUrl}</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px 28px;border-top:1px solid #f3f4f6;">
              <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center;line-height:1.6;">
                Anda mendapat email ini karena mendaftar di penasakti.com.<br/>
                Tidak ingin berlangganan?
                <a href="${unsubUrl}" style="color:#6b7280;">Batalkan langganan</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim(),
  });
}

// ─────────────────────────────────────────────────────────────
// Kirim email selamat datang setelah verifikasi berhasil
// ─────────────────────────────────────────────────────────────
export async function sendNewsletterWelcome(email: string): Promise<void> {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://penasakti.com";

  await getTransporter().sendMail({
    from: FROM,
    to: email,
    subject: "🎉 Selamat Datang di Newsletter PenaSakti!",
    text: `
Halo!

Selamat! Email Anda sudah dikonfirmasi.

Anda sekarang berlangganan newsletter PenaSakti dan akan mendapatkan:
- Ringkasan berita terpenting setiap hari
- Breaking news eksklusif
- Analisis mendalam dari jurnalis kami

Baca berita terbaru: ${baseUrl}

—
Tim PenaSakti
penasakti.com
    `.trim(),
    html: `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <title>Selamat Datang - PenaSakti Newsletter</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
          <tr>
            <td style="background:linear-gradient(135deg,#1d4ed8 0%,#dc2626 100%);padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:800;">📰 PenaSakti</h1>
              <p style="margin:6px 0 0;color:rgba(255,255,255,0.8);font-size:13px;">Portal Berita Nasional Terpercaya</p>
            </td>
          </tr>
          <tr>
            <td style="padding:36px 40px 28px;">
              <h2 style="margin:0 0 12px;font-size:20px;font-weight:700;color:#111827;">🎉 Selamat Datang!</h2>
              <p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.6;">
                Email Anda berhasil dikonfirmasi. Mulai sekarang Anda akan mendapatkan:
              </p>
              <ul style="margin:0 0 24px;padding-left:20px;font-size:15px;color:#374151;line-height:2;">
                <li>📰 Ringkasan berita terpenting setiap hari</li>
                <li>🔴 Breaking news eksklusif</li>
                <li>📊 Analisis mendalam dari jurnalis kami</li>
              </ul>
              <table cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <a href="${baseUrl}" style="display:inline-block;background:#1d4ed8;color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;padding:14px 36px;border-radius:10px;">
                      Baca Berita Terbaru →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 40px 28px;border-top:1px solid #f3f4f6;">
              <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center;">
                © 2026 PenaSakti. Semua hak dilindungi.<br/>
                <a href="${baseUrl}" style="color:#6b7280;">penasakti.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim(),
  });
}
