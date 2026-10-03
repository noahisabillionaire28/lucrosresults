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
  // Black tile + white mark. The "-v2" file names (and ?v=2 on the manifest) bust browser caches, which hold on to
  // favicons very hard. Bump the suffix again whenever the icon changes. favicon-v2.ico holds 16/32/48; the 192px PNG
  // is a multiple of 48 (Google's favicon guidance).
  icons: {
    icon: [
      { url: "/favicon-v2.ico", sizes: "any" },
      { url: "/icon-v2.png", sizes: "32x32", type: "image/png" },
      { url: "/android-chrome-192x192-v2.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512-v2.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon-v2.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest?v=2",
};
export const viewport: Viewport = { themeColor: "#EFEBE5" };

// ProfessionalService (LocalBusiness subtype) schema. NAP comes from site.config.ts (city-level address only: service-area business).
const jsonLd: Record<string, unknown> = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${siteConfig.url}/#business`,
  name: siteConfig.name,
  description: "Lucros Results is a local marketing agency in Los Angeles. We help local businesses reach the top 3 on Google Maps in 90 days with Google Business Profile optimization, local SEO, Google Ads, Meta Ads and lead generation.",
  url: `${siteConfig.url}/`,
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
