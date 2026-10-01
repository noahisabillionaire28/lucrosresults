import { advantages, faqs, steps } from "@/lib/content";
import { siteConfig } from "@/site.config";
import { Card } from "./Card";
import { Chip } from "./Chip";
import { FAQAccordion } from "./FAQAccordion";
import { icons } from "./icons";
import { PillButton } from "./PillButton";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { SectionWrapper } from "./SectionWrapper";
import { Stack } from "./Stack";

export function AdvantageSection({ headingLevel = "h2" as "h2" | "h3" }) {
  return (
    <SectionWrapper reveal={false}>
      <div className="mb-10 flex flex-col items-start gap-5 md:mb-14">
        <Reveal><Chip>The Advantage</Chip></Reveal>
        <SectionHeading as={headingLevel}>But, Is This Even *Worth* It?</SectionHeading>
      </div>
      <Stack>
        {advantages.map((a) => {
          const Icon = icons[a.icon];
          return (
            <Card key={a.title} as="article" className="relative overflow-hidden md:min-h-[320px]">
              <div className="md:w-[40%]">
                <Icon className="h-10 w-10 text-[#3B82F6]" strokeWidth={1} />
                <h3 className="mt-8 text-[32px] leading-none tracking-[-0.06em] text-black md:text-[40px]">{a.title}</h3>
                <p className="mt-4 text-[16px] leading-relaxed text-body">{a.text}</p>
              </div>
              <Icon aria-hidden className="pointer-events-none absolute -bottom-6 right-6 hidden h-[260px] w-[260px] text-[#3B82F6]/20 md:block" strokeWidth={0.4} />
            </Card>
          );
        })}
      </Stack>
    </SectionWrapper>
  );
}

export function ProcessSection() {
  return (
    <SectionWrapper reveal={false}>
      <div className="mb-10 flex flex-col items-start gap-5 md:mb-14">
        <Reveal><Chip>How It Works</Chip></Reveal>
        <SectionHeading>It's Pretty *Simple.*</SectionHeading>
      </div>
      <Stack>
        {steps.map((s) => (
          <Card key={s.n} as="article" className="md:min-h-[240px]">
            <span className="text-[18px] text-body">{s.n}</span>
            <div className="mt-6 md:w-[40%]">
              <h3 className="text-[32px] leading-none tracking-[-0.06em] text-black md:text-[40px]">{s.title}</h3>
              <p className="mt-4 text-[16px] leading-relaxed text-body">{s.text}</p>
            </div>
          </Card>
        ))}
      </Stack>
    </SectionWrapper>
  );
}

export function FAQSection() {
  return (
    <SectionWrapper reveal={false}>
      <div className="mb-10 flex flex-col items-start gap-5 md:mb-14">
        <SectionHeading>Frequently Asked *Questions*</SectionHeading>
      </div>
      <FAQAccordion items={faqs} />
    </SectionWrapper>
  );
}

export function BookCallCTA() {
  return (
    <SectionWrapper>
      <Card className="flex flex-col items-start gap-5 py-12 md:py-20">
        <Chip>Get Started</Chip>
        <SectionHeading>Book Your *Free* Strategy Call</SectionHeading>
        <div className="text-[16px] leading-relaxed text-body">
          <p>15 minutes. No pressure, no obligations.</p>
          <p>Worst case, you leave with free advice.</p>
        </div>
        {/* TODO: set calendarLink in site.config.ts */}
        <PillButton href={siteConfig.calendarLink}>Book Strategy Call</PillButton>
      </Card>
    </SectionWrapper>
  );
}
