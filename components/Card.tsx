import type { ReactNode } from "react";

export function Card({ children, className = "", as: Tag = "div" }: { children: ReactNode; className?: string; as?: "div" | "article" | "li" }) {
  return <Tag className={`rounded-card bg-card p-6 md:p-12 ${className}`}>{children}</Tag>;
}
