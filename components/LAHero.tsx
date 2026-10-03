import { Poppins } from "next/font/google";
import { headers } from "next/headers";
import { siteConfig } from "@/site.config";
import { BoltIcon } from "./icons";
import { BranchIcon, PersonIcon } from "./icons";
import { VideoPlaceholder } from "./VideoPlaceholder";

// Poppins is imported here only, so it loads only on pages that render this hero (/losangeles).
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500"], display: "swap" });

const FALLBACK_LOCATION = "Los Angeles, United States";
const BOT = /bot|crawl|spider|slurp|preview|facebookexternalhit|lighthouse|headless/i;

/**
 * Visitor's city + country from Vercel's geo headers (x-vercel-ip-city is URL-encoded; x-vercel-ip-country is an
 * ISO code). Missing/invalid headers, and crawlers, get the Los Angeles fallback so indexed HTML stays stable.
 * NOTE: reading headers makes this route render per request (dynamic) instead of being prerendered.
 */
function visitorLocation(): string {
  try {
    const h = headers();
    if (BOT.test(h.get("user-agent") ?? "")) return FALLBACK_LOCATION;
    const rawCity = h.get("x-vercel-ip-city");
    const code = h.get("x-vercel-ip-country");
    if (!rawCity || !code) return FALLBACK_LOCATION;
    const city = decodeURIComponent(rawCity).trim();
    const country = new Intl.DisplayNames(["en"], { type: "region" }).of(code.trim().toUpperCase());
    // Letters (any language), spaces, and . ' ’ - only: anything else means a bad/unknown value, so use the fallback.
    if (!/^[\p{L}\p{M}][\p{L}\p{M}\s.'’-]{0,59}$/u.test(city) || !country || country === code.toUpperCase()) return FALLBACK_LOCATION;
    return `${city}, ${country}`.slice(0, 80);
  } catch {
    return FALLBACK_LOCATION;
  }
}

const stats = [
  { icon: PersonIcon, text: "Local Businesses Only" },
  { icon: BranchIcon, text: "90-Day Guarantee" },
  { icon: BoltIcon, text: "Lightning Fast Results" },
];

/** /losangeles hero (two columns on desktop) followed by the 3-card stat strip. */
export function LAHero() {
  const location = visitorLocation();
  return (
    <>
      <section className="mx-auto grid w-full max-w-[1200px] items-center gap-8 px-6 pt-12 md:px-10 md:pt-16 lg:grid-cols-[1fr_45%] lg:gap-x-[54px] lg:px-16 lg:pt-[85px]">
        <div className={`flex flex-col items-start ${poppins.className}`}>
          <p className="flex items-center gap-2.5 font-sans text-[14px] leading-none text-body">
            <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#22A559] opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#22A559]" />
            </span>
            {location}
          </p>
          <h1 className={`mt-4 max-w-[460px] text-[40px] font-medium leading-[1.1] tracking-normal text-black md:text-[56px] lg:mt-6 ${poppins.className}`}>Marketing Agency In <span className="whitespace-nowrap">Los Angeles</span></h1>
          <div className="mt-5 max-w-[520px] space-y-4 text-[17px] font-normal leading-[1.4] text-black md:mt-6 md:text-[20px] lg:space-y-7">
            <p>Most local searches end with a click on one of the top 3 results in Google Maps.</p>
            <p>If your Los Angeles business isn't there, those customers go to your competitors.</p>
          </div>
        </div>
        <VideoPlaceholder
          embedUrl={siteConfig.videos.losangeles}
          accent="#4F5BD5"
          label="Click To Watch"
          upper
          duration={siteConfig.losAngelesVideoDuration}
          thumbnail={siteConfig.losAngelesThumbnail}
        />
      </section>

      <section className="mx-auto w-full max-w-[1200px] px-6 pb-10 pt-10 md:px-10 md:pb-[50px] md:pt-16 lg:px-16">
        <ul className="grid gap-3 md:grid-cols-3 md:gap-4">
          {stats.map(({ icon: Icon, text }) => (
            <li key={text} className={`flex h-16 items-center gap-3 rounded-2xl bg-[#F5F5F5] px-5 text-[16px] font-medium text-black ${poppins.className}`}>
              <Icon aria-hidden className="h-6 w-6 shrink-0 text-[#22A559]" strokeWidth={1.5} />
              {text}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
