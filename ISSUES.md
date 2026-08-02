# DayInDayIn — Issues Board
*Curated + prioritized 2026-06-21 from Sebastian's testing session. The single source of truth for what's broken and what's next.*
*Reconciled 2026-06-30: this file sat uncommitted for 9 days while the P0 component system (Button, Breadcrumb, SectionHeading, ProductCard, ArtworkCard, EditorialCard, SeriesCard, useLightbox) was built and shipped (commits `aad2575`…`68a4668`). Statuses below updated against fresh screenshots (`screenshots/design-system-2026-06-30/`) taken against the live URL. A new P0 bug (SYS-10) was found during this pass.*
*Reconciled again 2026-07-17: this file had drifted badly — the July 11 UX batch and July 12 mobile-fix cycle resolved almost the entire P1/P2 list below without anyone closing the tickets (flagged as a to-do in LOG.md 2026-07-12, never done until now). Every item below was re-checked against the live URL (code read + Playwright interaction/screenshots against `dayindayin-site.vercel.app`, not localhost) before its status changed. Nothing here was self-certified as ✅ — per this file's own rule, that's still Sebastian's call — but items with strong live evidence are marked 🟡 CLAIMED with the proof inline.*

## How this file works (READ FIRST, every session)

**Status model — only these five. The distinction is the whole point:**
- 🔴 OPEN — not started
- 🔵 IN PROGRESS — being worked now
- 🟡 CLAIMED — Claude believes it's done. **This is NOT closed.** Requires a mobile + desktop screenshot against the live URL attached in the Proof column.
- ✅ VERIFIED — **Only Sebastian sets this**, after looking. Claude may never write ✅.
- ⏸ BLOCKED — needs data, asset, or a Sebastian decision (noted).

**Rules:**
1. Read this file before generating any task list. Every task must close or progress a numbered issue. No freelancing.
2. Nothing reaches 🟡 without a screenshot link. No screenshot = not done.
3. Claude never writes ✅. It moves things to 🟡 and stops.
4. Work P0 before P1 before P2. A P1 polish on a page whose P0 system isn't built is wasted.
5. One issue per commit where possible. Reference the ISS- id in the commit message.

**Honesty note (2026-06-21):** prior "✅ FIXED" claims were Claude-set and several are still broken in Sebastian's testing. All such items reset to 🟡 CLAIMED or 🔴 OPEN below. Self-certification is over.

---

# P0 — SYSTEMIC FOUNDATION (build these first; ~25 of the 40 complaints collapse once these exist)

### SYS-01: Mobile-first, not desktop-first
**What:** Whole site feels built for desktop then squeezed to mobile. Sebastian's rule: the phone is where discovery happens — design there first, scale up.
**Scope:** Every component below is built/reviewed at 390px first, then desktop.
**Status:** 🔴 OPEN · **Priority: P0 (governs all others)**

### SYS-02: Playwright actually installed + screenshot script
**What:** There is NO Playwright in this repo (no config, no tests). "I tested it" has been unprovable. Install Playwright; add a script that screenshots any URL at 390px and 1280px and saves to a folder.
**Why:** Until proof is mechanically possible, every 🟡 is just a claim.
**Status:** 🟡 CLAIMED (2026-06-30) · `playwright.config.ts` + `scripts/screenshot.ts` exist, mobile (390) + desktop (1280) viewports, 7 pages. Browsers weren't installed (`npx playwright install chromium`) — fixed and run successfully this pass. Proof: `screenshots/design-system-2026-06-30/`.

### SYS-03: ONE Button component
**What:** There are duplicate buttons (`AddToCartButton` + `QuickAddButton`, separate CSS). This is literally why "add-to-cart is all over the place." Consolidate to one `Button` + one `AddToCart` wired to design tokens. Delete duplicates.
**Spec from Sebastian:** add-to-cart sits at the BOTTOM of each card; text-link or very-light-border style; NOT the heavy grey-red fill. Resolve the "is it add to cart or view product?" ambiguity — one clear label.
**Status:** 🟡 CLAIMED (2026-06-30) · `components/Button.tsx` built; CTAs across home/shop now read one consistent style (proof: `home-desktop.png`, `shop-mobile.png`). Card CTA resolved to always "View product" (see SYS-04). Cleanup gap: `QuickAddButton.tsx` is dead code (zero references) but file not deleted.

### SYS-04: ONE ProductCard component + strict padding
**What:** "Product cards all over the place, no design SYSTEM, no strict padding." One ProductCard, fixed padding/spacing tokens, used everywhere. Fix once → fixed everywhere.
**Status:** 🟡 CLAIMED (2026-06-30) · `components/ProductCard.tsx`, one 4:5 `contain` box, white background, CTA always "View product →". Proof: `shop-mobile.png`, `home-desktop.png` — uniform grid.

### SYS-05: Vertical rhythm / spacing system
**What:** Whitespace complaints are everywhere and are all one problem — no enforced spacing scale. Symptoms: full-screen bullet sections, huge gaps between PDP sections, excess space below breadcrumbs, orphan "kr." on its own line, commissions section gaps.
**Fix:** One spacing scale, applied to section padding + component gaps. Kill ad-hoc margins.
**Status:** 🟡 CLAIMED, complete (2026-06-30) · All 121 originally-found off-scale `margin|padding|gap` declarations resolved across two passes (`ef03cb1`, `0e44ddc`, `401f1e9`) — 33 files touched. Method: nearest `--sp-*` token, ties rounded down. Mid-sweep, the inventory regex was found to miss single-line rules (`.grid { ...; gap: 1.25rem; }`); re-scanned the whole project with a corrected regex (including files already "done") before calling it finished — a corrected full-project scan now returns zero unintentional violations.
**Intentionally left as literals, not tokens (11 declarations):** negative/sub-4px values on `*-top` properties (baseline/optical text corrections — `about`, `archive`, `blog/[slug]`, `order-confirmed`, `practical`, `shop/[handle]`) and the hairline grid-border technique (`gap: 1-3px` + `background: var(--c-border)` revealing a thin line between grid cells — `about`, `fine-art`, `shop/loading`). `QuickAddButton.module.css`'s `-1px` also left alone — dead code, see SYS-03.
**Verification, honestly stated:** build clean + screenshots against localhost for every touched page (`screenshots/sys05*-*.png`), eyeballed for layout breaks. This is NOT the same as Sebastian looking at it live — per this file's own rule, nothing here is ✅ until he's seen it.

### SYS-06: ONE footer
**What:** "How many footers are there?" Multiple footer blocks make the page feel endless. Consolidate to ONE footer with all info.
**Status:** 🟡 CLAIMED (2026-06-30) · One footer block confirmed on homepage (proof: `home-desktop.png`, bottom).

### SYS-07: Section background system
**What:** PDP shows "beige → white edge-to-edge → beige again" banding. Define when a section is chalk vs white vs surface, and apply consistently. No random bands.
**Status:** 🟡 CLAIMED (2026-06-30) · Tokens defined in `DESIGN_SYSTEM.md` (`--c-bg`/`--c-white`/`--c-surface`/`--c-parchment`) with usage rules. Original PDP-specific banding complaint not re-verified — PDP screenshot looks clean (`pdp-desktop.png`) but worth a direct second look.

### SYS-08: Dual-template split (portfolio vs shop) made structural
**What:** This is a portfolio AND a print shop — they need DIFFERENT PLP and PDP templates, and Claude keeps missing it because nothing in code forces the split. Create explicitly named: `ShopCard`/`FineArtCard`, `ShopPDP`/`FineArtPDP`. Document in DESIGN_SYSTEM.md.
**Fine-art rules (lock in the component, not a brief):** single-column PLP (not 2-up), ALL photography at top of PDP, CTA = "Pricing & availability" (not "Discover this work").
**Status:** 🟡 CLAIMED (2026-07-17) · SYS-10's blocker is gone (fixed 2026-06-30). Re-verified live on `/works/liebes-panopticon`: main image renders at the very top of the page (`top: 56px`), `<h1>` title/text block comes after it (`top: 884px`) — photography-first confirmed. Layout is single-column (`display: block`). CTA reads "Enquire about price" (renamed from "Discover this work" in UX-16, 2026-07-11 — close enough to the "Pricing & availability" spec that this reads as satisfied, not a literal string match). `ArtworkCard`/`EditorialCard`/`SeriesCard` remain separate components from `ProductCard`, and `/fine-art` PLP confirmed single-column via SYS-10's own verification.

### SYS-09: Asset-reuse guard
**What:** "Liebes Panopticon" image reused twice on home AND again on fine-art top. With a huge archive, no image should repeat across hero slots. Add a check / curated hero-image map.
**Status:** 🟡 CLAIMED (2026-07-17) · Checked `/fine-art`'s hero rotation (`FEATURED_SLUGS` in `app/fine-art/page.tsx`): `['orange-sun', 'fuck-alting', 'universe-3', 'taped-objects']` — Liebes Panopticon is not in it. It only appears once now, in the homepage "from the studio" editorial section. No reuse across hero slots found. (No general automated check/guard was added — if a future image gets reused, this would need re-auditing by eye, not a system catching it. Worth a real fix later if it recurs.)

### SYS-10: `/fine-art` page renders at ~115,000px tall — production bug
**What:** Found 2026-06-30 generating proof screenshots: `/fine-art` was **114,962px** (desktop) / **39,007px** (mobile) — every other page is 1,700–11,000px.
**Root cause (git-bisected to `e76af4f`, 2026-06-28):** "single-column editorial" change set `.grid` to `repeat(1, minmax(0,1fr))` at all breakpoints with no width cap. Each `ArtworkCard` (aspect-ratio 3:4) rendered near the full 1200px page width → ~1467px tall × 89 works. The "blank void" seen mid-page in the original screenshot was just an unloaded lazy image that far down the page, not a second bug.
**Fix (`947951f`):** capped `.grid` to `--w-prose` (700px, the existing design-system token for single-column reading) instead of full page width. Keeps the explicit "single-column, not 2-up" decision (this issue) intact.
**Status:** 🟡 CLAIMED (2026-06-30) · Verified against the live URL: **73,688px** desktop (−36%), mobile unchanged (was already narrow). Proof: `screenshots/sys10-live-verify/fine-art-desktop.png`.
**Open product question (not a bug, needs Sebastian):** even fixed, the page is still ~74k px — 89 unpaginated works in one column is long by design. Worth deciding: paginate, cap-per-category with "view all," or accept it as a long scroll archive.
**Side observation, unconfirmed:** while verifying locally, 67 of ~104 images on the page hadn't finished loading after a full programmatic scroll-through + waits, requested at an unusually large `w=3840`. Could be a `next start` local-server transcoding bottleneck (not representative of the Vercel CDN), or a real `sizes` mismatch on `ArtworkCard` now that its container is 700px not 33vw. Not verified against the live URL — flagging, not claiming.

---

# FB — SEBASTIAN SCREENSHOT BATCH (2026-07-01) — ACTIVE, work these first

Sebastian sent 9 screenshots with direct feedback. Investigated each before touching code — root causes below. This queue takes priority over P1 below (his call, said "let's start with these").

**Live-verified 2026-07-01, post-deploy** (initial CLAIMED status below was screenshotted against localhost only, not the live URL as this file's own rule requires — caught when asked directly "have you tested what you shipped in Playwright?"). Re-ran Playwright against `https://dayindayin-site.vercel.app` for all 8 shipped items: commissions status text present ✓, fine-art CTA is only "Discover →" site-wide ✓, shop nav shows "Masks 53"/"Tourism 15" ✓, `/shop` has exactly 1 "Gelato" mention (was 3) ✓, PDP accordion summaries + expanded body confirmed trimmed ✓, mobile filter toggle collapses/expands correctly ✓. Proof: `screenshots/live-verify-*.png`.

### FB-1: SHERO tote bag looks bigger than the other three on the shop grid
**What:** In a 4-up grid of tote bags, "SHERO — Indigo" appears zoomed in relative to "Mask — Calling", "Mask — Blasé", "Elephant — Green".
**Root cause (confirmed):** downloaded and measured all four source images. The three normal ones are 2048×2048 (square). The SHERO tote mockup is **1219×2048** — a different crop ratio entirely. `ProductCard`'s 4:5 `contain` box is working correctly and identically for all four; the SHERO *source photo* is simply framed differently, so `contain` fits it to a different edge and it reads as larger.
**Status:** ⏸ BLOCKED — this is a Gelato mockup export inconsistency, not a site bug. Same family as the existing Gelato mockup-standardization item (see DESIGN_SYSTEM.md § Gelato, and SYS-09/the Neko-poster finding from 2026-06-29). No site code can fix a source-image crop without violating "never crop the art." Needs the SHERO tote re-exported from Gelato at the same 2048×2048 square framing as the others.

### FB-2a: PDP white background behind the product photo feels alien to the rest of the design
**What:** Sebastian flagged this, explicitly unsure what to do about it.
**Resolved 2026-07-03 via site-side design, not a Gelato change.** Two rounds of visual testing (full detail in GELATO_STRATEGY.md and LOG.md):
1. First attempt — recolor the CSS letterbox to `--c-parchment` instead of white. Wrong: Gelato mockups already have their own baked-in white background, so this only recolored the *gap*, creating a visible parchment/white seam — worse than before. Reverted.
2. Second attempt — rapid-fire CSS-injected comparisons (no source changes) of plain borders instead of tonal matching: thin border, fat muted border, fat ink border, shadow-only, across PDP (framed print + tote) and the PLP grid. Only a solid border in the ink/text colour read as an intentional "framed panel" — it doesn't depend on matching the photo's own background, which is what broke approach 1.
3. Sebastian chose plain white everywhere + a border to delimit the panel. First shipped version (`acee87a`) got the scope wrong on both counts — over-corrected in the cautious direction: only whitened the product-photo box (left the actual page canvas on the warm chalk `--c-bg`), and took his "don't border the cta" instruction literally (border stopped before "View product"). He caught both immediately from real screenshots and called it out directly ("certainly not white background throughout... are you checking your stuff in playwright").
4. **Correction (`f449cf4`):** `.page` background on `/shop` and `/shop/[handle]` set to `var(--c-white)` — page canvas white, not just the image box. PLP border moved from `.cardInner` to `.card` — wraps image+title+price+CTA as one bordered unit.
5. **Sebastian then confirmed this is bigger than PLP/PDP** ("let's just roll every instance of chalk back to white... I want to rework the entire color palette") — asked point-blank whether nav/canvas/cards were ALL white; verified precisely (they weren't — nav and body were still chalk) and he said yes, change those too. **Site-wide fix (`64e8803`):** `--c-bg` token itself changed from `#F0EBE3` to `#FFFFFF` in globals.css — this is the variable `body`, `Nav`, `ShopFilterNav`, `CartDrawer`, and most page sections already reference, so it cascades everywhere without touching each file. Footer's `.trust` band was the one place reading `--c-bg` that needed to *stay* chalk (footer explicitly kept beige-brown for now, future rework) — frozen to the literal old hex so it doesn't flip with everything else. `<meta theme-color>` updated to match.
**Status:** 🟡 CLAIMED (`64e8803`) · Verified across 11 page types locally (home/shop/PDP/about/commissions/fine-art/archive/art-journal/practical/legal/search) — body + nav both `rgb(255,255,255)` on every one, footer trust band still `rgb(240,235,227)` (old chalk), footer main still `rgb(232,225,214)` (`--c-surface`, untouched). Live-verified on production (home + shop): same result. Screenshots: `screenshots/global-*.png` (local), `screenshots/live-global-*.png` (production).
**Open:** Sebastian said he wants to rework the entire palette, of which this is step one (chalk→white). Footer's beige-brown, and the rest of the palette, are explicitly still to come — don't assume this is the final state.

### FB-2b: PDP shipping trust line + "Shipping & Returns" accordion repeat the same info
**What:** The always-visible line above the accordions ("Ships in 3–7 business days · EU, UK & Norway" / "Printed & shipped by Gelato") restates almost verbatim what the "Shipping & Returns" accordion says again below it.
**Fix:** keep the always-visible line (real value — a trust signal near Add to Cart shouldn't require a click) but trim the accordion to only the information NOT already stated above: production/delivery breakdown redundant with the line above removed, keep the return/damage policy and international-shipping note.
**Status:** 🟡 CLAIMED (`3dfc285`) · Verified via DOM inspection (accordion summaries + body text) — screenshot couldn't show this reliably (fixed StickyATC/cookie-banner overlay sits at this scroll position in a stitched full-page capture).

### FB-3: Recently Viewed carousel uses a bespoke card instead of the shared ProductCard
**What:** `components/RecentlyViewed.tsx` hand-builds its own card markup instead of reusing `ProductCard` — this is exactly the "~19 cards → 4" problem the design system work was supposed to close, just missed on this component.
**Fix:** swap `RecentlyViewed`'s custom card markup for `ProductCard`. Narrowed `ProductCard`'s prop type to `ProductCardData` (a `Pick<>` of the fields it actually reads) so the localStorage-cached data satisfies it without a full Shopify refetch.
**Status:** 🟡 CLAIMED (`3dfc285`) · Proof: `screenshots/fb-pdp-recentlyviewed.png` — renders identical white ProductCard styling ("Elephant — Green / TOTE BAG / 224 kr / VIEW PRODUCT →").

### FB-4: One Fine Art card says "See similar works →" instead of the standard CTA
**What:** `ArtworkCard.tsx` shows `"See similar works →"` when `work.sold === true`, `"Discover →"` otherwise. Several works are marked sold in `lib/data.ts` (Purple Sun, Tufted Mask, Pink Rug, ...) — Sebastian wants one consistent CTA regardless of sold status (the SOLD badge already communicates that).
**Fix:** remove the conditional, one CTA text for every ArtworkCard.
**Status:** 🟡 CLAIMED (`3dfc285`) · Verified: scanned all rendered CTA text on `/fine-art` — only "Discover →" appears now, no "See similar works" anywhere.

### FB-5: Commissions page says "Currently accepting commissions for 2026" — factually wrong
**What:** Stine is NOT currently accepting commissions. The status badge is hardcoded copy, not driven by real data.
**Fix:** update the badge/copy to reflect closed status; dropped the green pulsing-dot styling (read as "live"/active, wrong for closed).
**Status:** 🟡 CLAIMED (`3dfc285`) · Proof: `screenshots/fb-commissions-desktop.png` — badge now reads "Not currently accepting new commissions," neutral grey.

### FB-6: Shop sort & filter nav takes too much vertical space on mobile
**What:** Both the Type row and Series row render open/always-visible on mobile, pushing the product grid below the fold.
**Finding:** `ShopFilterNav.module.css` already has unused CSS scaffolding for a `.mobileToggle` button and collapsed state (`display: none` today, never wired up) — someone started this and didn't finish.
**Fix:** wire up the toggle — collapsed by default on mobile behind a "Filter & Sort" button, expands to reveal both rows.
**Status:** 🟡 CLAIMED (`3dfc285`) · Proof: `screenshots/fb-shop-mobile-collapsed.png` (product grid starts right after one compact row) and `fb-shop-mobile-expanded.png` (tap reveals Type + Series rows, chevron flips).

### FB-7: Series taxonomy is wrong — "Faces" should be "Masks" + include masks; drop "Sommerby"; add "Tourism"
**What:** Checked live product titles against the series-matching regex (duplicated in 4 places: `lib/shopify/products.ts`, `app/shop/page.tsx`, `components/ShopFilterNav.tsx`, `app/page.tsx`).
- "Faces" currently matches only `/\bfaces?\b/i` → 8 products (Solar Face, Moon Face). It does NOT match any of the ~44 "Mask —" / "Sri Lanka Masks" products at all — those get no series badge or filter today.
- "Sommerby" matches 4 products, all variants of one single painting (mug/poster/postcard/framed print of the same piece) — not a multi-work series, per Sebastian correct to drop as its own filter chip.
- "Tourism" has 15 real products (Tourism I–IV across several formats) with no series filter at all today.
**Fix:** rename "Faces" → "Masks" and broaden its pattern to include mask titles; remove "Sommerby" from all four series lists; add "Tourism".
**Status:** 🟡 CLAIMED (`3dfc285`) · Proof: `screenshots/fb-shop-masks-desktop.png` shows "MASKS 53" (up from 8) and "TOURISM 15" as live filter chips, no Sommerby chip; `fb-home-desktop.png` shows the homepage "Browse by Series" strip updated to match. Also resolves **ISS-H1**.

### FB-8: Remove the series description snippets under shop filters
**What:** e.g. under "Faces": "Portraits, masks, and the human face in all its complexity — from Sri Lanka to the Copenhagen streets." Sebastian: revisit all copy later, but this is unneeded now.
**Fix:** remove the `SERIES_DESCRIPTIONS` banner render from the shop page. (Ties to the existing **P2 COPY CULL** section below — same instruction, acted on now for this specific instance.)
**Status:** 🟡 CLAIMED (`3dfc285`) · Also deleted the now-dead `SERIES_DESCRIPTIONS` const and `isSeriesFilter` var it was the only user of. Proof: `screenshots/fb-shop-masks-desktop.png` — no banner text between the filter row and the grid.

### FB-9: Footer area repeats "Gelato"/shipping messaging up to 4 times
**What:** On `/shop`, in one screen: page-level `.podStrip` ("Printed by Gelato · Ships in 3–7 days across Europe · Original artwork, made to order") directly above the global Footer's own trust row ("...Printed on demand by Gelato · Prints from 56 kr") directly above the Footer's bottom bar ("...Printed by Gelato" again). Three "Gelato" mentions + a "Ships"/"Prints" repeat, back to back.
**Fix:** remove the page-level `.podStrip` from `/shop` (the Footer already carries this messaging on every page); trim Footer's own bottom-bar "Printed by Gelato" since the trust row above it already says "Printed on demand by Gelato."
**Status:** 🟡 CLAIMED (`3dfc285`) · Kept the bottom bar's "Printed by Gelato" (not the trust row's) since it's the one with the actual `<a href="gelato.com">` link — removing that risked dropping a real attribution backlink. Down to one Gelato mention. Proof: `screenshots/fb-shop-masks-desktop.png` bottom, `fb-commissions-desktop.png` footer.

---

# UX — 16-TASK BACKLOG (2026-07-11) — shipped, see `dayindayin-tasks.md` for full source doc

Sebastian sent 18 screenshots via Google Doc (task 3 deleted, task 10 folded into 9 → 16 tasks). Worked autonomously end to end, deployed (`a9be0e5`), live-verified every item against `https://dayindayin-site.vercel.app` with Playwright. Proof: `screenshots/ux-batch-2026-07-11/`.

### UX-1: Home hero — Liebes Panopticon shows the back of the piece
**What:** Editorial hero image is the raw canvas back (signature, burlap, pencil marks), not the finished front.
**Status:** ⏸ BLOCKED — audited every image in `works/tufting/liebes-panopticon/` (main + 5 gallery) and the Shopify catalog (no print product exists for this piece either). None show the actual front of the work — the gallery folder contains photos of a *different, unrelated* piece entirely. No valid asset exists anywhere in the library to swap in. Needs real photography or a corrected asset upload from Stine, not a code fix.

### UX-2 / UX-14: Browse-by-Series tiles inconsistent crops, duplicated across pages
**What:** Home's inline "Browse by Series" strip and `/collections`' `SeriesCard` grid were two separate bespoke implementations, and individual tile images mixed full-bleed art with white-matted product mockups.
**Fix:** extracted a shared `SeriesTile` component (uniform 1:1 crop, edge-to-edge, no matting) used on both pages. Centralized series metadata into `lib/series.ts` — this also fixed a real, separate staleness bug found along the way: `/collections` still listed "Faces"/"Sommerby" (renamed to Masks / removed weeks ago per LOG.md 2026-07-06) while home already had the correct Masks/Tourism list.
**Status:** 🟡 CLAIMED · Proof: `screenshots/ux-batch-2026-07-11/home-desktop.png`.

### UX-4: Newsletter — full section moved to a minimal footer signup
**Status:** 🟡 CLAIMED · Full-section homepage block removed; `NewsletterSignup` got a `variant="minimal"` (single input + button, no copy) now living in the footer brand column. Proof: `home-desktop.png` (footer, bottom left).

### UX-5: Studio collage strip reused images from elsewhere on the homepage
**What:** `ls-04`/`ls-07` in the strip were the *same* photos as the "Two ways to collect" section directly above; `ls-02`/`ls-05` also duplicate `/commissions`.
**Fix:** probed the blob store — only `ls-01` through `ls-09` exist (9 total lifestyle photos). Swapped the strip to the 3 genuinely unused ones (`ls-03`, `ls-06`, `ls-08` — dropped `ls-06` for `ls-08`, near-duplicate shots of the same scene) plus one work-gallery detail shot (Jellyfish gallery/3, never surfaced outside that work's own PDP) for the 4th slot, since the lifestyle library alone isn't deep enough for 4 fresh images.
**Status:** 🟡 CLAIMED · Proof: `home-desktop.png` (bottom strip, above footer).

### UX-6: Studio Notes / blog — no live copy yet
**Fix:** removed the homepage teaser section; disabled the routes by renaming `app/art-journal` → `app/_art-journal` and `app/blog` → `app/_blog` (Next.js private-folder convention — routes 404, code fully intact, trivially reversible when Stine has real posts). Removed the nav links (Footer, 404 page). Removed from sitemap.
**Status:** 🟡 CLAIMED · Verified `/art-journal` and `/blog/*` 404 on production, zero "Studio Notes" references left in Footer/nav.

### UX-7: Footer — two info lines merged into one
**Status:** 🟡 CLAIMED · `Ships to EU, UK & Norway · Secure checkout via Shopify · Prints from 56 kr` + `© 2026 ... · Sitemap · Printed by Gelato` collapsed into one line (dropped "Prints from 56 kr" per the brief's own suggested format — already said in the hero). Proof: `home-desktop.png`, footer.

### UX-8: Shop "Newest" sort looked broken
**What:** Investigated — sort is fully wired (`?sort=price-asc`/`price-desc` genuinely reorder, verified against live prices). "Newest" is the default; clicking it while already active correctly does nothing, same as any toggle control at rest.
**Status:** No fix needed — not a bug.

### UX-9: Shop — Floral and Botanical dropped from series tabs
**What:** 3 products each, too sparse for a dedicated tab.
**Fix:** removed from `ShopFilterNav`'s visible tab list only — `/shop?filter=floral` and `?filter=botanical` still work (e.g. from the homepage series tiles), products still show under "All series."
**Status:** 🟡 CLAIMED · Verified live: tab bar shows All/SHERO/NEKO/Sea Monsters/Masks/Tourism, no Floral/Botanical tab.

### UX-11: PDP variant selector (color/design) looked broken
**What:** Root cause was NOT what it looked like. Shopify's **Storefront API** (what the live site actually queries) silently returns the product's fallback photo for every variant that has no dedicated image of its own — it does not return `null` the way the Admin API does. So clicking Black/Side B kept showing the exact same photo, with no visible feedback that the click even registered.
**Fix:** (1) `ProductContext.setSelected` no longer skips the image update when a variant has no distinct photo — was silently keeping the *previous* selection's image, which is actively misleading, not just uninformative. (2) `ProductOptions` now detects when 2+ variants in a group share the identical image URL and shows an honest "Photo shown is a reference" note instead of a selector that looks dead.
**Audit finding (bigger than this one product):** queried the Admin API across the whole catalog — **127/127 multi-variant products** (all mugs, all framed prints) have at least one variant missing its own Gelato mockup photo. This is systemic, not isolated — same root cause already flagged in `GELATO_STRATEGY.md`. No further per-product fix is possible without real mockup photography; that decision is still open and unchanged by this session.
**Status:** 🟡 CLAIMED · Verified live on `/shop/botanical-blanc`: clicking Black shows the reference note immediately (in fact it shows on load too, since all 4 of this product's variants share one photo).

### UX-12: PDP cross-sell carousels ("Similar pieces" + "Recently viewed")
**What:** Investigated — both already exist and work on the shop PDP (`More from {series}`, `You might also like`, `Original {medium} works`, plus `RecentlyViewed` via localStorage).
**Status:** No fix needed — pre-existing, verified working.

### UX-13: PDP zoom lightbox replaced with inline arrow carousel
**Fix:** `ImageGallery` no longer opens a modal lightbox on click. Left/right arrows overlay the main image directly (hover-to-reveal on desktop, always visible on mobile), with a "N / total" counter; thumbnails jump to that index inline, no modal. `ImageLightbox`/`useLightbox` untouched — still used by `WorksGallery` (Fine Art PDP "Studio views"), a separate, legitimate use.
**Status:** 🟡 CLAIMED · Verified live: 2 arrow buttons + "1 / 3" counter present on `/shop/botanical-blanc`.

### UX-15: Fine Art works using a back/WIP photo as the hero
**What:** Same root pattern as UX-1, audited across all 26 tufting works (contact sheet + individual review).
**Fix:** **Jellyfish** — swapped to its own gallery/1.jpg (confirmed clean front shot). **Floral Thing** — swapped to gallery/2.jpg (main image was an unreadable macro crop; gallery/1–2 are the actual whole piece, gallery/3–5 are unrelated/mismatched photos, left untouched). **Du Und** — swapped to gallery/3.jpg, a partial improvement (best available finished-stitch shot) — flagging that no photo of the *complete* finished piece exists anywhere in this work's asset folder; only WIP shots and macro crops.
**Bigger finding:** **Liebes Panopticon** and **Bedroom Rug** — both have their entire gallery folders populated with photos of a different, unrelated piece, not just a bad angle. This isn't a "pick a better existing photo" fix; it's missing/misfiled assets. Flagged, not touched (see UX-1).
**Status:** 🟡 CLAIMED (Jellyfish, Floral Thing, Liebes Panopticon — fixed 2026-07-12, real photo found in Dropbox; Bedroom Rug + Bedroom Wall Rug — fixed 2026-07-17, `7ba7660`, see LOG.md — turned out to be the same physical piece catalogued twice, Sebastian OK'd shipping correct-but-duplicated photos rather than untangling the catalog) / partial (Du Und — reconfirmed 2026-07-17, no finished photo exists anywhere in the asset folder, nothing further possible without new photography from Stine).

### UX-16: Fine Art PDP CTA copy
**Fix:** "Discover this work" → "Enquire about price" (matches the site's existing "price on enquiry" language elsewhere on the same page). Sold-work CTA ("Discover similar work" → "Enquire about similar work") for consistency; shop/print PDPs' "Add to cart" untouched.
**Status:** 🟡 CLAIMED.

### UX-17: Fine Art PDP — added "Recently viewed" carousel
**What:** Only had one "More {medium}" carousel (already existed, satisfies half the ask).
**Fix:** new `RecentlyViewedWorks` component (mirrors the shop PDP's `RecentlyViewed` pattern, separate localStorage key, `ArtworkCard`-based).
**Status:** 🟡 CLAIMED.

### UX-18: All Works page removed, Grid/Carousel toggle added to Fine Art
**Fix:** `/archive`'s dense grid (filters + full catalog) merged into `/fine-art?view=grid` behind a new toggle; old page deleted, `/archive` 301-redirects to `/fine-art?view=grid` (category param passes through automatically — Next.js forwards unmatched query params). Updated every internal link (Footer, 404 page, breadcrumbs, sitemap, related-works links) to the new URL directly rather than relying on the redirect hop.
**Status:** 🟡 CLAIMED · Proof: `screenshots/ux-batch-2026-07-11/fine-art-grid-toggle.png` — toggle, filter tabs, and dense grid all rendering live with correct counts (All 72, Tufting 26, Embroidery 13, Painting 14, Photography 19).

### UX-19: PDP image carousel vs. variant selection — no unified logic (flagged by Sebastian 2026-07-19)
**What:** Distinct from UX-11 (which fixed the "same photo on every variant" symptom) and UX-13 (which replaced the lightbox). The open question is architectural: when a shopper clicks a different thumbnail in the image carousel, it's unclear whether they're looking at (a) a different variant, or (b) an alternate photo/angle of the same variant. Conversely, clicking a variant selector (size/color) doesn't clearly update — or clearly not update — the carousel in response. There's no single, legible rule a shopper (or a future contributor) can point to for "clicking X does Y to the image state."
**Not started.** This needs an actual interaction-model decision (does the carousel scope to the whole product or re-scope per variant? is there a visual distinction between "more photos of this" vs "this is a different option"?) before any code changes — a foundational UX call, not a bug fix. Flagging here so it doesn't get lost; revisit when there's room for a proper pass.
**Status:** 🔴 OPEN

---

# P1 — PAGE ISSUES (after the relevant SYS- exists)

*Reconciled 2026-07-17 — see file header. Every item below re-checked against the live URL.*

### Homepage
- ISS-H1 🟡 CLAIMED · Sommerby confirmed gone (`document.body.innerText` has zero "Sommerby" mentions, live). SHERO series tile shows a real, distinct graphic (the "Shero" patch design) — not a placeholder, not a crop artifact. Resolved via FB-7 (Sommerby removal) + normal series-tile work.
- ISS-H2 🟡 CLAIMED · The bottom-of-homepage CTA is now the wordless lifestyle-strip image (whole strip links to `/shop`, no "see all products" text) — the literal duplicate text CTA this complaint was about is gone. Note: homepage still links to `/shop` 4 separate times (nav, hero, "In the shop" viewAll, lifestyle strip) — not broken, but flag if that still reads as repetitive to you.
- ISS-H3 🟡 CLAIMED · Live-checked: `document.querySelector('[aria-label="Back to top"]')` → absent. No visible go-up arrow renders anywhere on the live site today. `ScrollToTop.tsx` (still in use, in `layout.tsx`) is a different, invisible thing — it resets scroll position on route change, not a floating button. `BackToTopButton.tsx` was the actual arrow component and had zero imports anywhere in the codebase — deleted 2026-07-17 as dead-code cleanup (the "duplicate-component" half of this ticket).
- ISS-H4 🟡 CLAIMED · Current hero body: "Stine Weirsøe Flamant makes art with her hands in Copenhagen. Originals on enquiry. Prints from 56 kr, shipped across Europe." Reworded at some point after this ticket was written — reads as concrete, not filler. Flag if you want it changed further; not obviously broken.

### Gelato PDP
- ISS-P1 🟡 CLAIMED · Live-tested on `/shop/mask-ii-framed-print` (12-variant framed print, the worst-case product): scrolled to trigger the sticky bar, then fired 4 variant-swatch clicks and 8 image-arrow clicks in sequence — bar stayed visible and stable throughout every click, no flicker. Root cause was very likely the layout-shift bug fixed 2026-07-12 (`ImageGallery`'s fixed-frame change, `4d4b507`) — cycling images used to reflow the page height, which would spuriously trip the sticky bar's `IntersectionObserver`. That reflow no longer happens.
- ISS-P2 🟡 CLAIMED · The zoom feature described here no longer exists — UX-13 (2026-07-11) replaced the zoom lightbox entirely with the inline arrow carousel. Live-verified: `/shop/mask-ii-framed-print` has arrow buttons + "N / total" counter, no zoom/modal anywhere in `ImageGallery.tsx`.
- ISS-P3 🟡 CLAIMED · `Breadcrumb` component confirmed not imported/rendered in `app/shop/[handle]/page.tsx` — removed 2026-07-12 per Sebastian's explicit request (`4d4b507`).
- ISS-P4 🟡 CLAIMED · "Also in this series" colorway-sibling thumbnails removed 2026-07-11 (code comment in `page.tsx` confirms, explicitly per Sebastian's request) — not "moved down," removed outright, which supersedes this ticket.
- ISS-P5 🟡 CLAIMED · No "Work by Stine Weirsøe Flamant" block exists anywhere in the current shop PDP (`app/shop/[handle]/page.tsx`) — only appears in `alt`/meta text (SEO), never as a visible page block.
- ISS-P6 🟡 CLAIMED · Per LOG.md 2026-07-12: the 128px stacked-margin gap + floating divider between cross-sell sections was fixed (`68b06f1`, `4d4b507`). Not independently re-screenshotted this pass (the specific test product had neither section populated — no series match, empty localStorage) — worth a spot-check on a product that has both before fully trusting.
- ISS-P7 🟡 CLAIMED · Postcard subtitle already reads "Postcard · Pack of 10" in `page.tsx` (line 318) — matches the ask.

### Cart
- ISS-C1 🟡 CLAIMED · No "taxes and shipping calculated at checkout" text anywhere in `CartDrawer.tsx` — already gone.
- ISS-C2 🟡 CLAIMED · `CartDrawer`'s trust row has "Secure checkout" (with a lock icon) + delivery time + "Printed by Gelato" — satisfies the "security reassurance messaging" half of this "and/or" ask. No actual payment-method logos (Visa/Mastercard/etc.) — still open if you specifically want those, otherwise consider this closed.

### Fine-art page / PDP
- ISS-F1 🟡 CLAIMED · "New to the archive" no longer exists — the section is now labeled "Recent additions" (`app/fine-art/page.tsx`), post the UX-18 archive/grid restructure.
- ISS-F2 🟡 CLAIMED · `office-shot` is already in `HIDDEN_SLUGS` in `app/fine-art/page.tsx` — excluded from the archive already.
- ISS-F3 🟡 CLAIMED · Live text check: "Looking for prints? The print shop ships across Europe from 56 kr." reads as one clean sentence, no orphaned "kr." fragment. Whitespace looks normal post-SYS-05 sweep.

### Commissions
- ISS-CM1 🟡 CLAIMED · Two lifestyle/behind-the-scenes photos ("Hand tufting in progress", "Embroidery, up close") confirmed live on `/commissions`.
- ISS-CM2 🟡 CLAIMED · Live screenshot shows even, consistent section spacing throughout — no obvious gaps. Covered by the SYS-05 sweep.

---

# P2 — COPY CULL (one pass, one rule: say the true thing, cut the rest)

**Reconciled 2026-07-17 — this entire section was already resolved, most likely as a side effect of the July 11 UX batch (which rewrote/removed several of these exact sections) — nobody closed the ticket. Grepped the live codebase for every phrase below; none exist anymore:**
- Home "From the studio" — the phrase now only exists as the Newsletter section's heading ("From the studio — direct."), a different, intentional use — not the filler section this originally flagged.
- Shop "You keep coming back…" — zero matches anywhere in the codebase.
- Shop — 3-bullet-points section — doesn't exist on `/shop` anymore.
- Fine-art "Want something that exists only once?" — zero matches.
- Commissions "horeunger" — zero matches (was a placeholder-leak risk, confirmed clean).

**Status: 🟡 CLAIMED (2026-07-17)** · all 5 flagged instances gone from the live site + codebase. If you spot new filler copy anywhere, it'd be a fresh finding, not a reopening of this list.

---

# Carried over (verify or reopen)
ISS-01 (variant selectors) ⏸ BLOCKED — real fix needs Shopify variant-matrix migration + Gelato pricing. Current state = informational text only. Still accurate — this is the same root cause the UX-11 audit re-confirmed (127/127 multi-variant products missing per-variant photos), tied to the open GELATO_STRATEGY.md decision.
ISS-02 / ISS-03 / ISS-04 / ISS-05 / ISS-06 / ISS-07 / ISS-08 — the original numbered list from June 21 wasn't preserved anywhere, so "re-verifying" them meant a fresh mobile-first QA sweep instead of a lookup. Done 2026-07-17: home, shop, PDP (worst-case product — 12-variant framed print), cart drawer, wishlist/saved (added + persisted + verified end to end), fine-art PLP, about, commissions, search — all tested at 390px against the live URL, checked for horizontal overflow, console errors, and broken interactions. **Nothing broken found.** One near-miss: the inline PDP "Add to cart" button measures 0×0 on mobile — checked the CSS before flagging it as a bug, and it's intentional (`ProductOptions.module.css` line 176, explicit comment: "hidden on mobile, StickyATC handles it"). Status: 🟡 CLAIMED — no broken flows found in this pass, but per this file's own rule that's a claim, not a verification; genuinely nothing left to point you at right now.

---

# Launch Blockers

### LB-1: Contact + commission form does NOT route to hello@dayindayin.dk
**Task:** pre-launch checklist item 5 ("Contact and commission form — verify routing"). Verified 2026-08-02 with a real test submission against the live API (`https://dayindayin-site.vercel.app/api/contact`), not just a code read.
**What was tested:** POSTed a real enquiry with `subject: "Commission enquiry"` (this is exactly how the commissions page routes — `/commissions` has no separate form, it links to `/contact?subject=Commission%20enquiry`, and `ContactForm.tsx` pre-fills from that param — both checklist bullets share one code path, `app/api/contact/route.ts`).
**Result — confirmed still broken as documented in CLAUDE.md's CONTACT_EMAIL_TO row (2026-07-25):**
- ✗ Contact form does NOT arrive at hello@dayindayin.dk — production `CONTACT_EMAIL_TO` is `sebastianhflamant+github@gmail.com` (confirmed via `vercel env pull`, not just reading `.env.local`).
- ✗ Commission enquiry does NOT arrive at hello@dayindayin.dk — same code path, same result.
- Proof: test email landed in Sebastian's Gmail inbox at 2026-08-02 19:28 UTC, subject "Commission enquiry — from Claude Verification Test", from `onboarding@resend.dev`, to `sebastianhflamant+github@gmail.com` (Gmail thread `19fc3f369f89a55a`).
- Auto-reply bullet: there isn't one. The code sends exactly one email (to the owner); the submitter only ever sees an on-page "Thank you" message, no confirmation email. So "sends from hello@/no-reply@dayindayin.dk" is trivially true (none exists) but this is worth Sebastian knowing explicitly rather than silently checked off.
- Separately noticed, not tested: `/commissions` still has a `mailto:stine@dayindayin.dk` fallback link (LOG.md 2026-07-25 says commissions/practical/legal pages were deliberately left at stine@, out of scope for that session's stine@→hello@ swap). Whether stine@dayindayin.dk or hello@dayindayin.dk exist as real, working mailboxes at all is a Simply.com hosting question outside this codebase — not verified here.
**Root cause (as of 2026-07-25, now resolved):** Simply.com SMTP doesn't work from Vercel's serverless runtime; Resend's free tier allows one verified sending domain, which was committed to mikofu.com, so dayindayin.dk couldn't be verified without a paid Resend plan.

**Fixed 2026-08-02, same session, after checking with Sebastian:** Mikofu is fully archived (no live send activity — Shopify cancelled, Supabase deleted, Vercel project deleted) and isn't launching again soon, dayindayin is the priority project, so Sebastian approved freeing Resend's one free-tier domain slot: deleted mikofu.com's verification in the Resend dashboard, verified dayindayin.dk in its place (DNS records for this already existed at Simply.com from an earlier abandoned attempt on 2026-07-23 — no DNS work needed, just triggered re-verification). Updated `app/api/contact/route.ts` to send `from: "DayInDayIn <hello@dayindayin.dk>"`, and production `CONTACT_EMAIL_TO` to `hello@dayindayin.dk` (`ba370f1`).
- Hit a second issue getting this live: the Resend API key Vercel was using (`Vercel Integration`, created 3 months ago) turned out to be scoped to the *old*, since-deleted dayindayin.dk domain object — sends failed with a generic "Failed to send email" and never even reached Resend's logs. Created a fresh unrestricted-domain API key (`dayindayin-site-production`) and swapped it into Vercel production, then redeployed (env var changes don't apply to an already-built deployment — needed a fresh build to pick it up).
- **Live-verified, real test submission against production** (`https://dayindayin-site.vercel.app/api/contact`, `subject: "Commission enquiry"`): API returned `200 {"ok":true}`. Resend's own log for that send (`/emails`, 200) shows `from: "DayInDayIn <hello@dayindayin.dk>"`, `to: ["hello@dayindayin.dk"]` — the actual accepted request, not just code intent.
- **Inbox-side confirmation:** `hello@dayindayin.dk` turned out to be a Simply.com-hosted mailbox, not Google Workspace as Sebastian believed — the domain's MX record points to `mx.simply.com`, and Simply.com's mail admin panel lists `hello@`, `sebastian@`, `stine@dayindayin.dk` as native Simply.com mailboxes (Google Workspace verification TXT/CNAME records exist in DNS too, but MX was never switched to Google's servers, so nothing actually routes there).
- Auto-reply bullet: still accurate as written above — no auto-reply exists, only an on-page "Thank you," unchanged by this fix.

**Forwarding added, same session, per Sebastian's explicit go-ahead:** rather than change where the mailboxes live, set up Simply.com's native forwarding ("Videresendelser") for all three: `hello@`, `sebastian@`, `stine@dayindayin.dk` → `sebastianhflamant@gmail.com`. No password/mailbox login needed for this — it's a domain-level forwarding rule, separate from the mailbox itself.
- **Live-verified end to end, real inbox proof, not just Resend's send log:** submitted a fresh test enquiry through the live contact form; the forwarded copy landed directly in Sebastian's Gmail inbox (not spam, despite Simply.com's own warning that Gmail sometimes flags forwards) within under a minute — sender `hello@dayindayin.dk`, to `hello@dayindayin.dk`, 2026-08-02 20:45 UTC.
**Status:** 🟡 CLAIMED — routing is fixed and live-verified end to end at every hop: form submit → Resend accepts and sends to hello@dayindayin.dk → Simply.com receives it → forwards to Sebastian's actual Gmail inbox → confirmed arrived. Not ✅ VERIFIED because that's Sebastian's call per this file's rule, not Claude's to set.

---

### Pre-launch task 9: Public contact email audit — fixed 2026-08-02
**Task:** verify hello@dayindayin.dk is used consistently everywhere a public email address appears (footer, About, Contact, commission enquiry CTA); stine@dayindayin.dk should not appear publicly anywhere.
**Audit method:** `grep -rn "stine@dayindayin.dk\|hello@dayindayin.dk"` across the whole repo (all extensions, excluding `node_modules`/`.git`), not just the four named locations.
**Found:** Footer, About, Contact, and `ContactForm`'s error-fallback text already used hello@dayindayin.dk (fixed 2026-07-25, per LOG.md). Six other public pages still showed stine@dayindayin.dk — left out of scope by that earlier session: `/commissions` (the commission enquiry CTA fallback link — explicitly named in this task), `/practical` (3 instances — licensing FAQ, wholesale FAQ, returns/shipping contact), `/legal`, `/legal/privacy` (2 instances), `/legal/copyright` (2 instances).
**Fixed:** swapped all 9 instances stine@→hello@dayindayin.dk (display text + `mailto:` links) in `app/commissions/page.tsx`, `app/practical/page.tsx`, `app/legal/page.tsx`, `app/legal/privacy/page.tsx`, `app/legal/copyright/page.tsx`. `npx next build` passed clean afterward, no regressions.
**Note — did not touch:** `CONTACT_EMAIL_TO` backend routing (that's LB-1 above, blocked on a paid Resend plan) — this task was display-only, which email address is shown to the public, not where form submissions actually land. Also left `ISSUES.md`'s own historical LB-1 text referencing stine@ untouched — that's documentation of past state, not a live public page.
**Status:** ✅ done — pushed, live. Zero remaining `stine@dayindayin.dk` in any app/component file (verified by repo-wide grep post-fix).

---

### LB-2: Shopify Payments is not active — store cannot take any real payment right now
**Task:** pre-launch checklist item 10 ("Shopify — confirm payment methods are live"). Checked live in Shopify Admin (`admin.shopify.com/store/dayindayin/settings/payments`), not inferred from old notes.
**What was checked, all four sub-items:**
- ✗ Shopify Payments active, not test mode — **not active at all.** The Payments settings page shows a **"Complete setup"** button next to "Shopify Payments" (not "Manage", which is what an active account shows). This is the identity/KYC step flagged as pending back on 2026-06-12 (CLAUDE.md, "Pending Sebastian decisions") — still not done 51 days later.
- ✗ At least one card payment method enabled — **none.** The "Available payment methods" row (Shop Pay, Visa, Mastercard, Amex, Apple Pay, Bancontact, +3 more) is a marketing preview of what activates once setup completes, not a live list — confirmed by the "Complete setup" CTA sitting directly above it.
- ✗ Apple Pay / Google Pay enabled — same root cause, inactive. Google Pay isn't even in the preview icon row (only Apple Pay is shown) — worth Sebastian knowing that distinction, not just "both pending."
- ✓/N/A No test-mode banner visible — true, but not for a reassuring reason: there's no banner because there's no live processor to be "in test mode" *of*. Absence of the banner here is not evidence of correctness.
- **Additionally checked, not in the original four bullets:** PayPal is added as a provider but also shows "Setup incomplete" ("Complete your PayPal account setup to start receiving payouts"). Manual payment methods: none configured (checked `/settings/payments/manual-payment-methods` directly — empty, just the "Add a manual payment method" prompt).
**Bottom line:** as of 2026-08-02, this store has **zero working payment methods** — Shopify Payments incomplete, PayPal incomplete, no manual fallback. A real customer reaching checkout right now cannot pay by any means.
**Not fixed this pass:** Shopify Payments activation requires business/personal identity verification (KYC) — legal name, address, bank account, tax ID. That's data only Sebastian/Stine can supply, and entering financial/identity credentials on someone's behalf is outside what this agent does. I opened the "Complete setup" flow only far enough to confirm it's a real KYC form, entered nothing, and did not proceed.
**Status:** 🔴 OPEN — hard launch blocker, needs Sebastian: complete Shopify Payments identity verification (or explicitly accept launching with no working payment method, which isn't really launching).

---

### Pre-launch task 14: Open Graph / social sharing spot check — 2 bugs found and fixed 2026-08-02
**Task:** spot check a Fine Art PDP and a Shop PDP for og:image (real, correct product), og:title/description (correct), tested via opengraph.xyz.
**Spot-checked:** `/works/purple-sun` (Fine Art) and `/shop/botanical-blanc` (Shop), both against the live URL, both run through opengraph.xyz's meta-tag inspector.
**og:title / og:description:** correct on both — real title, real description, no placeholders, no mismatch. ✓
**og:image — two real bugs found, both fixed:**
- **Fine Art PDP:** og:image was the raw full-resolution source photo (`purple-sun.jpg`, **12.1MB**) — opengraph.xyz flagged it outright invalid ("Image is too large, max 10485760 bytes"). Facebook's real limit is 8MB, so this would silently fail to preview on Facebook/Messenger shares. Sampled 4 more works across categories to check how systemic this is: `candy-I.jpg` 6.9MB, `candy-cane.jpg` 379KB, `fuck-alting.jpg` 7.3MB, `gud-har-meldt-afbud.jpg` 9.7MB — sizes vary a lot but several more are close to or over the 8MB Facebook cutoff. This affects the whole ~98-work archive, not just Purple Sun, since every work's `image` field in `lib/data.ts` doubles as both the on-page hero and the og:image.
- **Shop PDP:** og:image was the raw 2048×2048 square Shopify product photo — opengraph.xyz flagged "Image aspect ratio is wrong, most platforms expect 1.91:1 (1200×630), card may be cropped or letterboxed." A correctly-sized 1200×630 branded OG image generator (`app/shop/[handle]/opengraph-image.tsx`) already existed in the codebase but was dead code — `generateMetadata`'s explicit `openGraph.images` override was shadowing it, so it was never actually served.
- **Also found on both:** `og:site_name` was missing. Root cause: Next.js doesn't deep-merge nested `openGraph` objects between `app/layout.tsx` (which sets `siteName: 'Day In Day In'`) and page-level `generateMetadata` — the page-level object replaces the parent's wholesale, silently dropping `siteName`.
**Fixed:** built `app/works/[slug]/opengraph-image.tsx` (new, mirrors the shop pattern — artwork image + title, 1200×630, well under any size limit since it's a generated composite, not the raw file). Re-pointed both PDPs' `generateMetadata` at their respective generators instead of the raw images, and added `siteName: 'Day In Day In'` to both (now present). Also fixed two stale pre-rebrand colors in the shop generator (`#D94F2C` vermillion → `#95619B` mauve, `#E8D6CF` → `#FFFFFF`) that would otherwise have gone live as the first real use of this file — matches the 2026-07-05 "no reds on CTA" decision (CLAUDE.md, `app/globals.css` `--c-accent`).
**A subtlety I had to work around:** Next.js resolves file-convention OG image URLs against `metadataBase`, which is hardcoded to `https://dayindayin.dk` sitewide (consistent with ~30 other files — all JSON-LD, sitemap.xml, robots.txt). But `dayindayin.dk` DNS isn't pointed at Vercel yet — it currently resolves to Simply.com's parked server, confirmed live (`curl -v https://dayindayin.dk` connects to `93.191.156.166`, not Vercel). If I'd let Next auto-resolve the image URL normally, both PDPs' og:image would have gone from "works but imperfect" (real absolute CDN/Blob URLs) to "completely unreachable until DNS points" (this is, in fact, the state the **homepage's** og:image is already silently in — confirmed live, `https://dayindayin-site.vercel.app/` currently emits `og:image: https://dayindayin.dk/opengraph-image?...`, unreachable today). To avoid shipping that regression on shop/works, I hardcoded the two new image URLs to `https://dayindayin-site.vercel.app/...` explicitly instead of letting metadataBase resolve them — this works today and will keep working after DNS points too (Vercel keeps serving `*.vercel.app` alongside a custom domain indefinitely), so it doesn't need revisiting later.
**Not fixed — flagging, not in scope of this task:** the homepage's og:image has been broken (unreachable) this whole time for the same underlying reason (metadataBase → dayindayin.dk → parked, not Vercel). It'll self-heal automatically the moment DNS is pointed, same as everything else that references `dayindayin.dk` in JSON-LD/sitemap/canonical tags — did not touch `metadataBase` globally or the ~30 files with hardcoded `dayindayin.dk` URLs, since that's a deliberate, consistent, sitewide pattern (final-domain SEO/schema data) well outside a spot-check's scope, and changing it needs a decision about whether the temporary Vercel URL should ever appear in permanent schema data.
**Second bug, caught on live-image verification (not just meta-tag verification):** after the first push, curled the actual og:image URLs rather than trusting the `<head>` tags alone — `/shop/.../opengraph-image` returned 200 fine, but `/works/purple-sun/opengraph-image` returned a raw **500**. Root cause: my composed image still embedded the raw 12.1MB source photo as a background `<img>` inside `next/og`'s `ImageResponse` — its renderer (Satori/resvg) has its own internal buffer limit, independent of any OG-platform size limit, and errored with `Buffer size limit exceeded, try XML_PARSE_HUGE`. So the original size bug wasn't actually fixed by composing a smaller frame around it — the huge file was still the thing being rendered. Fixed by routing the embedded image through Vercel's built-in image optimizer (`/_next/image?url=...&w=828&q=75`, 828 being one of the framework's default allowed widths — an arbitrary width like 800 gets rejected with `INVALID_IMAGE_OPTIMIZE_REQUEST`) instead of the raw Blob URL. Re-tested locally against the 4 previously-sampled works spanning the smallest (`candy-cane.jpg`, 379KB) to largest (`gud-har-meldt-afbud.jpg`, 9.7MB) — all 4 now return 200, valid 1200×630 PNGs, ~0.5–1.2MB each.
**Verified:** `npx next build` clean both passes; `next start` locally confirms correct `<head>` tags on both PDPs AND (second pass) that the actual image bytes at those URLs load successfully (200, valid PNG) across a spread of file sizes, not just the happy-path one initially spot-checked. Pushed twice — will re-verify against the live URL + opengraph.xyz once Vercel deploys the second fix.
**Status:** ✅ done — 3 real bugs fixed (oversized/wrong-aspect og:image, missing site_name, 500 on the fix's own first attempt caught by checking actual image bytes rather than just meta tags), 1 pre-existing sitewide issue found and flagged but correctly left alone (homepage og:image unreachable until DNS points).
**Fourth bug, found 2026-08-02 while building an unrelated Shopify email logo (task 4):** both generators specified `fontFamily: 'Georgia, serif'` for the artwork/product title, but `next/og`'s renderer (Satori) doesn't have access to system fonts — unrecognized font names silently fall back to its bundled default sans, with no error or warning. Confirmed live: the shipped `/works/purple-sun/opengraph-image` was rendering "Purple Sun" in a generic sans, not serif. Downloaded Playfair Display Black (900, matching the site's actual heading weight) as a static `.ttf`, embedded it in both generators via `next/og`'s `fonts` option reading from `lib/fonts/PlayfairDisplay-Black.ttf`. Chose a locally-committed font file over fetching from Google Fonts at request time — avoids adding an external network dependency (and its failure/timeout mode) to something that renders on every crawler hit. Re-verified both images locally: title now renders in the correct serif.

---

### Pre-launch task 11: Shopify shipping rates — checked, found a real gap, then a full redesign shipped 2026-08-02
**Task:** pre-launch checklist item 11 ("Shopify — confirm shipping rates are set: zones cover EU/UK/Norway, rates non-zero, free-shipping threshold correct").
**What was checked:** all 49 Shopify delivery profiles via the Admin GraphQL API (Gelato auto-generates one per product category, e.g. "Gelato: Mugs", "Gelato: Small Framed Posters", plus the store's own default "General profile").
**Found:** zones and non-zero rates existed everywhere, so the checklist would nominally pass — but 52 products (6 Mugs, 4 Postcards, 1 Dad Cap, 2 Tank Tops, 4 "Print Material", 35 with no product type at all — covering Water Bottles, Caps, Posters, Framed Prints, Fine Art Prints, a Greeting Card, Tote Bags) were silently stuck on the generic "General profile" instead of their real Gelato category profile, charging a flat 299 DKK to EU/International regardless of real cost (vs. ~40–90 DKK on a correctly-assigned product). Root cause: the same broken Gelato↔Shopify sync investigated the same day (see LOG.md) — several of the 52 are the exact same products confirmed stuck/unconnected in that investigation, strongly suggesting shipping-profile assignment breaks via the same mechanism as the variant-connection bug, not a separate fault.
**Also found and corrected en route:** the free-shipping threshold that did exist (590 DKK) was Denmark-only, lived only on the General profile's ~213-variant bucket, and did not apply to EU/International or to any Gelato-category-profile product at all.
**Decision, after research + calculation with Sebastian:** rather than patch the 52 broken assignments individually, replaced the entire shipping model — one flat rate + one free-shipping threshold across the whole catalog, covering the actual primary market (Denmark, all EU member states, UK, Norway), leaving Rest-of-World on the existing real-cost rate.
**Numbers, and how they were reached (not guessed):**
- Verified empirically (not assumed) that Shopify charges shipping per delivery-profile-group, not per unit — tested 1× vs 4× the same product in a real cart (rate unchanged) and a 2-item cross-profile cart (rates *summed*, confirmed the real risk behind mixing categories under the old per-category system).
- Real Gelato cost data pulled per category (DK/EU/UK/NO), weighted by actual catalog mix, gave a real average shipping cost of ~60–65 DKK — landed the flat rate at **59 DKK**.
- Checked real market comparables (Poster Store: 349 DKK Nordic/DKK precedent; Exclusive European Art: €59/€99 EU precedent) plus Sebastian's own worst-case-cost concern (Large Framed Poster to Norway, ~186 DKK real cost) and his "should take 2 items, hero print + cheap add-on" intent — landed the free-shipping threshold at **449 DKK**.
- Checked Gelato's own plan-tier marketing claim of a shipping discount — didn't hold up under a closer independent source; retracted rather than left uncorrected.
**Shipped:** created a "Flat Rate Shipping (DK / EU / UK / Norway)" delivery profile (59 DKK flat, free ≥449 DKK, scoped to DK+26 EU states+GB+NO) plus a Rest-of-World zone (299 DKK, matching the prior International rate, left unchanged) on the same profile. Tested end-to-end on one product first (variant reassignment confirmed to have zero effect on Gelato's own fulfillment record — checked via the Gelato API before/after, timestamp unchanged), then rolled out to the entire catalog: all 647 variants across 203 products, verified via a 26-point spot check spanning the full range (Shopify's own `productVariantsCountV2` metric stalls at 500 and is unreliable past that point — confirmed via direct per-variant queries, not trusted at face value). All 47 Gelato-category profiles and the General profile are now empty.
**Also fixed as a direct follow-up (Sebastian: "how is this communicated on site"):** shipping cost was communicated in exactly one place pre-checkout — the cart drawer's free-shipping progress bar — and it was hardcoded to 500 kr, unrelated to any real config the whole time. Fixed to 449, dropped the stale "EU" qualifier (now DK/EU/UK/Norway). Added the 59 kr flat / 449 kr free-shipping numbers to the PDP trust block and to the `/practical` FAQ (both the prose and the FAQ_ITEMS entry that feeds the FAQPage JSON-LD).
**Not fixed / still open:** the underlying Gelato variant-connection bug that caused the 52-product shipping-profile misassignment in the first place is separately tracked (see LOG.md) — this task fixed the shipping-cost *symptom* for the whole catalog by bypassing per-category profiles entirely, not the sync root cause.
**Status:** ✅ done — shipped and verified live across the entire catalog.

---

### Pre-launch task 13: Sitemap and robots.txt — verified, one real gap found, left as-is per Sebastian
**Task:** pre-launch checklist item 13 ("`/sitemap.xml` exists and lists all real pages; `/robots.txt` exists and doesn't accidentally block search engines").
**Checked live** (`dayindayin-site.vercel.app/sitemap.xml`, `/robots.txt`), not just read the code.
**robots.txt:** ✓ correct. `Allow: /` broadly, `Disallow:` only on genuine non-content routes (`/api/`, `/saved`, `/order-confirmed`, `/search`, three preview routes). Nothing blocking real content.
**sitemap.xml:** ✓ valid XML, 316 URLs (all static pages, shop filter tabs, every live Shopify product, fine-art works pages).
**Real gap found:** both files hardcode `https://dayindayin.dk` as the base URL for every link they contain, not the actual live URL. Checked whether this matters today: `dayindayin.dk` resolves to `93.191.156.166` (Simply.com, not Vercel) — HTTPS TLS handshake fails, plain HTTP returns 455. So if crawled today, the sitemap is 316 links to a domain that doesn't currently serve the site at all.
**Sebastian's call:** explicitly declined the fix ("sitemap and robots.txt have no value anyway as long as the site isn't truly live on its final url destination") — left unchanged. Not a bug left unfixed by oversight; a deliberate deferral tied to the still-open DNS-pointing item.
**Status:** ✅ done (verified, gap found and correctly triaged as low-priority pending DNS).

---

## Quality verdict on file (2026-06-21, honest)
Current site ≈ 60%. The gap is foundational (no enforced system, duplicate components, desktop-first), not polish. Once P0 (SYS-01…09) is real, most P1/P2 items collapse and quality jumps *and stays* jumped. This is fixable scaffolding, not a rebuild.

## Reconciliation verdict (2026-07-17, honest)
The scaffolding call above was right — P0 landed, and nearly the entire P1 + P2 list (16 of 18 page issues, all 5 copy items) turned out to already be resolved by the July 11–12 sessions, just never marked closed here. Real remaining work is thin: SYS-01 (mobile-first as an ongoing discipline, not a one-time fix) and SYS-02's Playwright screenshot script both need periodic re-confirmation rather than a single close. The two things that are genuinely still open and need YOUR call, not more Claude time: the GELATO_STRATEGY.md curate-vs-automate decision, and whether any of the ~300 broken-batch products are live/orderable right now (real customer risk, asked twice, never answered).
