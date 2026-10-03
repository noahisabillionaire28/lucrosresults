import type { Metadata } from "next";
import { Card } from "@/components/Card";
import { ContactForm } from "@/components/ContactForm";
import { ExploreLinks } from "@/components/ExploreLinks";
import { NapBlock } from "@/components/NapBlock";
import { SectionHeading } from "@/components/SectionHeading";
import { SectionWrapper } from "@/components/SectionWrapper";
import { BookCallCTA } from "@/components/sections";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = {
  title: "Contact Lucros Results | Marketing Agency Los Angeles",
  description: "Call, message or book a free 15-minute strategy call with Lucros Results, a marketing agency serving Los Angeles businesses from Porter Ranch, CA.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <section className="mx-auto w-full max-w-[1200px] px-6 pb-6 pt-10 md:px-10 lg:px-16 md:pt-16">
        <h1 className="max-w-[1000px] text-[44px] leading-[1.02] tracking-[-0.06em] text-black md:text-[64px]">Contact Lucros Results – Marketing Agency Los Angeles</h1>
        <p className="mt-6 max-w-[680px] text-[18px] leading-relaxed text-body">
          Call us, send a message, or book a free strategy call below. {siteConfig.name} serves local businesses across Los Angeles and the San Fernando Valley.
        </p>
      </section>

      <NapBlock />

      <SectionWrapper reveal={false}>
        <Card>
          <SectionHeading as="h2" className="!text-[34px] md:!text-[48px]">Send us a message</SectionHeading>
          <div className="mt-8 max-w-[720px]"><ContactForm /></div>
        </Card>
      </SectionWrapper>

      <ExploreLinks servicesTitle="Our main services" />
      <BookCallCTA embed />
    </>
  );
}
