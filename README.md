# Tomi Jewelry Storefront

A custom Next.js storefront for [Tomi Jewelry](https://tomijewelry.com) backed by the Shopify Storefront API. The marketing site, shop, cart, Jade Bar product builder, contact / repair / appointment forms, and customer accounts all live in this repo.

> **Handoff note:** this README is the source of truth for getting the site running, finding things, and shipping changes. See [`docs/DEVELOPMENT.md`](./docs/DEVELOPMENT.md) for everyday "how do I change X" recipes and [`docs/auth_customer_accounts.md`](./docs/auth_customer_accounts.md) for the active sign-in flow. Open an issue in the host repo if anything below is out of date.

---

## Table of contents

1. [Tech stack](#tech-stack)
2. [Quickstart](#quickstart)
3. [Environment variables](#environment-variables)
4. [Project structure](#project-structure)
5. [Key features & where they live](#key-features--where-they-live)
6. [Authentication](#authentication)
7. [Forms → Google Sheets](#forms--google-sheets)
8. [Pre-launch countdown / password gate](#pre-launch-countdown--password-gate)
9. [Jade Bar builder](#jade-bar-builder)
10. [Common workflows](#common-workflows)
11. [Deployment (Vercel)](#deployment-vercel)
12. [Troubleshooting](#troubleshooting)

---

## Tech stack

| Layer            | Choice                                                    |
| ---------------- | --------------------------------------------------------- |
| Framework        | **Next.js 14** (App Router, React Server Components)      |
| Language         | **TypeScript** (strict)                                   |
| Styling          | **Tailwind CSS** + a small amount of legacy CSS           |
| Animation        | **Framer Motion**                                         |
| Commerce         | **Shopify Storefront API** (`graphql-request`)            |
| Auth             | Shopify Customer Accounts (OAuth + PKCE) — `next-auth` retained as fallback |
| Forms backend    | **Google Sheets** via service account (`googleapis`)      |
| Email capture    | **Klaviyo** onsite JS                                     |
| Analytics        | Vercel Analytics, Google Analytics (G-FC5YQ3CJDF), Umami  |
| Hosting          | **Vercel**                                                |
| Icons            | `lucide-react`                                            |

Fonts (Neue Haas Grotesk Display, Reckless Neue) are bundled locally under `src/fonts/`.

---

## Quickstart

Prerequisites: **Node 18.17+** (Node 20 LTS recommended), npm 9+.

```bash
# 1. Install
npm install

# 2. Configure environment
cp env.example .env.local
# Fill in NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN and NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN
# Everything else is optional and gated by feature flags.

# 3. Run dev server
npm run dev
# http://localhost:3000
```

### Scripts

| Command           | What it does                            |
| ----------------- | --------------------------------------- |
| `npm run dev`     | Next.js dev server with hot reload      |
| `npm run build`   | Production build (`.next/`)             |
| `npm run start`   | Serve the production build              |
| `npm run lint`    | ESLint via `next lint`                  |

---

## Environment variables

Copy `env.example` to `.env.local` and fill in what you need. Variables are grouped by feature; nothing below the Shopify section is required to boot the site.

### Required — Shopify Storefront

```env
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN=shpat_xxx
```

Get these from **Shopify Admin → Settings → Apps and sales channels → Develop apps → your app → API credentials**. Make sure the Storefront API is enabled with at least read access to products, collections, and customer auth.

### Optional — Shopify Customer Accounts (OAuth + PKCE)

Enables the "Sign in" flow at `/account`. See [`docs/auth_customer_accounts.md`](./docs/auth_customer_accounts.md) for the full setup.

```env
CUSTOMER_ACCOUNTS_ENABLED=true
SESSION_SECRET=long-random-string
SHOPIFY_CA_CLIENT_ID=...
SHOPIFY_CA_AUTH_URL=https://your-store.myshopify.com/account/oauth/authorize
SHOPIFY_CA_TOKEN_URL=https://your-store.myshopify.com/account/oauth/token
SHOPIFY_CA_LOGOUT_URL=https://your-store.myshopify.com/account/logout
SHOPIFY_CA_REDIRECT_URI=https://your-domain.com/api/auth/shopify/callback
SHOPIFY_CA_REDIRECT_URI_LOCAL=http://localhost:3000/api/auth/shopify/callback
SHOPIFY_CA_CUSTOMER_API_URL=https://your-store.myshopify.com/api/customer/2024-01/graphql.json
SHOPIFY_CA_SCOPES=openid email customer-account-api:full
```

### Optional — Pre-launch countdown

```env
NEXT_PUBLIC_LAUNCH_COUNTDOWN_ENABLED=false      # master switch
NEXT_PUBLIC_LAUNCH_ACCESS_PASSWORD=             # bypass password (Team Access)
NEXT_PUBLIC_LAUNCH_ACCESS_RESET_TOKEN=0         # bump to invalidate previously-granted access
NEXT_PUBLIC_LAUNCH_TEST_MODE=false              # collapse countdown to ~10s for QA
NEXT_PUBLIC_LAUNCH_TEST_DURATION_SECONDS=10
```

Target launch date is hard-coded in `src/lib/launch-config.ts`.

### Optional — Jade Bar password gate

```env
NEXT_PUBLIC_JADE_BAR_PASSWORD=    # password to unlock /jade-bar/builder
```

### Optional — Forms → Google Sheets

Forms write to a Google Sheet via a service account. Without these the form routes return 500.

```env
GOOGLE_SHEETS_SPREADSHEET_ID=<id between /d/ and /edit in the Sheet URL>
GOOGLE_SERVICE_ACCOUNT_EMAIL=forms-writer@your-project.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n"
```

Notes:
- Share the spreadsheet with the service-account email (Editor).
- Keep `\\n` escapes literal — do **not** paste real newlines.

### Optional — NextAuth (legacy)

`next-auth` is wired but the active sign-in path is Shopify Customer Accounts. These vars only matter if you re-enable the legacy `/api/auth/[...nextauth]` flow.

```env
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
SHOPIFY_OIDC_WELL_KNOWN=
SHOPIFY_OIDC_CLIENT_ID=
SHOPIFY_OIDC_CLIENT_SECRET=
SHOPIFY_OIDC_SCOPES=openid email profile
```

---

## Project structure

```
public/
  assets/                  Images, fonts, video used by the site
  jade_bar_reference/      Reference imagery for the Jade Bar builder
  shop headings/           Per-category hero images
src/
  app/                     Next.js App Router — every folder is a route
    api/                   Route handlers
      auth/                NextAuth + Shopify Customer Accounts (OAuth)
      cart/                Cart create / update / checkout
      forms/submit/        Form submissions → Google Sheets
      forms/admin/reset/   Admin endpoint (sheet reset)
      faq/                 FAQ.md served as JSON
      image-proxy/         Proxies + format-converts Shopify CDN images
      jade-bar/variants/   Variant lookup for the Jade Bar builder
      search/              Storefront search
      social/              Social feed adapter
    shop/                  Listing, category pages, product detail (PDP)
    jade-bar/              Jade Bar landing + builder (password gated)
    account/               Customer account page
    debug/products/        Internal product debug page
    (about|contact|events|guide|recycle|repair|returns|shipping|visit
     |accessibility|privacy|terms|thank-you)/   Static / form pages
  components/
    layout/                Header, Footer, AnnouncementBar, MobileNav,
                           AccountLink, LaunchCountdown, TomiReveal
    sections/              Homepage sections (Hero, Categories, FAQ, etc.)
    shop/                  Shop-specific UI
    cart/                  AddToCartButton + cart helpers
    jade-bar/              JadeBarBuilder + JadeBarGate
    search/                SearchLauncher overlay
    ui/                    Generic primitives (Button, Container,
                           Starfield, liquid-glass, magnifier-lens, etc.)
    Providers.tsx          NextAuth SessionProvider
    ClientInit.tsx         One-time client bootstrap (analytics, etc.)
    Klaviyo*               Klaviyo popup + tracking wrappers
  lib/
    shopify.ts             Storefront API client + GraphQL ops
    customer-account.ts    Customer Account API client
    auth/                  Cookie / PKCE / session helpers for OAuth
    env.ts                 Typed env access + validation
    sheets.ts              Google Sheets form writer
    klaviyo.ts             Klaviyo helpers
    launch-config.ts       Countdown / launch gate config
    launch-unlock.ts       Client-side unlock state
    events.ts              In-app event bus
    http.ts                fetch wrapper with retries
    site-url.ts            Canonical origin resolver
    utils.ts               Misc helpers (price formatting, etc.)
  fonts/                   Local font files (Neue Haas, Reckless Neue)
  styles/legacy.css        Imported styles inherited from the original site
  types/                   Shared TypeScript types + next-auth.d.ts
docs/
  auth_customer_accounts.md  Customer Account API integration guide
AUTH.md                    Legacy NextAuth notes (still useful reference)
env.example                Template for .env.local
```

### Path aliases

`tsconfig.json` maps `@/*` → `src/*`, so:

```ts
import { getStorefrontClient } from '@/lib/shopify'
import { Header } from '@/components/layout/Header'
```

---

## Key features & where they live

| Feature                  | Entry point                                           |
| ------------------------ | ----------------------------------------------------- |
| Homepage                 | `src/app/page.tsx` + `src/components/sections/*`      |
| Header / nav             | `src/components/layout/Header.tsx`, `MobileNav.tsx`   |
| Announcement bar         | `src/components/layout/AnnouncementBar.tsx`           |
| Shop listing & filters   | `src/app/shop/page.tsx` + `ShopExperience.tsx`        |
| Category pages           | `src/app/shop/category/[slug]/page.tsx`               |
| Product detail (PDP)     | `src/app/shop/[handle]/page.tsx`                      |
| Cart                     | `src/app/api/cart/*` + `src/components/cart/*`        |
| Search                   | `src/components/search/SearchLauncher.tsx`            |
| FAQ                      | `src/app/FAQ.md` → `src/app/api/faq/route.ts`         |
| Forms (contact, repair, returns, appointments, jade consultation, mailing list) | `src/lib/sheets.ts` + `src/app/api/forms/submit/route.ts` |
| Customer accounts        | `src/app/account/page.tsx` + `src/app/api/auth/shopify/*` |
| Jade Bar builder         | `src/components/jade-bar/JadeBarBuilder.tsx`          |
| Pre-launch countdown     | `src/components/layout/LaunchCountdown.tsx` + `src/lib/launch-config.ts` |

---

## Authentication

The site has **two auth systems** present in code; only one is active:

1. **Active: Shopify Customer Accounts (OAuth + PKCE)** — gated by `CUSTOMER_ACCOUNTS_ENABLED=true`. Routes live under `src/app/api/auth/shopify/*`. Setup steps in [`docs/auth_customer_accounts.md`](./docs/auth_customer_accounts.md).
2. **Legacy: NextAuth + Shopify OIDC** — handler at `src/app/api/auth/[...nextauth]/route.ts`. Not linked from the UI but kept in the codebase as a fallback. See [`AUTH.md`](./AUTH.md) for the original write-up.

> The next developer can safely remove NextAuth (`next-auth` dependency, the `[...nextauth]` route, `Providers.tsx`, `src/types/next-auth.d.ts`, the `NEXTAUTH_*` and `SHOPIFY_OIDC_*` env vars) if/when they're sure the Customer Accounts flow is permanent.

---

## Forms → Google Sheets

All site forms (contact, repair, returns, appointments, Jade consultation, mailing list) POST to **`/api/forms/submit`**, which appends a row to a Google Sheet via a service account.

- Sheet structure / columns: defined in [`src/lib/sheets.ts`](./src/lib/sheets.ts) (`FORM_SHEETS`).
- The route also pushes a denormalized row into a `MAIN` dashboard tab.
- A simple in-memory rate limit (5 submissions / 60s per IP per serverless instance) lives in the route handler.
- Service-account email must be **Editor** on the target sheet.

To add a new form:

1. Add a new `FormType` and column map in `src/lib/sheets.ts`.
2. Build the form UI under `src/app/<page>/<Form>.tsx`.
3. POST to `/api/forms/submit` with `{ formType, ...fields }`.

---

## Pre-launch countdown / password gate

`src/components/layout/LaunchCountdown.tsx` renders a full-screen overlay when `NEXT_PUBLIC_LAUNCH_COUNTDOWN_ENABLED=true` and the current time is before `targetDate` in `src/lib/launch-config.ts`.

- Team can bypass with `NEXT_PUBLIC_LAUNCH_ACCESS_PASSWORD`.
- Bump `NEXT_PUBLIC_LAUNCH_ACCESS_RESET_TOKEN` (e.g. `0` → `1`) and redeploy to invalidate all previously-granted access.
- `NEXT_PUBLIC_LAUNCH_TEST_MODE=true` collapses the countdown to ~10s for QA without touching `targetDate`.

To remove the countdown post-launch, set `NEXT_PUBLIC_LAUNCH_COUNTDOWN_ENABLED=false` (the cleanest path) or delete the `<LaunchCountdown />` mount in `src/app/layout.tsx` and the component itself.

---

## Jade Bar builder

The Jade Bar product configurator (`/jade-bar/builder`) is password gated by `NEXT_PUBLIC_JADE_BAR_PASSWORD`. The gate lives in `src/components/jade-bar/JadeBarGate.tsx`; the builder in `JadeBarBuilder.tsx`.

Product / variant data is loaded from Shopify via `/api/jade-bar/variants`. The reference CSV at `public/Jade Bar Products  - Jades .csv` is used by ops to audit what's in Shopify — it isn't read at runtime.

---

## Common workflows

### Add a new collection / category to the shop nav

1. Add the entry in `src/app/shop/catalog.ts` (label, slug, Shopify collection handle, filters).
2. The header dropdown (`src/components/layout/Header.tsx`), the shop landing (`src/app/shop/page.tsx`), and the category page (`src/app/shop/category/[slug]/page.tsx`) all read from this file.

### Add a new content page

1. Create `src/app/<slug>/page.tsx` (App Router — folder == route).
2. Wrap with `<AnnouncementBar />`, `<Header />`, `<Footer />` for layout consistency. See `src/app/about/page.tsx` for a reference.

### Update legal copy

- `src/app/privacy/page.tsx` and `src/app/terms/page.tsx` render the markdown stored in `public/privacy_policy.md` and `public/terms_of_service.md`.

### Edit the FAQ

- Source of truth is `src/app/FAQ.md`. The API route at `src/app/api/faq/route.ts` parses it; the homepage section (`src/components/sections/FAQ.tsx`) renders it.

### Swap the homepage hero video

- Replace `public/assets/homepage video.mov` (kept under ~3MB). Reference is in `src/components/sections/Hero.tsx`.

---

## Deployment (Vercel)

1. Push the repo to GitHub.
2. In Vercel, **Add New Project → Import** the repo.
3. Framework preset: **Next.js** (auto-detected).
4. Add all required env vars under **Settings → Environment Variables** (Production, Preview, Development as needed). Mirror `.env.local`.
5. For Customer Accounts: in Shopify Admin, add the production redirect URI (`https://your-domain.com/api/auth/shopify/callback`) and the post-logout URI (`/api/auth/shopify/post-logout`) to the Customer Accounts app config.
6. Trigger a deploy. Vercel runs `npm run build`.

Security headers (HSTS, X-Frame-Options, etc.) are set in `next.config.js` and apply automatically.

---

## Troubleshooting

**Storefront API returns 401**
Check `NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN` and that the Storefront API is enabled for that app in Shopify Admin.

**Customer account sign-in redirects in a loop**
Verify (a) `SHOPIFY_CA_REDIRECT_URI` exactly matches what's configured in Shopify Admin, (b) `SESSION_SECRET` is set and stable across deploys, (c) the production domain matches `NEXTAUTH_URL` / canonical origin.

**Forms submit returns 500**
Most common: the service account is not shared on the Sheet, or `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` lost its `\\n` escapes. The actual error is logged server-side.

**Countdown won't go away in prod**
Set `NEXT_PUBLIC_LAUNCH_COUNTDOWN_ENABLED=false` in Vercel and redeploy.

**Images don't load from Shopify CDN**
`next.config.js` whitelists `cdn.shopify.com`. If a new image host is introduced, add it to `images.remotePatterns`.

---

## License & ownership

Proprietary to Tomi Jewelry. Not for redistribution.
