# Mobile Wedding Invitation — Project Initialization Plan

Date: October 5, 2026  
Status: Planning only; application implementation has not started.

## 1. Goal and Assumptions

Build an elegant, mobile-first wedding invitation website that guests can open directly from WhatsApp, read event details, and use to leave prayers and wishes for the couple.

- Deliver a responsive website, with no installation required.
- Start with one wedding and an Indonesian guest-facing interface.
- Plan for approximately 300–1,000 invited guests and occasional traffic bursts. These are sizing assumptions, not confirmed requirements.
- Target USD 0 recurring infrastructure cost within provider free-tier limits.
- Assume a personal, non-commercial invitation. Reassess hosting eligibility if this becomes a paid invitation business.
- Keep wedding content in a typed configuration file; use the database for guest submissions.

## 2. Recommended Tech Stack

| Layer | Recommendation | Reason |
| --- | --- | --- |
| Frontend | Next.js App Router + React + TypeScript | One codebase for the invitation and backend endpoints; statically render most content. |
| Styling | Tailwind CSS + CSS transitions | Responsive styling with minimal animation overhead. |
| Backend | Next.js Route Handlers on Vercel, Node.js runtime | No separate backend server or hosting subscription. |
| Database | Neon PostgreSQL Free | Persist wishes using standard SQL and a managed database. |
| Database access | Drizzle ORM + Neon serverless driver | Typed queries, versioned migrations, and serverless-friendly connections. |
| Validation | Zod | Share request schemas and validate all submissions on the server. |
| Spam protection | Cloudflare Turnstile + honeypot + database-backed rate limits | Protect the public form without adding a paid cache service. |
| Hosting | Vercel Hobby | Simple deployment for an eligible personal project. |
| Media | Precompressed images and optional audio in `public/` | Avoid a separate media service for a small, fixed gallery. |
| Package manager | npm with a committed lockfile | Simple setup and reproducible installs. |
| Verification | ESLint, TypeScript, Vitest, Playwright | Static checks plus focused API and mobile-flow tests. |

Neon serves as the database in this architecture. Backend validation, abuse checks, and API logic run inside Next.js on Vercel. Database credentials never reach the browser.

Use stable package releases at implementation time, then commit the lockfile and pin a supported Node.js LTS version compatible with Next.js and Vercel. The official [Next.js installation guide](https://nextjs.org/docs/app/getting-started/installation) documents the scaffold options.

### Alternatives

| Option | When to choose it | Tradeoff |
| --- | --- | --- |
| Next.js + Neon — recommended | One invitation with a modest guestbook | Small operational footprint and one application repository. |
| Next.js + Supabase | Later requirements include integrated authentication, uploads, or realtime updates | Broader platform surface; verify its current plan limits before adopting. |
| Astro + serverless API + Neon | Almost entirely static content and an experienced Astro maintainer | Requires a separate decision about API integration and deployment. |

Do not add a dedicated Express/NestJS service, Redis, a CMS, or realtime infrastructure to the initial scope.

## 3. MVP Scope

### Invitation experience

- Cover with couple names, wedding date, and an “Open Invitation” button.
- Optional greeting from `?to=Guest%20Name`; treat it as untrusted display text, never authentication.
- Couple profiles and an optional short introduction or quotation.
- Ceremony and reception details with venue, address, and explicit timezone.
- Countdown that changes to a suitable message after the event starts.
- Google Maps link, avoiding a paid maps API or a heavy embedded map.
- Small optimized photo gallery.
- Downloadable calendar event using `.ics`.
- Guest wishes section and closing message.
- Link preview metadata with a generic couple image and title for WhatsApp sharing.

### Guest wishes and prayers

- Guests can submit a display name and a plain-text prayer/wish without creating an account.
- Name: 2–80 characters; message: 5–1,000 characters after trimming.
- Explain that approved names and messages will be public.
- New submissions enter `pending` moderation status.
- Show a clear “Your message has been received and is awaiting approval” confirmation.
- Display approved wishes newest first, 20 at a time, with a “Load more” button.
- Include loading, empty, validation, rate-limit, and temporary failure states.
- Preserve form input after a failed request; disable repeated submission while a request is pending.
- Exclude replies, reactions, uploads, and guest editing from the MVP.

### Owner moderation

For the smallest launch, the technical owner reviews submissions through the Neon dashboard and approves, rejects, or deletes them using documented, parameterized SQL examples. No public admin mutation endpoint is needed.

If the couple needs to moderate independently, add a protected admin interface before handover. Use an established authentication library with an allowlisted owner account and server-side authorization on every moderation operation. This is an additional milestone, not part of the minimum technical-owner launch.

### Optional follow-up features

- RSVP with attendance and party size, stored separately from public wishes.
- Gift information with copy-to-clipboard controls.
- Background music that starts only after guest interaction, with an accessible mute control.
- Protected owner dashboard and CSV export.
- Private invitation tokens if access control becomes a requirement.

## 4. Architecture and Request Flow

```text
Guest browser
  ├── Static invitation, images, fonts ──> Vercel CDN
  ├── GET /api/wishes ──────────────────> Next.js API ──> Neon PostgreSQL
  └── POST /api/wishes ─────────────────> Next.js API
                                           ├── Validate request + origin
                                           ├── Verify Turnstile server-side
                                           ├── Enforce persistent rate limit
                                           └── Insert pending wish in Neon

Technical owner ──> Neon dashboard ──> Approve / reject / delete
```

- Statically render the invitation without querying Neon during the page build.
- Fetch wishes when the guest approaches or opens the wishes section, so browsing the cover does not wake the database.
- Begin with uncached wishes API responses for predictable moderation visibility; add explicit short-lived caching only if measured traffic warrants it.
- Use pagination and explicit user refresh; do not poll or use WebSockets.
- Choose nearby Vercel function and Neon regions from those available on the selected plans; prioritize low latency for Indonesian guests.
- Keep event details usable if the database or comment service is temporarily unavailable.

## 5. Data Model and API Contract

### `wishes`

| Column | Type / constraint | Purpose |
| --- | --- | --- |
| `id` | UUID primary key | Public message identifier. |
| `display_name` | VARCHAR(80), not null | Guest-provided name; not verified identity. |
| `message` | TEXT, not null, length check | Plain-text wish, 5–1,000 characters. |
| `status` | Enum: pending / approved / rejected; default pending | Moderation state, set by the server. |
| `submission_id` | UUID, unique, not null | Idempotency key to prevent duplicate inserts after retries. |
| `created_at` | TIMESTAMPTZ, default now | Stable ordering and display date. |
| `moderated_at` | Nullable TIMESTAMPTZ | Last moderation timestamp. |

Add an index on `(status, created_at DESC, id DESC)` and matching database constraints for valid names and messages. Use a cursor containing both timestamp and ID for deterministic pagination.

### `submission_limits`

Store a short-lived keyed hash of the trusted client IP, a time-window start, an attempt count, and an expiry timestamp. Use an atomic database operation for concurrent requests; an in-memory counter is insufficient across Vercel function instances. Start with 3 attempts per 10 minutes per IP, then adjust for guests sharing Wi-Fi. Store no raw IP addresses. Delete expired rows opportunistically during writes and during owner maintenance.

### Endpoints

| Endpoint | Contract |
| --- | --- |
| `GET /api/wishes?cursor=...&limit=20` | Approved wishes only; public fields only; validated cursor; maximum 20 items; next cursor or null. |
| `POST /api/wishes` | Accept name, message, submission ID, Turnstile token, and honeypot field; validate and persist a pending wish. |

Responses: `201` for a new submission, `200` for a matching idempotent retry, `400` for malformed input or failed verification, `409` for a reused submission ID with different content, `413` for an oversized body, `429` for rate limiting, and `503` for a temporary dependency failure. Never return SQL errors or secrets.

Enforce a small request-size limit, such as 16 KB. A duplicate retry must use a fresh Turnstile token when verification is needed again. Never expose pending message content through an idempotency lookup.

## 6. Security, Privacy, and Reliability

- Validate on the server regardless of browser validation; use parameterized database queries.
- Render wishes as text, without raw HTML or Markdown rendering.
- Verify Turnstile tokens server-side, including expected hostname and action; reject writes if verification fails. Turnstile offers a [free plan](https://developers.cloudflare.com/turnstile/plans/).
- Restrict browser submissions to the expected origin; origin checks supplement, rather than replace, bot controls.
- Keep `DATABASE_URL`, Turnstile secret, and rate-limit hash secret server-only.
- Use a restricted runtime database role for approved reads, pending inserts, and rate-limit operations; keep migrations and moderation on separate privileged credentials.
- Do not log message bodies, guest names, invitation query strings, tokens, or database connection strings.
- Keep preview deployments on a separate development database or branch and separate Turnstile configuration.
- Add `noindex` metadata by default. This discourages indexing but does not make the invitation private; anyone with the URL can access it.
- Provide an owner contact for removal requests and decide retention after the event, for example export approved wishes and remove online submissions after 90 days.
- Use database exports before migrations and after the event; rehearse restoring into a development database.
- Include a server-side switch to disable new submissions while preserving the invitation page.

## 7. Mobile UX and Performance Targets

- Support 320–430 px phones, tablets, and desktop without horizontal scrolling.
- Use readable body text, visible labels, adequate contrast, and touch targets of approximately 44 px.
- Keep the page primarily static; use client components only for interactive elements.
- Aim for LCP ≤2.5 seconds, CLS ≤0.1, and INP ≤200 ms under representative conditions; verify with lab tests and field data when available.
- Target less than 1 MB for the initial view, excluding deferred gallery images and optional audio.
- Precompress responsive WebP/AVIF assets, set image dimensions, and lazy-load below-the-fold photos.
- Use locally hosted, licensed font files with limited weights.
- Respect reduced-motion preferences and avoid scroll hijacking, autoplay video, and large animation libraries.
- Test Android Chrome, iOS Safari, and links opened from WhatsApp on real devices where available.
- Store timestamps in UTC; configure the actual wedding timezone explicitly, initially `Asia/Jakarta` only if appropriate for the venue.

## 8. Cost Plan

Provider details were checked on October 5, 2026. Free tiers can change; verify dashboard entitlements again before launch.

| Item | Planned recurring cost | Relevant condition |
| --- | --- | --- |
| Vercel Hobby | USD 0 | Personal, non-commercial use; usage limits apply. |
| Neon Free | USD 0 | Stay within the project's storage and compute allowances. |
| Cloudflare Turnstile Free | USD 0 | Use the free plan for the public guestbook form. |
| Default Vercel subdomain | USD 0 | Use the provided deployment domain. |
| Custom domain | Optional annual charge | Registrar-specific; excluded from the zero-cost target. |
| Fixed media in the repository | No separate storage subscription | Delivered media still consumes hosting transfer allowance. |

Vercel currently lists 100 GB of fast data transfer and 1 million function invocations among Hobby allowances, alongside separate CPU and memory limits. Its documentation restricts Hobby to personal, non-commercial use and notes that exceeding allowances can require waiting for usage to reset. See [Vercel Hobby documentation](https://vercel.com/docs/plans/hobby).

Neon's October 2, 2026 announcement lists 1 GB of database storage and 100 CU-hours per project per month on Free. Its listed instant restore window is six hours, so maintain separate exports for longer-term recovery. See [Neon's Free plan announcement](https://neon.com/blog/neon-free-plan-1-gb-per-project).

Planning example: 1,000 guests × 3 visits × 3 MB of transferred assets is approximately 9 GB of transfer. This is an estimate, not a capacity guarantee; bots, gallery size, API usage, and other projects sharing allowances also matter. Text wishes are unlikely to dominate storage at this scale, but monitor real database usage.

Cost controls:

- Keep assets small and avoid video backgrounds or large audio tracks.
- Avoid repeated database reads, polling, and keep-alive jobs.
- Check provider dashboards during development, before distributing invitations, and around the wedding date.
- Use free plans explicitly; do not enable paid upgrades or add-ons without a separate budget decision.
- If limits approach exhaustion, disable writes or reduce media while retaining a usable static invitation.
- Archive the invitation and export wishes after the event if continued hosting is unnecessary.

## 9. Proposed Project Structure

```text
src/
  app/
    layout.tsx
    page.tsx
    globals.css
    api/wishes/route.ts
  components/
    invitation/
    wishes/
    ui/
  config/wedding.ts
  db/
    index.ts
    schema.ts
  lib/
    validation.ts
    turnstile.ts
    rate-limit.ts
    calendar.ts
public/
  images/
  fonts/
drizzle/
tests/
  integration/
  e2e/
.env.example
drizzle.config.ts
PROJECT_PLAN.md
README.md
```

Planned environment variables:

```dotenv
DATABASE_URL=
MIGRATION_DATABASE_URL=
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
RATE_LIMIT_HASH_SECRET=
WISHES_ENABLED=true
```

Populate `.env.example` with placeholders only; ignore local environment files. Keep migration credentials out of the deployed runtime environment.

## 10. Implementation Milestones

Estimated effort: 4–6 focused developer days for the technical-owner MVP, assuming final content and photos are ready. Custom design revisions and a dedicated admin dashboard add time.

### Phase 1 — Initialize the project (half a day)

- Scaffold Next.js with TypeScript, App Router, Tailwind CSS, ESLint, and `src/`.
- Pin the runtime and commit the dependency lockfile.
- Set up formatting, lint, typecheck, build, and test scripts.
- Create the proposed folders, `.env.example`, and README setup instructions.
- Add a typed wedding configuration containing explicit placeholders for missing details.

Exit condition: the starter app runs locally and passes lint, typecheck, and production build.

### Phase 2 — Build the invitation (1–2 days)

- Implement the cover, event information, gallery, calendar link, and closing sections.
- Add safe guest-name personalization and share metadata.
- Optimize photos, fonts, accessibility, and responsive layouts.

Exit condition: the invitation works on small screens with finalized content and no database dependency.

### Phase 3 — Implement the guestbook (1–1.5 days)

- Create Neon development and production environments.
- Add reviewed Drizzle migrations, indexes, constraints, and restricted runtime access.
- Implement validation, Turnstile verification, persistent throttling, idempotency, and pagination.
- Build the wishes form, approved list, and failure states.
- Document and verify the owner moderation workflow.

Exit condition: a guest can submit a wish, an owner can approve it, and only approved wishes appear publicly.

### Phase 4 — Verify and deploy (1 day)

- Test validation, failed bot checks, concurrent rate limits, duplicate retries, and moderation filtering.
- Test a complete submit → approve → display flow against a development database.
- Verify pagination for equal timestamps and that rejected/pending records cannot leak.
- Test mobile layouts, keyboard navigation, sharing, and unavailable-database behavior.
- Connect the repository to Vercel, configure environment scopes, and apply production migrations once through a controlled release step.
- Deploy, check production Turnstile hostname settings, and perform a real-device smoke test.

Exit condition: the public URL works, event details remain available during guestbook failure, and the owner can moderate and export wishes.

### Phase 5 — Handover and event operations (half a day)

- Document content edits, deployments, moderation, exports, restore steps, and submission shutdown.
- Check usage and create an export before the main invitation distribution.
- Assign an owner to monitor pending wishes during the invitation period.
- Export wishes after the wedding and apply the agreed retention policy.

## 11. MVP Acceptance Checklist

- [ ] Final names, dates, venue, timezone, photos, and map links are correct.
- [ ] Invitation works on 320 px screens and common mobile browsers.
- [ ] WhatsApp sharing shows the expected generic preview.
- [ ] Wishes persist across refreshes and deployments.
- [ ] Guests receive clear pending-moderation confirmation.
- [ ] Only approved wishes are publicly accessible.
- [ ] Validation, bot checks, rate limits, and duplicate protection work server-side.
- [ ] No credentials or private metadata appear in browser responses or logs.
- [ ] Preview environments cannot modify production submissions.
- [ ] The owner can moderate, export, and restore data using documented steps.
- [ ] The static invitation remains usable when guestbook dependencies fail.
- [ ] Hosting is eligible for the selected free plan and usage has been reviewed.

## 12. Inputs Needed Before Implementation

- Couple and family names, event schedule, venue, map URL, and timezone.
- Preferred visual direction, colors, reference invitations, and final photos.
- Confirmation that this is a personal invitation and approximate guest count.
- Default Vercel subdomain or an existing custom domain.
- Technical-owner moderation or a couple-operated admin interface.
- Whether RSVP, gift details, or music should be added after the core MVP.

These inputs can be collected while scaffolding proceeds; use visible placeholders until confirmed.
