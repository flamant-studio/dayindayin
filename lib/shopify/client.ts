import { getAdminToken } from './token'

const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN!
const API_VERSION = '2025-01'

export async function adminFetch<T>({
  query,
  variables,
  revalidate = 300,
}: {
  query: string
  variables?: Record<string, unknown>
  revalidate?: number | false
}): Promise<T> {
  const token = await getAdminToken()

  const res = await fetch(`https://${DOMAIN}/admin/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token,
    },
    body: JSON.stringify({ query, variables }),
    ...(revalidate === false ? { cache: 'no-store' } : { next: { revalidate } }),
  })

  if (!res.ok) {
    throw new Error(`Shopify Admin API error: ${res.status} ${res.statusText}`)
  }

  const json = await res.json()

  if (json.errors?.length) {
    throw new Error(`Shopify GraphQL: ${JSON.stringify(json.errors)}`)
  }

  return json.data as T
}
