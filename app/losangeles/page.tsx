import { siteConfig } from "@/site.config";
import type { Metadata } from "next";
import { SectionHeading } from "@/components/SectionHeading";
import { SectionWrapper } from "@/components/SectionWrapper";
import { Reveal } from "@/components/Reveal";
import { Card } from "@/components/Card";
import { LAHero } from "@/components/LAHero";
import { ExploreLinks } from "@/components/ExploreLinks";
import { AdvantageSection, BookCallCTA, FAQSection, ProcessSection } from "@/components/sections";

const title = "BEST Marketing Agency Los Angeles | Lucros Results";
const description = "Lucros Results helps companies like yours rank higher and get more clients using Google Ads and Meta Ads.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/losangeles" },
  // Page-level openGraph replaces the layout's, so it is spelled out in full. og-image-v2.png is 1200x630 (logo on cream).
  openGraph: {
    title,
    description,
    url: "/losangeles",
    siteName: siteConfig.name,
    type: "website",
    locale: "en_US",
    images: [{ url: "/og-image-v2.png", width: 1200, height: 630, alt: "Lucros Results" }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/og-image-v2.png"] },
};

const blocks = [
  { h: "Google Business Profile Optimization", p: ["Your Google Business Profile is the first thing a nearby customer sees. We tune every part of it so Google knows exactly what you do and where you do it.", "A complete, active profile earns the trust that moves you up the map."] },
  { h: "Local SEO", p: ["Local SEO is how Los Angeles customers find you instead of the shop down the street. We build the signals Google looks for when it decides who shows up first.", "Rankings keep working after we're done, month after month."] },
  { h: "Lead Generation for Local Businesses", p: ["Rankings only matter if they turn into calls and bookings. We make sure every click has an easy way to reach you.", "More visibility, more calls, more clients."] },
];

export default function LosAngelesPage() {
  return (
    <>
      <LAHero />

      <SectionWrapper reveal={false}>
        <div className="flex flex-col gap-4">
          {blocks.map((b, i) => (
            <Reveal key={b.h} delay={i * 0.1}>
              <Card as="article">
                <SectionHeading as="h2" className="!text-[36px] md:!text-[48px]">{b.h}</SectionHeading>
                <div className="mt-5 max-w-[640px] space-y-3 text-[16px] leading-relaxed text-body">
                  {b.p.map((t) => <p key={t}>{t}</p>)}
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </SectionWrapper>

      <ExploreLinks />
      <AdvantageSection />
      <ProcessSection />
      <FAQSection />
      <BookCallCTA embed />
    </>
  );
}
