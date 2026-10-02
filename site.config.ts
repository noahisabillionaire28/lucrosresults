/**
 * Single source of truth for everything you'll swap later.
 * NAP (Name / Address / Phone) here feeds the footer AND the LocalBusiness JSON-LD.
 */
type Client = { name: string; slug: string; tall?: boolean };

export const siteConfig = {
  name: "Lucros Results",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://lucrosresults.com", // TODO: set real domain
  tagline: "Marketing for local businesses in Los Angeles.",
  areaServed: "Los Angeles",
  founder: "Noah Fernando",
  founderRole: "Founder",
  founderPhoto: "/founder-noah.jpg",
  founderPhotoAlt: "Noah Fernando, Founder of Lucros Results",

  // NAP — identical on every page. Service-area business: city only, no street address.
  address: "Porter Ranch, CA",
  addressLocality: "Porter Ranch",
  addressRegion: "CA",
  addressCountry: "US",
  phone: "(818) 903-1753", // display format
  phoneTel: "+18189031753", // tel: link
  phoneSchema: "+1-818-903-1753", // JSON-LD
  email: "hello@lucrosresults.com", // TODO: real email

  // Calendly event, embedded inline on /google and /los-angeles. The site redirects to /booked itself
  // when Calendly reports a booking (see components/CalendlyEmbed.tsx).
  calendarLink: "https://calendly.com/noah-lucrosai/lucros-results-discovery-call",
  // Where every other "Book Strategy Call" button points (the embedded calendar)
  bookingPath: "/google#book",
  // Keyless Google Maps embed centered on Porter Ranch, CA
  mapEmbedUrl: "https://www.google.com/maps?q=Porter+Ranch,+CA&z=13&output=embed",
  // TODO: thumbnail image for the video placeholders: drop a 16:9 image in /public and set e.g. "/video-thumb.jpg"
  videoThumbnail: "",
  videoDuration: "2:44",
  // TODO: Wistia / YouTube embed URLs (leave "" to keep the placeholder)
  videos: { home: "", google: "", booked: "" },

  // "Working with..." strip. Logo files go in /public/logos/<slug>.<svg|png|webp|jpg|jpeg|avif> (any size/shape,
  // shown at a fixed height). No file for a slug yet? The company name shows as a gray text stand-in.
  // tall: true shows the logo larger (48px mobile / 64px desktop instead of 24 / 32). Use it for stacked or
  // emblem-style logos, which look small at the default height. Wide wordmark logos should stay default.
  clients: [
    { name: "Mike's Plaza Cleaners", slug: "mikes-plaza-cleaners", tall: true },
    { name: "Ryan Thanam Fitness", slug: "ryan-thanam-fitness", tall: true },
    { name: "Veloce Luxury Rentals", slug: "veloce-luxury-rentals", tall: true },
    { name: "Four Brothers Commercial Maintenance", slug: "four-brothers-commercial-maintenance", tall: true },
    { name: "BRYA", slug: "brya" },
    { name: "Conquer Credit Management (CCMI)", slug: "conquer-credit-management" },
    { name: "Cigar House", slug: "cigar-house" },
  ] as readonly Client[],

  price: "$1,500",
  nav: [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "Areas We Serve", href: "/areas" },
    { label: "Los Angeles", href: "/los-angeles" },
    { label: "Apply", href: "/google#apply" },
  ],
} as const;
