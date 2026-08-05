/**
 * Google Search Console verification file
 * URL: /google7782a39e1fa29cb1.html
 */
import { NextResponse } from "next/server";

export async function GET() {
  return new NextResponse(
    "google-site-verification: google7782a39e1fa29cb1.html",
    {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    }
  );
}
