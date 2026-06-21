# DayInDayIn Loop Log
*Survives conversation compaction. Read this at the start of every /loop session.*

## How to continue after compaction
1. Read this file
2. Check git log for recent commits
3. Run `npx tsx scripts/check-storefront-variants.ts` to verify variant state
4. Continue from the next incomplete task

---

## Loop 1 — Started 2026-06-21

**Goal:** 20 tasks, fix UX issues, verify all product categories on mobile.

### Completed tasks

| # | Task | Status | Notes |
|---|------|--------|-------|
| 0 | Fix framed print variant picker (Print Material type) | ✅ Done | 20 products fixed via fix-print-material-framed.ts |
| 1 | Fix A4/Black price 417.77 → 399.00 on all framed prints | ✅ Done | 63 products fixed via fix-framed-a4-black-price.ts |
| 2 | Publish remaining Gelato products | ✅ Running | publish-gelato-to-shopify.ts — 18 still syncing from Gelato |
| 3 | Newsletter API verified | ✅ Done | Uses SHOPIFY_ADMIN_TOKEN + Shopify customers — fine |
| 4 | minPrice now 399 on framed prints | ✅ Done | Automatic after price fix |

### Pending tasks

| # | Task | Priority |
|---|------|----------|
| 5 | Fix console warnings | Medium |
| 6 | Mobile audit — ALL product categories variant/size selectors | HIGH — Sebastian's explicit request |
| 7 | Shop grid mobile improvements | Medium |
| 8 | Homepage improvements | Medium |
| 9 | About page improvements | Low |
| 10 | Art journal posts | Low |
| 11 | Improve shop filter UX | Medium |
| 12 | Fix products with no descriptions | Medium |
| 13 | Improve practical/FAQ page design | Low |
| 14 | Collections page improvements | Low |
| 15 | Fix: QuickAdd on single-variant | Medium |
| 16 | Footer improvements | Low |
| 17 | JSON-LD on homepage | Low |
| 18 | Size guide for framed prints | Medium |
| 19 | Final Playwright audit + deploy | HIGH |

---

## Variant state (2026-06-21)

- **Framed Print** (Framed Print + Print Material types): 30 products, all have 12 variants (A4/A3/A2/A1 × Black/White/Wood). A4/Black = 399 kr.
- **Art Print**: Gelato-synced, variants from storefront API (A4/A3/A2)
- **Poster**: Gelato-synced
- **Mug**: 4 variants (White/Black × Design A/B)
- **Tank Top**: 6 size variants (XS–2XL)
- **Tote Bag**: 1 variant (Natural)
- **Postcard**: 1 variant (Pack of 10)
- **Water Bottle**: 1 variant
- **Wood Print**: 1 variant
- **Dad Cap**: 2 variants

## Key scripts

```bash
npx tsx scripts/check-framed-shopify.ts     # Check framed print variant state
npx tsx scripts/check-storefront-variants.ts # Verify Storefront API
npx tsx scripts/publish-gelato-to-shopify.ts # Publish unpublished products
npx tsx scripts/fix-framed-a4-black-price.ts # Fix stale A4/Black price
npx tsx scripts/fix-print-material-framed.ts # Fix Print Material type framed products
```

## Key URLs
- Live site: https://dayindayin-site.vercel.app
- Shopify admin: https://admin.shopify.com/store/dayindayin
- Git: push to main → auto-deploys to Vercel
