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
          productType
          tags
          collections(first: 10) {
            edges {
              node {
                id
                title
                handle
              }
            }
          }
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

// Product by handle
export const GET_PRODUCT_BY_HANDLE = gql`
  query productByHandle($handle: String!) {
    product(handle: $handle) {
      id
      title
      description
      handle
      images(first: 6) {
        edges { node { url altText } }
      }
      variants(first: 10) {
        edges {
          node {
            id
            title
            availableForSale
            price { amount currencyCode }
          }
        }
      }
    }
  }
`

export async function fetchProducts(first: number) {
  const client = getStorefrontClient()
  const res = await client.request(GET_PRODUCTS, { first }) as any
  return res?.products?.edges?.map((e: any) => e.node) ?? []
}

export async function fetchProductByHandle(handle: string) {
  const client = getStorefrontClient()
  const res = await client.request(GET_PRODUCT_BY_HANDLE, { handle }) as any
  return res?.product ?? null
}

export async function fetchCollections(first: number) {
  const client = getStorefrontClient()
  const res = await client.request(GET_COLLECTIONS, { first }) as any
  return res?.collections?.edges?.map((e: any) => e.node) ?? []
}

// Cart operations
export const CART_FRAGMENT = gql`
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost { subtotalAmount { amount currencyCode } }
    lines(first: 50) {
      edges {
        node {
          id
          quantity
          cost { subtotalAmount { amount currencyCode } }
          merchandise {
            __typename
            ... on ProductVariant {
              id
              title
              price { amount currencyCode }
              product {
                id
                title
                handle
                images(first: 1) { edges { node { url altText } } }
              }
            }
          }
        }
      }
    }
  }
`

export const CART_CREATE = gql`
  ${CART_FRAGMENT}
  mutation cartCreate($input: CartInput) {
    cartCreate(input: $input) { cart { ...CartFields } userErrors { field message } }
  }
`

export const CART_QUERY = gql`
  ${CART_FRAGMENT}
  query cart($id: ID!) { cart(id: $id) { ...CartFields } }
`

export const CART_LINES_ADD = gql`
  ${CART_FRAGMENT}
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) { cart { ...CartFields } userErrors { field message } }
  }
`

export const CART_LINES_REMOVE = gql`
  ${CART_FRAGMENT}
  mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { cart { ...CartFields } userErrors { field message } }
  }
`

export type ShopifyCart = {
  id: string
  checkoutUrl: string
  totalQuantity: number
  cost: { subtotalAmount: { amount: string; currencyCode: string } }
  lines: { edges: Array<{ node: any }> }
}

export async function createCart(): Promise<ShopifyCart> {
  const client = getStorefrontClient()
  const res = await client.request(CART_CREATE, { input: {} }) as any
  const cart = res?.cartCreate?.cart
  if (!cart) throw new Error('Failed to create cart')
  return cart
}

export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  const client = getStorefrontClient()
  const res = await client.request(CART_QUERY, { id: cartId }) as any
  return (res?.cart ?? null) as ShopifyCart | null
}

export async function addLinesToCart(cartId: string, lines: Array<{ merchandiseId: string; quantity: number }>): Promise<ShopifyCart> {
  const client = getStorefrontClient()
  const res = await client.request(CART_LINES_ADD, { cartId, lines }) as any
  const cart = res?.cartLinesAdd?.cart
  if (!cart) throw new Error('Failed to add lines')
  return cart
}

export async function removeLinesFromCart(cartId: string, lineIds: string[]): Promise<ShopifyCart> {
  const client = getStorefrontClient()
  const res = await client.request(CART_LINES_REMOVE, { cartId, lineIds }) as any
  const cart = res?.cartLinesRemove?.cart
  if (!cart) throw new Error('Failed to remove lines')
  return cart
}