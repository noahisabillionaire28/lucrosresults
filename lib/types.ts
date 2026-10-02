export type FAQ = { q: string; a: string };
export type Section = { heading: string; paragraphs: string[]; bullets?: string[] };

export const serviceSlugs = ["google-business-profile-optimization", "local-seo", "google-ads", "meta-ads", "lead-generation"] as const;
export const areaSlugs = ["san-fernando-valley", "woodland-hills", "calabasas", "northridge", "porter-ranch"] as const;
export type ServiceSlug = (typeof serviceSlugs)[number];
export type AreaSlug = (typeof areaSlugs)[number];

type Base = {
  name: string; // short display name, e.g. "Local SEO" / "Woodland Hills"
  h1: string; // keyword H1
  title: string; // <title>, unique, <= 60 chars preferred
  description: string; // meta description, unique, 140-160 chars
  short: string; // one plain sentence for hub cards / link lists
  intro: string[]; // 1-2 short paragraphs under the H1
  sections: Section[]; // each renders as an H2 + paragraphs (+ optional bullets)
  faqs: FAQ[]; // 5-6 items
};

export type ServicePage = Base & { slug: ServiceSlug };
export type AreaPage = Base & {
  slug: AreaSlug;
  /** One sentence per service for the "Services we offer here" list, written for this area. */
  serviceNotes: Record<ServiceSlug, string>;
};
