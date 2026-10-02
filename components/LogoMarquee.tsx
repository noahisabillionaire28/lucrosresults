"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { ClientLogo } from "@/lib/clientLogos";

const PX_PER_SECOND = 25;

/**
 * One row: gray "Working with..." label (above the logos on mobile), logos scrolling left forever, seamless, never pauses.
 * Every logo renders at the same height (24px mobile / 32px desktop). Grayscale at 40% opacity.
 * Clients without a logo file show their name as gray text (see site.config.ts `clients`).
 */
export function LogoMarquee({ logos }: { logos: ClientLogo[] }) {
  const groupRef = useRef<HTMLUListElement>(null);
  const [duration, setDuration] = useState(30);

  useEffect(() => {
    const el = groupRef.current;
    if (!el) return;
    const measure = () => setDuration(el.scrollWidth / PX_PER_SECOND);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Each half of the track holds the list twice so it is always wider than the visible strip (seamless loop).
  const group = (ref?: React.Ref<HTMLUListElement>, hidden = false) => (
    <ul ref={ref} aria-hidden={hidden} className="flex shrink-0 items-center gap-9 pr-9 md:gap-[110px] md:pr-[110px]">
      {[0, 1].flatMap((copy) =>
        logos.map((l) => (
          <li key={`${copy}-${l.name}`} aria-hidden={copy === 1 || undefined} className="flex h-6 shrink-0 items-center opacity-40 grayscale md:h-8">
            {l.src ? (
              <Image src={l.src} alt={l.name} width={l.width!} height={l.height!} sizes="160px" className="h-6 w-auto max-w-none md:h-8" />
            ) : (
              <span className="whitespace-nowrap text-[17px] font-medium leading-none tracking-[-0.02em] text-black md:text-[22px]">{l.name}</span>
            )}
          </li>
        )),
      )}
    </ul>
  );

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-8" role="region" aria-label="Client logos">
      <p className="shrink-0 text-[14px] leading-tight text-body md:text-[18px]">Working with...</p>
      <div className="min-w-0 flex-1 overflow-hidden">
        <div className="marquee-track flex w-max" style={{ animationDuration: `${duration}s` }}>
          {group(groupRef)}
          {group(undefined, true)}
        </div>
      </div>
    </div>
  );
}
