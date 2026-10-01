import type { Metadata } from "next";
import { Card } from "@/components/Card";
import { PillButton } from "@/components/PillButton";
import { SectionWrapper } from "@/components/SectionWrapper";

export const metadata: Metadata = { title: "Thank You | Lucros Results", robots: { index: false, follow: false } };

export default function ThankYou() {
  return (
    <>
      <section className="mx-auto w-full max-w-[1200px] px-4 pb-6 pt-10 text-center md:px-6 md:pt-20">
        <h1 className="mx-auto max-w-[900px] text-[44px] leading-[1.02] tracking-[-0.06em] text-black md:text-[72px]">
          <span className="font-semibold">Check Your Inbox</span>
          <span className="font-normal text-black/50"> — Your Video Is On Its Way</span>
        </h1>
      </section>
      <SectionWrapper>
        <Card className="flex flex-col items-start gap-5 py-12 md:py-20">
          <h2 className="text-[40px] leading-[1.02] tracking-[-0.06em] md:text-[56px]">Want Us To Just Do It For You?</h2>
          <ul className="space-y-2 text-[16px] text-body">
            <li>• We close the gaps Google rewards.</li>
            <li>• You see movement in weeks, not months.</li>
            <li>• Guaranteed top 3 in 90 days or a full refund.</li>
          </ul>
          <PillButton href="/google">See How We Get You Into the Top 3</PillButton>
        </Card>
      </SectionWrapper>
    </>
  );
}
