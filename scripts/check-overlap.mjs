// Usage: node scripts/check-overlap.mjs [--threshold 0.10]
// Pairwise text overlap between area pages: share of 6-word phrases (shingles) in the SMALLER page that also appear in the other.
// Measures intro + section headings/paragraphs/bullets + FAQs + serviceNotes. Exits 1 if any pair is >= threshold.
import { readdirSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const thr = Number(process.argv[process.argv.indexOf("--threshold") + 1]) || 0.1;
const strip = (s) => s.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
const dir = resolve("lib/content/areas");
const pages = {};
for (const f of readdirSync(dir).filter((f) => f.endsWith(".ts")).sort()) {
  const p = (await import(pathToFileURL(resolve(dir, f)).href)).default;
  const text = [...p.intro, ...p.sections.flatMap((s) => [s.heading, ...s.paragraphs, ...(s.bullets ?? [])]), ...p.faqs.flatMap((q) => [q.q, q.a]), ...Object.values(p.serviceNotes)].map(strip).join(" . ");
  const w = text.toLowerCase().match(/[a-z0-9'$%]+/g) ?? [];
  const sh = new Set();
  for (let i = 0; i + 6 <= w.length; i++) sh.add(w.slice(i, i + 6).join(" "));
  pages[p.slug] = { sh, words: w.length };
}
const slugs = Object.keys(pages);
let worst = 0, fail = 0;
const rows = [];
for (let i = 0; i < slugs.length; i++) for (let j = i + 1; j < slugs.length; j++) {
  const A = pages[slugs[i]].sh, B = pages[slugs[j]].sh;
  let c = 0; for (const x of A) if (B.has(x)) c++;
  const o = c / Math.min(A.size, B.size);
  worst = Math.max(worst, o); if (o >= thr) fail++;
  rows.push([o, slugs[i], slugs[j], c]);
}
rows.sort((a, b) => b[0] - a[0]);
for (const [o, a, b, c] of rows) console.log(`${(o * 100).toFixed(1).padStart(5)}%  ${a} <-> ${b}  (${c} shared 6-grams)`);
console.log(`\nworst pair: ${(worst * 100).toFixed(1)}%  | pairs >= ${(thr * 100)}%: ${fail}  | ${fail ? "FAIL" : "PASS"}`);
process.exit(fail ? 1 : 0);
