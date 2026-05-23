# Developer guide

Practical notes for working in this codebase. The [README](../README.md) covers what the project is and how to run it; this file is for "how do I actually change things" recipes.

---

## Local dev essentials

- Node 18.17+ (Node 20 LTS recommended).
- `.env.local` needs at minimum `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` and `NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN`. Everything else is feature-flagged off by default.
- `npm run dev` for hot reload; `npm run build && npm run start` to smoke-test prod output.
- App Router: every folder under `src/app/` is a route. Files named `page.tsx` are pages; `route.ts` files are API handlers.

## Editing the site copy

| What you want to change | Where to look                                      |
| ----------------------- | -------------------------------------------------- |
| Homepage hero copy      | `src/components/sections/Hero.tsx`                 |
| Announcement bar        | `src/components/layout/AnnouncementBar.tsx`        |
| Nav links               | `src/app/shop/catalog.ts` (categories) + `src/components/layout/Header.tsx` |
| Footer                  | `src/components/layout/Footer.tsx`                 |
| FAQ                     | `src/app/FAQ.md`                                   |
| Privacy / Terms         | `public/privacy_policy.md`, `public/terms_of_service.md` |
| Page hero / body copy   | The matching `src/app/<slug>/page.tsx`             |

## Shopify data flow

- Storefront API client: `src/lib/shopify.ts` (`getStorefrontClient()`).
- The shop reads collections by handle from `src/app/shop/catalog.ts`. **If you create a new collection in Shopify, you must also add it to `catalog.ts`** — products that aren't in any configured collection won't appear in the nav or category pages.
- Cart state is managed by Shopify (`Cart` API). The app stores a cart ID in a cookie and POSTs through `/api/cart/*`.
- Product variants drive the Jade Bar builder via `/api/jade-bar/variants`.

## Adding a form

1. Add a `FormType` and column map to `FORM_SHEETS` in `src/lib/sheets.ts`.
2. Build a client form component (see `src/app/contact/ContactForm.tsx` for a reference shape).
3. POST `{ formType: 'your_form_type', ...fields }` to `/api/forms/submit`.
4. Make sure the Google Sheet has a tab named whatever you set in `FORM_SHEETS[type].sheetName`; the route will populate columns on first write.

## Feature flags

| Flag                                       | Effect                                       |
| ------------------------------------------ | -------------------------------------------- |
| `NEXT_PUBLIC_LAUNCH_COUNTDOWN_ENABLED`     | Shows the pre-launch overlay                 |
| `NEXT_PUBLIC_LAUNCH_TEST_MODE`             | Collapses the countdown to ~10s for QA       |
| `CUSTOMER_ACCOUNTS_ENABLED`                | Enables Shopify Customer Accounts sign-in    |
| `NEXT_PUBLIC_JADE_BAR_PASSWORD`            | Password to unlock `/jade-bar/builder`       |
| `NEXT_PUBLIC_LAUNCH_ACCESS_PASSWORD`       | Team-access bypass for the countdown         |
| `NEXT_PUBLIC_LAUNCH_ACCESS_RESET_TOKEN`    | Bump to invalidate previously-granted access |

## Styling

- Tailwind first. `tailwind.config.js` defines the theme (colors, fonts mapped to CSS variables, plugin set).
- Two font families wired through `src/app/layout.tsx`: `font-heading` (Reckless Neue) and `font-body` (Neue Haas Grotesk Display).
- `src/styles/legacy.css` carries a small amount of CSS inherited from the original site. Prefer Tailwind for new work; only touch `legacy.css` when matching legacy markup.

## Auth

The active sign-in flow is **Shopify Customer Accounts (OAuth + PKCE)**. See [`auth_customer_accounts.md`](./auth_customer_accounts.md). NextAuth is still wired but unused — see [`../AUTH.md`](../AUTH.md) for context and removal steps.

## Things that look weird but are intentional

- **`src/components/ui/liquid-glass.tsx` and `magnifier-lens.tsx`** are imported by `JewelryBoxReveal`, `MissionBanner`, and `LaunchCountdown`. They're stylized FX components, not generic UI primitives.
- **`public/Jade Bar Products  - Jades .csv`** is an operations reference, not loaded at runtime.
- **`AUTH.md` + `docs/auth_customer_accounts.md`** describe two different auth systems. The README explains which is active.
- **NextAuth `Providers` wrapper in `layout.tsx`** is harmless even when Customer Accounts is active; remove it as part of retiring NextAuth (see `AUTH.md`).

## Things to delete when you're confident

(These were left in place during the handoff because removing them touches working code paths.)

- `next-auth` + `Providers.tsx` + `[...nextauth]/route.ts` once Customer Accounts is locked in.
- `NEXT_PUBLIC_LAUNCH_*` env vars and `LaunchCountdown` once the site has been live for a while.

## Deploying

Vercel auto-deploys from `main` once the repo is connected. Mirror all env vars from `.env.local` into Vercel's project settings. Security headers (HSTS, X-Frame-Options, etc.) come from `next.config.js` and apply automatically.
