import type { Metadata, Viewport } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import { MotionConfig } from "framer-motion";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { areas } from "@/lib/areas";
import { siteConfig } from "@/site.config";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-inter", display: "swap" }); // variable font: all weights
const serif = Source_Serif_4({ subsets: ["latin"], style: ["italic", "normal"], weight: ["400"], variable: "--font-serif", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: "Lucros Results | Local Marketing Agency in Los Angeles",
  description: "Marketing for local businesses in Los Angeles. Top 3 on Google Maps in 90 days — guaranteed.",
  openGraph: { siteName: siteConfig.name, type: "website", locale: "en_US" },
  // Black tile + orange mark. favicon.ico holds 16/32/48; the 192px PNG is a multiple of 48 (Google's favicon guidance).
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", sizes: "32x32", type: "image/png" },
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
};
export const viewport: Viewport = { themeColor: "#EFEBE5" };

// LocalBusiness schema. NAP comes from site.config.ts (city-level address only: service-area business).
const jsonLd: Record<string, unknown> = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: siteConfig.name,
  url: siteConfig.url,
  email: siteConfig.email,
  telephone: siteConfig.phoneSchema,
  logo: `${siteConfig.url}${siteConfig.logoPath}`,
  image: `${siteConfig.url}${siteConfig.logoPath}`,
  address: { "@type": "PostalAddress", addressLocality: siteConfig.addressLocality, addressRegion: siteConfig.addressRegion, addressCountry: siteConfig.addressCountry },
  areaServed: [siteConfig.areaServed, ...areas.map((a) => a.name)],
  founder: { "@type": "Person", name: siteConfig.founder },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${serif.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <MotionConfig reducedMotion="user">
          <Nav />
          <main className="pt-[77px] md:pt-[85px]">{children}</main>
          <Footer />
        </MotionConfig>
      </body>
    </html>
  );
}
