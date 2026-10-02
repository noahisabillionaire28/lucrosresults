import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentPage } from "@/components/ContentPage";
import { areas, getArea } from "@/lib/areas";

export const dynamicParams = false;
export const generateStaticParams = () => areas.map((a) => ({ slug: a.slug }));

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const a = getArea(params.slug);
  if (!a) return {};
  return { title: a.title, description: a.description, alternates: { canonical: `/areas/${a.slug}` } };
}

export default function AreaPageRoute({ params }: { params: { slug: string } }) {
  const a = getArea(params.slug);
  if (!a) notFound();
  return <ContentPage kind="area" page={a} />;
}
