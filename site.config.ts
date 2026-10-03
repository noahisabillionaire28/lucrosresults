/**
 * Single source of truth for everything you'll swap later.
 * NAP (Name / Address / Phone) here feeds the footer AND the LocalBusiness JSON-LD.
 */
type Client = { name: string; slug: string; tall?: boolean };

export const siteConfig = {
  name: "Lucros Results",
  // TODO: set NEXT_PUBLIC_SITE_URL to the real domain. Until then Vercel's production URL is used (so canonical
  // URLs, the sitemap and og:image links point at a live site), with lucrosresults.com as the last fallback.
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "https://lucrosresults.com"),
  tagline: "Marketing for local businesses in Los Angeles.",
  areaServed: "Los Angeles",
  founder: "Noah Fernando",
  founderRole: "Founder",
  founderPhoto: "/founder-noah.jpg",
  // Brand logo (black tile + orange mark, 512x512 PNG) used in the LocalBusiness schema `logo` and `image`.
  logoPath: "/brand/logo-tile-512.png",
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

  // Calendly event, embedded inline on /google and /losangeles. The site redirects to /booked itself
  // when Calendly reports a booking (see components/CalendlyEmbed.tsx).
  calendarLink: "https://calendly.com/noah-lucrosai/lucros-results-discovery-call",
  // Where every other "Book Strategy Call" button points (the embedded calendar)
  bookingPath: "/google#book",
  // Keyless Google Maps embed centered on Porter Ranch, CA
  mapEmbedUrl: "https://www.google.com/maps?q=Porter+Ranch,+CA&z=13&output=embed",
  // TODO: thumbnail image for the video placeholders: drop a 16:9 image in /public and set e.g. "/video-thumb.jpg"
  videoThumbnail: "",
  videoDuration: "2:44",
  // TODO: /losangeles hero video: thumbnail image (16:9, in /public) + embed URL (Wistia / YouTube)
  losAngelesThumbnail: "",
  losAngelesVideoDuration: "3:03",
  // TODO: Wistia / YouTube embed URLs (leave "" to keep the placeholder)
  videos: { home: "", google: "", booked: "", losangeles: "" },

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
    { name: "The Cactus Doctor", slug: "the-cactus-doctor", tall: true },
  ] as readonly Client[],

  price: "$1,500",
  nav: [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "Areas We Serve", href: "/areas" },
    { label: "Los Angeles", href: "/losangeles" },
    { label: "Apply", href: "/google#apply" },
  ],
} as const;
