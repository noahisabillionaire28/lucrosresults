"use client";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { siteConfig } from "@/site.config";
import { Logo } from "./Logo";

export function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-cream">
      <div className="mx-auto flex h-[68px] max-w-[1200px] items-center justify-between px-4 md:px-6">
        <Logo />
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="relative flex h-10 w-10 items-center justify-center"
        >
          <motion.span className="absolute h-[2px] w-6 rounded bg-black" animate={{ y: open ? 0 : -4, rotate: open ? 45 : 0 }} transition={{ duration: 0.25 }} />
          <motion.span className="absolute h-[2px] w-6 rounded bg-black" animate={{ y: open ? 0 : 4, rotate: open ? -45 : 0 }} transition={{ duration: 0.25 }} />
        </button>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="overflow-hidden bg-cream"
          >
            <div className="mx-auto flex max-w-[1200px] flex-col gap-2 px-4 pb-5 md:px-6">
              <nav aria-label="Primary" className="flex flex-col">
                {siteConfig.nav.map((l) => (
                  <Link key={l.href} href={l.href} className="py-2 text-[18px] tracking-[-0.03em] text-black/70">
                    {l.label}
                  </Link>
                ))}
              </nav>
              <Link href="/google" className="mt-2 flex w-full items-center justify-center rounded-[50px] bg-black py-4 text-[16px] text-white shadow-glow">
                Sign Up
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
