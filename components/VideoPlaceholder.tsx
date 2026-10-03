"use client";
import Image from "next/image";
import { useState } from "react";
import { siteConfig } from "@/site.config";

type Props = {
  embedUrl?: string;
  className?: string;
  /** Play button + progress bar color. Default red; /losangeles uses blue. */
  accent?: string;
  /** Headline over the thumbnail. */
  label?: string;
  /** Show the label in capitals (reference style on /losangeles). */
  upper?: boolean;
  duration?: string;
  /** 16:9 thumbnail image path (in /public). Falls back to site.config `videoThumbnail`. */
  thumbnail?: string;
};

/**
 * Video thumbnail: big bold white italic label at the top, rounded-square play button in the center, slim
 * progress bar + timestamp along the bottom.
 * TODO: set `videos.*` (Wistia / YouTube embed URL) and the thumbnails in site.config.ts.
 * Until an embed URL is set, clicking does nothing.
 */
export function VideoPlaceholder({ embedUrl = "", className = "", accent = "#E5322D", label = "Click To Watch", upper = false, duration = siteConfig.videoDuration, thumbnail = siteConfig.videoThumbnail }: Props) {
  const [playing, setPlaying] = useState(false);
  return (
    <div className={`relative aspect-video w-full overflow-hidden rounded-xl bg-[#141414] md:rounded-2xl ${className}`}>
      {playing && embedUrl ? (
        <iframe src={`${embedUrl}${embedUrl.includes("?") ? "&" : "?"}autoplay=1`} title="Video" allow="autoplay; fullscreen" allowFullScreen className="absolute inset-0 h-full w-full border-0" />
      ) : (
        <button type="button" onClick={() => embedUrl && setPlaying(true)} aria-label="Play video" className="absolute inset-0">
          {thumbnail && <Image src={thumbnail} alt="" fill sizes="(min-width:1100px) 520px, 100vw" className="object-cover" />}
          <span className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/10 to-black/55" />
          <span className={`absolute inset-x-0 top-[9%] text-center text-[26px] font-bold italic leading-none tracking-[-0.03em] text-white md:text-[34px] ${upper ? "uppercase" : ""}`}>{label}</span>
          <span style={{ background: accent }} className="absolute left-1/2 top-1/2 flex h-[52px] w-[74px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[16px] md:h-[60px] md:w-[86px]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
          </span>
          <span className="absolute bottom-3 right-3 rounded bg-black/70 px-1.5 py-0.5 text-[13px] leading-none text-white">{duration}</span>
          <span className="absolute inset-x-0 bottom-0 h-1 bg-white/30">
            <span style={{ background: accent }} className="block h-full w-[22%]" />
          </span>
        </button>
      )}
    </div>
  );
}
