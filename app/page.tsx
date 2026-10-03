import type { Metadata } from "next";
import { Chip } from "@/components/Chip";
import { ExploreLinks } from "@/components/ExploreLinks";
import { UsersIcon } from "@/components/icons";
import { HomeHero } from "@/components/HomeHero";
import { NapBlock } from "@/components/NapBlock";
import { LogoStrip } from "@/components/LogoStrip";
import { Reveal } from "@/components/Reveal";
import { TipsCard } from "@/components/TipsCard";
import { SectionHeading } from "@/components/SectionHeading";
import { SectionWrapper } from "@/components/SectionWrapper";
import { siteConfig } from "@/site.config";
import Image from "next/image";

export const metadata: Metadata = {
  title: "BEST Marketing Agency Los Angeles - Lucros Results | Local SEO, Google Rankings & Lead Generation for Local Businesses Near Me",
  description: "Lucros Results helps companies like yours rank higher and get more clients using Google Ads and Meta Ads. Los Angeles marketing agency.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <HomeHero />

      <SectionWrapper className="pt-16 md:pt-16 lg:pt-[110px]">
        <LogoStrip />
      </SectionWrapper>

      <SectionWrapper reveal={false}>
        <div className="mb-10 flex flex-col items-start gap-5 md:mb-14">
          <Reveal><Chip icon={<UsersIcon />}>Our founder</Chip></Reveal>
          <SectionHeading>Meet the Founder</SectionHeading>
        </div>
        <Reveal>
          {/* Photo keeps its natural 5:4 shape (no crop/zoom). Desktop: photo left, name block right. Mobile: stacked. */}
          <div className="grid gap-3 rounded-2xl bg-card p-3 md:grid-cols-[1.2fr_1fr] md:gap-4 md:rounded-card md:p-4">
            <div className="relative aspect-[5/4] w-full overflow-hidden rounded-xl bg-chip md:rounded-[18px]">
              <svg width="0" height="0" className="absolute" aria-hidden focusable="false">
                <filter id="founder-lift" colorInterpolationFilters="sRGB">
                  <feComponentTransfer>
                    <feFuncR type="gamma" amplitude="1" exponent="0.72" offset="0" />
                    <feFuncG type="gamma" amplitude="1" exponent="0.72" offset="0" />
                    <feFuncB type="gamma" amplitude="1" exponent="0.72" offset="0" />
                  </feComponentTransfer>
                </filter>
              </svg>
              {siteConfig.founderPhoto ? (
                /* Backlit photo: the gamma curve above lifts the shaded face without washing out the bright windows.
                   Lower the exponent for a stronger lift. */
                <Image
                  src={siteConfig.founderPhoto}
                  alt={siteConfig.founderPhotoAlt}
                  fill
                  sizes="(min-width:1100px) 600px, (min-width:768px) 52vw, 100vw"
                  quality={85}
                  className="object-cover [filter:url(#founder-lift)]"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-[18px] text-body">Photo placeholder</div>
              )}
            </div>
            <div className="flex flex-col justify-end gap-3 p-4 md:p-8">
              <p className="text-[36px] leading-none tracking-[-0.06em] text-black md:text-[48px]">{siteConfig.founder}</p>
              <p className="text-[18px] text-body">{siteConfig.founderRole}, {siteConfig.name}</p>
              <p className="max-w-[360px] text-[16px] leading-[1.5] text-body md:text-[18px]">{siteConfig.tagline}</p>
            </div>
          </div>
        </Reveal>
      </SectionWrapper>

      <NapBlock />
      <ExploreLinks />

      <TipsCard />
    </>
  );
}
