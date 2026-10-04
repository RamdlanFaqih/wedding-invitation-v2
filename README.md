# Asri — A Little Forever

A mobile-first wedding invitation built with Next.js App Router, React, TypeScript, and Tailwind CSS. The design uses warm ivory paper, olive botanical illustrations, serif typography, and an animated envelope with a wax seal.

## Run locally

Use Node.js 22 LTS (see `.nvmrc`), then:

```sh
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000). For a personalized greeting, open [localhost:3000/?to=Nadia%20%26%20Fajar](http://localhost:3000/?to=Nadia%20%26%20Fajar).

No environment variables or external services are required for the UI preview. The app uses system fonts and original inline SVG illustrations, so rendering does not depend on an external font or image host.

## Implemented

- Animated paper envelope, wax seal, and “Buka Undangan” opening sequence.
- Safe guest-name personalization through the `to` URL parameter.
- Botanical hero, couple monograms, relationship timeline, event cards, and closing note.
- Five supplied couple photos in a responsive gallery, with full-photo viewing, previous/next controls, arrow-key navigation, and Escape to close.
- Live countdown, Google Maps link, and downloadable `.ics` calendar event.
- Mobile navigation with the current section highlighted.
- Native sharing where supported and a clipboard fallback. Shared links omit personalized names.
- Guestbook UI with validation, sample wishes, pagination, and local browser persistence.
- Keyboard focus transfer after opening, reduced-motion support, and responsive layouts.
- Next.js production build, ESLint, TypeScript checks, and Playwright test cases.

## Demo data and guestbook limitation

**Asri Safitri and Agi Gustira, their parents, December 2, 2026, and the Ciamis address are configured from the supplied details.** Ceremony/reception times and bank details are pending; the relationship timeline remains sample content. A preview notice is displayed below the hero. The supplied couple photos appear in the gallery. Individual profile cards retain their designed monograms.

**The guestbook is a UI demo, not a connected backend.** Submissions stay in this browser's `localStorage` and are not sent to the couple or shared with other guests. Sample wishes are explicitly labelled. Up to 50 local entries are retained; newer submissions replace the oldest when this limit is reached. The form reports storage failures without clearing the message.

Before using this invitation for real guests, replace local persistence with the Neon API, moderation, server validation, Turnstile, and persistent rate limits described in [PROJECT_PLAN.md](./PROJECT_PLAN.md). Reserved environment variable names are in `.env.example`; simply filling them does not enable a backend. Do not remove the demo notice until that integration works.

## Customize

| File | What to change |
| --- | --- |
| `src/config/wedding.ts` | Couple names, initials, event date, timezone, venue, map URL, schedule, and story. |
| `src/app/globals.css` | Theme colors, typography, responsive styling, and envelope animation. |
| `src/components/botanical.tsx` | Original botanical vector ornaments. |
| `src/components/envelope.tsx` | Intro layout and opening sequence. |
| `src/components/invitation.tsx` | Main invitation sections and interactions. |
| `src/components/guestbook.tsx` | Demo guestbook and its local storage adapter. |
| `src/app/layout.tsx` | Page title, sharing text, and indexing policy. |

The calendar currently exports an all-day event for December 2, 2026 because event times are not yet confirmed. Once times are confirmed, update both ISO timestamps and the visible schedule, and set `allDay` to `false` for timed UTC calendar entries. The filename and event UID derive from the couple configuration. The map link is an address search; replace it with a confirmed venue pin when available.

The `.isPreview` configuration flag controls the sample-content ribbon only. It does not connect the guestbook. Replace sample content before changing it to `false`.

## Validation

```sh
npm run lint
npm run typecheck
npm run build
npm run test:e2e
```

The Playwright configuration uses installed Google Chrome for desktop and mobile emulation, and starts a local development server automatically. Install Chrome or change `channel` to use Playwright's bundled Chromium, then run `npx playwright install chromium`. The tests cover envelope focus, navigation, guestbook persistence, failed storage, safe guest-name rendering, a 320 px viewport, reduced motion, and calendar download.

During initialization, the environment blocked npm network requests, local listening sockets, and Chrome process startup. Existing local dependency copies and the package cache were used to prepare the installation and lockfile. Browser tests require an unrestricted local environment; do not treat included test cases as a completed visual/device review.

## Deployment

The project is ready for a Vercel UI preview with the standard Next.js preset. Use `npm run build` and leave the default output directory. No deployment has been created by this initialization.

For an eligible personal invitation, follow the Vercel Hobby + Neon Free architecture in [PROJECT_PLAN.md](./PROJECT_PLAN.md). The current static page does not make database requests. Before public launch, finish the backend integration, replace placeholder content, add a real sharing image, and check the invitation on iOS Safari and Android Chrome.

`noindex` is enabled by default. It discourages search indexing but is not access control.

## Bank account information

The “Hadiah” section supports one or more bank accounts configured in `wedding.giftAccounts`. Each entry requires `id`, `bank`, `accountNumber`, and `accountHolder`. Keep the account number as a quoted string to preserve leading zeros. No real account details have been supplied, so the section currently displays an explicit pending state and disables copying.

When complete details are present, the copy button copies the account number without whitespace, reports success, or offers manual copying if clipboard access is unavailable.

## Photo gallery

All five supplied `image-*.jpeg` files are served from `public/images/` and displayed by `src/components/photo-gallery.tsx`. Originals in the repository root are preserved. The JPEGs already total approximately 297 KiB, so they are used without recompression or runtime image transformations. Gallery images load lazily with explicit dimensions; the full-photo dialog preserves the entire composition. Update the photo list to change their order, descriptions, and captions.
