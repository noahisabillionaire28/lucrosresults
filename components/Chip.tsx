import type { ReactNode } from "react";

/** size "lg": bigger centered-section chip (18px). Default is the small 14px chip. */
export function Chip({ children, icon, size = "sm" }: { children: ReactNode; icon?: ReactNode; size?: "sm" | "lg" }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full bg-chip px-3 leading-none ${size === "lg" ? "py-2.5 text-[16px] text-black/70 md:text-[18px]" : "py-1.5 text-[14px] text-black/60"}`}>
      {icon && <span className="flex h-3.5 w-3.5 items-center justify-center [&>svg]:h-3.5 [&>svg]:w-3.5">{icon}</span>}
      {children}
    </span>
  );
}
