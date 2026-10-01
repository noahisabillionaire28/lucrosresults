"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Stack } from "./Stack";

export function FAQAccordion({ items }: { items: readonly { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <Stack className="flex flex-col gap-3">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={it.q} className={`rounded-2xl transition-colors duration-300 ${isOpen ? "bg-accordion" : "bg-card"}`}>
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 p-5 text-left text-[18px] tracking-[-0.03em] text-black md:p-6 md:text-[20px]"
            >
              <h3 className="text-inherit">{it.q}</h3>
              <motion.span aria-hidden className="text-[28px] leading-none" animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.3 }}>+</motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-6 text-[16px] leading-relaxed text-body md:px-6">{it.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </Stack>
  );
}
