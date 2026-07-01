# DayInDayIn — Issues Board
*Curated + prioritized 2026-06-21 from Sebastian's testing session. The single source of truth for what's broken and what's next.*
*Reconciled 2026-06-30: this file sat uncommitted for 9 days while the P0 component system (Button, Breadcrumb, SectionHeading, ProductCard, ArtworkCard, EditorialCard, SeriesCard, useLightbox) was built and shipped (commits `aad2575`…`68a4668`). Statuses below updated against fresh screenshots (`screenshots/design-system-2026-06-30/`) taken against the live URL. A new P0 bug (SYS-10) was found during this pass.*

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
**Status:** 🔴 OPEN (partial) · **Priority: P0** · `ArtworkCard`/`EditorialCard`/`SeriesCard` exist as separate components from `ProductCard`, but the explicit fine-art PDP rules (single-column, photography-top, CTA rename) are unverified — blocked by SYS-10 below, the `/fine-art` page is currently broken and couldn't be inspected past the fold.

### SYS-09: Asset-reuse guard
**What:** "Liebes Panopticon" image reused twice on home AND again on fine-art top. With a huge archive, no image should repeat across hero slots. Add a check / curated hero-image map.
**Status:** 🔴 OPEN · **Priority: P0** · Liebes Panopticon still on homepage "From the studio" (`home-desktop.png`); fine-art top not re-checked (page broken, see SYS-10).

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
**Status:** ⏸ OPEN QUESTION, not actioned — this is the same known, already-documented constraint: Gelato bakes the mockup's background into the photo; CSS only controls the card's own background, not what Gelato photographed. DESIGN_SYSTEM.md already recommends the fix: standardise all Gelato mockup/print backgrounds to one warm tone (e.g. `--c-parchment`) instead of clinical white — a Gelato-template change, not a code change. My recommendation: don't touch site CSS for this; when the Gelato mockup-background standardisation happens (already queued), this resolves as a side effect. Flagging back to Sebastian rather than guessing at a partial code workaround.

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

# P1 — PAGE ISSUES (after the relevant SYS- exists)

### Homepage
- ISS-H1 🔴 Browse-by-series: remove Sommerby; place SHERO image correctly or swap for a better SHERO image.
- ISS-H2 🔴 Remove "see all products in the shop" (bottom).
- ISS-H3 🔴 Remove go-up arrow (`BackToTopButton`/`ScrollToTop` — also a duplicate-component cleanup).
- ISS-H4 🔴 Hero body needs something better (copy — see COPY).

### Gelato PDP
- ISS-P1 🔴 **Bug:** sticky add-to-cart appears/disappears randomly. (Below-junior-level — fix the trigger logic.)
- ISS-P2 🔴 **Bug:** image zoom is useless — zoomed images smaller than the originals; arrows eat the viewport. Rework or remove.
- ISS-P3 🔴 **Bug:** breadcrumb rendering directly below the main image. Remove/relocate.
- ISS-P4 🔴 "Also in this series" — move down the page.
- ISS-P5 🔴 Remove "Work by Stine Weirsøe Flamant" block.
- ISS-P6 🔴 "More from [series]" + Recently Viewed → use carousels; kill the big gap between the two sections.
- ISS-P7 🔴 Postcard subtitle should read "(pack of 10)".

### Cart
- ISS-C1 🔴 Remove "taxes and shipping calculated at checkout" — taxes are included for EU. Just delete the line.
- ISS-C2 🔴 Add payment-method logos and/or security reassurance messaging.

### Fine-art page / PDP
- ISS-F1 🔴 "New to the archive" — unclear meaning; reword or remove.
- ISS-F2 🔴 Remove "office shot".
- ISS-F3 🔴 "Looking for prints?" (bottom) — reduce whitespace below; fix orphan "kr." line (→ SYS-05).

### Commissions
- ISS-CM1 🔴 Add lifestyle / behind-the-scenes imagery.
- ISS-CM2 🔴 Fix vertical whitespace between sections (→ SYS-05).

---

# P2 — COPY CULL (one pass, one rule: say the true thing, cut the rest)

Sebastian's flagged filler, all to cut or rewrite hard:
- Home "From the studio" — cut to the core.
- Shop "You keep coming back…" — remove for now.
- Shop — 3 bullet points at bottom take a full screen — cut down hard.
- Fine-art "Want something that exists only once?" — cut.
- Commissions — "reduce bullshit", watch for "horeunger" (typo/placeholder leak).
- General: "seriously, seriously: reduce bullshit." Every section earns its words or dies.

Status: 🔴 OPEN · one COPY pass after P0 layout settles.

---

# Carried over (verify or reopen)
ISS-01 (variant selectors) ⏸ BLOCKED — real fix needs Shopify variant-matrix migration + Gelato pricing. Current state = informational text only.
ISS-02 / ISS-03 / ISS-04 / ISS-05 / ISS-06 / ISS-07 / ISS-08 — previously self-marked ✅; **reset to 🟡 CLAIMED pending Sebastian verification** (several contradicted by 2026-06-21 testing). Re-verify against SYS- work; do not trust the old ✅.

---

## Quality verdict on file (2026-06-21, honest)
Current site ≈ 60%. The gap is foundational (no enforced system, duplicate components, desktop-first), not polish. Once P0 (SYS-01…09) is real, most P1/P2 items collapse and quality jumps *and stays* jumped. This is fixable scaffolding, not a rebuild.
