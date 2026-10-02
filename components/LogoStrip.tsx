import { getClientLogos } from "@/lib/clientLogos";
import { LogoMarquee } from "./LogoMarquee";

export function LogoStrip() {
  return <LogoMarquee logos={getClientLogos()} />;
}
