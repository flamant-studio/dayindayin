# Night Run Scorecard — 2026-06-12

## Goal
Get all new product types (mugs, totes, tank tops) live with correct artwork. Existing posters: 76 all live.

---

## Task Results

| # | Task | Result | Notes |
|---|------|--------|-------|
| N1 | Fix "Neko Paw — Yellow & Blue" poster | ✅ Done | Recreated via fix-yellow-blue.ts. 76/76 posters live. |
| N2 | Mug batch — 76 artworks × 4 variants | ✅ Done | 70/76 in batch, 5 fixed via retry. 1 residual failure (retry). 304 total Gelato products. |
| N3 | Tote batch — 76 artworks × 1 variant | ✅ Done | 73/76 in batch, 2 fixed via retry. 2 transient retry errors (products have artwork from first pass). |
| N4 | Tank top batch — 76 artworks × 6 variants | ✅ Done | 73/76 in batch, 2 fixed via retry. All 76 confirmed in Gelato. |
| N5 | Publish all to Online Store | ✅ Partial | **Pass 2: 118/304 published** (0 failures). 186 still in Gelato sync queue. Pass 3 needed after sync. |

---

## Publish State (Pass 2)
- **118 products published** — 0 failures
- **186 not yet synced from Gelato** — will sync over next hours/days
- Re-run `npx tsx scripts/publish-gelato-to-shopify.ts` when sync count climbs

---

## Code Improvements This Session

| Change | File | Why |
|--------|------|-----|
| Art-print filter: positive tag lookup | `app/shop/page.tsx` | Was using exclusion of non-prints — failed with 300+ products |
| Sitemap pagination | `app/sitemap.ts` | Was capped at 250 — now pages through all products |
| Search bumped to 250 | `app/search/page.tsx` | Was at 200 — misses new product types |
| Mug 2D picker | `components/ProductOptions.tsx` | White/Black × Side A/B instead of flat 4-button list |
| 'Size' label for clothing | `components/ProductOptions.tsx` | Tank tops now show "Size" not "Options" above variant buttons |
| Priority on first 4 shop images | `app/shop/page.tsx` | LCP improvement — preloads above-fold product cards |
| Publish rate limit handling | `scripts/publish-gelato-to-shopify.ts` | 500ms delay + 3-attempt throttle retry for 300+ product runs |

---

## Current Live State (dayindayin.dk)

| Product Type | In Gelato | In Shopify | Published | Has Images |
|---|---|---|---|---|
| Art prints (posters) | 76 | 76 | 76 ✅ | 76 (generated days ago) |
| Mugs | 76 | ~37 synced | ~37 ✅ | 0 (pending Gelato generation) |
| Totes | 76 | ~37 synced | ~37 ✅ | 0 (pending) |
| Tank tops | 76 | ~39 synced | ~39 ✅ | 0 (pending) |

Products without images are filtered out of the shop by `p.firstImage` check — they'll appear automatically as Gelato generates mockups (hours to days).

---

## Needs-Eyes

- Mug "Side A" vs "Side B" labels: confirm meaning once mockups arrive (which side of mug)
- Tote retry 2nd pass had 2 failures — likely transient (products patched in pass 1)
- Tank top retry: Mask — I Tank Top failed (transient HTML response). Re-run retry to clear.
- Run `npx tsx scripts/publish-gelato-to-shopify.ts` again tomorrow morning to publish remainder

---

## Next Morning

```bash
# Publish all remaining synced products
cd /Users/flamant-mini/Documents/FLAMANT/dayindayin-site
npx tsx scripts/publish-gelato-to-shopify.ts
```

Expected: 191 → 0 not-yet-synced as Gelato finishes its async sync.
