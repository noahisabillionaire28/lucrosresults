import type { MetadataRoute } from "next";
import { siteConfig } from "@/site.config";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", "/google", "/los-angeles", "/terms"]; // thank-you & booked are noindex
  return paths.map((p) => ({ url: `${siteConfig.url}${p === "/" ? "" : p}`, lastModified: new Date() }));
}
