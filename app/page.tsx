import type { Metadata } from "next";
import { Card } from "@/components/Card";
import { Chip } from "@/components/Chip";
import { EmailCaptureForm } from "@/components/EmailCaptureForm";
import { GiftIcon, UsersIcon } from "@/components/icons";
import { HomeHero } from "@/components/HomeHero";
import { LogoMark } from "@/components/Logo";
import { LogoMarquee } from "@/components/LogoMarquee";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { SectionWrapper } from "@/components/SectionWrapper";
import { siteConfig } from "@/site.config";
import Image from "next/image";

export const metadata: Metadata = {
  title: "BEST Marketing Bureau Los Angeles - Lucros Results | Local SEO, Google Rankings & Lead Generation for Local Businesses Near Me",
  description: "Lucros Results helps companies like yours rank higher and get more clients using Google Ads and Meta Ads. Los Angeles marketing bureau.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <HomeHero />

      <SectionWrapper className="py-6 md:py-10">
        <p className="mb-8 text-center text-[18px] text-body">Working with…</p>
        <LogoMarquee />
      </SectionWrapper>

      <SectionWrapper reveal={false}>
        <div className="mb-10 flex flex-col items-start gap-5 md:mb-14">
          <Reveal><Chip icon={<UsersIcon />}>Our team</Chip></Reveal>
          <SectionHeading>Meet the Team</SectionHeading>
        </div>
        <Reveal>
          <div className="relative flex aspect-[4/5] w-full items-end overflow-hidden rounded-card bg-card md:aspect-[16/9]">
            {siteConfig.founderPhoto ? (
              <Image src={siteConfig.founderPhoto} alt={siteConfig.founder} fill sizes="(min-width:1200px) 1200px, 100vw" className="object-cover" />
            ) : (
              /* TODO: set founderPhoto in site.config.ts (file in /public) */
              <div className="absolute inset-0 flex items-center justify-center bg-chip text-[18px] text-body">Photo placeholder</div>
            )}
            <div className="relative m-4 rounded-2xl bg-white px-5 py-4 md:m-6">
              <p className="text-[20px] tracking-[-0.04em] text-black">{siteConfig.founder}</p>
              <p className="text-[16px] text-body">{siteConfig.founderRole}</p>
            </div>
          </div>
        </Reveal>
      </SectionWrapper>

      <SectionWrapper>
        <Card className="flex flex-col items-start gap-5 py-12 md:py-20">
          <LogoMark className="h-14 w-14" />
          <Chip icon={<GiftIcon />}>Free stuff</Chip>
          <SectionHeading>3 Tips to Get *Found First* on Google</SectionHeading>
          <div className="text-[16px] leading-relaxed text-body">
            <p>A free short video showing the first three fixes we make for every client.</p>
            <p>Works for any local business.</p>
            <p>Enter your email for instant access.</p>
          </div>
          <EmailCaptureForm buttonLabel="Get My 3 FREE Tips" className="max-w-[620px]" />
        </Card>
      </SectionWrapper>
    </>
  );
}
