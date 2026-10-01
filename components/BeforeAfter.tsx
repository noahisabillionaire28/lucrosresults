"use client";
import { motion } from "framer-motion";
import { useState } from "react";

const data = {
  before: { badge: "bg-[#F6D5D3] text-[#B4231C]", dot: "#E5322D", stats: [["Average Rank", "86"], ["Market Share", "1%"], ["Clicks / Month", "5"], ["New Clients", "1–2"]] },
  after: { badge: "bg-[#D4EEDB] text-[#14733A]", dot: "#22A559", stats: [["Average Rank", "2"], ["Market Share", "82%"], ["Clicks / Month", "80"], ["New Clients", "15+"]] },
} as const;

/** Mock map grid — TODO: replace with real red-pin vs green-pin map screenshots. */
function MapGrid({ view }: { view: "before" | "after" }) {
  const good = view === "after";
  return (
    <div className="mt-6 grid aspect-[2/1] w-full place-items-center rounded-2xl bg-[#E7E2DB] p-4 md:p-8">
      <div className="grid w-full max-w-[420px] grid-cols-7 gap-2 md:gap-3">
        {Array.from({ length: 49 }).map((_, i) => {
          const r = Math.floor(i / 7), c = i % 7;
          const near = Math.abs(r - 3) + Math.abs(c - 3) <= (good ? 5 : 1);
          return <span key={i} className="aspect-square rounded-full" style={{ background: good && near ? data.after.dot : data.before.dot, opacity: good ? (near ? 1 : 0.3) : 1 }} />;
        })}
      </div>
    </div>
  );
}

export function BeforeAfter() {
  const [view, setView] = useState<"before" | "after">("before");
  const d = data[view];
  return (
    <div>
      <div className="relative inline-flex rounded-full bg-chip p-1" role="tablist" aria-label="Before or after">
        {(["before", "after"] as const).map((v) => (
          <button key={v} role="tab" aria-selected={view === v} onClick={() => setView(v)} className="relative z-10 rounded-full px-7 py-2.5 text-[16px] capitalize text-black">
            {view === v && <motion.span layoutId="ba-highlight" transition={{ duration: 0.25, ease: "easeInOut" }} className="absolute inset-0 -z-10 rounded-full bg-white shadow-sm" />}
            {v}
          </button>
        ))}
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {d.stats.map(([label, value]) => (
          <div key={label} className="rounded-2xl bg-white p-5">
            <span className={`inline-block rounded-full px-3 py-1 text-[15px] ${d.badge}`}>{value}</span>
            <p className="mt-3 text-[15px] text-body">{label}</p>
          </div>
        ))}
      </div>
      <MapGrid view={view} />
    </div>
  );
}
