# Evolving into a mural marketplace

V1 exposes only Marc’s marketing site and a project inquiry funnel. All project and lead associations already use artist IDs. No marketplace UI, billing, chat, or matching is implemented.

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
