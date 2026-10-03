"use client";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { siteConfig } from "@/site.config";
import { Logo } from "./Logo";

const desktopLinks = siteConfig.nav.filter((l) => ["/services", "/areas", "/losangeles", "/contact"].includes(l.href));

/**
 * Desktop: 84px row + 1px divider (divider bottom at 85px). The divider spans the 1200px container; logo and
 * Sign Up sit on the 1072px content edges. Mobile: logo + hamburger, divider 20px below them, full content width.
 */
export function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-cream">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex items-center justify-between px-6 pb-5 pt-3 md:h-[84px] md:px-10 md:py-0 lg:px-16">
          <Logo />
          {/* Desktop links: sit between the logo and Sign Up (hidden below md; the hamburger panel has them). */}
          <nav aria-label="Primary" className="ml-auto mr-8 hidden items-center gap-6 md:flex lg:gap-8">
            {desktopLinks.map((l) => (
              <Link key={l.href} href={l.href} className="text-[15px] font-medium leading-none tracking-[-0.01em] text-black/60 transition-colors hover:text-black">
                {l.label}
              </Link>
            ))}
          </nav>
          {/* Desktop: Sign Up pill (81x37, no shadow). Mobile: hamburger (morphs to X, opens the panel below). */}
          <Link href="/google" className="hidden h-[37px] w-[81px] items-center justify-center rounded-[50px] bg-black text-[14px] leading-none tracking-[-0.01em] text-white md:inline-flex">
            Sign Up
          </Link>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="relative flex h-11 w-11 items-center justify-center md:hidden"
          >
            <motion.span className="absolute h-[2px] w-6 rounded bg-black" animate={{ y: open ? 0 : -4, rotate: open ? 45 : 0 }} transition={{ duration: 0.25 }} />
            <motion.span className="absolute h-[2px] w-6 rounded bg-black" animate={{ y: open ? 0 : 4, rotate: open ? -45 : 0 }} transition={{ duration: 0.25 }} />
          </button>
        </div>
        <div className="mx-6 h-px bg-black md:mx-0" />
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="overflow-hidden bg-cream md:hidden"
          >
            <div className="mx-auto flex max-w-[1200px] flex-col gap-2 px-6 pb-5 pt-2">
              <nav aria-label="Primary" className="flex flex-col">
                {siteConfig.nav.map((l) => (
                  <Link key={l.href} href={l.href} className="py-2 text-[18px] tracking-[-0.03em] text-black/70">
                    {l.label}
                  </Link>
                ))}
              </nav>
              <Link href="/google" className="mt-2 flex h-12 w-full items-center justify-center rounded-[50px] bg-black text-[16px] text-white">
                Sign Up
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
