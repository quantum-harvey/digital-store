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

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://digital-store-xi-wheat.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Digital Supply BK — Premium digital products, instant download",
  description:
    "Production-ready digital products you can buy and download in seconds. Secure Stripe checkout, instant delivery to your inbox.",
  keywords: [
    "digital products",
    "Next.js template",
    "SaaS starter kit",
    "instant download",
    "Digital Supply BK",
  ],
  openGraph: {
    title: "Digital Supply BK — Premium digital products, instant download",
    description:
      "Production-ready digital products you can buy and download in seconds. Secure Stripe checkout, instant delivery.",
    url: SITE_URL,
    siteName: "Digital Supply BK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Digital Supply BK — Premium digital products, instant download",
    description:
      "Production-ready digital products you can buy and download in seconds. Secure Stripe checkout, instant delivery.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
