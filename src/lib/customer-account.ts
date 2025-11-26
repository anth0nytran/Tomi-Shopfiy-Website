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
      orders(first: 5, reverse: true) {
        edges {
          node {
            id
            name
            processedAt
            lineItems(first: 10) {
              edges {
                node {
                  id
                  name
                  quantity
                  image {
                    url
                  }
                  currentTotalPrice {
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
  }
`

type CustomerQueryResponse = {
  data?: {
    customer?: {
      emailAddress?: { emailAddress?: string | null } | null
      firstName?: string | null
      lastName?: string | null
      orders?: {
        edges: Array<{
          node: {
            id: string
            name?: string | null
            processedAt: string
            lineItems?: {
              edges: Array<{
                node: {
                  id: string
                  name: string
                  quantity: number
                  image?: { url?: string | null } | null
                  currentTotalPrice?: {
                    amount: string
                    currencyCode: string
                  } | null
                }
              }>
            }
          }
        }>
      }
    }
  }
  errors?: Array<{ message: string }>
}

export type CustomerOverviewLineItem = {
  id: string
  name: string
  quantity: number
  imageUrl?: string | null
  totalAmount?: string | null
  totalCurrencyCode?: string | null
}

export type CustomerOverviewOrder = {
  id: string
  name: string
  processedAt: string
  lineItems: CustomerOverviewLineItem[]
}

export type CustomerOverview = {
  email?: string | null
  firstName?: string | null
  lastName?: string | null
  orders: CustomerOverviewOrder[]
}

export async function fetchCustomerOverview(
  token: string
): Promise<CustomerOverview | null> {
  if (!env.customerAccountsEnabled) return null
  const endpoint = env.customerAccount.apiUrl
  if (!endpoint) return null

  const url = new URL(endpoint)
  const isGlobalEndpoint = !url.hostname.includes('myshopify.com')
  const storeDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    // Customer Account API expects Bearer + shcat_ token
    Authorization: token,
    // This header is required for the global CA endpoint
    'Shopify-Customer-Access-Token': token,
  }

  if (isGlobalEndpoint && storeDomain) {
    headers['Shopify-Store-Domain'] = storeDomain
  }

  const res = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query: CUSTOMER_QUERY }),
    next: { revalidate: 0 },
  })

  if (!res.ok) {
    const body = await res.text()
    console.error('Customer overview request failed', {
      status: res.status,
      statusText: res.statusText,
      body,
      hasStoreDomain: Boolean(storeDomain),
      endpoint,
    })
    return null
  }

  const json = (await res.json()) as CustomerQueryResponse
  const customer = json.data?.customer
  if (!customer) {
    console.error('Customer overview response missing customer', json.errors)
    return null
  }

  const orders: CustomerOverviewOrder[] =
    customer.orders?.edges?.map(({ node }) => {
      const lineItems: CustomerOverviewLineItem[] =
        node.lineItems?.edges?.map(({ node: li }) => ({
          id: li.id,
          name: li.name,
          quantity: li.quantity,
          imageUrl: li.image?.url ?? null,
          totalAmount: li.currentTotalPrice?.amount ?? null,
          totalCurrencyCode: li.currentTotalPrice?.currencyCode ?? null,
        })) ?? []

      return {
        id: node.id,
        name: node.name || node.id,
        processedAt: node.processedAt,
        lineItems,
      }
    }) ?? []

  return {
    email: customer.emailAddress?.emailAddress ?? null,
    firstName: customer.firstName,
    lastName: customer.lastName,
    orders,
  }
}
