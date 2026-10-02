import sfv from "./content/areas/san-fernando-valley";
import woodlandHills from "./content/areas/woodland-hills";
import calabasas from "./content/areas/calabasas";
import northridge from "./content/areas/northridge";
import porterRanch from "./content/areas/porter-ranch";
import type { AreaPage, AreaSlug } from "./types";

export const areas: AreaPage[] = [sfv, woodlandHills, calabasas, northridge, porterRanch];
export const getArea = (slug: string) => areas.find((a) => a.slug === slug);
export const areaHref = (slug: AreaSlug) => `/areas/${slug}`;
