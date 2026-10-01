import Link from "next/link";
import { siteConfig } from "@/site.config";
import { LogoMark } from "./Logo";

export function Footer() {
  return (
    <footer className="mx-auto w-full max-w-[1200px] px-4 pb-10 pt-14 md:px-6 md:pt-24">
      <div className="rounded-card bg-card p-6 md:p-12">
        <div className="flex items-center gap-2.5 text-[20px] tracking-[-0.04em]">
          <LogoMark /> {siteConfig.name}
        </div>
        <p className="mt-10 text-[56px] leading-[0.98] tracking-[-0.06em] text-black md:text-[110px]">Own Your Local Market.</p>
        <p className="mt-6 text-[18px] text-body">{siteConfig.tagline}</p>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {/* NAP — sourced from site.config.ts so it's identical on every page */}
          <address className="not-italic text-[16px] leading-relaxed text-body">
            <p className="text-black">{siteConfig.name}</p>
            <p>Address: {siteConfig.address}</p>
            <p>Phone: {siteConfig.phone}</p>
          </address>
          <div className="aspect-[16/9] w-full overflow-hidden rounded-xl bg-chip md:aspect-[2/1]">
            {siteConfig.mapEmbedUrl ? (
              <iframe src={siteConfig.mapEmbedUrl} title="Lucros Results location map" loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="h-full w-full border-0" />
            ) : (
              <div className="flex h-full items-center justify-center text-[15px] text-body">
                {/* TODO: set mapEmbedUrl in site.config.ts to show the real Google Map embed here. */}
                Google Map embed placeholder
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-black/10 pt-6 text-[15px] text-body md:flex-row md:items-center md:gap-8">
          <Link href="/terms">Terms</Link>
          {/* TODO (phase 2): point to the Areas We Serve page once it exists */}
          <Link href="#">Areas We Serve</Link>
          <span className="md:ml-auto">© 2026 {siteConfig.name}</span>
        </div>
      </div>
    </footer>
  );
}
