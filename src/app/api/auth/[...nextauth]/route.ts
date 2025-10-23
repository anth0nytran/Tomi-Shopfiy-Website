import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { loginCustomer, renewCustomerAccessToken } from '@/lib/shopify'

export const authOptions: NextAuthOptions = {
  providers: [
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
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
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


