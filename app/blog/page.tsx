import type { Metadata } from "next";
import Link from "next/link";
import { BlogThumb } from "@/components/BlogThumb";
import { Chip } from "@/components/Chip";
import { Reveal } from "@/components/Reveal";
import { SectionWrapper } from "@/components/SectionWrapper";
import { blogHref, posts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Local SEO & Google Maps Blog | Lucros Results",
  description: "Plain-English tips from Lucros Results on Google Maps, Google Business Profile, reviews and local SEO for Los Angeles small businesses.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndex() {
  return (
    <>
      <section className="mx-auto w-full max-w-[1200px] px-6 pb-6 pt-10 md:px-10 lg:px-16 md:pt-16">
        <Chip>Blog</Chip>
        <h1 className="mt-5 max-w-[900px] text-[44px] leading-[1.02] tracking-[-0.06em] text-black md:text-[64px]">The Blog to Get More Local Customers</h1>
        <p className="mt-6 max-w-[620px] text-[18px] leading-relaxed text-body">Plain-English guides on Google Maps, reviews and local SEO for Los Angeles businesses.</p>
      </section>

      <SectionWrapper reveal={false}>
        <ul className="grid gap-4 md:grid-cols-2 md:gap-6">
          {posts.map((p, i) => (
            <li key={p.slug}>
              <Reveal delay={(i % 2) * 0.08}>
                <Link href={blogHref(p.slug)} className="group block rounded-2xl bg-card p-3 md:rounded-card md:p-4">
                  <BlogThumb title={p.title} />
                  <div className="flex items-center justify-between gap-4 px-2 pb-2 pt-4 md:px-3">
                    <h2 className="text-[20px] leading-[1.2] tracking-[-0.04em] text-black md:text-[22px]">{p.title}</h2>
                    <span aria-hidden className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black text-[18px] text-white transition-transform group-hover:translate-x-0.5">→</span>
                  </div>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </SectionWrapper>
    </>
  );
}
