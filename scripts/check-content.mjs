// Usage: node scripts/check-content.mjs  — validates lib/content/{services,areas}/*.ts
import { readdirSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const words = (s) => s.trim().split(/\s+/).filter(Boolean).length;
const strip = (s) => s.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
const links = (s) => [...s.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)].map((m) => ({ text: m[1], href: m[2] }));

let bad = 0;
for (const [dir, min, max, linkPrefix, minLinks, maxLinks] of [
  ["services", 1000, 1500, "/areas/", 2, 4],
  ["areas", 800, 1200, "/services/", 3, 4],
]) {
  const base = resolve("lib/content", dir);
  for (const f of readdirSync(base).filter((f) => f.endsWith(".ts")).sort()) {
    const p = (await import(pathToFileURL(resolve(base, f)).href)).default;
    const texts = [...p.intro, ...p.sections.flatMap((s) => [s.heading, ...s.paragraphs, ...(s.bullets ?? [])]), ...p.faqs.flatMap((q) => [q.q, q.a]), ...Object.values(p.serviceNotes ?? {})];
    const total = texts.reduce((n, t) => n + words(strip(t)), 0);
    const ls = texts.flatMap(links);
    const uniq = new Set(ls.map((l) => l.href));
    const problems = [];
    if (total < min || total > max) problems.push(`words ${total} outside ${min}-${max}`);
    if (p.faqs.length < 5 || p.faqs.length > 6) problems.push(`faqs ${p.faqs.length}`);
    if (ls.length < minLinks || ls.length > maxLinks) problems.push(`links ${ls.length} outside ${minLinks}-${maxLinks}`);
    if (ls.some((l) => !l.href.startsWith(linkPrefix))) problems.push("link outside " + linkPrefix);
    if (uniq.size !== ls.length) problems.push("duplicate link targets");
    if (new Set(ls.map((l) => l.text.toLowerCase())).size !== ls.length) problems.push("repeated anchor text");
    if (p.slug + ".ts" !== f) problems.push("slug/filename mismatch");
    if (p.title.length > 65) problems.push(`title ${p.title.length} chars`);
    if (p.description.length < 120 || p.description.length > 160) problems.push(`description ${p.description.length} chars`);
    console.log(`${problems.length ? "FAIL" : "ok  "} ${dir}/${f}  words=${total} links=${ls.length} faqs=${p.faqs.length}${problems.length ? "  -> " + problems.join("; ") : ""}`);
    bad += problems.length;
  }
}

// Blog posts: 800-1200 words, 2-8 links, at least 2 to service/area pages, unique anchors, one H2 minimum.
{
  const base = resolve("lib/content/blog");
  const seen = { title: new Set(), desc: new Set() };
  for (const f of readdirSync(base).filter((f) => f.endsWith(".ts")).sort()) {
    const p = (await import(pathToFileURL(resolve(base, f)).href)).default;
    const total = p.body.reduce((n, t) => n + words(strip(t.replace(/^## |^- |\n- /g, " ").replace(/\*\*/g, ""))), 0);
    const ls = p.body.flatMap(links);
    const problems = [];
    if (total < 800 || total > 1200) problems.push(`words ${total} outside 800-1200`);
    if (ls.length > 8) problems.push(`links ${ls.length} > 8`);
    if (ls.filter((l) => /^\/(services|areas)\//.test(l.href)).length < 2) problems.push("needs >= 2 service/area links");
    if (new Set(ls.map((l) => l.text.toLowerCase())).size !== ls.length) problems.push("repeated anchor text");
    if (p.body.filter((b) => b.startsWith("## ")).length < 3) problems.push("needs >= 3 H2s");
    if (p.slug + ".ts" !== f) problems.push("slug/filename mismatch");
    if (p.metaTitle.length > 65) problems.push(`metaTitle ${p.metaTitle.length} chars`);
    if (p.description.length < 120 || p.description.length > 160) problems.push(`description ${p.description.length} chars`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(p.date)) problems.push("bad date");
    if (seen.title.has(p.metaTitle) || seen.desc.has(p.description)) problems.push("duplicate metadata");
    seen.title.add(p.metaTitle); seen.desc.add(p.description);
    console.log(`${problems.length ? "FAIL" : "ok  "} blog/${f}  words=${total} links=${ls.length}${problems.length ? "  -> " + problems.join("; ") : ""}`);
    bad += problems.length;
  }
}
process.exit(bad ? 1 : 0);
