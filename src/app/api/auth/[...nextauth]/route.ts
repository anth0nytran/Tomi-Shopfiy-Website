import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
// Using a custom OAuth provider object to avoid importing provider modules
import { loginCustomer, renewCustomerAccessToken } from '@/lib/shopify'

const providers: NextAuthOptions['providers'] = []

// Optional: Shopify OIDC (New Customer Accounts) if env is configured
if (process.env.SHOPIFY_OIDC_WELL_KNOWN && process.env.SHOPIFY_OIDC_CLIENT_ID && process.env.SHOPIFY_OIDC_CLIENT_SECRET) {
  providers.push(
    ({
      type: 'oauth',
      id: 'shopify-oidc',
      name: 'Shopify',
      wellKnown: process.env.SHOPIFY_OIDC_WELL_KNOWN,
      clientId: process.env.SHOPIFY_OIDC_CLIENT_ID,
      clientSecret: process.env.SHOPIFY_OIDC_CLIENT_SECRET,
      checks: ['pkce', 'state'],
      authorization: {
        params: { scope: process.env.SHOPIFY_OIDC_SCOPES || 'openid email https://api.customers.com/auth/customer.graphql' },
      },
      profile(profile: any) {
        // OIDC standard claims
        return {
          id: (profile as any).sub,
          name: (profile as any).name || (profile as any).given_name || (profile as any).email,
          email: (profile as any).email,
        }
      },
    } as any)
  )
}

// Credentials fallback (Storefront API) - keep for non-OIDC dev or backup
providers.push(
  CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const result = await loginCustomer(credentials.email, credentials.password)
        if (!result) return null
        const { accessToken, expiresAt, customer } = result
        return {
          id: customer.id,
          name: customer.displayName || customer.firstName || customer.email,
          email: customer.email,
          // attach Shopify info onto the user object for the first jwt pass
          shopify: { accessToken, expiresAt, customerId: customer.id },
        } as any
      },
    })
)

const authOptions: NextAuthOptions = {
  providers,
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user, account }) {
      // Shopify OIDC login: persist OAuth tokens
      if (account && account.provider === 'shopify-oidc') {
        ;(token as any).shopifyOidc = {
          accessToken: (account as any).access_token,
          refreshToken: (account as any).refresh_token,
          expiresAt: (account as any).expires_at,
          tokenType: (account as any).token_type,
        }
      }
      // initial sign in
      if (user && (user as any).shopify) {
        token.shopify = (user as any).shopify
      }
      // refresh if nearing expiry (24h window)
      const exp = (token as any).shopify?.expiresAt as string | undefined
      const accessToken = (token as any).shopify?.accessToken as string | undefined
      const msLeft = exp ? new Date(exp).getTime() - Date.now() : undefined
      if (accessToken && typeof msLeft === 'number' && msLeft < 24 * 60 * 60 * 1000) {
        try {
          const renewed = await renewCustomerAccessToken(accessToken)
          if (renewed) (token as any).shopify = { ...(token as any).shopify, accessToken: renewed.accessToken, expiresAt: renewed.expiresAt }
        } catch {}
      }
      return token
    },
    async session({ session, token }) {
      if ((token as any)?.shopify) (session as any).shopify = (token as any).shopify
      if ((token as any)?.shopifyOidc) (session as any).shopifyOidc = (token as any).shopifyOidc
      return session
    },
    async redirect({ url, baseUrl }) {
      try {
        const u = new URL(url)
        const cb = u.searchParams.get('callbackUrl')
        if (cb && cb.startsWith(baseUrl)) return cb
      } catch {}
      return `${baseUrl}/account`
    },
  },
  pages: { signIn: '/account' },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }


