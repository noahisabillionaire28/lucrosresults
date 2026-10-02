import type { Metadata } from "next";
import { HubPage } from "@/components/HubPage";
import { areas, areaHref } from "@/lib/areas";

export const metadata: Metadata = {
  title: "Areas We Serve in the San Fernando Valley | Lucros Results",
  description: "Lucros Results helps local businesses rank in Google's top 3 across the San Fernando Valley, Woodland Hills, Calabasas, Northridge and Porter Ranch.",
  alternates: { canonical: "/areas" },
};

export default function Areas() {
  return (
    <HubPage
      h1="Areas We Serve in the San Fernando Valley"
      intro={[
        "Local search is local. The map pack changes from one neighborhood to the next, so we plan around where your customers actually are.",
        "Pick your area to see how we help businesses there.",
      ]}
      items={areas.map((a) => ({ href: areaHref(a.slug), name: a.name, short: a.short }))}
    />
  );
}
