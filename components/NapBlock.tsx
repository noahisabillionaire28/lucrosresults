import { siteConfig } from "@/site.config";
import { Card } from "./Card";
import { SectionWrapper } from "./SectionWrapper";

/** Visible NAP (name · city · tap-to-call) for page bodies. Values come from site.config.ts. */
export function NapBlock({ wrap = true }: { wrap?: boolean }) {
  const body = (
    <address className="not-italic">
      <p className="text-[20px] tracking-[-0.03em] text-black md:text-[24px]">
        {siteConfig.name} <span className="text-body">·</span> {siteConfig.address} <span className="text-body">·</span>{" "}
        <a href={`tel:${siteConfig.phoneTel}`} className="inline-flex min-h-[44px] items-center underline decoration-black/30 underline-offset-4">{siteConfig.phone}</a>
      </p>
    </address>
  );
  return wrap ? (
    <SectionWrapper reveal={false} className="py-4 md:py-4">
      <Card className="py-6 md:py-8">{body}</Card>
    </SectionWrapper>
  ) : body;
}
