import Link from "next/link";
import { areas, areaHref } from "@/lib/areas";
import { services, serviceHref } from "@/lib/services";
import { Card } from "./Card";
import { Chip } from "./Chip";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { SectionWrapper } from "./SectionWrapper";

/** Compact hub block for the homepage and /losangeles: links to all 5 services and all 5 areas. */
export function ExploreLinks() {
  const col = (title: string, items: { href: string; label: string }[]) => (
    <div>
      <h3 className="text-[24px] tracking-[-0.04em] text-black">{title}</h3>
      <ul className="mt-4 divide-y divide-black/10">
        {items.map((i) => (
          <li key={i.href}><Link href={i.href} className="block py-3 text-[16px] text-body">{i.label} →</Link></li>
        ))}
      </ul>
    </div>
  );
  return (
    <SectionWrapper reveal={false}>
      <div className="mb-10 flex flex-col items-start gap-5 md:mb-14">
        <Reveal><Chip>What we do</Chip></Reveal>
        <SectionHeading>Services, and *where* we work</SectionHeading>
      </div>
      <Reveal>
        <Card className="grid gap-10 md:grid-cols-2">
          {col("Services", services.map((s) => ({ href: serviceHref(s.slug), label: s.name })))}
          {col("Areas we serve", areas.map((a) => ({ href: areaHref(a.slug), label: a.name })))}
        </Card>
      </Reveal>
    </SectionWrapper>
  );
}
