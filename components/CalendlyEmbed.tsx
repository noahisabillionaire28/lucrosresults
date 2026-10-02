"use client";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { useCallback, useEffect, useRef } from "react";
import { siteConfig } from "@/site.config";

type CalendlyGlobal = { initInlineWidget: (o: { url: string; parentElement: HTMLElement }) => void };

// Colors match the cream card (#F5EFE9) and black buttons. Hex without "#", per Calendly's embed options.
const embedUrl = `${siteConfig.calendarLink}?hide_gdpr_banner=1&background_color=f5efe9&text_color=000000&primary_color=000000`;

/**
 * Inline Calendly widget. Calendly's script is loaded here (lazily), so it only ever loads on pages that render this.
 * When Calendly posts "calendly.event_scheduled" we send the visitor to /booked.
 */
export function CalendlyEmbed() {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const init = useCallback(() => {
    const cal = (window as unknown as { Calendly?: CalendlyGlobal }).Calendly;
    if (!cal || !ref.current) return;
    ref.current.innerHTML = ""; // avoid a double widget on remount / client-side navigation
    cal.initInlineWidget({ url: embedUrl, parentElement: ref.current });
  }, []);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== "https://calendly.com") return; // ignore anything not from Calendly
      if (e.data?.event === "calendly.event_scheduled") router.push("/booked");
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [router]);

  return (
    <div className="-mx-3 md:mx-0">
      <div className="relative h-[820px] overflow-hidden rounded-[24px] bg-card md:h-[700px]">
        <p className="absolute inset-0 flex items-center justify-center text-[16px] text-body">Loading calendar…</p>
        {/* Calendly mounts its iframe here (min-width 320px is Calendly's own floor). */}
        <div ref={ref} className="calendly-inline-widget relative h-full w-full min-w-[320px]" />
      </div>
      <Script src="https://assets.calendly.com/assets/external/widget.js" strategy="lazyOnload" onReady={init} />
      <noscript>
        <a href={siteConfig.calendarLink}>Book a call</a>
      </noscript>
    </div>
  );
}
