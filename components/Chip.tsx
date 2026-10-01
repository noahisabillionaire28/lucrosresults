import type { ReactNode } from "react";

export function Chip({ children, icon }: { children: ReactNode; icon?: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-chip px-4 py-2 text-[18px] leading-none text-black/70">
      {icon && <span className="flex h-4 w-4 items-center justify-center [&>svg]:h-4 [&>svg]:w-4">{icon}</span>}
      {children}
    </span>
  );
}
