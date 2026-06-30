# DayInDayIn — Session Log

---

## 2026-06-30

**Done:**
- Design-system audit + rewrite: `DESIGN_AUDIT.md` (reality inventory, Brad-Frost interface-inventory method) + `DESIGN_SYSTEM.md` rewritten as the accurate source of truth (real globals.css tokens; the old doc had every colour value wrong + documented a mobile tab bar that was never built)
- Built the shared component system, replacing ~19 hand-built cards + 10 section headers + scattered buttons/breadcrumbs: `Button`, `Breadcrumb`, `SectionHeading`, `ProductCard`, `ArtworkCard`, `EditorialCard`, `SeriesCard`, `useLightbox` hook
- Migrated shop, home, fine-art, archive, works, blog, art-journal, collections, shop/[handle] cross-sells, shop/collections, and search onto the components
- Product card finalised: one 4:5 box, `contain`, never crop; CTA always "View product" (removed quick-add from the card)
- Earlier in the window: UX Batch 3 (fine-art + commissions) + build unblock (playwright excluded from tsconfig so Vercel deploys again)

**Decisions:**
- Product card: never crop the art (it's an art shop). 4:5 + contain chosen with Sebastian over 1:1 / cover.
- Galleries stay two components (PDP variant gallery vs editorial mosaic) — merging would be a flag-heavy mess; share `ImageLightbox` + `useLightbox` instead.
- Proven with the two Neko posters: the size difference is NOT A4/A3 (same 2048² template) — it's the artwork's own background (white-bg vs full-bleed colour). Grid cohesion now needs Gelato-side mockup-background standardisation, not a site fix.

**Next:**
- Gelato (Sebastian's templates): standardise all mockup backgrounds to one warm white; fix white-on-white products (tank top, water bottle); pick one flat-art presentation rule.
- Microcopy pass: unify CTA link texts (View all / See all / All products…).

---

## 2026-06-30 (continued — SYS-10 + SYS-05 start)

**Done:**
- ISSUES.md reconciled against the shipped P0 component system (had sat uncommitted since 2026-06-21) — SYS-02/03/04/06/07 moved to CLAIMED with screenshot proof against the live URL.
- **SYS-10 (new, found this pass):** `/fine-art` was rendering at 114,962px tall on desktop (every other page: 1.7k–11k). Root cause git-bisected to `e76af4f` (2026-06-28): the "single-column editorial" grid change had no width cap, so 89 works at near-full 1200px page width × aspect-ratio 3:4 stacked into a monster page. Fixed by capping `.grid` to `--w-prose` (700px) — preserves the explicit single-column decision, brings it to 73,688px. Verified against the live URL. Still long by design (89 unpaginated works) — flagged as an open product question, not re-solved here.
- **SYS-05 started:** built an inventory script (off-scale margin/padding/gap vs `--sp-*` scale) — 121 violations across 33 of 56 stylesheets. Fixed the 4 highest-impact files: `commissions` (20/20), home `page.module.css` (7/7), `blog/[slug]` (7/8), `shop/[handle]` PDP (6/6) — 56 total. Method: nearest-token snap, ties round down, skip negative/sub-4px `*-top` values (those are baseline corrections, not spacing violations). Build + screenshot-verified per file, no regressions.
- Installed Playwright's Chromium binary (`npx playwright install chromium`) — `scripts/screenshot.ts` existed but the browser wasn't downloaded, so it had never actually been run.

**SYS-05 finished (`401f1e9`):** remaining 65 declarations across 24 files fixed (same method). Mid-sweep found the original inventory regex missed single-line CSS rules (`.grid { ...; gap: 1.25rem; }`) — re-scanned the whole project with a corrected regex before calling it done; confirmed zero unintentional off-scale spacing remains. 11 declarations intentionally left as literals (baseline/optical corrections, hairline grid-border technique, one dead-code file) — documented in ISSUES.md SYS-05.

**Next:**
- SYS-10 follow-up: the unconfirmed image-loading observation (67/104 images not completing on local `next start`, requested at `w=3840`) — check against the live URL before treating as real.
- Open product question for Sebastian: `/fine-art` is still a ~74k px single-column scroll of 89 works — paginate, cap-per-category, or accept as a long archive?
- Gelato (Sebastian's templates): standardise all mockup backgrounds to one warm white; fix white-on-white products (tank top, water bottle); pick one flat-art presentation rule.
- Microcopy pass: unify CTA link texts (View all / See all / All products…).
- 11 untracked one-off scripts in `scripts/` from 2026-06-21 (dad-cap/canary/Gelato checks) — never committed, unclear if still needed, untouched this session.

---

## 2026-05-18

**Done:**
- Full shop-first redesign shipped to production (Playfair Display + Inter, vermillion accent, CSS design tokens)
- Cart system built: CartProvider, CartDrawer, AddToCartButton (requires SHOPIFY_STOREFRONT_TOKEN in Vercel to activate)
- Nav: cart count badge, drawer trigger, collections dropdown
- /shop/collections/[handle] pages with per-collection tag filtering (PRIMARY_TAG map fixes tufted-works→tufting etc.)
- getProductsByTag added to lib/shopify/products.ts
- app/not-found.tsx (branded 404) + public/robots.txt
- Gelato API fully explored: store ID confirmed (51ee1b39), template created (6005fae3), print-files endpoint discovered
- 6 Neko Paw products created in Gelato + Shopify via scripts/seed-gelato-neko.ts
- Artwork uploaded to Vercel Blob (gelato/neko/*.png)
- Print files attached to all 18 variants via scripts/patch-gelato-print-files.ts

**Decisions:**
- Gelato product creation = two-step: create-from-template first, then POST /variants/{id}/print-files separately (imagePlaceholders in the create payload is ignored by the API)
- Cart drawer uses Storefront API — needs separate SHOPIFY_STOREFRONT_TOKEN, not covered by Admin client credentials token. Reverted product page to AddToCartButton component but cart won't fully work until token is added to Vercel.
- Template approach confirmed correct but template must be rebuilt with a PORTRAIT placeholder image — current template was built with SHERO patch (landscape 8500×4981px) which causes artwork to render cropped/wrong in Gelato mockups

**Next:**
- BLOCKER: Sebastian must fix the Gelato template (Fine Art Poster, ID: 6005fae3) — edit design, resize image element to fill full portrait bleed area — then delete 6 Neko products and rerun scripts
- Add SHOPIFY_STOREFRONT_TOKEN to Vercel env vars (Shopify admin → Apps → Develop apps → Storefront API tab) to activate cart drawer
- Point dayindayin.dk DNS at Vercel (Simply.com)
- Once Gelato template is fixed: run same script pattern for Tourism series (horizontal variants) and SHERO patch

---

---

## 2026-06-24 — Activity burst (Owl)
34+ files touched in dayindayin-site since 2026-06-17. Top files: app/shop/page.tsx, components/SizeGuide.tsx, StickyATC.module.css, Nav.tsx, ProductOptions.tsx, RecentlyViewed.tsx, ShopFilterNav.tsx. 15+ scripts added (fix-art-print-variants.ts, fix-mug-variants.ts, fix-tank-top-variants.ts, add-framed-variants.ts, audit-product-types.ts, etc.). ISSUES.md and LOOP_LOG.md updated 2026-06-21. Last commit pushed 2026-06-21 19:54 UTC. No human log entry since 2026-05-18 — auto-summary by Owl.

---

## 2026-06-26 — Activity burst (Owl)
2 commits at 21:41–21:44 CEST: (1) "Add transparent background versions of all mask images" — 6 transparent-background mask PNGs added to DayInDayIn Images/masks/; (2) "Log full UX task list + session 5 image track in LOOP_LOG" — LOOP_LOG updated with session 5 UX task list and image track. This is the second work session since the June 24 Owl burst entry (which captured Session 4 and the 34+ files from June 17–21). No human log entry for June 26 — auto-summary by Owl.

## 2026-06-28 (evening) — Activity burst (Owl)
3 commits at 21:50–23:27 CEST: UX Batch 1 ("remove go-up arrow, trust ticker, Sommerby, duplicate image, nudge, artist strip, tax note"), Batch 2 ("card CTA redesign, podBanner collapse, postcard subtitle"), Batch 3 ("fine-art + commissions UX fixes, unblock build"). Top files: app/page.tsx, app/page.module.css, app/shop/[handle]/page.tsx, app/commissions/page.tsx, app/commissions/page.module.css, app/fine-art/page.tsx, app/fine-art/page.module.css, tsconfig.json, tsconfig.tsbuildinfo. Build unblocked: tsconfig.json updated to exclude playwright.config.ts/tests so Vercel type-check no longer fails on missing @playwright/test dep. No human log entry for June 28 evening work — auto-summary by Owl.
