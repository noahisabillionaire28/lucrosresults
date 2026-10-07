import type { Metadata } from "next";
import { Card } from "@/components/Card";
import { Chip } from "@/components/Chip";
import { PillButton } from "@/components/PillButton";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { SectionWrapper } from "@/components/SectionWrapper";
import { Stack } from "@/components/Stack";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = {
  title: "3 Free Tips to Rank Higher on Google | Lucros Results",
  description: "Three simple fixes to help your local business rank higher on Google Maps and search. No tech skills needed. From Lucros Results, Los Angeles.",
  alternates: { canonical: "/free-tips" },
};

const tips = [
  {
    n: "01",
    h: "Complete Every Part of Your Google Profile",
    p: [
      "Google ranks businesses that look active and complete. Most local businesses leave half their profile blank.",
      "Fill in every section: services, hours, photos, description, service areas. Get that profile strength bar fully green.",
      "This alone moves you up, because most of your competitors never bother.",
    ],
  },
  {
    n: "02",
    h: "Make Your Name, Address, and Phone Match Everywhere",
    p: [
      "Google trusts businesses it can confirm are real. If your phone number or business name is slightly different on your website versus your Google profile versus Yelp, Google gets confused and ranks you lower.",
      "Pick one exact version of your name, address, and phone, and make it identical everywhere online.",
    ],
  },
  {
    n: "03",
    h: "Put Your City in Your Website Title",
    p: [
      "When Google decides who ranks for “plumber in Los Angeles,” it looks at your website’s title tag. Most businesses just have their company name there.",
      "Add your main service and your city, like “Best Plumber Los Angeles.”",
      "It’s a small change that tells Google exactly what you do and where, and most of your competition isn’t doing it.",
    ],
  },
];

export default function FreeTipsPage() {
  return (
    <>
      <section className="mx-auto w-full max-w-[1200px] px-6 pb-6 pt-10 text-center md:px-10 md:pt-16 lg:px-16">
        <Chip>Free Training</Chip>
        <h1 className="mx-auto mt-5 max-w-[900px] text-[44px] leading-[1.02] tracking-[-0.06em] text-black md:text-[72px]">3 Ways to Rank Higher on Google</h1>
        <p className="mx-auto mt-6 max-w-[600px] text-[18px] leading-relaxed text-body">The first three fixes we make for every local business we work with. No tech skills needed.</p>
      </section>

      <SectionWrapper reveal={false}>
        <Stack>
          {tips.map((t) => (
            <Card key={t.n} as="article" className="md:py-14">
              <div className="grid gap-4 md:grid-cols-[120px_1fr] md:gap-10">
                <span aria-hidden className="text-[48px] font-semibold leading-none tracking-[-0.06em] text-black/25 md:text-[72px]">{t.n}</span>
                <div>
                  <SectionHeading as="h2" className="!text-[30px] md:!text-[44px]">{t.h}</SectionHeading>
                  <div className="mt-6 max-w-[680px] space-y-4 text-[17px] leading-relaxed text-body md:text-[18px]">
                    {t.p.map((x) => <p key={x}>{x}</p>)}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </Stack>
      </SectionWrapper>

      <SectionWrapper>
        <Reveal>
          <Card className="flex flex-col items-start gap-5 py-12 md:py-20">
            <Chip>Want Us To Do It For You?</Chip>
            <SectionHeading>We Handle All of This For You</SectionHeading>
            <p className="max-w-[560px] text-[16px] leading-relaxed text-body">These three tips are the start. Book a free call and we&apos;ll map out exactly how to get your business into Google&apos;s top 3.</p>
            <PillButton href={siteConfig.bookingPath}>Book a Free Call</PillButton>
          </Card>
        </Reveal>
      </SectionWrapper>
    </>
  );
}
