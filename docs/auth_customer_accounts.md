# Shopify Customer Accounts Integration

This feature wires the storefront into Shopify's new Customer Account API using OAuth + PKCE. Everything is hidden behind the `CUSTOMER_ACCOUNTS_ENABLED` flag, so existing stores keep working until the flag is flipped.

## Prerequisites

1. In Shopify Admin enable **New customer accounts** and create a Customer Account API client.
2. Add the following env vars (see `env.example` for reference):

```
CUSTOMER_ACCOUNTS_ENABLED=true
SHOPIFY_CA_CLIENT_ID=...
SHOPIFY_CA_AUTH_URL=https://{shop}.myshopify.com/account/oauth/authorize
SHOPIFY_CA_TOKEN_URL=https://{shop}.myshopify.com/account/oauth/token
SHOPIFY_CA_LOGOUT_URL=https://{shop}.myshopify.com/account/logout
SHOPIFY_CA_REDIRECT_URI=https://your-domain.com/api/auth/shopify/callback
SHOPIFY_CA_REDIRECT_URI_LOCAL=http://localhost:3000/api/auth/shopify/callback
SHOPIFY_CA_CUSTOMER_API_URL=https://{shop}.myshopify.com/api/customer/2024-01/graphql.json
SHOPIFY_STOREFRONT_API_URL=https://{shop}.myshopify.com/api/2024-01/graphql.json
SHOPIFY_STOREFRONT_TOKEN=private-storefront-token
SESSION_SECRET=generate-a-long-random-string
```

3. Configure the same redirect URLs inside Shopify Admin. Add your Vercel/production domain plus `http://localhost:3000` for development.
4. Set the Customer Accounts client **Logout URI** to:
   - `https://your-domain.com/api/auth/shopify/post-logout`

## Flow Overview

- `/api/auth/shopify/login`: generates PKCE verifier, stores state/returnTo in httpOnly cookies, and redirects to Shopify's OAuth screen.
- `/api/auth/shopify/callback`: exchanges the code for a customer access token, stores it in secure cookies (with optional refresh token info), and redirects back to the requested page.
- `/api/auth/shopify/logout`: clears local session and bounces through Shopify logout.
- `/api/auth/shopify/post-logout`: Shopify redirects here after it clears its own session; we then redirect to `/account` in a signed-out state.
- `/account`: server-rendered page that shows the signed-in viewer’s email, saved addresses, and last 5 orders. When no session exists, it renders a “Sign in” state and links to the login route.
- `/api/cart/checkout`: before redirecting shoppers to Shopify checkout, we attach the customer access token via `cartBuyerIdentityUpdate` so checkout is already aware of the shopper.

## QA Checklist

1. Ensure `CUSTOMER_ACCOUNTS_ENABLED` is `true`.
2. Visit `/account` while signed out → you should see the Sign in prompt.
3. Click Sign in → Shopify OAuth screen → after approving you land back on `/account` with your email, addresses, and orders.
4. Add an item to the cart and click checkout. The app should route through `/api/cart/checkout` and land in Shopify checkout with the signed-in customer.
5. Use the header “Sign out” action. You should be redirected to Shopify logout and then back to `/`.
6. Toggle the flag off. The header/account UI should disappear and product/cart flows should behave exactly as before.

If a storefront is password protected or Shopify returns `userErrors` during `cartBuyerIdentityUpdate`, the app logs the error but proceeds with checkout so shoppers are never blocked.
