import type { Metadata } from "next";
import { HubPage } from "@/components/HubPage";
import { services, serviceHref } from "@/lib/services";

export const metadata: Metadata = {
  title: "Local Marketing Services Los Angeles | Lucros Results",
  description: "Google Business Profile optimization, local SEO, Google Ads, Meta Ads and lead generation for Los Angeles local businesses. See what we do.",
  alternates: { canonical: "/services" },
};

export default function Services() {
  return (
    <HubPage
      h1="Local Marketing Services Los Angeles"
      intro={[
        "Five services, one goal: more customers from people searching near you.",
        "Our core offer is a spot in Google's top 3 Maps results in 90 days, or a full refund. The rest of the services back it up.",
      ]}
      items={services.map((s) => ({ href: serviceHref(s.slug), name: s.name, short: s.short }))}
    />
  );
}
