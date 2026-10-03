import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogBody } from "@/components/BlogBody";
import { BlogThumb } from "@/components/BlogThumb";
import { JsonLd } from "@/components/JsonLd";
import { TipsCard } from "@/components/TipsCard";
import { blogHref, getPost, posts } from "@/lib/blog";
import { siteConfig } from "@/site.config";

export const dynamicParams = false;
export const generateStaticParams = () => posts.map((p) => ({ slug: p.slug }));

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = getPost(params.slug);
  if (!p) return {};
  return {
    title: p.metaTitle,
    description: p.description,
    alternates: { canonical: blogHref(p.slug) },
    openGraph: { title: p.metaTitle, description: p.description, url: blogHref(p.slug), siteName: siteConfig.name, type: "article", publishedTime: p.date, authors: [siteConfig.founder], images: [{ url: "/og-image-v2.png", width: 1200, height: 630, alt: "Lucros Results" }] },
    twitter: { card: "summary_large_image", title: p.metaTitle, description: p.description, images: ["/og-image-v2.png"] },
  };
}

const longDate = (iso: string) => new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });

export default function BlogPost({ params }: { params: { slug: string } }) {
  const p = getPost(params.slug);
  if (!p) notFound();
  const url = `${siteConfig.url}${blogHref(p.slug)}`;
  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: p.title,
    description: p.description,
    datePublished: p.date,
    dateModified: p.date,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    image: `${siteConfig.url}/og-image-v2.png`,
    author: { "@type": "Person", name: siteConfig.founder },
    publisher: { "@type": "Organization", name: siteConfig.name, logo: { "@type": "ImageObject", url: `${siteConfig.url}${siteConfig.logoPath}` } },
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${siteConfig.url}/` },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${siteConfig.url}/blog` },
      { "@type": "ListItem", position: 3, name: p.title, item: url },
    ],
  };
  return (
    <>
      <JsonLd data={article} />
      <JsonLd data={breadcrumb} />
      <article>
        <header className="mx-auto w-full max-w-[1200px] px-6 pb-8 pt-10 text-center md:px-10 md:pt-16 lg:px-16">
          <nav aria-label="Breadcrumb" className="mb-6 text-[15px] text-body">
            <Link href="/blog" className="underline decoration-black/20 underline-offset-4">Blog</Link>
          </nav>
          <h1 className="mx-auto max-w-[900px] text-[36px] leading-[1.05] tracking-[-0.06em] text-black md:text-[60px]">{p.title}</h1>
          <p className="mt-5 text-[15px] text-body">By {siteConfig.founder} · <time dateTime={p.date}>{longDate(p.date)}</time></p>
          <div className="mx-auto mt-8 max-w-[860px]"><BlogThumb title={p.title} size="lg" /></div>
        </header>
        <div className="px-6 pb-6 md:px-10 lg:px-16"><BlogBody blocks={p.body} /></div>
      </article>
      <TipsCard />
    </>
  );
}
