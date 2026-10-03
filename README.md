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
| Address, phone (display / tel / schema formats), domain, tagline, founder, calendar link, map embed, video embeds, founder photo | `site.config.ts` (single source; feeds footer + JSON-LD) |
| Email capture → CRM/email provider (currently redirects to `/thank-you`) | `components/EmailCaptureForm.tsx` |
| Application form submit (currently shows a thanks message only) | `components/ApplicationForm.tsx` |
| Calendly event URL (inline embed on /google and /losangeles) | `site.config.ts` → `calendarLink` |
| Where other "Book Strategy Call" buttons point | `site.config.ts` → `bookingPath` (`/google#book`) |
| Wistia / YouTube embeds (home, /google, /booked) | `site.config.ts` → `videos` |
| Google Map embed in footer (Porter Ranch, CA) | `site.config.ts` → `mapEmbedUrl` |
| "Working with..." client list + logos | `site.config.ts` → `clients`; logo files in `public/logos/<slug>.<svg/png/webp/jpg>` (see below) |
| Before/After map images (CSS mock grid) | `components/BeforeAfter.tsx` |
| Founder photo | `site.config.ts` → `founderPhoto` (file in `/public`) |
| Terms of Service text | `app/terms/page.tsx` |
| "Areas We Serve" link (phase 2) | `components/Footer.tsx` |
| FAQ / advantages / process copy | `lib/content.ts` |

NAP (city-only address, phone) lives in `site.config.ts` and feeds the footer and the LocalBusiness JSON-LD.

## Pages
`/` · `/google` · `/losangeles` (old `/los-angeles` 301-redirects here; see `next.config.mjs`) · `/thank-you` (noindex) · `/booked` (noindex) · `/terms` · `/sitemap.xml` · `/robots.txt`

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
- The calendar is embedded inline in the "Book Your Free Strategy Call" section (`id="book"`) on `/google` and `/losangeles`. Calendly's script loads only on those pages (`components/CalendlyEmbed.tsx`).
- The site redirects to `/booked` itself when Calendly reports `calendly.event_scheduled`. **Do not** also set a redirect inside Calendly's event settings: it would load `/booked` inside the embed. Leave Calendly's confirmation page on its default.
- Other "Book Strategy Call" buttons link to `/google#book`.

## Client logos ("Working with..." strip)
- Drop a file named after the client slug into `public/logos/` (e.g. `four-brothers-commercial-maintenance.svg`) and redeploy. No code change needed: it replaces the gray text stand-in automatically, shown at a fixed height (24px mobile / 32px desktop), grayscale at 40% opacity.
- Current logos (all in the repo): `mikes-plaza-cleaners`, `ryan-thanam-fitness`, `veloce-luxury-rentals`, `four-brothers-commercial-maintenance`, `brya`, `the-cactus-doctor`. Accepted types: svg, png, webp, jpg, jpeg, avif. A client without a file shows its name as gray text until you add one.
- Add or rename a client in `site.config.ts` → `clients`.
- Best files: SVG or a transparent-background PNG, cropped tight to the logo (extra padding makes it look smaller).
- Logo too small? Stacked/emblem logos can set `tall: true` on their entry in `site.config.ts` (48px mobile / 64px desktop).
- Logos with a solid black or white background should be saved with a transparent background (otherwise they show as a box on the cream page).

## Brand assets (`public/brand/`)
- **In use (black & white):** `logo-tile-bw.svg` / `logo-tile-bw-512.png` (black rounded tile + white mark) power the nav, footer and 3-tips card (`components/Logo.tsx`) and the schema `logo` / `image` (`site.config.ts` → `logoPath`). `logo-mark-white.svg/.png` and `logo-mark-black.svg/.png` are the bare mark on a transparent background (white for dark surfaces, black for light ones).
- **Kept, not used:** the orange versions (`logo-tile.svg`, `logo-tile-512.png`, `logo-mark.svg/.png`), plus `logo-original.png` (source art) and `logo-cropped.png`.
- **Favicons / app icons** live in `public/` with `-v2` in the file name (`favicon-v2.ico` 16/32/48, `icon-v2.png`, `apple-touch-icon-v2.png`, `android-chrome-192x192-v2.png`, `android-chrome-512x512-v2.png`) and `site.webmanifest`, all wired in `app/layout.tsx`. Browsers cache favicons very hard, so **whenever the icon changes, bump the suffix (`-v3`) and the `?v=` on the manifest link.** `/favicon.ico` and `/apple-touch-icon.png` also serve the current icon for crawlers that request those default paths. Do not add `app/favicon.ico`, `app/icon.*` or `app/apple-icon.*`: Next.js would use them instead of the links above.
- `public/og-image-v2.png` is the 1200x630 link-preview image (cream background, tile + wordmark, "Marketing Agency Los Angeles").
- To change the logo: replace the source art, re-trace to the tile SVG, regenerate the PNGs and icons.

## Blog: publishing a post each week

Posts are plain files, so adding one takes about five minutes.

1. **Create the file:** `lib/content/blog/<slug>.ts`. The file name must match the `slug` (it becomes `/blog/<slug>`). Copy any existing post as a starting point.
2. **Fill in the fields:**
   - `slug`: lowercase words with dashes
   - `title`: the H1 and the thumbnail text (plain English, up to ~70 characters)
   - `metaTitle`: the `<title>` tag, up to 65 characters, unique
   - `description`: meta description, 120 to 160 characters, unique
   - `date`: `"YYYY-MM-DD"` (newest date shows first on `/blog`)
   - `body`: array of blocks. `"## Heading"` makes an H2, `"- a\n- b"` makes a bullet list, anything else is a paragraph. Use `**bold**` for key phrases and `[anchor](/services/local-seo)` for links.
3. **Register it:** open `lib/blog.ts`, add an `import` line for the new file and add it to the `all` array. That also adds it to `/blog` and `sitemap.xml`.
4. **Thumbnail:** there is nothing to make. The branded thumbnail (black tile logo on cream plus the post title) is generated from `title` by `components/BlogThumb.tsx`.
5. **Check it:** `node scripts/check-content.mjs` (800 to 1,200 words, at most 8 links, at least 2 to service or area pages, different anchor text for each link, unique title and description). Then `npm run build`, commit and push to `main`.

Every post automatically gets the "3 Tips to Get Found First on Google" card at the end, Article + breadcrumb schema (author Noah Fernando, publisher Lucros Results with the logo), and a canonical URL.
