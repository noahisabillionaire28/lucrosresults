import { LogoMark } from "./Logo";

/**
 * Auto-generated branded thumbnail: black tile logo on cream with the post title. No image files to make.
 * size "sm" = index cards, "lg" = post header.
 */
export function BlogThumb({ title, size = "sm" }: { title: string; size?: "sm" | "lg" }) {
  const lg = size === "lg";
  return (
    <div className={`flex aspect-[16/9] w-full flex-col items-start justify-between text-left overflow-hidden rounded-xl border border-black/10 bg-cream ${lg ? "p-6 md:p-12" : "p-5 md:p-6"}`}>
      <LogoMark className={lg ? "h-12 w-12 md:h-16 md:w-16" : "h-10 w-10"} />
      <p className={`max-w-[90%] leading-[1.08] tracking-[-0.05em] text-black ${lg ? "text-[24px] md:text-[44px]" : "text-[20px] md:text-[24px]"}`}>{title}</p>
    </div>
  );
}
