"use client";
import { motion } from "framer-motion";
import { siteConfig } from "@/site.config";
import { EmailCaptureForm } from "./EmailCaptureForm";
import { VideoPlaceholder } from "./VideoPlaceholder";

/**
 * Homepage hero: whole group springs in (opacity 0→1, y 170→0). Desktop (lg+) values are measured from the
 * reference at a 1200px container: 476px text column, 93px gap, ~503x282 video, content width 1072.
 * Mobile values follow the mobile spec literally.
 */
export function HomeHero() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 170 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 121, damping: 27, mass: 0.3, delay: 0.1 }}
      className="mx-auto grid w-full max-w-[1200px] items-center gap-10 px-6 pb-0 pt-12 md:px-10 md:pt-16 lg:grid-cols-[476px_1fr] lg:gap-x-[93px] lg:px-16 lg:pt-[95px]"
    >
      <div className="flex flex-col items-start">
        <h1 className="text-[34px] leading-[1.1] tracking-[-0.03em] text-black md:text-[44px] md:leading-[1.1] lg:text-[50px] lg:leading-[58.3px] lg:tracking-[-0.076em]">Is Your Business Invisible on Google?</h1>
        <p className="mt-5 text-[17px] leading-[1.5] tracking-[-0.03em] text-body md:text-[20px] lg:mt-[31px] lg:text-[24px] lg:leading-[36px] lg:tracking-[-0.053em]">Watch this short video to learn why you're not ranking in the top 3.</p>
        <p className="mt-4 text-[17px] font-semibold leading-[1.5] tracking-[-0.035em] text-black md:text-[20px] lg:mt-6 lg:text-[24px] lg:leading-[36px] lg:tracking-[-0.047em]">Sign up below to get three FREE tips you can implement today to start climbing ⬇️</p>
        <EmailCaptureForm buttonLabel="Subscribe" variant="rect" className="mt-7 lg:mt-[50px]" />
      </div>
      <VideoPlaceholder embedUrl={siteConfig.videos.home} />
    </motion.section>
  );
}
