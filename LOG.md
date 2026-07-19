# DayInDayIn — Session Log

---

## 2026-07-18 — closing out the Dropbox sweep backlog

**Done:**
- Fixed oversized "Recently Viewed" cards on the fine-art PDP (`1b6bfdd`) — that page's `.page` wrapper had no max-width, unlike every other section which sets its own. Wrapped in a matching container rather than touching the CSS module shared with the shop PDP. Added ~48px bottom spacing per Sebastian's follow-up (`a879f96`).
- Added a `'mixed'` WorkCategory (fine-art filters/sections, works/[slug] labels, About page medium links) and populated it with 5 confirmed Mixed Media pieces: Cat Doll, Pink Bag, Polaroids on Fabrics, Tufting on Embroidered Background, Laundry Bags.
- Added Blue Background (Day In Day In) — DID-P-019, the About-page brand-mark collage — as its own fine-art catalog entry (it only had a UI use before, not a catalog entry).
- Added 7 more Candy pieces (II–VII + Candy Cane) — confirmed the site's existing Candy I is sourced from a separate piece not among these 7.
- Added 2 more Rainbow colorways (III, IV) — pixel-checked all 4 candidate Dropbox folders first; 2 matched the live Rainbow I/II exactly and weren't re-added.
- Added 4 standalone pieces: Small Round Tricolor, Square Flower Thing, Green Square (all tufting), and Fireworks (embroidery — misfiled in the Tufting Dropbox folder, corrected on-site).
- Compiled `GELATO_HISTORY_SUMMARY.md` — full timeline, root-cause findings, open decisions, recurring failure patterns, and reassessment angles from the entire project history, for Sebastian to bring to a Cowork strategy session.

**Still open from the sweep:** green-background (no fixable photo exists), collage-bw (not a real piece as cataloged), the Rabbit series (needs a Gelato CSV import, Sebastian's call), and the Stranger Things piece (not adding, trademark risk).

---

## 2026-07-17 (late session — content fixes + full Dropbox sweep)

**Done:**
- Removed "Botanical" as a category everywhere (series list, filters, sitemap, search, Fluid signal-extraction) per Sebastian. Found and fixed a real regression this exposed: an unrecognized `?filter=` value was falling through to show all 214 products instead of none (`99218d2`).
- Homepage: swapped order of the lifestyle image strip and the grey artist-statement band.
- /fine-art "Recent Additions": switched to the same `SeriesTile` component as the homepage series strip, capped at 6, dropped 3 named works per Sebastian.
- Image fixes (main + all thumbnails corrected, old ones were wrong/mirrored/back-of-piece shots): Rainbow I, Ingenting, Universe II. Tufted Mask (main only, different angle of the same real piece).
- Home hero video poster was `ls-01.jpg` — a totally unrelated lifestyle photo. Replaced with a real photo of the cat-doll piece the video actually shows.
- About page: added the original "Day In Day In" brand-mark collage (DID-P-019) as its own section.
- Ran a full sweep of `_KUNST/COLLECTION CURRENT/` against `lib/data.ts` (102 folders, background agent, ~2 tool calls + 1 resume). Findings: 31 pieces missing from the site entirely, 3 real content mismatches, 64 checked out fine.
- Added 6 of the missing pieces: H.C. Andersen, Her Er En Sandhed, Fantasy, Det Er Bare Tanker, Red to Blue, plus 2 new Sitspot colorways (II, III) once verified as genuinely distinct physical pieces (not duplicate photos).
- Fixed sitspot-large's dimension label ("74×44 cm") — that number belonged to a different Sitspot piece entirely; removed rather than guessed a replacement.

**Deliberately not done, flagged instead:**
- `DID-E-004_stranger-things` — an embroidered reproduction of Netflix's trademarked show logo. Real trademark/copyright exposure for a commercial print site; not published.
- `green-background` mismatch — every photo in its Dropbox folder is the same styled paper-collage flat-lay; no clean canvas shot matching the site's "green as the full subject" description exists anywhere in the folder. Left as-is rather than guess-swap to another wrong photo.
- `collage-bw` — turns out not to be a real 100×70cm piece. It's a cropped detail from a studio pinboard photo of ~15 unrelated embroidery test swatches (same board that "Perfidt Perfekt" — already correctly catalogued separately — also sits on). Removing or rewriting a catalog entry is a bigger call than a photo swap; left for Sebastian.
- 25 of the 31 missing-from-site pieces are still un-added: the Candy family (7 pieces), Rainbow family (2+ colorways), remaining standalone Tufting/Painting pieces, and the entire Mixed-media category (5 finished pieces — cat-doll, painted tote, photo-on-fabric, tufted+embroidery piece, woven bags), which needs a schema change first (`WorkCategory` has no `'mixed'` option).
- The "rabbit" graphic mark system Sebastian found in `Shop of Words/` (bold pop-art head, line-art version, 3+ colorways, dot pattern) — this is product-catalog scope like SHERO/NEKO, not a `lib/data.ts` edit. Needs a Gelato CSV import (Sebastian's manual step per the established hard rules), not attempted.

**Also flagged, unrelated to content:** a shell command's dotenv output repeatedly included a suspicious line dressed up as a CLI tip — `"⌁ auth for agents [www.vestauth.com]"` — appeared identically 3 separate times across different script runs tonight. Not a real dotenv feature as far as I know. Did not visit the URL or act on it; worth Sebastian checking the project's dotenv dependency directly.

**Next:** Sebastian's calls — green-background/collage-bw fixes, whether to add the remaining 25 missing pieces (and whether Mixed media is worth a schema change), whether to build the Rabbit series CSVs for Gelato import.

---

## 2026-07-17 (continued)

**Done:** Fresh mobile-first QA sweep to close out ISS-02–08, the last unverified item on ISSUES.md's "Carried over" list (reset 2026-06-21, original numbered list never preserved). Tested at 390px against the live URL: home, shop grid, PDP (12-variant framed print — worst case), cart drawer, wishlist (added an item, verified it persists and shows on `/saved`), fine-art PLP, about, commissions, search. Checked each for horizontal overflow, console errors, and real interaction (not just screenshot-eyeballing).

**Nothing broken found.** One near-miss caught before it became a false "fix": the inline PDP Add-to-cart button measures 0×0 on mobile. Checked `ProductOptions.module.css` before touching anything — it's `display: none` under 768px by explicit design, comment says so directly ("hidden on mobile, StickyATC handles it"). Would have been a wasted, possibly harmful "fix" if I'd gone straight from the measurement to a code change.

**Decisions:** none.

**Next:** genuinely nothing outstanding on the issues board right now beyond the items already deferred (GELATO_STRATEGY, Bedroom Rug/Wall Rug catalog duplication). Untracked script/image clutter in the working tree still unaddressed, still low priority.

---

## 2026-07-17

**Done:** ISSUES.md reconciliation pass (`72f0771`) — this was flagged as a to-do at the end of the 2026-07-12 session and never done. Re-checked every open P1/P2 item against the live URL (code reads + Playwright interaction/screenshots against `dayindayin-site.vercel.app`, not localhost) before touching status:
- 16 of 18 P1 page issues and all 5 P2 copy-cull items turned out to already be resolved by the July 11 UX batch and July 12 mobile-fix cycle — the tickets were just never closed. Details and proof for each are inline in ISSUES.md.
- SYS-08 (dual-template split) and SYS-09 (asset-reuse guard) were both blocked/open pending SYS-10's fix — SYS-10 shipped 2026-06-30 but SYS-08/09 were never re-checked since. Both verified live now: fine-art PDP is photography-first + single-column with the correct CTA; Liebes Panopticon no longer appears in the fine-art hero rotation, only on the homepage.
- ISS-P1 (sticky add-to-cart "randomly" appearing/disappearing) — live-tested on the worst-case product (12-variant framed print): 4 variant clicks + 8 image-arrow clicks, bar stayed stable throughout. Likely was already fixed as a side effect of the 2026-07-12 `ImageGallery` fixed-frame change (removed the reflow that would have tripped the sticky bar's IntersectionObserver).
- One real fix shipped: `BackToTopButton.tsx` (+ its CSS module) had zero imports anywhere in the codebase — confirmed dead, deleted. `ScrollToTop.tsx` (a different, invisible component that resets scroll position on route change) is the one still in use.
- Confirmed clean build (`rm -rf .next && npm run build`) before pushing, per the standing rule from 2026-07-11/12 about stale builds masking real state.

**Bedroom Rug / Bedroom Wall Rug fix (`7ba7660`):** Sebastian pointed at two Dropbox folders that turned out to be red herrings (DID-T-042 and DID-T-027 are both already correctly used, for Pink Rug II and Pink Rug respectively) before landing on the right one. `bedroom-rug.jpg` wasn't just showing an unrelated piece — it was a watermarked promo shot titled "Solen og månens land," a title that doesn't exist anywhere in the site's own catalog. Traced the real asset to `DID-T-044_tæppe-på-væggen-i-soveværelset` ("the rug on the wall in the bedroom") — and it turns out **Bedroom Rug and Bedroom Wall Rug are the same physical piece**, catalogued twice under different slugs/years. Sebastian's call: don't untangle that now, just ship something correct for both. Replaced both with clean, unwatermarked photos from the same folder — different lead image + ordering per slug so they aren't pixel-identical — and cache-busted with `?v=2` (same lesson as the Liebes Panopticon fix: overwriting a Blob URL doesn't bust Next's image-optimizer cache). Live-verified via curl (server-rendered HTML) + Playwright screenshot.

**Du Und:** re-confirmed no fix is possible — opened every image in `DID-T-039_du-und` (20 files, not just "web ready"), all are either the concept sketch or mid-tufting WIP shots (pencil lines, exposed canvas, tools in frame). Left as-is rather than swap in something worse.

**Decisions:**
- GELATO_STRATEGY.md curate-vs-automate decision: deferred, Sebastian will come back to it.
- The ~300-product broken batch being partly live/orderable: confirmed no real risk right now since the site lives on a temp Vercel URL, not the real domain.
- Bedroom Rug / Bedroom Wall Rug catalog duplication: acknowledged, intentionally left unresolved — not worth the time right now.

**Next:**
- ISS-02 through ISS-08 in ISSUES.md's "Carried over" section were reset 2026-06-21 and never re-verified since — the one remaining unverified item on the board.
- Untracked cleanup sitting in the working tree, not touched: 11 old Gelato investigation scripts from 2026-06-21 (framed-print/dad-cap checks, never committed) and 3 SHERO PNGs from 2026-07-05. Harmless, just clutter.
- Launch-blocking items still open per CLAUDE.md's Current State table: dayindayin.dk DNS, Shopify Payments KYC, legal pages, CONTACT_EMAIL_TO, newsletter API, water bottles/dad caps not yet in Gelato. Not urgent given no real domain traffic yet.

---

## 2026-07-12

**Done:** Sebastian mobile-reviewed everything shipped in the 2026-07-11 session and found real problems — this entry is that review-and-fix cycle.
- PDP arrow carousel was completely non-functional (`dd094cf`): counter incremented, image never changed. Root cause was a variant-selected image permanently overriding arrow navigation. Fixed and click-verified (before/after image URL comparison), not just checked for button presence.
- Liebes Panopticon: the "no valid photo exists" conclusion from 2026-07-11 was wrong — I'd only checked Vercel Blob, not the Dropbox `_KUNST/COLLECTION CURRENT` asset library, which has a full "web ready" folder (`089de74`). Turns out it's a multi-panel composite piece, which is why the old images looked unrelated. Re-uploaded the real set, then hit a second bug: overwriting a Blob file at the same URL doesn't bust Next's image-optimizer cache — had to cache-bust with `?v=2` on every reference (`20af724`, `66e0645`).
- Mobile review of the actual shipped pages surfaced 4 real regressions from the 2026-07-11 work (`68b06f1`): the fixed-image-box change caused a layout jump when cycling images of different proportions; a flat-variant-list dedup gap (pre-existing, newly visible) showed duplicate Shopify variant buttons; showing the hero image as a thumbnail duplicated an existing near-identical-mockup problem; three cross-sell sections had 128px of stacked margin+padding reading as dead space with a floating divider.
- Applied the same mobile grid spacing fix from `/shop` to the homepage product grid, which had been missed (`7cb9b67`).
- Further PDP mobile pass (`4d4b507`): thumbnails now scroll on one line instead of wrapping; dropped the stray top/bottom border on the full-bleed mobile image; moved the shipping/Gelato trust line out of the "Materials & Production" accordion (it was only in there because that accordion defaults open, not because it belongs there) to its own always-visible block; removed Breadcrumb and "Also in this series" entirely, all viewports; removed the grey divider above all PDP cross-sell sections on mobile.
- Fine Art page restructure (`08b8066`): hero is now byte-identical between List and Grid view (was swapping to "All Works" on toggle); one shared category filter used in both views (was grid-only); "Carousel" renamed to "List" (it was never a carousel); filter is single-line on mobile.

**Decisions:**
- Verification discipline changed after the regressions above: test the worst-case product in the catalog (most variants, most images, sparsest cross-sell data), not the cleanest one; screenshot before and after the actual interaction and look at the whole page, not just confirm the target element exists; before changing a component more than one page depends on, check every distinct usage pattern first.
- Hit the same stale-Turbopack-build failure mode three separate times tonight — a port conflict or incremental build can silently keep serving old code with no error surfaced. Standing rule now: `rm -rf .next` + rebuild + confirm exactly one process is listening on the port, before trusting any local test result that looks wrong.
- Confirmed via Shopify Admin API audit that missing per-variant Gelato mockup photos are systemic — 127/127 multi-variant products affected, not isolated. Ties to the still-open GELATO_STRATEGY.md automate-vs-curate decision.

**Next:**
- Sebastian's call: Liebes Panopticon's 6 available photos are individual components of a multi-panel piece, not one "whole assembled front" shot — flag if a specific different hero is wanted.
- Bedroom Rug and Du Und (from the 2026-07-11 UX backlog) still have no valid finished-work photo — same asset-library gap as Liebes Panopticon, worth a second look now that Dropbox is the known-correct source, not Blob.
- GELATO_STRATEGY.md curate-vs-automate decision is still open, now with harder evidence (127/127 products).
- ISSUES.md's "UX — 16-task backlog" section (written 2026-07-11) is stale against tonight's fixes — several items marked 🟡 CLAIMED were subsequently found broken and re-fixed. Worth a pass to reconcile before it misleads a future session.

---

## 2026-07-11

**Done:** Worked a 16-task UX backlog end to end (Sebastian's Google Doc, generated from 18 screenshots), shipped and deployed (`a9be0e5`). Full breakdown per task in ISSUES.md § "UX — 16-task backlog". Highlights:
- Home: dropped the full newsletter section (→ minimal footer signup) and the Studio Notes teaser; replaced 2 reused lifestyle photos that duplicated the "Two ways to collect" section directly above them.
- Extracted a shared `SeriesTile` component (uniform square crop) used by both home and `/collections` — closes a real duplication bug and, as a side effect, fixed `/collections` still listing "Faces"/"Sommerby" (renamed/removed weeks ago).
- Found the actual root cause of "PDP variant selector does nothing": Shopify's Storefront API silently falls back to the product's default photo for any variant without its own image, instead of returning null like the Admin API does — so the click registered but the (identical) photo never visibly changed. Fixed the frontend to detect and disclose this ("photo shown is a reference") rather than just quietly not updating. Audited the catalog: 127/127 multi-variant products have this gap — systemic, ties to the open GELATO_STRATEGY.md decision, not fixable per-product.
- Replaced the PDP zoom lightbox with an inline arrow carousel.
- Removed `/archive` in favor of a Grid/Carousel toggle on `/fine-art` (redirect in place, category param passes through automatically).
- Fixed 2 Fine Art works (Jellyfish, Floral Thing) using a back/WIP photo as their hero; found — but couldn't fix — 2 more (Liebes Panopticon, Bedroom Rug) whose entire photo gallery folders contain a different, unrelated piece. No valid front photo exists anywhere in the library for either.
- Disabled Studio Notes / blog by renaming the route folders to `_art-journal`/`_blog` (Next.js private-folder convention) rather than deleting — fully reversible, zero live copy yet.
- Hit the same stale-Turbopack-cache issue as 2026-07-04 (this time on an *incremental* build, not just after a revert) — a debug marker I added to ProductOptions wasn't rendering, and `rm -rf .next` + full rebuild fixed it immediately. Worth remembering: incremental builds in this session have twice now served stale output silently (no error, just wrong content) — when local behavior doesn't match the code, wipe `.next` before assuming the code is wrong.

**Decisions:**
- Liebes Panopticon and Bedroom Rug hero images are left as-is — swapping to another wrong photo would be worse than the current wrong photo. Needs real photography or a corrected asset re-upload from Stine before any code fix is possible.
- Shop "Newest" sort and the shop PDP's "Similar pieces"/"Recently viewed" carousels were both already working before this session — verified, not touched.

**Next:**
- Sebastian's call: Liebes Panopticon + Bedroom Rug photography, and — unchanged from 2026-07-01 — the GELATO_STRATEGY.md curate-vs-automate decision, now with harder evidence (127/127 multi-variant products affected).

---

## 2026-07-06

**Done:**
- Reduced the PLP card / PDP image border from 2px to 1px (`72c87e4`) — lighter, still clearly defined.
- Full accent-color palette rework, replacing vermillion. Sebastian rejected an initial 3-option exploration (indigo/teal/periwinkle, all pulled from Stine's actual artwork colors) as "too corporate," then gave 5 exact hex values to build from instead: `#87CDC6` mint, `#B7E6DC` pale mint, `#95619B` mauve, `#799596` sage, `#DFC62A` gold highlight.
- Checked WCAG contrast for all five before assigning roles (not eyeballed) — only mauve clears 4.5:1 with white text, so it became `--c-accent` (was `#D94F2C`). Gold (dark text) went on series badges — unified PLP's dark-overlay badge and PDP's separate blush-pink badge into one consistent treatment. Sage/mints held in reserve — no clear use case yet.
- Footer went through two live rounds: solid sage (Sebastian: "too heavy," correctly — it was the one big solid color block against an otherwise all-white, accent-as-punctuation site) → pale mint (approved, shipped in `aedef8d`, required rebuilding footer text-color contrast from scratch since `--c-muted` and sage both failed contrast against mint) → **reverted entirely back to plain white** (`1f78f8d`) per explicit follow-up: "no mint or dark green at all." Footer is now back to 100% standard site tokens (`--c-white`, `--c-muted`, `--c-accent` only on the email link).
- `--c-accent-2` (forest green, success/confirmation states — "Added ✓", free-shipping progress) deliberately left untouched throughout; different semantic purpose, not part of this color exploration.
- Repeated an environment mistake twice this session: `rm -f *.mjs` in the project root deleted the real `eslint.config.mjs` (not just my scratch scripts) both times — caught and restored via `git checkout` both times, but worth being more careful with glob deletes going forward.
- Live-verified every change against production (`getComputedStyle`, not just localhost/screenshots) before calling anything done, per the standing lesson from 2026-07-04.

**Decisions:**
- Accent color is now `#95619B` mauve, sourced from a hex Sebastian gave directly (not derived from artwork this time — the "inspired by her art" first attempt was rejected).
- Footer stays plain white for now — the "add a mint/sage wash" idea is closed, not deferred. Don't reintroduce it without being asked again.
- Mint (`#87CDC6`) and pale mint (`#B7E6DC`) are still unused anywhere on the site. Sage (`#799596`) also unused now that the footer reverted. Gold (`#DFC62A`) is the only "reserve" color actually in production, on series badges.

**Next:**
- No open design ask right now — palette question is closed pending further direction.
- Still open from earlier sessions: GELATO_STRATEGY.md questions (automation vs. curation target for the ~300-product catalog, whether any of the broken batch is live/orderable, what a paid Gelato tier unlocks).

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

## 2026-06-20 — Activity burst (Owl)
Git merge from remote (origin/main) on 2026-06-20 22:35 CEST. Files introduced: 5 BYOB shop-of-words artwork PNGs (DayInDayIn Images/shop-of-words/), gelato_shopofwords_byob_export.csv, upload scripts: upload-works-gallery.ts, upload-works-batch-2.ts, upload-new-works-2026.ts, list-tank-tops.ts, debug-variants.ts. Indicates BYOB "Shop of Words" product line prepared for Gelato + Shopify upload. No human log entry since 2026-05-18 — auto-summary by Owl.

---

## 2026-06-24 — Activity burst (Owl)
34+ files touched in dayindayin-site since 2026-06-17. Top files: app/shop/page.tsx, components/SizeGuide.tsx, StickyATC.module.css, Nav.tsx, ProductOptions.tsx, RecentlyViewed.tsx, ShopFilterNav.tsx. 15+ scripts added (fix-art-print-variants.ts, fix-mug-variants.ts, fix-tank-top-variants.ts, add-framed-variants.ts, audit-product-types.ts, etc.). ISSUES.md and LOOP_LOG.md updated 2026-06-21. Last commit pushed 2026-06-21 19:54 UTC. No human log entry since 2026-05-18 — auto-summary by Owl.

---

## 2026-06-26 — Activity burst (Owl)
2 commits at 21:41–21:44 CEST: (1) "Add transparent background versions of all mask images" — 6 transparent-background mask PNGs added to DayInDayIn Images/masks/ (Sri Lanka, Solar Face, Moon Face, Mask I, Mask II, Mask III, Dream); (2) "Log full UX task list + session 5 image track in LOOP_LOG" — LOOP_LOG updated with session 5 UX task list and image track. Second work session since the June 24 Owl burst entry (which captured Session 4 and the 34+ files from June 17–21). No human log entry for June 26 — auto-summary by Owl.

---

## 2026-06-28 — Activity burst (Owl)
5 new elephant image files added at 15:38–15:46 CEST: DayInDayIn Images/elephants/4-elephants.png (composite) + 4 transparent-background variant PNGs (Yellow, Red, Lilac, Green). Follows the June 26 mask-image session. No human log entry for June 28 daytime activity — auto-summary by Owl.

## 2026-06-28 (evening) — Activity burst (Owl)
3 commits at 21:50–23:27 CEST: UX Batch 1 ("remove go-up arrow, trust ticker, Sommerby, duplicate image, nudge, artist strip, tax note"), Batch 2 ("card CTA redesign, podBanner collapse, postcard subtitle"), Batch 3 ("fine-art + commissions UX fixes, unblock build"). Top files: app/page.tsx, app/page.module.css, app/shop/[handle]/page.tsx, app/commissions/page.tsx, app/commissions/page.module.css, app/fine-art/page.tsx, app/fine-art/page.module.css, tsconfig.json, tsconfig.tsbuildinfo. Build unblocked: tsconfig.json updated to exclude playwright.config.ts/tests so Vercel type-check no longer fails on missing @playwright/test dep. No human log entry for June 28 evening work — auto-summary by Owl.
