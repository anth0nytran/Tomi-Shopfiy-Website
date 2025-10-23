# Tomi Jewelry Storefront (Next.js + Shopify)

A modern, responsive storefront built with Next.js and the Shopify Storefront API.

## Quickstart

1) Install dependencies
```bash
npm install
```

2) Configure environment
```bash
cp env.example .env.local
# then edit .env.local with your credentials
```

3) Run locally
```bash
npm run dev
```
Open http://localhost:3000

## Environment Variables
Set these in `.env.local`:

- `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN`: your store domain (e.g. `my-shop.myshopify.com`)
- `NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN`: Storefront API access token
- `SHOPIFY_ADMIN_ACCESS_TOKEN` (optional): only needed for any future Admin API usage
- `NEXTAUTH_SECRET` and `NEXTAUTH_URL` (optional): only needed if authentication is enabled

## Scripts
- `npm run dev`: start dev server
- `npm run build`: production build
- `npm run start`: run production server
- `npm run lint`: run ESLint

## Tech Stack
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion**
- **Shopify Storefront API**

## Project Structure
```
public/
  assets/            # Images, fonts, media used by the site
src/
  app/               # Next.js App Router pages/routes
  components/        # Reusable UI + sections
  lib/               # Config and utilities (e.g., Shopify client)
  styles/            # Legacy/global styles
  types/             # Shared TypeScript types
```

## Shopify Setup
1. In Shopify Admin → Settings → Apps and sales channels → Develop apps, create a custom app.
2. Enable Storefront API and generate a Storefront access token.
3. Copy your store domain and token into `.env.local`.

## Deployment (Vercel)
1. Push this repository to GitHub.
2. Import the repo in Vercel and set the same environment variables.
3. Build command: `npm run build`, Output: `.next` (default). Vercel auto-detects Next.js.

## Notes
- A homepage background video is included at `public/assets/homepage video.mov` (~3MB).
- Legacy static HTML/CSS/JS from the older site is intentionally excluded from this repo.
