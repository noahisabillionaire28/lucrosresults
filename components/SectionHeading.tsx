"use client";
import { motion } from "framer-motion";
import { Fragment, type ReactNode } from "react";
import { Reveal, scrollSpring } from "./Reveal";

/** Turns "Found *First*" into Source Serif 4 italic accent. */
export function accent(text: string): ReactNode {
  return text.split(/(\*[^*]+\*)/g).map((part, i) =>
    part.startsWith("*") ? (
      <em key={i} className="whitespace-nowrap font-serif font-normal italic">{part.slice(1, -1)}</em>
    ) : (
      <Fragment key={i}>
        {part.split("\n").map((seg, j) => (
          <Fragment key={j}>
            {j > 0 && <br className="hidden md:block" />}
            {seg}
          </Fragment>
        ))}
      </Fragment>
    ),
  );
}

const size = "text-[36px] leading-[1.1] tracking-[-0.06em] text-black md:text-[56px] md:leading-[1.05]";

/** H2 (or H1/H3). Headings with an italic accent get blur(10px)→0 + fade; others use the standard scroll-in. */
export function SectionHeading({ children, as: Tag = "h2", className = "" }: { children: string; as?: "h1" | "h2" | "h3"; className?: string }) {
  const hasAccent = children.includes("*");
  const cn = `${size} ${className}`;
  if (hasAccent) {
    const M = motion[Tag];
    return (
      <M
        className={cn}
        initial={{ opacity: 0, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {accent(children)}
      </M>
    );
  }
  return (
    <Reveal>
      <Tag className={cn}>{children}</Tag>
    </Reveal>
  );
}

export { scrollSpring };
