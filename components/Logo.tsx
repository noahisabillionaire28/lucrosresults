import Image from "next/image";
import Link from "next/link";

/**
 * Brand mark: black rounded tile with the orange mark (vector, so it stays crisp at any size).
 * Source: public/brand/logo-tile.svg (traced from public/brand/logo-original.png).
 */
export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return <Image src="/brand/logo-tile.svg" alt="Lucros Results logo" width={64} height={64} unoptimized className={`shrink-0 ${className}`} />;
}

export function Logo() {
  return (
    <Link href="/" className="flex min-h-[44px] items-center gap-2.5 text-[20px] tracking-[-0.04em] text-black" aria-label="Lucros Results home">
      <LogoMark />
      Lucros Results
    </Link>
  );
}
