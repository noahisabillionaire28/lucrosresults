"use client";
import { useState } from "react";

/**
 * Dark rounded box with "Click To Watch" + red play button.
 * TODO: pass `embedUrl` (Wistia / YouTube embed URL, e.g. https://www.youtube.com/embed/VIDEO_ID)
 * — set in site.config.ts `videos`. Until then clicking does nothing.
 */
export function VideoPlaceholder({ embedUrl = "", className = "" }: { embedUrl?: string; className?: string }) {
  const [playing, setPlaying] = useState(false);
  return (
    <div className={`relative aspect-video w-full overflow-hidden rounded-card bg-[#141414] ${className}`}>
      {playing && embedUrl ? (
        <iframe src={`${embedUrl}${embedUrl.includes("?") ? "&" : "?"}autoplay=1`} title="Video" allow="autoplay; fullscreen" allowFullScreen className="absolute inset-0 h-full w-full border-0" />
      ) : (
        <button type="button" onClick={() => embedUrl && setPlaying(true)} aria-label="Play video" className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          <span className="font-serif text-[22px] italic text-white md:text-[28px]">Click To Watch</span>
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#E5322D] md:h-[72px] md:w-[72px]">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
          </span>
        </button>
      )}
    </div>
  );
}
