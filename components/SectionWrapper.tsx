import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

/** Centered column + generous vertical spacing. Set reveal={false} when children animate themselves (stacked cards). */
export function SectionWrapper({ children, reveal = true, id, className = "" }: { children: ReactNode; reveal?: boolean; id?: string; className?: string }) {
  return (
    <section id={id} className={`mx-auto w-full max-w-[1200px] px-4 py-14 md:px-6 md:py-24 ${className}`}>
      {reveal ? <Reveal>{children}</Reveal> : children}
    </section>
  );
}
