import NextAuth, { DefaultSession, DefaultUser } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    shopify?: {
      accessToken: string
      expiresAt: string
      customerId?: string
    }
    user: DefaultSession['user']
  }

  interface User extends DefaultUser {
    shopify?: {
      accessToken: string
      expiresAt: string
      customerId?: string
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    shopify?: {
      accessToken: string
      expiresAt: string
      customerId?: string
    }
  }
}


