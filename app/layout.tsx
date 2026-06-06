import type { Metadata } from "next";
import { Cormorant_Garamond, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
});

const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000"),
);

const title = "Tarttoria | Trattoria Cafe w Nowym Sączu";
const description =
  "Tarttoria / Trattoria Cafe w Nowym Sączu przy ul. Wazów 8: włoska pizza, makarony, desery, kawa, koktajle i kameralna atmosfera blisko rynku.";
const socialImage = {
  url: "/logo.png",
  width: 1291,
  height: 624,
  alt: "Logo Tarttoria",
  type: "image/png",
};

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title,
  description,
  openGraph: {
    title,
    description,
    url: "/",
    siteName: "Tarttoria",
    locale: "pl_PL",
    type: "website",
    images: [socialImage],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [socialImage],
  },
  icons: {
    icon: [
      { url: "/icon.png?v=tarttoria-logo-2", type: "image/png", sizes: "512x512" },
      { url: "/favicon.ico?v=tarttoria-logo-2", sizes: "any" },
    ],
    shortcut: "/favicon.ico?v=tarttoria-logo-2",
    apple: "/icon.png?v=tarttoria-logo-2",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pl"
      className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
