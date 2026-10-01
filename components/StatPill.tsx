import type { ReactNode } from "react";

export function StatPill({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="flex items-center gap-3 text-[16px] text-black md:text-[18px]">
      <span className="flex h-6 w-6 items-center justify-center text-black/70 [&>svg]:h-6 [&>svg]:w-6">{icon}</span>
      {children}
    </div>
  );
}
