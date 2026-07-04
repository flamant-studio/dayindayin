# DayInDayIn — Session Log

---

## 2026-07-04

**Done:** Two corrections to the 2026-07-03 background fix, both caught by Sebastian from real screenshots/direct questions, not by me:
1. First ship (`acee87a`) only whitened the product-photo box, not the actual page canvas, and took "don't border the cta" too literally (border stopped before it instead of wrapping it). Fixed in `f449cf4`: `/shop` + PDP `.page` background → real white; PLP border moved to wrap the whole `.card` including CTA.
2. Sebastian then asked directly, item by item, whether nav/canvas/cards were ALL white. Checked precisely with `getComputedStyle` — they weren't (nav + body still chalk). He confirmed: yes, roll every instance of chalk to white, site-wide, as step one of a full palette rework. **This reverses the 2026-07-03 decision note below** ("white-everywhere was explicitly NOT chosen") — that was the right call for a scoped bug fix, but he's since decided he wants the bigger change after all.
   - Shipped (`64e8803`): changed the `--c-bg` token itself (`#F0EBE3` → `#FFFFFF`) rather than hunting down every usage — it's the variable body/Nav/ShopFilterNav/CartDrawer/most sections already reference, so it cascaded automatically. Checked all 9 usages across the codebase first to make sure none were doing something unexpected (one was: Footer's `.trust` band needed to stay chalk per "leave the footer in current beige-brown" — froze it to the literal old hex).
   - Verified across 11 page types + live production this time, before and not after claiming done.

**Decisions:**
- Full palette rework is now explicitly in scope, Sebastian's words: "I want to rework the entire color palette." Chalk→white is step one. Footer's beige-brown (`--c-surface`) is next, deliberately deferred.
- Process lesson, stated plainly to Sebastian: when I flag an ambiguity to myself mid-task ("could mean X or the bigger Y") and pick the safer reading without asking, that's exactly the case where I should ask instead. Happened twice in two days on this same background-color question.

**Next:** the rest of the palette rework (footer, and whatever else "entire colour palette" ends up meaning) is still undefined — don't assume white is the final answer everywhere. Back to open GELATO_STRATEGY.md questions when this is settled.

---

## 2026-07-03

**Done:** Resolved FB-2a (PDP white background "feels alien") with a real site-side fix, after Sebastian pushed back on the Gelato production-pipeline discussion started 2026-07-01 (see GELATO_STRATEGY.md) and asked to actually test the site-design half of it.
- First attempt: recolor the letterbox gap around product photos from white to `--c-parchment`. **Wrong** — Gelato mockups already have a baked-in white background, so this created a visible parchment/white seam instead of removing the clash. Caught because Sebastian looked at it on real product types (a tote bag), not just the one framed print I'd checked. Reverted.
- Second attempt: rapid-fire CSS-injected comparisons (thin border, fat muted border, fat ink border, shadow-only) against a real running server, no source changes, across PLP + PDP + two product genres. Only a solid ink-coloured border read as intentional framing — doesn't depend on tonal matching with the photo, which is what broke attempt 1.
- Sebastian picked plain white + border over the more radical "whole page goes white" variant (correctly identified as a bigger brand decision, not this fix).
- Shipped (`acee87a`): 2px solid `var(--c-text)`. PDP main image border only (background already correct). PLP border wraps image+title+price, explicitly stops before the "View product" CTA row.
- Mid-fix caught a real process error: after reverting attempt 1's source with `git checkout`, I never rebuilt — the dev server kept serving the stale `.next` build with the discarded experiment baked in for several verification rounds. Rebuilt before final sign-off.
- Live-verified against production this time, not just localhost (learned that lesson on 2026-07-01 too).

**Decisions:**
- White-background-everywhere (the "v2" variant from testing) was explicitly NOT chosen — it would have dropped the site's warm chalk/parchment identity site-wide, which is a bigger call than fixing product-photo presentation.
- Border, not background-color matching, is the durable fix for "Gelato photo vs. site palette" mismatches going forward — it's robust to whatever the photo's own background is.

**Next:** back to the open GELATO_STRATEGY.md questions (automation vs. curation target, whether any of the current broken batch is live/orderable, what the paid Gelato tier unlocks).

---

## 2026-07-01

**Done:** Sebastian sent 9 screenshots of direct feedback (FB-1..FB-9 in ISSUES.md). Investigated each before touching code, then actioned:
- FB-5: commissions status badge was factually wrong ("accepting" when she isn't) — fixed copy + dropped the green "live" pulse styling.
- FB-4: Fine Art CTA was inconsistent ("See similar works" vs "Discover") depending on sold status — one CTA now.
- FB-9: footer area said "Gelato" 3x back to back — removed the redundant page-level strip on /shop, trimmed Footer's own duplicate (kept the one with the actual gelato.com link).
- FB-2b: PDP shipping trust line + accordion said the same thing twice — trimmed the accordion to only the non-redundant parts.
- FB-8: removed the series description banner text under shop filters (+ its now-dead code).
- FB-7: series taxonomy was wrong — checked live product titles first. "Faces" excluded all ~44 mask products entirely (only matched 8 "Face" titles); "Sommerby" was 4 variants of one painting, not a series; "Tourism" had 15 products with no filter. Fixed across all 4 places this list was duplicated (products.ts, shop/page.tsx, ShopFilterNav.tsx, homepage).
- FB-6: shop mobile filter nav ate too much vertical space — wired up a "Filter & Sort" toggle that existed as unused, unfinished CSS scaffolding.
- FB-3: Recently Viewed used a bespoke card instead of the shared ProductCard — swapped it in, narrowed ProductCard's prop type to just the fields it reads so lean localStorage data satisfies it.
- FB-1 (SHERO tote looks bigger) and FB-2a (PDP white background) investigated and confirmed as Gelato mockup-side issues, not site bugs — logged, not coded around.

**Decisions:**
- Won't rename the tag/URL key for the masks filter's underlying Shopify tag (`faces`) purely for display purposes elsewhere — only the site-facing label and the shop's own regex/label maps needed to change.
- Kept the Footer's linked "Printed by Gelato" over the unlinked trust-row version when deduping — assume the link is a real attribution requirement, not just decoration.

**Next:**
- FB-1: needs the SHERO tote mockup re-exported from Gelato at 2048×2048 (matches the other three) — Sebastian's side.
- FB-2a: open product question — standardise Gelato mockup backgrounds (already queued from 2026-06-29 design system work) rather than a site-code workaround.
- Everything else from before (P0/P1/P2 in ISSUES.md) still stands behind this batch.

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
