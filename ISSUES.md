# DayInDayIn — Open Issues & Design Backlog
*Last updated: 2026-06-20 — Logged from Sebastian's direct feedback*

---

## CRITICAL — Not yet addressed

### ISS-01: Product variant selectors missing on PDPs
**What:** Size variants (A4/A3/A2) and frame options not showing as selectable on product detail pages. User cannot choose size/frame before adding to cart.
**Root cause (2026-06-20):** ALL Shopify products have only 1 "Default Title" variant. Gelato synced products to Shopify with single variants only — the multi-size/frame matrix never appeared in Shopify. Gelato API confirms products have `productVariantOptions` (e.g. A4/A3/A2/A1 × frame colors) but only 1 variant was pushed. This is a data infrastructure issue, NOT a front-end bug. Additionally, the `parseFramed()` regex had a bug: it expected `/` separator but Gelato uses ` - ` in variant titles.
**Where:** `components/ProductOptions.tsx` + data layer
**What was done (2026-06-20):**
- Fixed `parseFramed()` to handle actual Gelato title format (` - White frame` not `/ White frame`)
- Replaced misleading interactive chip UI with plain informational text: "Available sizes XS · S · M · L · XL · 2XL — Choose at checkout"
- Framed prints: "Sizes A4 · A3 · A2 · A1  ·  Frames White · Wood · Black"
- Art prints: "Available sizes A4 · A3 · A2"
- Mugs: "Available in White · Black · Side A · Side B"
- Tank tops: "Available sizes XS · S · M · L · XL · 2XL"
- Sebastian confirmed: previous chip UI looked interactive but wasn't (ISS-01 screenshot). New text UI is clearly informational.
**Status:** ⚠️ PARTIAL FIX — UX correct (plain text, not misleading buttons). Real fix requires data migration: Shopify products need proper variant matrices. Requires Gelato pricing data before migration can run safely.

### ISS-02: Product card info area should be white
**What:** The text section below each product card image (title, type label, price) uses the same chalk/beige as the page background. Cards need a WHITE (#FFFFFF) background on the info section so they visually "pop" and feel like cards, not flat blocks.
**Where:** `app/page.module.css` (.cardInfo), `app/shop/page.module.css` (.cardInfo), all PLP components
**Status:** ✅ FIXED (2026-06-20) — `.card { background: #fff }` with subtle shadow in both homepage and shop page CSS

### ISS-03: Framed print cards cropped badly on PLP
**What:** Framed print mockup images show only top+bottom frame bars in the card — the artwork is barely visible. The objectFit:contain approach puts the tall framed-print mockup into a square card area, resulting in huge black bars.
**Where:** Product card image rendering. Needs a taller aspect ratio for framed print cards, OR crop to show artwork area only, OR objectFit:cover with centre focus
**Status:** ✅ FIXED (2026-06-20) — Framed prints now explicitly route to `cardImgMockup` class (objectFit:contain on white bg) in both `app/page.tsx` and `app/shop/page.tsx`

### ISS-04: Sticky add-to-cart bar — wrong colors
**What:** The sticky "Add to cart — 418 kr" bar at the bottom of PDPs uses a dark navy/almost-black background. Should be terracotta (#C4694F) to match the main CTA button color, or at minimum chalk background with slate text.
**Where:** `components/StickyATC.module.css` (.btn)
**Status:** ✅ FIXED (2026-06-20) — `.btn { background: var(--c-accent) }` (terracotta)

### ISS-05: Recently viewed carousel — beige strips on card images
**What:** Recently viewed product cards show beige strips above and below the product image (objectFit:contain with page background showing through). Image background should be white (#FFFFFF).
**Where:** `components/RecentlyViewed.module.css` — .imgWrap background-color should be white
**Status:** ✅ FIXED (2026-06-20) — `.imgWrap { background: #fff }` and `.imgPlaceholder { background: #f5f4f2 }`

### ISS-06: Unique Art PDPs need full redesign
**What:** Works at /works/[slug] (e.g. /works/candy-I) use same visual weight as Gelato product PDPs. They need to be visuals-first, immersive, showing MULTIPLE photos of the same piece. Must search Dropbox for all photos of each artwork.
**Where:** `app/works/[slug]/page.tsx` — needs distinct template
**Priority:** High — these are Stine's originals, they drive commissions
**What was done (2026-06-20):**
- Redesigned template: full-bleed hero (78vh) replaces 60/40 grid
- Category label + title + year overlaid at hero bottom-left; breadcrumb at top-left
- Info section: description/note/share left, sticky enquiry CTA + meta table right
- Gallery section "Studio views" if `work.gallery` exists; first photo spans full width
- Uploaded 5 Candy I studio photos from Dropbox → Vercel Blob → `lib/data.ts` gallery array
- Template distinct from Gelato PDPs: no specs row, no add-to-cart, editorial tone
**Status:** ✅ FIXED (2026-06-20)

### ISS-07: Homepage — information hierarchy and section separation
**What:** The homepage has unclear visual hierarchy. Sections don't clearly signal what belongs together. Headline hierarchy is inconsistent. Spacing doesn't create clear section breaks. Principle: "most important info first" — needs audit and restructure.
**Where:** `app/page.tsx` + `app/page.module.css`
**What was done (2026-06-20):**
- Moved "One of a kind / Art for every wall" to position 2 (right after hero) — immediately answers "what is this?"
- Moved Candy I editorial to position 3 — story/emotion before commerce
- Series strip now position 4 with border-top + proper top padding (was only var(--sp-2))
- "In the shop" product grid now position 5 — discovery after context (renamed from "Latest Work", trimmed to 8 products)
- Artist strip, blog, newsletter, lifestyle strip remain in order at bottom
**Status:** ✅ FIXED (2026-06-20)

### ISS-08: Homepage video hero
**What:** A video (looping, muted, autoplay) was discussed for the hero section. Currently uses a static lifestyle photo. Need to source/create a short loop of Stine's studio/work process.
**Where:** `app/page.tsx` hero section
**Note:** Requires video asset — Sebastian to provide or source
**Status:** Blocked on asset

### ISS-09: Design system — no reference document exists
**What:** No design system MD file or Canva visual system exists. Needed: typography scale, color palette + usage rules, UX iconography, page templates, section templates, atoms/sub-elements, spacing rules, margin/padding system, reusable artefacts.
**Where:** Create `DESIGN_SYSTEM.md` in project root + Canva visual
**Status:** Open (DESIGN_SYSTEM.md created — see below)

---

## DONE in Loops 4–5

- ✅ objectFit:contain for artwork images (SavedContent, RecentlyViewed, ImageGallery)
- ✅ Format siblings cross-sell on PDPs
- ✅ Specs row always visible on multi-variant products (material/finish, not size)
- ✅ Footer product type links (Wood Prints, Water Bottles added)
- ✅ Pricing accuracy (postcards 56 kr min, mugs corrected to 89 kr)
- ✅ Series card subtitles updated to Stine's voice
- ✅ About page 2026 milestone updated
- ✅ Blog shopCta algorithm fixed (occurrence-count, Sommerby keyword added)
- ✅ Blog post image updated (Sommerby → blue-branch.jpg)

---

## METHODOLOGY RULES (from Sebastian, 2026-06-20)

1. Read this file at the start of every session before generating task lists
2. Every autonomous task must close or progress a numbered issue above
3. Don't audit pages that have no open issue — that's busywork
4. Validate by reading code, not just Playwright screenshots
5. Deploy → Playwright audit → close issue or create new one if found
6. Build reference files (design system, issues log) before executing
