import type { MetadataRoute } from "next";
import { posts } from "@/lib/blog";
import { areas } from "@/lib/areas";
import { services } from "@/lib/services";
import { siteConfig } from "@/site.config";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", "/google", "/losangeles", "/services", ...services.map((s) => `/services/${s.slug}`), "/areas", ...areas.map((a) => `/areas/${a.slug}`), "/contact", "/blog", ...posts.map((p) => `/blog/${p.slug}`), "/terms"]; // thank-you & booked are noindex
  return paths.map((p) => ({ url: `${siteConfig.url}${p === "/" ? "/" : p}`, lastModified: new Date() }));
}
