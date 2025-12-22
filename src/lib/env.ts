type Env = {
  customerAccountsEnabled: boolean
  sessionSecret: string
  customerAccount: {
    clientId: string
    authUrl: string
    tokenUrl: string
    logoutUrl: string
    redirectUri: string
    redirectUriLocal: string
    apiUrl: string
    scopes: string
  }
}

import type { NextRequest } from 'next/server'
import { getRequestOrigin } from '@/lib/http'

function ensure(name: string, value: string | undefined) {
  if (!value) throw new Error(`Missing required env var: ${name}`)
  return value
}

const customerAccountsEnabled = process.env.CUSTOMER_ACCOUNTS_ENABLED === 'true'

const env: Env = {
  customerAccountsEnabled,
  sessionSecret: process.env.SESSION_SECRET || '',
  customerAccount: {
    clientId: process.env.SHOPIFY_CA_CLIENT_ID || '',
    authUrl: process.env.SHOPIFY_CA_AUTH_URL || '',
    tokenUrl: process.env.SHOPIFY_CA_TOKEN_URL || '',
    logoutUrl: process.env.SHOPIFY_CA_LOGOUT_URL || '',
    redirectUri: process.env.SHOPIFY_CA_REDIRECT_URI || '',
    redirectUriLocal: process.env.SHOPIFY_CA_REDIRECT_URI_LOCAL || '',
    apiUrl: process.env.SHOPIFY_CA_CUSTOMER_API_URL || process.env.SHOPIFY_STOREFRONT_API_URL || '',
    scopes: process.env.SHOPIFY_CA_SCOPES ?? 'openid email customer-account-api:full',
  },
}

if (customerAccountsEnabled) {
  env.sessionSecret = ensure('SESSION_SECRET', env.sessionSecret)
  env.customerAccount.clientId = ensure('SHOPIFY_CA_CLIENT_ID', env.customerAccount.clientId)
  env.customerAccount.authUrl = ensure('SHOPIFY_CA_AUTH_URL', env.customerAccount.authUrl)
  env.customerAccount.tokenUrl = ensure('SHOPIFY_CA_TOKEN_URL', env.customerAccount.tokenUrl)
  env.customerAccount.logoutUrl = ensure('SHOPIFY_CA_LOGOUT_URL', env.customerAccount.logoutUrl)
  env.customerAccount.apiUrl = ensure('SHOPIFY_CA_CUSTOMER_API_URL', env.customerAccount.apiUrl)
  env.customerAccount.scopes = ensure('SHOPIFY_CA_SCOPES', env.customerAccount.scopes)
}

export function getCustomerAccountRedirectUri(req?: NextRequest) {
  // Prefer the current request origin to avoid cross-domain callback issues
  // (e.g. after switching from *.vercel.app to a custom domain).
  if (req) {
    const origin = getRequestOrigin(req)
    return `${origin}/api/auth/shopify/callback`
  }

  // Fallback behavior (mainly useful in non-request contexts):
  if (process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production') {
    return ensure('SHOPIFY_CA_REDIRECT_URI', env.customerAccount.redirectUri)
  }
  return env.customerAccount.redirectUriLocal || ensure('SHOPIFY_CA_REDIRECT_URI', env.customerAccount.redirectUri)
}

export { env }
