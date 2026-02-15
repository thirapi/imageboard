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
    default: "62chan",
    template: "%s | 62chan",
  },
  description:
    "62chan (boards.slug.my.id) adalah forum papan gambar anonim (imageboard) Indonesia untuk berbagi ide, hobi, dan diskusi bebas. Tempat berkumpulnya komunitas popkultur, teknologi, otomotif, dan lainnya.",
  keywords: [
    "62chan",
    "imageboard Indonesia",
    "forum anonim",
    "4chan indonesia",
    "papan gambar",
    "diskusi bebas",
    "komunitas indonesia",
    "wibu indonesia",
    "teknologi",
    "otomotif",
  ],
  authors: [{ name: "62chan" }],
  generator: "62chan",
  robots: {
    index: true,
    follow: true,
    nosnippet: true,
    noarchive: true,
    noimageindex: true,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "https://boards.slug.my.id",
  ),
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://boards.slug.my.id",
    siteName: "62chan",
    title: "62chan",
    description:
      "Forum papan gambar anonim Indonesia untuk berbagi ide, hobi, dan diskusi bebas.",
  },
  twitter: {
    card: "summary_large_image",
    title: "62chan",
    description:
      "Forum papan gambar anonim Indonesia untuk berbagi ide, hobi, dan diskusi bebas.",
  },
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
