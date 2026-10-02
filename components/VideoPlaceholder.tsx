"use client";
import Image from "next/image";
import { useState } from "react";
import { siteConfig } from "@/site.config";

/**
 * Video thumbnail: big bold white italic "Click To Watch" at the top, red rounded-square play button in the
 * center, slim red progress bar + timestamp along the bottom.
 * TODO: set `videos.*` (Wistia / YouTube embed URL) and `videoThumbnail` (16:9 image in /public) in site.config.ts.
 * Until an embed URL is set, clicking does nothing.
 */
export function VideoPlaceholder({ embedUrl = "", className = "" }: { embedUrl?: string; className?: string }) {
  const [playing, setPlaying] = useState(false);
  return (
    <div className={`relative aspect-video w-full overflow-hidden rounded-xl bg-[#141414] md:rounded-2xl ${className}`}>
      {playing && embedUrl ? (
        <iframe src={`${embedUrl}${embedUrl.includes("?") ? "&" : "?"}autoplay=1`} title="Video" allow="autoplay; fullscreen" allowFullScreen className="absolute inset-0 h-full w-full border-0" />
      ) : (
        <button type="button" onClick={() => embedUrl && setPlaying(true)} aria-label="Play video" className="absolute inset-0">
          {siteConfig.videoThumbnail && (
            <Image src={siteConfig.videoThumbnail} alt="" fill sizes="(min-width:1100px) 520px, 100vw" className="object-cover" />
          )}
          <span className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/10 to-black/55" />
          <span className="absolute inset-x-0 top-[9%] text-center text-[26px] font-bold italic leading-none tracking-[-0.03em] text-white md:text-[34px]">Click To Watch</span>
          <span className="absolute left-1/2 top-1/2 flex h-[52px] w-[74px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[16px] bg-[#E5322D] md:h-[60px] md:w-[86px]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
          </span>
          <span className="absolute bottom-3 right-3 rounded bg-black/70 px-1.5 py-0.5 text-[13px] leading-none text-white">{siteConfig.videoDuration}</span>
          <span className="absolute inset-x-0 bottom-0 h-1 bg-white/30">
            <span className="block h-full w-[22%] bg-[#E5322D]" />
          </span>
        </button>
      )}
    </div>
  );
}
