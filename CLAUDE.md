# DayInDayIn — Claude Code Handover
*Last updated: 2026-06-12*

---

## AUTONOMY — READ THIS FIRST

Claude operates with **full autonomy** on this project.

**Stop and escalate to Sebastian ONLY when:**
1. An action would expose a secret, key, token, or credential outside `.env` files
2. An action would cause irreversible damage to the local machine
3. An action would incur unexpected third-party costs

**Everything else: decide, act, deploy, log.** Pushes to `main` auto-deploy via Vercel. Do not ask before deploying. Escalate by posting to Slack `#system-alerts` + Linear ticket with `hold` label — then keep working.

---

## WHERE THINGS LIVE — follow exactly, no improvising

| What | Where |
|---|---|
| Website code | repo `flamant-studio/dayindayin-site`, branch **`main`** only |
| Artwork/images | repo `flamant-studio/dayindayin` (PUBLIC — Gelato fetches raw URLs from it). ⚠ Similar name, different repo — do not confuse |
| Deploy | push to `main` → Vercel auto-deploys production. No dev branches, no PRs |
| Canonical live URL | **https://dayindayin-site.vercel.app** (dayindayin.dk DNS not yet pointed). ALL proof screenshots/links use this URL — never localhost, never auth-walled preview URLs |
| End state of every task | committed → pushed → deployed → live URL screenshot. Local-only = not done |

## THE PROCESS CONTRACT (agreed with Sebastian 2026-06-13 via 20 questions)

**Division of labour — permanent:**
- Sebastian owns: building/fixing Gelato templates · approving the manifest · the 60-second grid eyeball after each run · ordering physical samples
- Machine owns: everything else, fully API, zero clicks from Sebastian

**Run discipline:** runs happen ONLY when Sebastian triggers them until the process has produced one provably correct end-to-end result. At forks: pick one, proceed, note it in the report.

**"Verified" for a product run means ALL of (Sebastian's definition):**
1. Title matches the displayed artwork
2. Products have DIFFERENT images from each other
3. Correct variants per type
4. Correct category/series tags
5. Product pages clickable
6. Built from the correct template
7. Visible on https://dayindayin-site.vercel.app
(Cart/checkout NOT part of run verification — separate gate.)

**Decisions on file:** launch set = 100+ products · pricing stays as-is until post-launch · squares use Sebastian's existing square template · Mikofu planned separately, later. **Open audit:** GitHub repo vs Dropbox _KUNST — verify the repo's print files are current/complete (one-time deterministic comparison).

## ASSET FLOW — one direction, four boxes, never improvise alternatives

```
GitHub repo `dayindayin` (public)   ← SOURCE artwork, print-ready files
        ↓ fetched once at create/patch time
Gelato                              ← print file (internal copy) + mockup factory
        ↓ sync
Shopify CDN                         ← mockup images = product images
        ↓
Site renders Shopify CDN only
```

The pipeline, end to end, is ONE deterministic factory run from MANIFEST.csv:
create/patch from manifest → wait for sync → enable on Online Store → hash-verify every product image against manifest → report. "Add products" = add manifest rows, run factory. Vercel Blob is legacy — migrate off, never add to it.

## What DayInDayIn Is

Stine Weirsøe Flamant's art brand. Two related things:

1. **dayindayin.dk** — Stine's portfolio and print shop website (Next.js, Vercel)
2. **Artwork archive** — Stine's full body of work, being catalogued for use across Gelato print-on-demand products (primarily via Mikofu / mikofu.com)

The art is the product source for the Fluid e-commerce system. DayInDayIn is both a standalone brand and the creative supply chain for Mikofu.

---

## Current State (2026-06-12)

| Layer | Status |
|---|---|
| Next.js site | ✅ Live on Vercel |
| Shop pages | ✅ Homepage, /shop, /shop/[handle], /shop/collections/[handle] |
| Cart system | ✅ **WORKING** — add/remove/qty controls, Shopify checkout |
| Design system | ✅ Playfair Display + Inter, vermillion accent |
| Nav | ✅ Desktop header + mobile bottom tab bar (Home/Shop/Artist/Cart) |
| Shopify tokens | ✅ SHOPIFY_STOREFRONT_TOKEN + SHOPIFY_ADMIN_TOKEN in .env.local |
| Gelato — vertical poster template | ✅ `6005fae3` — A4/A3/A2 portrait |
| Gelato — horizontal poster template | ✅ `18600284` — A5/A4/A3 landscape |
| Gelato — mug template | ✅ `0e9a0a04` — 4 variants (White/Black × Design A/B) |
| Gelato — tote template | ✅ `a28d9355` — 1 variant |
| Gelato — tank top template | ✅ `2edd0df8` — 6 size variants (XS–2XL) |
| Gelato store | ✅ 304 products: 76 posters + 76 mugs + 76 totes + 76 tank tops |
| Online Store publish | ✅ 113/304 published (2026-06-12 night run pass 1). 191 syncing from Gelato. |
| **Live in shop** | ✅ **76 poster products showing** (have images). Mugs/totes/tanks appear when Gelato generates mockups. |
| Product variant UX | ✅ Posters: A4/A3/A2 selector. Mugs: Color × Design 2D picker. Tanks: Size selector. Totes: single variant. |
| Category labels | ✅ Mug/Tote Bag/Apparel/Framed Print/Art Print/Tufted Work/Embroidery/Photo Print |
| Series filters | ✅ SHERO/NEKO/Sea Monsters/Botanical/Floral/Faces — all working |
| Product pages | ✅ Breadcrumb, size guide (null for mugs/tanks/totes), gallery, lightbox, cross-sells, JSON-LD |
| SEO | ✅ sitemap.xml (paginated, all 304+ products), robots.txt, OG image |
| Search | ✅ /search?q= — full-text, 250 products |
| Cookie banner | ✅ localStorage-based |
| RecentlyViewed | ✅ localStorage-based, shows on product pages |
| Wishlist | ✅ Heart icon on shop grid, /saved page |
| Share buttons | ✅ Pinterest + copy-link on product pages |
| Error boundaries | ✅ /shop/error.tsx + /shop/[handle]/error.tsx |
| Domain dayindayin.dk | 🔲 Not yet pointed to Vercel (Simply.com DNS) |
| Shopify Payments KYC | 🔲 Pending — eliminates 2% fee |
| Legal pages | 🔲 Pending — privacy policy, copyright, fulfillment T&C |
| CONTACT_EMAIL_TO | 🔲 Pending — Stine's actual email in Vercel env vars |
| Newsletter API | 🔲 Signup shows "Thank you" but doesn't subscribe — needs Mailchimp/Klaviyo |
| Water bottles / dad caps | 🔲 CSVs ready in `DayInDayIn Images/`, not yet created in Gelato |
| Publish pass 2 | ⏳ Run `npx tsx scripts/publish-gelato-to-shopify.ts` tomorrow to publish remaining 191 products |
| Mockup image generation | ⏳ Gelato generating mockups for all 228 new products (async, hours–days) |
| 76th product | ⏳ 1 product pending Gelato→Shopify sync — run `npx tsx scripts/publish-gelato-to-shopify.ts` to catch it |

**Gelato store ID:** `51ee1b39-75e6-4c19-af02-cfd7cb771a4a`

---

## Artwork Archive

**Audit file:** `product-candidates.html` — complete audit of Stine's Dropbox archive organised by series. Open in browser to navigate.

**Asset location:** `~/Dropbox/_KUNST/` — full archive

**Print-ready assets (use immediately, no upscaling needed):**
- Neko paw series: `~/Dropbox/_KUNST/Studio/Shop of Words/nekopaw_*.png` — 4961×7016px (A4@300dpi), 4 colorways + SVG vector master
- Neko paw + text: `Neko_paw_text.png` — 8192×8192px
- Tourism series: `~/Dropbox/_KUNST/Studio/print ready/Tourism_1–4.tiff` — TIFF originals ~4032×3024px
- Strong Floral + Imprint of Movement: `~/Dropbox/_KUNST/Studio/print ready/Art photo/` — confirmed print-ready
- Kaninskoven small tile: `Kaninskoven_Lille.png` — 4000×4000px (cushion covers)
- Monsters pattern: `2021-10-30 10.59.01-1.png` — 5906×5906px
- Elephant illustrations (x4 colorways): `~/Dropbox/_STINE/Design/Elefant_*.png` — 3694×3024px
- SHERO patch: `shero_patch_pink-blue_8500x5000.png` — 8500×4981px (cloud-only, sync Dropbox first)

**Assets needing AI upscaling before large-format print:**
- Most Photography series (1500×1000px web exports, no RAW)
- Sri Lanka Masks series (1500×1000px, 7 views — worth upscaling, strong series)
- Embroidery series (most are 1500×1000px web exports)

**Assets with vector source (any size):**
- Neko pote SVG: `~/Dropbox/_KUNST/Studio/dayindayin artstudio/Neko_pote.svg`
- BYOB collection: `.ai` source files in `Shop of Words/udsagn - printklar/shopofwords_collection_byob/byob ai originaler/`

---

## Gelato Integration

**Store ID:** `51ee1b39-75e6-4c19-af02-cfd7cb771a4a`

**Template endpoint (confirmed 2026-06-13):** `GET https://ecommerce.gelatoapis.com/v1/templates/{templateId}` — global endpoint, NOT store-scoped. Returns variants with `productUid` and `imagePlaceholders[].name`. No list endpoint exists (verified, do not retry).

**All templates — IDs, variants, and imagePlaceholder names:**
| Type | Template ID | Variants | imagePlaceholder name(s) |
|---|---|---|---|
| Art Print — Vertical | `6005fae3-64a6-4f62-8328-93d2ce6bae58` | 3 (A4/A3/A2) | `background`, `infinity watermark dayin.png` |
| Art Print — Horizontal | `18600284-2b9d-433a-af02-d728dc81e83b` | 3 (A5/A4/A3) | `background`, `Tourism_1.png`, `infinity watermark dayin.png` |
| Art Print — Square | `e88c70d0-745b-436f-962a-c45bee52c2f6` | 4 (25/30/40/50 cm) | `Image 4` |
| Poster — Semi-glossy Vertical | `1339c7ec-201f-4188-a50b-c535cb414957` | 3 (A1/A2/A3 portrait — larger/cheaper) | `background` |
| Framed Print — Vertical | `392687cd-4959-4186-bc3a-fb135d1e0c1d` | 12 (A4/A3/A2/A1 × black/white/wood) | `Neko_pote_1.png`, `background` |
| Framed Print — Horizontal | `992be2b6-4005-4abb-884c-9d4fa2f4affb` | 12 (A4/A3/A2/A1 × black/white/wood) | `background` |
| Mug | `0e9a0a04-1016-4216-9a40-4f42a00b8dca` | 4 (White/Black × Design A/B) | `background` |
| Tote Bag | `a28d9355-d78d-4d13-afec-8f120d989280` | 1 (Natural) | `background`, `background2` |
| Tank Top | `2edd0df8-f9b1-4037-a7a2-456cd768739d` | 6 (XS–2XL) | `background` |
| Greeting Card | `e6ba01e0-1fec-4f4b-807a-f5f396aa93e9` | 1 (Pack of 10, A6 folded landscape) | `background` (front), `background2` (inside), `infinity watermark dayin.png` |
| Postcard — Horizontal | `7d1420de-a541-4c80-bea4-3ede650be932` | 1 (Pack of 10, A6) | `IMG_1944.png`, `trimmed_element_08aa...` |
| Postcard — Vertical | `31291c4e-afc0-4038-9103-fd58ab3ce441` | 1 (Pack of 10, A6) | `Untitled_Artwork 12.png` |
| Water Bottle | `8d192eeb-22c2-49cf-bb6f-b7df07fe11ce` | 1 (17oz stainless white) | `Neko_pote 1.png`, `shopofwords_beauty_print copy.png` |
| Wood Print | `01f297ae-5d03-41bc-8ffe-44e023c4d7c6` | 1 (200×200mm birch) | `Neko_pote 1.png` |
| Dad Cap | `4350a3d2-888e-4b7f-a504-90d4fc34d9a4` | 2 (graphite-grey / sand) | `shero_patch_pink-blue_8500x5000.png` |
| Crewneck — Heavyweight Embroidery | `461771cb-a59e-4d1b-b767-18bab73d6f6c` | 6 (S/M/L/XL/2XL/3XL, white Gildan) | `infinity watermark dayin.png` ⚠ only 1 placeholder — see crewneck note |

**PRODUCTION MECHANISM — CSV import via Gelato UI (confirmed 2026-06-13)**

CSV import is the ONLY verified mechanism for creating products with correct artwork. The ecommerce API cannot reliably assign artwork to products. Sebastian imports CSVs manually in the Gelato UI.

**CSV files (in `DayInDayIn Images/`) — all productUIDs verified against live templates:**
| File | Template | productUid in CSV | Status |
|---|---|---|---|
| `gelato_mug_export.csv` | Mug | `mug_product_msz_11-oz_mmat_ceramic-white_cl_4-0` | ✓ verified |
| `gelato_tote_export.csv` | Tote | `bag_product_bsc_tote-bag_bqa_prm_bsi_std-t_bco_natural_bpr_4-4` | ✓ fixed 2026-06-13 |
| `gelato_tank_top_export.csv` | Tank Top | `apparel_product_gca_t-shirt_gsc_tank-top_gcu_unisex_gqa_prm_gsi_m_gco_white_gpr_4-0` | ✓ fixed 2026-06-13 |
| `gelato_fap_square_export.csv` | Square | `fine_arts_poster_geo_simplified_product_12-0_ver_300x300-mm-12x12-inch_...` | ✓ verified |
| `gelato_framed_vertical_export.csv` | Framed Vert | `framed_poster_mounted_premium_210x297mm-8x12-inch_black_wood_w20xt20-mm_..._ver` | ✓ fixed 2026-06-13 |
| `gelato_framed_horizontal_export.csv` | Framed Horiz | `framed_poster_mounted_premium_210x297mm-8x12-inch_black_wood_w20xt20-mm_..._hor` | ✓ fixed 2026-06-13 |
| `gelato_postcard_hor_export.csv` | Postcard H | `pack_of_cards_qt_10_pcs_pf_a6_...hor` | ✓ verified |
| `gelato_postcard_ver_export.csv` | Postcard V | `pack_of_cards_qt_10_pcs_pf_a6_...ver` | ✓ verified |
| `gelato_water_bottle_export.csv` | Water Bottle | `bottle_product_bsz_17-oz_bmat_stainless-steel-white_cl_4-0` | ✓ verified |
| `gelato_wood_print_export.csv` | Wood Print | `wood_200x200-mm-8x8-inch_lined-plywood_20-mm_hor-grain_4-0_ver` | ✓ verified |
| `gelato_dadcap_export.csv` | Dad Cap | `apparel_product_gca_hat_gsc_dad-hat_gcu_unisex_gqa_organic_gsi_onesize_gco_graphite-grey_gpr_4-0-emb_beechfield_b54n` | ✓ verified |
| `gelato_semiglossy_poster_export.csv` | Semi-glossy Vertical | `flat_a3_200-gsm-80lb-coated-silk_4-0_ver` | ✓ verified 2026-06-13 |
| `gelato_greeting_card_export.csv` | Greeting Card | `pack_of_folded_cards_qt_10_pcs_pf_a6_upt_350-gsm-130lb-coated-silk_cl_4-4_ft_crease-ver_ct_glossy-protection_prt_1-0_sft_none_hor_ept_premium` | ✓ verified 2026-06-13 |
| `gelato_crewneck_export.csv` | Crewneck Embroidery | `apparel_product_gca_t-shirt_gsc_crewneck_gcu_unisex_gqa_heavy-weight_gsi_m_gco_white_gpr_chstl-emb_gildan_5000` | ⏳ awaiting template fix — see note |

**Audit script:** `scripts/audit-csv-uids.ts` — re-run before any import session to confirm UIDs still match templates.

**HARD RULES (updated 2026-06-13):**

- **#0 — API CANNOT SET ARTWORK. FULL STOP.** Three mechanisms tried on 2026-06-13, all failed silently:
  1. `PATCH /products/{id}/variants/{variantId}` with `{ fileUrl }` → 200, artwork unchanged
  2. `POST /products/{id}/variants/{variantId}/print-files` with `{ fileUrl, type: "default" }` → 200, print file stored, mockup still shows template placeholder
  3. `create-from-template` with `imagePlaceholders: [{ name: "background", fileUrl }]` → 200, artwork unchanged
  The print-files POST stores the file used for actual printing, but the product mockup/display image is always the template's original. **Do not attempt any of these again.** CSV import via Gelato UI is the only path.

- **#1 — productUIDs must come from the live template API, never guessed.** Run `scripts/audit-csv-uids.ts` before every import session. Two past failures: tote (`_4-0` vs actual `_4-4`), tank top (`gqa_organic` vs actual `gqa_prm`). Both would have silently failed (76 rows → 1 product or 0).

- **#2 — CORRECTION (2026-06-13, from Sebastian directly):** the "CSV import = single-variant trap" diagnosis from May is WRONG — UI CSV import against a multi-size template produces all sizes. Never cite this again.

- Before ANY import: `curl` one GitHub raw image URL and confirm 200 — repo must be public.

- Canary rule: 1 product end-to-end before any batch.

- **Crewneck template note (2026-06-13):** Template `461771cb` only exposes ONE placeholder: `infinity watermark dayin.png`. Sebastian flagged the template "might include two images." This means: (a) if the second image is a static element baked into the template, all 76 crewnecks will share that static image — the CSV can only swap the watermark slot; (b) if `infinity watermark dayin.png` IS the artwork slot (Sebastian named it after the first image he put there), the CSV works normally. **Resolve before building `gelato_crewneck_export.csv`:** Sebastian to confirm in Gelato editor whether the artwork position is a configurable placeholder or a static layer.

**Publish script:** `scripts/publish-gelato-to-shopify.ts` — run after imports to push products to Online Store. Mutation format: `input: [{ publicationId: "..." }]` (NOT `publicationIds`).

**Large PNG/TIFF files:** convert to JPEG via `sips -s format jpeg -s formatOptions 95` before upload.

---

## Artwork Catalog (FLA-85)

Full walkthrough of Stine's studio to photograph and catalogue every piece. Instruction file at `catalog/CATALOG_INSTRUCTIONS.md`.

Numbering system:
- `DID-T-XXX` — Tufting
- `DID-E-XXX` — Embroidery
- `DID-P-XXX` — Painting
- `DID-PH-XXX` — Photography

Output: `catalog/artwork-catalog.csv` — Claude generates titles, descriptions, SEO from photos once walkthrough is done.

---

## Site Stack

- **Framework:** Next.js (App Router)
- **Hosting:** Vercel
- **Domain:** dayindayin.dk (not yet pointed)
- **GitHub:** `github.com/flamant-studio/dayindayin-site` (confirm repo exists)

---

## Brand Notes

- **Artist:** Stine Weirsøe Flamant
- **Aesthetic:** Contemporary Danish art. Bold, graphic, often text-based. Ranges from feminist pop-art (SHERO, NEKO) to quiet nature photography to abstract pattern.
- **Tone:** Direct. Warm but not soft. Art-world confident without being intimidating.
- **Languages:** Danish primary, English secondary (for Mikofu/international)
- **Key series:** SHERO, NEKO/Cat, Shop of Words (text works), Tourism, Embroidery, Tufting, Pattern Repeats
