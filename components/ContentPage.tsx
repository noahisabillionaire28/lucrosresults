import Link from "next/link";
import { areas, areaHref } from "@/lib/areas";
import { services, serviceHref } from "@/lib/services";
import type { AreaPage, ServicePage } from "@/lib/types";
import { siteConfig } from "@/site.config";
import { Card } from "./Card";
import { JsonLd } from "./JsonLd";
import { Reveal } from "./Reveal";
import { RichText, stripLinks } from "./RichText";
import { SectionHeading } from "./SectionHeading";
import { SectionWrapper } from "./SectionWrapper";
import { Stack } from "./Stack";
import { BookCallCTA, FAQSection } from "./sections";

const h2Cls = "!text-[34px] md:!text-[48px]";

function Crumbs({ hubLabel, hubHref, current }: { hubLabel: string; hubHref: string; current: string }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-[15px] text-body">
      <Link href={hubHref} className="underline decoration-black/20 underline-offset-4">{hubLabel}</Link>
      <span className="mx-2">/</span>
      <span>{current}</span>
    </nav>
  );
}

function LinkList({ items }: { items: { href: string; label: string; note?: string }[] }) {
  return (
    <ul className="divide-y divide-black/10">
      {items.map((i) => (
        <li key={i.href}>
          <Link href={i.href} className="flex flex-col gap-1 py-4 md:flex-row md:items-baseline md:gap-6">
            <span className="text-[20px] tracking-[-0.03em] text-black md:w-[320px] md:shrink-0">{i.label} →</span>
            {i.note && <span className="text-[16px] leading-relaxed text-body">{i.note}</span>}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function ContentPage({ kind, page }: { kind: "service" | "area"; page: ServicePage | AreaPage }) {
  const isService = kind === "service";
  const hub = isService ? { label: "Services", href: "/services" } : { label: "Areas We Serve", href: "/areas" };
  const url = `${siteConfig.url}${hub.href}/${page.slug}`;

  const breadcrumb = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: hub.label, item: `${siteConfig.url}${hub.href}` },
      { "@type": "ListItem", position: 3, name: page.name, item: url },
    ],
  };
  const faqLd = {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: page.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: stripLinks(f.a) } })),
  };
  const serviceLd = isService
    ? { "@context": "https://schema.org", "@type": "Service", name: page.h1, description: page.description, url, areaServed: siteConfig.areaServed, provider: { "@type": "LocalBusiness", name: siteConfig.name, url: siteConfig.url } }
    : null;

  return (
    <>
      <JsonLd data={breadcrumb} />
      <JsonLd data={faqLd} />
      {serviceLd && <JsonLd data={serviceLd} />}

      <section className="mx-auto w-full max-w-[1200px] px-6 pb-6 pt-10 md:px-10 lg:px-16 md:pt-16">
        <Crumbs hubLabel={hub.label} hubHref={hub.href} current={page.name} />
        <h1 className="max-w-[1000px] text-[44px] leading-[1.02] tracking-[-0.06em] text-black md:text-[64px]">{page.h1}</h1>
        <div className="mt-6 max-w-[680px] space-y-3 text-[18px] leading-relaxed text-body">
          {page.intro.map((p, i) => <p key={i}><RichText text={p} /></p>)}
        </div>
      </section>

      <SectionWrapper reveal={false}>
        <Stack>
          {page.sections.map((s) => (
            <Card key={s.heading} as="article" className="md:py-14">
              <SectionHeading as="h2" className={h2Cls}>{s.heading}</SectionHeading>
              <div className="mt-6 max-w-[720px] space-y-4 text-[16px] leading-relaxed text-body">
                {s.paragraphs.map((p, i) => <p key={i}><RichText text={p} /></p>)}
                {s.bullets && (
                  <ul className="list-disc space-y-2 pl-5 marker:text-black/40">
                    {s.bullets.map((b, i) => <li key={i}><RichText text={b} /></li>)}
                  </ul>
                )}
              </div>
            </Card>
          ))}
        </Stack>
      </SectionWrapper>

      {!isService && (
        <SectionWrapper reveal={false} className="pt-0 md:pt-0">
          <Reveal>
            <Card>
              <SectionHeading as="h2" className={h2Cls}>Services we offer here</SectionHeading>
              <div className="mt-6">
                <LinkList items={services.map((s) => ({ href: serviceHref(s.slug), label: s.name, note: (page as AreaPage).serviceNotes[s.slug] }))} />
              </div>
            </Card>
          </Reveal>
        </SectionWrapper>
      )}

      <FAQSection items={page.faqs} />
      <BookCallCTA />

      {isService && (
        <SectionWrapper reveal={false} className="pt-0 md:pt-0">
          <Reveal>
            <Card>
              <SectionHeading as="h2" className={h2Cls}>We also serve these areas</SectionHeading>
              <div className="mt-6">
                <LinkList items={areas.map((a) => ({ href: areaHref(a.slug), label: a.name, note: a.short }))} />
              </div>
            </Card>
          </Reveal>
        </SectionWrapper>
      )}
    </>
  );
}
