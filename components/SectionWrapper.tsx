import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

/** Centered column + generous vertical spacing. Set reveal={false} when children animate themselves (stacked cards). */
export function SectionWrapper({ children, reveal = true, id, className = "" }: { children: ReactNode; reveal?: boolean; id?: string; className?: string }) {
  return (
    <section id={id} className={`mx-auto w-full max-w-[1100px] px-5 py-10 scroll-mt-16 md:px-6 md:py-[70px] ${className}`}>
      {reveal ? <Reveal>{children}</Reveal> : children}
    </section>
  );
}
