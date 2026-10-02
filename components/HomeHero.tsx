"use client";
import { motion } from "framer-motion";
import { accent } from "./SectionHeading";
import { EmailCaptureForm } from "./EmailCaptureForm";
import { VideoPlaceholder } from "./VideoPlaceholder";
import { siteConfig } from "@/site.config";

/** Homepage hero: whole group springs in (opacity 0→1, y 170→0). */
export function HomeHero() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 170 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 121, damping: 27, mass: 0.3, delay: 0.1 }}
      className="mx-auto flex w-full max-w-[1200px] flex-col items-start gap-6 px-4 pb-14 pt-10 md:px-6 md:pb-24 md:pt-16"
    >
      <h1 className="w-full self-center text-center text-[40px] leading-[1.05] tracking-[-0.06em] text-black">{accent("Is Your Business *Invisible* on Google?")}</h1>
      <VideoPlaceholder embedUrl={siteConfig.videos.home} className="md:w-[40%]" />
      <p className="max-w-[560px] text-[16px] leading-relaxed text-body">If you're not in Google's top results, the business down the street is getting your calls.</p>
      <p className="max-w-[560px] text-[16px] font-semibold leading-relaxed text-black">Enter your email and I'll send you a free video on how we fix that. ⬇️</p>
      <EmailCaptureForm buttonLabel="Subscribe" className="max-w-[560px]" />
    </motion.section>
  );
}
