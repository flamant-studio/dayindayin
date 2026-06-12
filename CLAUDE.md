# DayInDayIn — Claude Code Handover
*Last updated: 2026-05-24*

---

## AUTONOMY — READ THIS FIRST

Claude operates with **full autonomy** on this project.

**Stop and escalate to Sebastian ONLY when:**
1. An action would expose a secret, key, token, or credential outside `.env` files
2. An action would cause irreversible damage to the local machine
3. An action would incur unexpected third-party costs

**Everything else: decide, act, deploy, log.** Pushes to `main` auto-deploy via Vercel. Do not ask before deploying. Escalate by posting to Slack `#system-alerts` + Linear ticket with `hold` label — then keep working.

---

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
| Online Store publish | ✅ All 671 active products published to Online Store channel (2026-05-24) |
| Design system | ✅ Playfair Display + Inter, vermillion accent |
| Nav | ✅ Desktop header + mobile bottom tab bar (Home/Shop/Artist/Cart) |
| Shopify tokens | ✅ SHOPIFY_STOREFRONT_TOKEN + SHOPIFY_ADMIN_TOKEN in .env.local |
| Gelato — vertical template | ✅ `6005fae3` — A4/A3/A2 portrait. Placeholder: `nekopaw_yellow_neon.png` |
| Gelato — horizontal template | ✅ `18600284` — A5/A4/A3 landscape. Placeholder: `Tourism_1.png` |
| Active products | ✅ **75 LIVE** — all published to Online Store (2026-06-12). 76th pending Gelato sync. |
| Multi-size variants | ✅ All poster products have A4/A3/A2 (vertical) or A5/A4/A3 (horizontal) variants |
| Products in shop | ⏳ 75 live, mockup images still generating async in Gelato (hours-days) |
| Category labels | ✅ Tag-based: tufting→Tufted Works, embroidery→Embroidery, painting→Painting, photography→Photography |
| Series filters | ✅ SHERO/NEKO/Sea Monsters/Botanical/Floral/Faces/Sommerby — tags backfilled |
| Product pages | ✅ Breadcrumb, variant selector (A4/A3/A2), size guide, image gallery, lightbox, cross-sells, JSON-LD |
| SEO | ✅ sitemap.xml (273 URLs), robots.txt (App Router), OG image |
| Cookie banner | ✅ localStorage-based, z-index 250 |
| RecentlyViewed | ✅ localStorage-based, shows on product pages |
| Search | ✅ /search?q= — full-text across title/description/tags |
| robots.txt | ✅ App Router generated (public/robots.txt removed — was conflicting) |
| Domain dayindayin.dk | 🔲 Not yet pointed to Vercel (Simply.com DNS) |
| Shopify Payments KYC | 🔲 Pending — eliminates 2% fee |
| Legal pages | 🔲 Pending — privacy policy, copyright, fulfillment T&C |
| CONTACT_EMAIL_TO | 🔲 Pending — Stine's actual email in Vercel env vars |
| Newsletter API | 🔲 Signup shows "Thank you" but doesn't subscribe — needs Mailchimp/Klaviyo |
| Other product types | 🔲 Mugs, totes, water bottles, tank tops, dad caps — CSVs ready in `DayInDayIn Images/`, not yet imported |
| Gelato image generation | ⏳ All 76 poster products pending mockup images (async, hours-days) |
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

**Templates:**
| ID | Type | Sizes | Prices (EUR) | Placeholder |
|---|---|---|---|---|
| `6005fae3` | Vertical portrait | A4 / A3 / A2 | €20 / €25.95 / €35.95 | `nekopaw_yellow_neon.png` |
| `18600284` | Horizontal landscape | A5 / A4 / A3 | €15.95 / €19.95 / €25.95 | `Tourism_1.png` |

**Products seeded (76 total — all LIVE with 3 size variants):**
- 28 vertical artworks → template `6005fae3` → A4/A3/A2 variants
- 35 horizontal artworks → template `18600284` → A5/A4/A3 variants
- 13 square artworks → vertical template (bordered)

**Seed script:** `scripts/seed-gelato-posters-multisize.ts` — comprehensive, uses GitHub raw URLs directly (no Vercel Blob needed). Deletes existing products then recreates with multi-size variants.

**Publish script:** `scripts/publish-gelato-to-shopify.ts` — finds synced products and publishes to Online Store. Run after any new seeding. Note: mutation format must be `input: [{ publicationId: "..." }]` (NOT `publicationIds`).

**To add more products:** update `seed-gelato-posters-multisize.ts` arrays, or write new script for non-poster types. For mugs/totes/caps, CSV import via Gelato UI is fine (single variant is correct for those).

**HARD RULES (learned 2026-06-11, cost a full evening):**
- Posters: NEVER via CSV import — it creates single-variant products (no size selector). Always the seed script.
- Before ANY seeding: `curl` one image URL and confirm 200 — the repo must be public for Gelato to fetch artwork.
- Template UIDs must be fetched from the live API, never derived from the catalog — derived UIDs silently fail all rows but one.
- Canary rule: 1 product end-to-end (created → synced → visible → cart works) before any batch.

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
