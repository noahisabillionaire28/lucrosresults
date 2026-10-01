import type { MetadataRoute } from "next";
import { siteConfig } from "@/site.config";

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/", disallow: ["/thank-you", "/booked"] }, sitemap: `${siteConfig.url}/sitemap.xml` };
}
