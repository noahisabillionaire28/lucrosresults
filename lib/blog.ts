import type { BlogPost } from "./types";
import whyNotOnMaps from "./content/blog/why-your-business-isnt-showing-up-on-google-maps";
import gbpChecklist from "./content/blog/google-business-profile-checklist-for-los-angeles-businesses";
import reviewsToRank from "./content/blog/how-many-google-reviews-do-you-need-to-rank";
import whatIsNap from "./content/blog/what-is-nap-and-why-it-matters-for-local-seo";
import pickCategory from "./content/blog/how-to-pick-the-right-google-business-profile-category";
import servicesSection from "./content/blog/google-business-profile-services-section-explained";
import seoVsAds from "./content/blog/local-seo-vs-google-ads-which-should-you-start-with";
import getReviews from "./content/blog/how-to-get-more-google-reviews-without-being-pushy";
import citations from "./content/blog/citations-explained-bing-apple-maps-yelp";
import titleTag from "./content/blog/why-your-website-title-tag-matters-for-local-search";
import sfvTips from "./content/blog/marketing-tips-for-san-fernando-valley-small-businesses";
import first90 from "./content/blog/what-to-expect-in-your-first-90-days-of-local-seo";

// To publish a new post: create lib/content/blog/<slug>.ts, import it here and add it to this list.
// Newest first (sorted by date; same-date posts keep the order below).
const all: BlogPost[] = [whyNotOnMaps, gbpChecklist, reviewsToRank, whatIsNap, pickCategory, servicesSection, seoVsAds, getReviews, citations, titleTag, sfvTips, first90];

export const posts: BlogPost[] = [...all].sort((a, b) => b.date.localeCompare(a.date));
export const getPost = (slug: string) => posts.find((p) => p.slug === slug);
export const blogHref = (slug: string) => `/blog/${slug}`;
