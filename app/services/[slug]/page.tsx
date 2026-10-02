import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentPage } from "@/components/ContentPage";
import { getService, services } from "@/lib/services";

export const dynamicParams = false;
export const generateStaticParams = () => services.map((s) => ({ slug: s.slug }));

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const s = getService(params.slug);
  if (!s) return {};
  return { title: s.title, description: s.description, alternates: { canonical: `/services/${s.slug}` } };
}

export default function ServicePageRoute({ params }: { params: { slug: string } }) {
  const s = getService(params.slug);
  if (!s) notFound();
  return <ContentPage kind="service" page={s} />;
}
