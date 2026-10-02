import fs from "node:fs";
import path from "node:path";
import { imageSize } from "image-size";
import { siteConfig } from "@/site.config";

export type ClientLogo = { name: string; src?: string; width?: number; height?: number; tall?: boolean };

const EXTS = ["svg", "png", "webp", "jpg", "jpeg", "avif"];

/** Server-only. Looks for /public/logos/<slug>.<ext> at build time; clients without a file fall back to their name as text. */
export function getClientLogos(): ClientLogo[] {
  return siteConfig.clients.map(({ name, slug, tall }) => {
    for (const ext of EXTS) {
      const file = path.join(process.cwd(), "public", "logos", `${slug}.${ext}`);
      if (!fs.existsSync(file)) continue;
      try {
        const { width, height } = imageSize(fs.readFileSync(file));
        if (width && height) return { name, src: `/logos/${slug}.${ext}`, width, height, tall };
      } catch {
        /* unreadable image: fall through to the text stand-in */
      }
    }
    return { name };
  });
}
