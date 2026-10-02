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
      className="mx-auto grid w-full max-w-[1100px] items-center gap-8 px-5 pb-8 pt-12 md:px-6 md:pt-16 lg:grid-cols-[1.2fr_1fr] lg:gap-14 lg:pb-10 lg:pt-[120px]"
    >
      <div className="flex flex-col items-start">
        <h1 className="text-[38px] leading-[1.1] tracking-[-0.03em] text-black md:text-[48px] md:leading-[1.08] md:tracking-[-0.035em] lg:text-[54px]">Is Your Business Invisible on Google?</h1>
        <p className="mt-5 max-w-[480px] text-[18px] leading-[1.45] tracking-[-0.02em] text-body md:mt-7 md:text-[22px] md:leading-[1.4]">Watch this short video to learn why you're not ranking in the top 3.</p>
        <p className="mt-4 max-w-[480px] text-[18px] font-semibold leading-[1.45] tracking-[-0.02em] text-black md:mt-6 md:text-[22px] md:leading-[1.35]">Sign up below to get three FREE tips you can implement today to start climbing ⬇️</p>
        <EmailCaptureForm buttonLabel="Subscribe" variant="rect" className="mt-6 md:mt-8" />
      </div>
      <VideoPlaceholder embedUrl={siteConfig.videos.home} />
    </motion.section>
  );
}
