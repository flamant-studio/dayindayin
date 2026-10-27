# DD7 — 7-point "verified" table (live, after publish 2026-10-27)
Sources: detail_before/after.json (Shopify Admin), gelato_before.json (Gelato API), live_checks.jsonl + visual_qa.md (https://dayindayin-site.vercel.app).

| # | Check | Blue Flower on Green Wood | Dead Flowers | Red and Green Moss | Taped Objects |
|---|---|---|---|---|---|
| 1 | Title matches artwork | PASS | PASS | PASS | PASS |
| 2 | Different images from each other | PASS (hash 865220b505) | PASS (c189831f82) | PASS (72693cf025) | PASS (938cfb31e9) |
| 3 | Correct variants per type | **FAIL** 1 of 3 sizes (A4 only, 148.96) | **FAIL** same | **FAIL** same | **FAIL** same |
| 4 | Category/series tags | PASS label "ART PRINT"; Shopify tags empty, same as the peer prints (Purple Flower, Two Cats, Tourism I) | same | same | same |
| 5 | Product page clickable | PASS 200, Add to cart present | PASS | PASS | PASS |
| 6 | Built from correct template | PASS Gelato productUid fine_arts_poster…hor_a4-8x12 (CSV UID taken from template 18600284); Gelato API returns no templateId | PASS | PASS | PASS |
| 7 | Visible on live site | PASS in /shop, /search; 0 console errors at 1280 + 390 | PASS | PASS | PASS |

Price: A4 variant 148.96 = A4 price of the other fine art prints (Purple Flower, Two Cats, Tourism I: 148.96). 6x8 in (153.58) and A3 (195.82) are missing.
Check 3 cause: the Gelato CSV import created ONE variant (A4 horizontal, connected) per product in Gelato itself; Shopify mirrors it as "Default Title". Adding Shopify-only variants would be unfulfillable (no Gelato link), so it is not a data fix.
Not in the 7 points: images are 2048px Shopify mockups; visual QA found them sharp enough (Blue Flower slightly soft at 1280). Other unpublished ACTIVE products (tank tops, totes, shero cap…) were deliberately NOT touched.
NEEDS STINE/SEBASTIAN (one line): in Gelato add the 6x8 in and A3 variants to the 4 "— Fine Art Print" products (template 18600284, then republish) — until then each print sells in A4 only.
