import gbp from "./content/services/google-business-profile-optimization";
import localSeo from "./content/services/local-seo";
import googleAds from "./content/services/google-ads";
import metaAds from "./content/services/meta-ads";
import leadGen from "./content/services/lead-generation";
import type { ServicePage, ServiceSlug } from "./types";

export const services: ServicePage[] = [gbp, localSeo, googleAds, metaAds, leadGen];
export const getService = (slug: string) => services.find((s) => s.slug === slug);
export const serviceHref = (slug: ServiceSlug) => `/services/${slug}`;
