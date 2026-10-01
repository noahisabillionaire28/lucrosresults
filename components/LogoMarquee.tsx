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
    <div className="overflow-hidden" role="region" aria-label="Client logos">
      <div className="marquee-track flex w-max" style={{ animationDuration: `${duration}s` }}>
        {group(groupRef)}
        {group(undefined, true)}
      </div>
    </div>
  );
}
