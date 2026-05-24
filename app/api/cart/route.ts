import { NextRequest, NextResponse } from 'next/server'
import { createCart, addToCart, removeFromCart, getCart, normalizeCart, updateCartLines } from '@/lib/shopify/storefront'

const CART_COOKIE = 'did_cart'
const CART_MAX_AGE = 60 * 60 * 24 * 30 // 30 days

function cartResponse(cart: ReturnType<typeof normalizeCart>, newCartId?: string) {
  const res = NextResponse.json({ cart })
  if (newCartId) {
    res.cookies.set(CART_COOKIE, newCartId, {
      path: '/',
      maxAge: CART_MAX_AGE,
      sameSite: 'lax',
      httpOnly: false,
    })
  }
  return res
}

// GET — fetch current cart
export async function GET(request: NextRequest) {
  const cartId = request.cookies.get(CART_COOKIE)?.value
  if (!cartId) return NextResponse.json({ cart: null })
  try {
    const cart = await getCart(cartId)
    if (!cart) return NextResponse.json({ cart: null })
    return NextResponse.json({ cart: normalizeCart(cart) })
  } catch {
    return NextResponse.json({ cart: null })
  }
}

// POST — add item to cart (creates cart if needed)
export async function POST(request: NextRequest) {
  const { merchandiseId, quantity = 1 } = await request.json()
  const cartId = request.cookies.get(CART_COOKIE)?.value

  try {
    let cart
    let isNew = false

    if (cartId) {
      try {
        cart = await addToCart(cartId, [{ merchandiseId, quantity }])
      } catch {
        // Cart expired — create fresh
        cart = await createCart([{ merchandiseId, quantity }])
        isNew = true
      }
    } else {
      cart = await createCart([{ merchandiseId, quantity }])
      isNew = true
    }

    if (!cart) return NextResponse.json({ error: 'Product not available — may not be published to Online Store' }, { status: 422 })
    return cartResponse(normalizeCart(cart), isNew || !cartId ? cart.id : undefined)
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Cart error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

// PATCH — update line quantity
export async function PATCH(request: NextRequest) {
  const { lineId, quantity } = await request.json()
  const cartId = request.cookies.get(CART_COOKIE)?.value
  if (!cartId) return NextResponse.json({ error: 'No cart' }, { status: 400 })
  try {
    const cart = await updateCartLines(cartId, [{ id: lineId, quantity }])
    return NextResponse.json({ cart: normalizeCart(cart) })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

// DELETE — remove line from cart
export async function DELETE(request: NextRequest) {
  const { lineId } = await request.json()
  const cartId = request.cookies.get(CART_COOKIE)?.value
  if (!cartId) return NextResponse.json({ error: 'No cart' }, { status: 400 })

  try {
    const cart = await removeFromCart(cartId, [lineId])
    return NextResponse.json({ cart: normalizeCart(cart) })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Cart error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
