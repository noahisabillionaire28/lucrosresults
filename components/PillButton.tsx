import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

const cls = "inline-flex items-center justify-center rounded-[50px] bg-black px-8 py-4 text-[16px] leading-none text-white shadow-glow w-full sm:w-auto";

type Props = { children: ReactNode; href?: string; className?: string } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className">;

/** Black pill, static glow, deliberately NO hover/scale effects. */
export function PillButton({ children, href, className = "", ...rest }: Props) {
  if (href) {
    const external = href.startsWith("http");
    return external ? (
      <a href={href} target="_blank" rel="noopener noreferrer" className={`${cls} ${className}`}>{children}</a>
    ) : (
      <Link href={href} className={`${cls} ${className}`}>{children}</Link>
    );
  }
  return <button className={`${cls} ${className}`} {...rest}>{children}</button>;
}
