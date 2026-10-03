import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

/** Centered column + generous vertical spacing. Set reveal={false} when children animate themselves (stacked cards). */
export function SectionWrapper({ children, reveal = true, id, className = "" }: { children: ReactNode; reveal?: boolean; id?: string; className?: string }) {
  return (
    <section id={id} className={`mx-auto w-full max-w-[1200px] px-6 py-10 scroll-mt-16 md:px-10 lg:px-16 md:py-[70px] ${className}`}>
      {reveal ? <Reveal>{children}</Reveal> : children}
    </section>
  );
}
