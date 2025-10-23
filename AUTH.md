# Auth: Shopify-hosted (OIDC) vs In-app (Storefront)

This app supports two customer auth modes:

- Shopify-hosted login (New Customer Accounts via OIDC) — recommended
- In-app credentials via Storefront API — fallback/dev

## 1) Shopify-hosted login (New Customer Accounts)

### What you get
- Shopify hosts signup/signin (passkeys, 2FA, secure UX)
- After login, Shopify redirects back to your site
- Your app uses Storefront API for cart/checkout; you can add Customer Account API reads (profile/orders) next

### Prerequisites
1. In Shopify Admin → Customer accounts → enable “New customer accounts”.
2. Create a custom app with Customer Account API access (OIDC).
   - Get Client ID, Client Secret
   - Well-known URL: `https://YOUR_STORE.myshopify.com/.well-known/openid-configuration/customer`
   - Redirect URL: `https://YOUR_DOMAIN/api/auth/callback/shopify-oidc` (NextAuth uses provider id)

### Environment
Add to `.env.local`:
```
SHOPIFY_OIDC_WELL_KNOWN=https://YOUR_STORE.myshopify.com/.well-known/openid-configuration/customer
SHOPIFY_OIDC_CLIENT_ID=...
SHOPIFY_OIDC_CLIENT_SECRET=...
SHOPIFY_OIDC_SCOPES=openid email profile
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-strong-random-secret
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=YOUR_STORE.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN=...
```

### Flow
- User clicks Account → `/api/auth/signin?callbackUrl=<current>`
- Choose “Shopify” on the NextAuth page (auto visible when OIDC envs are set)
- Shopify login → redirect back to `/api/auth/callback/shopify-oidc` → session established → redirect to `callbackUrl`

### Session
- `session.shopifyOidc` contains OAuth token info for future calls (if/when using Customer Account API)
- Cart/Checkout continues via Storefront API (`cart.checkoutUrl`)

## 2) In-app credentials (Storefront API fallback)
- `/account` page authenticates with Storefront `customerAccessTokenCreate`
- Session includes `session.shopify` with a customer access token
- Useful for development or if OIDC isn’t configured yet

## Local testing
1. Copy envs from `env.example` to `.env.local` and fill values
2. If using OIDC, ensure all SHOPIFY_OIDC_* and NextAuth envs are set
3. Run `npm run dev`
4. Click Account
   - OIDC set → NextAuth screen with Shopify provider
   - OIDC not set → Credentials sign-in form at `/account`

## Deploy
- Set the same env vars on your host (e.g., Vercel)
- `NEXTAUTH_URL` must match your production domain
- Ensure Shopify app’s redirect URL includes your production domain

## Switching modes
- Enable hosted login: set SHOPIFY_OIDC_* and restart the app
- Fallback to credentials: unset OIDC envs; `/account` form remains available
