// Shopify Storefront API client configuration
export const shopifyConfig = {
  storeDomain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!,
  apiVersion: '2024-01',
  publicAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN!,
}

import { GraphQLClient, gql } from 'graphql-request'

export function getStorefrontClient() {
  const endpoint = `https://${shopifyConfig.storeDomain}/api/${shopifyConfig.apiVersion}/graphql.json`
  return new GraphQLClient(endpoint, {
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': shopifyConfig.publicAccessToken,
    },
  })
}

// Customer auth mutations/queries
const CUSTOMER_ACCESS_TOKEN_CREATE = gql`
  mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken { accessToken expiresAt }
      customerUserErrors { code field message }
    }
  }
`

const CUSTOMER_ACCESS_TOKEN_RENEW = gql`
  mutation customerAccessTokenRenew($customerAccessToken: String!) {
    customerAccessTokenRenew(customerAccessToken: $customerAccessToken) {
      customerAccessToken { accessToken expiresAt }
      userErrors { field message }
    }
  }
`

const CUSTOMER_QUERY = gql`
  query customer($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      email
      firstName
      lastName
      displayName
    }
  }
`

export type ShopifyCustomer = {
  id: string
  email: string
  firstName?: string | null
  lastName?: string | null
  displayName?: string | null
}

export async function loginCustomer(email: string, password: string): Promise<{ accessToken: string; expiresAt: string; customer: ShopifyCustomer } | null> {
  const client = getStorefrontClient()
  const res = await client.request(CUSTOMER_ACCESS_TOKEN_CREATE, { input: { email, password } }) as any
  const data = res?.customerAccessTokenCreate
  const err = data?.customerUserErrors?.[0]
  if (!data?.customerAccessToken || err) return null
  const { accessToken, expiresAt } = data.customerAccessToken
  const customerRes = await client.request(CUSTOMER_QUERY, { customerAccessToken: accessToken }) as any
  const customer = customerRes?.customer
  if (!customer) return null
  return { accessToken, expiresAt, customer }
}

export async function renewCustomerAccessToken(oldToken: string): Promise<{ accessToken: string; expiresAt: string } | null> {
  const client = getStorefrontClient()
  const res = await client.request(CUSTOMER_ACCESS_TOKEN_RENEW, { customerAccessToken: oldToken }) as any
  const payload = res?.customerAccessTokenRenew
  const err = payload?.userErrors?.[0]
  if (!payload?.customerAccessToken || err) return null
  return payload.customerAccessToken
}

export async function getCustomerByToken(accessToken: string): Promise<ShopifyCustomer | null> {
  const client = getStorefrontClient()
  const res = await client.request(CUSTOMER_QUERY, { customerAccessToken: accessToken }) as any
  return res?.customer ?? null
}

// GraphQL queries for Shopify
export const GET_PRODUCTS = `
  query getProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          description
          handle
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 1) {
            edges {
              node {
                id
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  }
`

export const GET_COLLECTIONS = `
  query getCollections($first: Int!) {
    collections(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          image {
            url
            altText
          }
        }
      }
    }
  }
`
