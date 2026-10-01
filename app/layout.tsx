import type { Metadata, Viewport } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import { MotionConfig } from "framer-motion";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { isPlaceholder, siteConfig } from "@/site.config";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-inter", display: "swap" });
const serif = Source_Serif_4({ subsets: ["latin"], style: ["italic", "normal"], weight: ["400"], variable: "--font-serif", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: "Lucros Results | Local Marketing Bureau in Los Angeles",
  description: "Marketing for local businesses in Los Angeles. Top 3 on Google Maps in 90 days — guaranteed.",
  openGraph: { siteName: siteConfig.name, type: "website", locale: "en_US" },
};
export const viewport: Viewport = { themeColor: "#EFEBE5" };

// LocalBusiness schema. NAP comes from site.config.ts; unfilled placeholders are omitted so the schema stays valid.
const jsonLd: Record<string, unknown> = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: siteConfig.name,
  url: siteConfig.url,
  email: siteConfig.email,
  areaServed: siteConfig.areaServed,
  founder: { "@type": "Person", name: siteConfig.founder },
  ...(isPlaceholder(siteConfig.phone) ? {} : { telephone: siteConfig.phone }),
  ...(isPlaceholder(siteConfig.address) ? {} : { address: { "@type": "PostalAddress", streetAddress: siteConfig.address, addressLocality: "Los Angeles", addressRegion: "CA", addressCountry: "US" } }),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${serif.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <MotionConfig reducedMotion="user">
          <Nav />
          <main className="pt-[68px]">{children}</main>
          <Footer />
        </MotionConfig>
      </body>
    </html>
  );
}
