# Lucros Results — marketing site

Next.js 14 (App Router) · Tailwind CSS · Framer Motion · deploys on Vercel.

## Run
```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (must pass before deploy)
```

## Where every placeholder / TODO lives
Search the repo for `TODO` to find them all. Main ones:

| What | Where |
|---|---|
| Address, phone (display / tel / schema formats), email, domain, tagline, founder, calendar link, map embed, video embeds, founder photo | `site.config.ts` (single source; feeds footer + JSON-LD) |
| Email capture → CRM/email provider (currently redirects to `/thank-you`) | `components/EmailCaptureForm.tsx` |
| Application form submit (currently shows a thanks message only) | `components/ApplicationForm.tsx` |
| Calendly event URL (inline embed on /google and /los-angeles) | `site.config.ts` → `calendarLink` |
| Where other "Book Strategy Call" buttons point | `site.config.ts` → `bookingPath` (`/google#book`) |
| Wistia / YouTube embeds (home, /google, /booked) | `site.config.ts` → `videos` |
| Google Map embed in footer (Porter Ranch, CA) | `site.config.ts` → `mapEmbedUrl` |
| Client logos (5 text placeholders) | `components/LogoMarquee.tsx` |
| Before/After map images (CSS mock grid) | `components/BeforeAfter.tsx` |
| Founder photo | `site.config.ts` → `founderPhoto` (file in `/public`) |
| Terms of Service text | `app/terms/page.tsx` |
| "Areas We Serve" link (phase 2) | `components/Footer.tsx` |
| FAQ / advantages / process copy | `lib/content.ts` |

NAP (city-only address, phone) lives in `site.config.ts` and feeds the footer and the LocalBusiness JSON-LD.

## Pages
`/` · `/google` · `/los-angeles` · `/thank-you` (noindex) · `/booked` (noindex) · `/terms` · `/sitemap.xml` · `/robots.txt`

## Deploy to Vercel
1. Push this repo to GitHub.
2. vercel.com → Add New Project → import the repo (no settings needed).
3. Add env var `NEXT_PUBLIC_SITE_URL` = your production URL (sitemap, canonical, JSON-LD).
4. Deploy, then add your custom domain.

## Phase 2 — SEO content
- Service pages: `lib/content/services/*.ts` → `/services/[slug]` (hub at `/services`)
- Area pages: `lib/content/areas/*.ts` → `/areas/[slug]` (hub at `/areas`)
- Each file is plain data (H1, title, description, sections, FAQs). Edit copy there; templates are `components/ContentPage.tsx` / `HubPage.tsx`.
- In-text links use `[anchor](/path)` markdown inside the strings.
- Add a page: add the slug to `lib/types.ts`, create the content file, register it in `lib/services.ts` or `lib/areas.ts` (sitemap picks it up automatically).
- Validate copy (word count, FAQ count, link rules, meta lengths): `node scripts/check-content.mjs`
- Pages emit BreadcrumbList + FAQPage JSON-LD (service pages also Service).

## Calendly booking
- The calendar is embedded inline in the "Book Your Free Strategy Call" section (`id="book"`) on `/google` and `/los-angeles`. Calendly's script loads only on those pages (`components/CalendlyEmbed.tsx`).
- The site redirects to `/booked` itself when Calendly reports `calendly.event_scheduled`. **Do not** also set a redirect inside Calendly's event settings: it would load `/booked` inside the embed. Leave Calendly's confirmation page on its default.
- Other "Book Strategy Call" buttons link to `/google#book`.
