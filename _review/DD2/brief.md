# DD2 — shop tweaks S1–S7
DoD (one line): product type shown on every card; SHERO art prints removed (tufted kept); art prints added for confirmed photos/paintings; broken caps dropped; each new product passes the 7-point "verified" definition; reviewer verdict.
Deliver-in: Vercel (push to main auto-deploys dayindayin-site.vercel.app; post-run merges the branch). Shopify/Gelato are the catalog backends.
Risk: removing the wrong live products (checkout is paused, so no orders lost) or shipping low-res art for print.
Mandate: proceed alone — except the Gelato CSV import, which the process contract reserves for Sebastian.

## Existing material
- MANIFEST.csv already holds Art Print rows for Dead Flowers, Taped Objects, Red and Green Moss, Blue Flower on Green Wood (marked EXISTING but NOT live in Shopify or Gelato — verified via API dump _review/DD2/catalog_before.json, gelato_before.json). Sri Lanka Masks art print IS live (sri-lanka-masks-fine-art-print, 4032×3024 source).
- DayInDayIn Images/gelato_fap_horizontal_export.csv already had rows for the 4 missing prints; sources flowers/*.png + various/Taped Objects.png are 1500×1000 web exports (CLAUDE.md: need upscaling for large format).
- Polaroids: work exists in lib/data.ts (Vercel Blob mixed/polaroids-on-fabrics.jpg); no print-ready file in the repo or manifest.
- Cap data: _review/DD2/caps_before.json; 5 live caps.
- Live presence: https://dayindayin-site.vercel.app (checkout paused since 2026-08-17).
## Assumptions
- "Product type on every card": ProductCard already printed categoryLabel; Apparel was too vague (caps/tank tops), so added cardTypeLabel (Dad Cap / Tank Top).
- SHERO removal = the 3 Art Print products only (Fine Art Print handles); framed SHERO rows were never built and are left alone.
- Gelato artwork can only be assigned via Sebastian's CSV import (CLAUDE.md HARD RULE #0); not improvised.
