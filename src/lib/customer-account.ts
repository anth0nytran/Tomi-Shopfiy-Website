import { env } from '@/lib/env'

const CUSTOMER_QUERY = `
  query CustomerOverview {
    customer {
      id
      emailAddress {
        emailAddress
      }
      firstName
      lastName
      addresses(first: 5) {
        edges {
          node {
            id
            formatted
            address1
            address2
            city
            province
            country
            zip
          }
        }
      }
      orders(first: 5) {
        edges {
          node {
            id
            name
            processedAt
            fulfillmentStatus
            totalPriceSet {
              shopMoney {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  }
`

type CustomerQueryResponse = {
  data?: {
    customer?: {
      emailAddress?: { emailAddress?: string | null } | null
      firstName?: string | null
      lastName?: string | null
      addresses?: { edges: Array<{ node: any }> }
      orders?: { edges: Array<{ node: any }> }
    }
  }
  errors?: Array<{ message: string }>
}

export type CustomerOverview = {
  email?: string | null
  firstName?: string | null
  lastName?: string | null
  addresses: any[]
  orders: any[]
}

export async function fetchCustomerOverview(token: string): Promise<CustomerOverview | null> {
  if (!env.customerAccountsEnabled) return null
  const endpoint = env.customerAccount.apiUrl
  if (!endpoint) return null
  const url = new URL(endpoint)
  const isGlobalEndpoint = !url.hostname.includes('myshopify.com')
  const storeDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(isGlobalEndpoint && storeDomain ? { 'Shopify-Store-Domain': storeDomain } : {}),
    },
    body: JSON.stringify({ query: CUSTOMER_QUERY }),
    next: { revalidate: 0 },
  })
  if (!res.ok) return null
  const json = (await res.json()) as CustomerQueryResponse
  const customer = json.data?.customer
  if (!customer) return null
  return {
    email: customer.emailAddress?.emailAddress ?? null,
    firstName: customer.firstName,
    lastName: customer.lastName,
    addresses: customer.addresses?.edges?.map((edge) => edge.node) ?? [],
    orders: customer.orders?.edges?.map((edge) => edge.node) ?? [],
  }
}
