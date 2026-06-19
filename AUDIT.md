# Product Audit — 2026-06-12

Generated from MANIFEST.csv (685 expected products) vs live Gelato + Shopify state.

## Summary

| Status | Count | Meaning |
|--------|-------|---------|
| ✅ OK | 0 | Correct variant count, artwork verified or Shopify images present |
| ❌ ARTWORK_WRONG | 0 | fileUrl set but differs from manifest — wrong artwork patched |
| ⚠️ ARTWORK_MISSING | 0 | fileUrl null AND no Shopify images — cannot verify artwork |
| ❌ WRONG_VARIANTS | 685 | Variant count doesn't match manifest |
| 🕐 NO_IMAGES | 0 | In Shopify, Gelato mockup generation pending |
| 🔄 UNSYNCED | 0 | In Gelato, not yet synced to Shopify |
| ❌ MISSING | 0 | Not found in Gelato at all |
| **Total** | **685** | |

## By Product Type

| Type | OK | ⚠️/❌ Broken | 🕐 No Images | 🔄 Unsynced | Total |
|------|-----|------------|------------|-----------|-------|
| Poster | 0 | 0 | 0 | 0 | 0 |
| Mug | 0 | 76 | 0 | 0 | 76 |
| Tote | 0 | 0 | 0 | 0 | 0 |
| Tank Top | 0 | 76 | 0 | 0 | 76 |

## ❌ Broken — Action Required

| Product | Type | Status | Expected Variants | Actual Variants | Artwork (manifest) | Actual fileUrl | Detail |
|---------|------|--------|------------------|-----------------|-------------------|----------------|--------|
| Neko Paw — Yellow | Art Print — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Paw — Yellow Neon | Art Print — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Paw — Yellow & Blue | Art Print — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Paw — Pink | Art Print — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Paw — Lilac | Art Print — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Paw — Yellow II | Art Print — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Paw — Red | Art Print — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko — Pink | Art Print — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Human I | Art Print — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Human II | Art Print — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Mask — I | Art Print — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Mask — II | Art Print — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Mask — III | Art Print — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Mask — Blasé | Art Print — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Mask — Calling | Art Print — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Mask — Dream | Art Print — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Moon Face | Art Print — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Solar Face | Art Print — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Sea Monsters — Steel | Art Print — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Botanical — Noir | Art Print — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Botanical — Blanc | Art Print — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Garden — Cream | Art Print — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Garden — Sky | Art Print — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Garden — Lavender | Art Print — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Garden — Sage | Art Print — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Zebra | Art Print — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Tourism — II | Art Print — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Sommerby | Art Print — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| SHERO — Purple | Art Print — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| SHERO — Indigo | Art Print — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| SHERO — III | Art Print — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Mask Study | Art Print — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Sri Lanka Masks | Art Print — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Sea Monsters — Blue | Art Print — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Colour Exploration I | Art Print — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Colour Exploration II | Art Print — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Colour Exploration III | Art Print — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Style Exploration | Art Print — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Two Cats | Art Print — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Elephant — Green | Art Print — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Elephant — Yellow | Art Print — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Elephant — Lilac | Art Print — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Elephant — Red | Art Print — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Tourism — I | Art Print — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Tourism — III | Art Print — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Tourism — IV | Art Print — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Blue Flower on Green Wood | Art Print — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Dead Flowers | Art Print — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Flowers on Linen | Art Print — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| No Ordinary Stone | Art Print — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| On the Light Table | Art Print — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Purple Flower | Art Print — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Red and Green Moss | Art Print — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Vase on Stool | Art Print — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Taped Objects | Art Print — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Purple Sun | Art Print — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Candy I | Art Print — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Orange Sun | Art Print — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Rainbow II | Art Print — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Round Earth | Art Print — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Floral Thing | Art Print — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Sitspot Large | Art Print — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Elsk | Art Print — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Paw — Blue | Art Print — Square | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Paw — Black & White | Art Print — Square | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Mask — Conformist | Art Print — Square | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Sea Monsters — Gold | Art Print — Square | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Sea Monsters — Cream | Art Print — Square | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Monsters — Pattern | Art Print — Square | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Kaninskoven | Art Print — Square | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Floating Poppies | Art Print — Square | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Night Poppies | Art Print — Square | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Poppy Field | Art Print — Square | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Forget-Me-Not | Art Print — Square | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Sleeping Cat | Art Print — Square | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Geometric Garden | Art Print — Square | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Paw — Yellow | Framed Print — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Paw — Yellow Neon | Framed Print — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Paw — Yellow & Blue | Framed Print — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Paw — Pink | Framed Print — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Paw — Lilac | Framed Print — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Paw — Yellow II | Framed Print — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Paw — Red | Framed Print — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko — Pink | Framed Print — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Human I | Framed Print — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Human II | Framed Print — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Mask — I | Framed Print — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Mask — II | Framed Print — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Mask — III | Framed Print — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Mask — Blasé | Framed Print — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Mask — Calling | Framed Print — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Mask — Dream | Framed Print — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Moon Face | Framed Print — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Solar Face | Framed Print — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Sea Monsters — Steel | Framed Print — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Botanical — Noir | Framed Print — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Botanical — Blanc | Framed Print — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Garden — Cream | Framed Print — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Garden — Sky | Framed Print — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Garden — Lavender | Framed Print — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Garden — Sage | Framed Print — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Zebra | Framed Print — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Tourism — II | Framed Print — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Sommerby | Framed Print — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| SHERO — Purple | Framed Print — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| SHERO — Indigo | Framed Print — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| SHERO — III | Framed Print — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Mask Study | Framed Print — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Sri Lanka Masks | Framed Print — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Sea Monsters — Blue | Framed Print — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Colour Exploration I | Framed Print — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Colour Exploration II | Framed Print — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Colour Exploration III | Framed Print — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Style Exploration | Framed Print — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Two Cats | Framed Print — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Elephant — Green | Framed Print — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Elephant — Yellow | Framed Print — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Elephant — Lilac | Framed Print — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Elephant — Red | Framed Print — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Tourism — I | Framed Print — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Tourism — III | Framed Print — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Tourism — IV | Framed Print — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Blue Flower on Green Wood | Framed Print — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Dead Flowers | Framed Print — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Flowers on Linen | Framed Print — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| No Ordinary Stone | Framed Print — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| On the Light Table | Framed Print — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Purple Flower | Framed Print — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Red and Green Moss | Framed Print — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Vase on Stool | Framed Print — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Taped Objects | Framed Print — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Purple Sun | Framed Print — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Candy I | Framed Print — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Orange Sun | Framed Print — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Rainbow II | Framed Print — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Round Earth | Framed Print — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Floral Thing | Framed Print — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Sitspot Large | Framed Print — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Elsk | Framed Print — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Paw — Yellow | Mug | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Paw — Yellow Neon | Mug | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Paw — Yellow & Blue | Mug | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Paw — Pink | Mug | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Paw — Lilac | Mug | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Paw — Yellow II | Mug | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Paw — Blue | Mug | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Paw — Red | Mug | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Paw — Black & White | Mug | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko — Pink | Mug | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Human I | Mug | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Human II | Mug | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| SHERO — Purple | Mug | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| SHERO — Indigo | Mug | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| SHERO — III | Mug | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Mask — I | Mug | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Mask — II | Mug | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Mask — III | Mug | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Mask — Blasé | Mug | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Mask — Calling | Mug | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Mask — Dream | Mug | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Mask — Conformist | Mug | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Mask Study | Mug | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Moon Face | Mug | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Solar Face | Mug | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Sri Lanka Masks | Mug | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Sea Monsters — Steel | Mug | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Sea Monsters — Blue | Mug | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Sea Monsters — Gold | Mug | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Sea Monsters — Cream | Mug | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Monsters — Pattern | Mug | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Kaninskoven | Mug | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Botanical — Noir | Mug | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Botanical — Blanc | Mug | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Garden — Cream | Mug | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Garden — Sky | Mug | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Garden — Lavender | Mug | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Garden — Sage | Mug | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Floating Poppies | Mug | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Night Poppies | Mug | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Poppy Field | Mug | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Forget-Me-Not | Mug | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Colour Exploration I | Mug | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Colour Exploration II | Mug | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Colour Exploration III | Mug | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Style Exploration | Mug | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Sleeping Cat | Mug | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Two Cats | Mug | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Zebra | Mug | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Elephant — Green | Mug | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Elephant — Yellow | Mug | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Elephant — Lilac | Mug | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Elephant — Red | Mug | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Tourism — I | Mug | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Tourism — II | Mug | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Tourism — III | Mug | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Tourism — IV | Mug | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Blue Flower on Green Wood | Mug | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Dead Flowers | Mug | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Flowers on Linen | Mug | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| No Ordinary Stone | Mug | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| On the Light Table | Mug | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Purple Flower | Mug | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Red and Green Moss | Mug | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Vase on Stool | Mug | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Taped Objects | Mug | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Purple Sun | Mug | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Candy I | Mug | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Orange Sun | Mug | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Rainbow II | Mug | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Round Earth | Mug | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Floral Thing | Mug | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Sitspot Large | Mug | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Elsk | Mug | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Geometric Garden | Mug | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Sommerby | Mug | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Paw — Yellow | Tote Bag | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Paw — Yellow Neon | Tote Bag | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Paw — Yellow & Blue | Tote Bag | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Paw — Pink | Tote Bag | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Paw — Lilac | Tote Bag | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Paw — Yellow II | Tote Bag | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Paw — Blue | Tote Bag | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Paw — Red | Tote Bag | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Paw — Black & White | Tote Bag | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko — Pink | Tote Bag | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Human I | Tote Bag | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Human II | Tote Bag | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| SHERO — Purple | Tote Bag | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| SHERO — Indigo | Tote Bag | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| SHERO — III | Tote Bag | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Mask — I | Tote Bag | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Mask — II | Tote Bag | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Mask — III | Tote Bag | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Mask — Blasé | Tote Bag | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Mask — Calling | Tote Bag | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Mask — Dream | Tote Bag | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Mask — Conformist | Tote Bag | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Mask Study | Tote Bag | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Moon Face | Tote Bag | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Solar Face | Tote Bag | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Sri Lanka Masks | Tote Bag | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Sea Monsters — Steel | Tote Bag | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Sea Monsters — Blue | Tote Bag | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Sea Monsters — Gold | Tote Bag | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Sea Monsters — Cream | Tote Bag | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Monsters — Pattern | Tote Bag | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Kaninskoven | Tote Bag | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Botanical — Noir | Tote Bag | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Botanical — Blanc | Tote Bag | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Garden — Cream | Tote Bag | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Garden — Sky | Tote Bag | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Garden — Lavender | Tote Bag | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Garden — Sage | Tote Bag | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Floating Poppies | Tote Bag | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Night Poppies | Tote Bag | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Poppy Field | Tote Bag | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Forget-Me-Not | Tote Bag | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Colour Exploration I | Tote Bag | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Colour Exploration II | Tote Bag | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Colour Exploration III | Tote Bag | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Style Exploration | Tote Bag | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Sleeping Cat | Tote Bag | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Two Cats | Tote Bag | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Zebra | Tote Bag | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Elephant — Green | Tote Bag | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Elephant — Yellow | Tote Bag | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Elephant — Lilac | Tote Bag | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Elephant — Red | Tote Bag | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Tourism — I | Tote Bag | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Tourism — II | Tote Bag | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Tourism — III | Tote Bag | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Tourism — IV | Tote Bag | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Blue Flower on Green Wood | Tote Bag | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Dead Flowers | Tote Bag | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Flowers on Linen | Tote Bag | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| No Ordinary Stone | Tote Bag | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| On the Light Table | Tote Bag | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Purple Flower | Tote Bag | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Red and Green Moss | Tote Bag | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Vase on Stool | Tote Bag | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Taped Objects | Tote Bag | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Purple Sun | Tote Bag | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Candy I | Tote Bag | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Orange Sun | Tote Bag | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Rainbow II | Tote Bag | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Round Earth | Tote Bag | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Floral Thing | Tote Bag | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Sitspot Large | Tote Bag | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Elsk | Tote Bag | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Geometric Garden | Tote Bag | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Sommerby | Tote Bag | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Paw — Yellow | Tank Top | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Paw — Yellow Neon | Tank Top | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Paw — Yellow & Blue | Tank Top | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Paw — Pink | Tank Top | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Paw — Lilac | Tank Top | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Paw — Yellow II | Tank Top | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Paw — Blue | Tank Top | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Paw — Red | Tank Top | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Paw — Black & White | Tank Top | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko — Pink | Tank Top | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Human I | Tank Top | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Human II | Tank Top | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| SHERO — Purple | Tank Top | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| SHERO — Indigo | Tank Top | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| SHERO — III | Tank Top | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Mask — I | Tank Top | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Mask — II | Tank Top | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Mask — III | Tank Top | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Mask — Blasé | Tank Top | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Mask — Calling | Tank Top | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Mask — Dream | Tank Top | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Mask — Conformist | Tank Top | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Mask Study | Tank Top | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Moon Face | Tank Top | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Solar Face | Tank Top | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Sri Lanka Masks | Tank Top | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Sea Monsters — Steel | Tank Top | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Sea Monsters — Blue | Tank Top | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Sea Monsters — Gold | Tank Top | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Sea Monsters — Cream | Tank Top | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Monsters — Pattern | Tank Top | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Kaninskoven | Tank Top | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Botanical — Noir | Tank Top | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Botanical — Blanc | Tank Top | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Garden — Cream | Tank Top | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Garden — Sky | Tank Top | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Garden — Lavender | Tank Top | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Garden — Sage | Tank Top | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Floating Poppies | Tank Top | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Night Poppies | Tank Top | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Poppy Field | Tank Top | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Forget-Me-Not | Tank Top | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Colour Exploration I | Tank Top | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Colour Exploration II | Tank Top | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Colour Exploration III | Tank Top | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Style Exploration | Tank Top | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Sleeping Cat | Tank Top | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Two Cats | Tank Top | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Zebra | Tank Top | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Elephant — Green | Tank Top | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Elephant — Yellow | Tank Top | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Elephant — Lilac | Tank Top | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Elephant — Red | Tank Top | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Tourism — I | Tank Top | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Tourism — II | Tank Top | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Tourism — III | Tank Top | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Tourism — IV | Tank Top | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Blue Flower on Green Wood | Tank Top | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Dead Flowers | Tank Top | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Flowers on Linen | Tank Top | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| No Ordinary Stone | Tank Top | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| On the Light Table | Tank Top | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Purple Flower | Tank Top | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Red and Green Moss | Tank Top | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Vase on Stool | Tank Top | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Taped Objects | Tank Top | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Purple Sun | Tank Top | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Candy I | Tank Top | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Orange Sun | Tank Top | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Rainbow II | Tank Top | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Round Earth | Tank Top | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Floral Thing | Tank Top | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Sitspot Large | Tank Top | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Elsk | Tank Top | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Geometric Garden | Tank Top | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Sommerby | Tank Top | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Paw — Yellow | Postcard — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Paw — Yellow Neon | Postcard — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Paw — Yellow & Blue | Postcard — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Paw — Pink | Postcard — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Paw — Lilac | Postcard — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Paw — Yellow II | Postcard — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Paw — Blue | Postcard — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Paw — Red | Postcard — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Paw — Black & White | Postcard — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko — Pink | Postcard — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Human I | Postcard — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Human II | Postcard — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| SHERO — Purple | Postcard — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| SHERO — Indigo | Postcard — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| SHERO — III | Postcard — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Mask — I | Postcard — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Mask — II | Postcard — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Mask — III | Postcard — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Mask — Blasé | Postcard — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Mask — Calling | Postcard — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Mask — Dream | Postcard — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Mask — Conformist | Postcard — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Mask Study | Postcard — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Moon Face | Postcard — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Solar Face | Postcard — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Sri Lanka Masks | Postcard — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Sea Monsters — Steel | Postcard — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Sea Monsters — Blue | Postcard — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Sea Monsters — Gold | Postcard — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Sea Monsters — Cream | Postcard — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Monsters — Pattern | Postcard — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Kaninskoven | Postcard — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Botanical — Noir | Postcard — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Botanical — Blanc | Postcard — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Garden — Cream | Postcard — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Garden — Sky | Postcard — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Garden — Lavender | Postcard — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Garden — Sage | Postcard — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Floating Poppies | Postcard — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Night Poppies | Postcard — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Poppy Field | Postcard — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Forget-Me-Not | Postcard — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Colour Exploration I | Postcard — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Colour Exploration II | Postcard — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Colour Exploration III | Postcard — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Style Exploration | Postcard — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Sleeping Cat | Postcard — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Two Cats | Postcard — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Zebra | Postcard — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Elephant — Green | Postcard — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Elephant — Yellow | Postcard — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Elephant — Lilac | Postcard — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Elephant — Red | Postcard — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Tourism — I | Postcard — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Tourism — II | Postcard — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Tourism — III | Postcard — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Tourism — IV | Postcard — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Blue Flower on Green Wood | Postcard — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Dead Flowers | Postcard — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Flowers on Linen | Postcard — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| No Ordinary Stone | Postcard — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| On the Light Table | Postcard — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Purple Flower | Postcard — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Red and Green Moss | Postcard — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Vase on Stool | Postcard — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Taped Objects | Postcard — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Purple Sun | Postcard — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Candy I | Postcard — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Orange Sun | Postcard — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Rainbow II | Postcard — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Round Earth | Postcard — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Floral Thing | Postcard — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Sitspot Large | Postcard — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Elsk | Postcard — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Geometric Garden | Postcard — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Sommerby | Postcard — Horizontal | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Paw — Yellow | Postcard — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Paw — Yellow Neon | Postcard — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Paw — Yellow & Blue | Postcard — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Paw — Pink | Postcard — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Paw — Lilac | Postcard — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Paw — Yellow II | Postcard — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Paw — Blue | Postcard — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Paw — Red | Postcard — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Paw — Black & White | Postcard — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko — Pink | Postcard — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Human I | Postcard — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Human II | Postcard — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| SHERO — Purple | Postcard — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| SHERO — Indigo | Postcard — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| SHERO — III | Postcard — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Mask — I | Postcard — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Mask — II | Postcard — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Mask — III | Postcard — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Mask — Blasé | Postcard — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Mask — Calling | Postcard — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Mask — Dream | Postcard — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Mask — Conformist | Postcard — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Mask Study | Postcard — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Moon Face | Postcard — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Solar Face | Postcard — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Sri Lanka Masks | Postcard — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Sea Monsters — Steel | Postcard — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Sea Monsters — Blue | Postcard — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Sea Monsters — Gold | Postcard — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Sea Monsters — Cream | Postcard — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Monsters — Pattern | Postcard — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Kaninskoven | Postcard — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Botanical — Noir | Postcard — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Botanical — Blanc | Postcard — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Garden — Cream | Postcard — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Garden — Sky | Postcard — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Garden — Lavender | Postcard — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Garden — Sage | Postcard — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Floating Poppies | Postcard — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Night Poppies | Postcard — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Poppy Field | Postcard — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Forget-Me-Not | Postcard — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Colour Exploration I | Postcard — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Colour Exploration II | Postcard — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Colour Exploration III | Postcard — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Style Exploration | Postcard — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Sleeping Cat | Postcard — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Two Cats | Postcard — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Zebra | Postcard — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Elephant — Green | Postcard — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Elephant — Yellow | Postcard — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Elephant — Lilac | Postcard — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Elephant — Red | Postcard — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Tourism — I | Postcard — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Tourism — II | Postcard — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Tourism — III | Postcard — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Tourism — IV | Postcard — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Blue Flower on Green Wood | Postcard — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Dead Flowers | Postcard — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Flowers on Linen | Postcard — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| No Ordinary Stone | Postcard — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| On the Light Table | Postcard — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Purple Flower | Postcard — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Red and Green Moss | Postcard — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Vase on Stool | Postcard — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Taped Objects | Postcard — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Purple Sun | Postcard — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Candy I | Postcard — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Orange Sun | Postcard — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Rainbow II | Postcard — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Round Earth | Postcard — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Floral Thing | Postcard — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Sitspot Large | Postcard — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Elsk | Postcard — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Geometric Garden | Postcard — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Sommerby | Postcard — Vertical | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Paw — Yellow | Water Bottle | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Paw — Yellow Neon | Water Bottle | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Paw — Yellow & Blue | Water Bottle | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Paw — Pink | Water Bottle | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Paw — Lilac | Water Bottle | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Paw — Yellow II | Water Bottle | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Paw — Blue | Water Bottle | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Paw — Red | Water Bottle | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Paw — Black & White | Water Bottle | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko — Pink | Water Bottle | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Human I | Water Bottle | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Human II | Water Bottle | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| SHERO — Purple | Water Bottle | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| SHERO — Indigo | Water Bottle | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| SHERO — III | Water Bottle | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Mask — I | Water Bottle | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Mask — II | Water Bottle | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Mask — III | Water Bottle | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Mask — Blasé | Water Bottle | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Mask — Calling | Water Bottle | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Mask — Dream | Water Bottle | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Mask — Conformist | Water Bottle | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Mask Study | Water Bottle | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Moon Face | Water Bottle | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Solar Face | Water Bottle | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Sri Lanka Masks | Water Bottle | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Sea Monsters — Steel | Water Bottle | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Sea Monsters — Blue | Water Bottle | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Sea Monsters — Gold | Water Bottle | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Sea Monsters — Cream | Water Bottle | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Monsters — Pattern | Water Bottle | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Kaninskoven | Water Bottle | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Botanical — Noir | Water Bottle | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Botanical — Blanc | Water Bottle | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Garden — Cream | Water Bottle | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Garden — Sky | Water Bottle | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Garden — Lavender | Water Bottle | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Garden — Sage | Water Bottle | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Floating Poppies | Water Bottle | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Night Poppies | Water Bottle | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Poppy Field | Water Bottle | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Forget-Me-Not | Water Bottle | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Colour Exploration I | Water Bottle | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Colour Exploration II | Water Bottle | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Colour Exploration III | Water Bottle | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Style Exploration | Water Bottle | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Sleeping Cat | Water Bottle | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Two Cats | Water Bottle | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Zebra | Water Bottle | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Elephant — Green | Water Bottle | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Elephant — Yellow | Water Bottle | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Elephant — Lilac | Water Bottle | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Elephant — Red | Water Bottle | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Tourism — I | Water Bottle | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Tourism — II | Water Bottle | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Tourism — III | Water Bottle | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Tourism — IV | Water Bottle | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Blue Flower on Green Wood | Water Bottle | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Dead Flowers | Water Bottle | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Flowers on Linen | Water Bottle | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| No Ordinary Stone | Water Bottle | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| On the Light Table | Water Bottle | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Purple Flower | Water Bottle | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Red and Green Moss | Water Bottle | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Vase on Stool | Water Bottle | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Taped Objects | Water Bottle | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Purple Sun | Water Bottle | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Candy I | Water Bottle | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Orange Sun | Water Bottle | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Rainbow II | Water Bottle | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Round Earth | Water Bottle | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Floral Thing | Water Bottle | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Sitspot Large | Water Bottle | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Elsk | Water Bottle | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Geometric Garden | Water Bottle | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Sommerby | Water Bottle | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Paw — Yellow | Wood Print | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Paw — Yellow Neon | Wood Print | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Paw — Yellow & Blue | Wood Print | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Paw — Pink | Wood Print | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Paw — Lilac | Wood Print | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Paw — Yellow II | Wood Print | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Paw — Blue | Wood Print | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Paw — Red | Wood Print | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Paw — Black & White | Wood Print | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko — Pink | Wood Print | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Human I | Wood Print | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Human II | Wood Print | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| SHERO — Purple | Wood Print | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| SHERO — Indigo | Wood Print | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| SHERO — III | Wood Print | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Mask — I | Wood Print | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Mask — II | Wood Print | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Mask — III | Wood Print | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Mask — Blasé | Wood Print | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Mask — Calling | Wood Print | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Mask — Dream | Wood Print | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Mask — Conformist | Wood Print | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Mask Study | Wood Print | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Moon Face | Wood Print | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Solar Face | Wood Print | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Sri Lanka Masks | Wood Print | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Sea Monsters — Steel | Wood Print | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Sea Monsters — Blue | Wood Print | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Sea Monsters — Gold | Wood Print | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Sea Monsters — Cream | Wood Print | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Monsters — Pattern | Wood Print | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Kaninskoven | Wood Print | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Botanical — Noir | Wood Print | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Botanical — Blanc | Wood Print | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Garden — Cream | Wood Print | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Garden — Sky | Wood Print | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Garden — Lavender | Wood Print | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Garden — Sage | Wood Print | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Floating Poppies | Wood Print | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Night Poppies | Wood Print | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Poppy Field | Wood Print | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Forget-Me-Not | Wood Print | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Colour Exploration I | Wood Print | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Colour Exploration II | Wood Print | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Colour Exploration III | Wood Print | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Style Exploration | Wood Print | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Sleeping Cat | Wood Print | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Two Cats | Wood Print | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Zebra | Wood Print | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Elephant — Green | Wood Print | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Elephant — Yellow | Wood Print | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Elephant — Lilac | Wood Print | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Elephant — Red | Wood Print | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Tourism — I | Wood Print | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Tourism — II | Wood Print | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Tourism — III | Wood Print | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Tourism — IV | Wood Print | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Blue Flower on Green Wood | Wood Print | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Dead Flowers | Wood Print | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Flowers on Linen | Wood Print | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| No Ordinary Stone | Wood Print | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| On the Light Table | Wood Print | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Purple Flower | Wood Print | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Red and Green Moss | Wood Print | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Vase on Stool | Wood Print | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Taped Objects | Wood Print | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Purple Sun | Wood Print | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Candy I | Wood Print | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Orange Sun | Wood Print | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Rainbow II | Wood Print | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Round Earth | Wood Print | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Floral Thing | Wood Print | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Sitspot Large | Wood Print | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Elsk | Wood Print | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Geometric Garden | Wood Print | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Sommerby | Wood Print | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Paw Cap — Yellow | Dad Cap | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Paw Cap — Yellow Neon | Dad Cap | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Paw Cap — Pink | Dad Cap | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Paw Cap — Lilac | Dad Cap | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Paw Cap — Blue | Dad Cap | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Paw Cap — Red | Dad Cap | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Neko Paw Cap — Black & White | Dad Cap | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| SHERO Cap — Purple | Dad Cap | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| SHERO Cap — Indigo | Dad Cap | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Elephant Cap — Green | Dad Cap | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Elephant Cap — Yellow | Dad Cap | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Elephant Cap — Lilac | Dad Cap | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Elephant Cap — Red | Dad Cap | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |
| Zebra Cap | Dad Cap | ❌ WRONG_VARIANTS | NaN | 1 | `undefined` | `null` | Expected NaN variants, got 1 |

## ✅ OK

| Product | Type | Handle | Shopify Images | fileUrl | Artwork Filename |
|---------|------|--------|---------------|---------|-----------------|