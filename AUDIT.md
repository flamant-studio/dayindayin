# Product Audit — 2026-06-12

Generated from MANIFEST.csv (304 expected products) vs live Gelato + Shopify state.

**IMPORTANT — artwork correctness limitation:** Gelato's GET variant API always returns `fileUrl: null` — the patched artwork URL is not exposed via read endpoints. This means the ARTWORK_WRONG check cannot fire. The 0 ARTWORK_WRONG count does NOT mean all artwork is correct. It means artwork correctness is unverifiable programmatically. The "Neko Paw — Yellow Mug showing SHERO artwork" bug Sebastian identified would show as OK here. Visual QA of all mug/tote/tank-top products is required to confirm artwork once Gelato mockups are generated.

## Summary

| Status | Count | Meaning |
|--------|-------|---------|
| ✅ OK | 153 | Correct variant count, artwork verified or Shopify images present |
| ❌ ARTWORK_WRONG | 0 | fileUrl set but differs from manifest — wrong artwork patched |
| ⚠️ ARTWORK_MISSING | 0 | fileUrl null AND no Shopify images — cannot verify artwork |
| ❌ WRONG_VARIANTS | 0 | Variant count doesn't match manifest |
| 🕐 NO_IMAGES | 0 | In Shopify, Gelato mockup generation pending |
| 🔄 UNSYNCED | 151 | In Gelato, not yet synced to Shopify |
| ❌ MISSING | 0 | Not found in Gelato at all |
| **Total** | **304** | |

## By Product Type

| Type | OK | ⚠️/❌ Broken | 🕐 No Images | 🔄 Unsynced | Total |
|------|-----|------------|------------|-----------|-------|
| Poster | 76 | 0 | 0 | 0 | 76 |
| Mug | 34 | 0 | 0 | 42 | 76 |
| Tote | 19 | 0 | 0 | 57 | 76 |
| Tank Top | 24 | 0 | 0 | 52 | 76 |

## 🔄 Unsynced — In Gelato, Not Yet in Shopify

151 products are in Gelato but their `externalId` is null — Gelato hasn't finished syncing them to Shopify. Re-run the publish script when sync completes.

| Product | Type | Gelato Variants |
|---------|------|----------------|
| Mask — Calling Mug | Mug | 4 |
| Mask — Dream Mug | Mug | 4 |
| Mask Study Mug | Mug | 4 |
| Sri Lanka Masks Mug | Mug | 4 |
| Sea Monsters — Steel Mug | Mug | 4 |
| Sea Monsters — Blue Mug | Mug | 4 |
| Sea Monsters — Gold Mug | Mug | 4 |
| Sea Monsters — Cream Mug | Mug | 4 |
| Kaninskoven Mug | Mug | 4 |
| Garden — Cream Mug | Mug | 4 |
| Garden — Sky Mug | Mug | 4 |
| Garden — Lavender Mug | Mug | 4 |
| Garden — Sage Mug | Mug | 4 |
| Floating Poppies Mug | Mug | 4 |
| Night Poppies Mug | Mug | 4 |
| Poppy Field Mug | Mug | 4 |
| Colour Exploration I Mug | Mug | 4 |
| Colour Exploration II Mug | Mug | 4 |
| Colour Exploration III Mug | Mug | 4 |
| Style Exploration Mug | Mug | 4 |
| Sleeping Cat Mug | Mug | 4 |
| Two Cats Mug | Mug | 4 |
| Zebra Mug | Mug | 4 |
| Elephant — Green Mug | Mug | 4 |
| Elephant — Yellow Mug | Mug | 4 |
| Elephant — Lilac Mug | Mug | 4 |
| Elephant — Red Mug | Mug | 4 |
| Tourism — IV Mug | Mug | 4 |
| Blue Flower on Green Wood Mug | Mug | 4 |
| Dead Flowers Mug | Mug | 4 |
| Flowers on Linen Mug | Mug | 4 |
| No Ordinary Stone Mug | Mug | 4 |
| On the Light Table Mug | Mug | 4 |
| Purple Flower Mug | Mug | 4 |
| Red and Green Moss Mug | Mug | 4 |
| Vase on Stool Mug | Mug | 4 |
| Purple Sun Mug | Mug | 4 |
| Orange Sun Mug | Mug | 4 |
| Rainbow II Mug | Mug | 4 |
| Round Earth Mug | Mug | 4 |
| Geometric Garden Mug | Mug | 4 |
| Sommerby Mug | Mug | 4 |
| Neko Paw — Yellow II Tote | Tote | 1 |
| Neko Paw — Red Tote | Tote | 1 |
| Neko Human I Tote | Tote | 1 |
| SHERO — Purple Tote | Tote | 1 |
| SHERO — Indigo Tote | Tote | 1 |
| SHERO — III Tote | Tote | 1 |
| Mask — I Tote | Tote | 1 |
| Mask — II Tote | Tote | 1 |
| Mask — III Tote | Tote | 1 |
| Mask — Blasé Tote | Tote | 1 |
| Mask — Calling Tote | Tote | 1 |
| Mask — Dream Tote | Tote | 1 |
| Mask — Conformist Tote | Tote | 1 |
| Mask Study Tote | Tote | 1 |
| Moon Face Tote | Tote | 1 |
| Solar Face Tote | Tote | 1 |
| Sea Monsters — Steel Tote | Tote | 1 |
| Sea Monsters — Blue Tote | Tote | 1 |
| Sea Monsters — Gold Tote | Tote | 1 |
| Sea Monsters — Cream Tote | Tote | 1 |
| Monsters — Pattern Tote | Tote | 1 |
| Kaninskoven Tote | Tote | 1 |
| Botanical — Noir Tote | Tote | 1 |
| Botanical — Blanc Tote | Tote | 1 |
| Garden — Cream Tote | Tote | 1 |
| Garden — Sky Tote | Tote | 1 |
| Garden — Lavender Tote | Tote | 1 |
| Garden — Sage Tote | Tote | 1 |
| Floating Poppies Tote | Tote | 1 |
| Night Poppies Tote | Tote | 1 |
| Poppy Field Tote | Tote | 1 |
| Style Exploration Tote | Tote | 1 |
| Sleeping Cat Tote | Tote | 1 |
| Two Cats Tote | Tote | 1 |
| Zebra Tote | Tote | 1 |
| Elephant — Green Tote | Tote | 1 |
| Elephant — Yellow Tote | Tote | 1 |
| Elephant — Lilac Tote | Tote | 1 |
| Elephant — Red Tote | Tote | 1 |
| Tourism — I Tote | Tote | 1 |
| Tourism — II Tote | Tote | 1 |
| Tourism — III Tote | Tote | 1 |
| Tourism — IV Tote | Tote | 1 |
| Blue Flower on Green Wood Tote | Tote | 1 |
| Dead Flowers Tote | Tote | 1 |
| Flowers on Linen Tote | Tote | 1 |
| No Ordinary Stone Tote | Tote | 1 |
| Purple Flower Tote | Tote | 1 |
| Red and Green Moss Tote | Tote | 1 |
| Vase on Stool Tote | Tote | 1 |
| Taped Objects Tote | Tote | 1 |
| Purple Sun Tote | Tote | 1 |
| Floral Thing Tote | Tote | 1 |
| Sitspot Large Tote | Tote | 1 |
| Elsk Tote | Tote | 1 |
| Geometric Garden Tote | Tote | 1 |
| Sommerby Tote | Tote | 1 |
| Neko Paw — Pink Tank Top | Tank Top | 6 |
| Neko Paw — Blue Tank Top | Tank Top | 6 |
| Neko Paw — Red Tank Top | Tank Top | 6 |
| Neko Paw — Black & White Tank Top | Tank Top | 6 |
| Neko — Pink Tank Top | Tank Top | 6 |
| Neko Human I Tank Top | Tank Top | 6 |
| SHERO — Purple Tank Top | Tank Top | 6 |
| SHERO — Indigo Tank Top | Tank Top | 6 |
| SHERO — III Tank Top | Tank Top | 6 |
| Mask — III Tank Top | Tank Top | 6 |
| Mask — Blasé Tank Top | Tank Top | 6 |
| Mask — Calling Tank Top | Tank Top | 6 |
| Mask — Conformist Tank Top | Tank Top | 6 |
| Mask Study Tank Top | Tank Top | 6 |
| Moon Face Tank Top | Tank Top | 6 |
| Sri Lanka Masks Tank Top | Tank Top | 6 |
| Sea Monsters — Steel Tank Top | Tank Top | 6 |
| Sea Monsters — Blue Tank Top | Tank Top | 6 |
| Sea Monsters — Gold Tank Top | Tank Top | 6 |
| Sea Monsters — Cream Tank Top | Tank Top | 6 |
| Kaninskoven Tank Top | Tank Top | 6 |
| Botanical — Noir Tank Top | Tank Top | 6 |
| Botanical — Blanc Tank Top | Tank Top | 6 |
| Garden — Cream Tank Top | Tank Top | 6 |
| Garden — Sky Tank Top | Tank Top | 6 |
| Garden — Sage Tank Top | Tank Top | 6 |
| Poppy Field Tank Top | Tank Top | 6 |
| Forget-Me-Not Tank Top | Tank Top | 6 |
| Colour Exploration I Tank Top | Tank Top | 6 |
| Colour Exploration II Tank Top | Tank Top | 6 |
| Sleeping Cat Tank Top | Tank Top | 6 |
| Two Cats Tank Top | Tank Top | 6 |
| Zebra Tank Top | Tank Top | 6 |
| Elephant — Green Tank Top | Tank Top | 6 |
| Elephant — Yellow Tank Top | Tank Top | 6 |
| Elephant — Lilac Tank Top | Tank Top | 6 |
| Elephant — Red Tank Top | Tank Top | 6 |
| Tourism — I Tank Top | Tank Top | 6 |
| Blue Flower on Green Wood Tank Top | Tank Top | 6 |
| Dead Flowers Tank Top | Tank Top | 6 |
| Flowers on Linen Tank Top | Tank Top | 6 |
| No Ordinary Stone Tank Top | Tank Top | 6 |
| On the Light Table Tank Top | Tank Top | 6 |
| Purple Flower Tank Top | Tank Top | 6 |
| Red and Green Moss Tank Top | Tank Top | 6 |
| Vase on Stool Tank Top | Tank Top | 6 |
| Orange Sun Tank Top | Tank Top | 6 |
| Rainbow II Tank Top | Tank Top | 6 |
| Round Earth Tank Top | Tank Top | 6 |
| Floral Thing Tank Top | Tank Top | 6 |
| Geometric Garden Tank Top | Tank Top | 6 |
| Sommerby Tank Top | Tank Top | 6 |

## ✅ OK

| Product | Type | Handle | Shopify Images | fileUrl | Artwork Filename |
|---------|------|--------|---------------|---------|-----------------|
| Neko Paw — Yellow | Poster | neko-paw-yellow | 1 | null (Gelato processed) | `Neko Paw — Yellow.png` |
| Neko Paw — Yellow Neon | Poster | neko-paw-yellow-neon | 1 | null (Gelato processed) | `Neko Paw — Yellow Neon.png` |
| Neko Paw — Yellow & Blue | Poster | neko-paw-yellow-blue | 1 | null (Gelato processed) | `Neko Paw — Yellow & Blue.png` |
| Neko Paw — Pink | Poster | neko-paw-pink | 1 | null (Gelato processed) | `Neko Paw — Pink.png` |
| Neko Paw — Lilac | Poster | neko-paw-lilac | 1 | null (Gelato processed) | `Neko Paw — Lilac.png` |
| Neko Paw — Yellow II | Poster | neko-paw-yellow-ii | 1 | null (Gelato processed) | `Neko Paw — Yellow II.png` |
| Neko Paw — Red | Poster | neko-paw-red | 1 | null (Gelato processed) | `neko_paw_red.png` |
| Neko — Pink | Poster | neko-pink | 1 | null (Gelato processed) | `neko_pink.png` |
| Neko Human I | Poster | neko-human-i | 1 | null (Gelato processed) | `Neko Human I.png` |
| Neko Human II | Poster | neko-human-ii | 1 | null (Gelato processed) | `Neko Human II.png` |
| Mask — I | Poster | mask-i | 1 | null (Gelato processed) | `Mask — I cropped.png` |
| Mask — II | Poster | mask-ii | 1 | null (Gelato processed) | `Mask — II.png` |
| Mask — III | Poster | mask-iii | 1 | null (Gelato processed) | `Mask — III.png` |
| Mask — Blasé | Poster | mask-blase | 1 | null (Gelato processed) | `Mask — Blasé.png` |
| Mask — Calling | Poster | mask-calling | 1 | null (Gelato processed) | `Mask — Calling.png` |
| Mask — Dream | Poster | mask-dream | 1 | null (Gelato processed) | `Mask — Dream.png` |
| Moon Face | Poster | moon-face | 1 | null (Gelato processed) | `Moon Face.png` |
| Solar Face | Poster | solar-face | 1 | null (Gelato processed) | `Solar Face.png` |
| Sea Monsters — Steel | Poster | sea-monsters-steel | 1 | null (Gelato processed) | `Sea Monsters — Steel.png` |
| Botanical — Noir | Poster | botanical-noir | 1 | null (Gelato processed) | `Botanical — Noir.png` |
| Botanical — Blanc | Poster | botanical-blanc | 1 | null (Gelato processed) | `Botanical — Blanc.png` |
| Garden — Cream | Poster | garden-cream | 1 | null (Gelato processed) | `Garden — Cream.png` |
| Garden — Sky | Poster | garden-sky | 1 | null (Gelato processed) | `Garden — Sky.png` |
| Garden — Lavender | Poster | garden-lavender | 1 | null (Gelato processed) | `Garden — Lavender.png` |
| Garden — Sage | Poster | garden-sage | 1 | null (Gelato processed) | `Garden — Sage.png` |
| Zebra | Poster | zebra | 1 | null (Gelato processed) | `Zebra.jpg` |
| Tourism — II | Poster | tourism-ii | 1 | null (Gelato processed) | `Tourism — II.jpg` |
| Sommerby | Poster | sommerby | 1 | null (Gelato processed) | `Sommerby.png` |
| SHERO — Purple | Poster | shero-purple | 1 | null (Gelato processed) | `SHERO — Purple.png` |
| SHERO — Indigo | Poster | shero-indigo | 1 | null (Gelato processed) | `SHERO — Indigo.png` |
| SHERO — III | Poster | shero-iii | 1 | null (Gelato processed) | `SHERO — III.png` |
| Mask Study | Poster | mask-study | 1 | null (Gelato processed) | `Mask Study.png` |
| Sri Lanka Masks | Poster | sri-lanka-masks | 1 | null (Gelato processed) | `Sri Lanka Masks.jpg` |
| Sea Monsters — Blue | Poster | sea-monsters-blue | 1 | null (Gelato processed) | `Sea Monsters — Blue.png` |
| Colour Exploration I | Poster | colour-exploration-i | 1 | null (Gelato processed) | `Colour_Exploration 1.png` |
| Colour Exploration II | Poster | colour-exploration-ii | 1 | null (Gelato processed) | `Colour_Exploration 2.png` |
| Colour Exploration III | Poster | colour-exploration-iii | 1 | null (Gelato processed) | `Colour_Exploration 3.png` |
| Style Exploration | Poster | style-exploration | 1 | null (Gelato processed) | `Style_Exploration.png` |
| Two Cats | Poster | two-cats | 1 | null (Gelato processed) | `Two Cats.png` |
| Elephant — Green | Poster | elephant-green | 1 | null (Gelato processed) | `Elephant — Green.png` |
| Elephant — Yellow | Poster | elephant-yellow | 1 | null (Gelato processed) | `Elephant — Yellow.png` |
| Elephant — Lilac | Poster | elephant-lilac | 1 | null (Gelato processed) | `Elephant — Lilac.png` |
| Elephant — Red | Poster | elephant-red | 1 | null (Gelato processed) | `Elephant — Red.png` |
| Tourism — I | Poster | tourism-i | 1 | null (Gelato processed) | `Tourism — I.jpg` |
| Tourism — III | Poster | tourism-iii | 1 | null (Gelato processed) | `Tourism — III.jpg` |
| Tourism — IV | Poster | tourism-iv | 1 | null (Gelato processed) | `Tourism — IV.jpg` |
| Blue Flower on Green Wood | Poster | blue-flower-on-green-wood | 1 | null (Gelato processed) | `Blue Flower on Green Wood.png` |
| Dead Flowers | Poster | dead-flowers | 1 | null (Gelato processed) | `Dead Flowers.png` |
| Flowers on Linen | Poster | flowers-on-linen | 1 | null (Gelato processed) | `Flowers on Linen.png` |
| No Ordinary Stone | Poster | no-ordinary-stone | 1 | null (Gelato processed) | `No Ordinary Stone.png` |
| On the Light Table | Poster | on-the-light-table | 1 | null (Gelato processed) | `On the Light Table.png` |
| Purple Flower | Poster | purple-flower | 1 | null (Gelato processed) | `Purple Flower.png` |
| Red and Green Moss | Poster | red-and-green-moss | 1 | null (Gelato processed) | `Red and Green Moss.png` |
| Vase on Stool | Poster | vase-on-stool | 1 | null (Gelato processed) | `Vase on Stool.png` |
| Taped Objects | Poster | taped-objects | 1 | null (Gelato processed) | `Taped Objects.png` |
| Purple Sun | Poster | purple-sun | 1 | null (Gelato processed) | `Purple Sun.jpg` |
| Candy I | Poster | candy-i | 1 | null (Gelato processed) | `Candy I.jpg` |
| Orange Sun | Poster | orange-sun | 1 | null (Gelato processed) | `Orange Sun.jpg` |
| Rainbow II | Poster | rainbow-ii | 1 | null (Gelato processed) | `Rainbow II.png` |
| Round Earth | Poster | round-earth | 1 | null (Gelato processed) | `Round Earth.jpg` |
| Floral Thing | Poster | floral-thing | 1 | null (Gelato processed) | `Floral Thing.jpg` |
| Sitspot Large | Poster | sitspot-large | 1 | null (Gelato processed) | `Sitspot Large.png` |
| Elsk | Poster | elsk | 1 | null (Gelato processed) | `Elsk.png` |
| Neko Paw — Blue | Poster | neko-paw-blue | 1 | null (Gelato processed) | `neko_paw_blue.png` |
| Neko Paw — Black & White | Poster | neko-paw-black-white | 1 | null (Gelato processed) | `neko_paw_bw.png` |
| Mask — Conformist | Poster | mask-conformist | 1 | null (Gelato processed) | `Mask — Conformist.png` |
| Sea Monsters — Gold | Poster | sea-monsters-gold | 1 | null (Gelato processed) | `Sea Monsters — Gold.png` |
| Sea Monsters — Cream | Poster | sea-monsters-cream | 1 | null (Gelato processed) | `Sea Monsters — Cream.png` |
| Monsters — Pattern | Poster | monsters-pattern | 1 | null (Gelato processed) | `Monsters — Pattern.png` |
| Kaninskoven | Poster | kaninskoven | 1 | null (Gelato processed) | `Kaninskoven.png` |
| Floating Poppies | Poster | floating-poppies | 1 | null (Gelato processed) | `Floating Poppies.png` |
| Night Poppies | Poster | night-poppies | 1 | null (Gelato processed) | `Night Poppies.png` |
| Poppy Field | Poster | poppy-field | 1 | null (Gelato processed) | `Poppy Field.png` |
| Forget-Me-Not | Poster | forget-me-not | 1 | null (Gelato processed) | `Forget-Me-Not.png` |
| Sleeping Cat | Poster | sleeping-cat | 1 | null (Gelato processed) | `Sleeping Cat.png` |
| Geometric Garden | Poster | geometric-garden | 1 | null (Gelato processed) | `Geometric Garden.png` |
| Neko Paw — Yellow Mug | Mug | neko-paw-yellow-mug | 1 | null (Gelato processed) | `Neko Paw — Yellow.png` |
| Neko Paw — Yellow Neon Mug | Mug | neko-paw-yellow-neon-mug | 1 | null (Gelato processed) | `Neko Paw — Yellow Neon.png` |
| Neko Paw — Yellow & Blue Mug | Mug | neko-paw-yellow-blue-mug | 1 | null (Gelato processed) | `Neko Paw — Yellow & Blue.png` |
| Neko Paw — Pink Mug | Mug | neko-paw-pink-mug | 1 | null (Gelato processed) | `Neko Paw — Pink.png` |
| Neko Paw — Lilac Mug | Mug | neko-paw-lilac-mug | 1 | null (Gelato processed) | `Neko Paw — Lilac.png` |
| Neko Paw — Yellow II Mug | Mug | neko-paw-yellow-ii-mug | 1 | null (Gelato processed) | `Neko Paw — Yellow II.png` |
| Neko Paw — Blue Mug | Mug | neko-paw-blue-mug | 1 | null (Gelato processed) | `neko_paw_blue.png` |
| Neko Paw — Red Mug | Mug | neko-paw-red-mug | 1 | null (Gelato processed) | `neko_paw_red.png` |
| Neko Paw — Black & White Mug | Mug | neko-paw-black-white-mug | 1 | null (Gelato processed) | `neko_paw_bw.png` |
| Neko — Pink Mug | Mug | neko-pink-mug | 1 | null (Gelato processed) | `neko_pink.png` |
| Neko Human I Mug | Mug | neko-human-i-mug | 1 | null (Gelato processed) | `Neko Human I.png` |
| Neko Human II Mug | Mug | neko-human-ii-mug | 1 | null (Gelato processed) | `Neko Human II.png` |
| SHERO — Purple Mug | Mug | shero-purple-mug | 1 | null (Gelato processed) | `SHERO — Purple.png` |
| SHERO — Indigo Mug | Mug | shero-indigo-mug | 1 | null (Gelato processed) | `SHERO — Indigo.png` |
| SHERO — III Mug | Mug | shero-iii-mug | 1 | null (Gelato processed) | `SHERO — III.png` |
| Mask — I Mug | Mug | mask-i-mug | 1 | null (Gelato processed) | `Mask — I cropped.png` |
| Mask — II Mug | Mug | mask-ii-mug | 1 | null (Gelato processed) | `Mask — II.png` |
| Mask — III Mug | Mug | mask-iii-mug | 1 | null (Gelato processed) | `Mask — III.png` |
| Mask — Blasé Mug | Mug | mask-blase-mug | 1 | null (Gelato processed) | `Mask — Blasé.png` |
| Mask — Conformist Mug | Mug | mask-conformist-mug | 1 | null (Gelato processed) | `Mask — Conformist.png` |
| Moon Face Mug | Mug | moon-face-mug | 1 | null (Gelato processed) | `Moon Face.png` |
| Solar Face Mug | Mug | solar-face-mug | 1 | null (Gelato processed) | `Solar Face.png` |
| Monsters — Pattern Mug | Mug | monsters-pattern-mug | 1 | null (Gelato processed) | `Monsters — Pattern.png` |
| Botanical — Noir Mug | Mug | botanical-noir-mug | 1 | null (Gelato processed) | `Botanical — Noir.png` |
| Botanical — Blanc Mug | Mug | botanical-blanc-mug | 1 | null (Gelato processed) | `Botanical — Blanc.png` |
| Forget-Me-Not Mug | Mug | forget-me-not-mug | 1 | null (Gelato processed) | `Forget-Me-Not.png` |
| Tourism — I Mug | Mug | tourism-i-mug | 1 | null (Gelato processed) | `Tourism — I.jpg` |
| Tourism — II Mug | Mug | tourism-ii-mug | 1 | null (Gelato processed) | `Tourism — II.jpg` |
| Tourism — III Mug | Mug | tourism-iii-mug | 1 | null (Gelato processed) | `Tourism — III.jpg` |
| Taped Objects Mug | Mug | taped-objects-mug | 1 | null (Gelato processed) | `Taped Objects.png` |
| Candy I Mug | Mug | candy-i-mug | 1 | null (Gelato processed) | `Candy I.jpg` |
| Floral Thing Mug | Mug | floral-thing-mug | 1 | null (Gelato processed) | `Floral Thing.jpg` |
| Sitspot Large Mug | Mug | sitspot-large-mug | 1 | null (Gelato processed) | `Sitspot Large.png` |
| Elsk Mug | Mug | elsk-mug | 1 | null (Gelato processed) | `Elsk.png` |
| Neko Paw — Yellow Tote | Tote | neko-paw-yellow-tote | 1 | null (Gelato processed) | `Neko Paw — Yellow.png` |
| Neko Paw — Yellow Neon Tote | Tote | neko-paw-yellow-neon-tote | 1 | null (Gelato processed) | `Neko Paw — Yellow Neon.png` |
| Neko Paw — Yellow & Blue Tote | Tote | neko-paw-yellow-blue-tote | 1 | null (Gelato processed) | `Neko Paw — Yellow & Blue.png` |
| Neko Paw — Pink Tote | Tote | neko-paw-pink-tote | 1 | null (Gelato processed) | `Neko Paw — Pink.png` |
| Neko Paw — Lilac Tote | Tote | neko-paw-lilac-tote | 1 | null (Gelato processed) | `Neko Paw — Lilac.png` |
| Neko Paw — Blue Tote | Tote | neko-paw-blue-tote | 1 | null (Gelato processed) | `neko_paw_blue.png` |
| Neko Paw — Black & White Tote | Tote | neko-paw-black-white-tote | 1 | null (Gelato processed) | `neko_paw_bw.png` |
| Neko — Pink Tote | Tote | neko-pink-tote | 1 | null (Gelato processed) | `neko_pink.png` |
| Neko Human II Tote | Tote | neko-human-ii-tote | 1 | null (Gelato processed) | `Neko Human II.png` |
| Sri Lanka Masks Tote | Tote | sri-lanka-masks-tote | 1 | null (Gelato processed) | `Sri Lanka Masks.jpg` |
| Forget-Me-Not Tote | Tote | forget-me-not-tote | 1 | null (Gelato processed) | `Forget-Me-Not.png` |
| Colour Exploration I Tote | Tote | colour-exploration-i-tote | 1 | null (Gelato processed) | `Colour_Exploration 1.png` |
| Colour Exploration II Tote | Tote | colour-exploration-ii-tote | 1 | null (Gelato processed) | `Colour_Exploration 2.png` |
| Colour Exploration III Tote | Tote | colour-exploration-iii-tote | 1 | null (Gelato processed) | `Colour_Exploration 3.png` |
| On the Light Table Tote | Tote | on-the-light-table-tote | 1 | null (Gelato processed) | `On the Light Table.png` |
| Candy I Tote | Tote | candy-i-tote | 1 | null (Gelato processed) | `Candy I.jpg` |
| Orange Sun Tote | Tote | orange-sun-tote | 1 | null (Gelato processed) | `Orange Sun.jpg` |
| Rainbow II Tote | Tote | rainbow-ii-tote | 1 | null (Gelato processed) | `Rainbow II.png` |
| Round Earth Tote | Tote | round-earth-tote | 1 | null (Gelato processed) | `Round Earth.jpg` |
| Neko Paw — Yellow Tank Top | Tank Top | neko-paw-yellow-tank-top | 1 | null (Gelato processed) | `Neko Paw — Yellow.png` |
| Neko Paw — Yellow Neon Tank Top | Tank Top | neko-paw-yellow-neon-tank-top | 1 | null (Gelato processed) | `Neko Paw — Yellow Neon.png` |
| Neko Paw — Yellow & Blue Tank Top | Tank Top | neko-paw-yellow-blue-tank-top | 1 | null (Gelato processed) | `Neko Paw — Yellow & Blue.png` |
| Neko Paw — Lilac Tank Top | Tank Top | neko-paw-lilac-tank-top | 1 | null (Gelato processed) | `Neko Paw — Lilac.png` |
| Neko Paw — Yellow II Tank Top | Tank Top | neko-paw-yellow-ii-tank-top | 1 | null (Gelato processed) | `Neko Paw — Yellow II.png` |
| Neko Human II Tank Top | Tank Top | neko-human-ii-tank-top | 1 | null (Gelato processed) | `Neko Human II.png` |
| Mask — I Tank Top | Tank Top | mask-i-tank-top | 1 | null (Gelato processed) | `Mask — I cropped.png` |
| Mask — II Tank Top | Tank Top | mask-ii-tank-top | 1 | null (Gelato processed) | `Mask — II.png` |
| Mask — Dream Tank Top | Tank Top | mask-dream-tank-top | 1 | null (Gelato processed) | `Mask — Dream.png` |
| Solar Face Tank Top | Tank Top | solar-face-tank-top | 1 | null (Gelato processed) | `Solar Face.png` |
| Monsters — Pattern Tank Top | Tank Top | monsters-pattern-tank-top | 1 | null (Gelato processed) | `Monsters — Pattern.png` |
| Garden — Lavender Tank Top | Tank Top | garden-lavender-tank-top | 1 | null (Gelato processed) | `Garden — Lavender.png` |
| Floating Poppies Tank Top | Tank Top | floating-poppies-tank-top | 1 | null (Gelato processed) | `Floating Poppies.png` |
| Night Poppies Tank Top | Tank Top | night-poppies-tank-top | 1 | null (Gelato processed) | `Night Poppies.png` |
| Colour Exploration III Tank Top | Tank Top | colour-exploration-iii-tank-top | 1 | null (Gelato processed) | `Colour_Exploration 3.png` |
| Style Exploration Tank Top | Tank Top | style-exploration-tank-top | 1 | null (Gelato processed) | `Style_Exploration.png` |
| Tourism — II Tank Top | Tank Top | tourism-ii-tank-top | 1 | null (Gelato processed) | `Tourism — II.jpg` |
| Tourism — III Tank Top | Tank Top | tourism-iii-tank-top | 1 | null (Gelato processed) | `Tourism — III.jpg` |
| Tourism — IV Tank Top | Tank Top | tourism-iv-tank-top | 1 | null (Gelato processed) | `Tourism — IV.jpg` |
| Taped Objects Tank Top | Tank Top | taped-objects-tank-top | 1 | null (Gelato processed) | `Taped Objects.png` |
| Purple Sun Tank Top | Tank Top | purple-sun-tank-top | 1 | null (Gelato processed) | `Purple Sun.jpg` |
| Candy I Tank Top | Tank Top | candy-i-tank-top | 1 | null (Gelato processed) | `Candy I.jpg` |
| Sitspot Large Tank Top | Tank Top | sitspot-large-tank-top | 1 | null (Gelato processed) | `Sitspot Large.png` |
| Elsk Tank Top | Tank Top | elsk-tank-top | 1 | null (Gelato processed) | `Elsk.png` |