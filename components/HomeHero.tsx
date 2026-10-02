"use client";
import { motion } from "framer-motion";
import { siteConfig } from "@/site.config";
import { EmailCaptureForm } from "./EmailCaptureForm";
import { VideoPlaceholder } from "./VideoPlaceholder";

/** Homepage hero: whole group springs in (opacity 0→1, y 170→0). Two columns on desktop; stacked on mobile. */
export function HomeHero() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 170 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 121, damping: 27, mass: 0.3, delay: 0.1 }}
      className="mx-auto grid w-full max-w-[1100px] items-center gap-10 px-4 pb-10 pt-10 md:px-6 md:pb-14 md:pt-16 lg:grid-cols-[1.2fr_1fr]"
    >
      <div className="flex flex-col items-start gap-5 md:gap-6">
        <h1 className="text-[44px] leading-[1.05] tracking-[-0.04em] text-black md:text-[56px] lg:text-[clamp(48px,4.8vw,62px)]">Is Your Business Invisible on Google?</h1>
        <p className="text-[22px] leading-[1.15] tracking-[-0.03em] text-body md:text-[28px] lg:text-[32px]">Watch this short video to learn why you're not ranking in the top 3.</p>
        <p className="text-[22px] font-semibold leading-[1.15] tracking-[-0.03em] text-black md:text-[28px] lg:text-[32px]">Sign up below to get three FREE tips you can implement today to start climbing ⬇️</p>
        <EmailCaptureForm buttonLabel="Subscribe" variant="rect" />
      </div>
      <VideoPlaceholder embedUrl={siteConfig.videos.home} />
    </motion.section>
  );
}
