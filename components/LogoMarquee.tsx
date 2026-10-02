"use client";
import { useEffect, useRef, useState } from "react";

const PX_PER_SECOND = 25;
const GAP = 110;

// TODO: replace these text placeholders with real client logos (grayscale <img>/<svg>).
const logos = [
  { t: "LOGO ONE", c: "font-sans tracking-[0.2em]" },
  { t: "Logo Two", c: "font-serif italic" },
  { t: "LOGOTHREE", c: "font-sans font-semibold tracking-tight" },
  { t: "logo four.", c: "font-sans lowercase" },
  { t: "Logo Five", c: "font-serif" },
];

/** One row: gray "Working with..." label on the left, logos scrolling to its right (infinite, seamless, never pauses). */
export function LogoMarquee() {
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

  const group = (ref?: React.Ref<HTMLUListElement>, hidden = false) => (
    <ul ref={ref} aria-hidden={hidden} className="flex shrink-0 items-center" style={{ gap: GAP, paddingRight: GAP }}>
      {logos.map((l) => (
        <li key={l.t} className={`whitespace-nowrap text-[28px] text-black opacity-40 grayscale ${l.c}`}>{l.t}</li>
      ))}
    </ul>
  );

  return (
    <div className="flex items-center gap-5 md:gap-8" role="region" aria-label="Client logos">
      <p className="shrink-0 text-[16px] leading-tight text-body md:text-[18px]">Working with...</p>
      <div className="min-w-0 flex-1 overflow-hidden">
        <div className="marquee-track flex w-max" style={{ animationDuration: `${duration}s` }}>
          {group(groupRef)}
          {group(undefined, true)}
        </div>
      </div>
    </div>
  );
}
