# Marc Phillips — mural project inquiries

Next.js App Router, TypeScript, Tailwind CSS, React Hook Form + Zod, and Supabase. An editorial marketing site with five service/location landing pages, a nine-step photo inquiry flow, and a small protected lead inbox. It launches as Marc's portfolio and is structured to grow into a multi-artist mural hub: artist and project content is data in `lib/content.ts` (mirroring the database tables), and pages read from an artist record rather than hard-coding Marc. See `docs/FUTURE.md` for the hub migration path.

## 1. Local setup
Use Node.js 22+ (Node 24 recommended).

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000. Without Supabase/signing configuration the marketing pages render, but uploads and submission are disabled with a clear notice. No fake successful leads are generated.

Checks:

```sh
npm run lint
npm run typecheck
npm run build
```

## 2. Environment variables
- `NEXT_PUBLIC_SITE_URL`: canonical HTTPS origin in production, without a trailing slash.
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL.
- `SUPABASE_SERVICE_ROLE_KEY`: server-only service key. Never expose it in browser code.
- `UPLOAD_SIGNING_SECRET`: random secret, at least 32 characters, signs one-hour upload sessions and photo proofs.
- `ADMIN_SESSION_SECRET`: separate random secret, at least 32 characters, signs eight-hour admin cookies.
- `ADMIN_PASSWORD_HASH`: salt:scrypt-hash generated as below.
- `LEAD_NOTIFICATION_EMAIL`: Marc’s confirmed notification address.
- `RESEND_API_KEY`: optional locally; required for production notification delivery.
- `EMAIL_FROM`: sender at your Resend-verified domain, e.g. `Mural inquiries <inquiries@your-domain.com>`.

Generate each signing secret with `openssl rand -hex 32`. Generate an admin hash without putting the password in command history:

```sh
read -rs -p 'Admin password: ' MARC_PASSWORD
export MARC_PASSWORD
node -e 'const c=require("node:crypto");const s=c.randomBytes(16).toString("hex");console.log(s+":"+c.scryptSync(process.env.MARC_PASSWORD,s,64).toString("hex"))'
unset MARC_PASSWORD
```

Paste the resulting hash into the environment variable. Use a strong unique password. Do not commit `.env.local` or deployment credentials.

## 3. Supabase setup
Create a Supabase project and copy its project URL and server-only service key to your local and production environments. The browser does not connect directly to the database or storage; API routes validate all requests before using the service client.

## 4. Database migrations
Apply `supabase/migrations/202610040001_initial.sql` in the Supabase SQL editor, or link with the Supabase CLI and run `supabase db push`. Apply once to a new database; use new migration files for changes. The migration seeds Marc’s artist UUID; keep this aligned with `site.artistId` if importing another dataset. No unverified portfolio projects are seeded.

Tables: artists, projects, project_images, project_requests, request_images, and rate_limits. RLS is enabled and anonymous/authenticated access to private data is revoked. `submit_project_request` atomically saves a lead and its photos. Service-role-only RPCs handle submissions and distributed rate limits.

## 5. Storage
The migration creates **private** bucket `request-images`, 8 MB limit per image, JPG/PNG/WebP only. Do not add public-read or anonymous-write storage policies. Upload routes validate actual image signatures, cap session uploads at 12, and save under random session/image IDs. Image paths are stored in `request_images.image_url`; the historical field name does not imply public URLs. The inbox generates one-hour signed links; notification links expire after seven days.

Mobile camera and photo library are separate controls. Export HEIC photos as JPG when the device does not automatically convert. Maximum 12 wall and inspiration photos combined.

Photos uploaded but not submitted (or removed from the form) remain private. Before launch, schedule cleanup: list objects older than 24 hours and remove only those whose paths do not occur in `request_images.image_url`. Never blindly delete a session prefix. Delete associated storage objects when honoring a lead deletion request; row deletion alone does not remove objects.

## 6. Email
V1 implements Resend using fetch with a small `EmailProvider` abstraction in `lib/email.ts`. Verify a sender domain, configure `RESEND_API_KEY`, `EMAIL_FROM`, and `LEAD_NOTIFICATION_EMAIL`. Local development without a provider logs the full notification payload instead of failing. Do not use production customer data in local logs.

The lead is saved before email is attempted. Notification failures do not lose the lead: the inbox shows `pending`/`failed`/`sent`. Check failed notifications in the inbox and contact the lead directly. V1 has no automatic retry queue; add an outbox worker when operational volume requires it. Production without provider credentials marks notification delivery failed rather than silently logging personal data.

## 7. Vercel / GitHub deployment
Create a private GitHub repository, push this directory, and import it into Vercel as a Next.js project. Use Node 24, default build command `npm run build`, root directory `.`. Configure all variables above for production, and separate Supabase credentials for previews. Set the canonical origin to the actual production domain, then redeploy because metadata is generated at build time.

```sh
git init -b main
git add .
git commit -m "Build Marc Phillips mural inquiry site"
gh repo create marc-phillips-murals --private --source=. --push
npx vercel link
npx vercel deploy --prod
```

Repository/deployment creation requires authenticated GitHub/Vercel access. Never bypass a denied connection or publish secrets. Before opening inquiries, test a real upload, successful saved lead, notification, inbox photo links, and status change against your configured Supabase project. Add Vercel firewall limits for `/api/admin/login` and `/api/upload` in addition to database rate limiting.

## 8. Content and launch checklist
All editable copy lives in `lib/content.ts`. Visible "placeholder" notes have been removed from the public site; the items below are what still needs Marc before launch.

- [ ] **Bio.** `artists[0].bio` is a draft written only from what the two murals show (Cumberland/Western Maryland, postcard-style tribute, lettering on brick). Marc should approve or rewrite it. Avoid unverified clients, prices, awards, or years of experience.
- [ ] **Contact email.** Set `artists[0].email`. It then appears in the footer and in the privacy page's removal instructions (which otherwise say "reply to your project correspondence").
- [ ] **Privacy retention.** Have the privacy wording reviewed and confirm the retention period.
- [ ] **Fort Hill Sentinels location.** `location` is empty until confirmed.
- [ ] **Photo in context.** The person in `cumberland-mural-in-context.jpg` is not identified on the site. If it is Marc and he is happy to be named, add a portrait/caption on the About page.
- [ ] **More work.** Add entries to `projects` (image in `public/`, alt text, pixel dimensions; `cover` is the card image, `images` the project-page gallery). Each gets a page at `/work/[slug]` and a sitemap entry; `featured` controls the home grid.
- [ ] **Production env + end-to-end test** (sections 2, 6, 7): a real upload, a saved lead, the notification email, inbox photo links, and a status change.

`public/mural-concept.webp` is an unused generated concept, not Marc's work; it can be deleted.

### Design system
Tokens (colors, gutter, max width) are CSS variables at the top of `app/globals.css`. Type is Bricolage Grotesque (headings/body) with Instrument Serif italic for `<em>` accents, loaded with `next/font` in `app/layout.tsx`. The favicon is `app/icon.svg`.

## Lead inbox
Go to `/admin`, sign in, expand a lead to see details and private photos, then change its status. Unauthorized requests redirect to sign-in; API mutations separately enforce the signed admin session and same-origin requests. Sessions are HTTP-only, secure in production, and expire after eight hours. The inbox paginates 25 leads at a time. No customer photos are published in the portfolio.

## Architecture
- `app/`: marketing, metadata routes, request flow, admin, APIs.
- `components/`: shell and mobile request form.
- `lib/`: content, schema, Supabase server client, security, email provider.
- `supabase/migrations/`: database, storage, RLS, atomic submissions, rate limits.
- `docs/FUTURE.md`: marketplace evolution without building it into V1.

V1 does not retain draft personal data in browser storage. Form state survives back/forward step navigation but a page refresh starts again. An expired upload session requires restarting; no saved lead is shown until the database confirms success. The server uses the session UUID for duplicate-submit protection.

## Configured Supabase project
The initial schema and private storage bucket have been applied to **Mural me** (`lhlxdrmmouggzwherrzn`). Set `NEXT_PUBLIC_SUPABASE_URL=https://lhlxdrmmouggzwherrzn.supabase.co` and the project’s server-only secret key in deployment settings. The existing `SUPABASE_SERVICE_ROLE_KEY` variable accepts a modern `sb_secret_…` key as well as a legacy service role key. Do not put it in this repository or chat.

Database verification confirmed atomic lead/image inserts, RLS on all six tables, denied anonymous lead access, and a private image bucket. Verification records were rolled back. The Supabase-created `rls_auto_enable()` event helper had public execution revoked; the remaining security advisor notices describe the intentional absence of client-access policies. See [Supabase’s advisor explanation](https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy). Browser upload and email verification still require deployment environment configuration.
