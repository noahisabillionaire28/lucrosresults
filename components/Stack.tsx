import { Children, type ReactNode } from "react";
import { Reveal } from "./Reveal";

/** Stacked cards: scroll-in with 0.1s stagger per card. */
export function Stack({ children, className = "flex flex-col gap-4" }: { children: ReactNode; className?: string }) {
  return (
    <div className={className}>
      {Children.toArray(children).map((child, i) => (
        <Reveal key={i} delay={i * 0.1}>{child}</Reveal>
      ))}
    </div>
  );
}
