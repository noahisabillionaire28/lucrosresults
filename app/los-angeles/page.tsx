import type { Metadata } from "next";
import { SectionHeading } from "@/components/SectionHeading";
import { SectionWrapper } from "@/components/SectionWrapper";
import { Reveal } from "@/components/Reveal";
import { Card } from "@/components/Card";
import { ExploreLinks } from "@/components/ExploreLinks";
import { AdvantageSection, BookCallCTA, FAQSection, ProcessSection } from "@/components/sections";

export const metadata: Metadata = {
  title: "Marketing Agency Los Angeles | Rank in Google's Top 3 | Lucros Results",
  description: "Los Angeles marketing agency helping local businesses rank in Google's top 3 and generate more leads.",
  alternates: { canonical: "/los-angeles" },
};

const blocks = [
  { h: "Google Business Profile Optimization", p: ["Your Google Business Profile is the first thing a nearby customer sees. We tune every part of it so Google knows exactly what you do and where you do it.", "A complete, active profile earns the trust that moves you up the map."] },
  { h: "Local SEO", p: ["Local SEO is how Los Angeles customers find you instead of the shop down the street. We build the signals Google looks for when it decides who shows up first.", "Rankings keep working after we're done, month after month."] },
  { h: "Lead Generation for Local Businesses", p: ["Rankings only matter if they turn into calls and bookings. We make sure every click has an easy way to reach you.", "More visibility, more calls, more clients."] },
];

export default function LosAngelesPage() {
  return (
    <>
      <section className="mx-auto w-full max-w-[1200px] px-6 pb-6 pt-10 md:px-10 lg:px-16 md:pt-16">
        <h1 className="text-[44px] leading-[1.02] tracking-[-0.06em] text-black md:text-[70px]">Marketing Agency Los Angeles</h1>
        <div className="mt-6 max-w-[640px] space-y-2 text-[16px] leading-relaxed text-body">
          <p>We help local businesses across Los Angeles rank in Google's top 3 Maps results.</p>
          <p>Guaranteed in 90 days, or you get a full refund.</p>
        </div>
      </section>

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
