import Link from "next/link";
import { siteConfig } from "@/site.config";
import { LogoMark } from "./Logo";

export function Footer() {
  return (
    <footer className="mx-auto w-full max-w-[1100px] px-5 pb-10 pt-10 md:px-6 md:pt-[70px]">
      <div className="rounded-card bg-card p-6 md:p-12">
        <div className="flex items-center gap-2.5 text-[20px] tracking-[-0.04em]">
          <LogoMark /> {siteConfig.name}
        </div>
        <p className="mt-10 text-[40px] leading-[1.05] tracking-[-0.06em] text-black md:text-[64px]">Own Your Local Market.</p>
        <p className="mt-6 text-[18px] text-body">{siteConfig.tagline}</p>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {/* NAP — sourced from site.config.ts so it's identical on every page */}
          <address className="not-italic text-[16px] leading-relaxed text-body">
            <p className="text-black">{siteConfig.name}</p>
            <p>Address: {siteConfig.address}</p>
            <p className="flex min-h-[44px] items-center gap-1.5">Phone: <a href={`tel:${siteConfig.phoneTel}`} className="flex min-h-[44px] items-center text-black underline decoration-black/30 underline-offset-4">{siteConfig.phone}</a></p>
          </address>
          <div className="aspect-[16/9] w-full overflow-hidden rounded-xl bg-chip md:aspect-[2/1]">
            <iframe src={siteConfig.mapEmbedUrl} title="Map of Porter Ranch, CA" loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="h-full w-full border-0" />
          </div>
        </div>

        <div className="mt-12 flex flex-col border-t border-black/10 pt-4 text-[15px] text-body md:flex-row md:items-center md:gap-8">
          <Link href="/terms" className="flex min-h-[44px] items-center">Terms</Link>
          <Link href="/services" className="flex min-h-[44px] items-center">Services</Link>
          <Link href="/areas" className="flex min-h-[44px] items-center">Areas We Serve</Link>
          <span className="flex min-h-[44px] items-center md:ml-auto">© 2026 {siteConfig.name}</span>
        </div>
      </div>
    </footer>
  );
}
