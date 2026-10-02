import type { Metadata } from "next";
import { SectionWrapper } from "@/components/SectionWrapper";
import { VideoPlaceholder } from "@/components/VideoPlaceholder";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = { title: "Booked | Lucros Results", description: "Your strategy call with Lucros Results is booked.", robots: { index: false, follow: false } };

export default function Booked() {
  return (
    <>
      <section className="mx-auto w-full max-w-[1100px] px-4 pb-6 pt-10 text-center md:px-6 md:pt-20">
        <h1 className="text-[44px] leading-[1.02] tracking-[-0.06em] text-black md:text-[72px]">Thanks for Booking!</h1>
        <p className="mt-5 text-[18px] text-body">Watch this quick 60-second video before our call.</p>
      </section>
      <SectionWrapper>
        <VideoPlaceholder embedUrl={siteConfig.videos.booked} />
      </SectionWrapper>
    </>
  );
}
