import type { Metadata } from "next";
import { SectionWrapper } from "@/components/SectionWrapper";

export const metadata: Metadata = { title: "Terms of Service | Lucros Results", description: "Terms of service for Lucros Results.", alternates: { canonical: "/terms" } };

export default function Terms() {
  return (
    <SectionWrapper className="pt-10 md:pt-16">
      <h1 className="text-[44px] leading-[1.02] tracking-[-0.06em] md:text-[70px]">Terms of Service</h1>
      {/* TODO: replace with real terms (have a lawyer review the 90-day refund guarantee wording). */}
      <p className="mt-6 max-w-[640px] text-[16px] leading-relaxed text-body">Placeholder: our full Terms of Service will be published here.</p>
    </SectionWrapper>
  );
}
