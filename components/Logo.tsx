import Link from "next/link";

export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="9" fill="#000" />
      <path d="M11 8v13h10" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="21" cy="11" r="2.2" fill="#fff" />
    </svg>
  );
}

export function Logo() {
  return (
    <Link href="/" className="flex min-h-[44px] items-center gap-2.5 text-[20px] tracking-[-0.04em] text-black" aria-label="Lucros Results home">
      <LogoMark />
      Lucros Results
    </Link>
  );
}
