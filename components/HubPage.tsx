import Link from "next/link";
import { Card } from "./Card";
import { Reveal } from "./Reveal";
import { SectionWrapper } from "./SectionWrapper";
import { Stack } from "./Stack";
import { BookCallCTA } from "./sections";

export function HubPage({ h1, intro, items }: { h1: string; intro: string[]; items: { href: string; name: string; short: string }[] }) {
  return (
    <>
      <section className="mx-auto w-full max-w-[1200px] px-6 pb-6 pt-10 md:px-10 lg:px-16 md:pt-16">
        <h1 className="max-w-[1000px] text-[44px] leading-[1.02] tracking-[-0.06em] text-black md:text-[64px]">{h1}</h1>
        <div className="mt-6 max-w-[680px] space-y-3 text-[18px] leading-relaxed text-body">
          {intro.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </section>
      <SectionWrapper reveal={false}>
        <Stack>
          {items.map((i) => (
            <Card key={i.href} as="article" className="md:py-10">
              <h2 className="text-[32px] leading-none tracking-[-0.06em] text-black md:text-[40px]">
                <Link href={i.href}>{i.name} →</Link>
              </h2>
              <p className="mt-4 max-w-[560px] text-[16px] leading-relaxed text-body">{i.short}</p>
            </Card>
          ))}
        </Stack>
      </SectionWrapper>
      <BookCallCTA />
    </>
  );
}
