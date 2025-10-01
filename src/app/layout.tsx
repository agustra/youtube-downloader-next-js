import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "YouTube Downloader - Download Video & Audio Berkualitas Tinggi",
  description:
    "Download video dan audio dari YouTube dengan mudah. Pilih kualitas MP4 (144p-1080p) atau MP3 (64K-320K). Batch download tersedia. Fast, free, dan user-friendly.",
  keywords:
    "youtube downloader, download video youtube, mp3 converter, mp4 downloader, batch download",
  authors: [{ name: "YouTube Downloader Team" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
