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
**Status:** 🔴 OPEN · **Priority: P0** · Spacing tokens exist in `DESIGN_SYSTEM.md` (`--sp-*`) but the sweep applying them across ~49 stylesheets has not run yet — explicitly next in `LOG.md` 2026-06-30.

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
**What:** Found during this verification pass (2026-06-30), not previously logged. `npx tsx scripts/screenshot.ts` against the live URL captured `/fine-art` at **114,962px** (desktop) / **39,007px** (mobile) full-page height — every other page is 1,700–11,000px. There's a large blank `--c-surface`-coloured void mid-page (confirmed by cropping the screenshot), consistent with an unconstrained image or a runaway grid/row count, not a rendering-tool artifact.
**Where:** `app/fine-art/page.tsx` (89 `works` entries, three separate `.map()` calls — not investigated further, scope was a status check, not a fix).
**Status:** 🔴 OPEN · **Priority: P0 — highest, this is a live bug not a polish item.** Proof: `screenshots/design-system-2026-06-30/fine-art-desktop.png` (114,962px), `fine-art-mobile.png` (39,007px).

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
