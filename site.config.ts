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

  // NAP — identical on every page. Service-area business: city only, no street address.
  address: "Porter Ranch, CA",
  addressLocality: "Porter Ranch",
  addressRegion: "CA",
  addressCountry: "US",
  phone: "(818) 903-1753", // display format
  phoneTel: "+18189031753", // tel: link
  phoneSchema: "+1-818-903-1753", // JSON-LD
  email: "hello@lucrosresults.com", // TODO: real email

  // Booking link. Opens in a new tab. Set Calendly's confirmation redirect to /booked (see README).
  calendarLink: "https://calendly.com/noah-lucrosai/lucros-results-discovery-call",
  // Keyless Google Maps embed centered on Porter Ranch, CA
  mapEmbedUrl: "https://www.google.com/maps?q=Porter+Ranch,+CA&z=13&output=embed",
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
