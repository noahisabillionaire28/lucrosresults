"use client";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Non-home pages: simple ~0.4s fade. Home has its own hero spring load-in. */
export function PageFade({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/") return <>{children}</>;
  return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>{children}</motion.div>;
}
