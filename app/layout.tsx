import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "62chan - Papan Gambar Anonim Indonesia",
    template: "%s | 62chan",
  },
  description:
    "62chan: Forum papan gambar (imageboard) anonim Indonesia tempat diskusi bebas mengenai berbagai topik mulai dari popkultur hingga teknologi.",
  applicationName: "62chan",
  authors: [{ name: "62chan", url: "https://62chan.qzz.io" }],
  generator: "62chan",
  robots: {
    index: true,
    follow: true,
  },
  keywords: [
    "62chan",
    "62 chan",
    "imageboard",
    "imageboard Indonesia",
    "papan gambar",
    "forum anonim",
    "forum indonesia",
    "4chan indonesia",
    "komunitas wibu",
    "diskusi bebas",
    "asf",
    "autismo sans frontieres",
    "papan anonim",
    "taman lawang",
    "indonesia imageboard",
  ],
  referrer: "origin-when-cross-origin",
  creator: "62chan Team",
  publisher: "62chan",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "https://62chan.qzz.io",
  ),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://62chan.qzz.io",
    siteName: "62chan",
    title: "62chan - Papan Gambar Anonim Indonesia",
    description:
      "62chan: Forum papan gambar (imageboard) anonim Indonesia tempat diskusi bebas mengenai berbagai topik mulai dari popkultur hingga teknologi.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "62chan - Papan Gambar Anonim Indonesia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "62chan - Papan Gambar Anonim Indonesia",
    description:
      "62chan: Forum papan gambar (imageboard) anonim Indonesia tempat diskusi bebas mengenai berbagai topik.",
    images: ["/opengraph-image"],
  },
  category: "technology",
  themeColor: "#f97316",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "62chan",
  alternateName: ["Enam Dua Chan", "62 chan"],
  url: "https://62chan.qzz.io",
};

import { ThemeProvider } from "@/components/theme-provider";
import { NavProvider } from "@/components/nav-provider";
import { BoardNav } from "@/components/board-nav";
import { AgeVerificationDialog } from "@/components/age-verification-dialog";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NavProvider>
            <BoardNav />
            {children}
            <Toaster />
            <Analytics />
            <AgeVerificationDialog />
          </NavProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
