/**
 * Single source of truth for everything you'll swap later.
 * NAP (Name / Address / Phone) here feeds the footer AND the LocalBusiness JSON-LD.
 */
export const siteConfig = {
  name: "Lucros Results",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://lucrosresults.com", // TODO: set real domain
  tagline: "Marketing for local businesses in Los Angeles.",
  areaServed: "Los Angeles",
  founder: "Noah Fernando",
  founderRole: "Founder",
  // TODO: add a photo at /public/noah.jpg and set to "/noah.jpg"
  founderPhoto: "",

  // NAP — identical on every page
  address: "[NAP_ADDRESS_PLACEHOLDER]",
  phone: "[NAP_PHONE_PLACEHOLDER]",
  email: "hello@lucrosresults.com", // TODO: real email

  // TODO: paste your real calendar booking link (Calendly, Cal.com, etc.)
  calendarLink: "#",
  // TODO: Google Maps embed URL (Maps > Share > Embed a map > copy the src="...")
  mapEmbedUrl: "",
  // TODO: Wistia / YouTube embed URLs (leave "" to keep the placeholder)
  videos: { home: "", google: "", booked: "" },

  price: "$1,500",
  nav: [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "Areas We Serve", href: "/areas" },
    { label: "Los Angeles", href: "/los-angeles" },
    { label: "Apply", href: "/google#apply" },
  ],
} as const;

export const isPlaceholder = (v: string) => v.includes("PLACEHOLDER");
