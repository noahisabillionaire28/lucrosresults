import type { Metadata } from "next";
import { ApplicationForm } from "@/components/ApplicationForm";
import { BeforeAfter } from "@/components/BeforeAfter";
import { Card } from "@/components/Card";
import { Chip } from "@/components/Chip";
import { BoltIcon, PinIcon, ShieldIcon } from "@/components/icons";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { SectionWrapper } from "@/components/SectionWrapper";
import { StatPill } from "@/components/StatPill";
import { VideoPlaceholder } from "@/components/VideoPlaceholder";
import { AdvantageSection, BookCallCTA, FAQSection, ProcessSection } from "@/components/sections";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = {
  title: "Rank in Google's Top 3 | Lucros Results Los Angeles",
  description: "We get local businesses into Google's top 3 Maps results in 90 days — guaranteed. Book a free strategy call.",
  alternates: { canonical: "/google" },
};

export default function GooglePage() {
  return (
    <>
      <section className="mx-auto flex w-full max-w-[1200px] flex-col items-center gap-8 px-4 pb-10 pt-10 text-center md:px-6 md:pt-16">
        <span className="inline-flex items-center gap-2 rounded-full bg-chip px-4 py-2 text-[16px] text-black/70">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#22A559] opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#22A559]" />
          </span>
          Los Angeles, CA
        </span>
        <h1 className="max-w-[1000px] text-[44px] leading-[1.02] tracking-[-0.06em] text-black md:text-[72px]">
          <span className="font-normal text-black/50">The </span>
          <span className="font-semibold">ONLY Two Things</span>
          <span className="font-normal text-black/50"> Standing Between You and </span>
          <span className="font-semibold">Google's Top 3</span>
        </h1>
        <VideoPlaceholder embedUrl={siteConfig.videos.google} />
        <div className="grid w-full gap-4 rounded-card bg-white p-6 md:grid-cols-3 md:place-items-center md:p-8">
          <StatPill icon={<PinIcon />}>Local Businesses Only</StatPill>
          <StatPill icon={<ShieldIcon />}>90-Day Guarantee</StatPill>
          <StatPill icon={<BoltIcon />}>Lightning Fast Results</StatPill>
        </div>
      </section>

      <AdvantageSection />

      <SectionWrapper reveal={false}>
        <div className="mb-10 flex flex-col items-start gap-5 md:mb-14">
          <Reveal><Chip>The Proof</Chip></Reveal>
          <SectionHeading>The *Difference*</SectionHeading>
        </div>
        <Reveal><Card><BeforeAfter /></Card></Reveal>
      </SectionWrapper>

      <ProcessSection />
      <FAQSection />
      <BookCallCTA embed />

      <SectionWrapper id="apply" reveal={false}>
        <div className="mb-10 flex flex-col items-start gap-5 md:mb-14">
          <Reveal><Chip>Apply Now</Chip></Reveal>
          <SectionHeading>Or Send In Your Application</SectionHeading>
        </div>
        <Reveal><Card><ApplicationForm /></Card></Reveal>
      </SectionWrapper>
    </>
  );
}
