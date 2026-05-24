import { NextRequest, NextResponse } from 'next/server'
import { getProductByHandle, formatPrice } from '@/lib/shopify/products'

// GET /api/products?handles=handle1,handle2,handle3
export async function GET(request: NextRequest) {
  const handles = request.nextUrl.searchParams.get('handles')
  if (!handles) return NextResponse.json({ products: [] })

  const handleList = handles.split(',').map((h) => h.trim()).filter(Boolean).slice(0, 20)

  const results = await Promise.allSettled(handleList.map((h) => getProductByHandle(h)))

  const products = results
    .filter((r): r is PromiseFulfilledResult<Awaited<ReturnType<typeof getProductByHandle>>> => r.status === 'fulfilled')
    .map((r) => r.value)
    .filter((p): p is NonNullable<typeof p> => p != null)
    .map((p) => ({
      handle: p.handle,
      title: p.title,
      imageUrl: p.firstImage?.url ?? null,
      price: formatPrice(p.minPrice.amount),
    }))

  return NextResponse.json({ products }, {
    headers: { 'Cache-Control': 'private, max-age=60' },
  })
}
