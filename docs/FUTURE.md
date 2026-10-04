# Evolving into a mural marketplace

V1 exposes only Marc’s marketing site and a project inquiry funnel. All project and lead associations already use artist IDs. No marketplace UI, billing, chat, or matching is implemented.

## Where V1 already stands
The site presents one artist (`primaryArtist` in `lib/content.ts`) at the root, but nothing below the content file assumes Marc:

- `artists` and `projects` in `lib/content.ts` mirror the `artists`, `projects`, and `project_images` tables (projects carry `artistId`). Swapping the arrays for database reads should not require page changes.
- Header, footer, CTAs, landing pages, project pages, and the inquiry form read names and copy from an `Artist`. Shared copy uses `{first}` / `{name}` tokens filled by `fill()`.
- `CTA`/`requestHref()` link non-primary artists to `/request?artist=<slug>`. The request API resolves that slug against known artists (falling back to the primary artist) and sets `assigned_artist_id` server-side; the client never supplies an ID.
- `ProjectCard` and `/work/[slug]` are artist-agnostic and resolve the artist from the project.

## Hub launch: URL migration
1. Move the current root pages to `app/artists/[artist]/` (home → profile, `/about` folds into the profile, `/work/[slug]` → `/artists/[artist]/work/[slug]`). Use `generateStaticParams` over `artists`.
2. Build the hub home and an artist directory at `/` and `/artists`. Keep `/request` as the global funnel (no `artist` param = unassigned review queue; update the API fallback from `primaryArtist` to `null` at that point).
3. Add permanent redirects in `next.config.ts`: `/about` → `/artists/marc-phillips`, `/work/:slug` → `/artists/marc-phillips/work/:slug`. Landing pages (`/commercial-murals`, `/cumberland-md`, …) can stay at the root as hub-level SEO pages and list matching artists.
4. Split branding: `site.name` becomes the hub name; the header wordmark comes from the hub, with artist names on artist pages.
5. Send notifications to the assigned artist's address rather than the single `LEAD_NOTIFICATION_EMAIL` (keep it as an admin copy).

## Artist identities and onboarding
Add an `artist_users` association between Supabase Auth users and artists. Replace the V1 shared admin session with user sessions and tenant-aware RLS. Add draft/approved onboarding states and service-area records. Keep artist slug URLs separate from the global acquisition funnel. Do not expose artist emails publicly by default.

## Lead matching
`project_requests.assigned_artist_id` is nullable. Add assignment history and matching criteria for geography, project categories, availability, and budget. Keep submission independent of matching so a lead can enter a review queue before assignment. Assignment changes must also change authorized photo access.

## Messaging and quoting
Add conversations, participants, and messages linked to a request, then quotes and quote line items with versioned acceptance. Persist attachments privately. Add authenticated customer access rather than exposing lead IDs or image paths as access credentials.

## Deposits and reviews
Add payment records linked to accepted quotes, with signed provider webhooks and idempotent updates. Keep customer funds and payout logic outside the request submission transaction. Allow reviews only after a verified completed project and use moderation.

## Visualization
Add a separate visualization job table linked to a request and its source image. Capture customer consent, store generated outputs separately, and label them as concepts. Async jobs must not delay or replace inquiry submission.

## Operational growth
V1 saves a lead and its images atomically, then sends email. Add an outbox worker with retries before higher volume; `notification_status` exposes failures now. Move curated content into the existing project tables or a CMS when editing frequency requires it. Add audit events, retention automation, stronger bot protection, and monitoring based on real usage. Keep photos private and enforce artist-scoped access before adding any second artist inbox.
