# Auth (legacy NextAuth notes)

> **Status:** the active sign-in flow is **Shopify Customer Accounts (OAuth + PKCE)** — see [`docs/auth_customer_accounts.md`](./docs/auth_customer_accounts.md). The notes below describe the older **NextAuth** integration, which is still wired in code (`src/app/api/auth/[...nextauth]/route.ts`, `src/components/Providers.tsx`, the `next-auth` dependency) but is not linked from the UI. Keep this file as a reference if you ever need to re-enable that path; otherwise the next developer can remove the NextAuth code and these env vars.

---

The legacy flow supported two modes through NextAuth:

- **Shopify-hosted login (New Customer Accounts via OIDC)** — recommended path at the time
- **In-app credentials via Storefront API** — dev/fallback

## 1) Shopify-hosted login (OIDC)

### What you get
- Shopify hosts signup/signin (passkeys, 2FA, secure UX)
- After login, Shopify redirects back to your site
- The app uses the Storefront API for cart/checkout; future code could call the Customer Account API for profile/orders

### Prerequisites
1. In Shopify Admin → **Customer accounts** → enable **New customer accounts**.
2. Create a custom app with **Customer Account API** access (OIDC). You'll need:
   - Client ID, Client Secret
   - Well-known URL: `https://YOUR_STORE.myshopify.com/.well-known/openid-configuration/customer`
   - Redirect URL: `https://YOUR_DOMAIN/api/auth/callback/shopify-oidc` (NextAuth uses provider id)

### Environment
```env
SHOPIFY_OIDC_WELL_KNOWN=https://YOUR_STORE.myshopify.com/.well-known/openid-configuration/customer
SHOPIFY_OIDC_CLIENT_ID=...
SHOPIFY_OIDC_CLIENT_SECRET=...
SHOPIFY_OIDC_SCOPES=openid email profile
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=long-random-string
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=YOUR_STORE.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN=...
```

### Flow
- User clicks Account → `/api/auth/signin?callbackUrl=<current>`
- Chooses **Shopify** on the NextAuth screen (auto visible when OIDC envs are set)
- Shopify login → callback to `/api/auth/callback/shopify-oidc` → session established → redirect to `callbackUrl`

### Session
- `session.shopifyOidc` contains OAuth token info for future Customer Account API calls.
- Cart/Checkout continues via Storefront API (`cart.checkoutUrl`).

## 2) In-app credentials (Storefront API fallback)

- `/account` historically had a credentials form using `customerAccessTokenCreate`
- `session.shopify` carries the customer access token
- Used for development when OIDC wasn't configured

## Local testing
1. Copy env vars from `env.example` into `.env.local` and fill values
2. For OIDC, ensure `SHOPIFY_OIDC_*` and `NEXTAUTH_*` are all set
3. `npm run dev`, click Account
   - OIDC envs set → NextAuth screen with Shopify provider
   - OIDC envs unset → credentials form at `/account`

## Deploying
- Set the same env vars in your host (e.g. Vercel)
- `NEXTAUTH_URL` must match your production domain
- The Shopify app's redirect URL must include your production domain

## Switching modes
- Enable hosted login: set `SHOPIFY_OIDC_*` and restart the app
- Fallback to credentials: unset the OIDC envs; the `/account` form will be used

---

## How to retire NextAuth completely

When ready, the cleanup is:

1. Delete `src/app/api/auth/[...nextauth]/route.ts`
2. Delete `src/components/Providers.tsx` and remove the `<Providers>` wrapper in `src/app/layout.tsx`
3. Delete `src/types/next-auth.d.ts`
4. Remove `next-auth` from `package.json`
5. Remove the `NEXTAUTH_*` and `SHOPIFY_OIDC_*` blocks from `env.example` and from Vercel
6. Delete this file (`AUTH.md`)
