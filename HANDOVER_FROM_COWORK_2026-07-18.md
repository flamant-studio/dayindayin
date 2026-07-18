> **Editor's note, added 2026-07-18 by Claude Code:** this document was written by a separate Cowork session, apparently from a set of reference screenshots, without visibility into this repo's `ISSUES.md`/`LOG.md`. At the time it was received, 15 of its 16 "UX task backlog" items (Section 6) were already shipped and live — several re-verified more than once since — and its claim that site images are hosted on GitHub raw URLs is incorrect (that's true for Gelato's print-file source only; the site itself serves from Vercel Blob). Kept here as a historical record of that Cowork session's brief, not as a current task list. See `LOG.md` and `ISSUES.md` for actual current state before acting on anything below.

---

# Dayindayin — Claude Code Handover Document
*Written by Claude (claude.ai) on 2026-07-18 after a full strategic session with Sebastian (Hidaseb), the project owner. Read this in full before doing anything.*

---

## 1. How to use this document

This is not a list of tasks to run through at speed. It is a briefing. Your job before touching any file is to:

1. Read this document in full
2. Read CLAUDE.md, LOG.md, and ISSUES.md in the project root
3. Read `GELATO_HISTORY_SUMMARY.md` if you are touching anything Gelato-related
4. Identify the single task you are about to do
5. Confirm you have everything you need to do it — files, credentials, knowledge of where things live — before starting
6. Do the task
7. Test it against the specific QA criteria listed for that task
8. Report back in plain language: what you did, whether it passes QA, and whether it is done or not

If at any point you hit something unexpected, stop. Do not improvise. Do not try an alternative approach without flagging it. Log what you found and wait for instruction.

---

## 2. Who Sebastian is and how he works

Sebastian is a senior project manager and non-technical website owner. He is running this project alongside manual work in Gelato (the print-on-demand platform) which requires his full, uninterrupted concentration. He has been working on this project for several months and is close to launch.

He does not want to be interrupted by:
- Questions that should have been answered by reading the codebase first
- "Oops" moments mid-task that require his input to resolve
- Tasks that were called "done" without being properly tested
- Playwright screenshots that show nothing meaningful because no one defined what to look for

His working method is: briefing → scoping → asset check → execute → test against goal → report back cleanly. He expects the same from you.

He will give you one task at a time. Complete it fully and report back before asking for the next one.

---

## 3. Project overview

**What this is:** An artist portfolio and e-commerce website for Stine Weirsøe Flamant, a Copenhagen-based fine art painter who also works in textile art (tufting, embroidery), photography, and sculpture.

**What it does:**
- Showcases original fine art works (Fine Art section)
- Sells print-on-demand products via Gelato + Shopify (Shop section)
- Accepts commission enquiries
- Has a press/personal brand presence

**Tech stack:**
- Frontend: Next.js (check CLAUDE.md for exact version and structure)
- E-commerce: Shopify (Storefront API for frontend, Admin API for scripts)
- Print fulfilment: Gelato (connected to Shopify)
- Deployment: Vercel (currently on a preview URL — dayindayin.dk DNS not yet live)
- Images: Hosted on GitHub raw URLs (`raw.githubusercontent.com/flamant-studio/dayindayin/main/...`)

**Current state:** The site is functional but not launch-ready. It is live on a Vercel preview URL. The real domain (dayindayin.com / dayindayin.dk) has not been pointed yet. No real customers have been exposed to it.

---

## 4. What is blocking launch — full picture

There are four major blockers and four minor tasks before the site can go live. They are listed here in priority order. Do not start minor tasks if a major blocker is unresolved.

### MAJOR BLOCKERS

---

**MAJOR 1 — Full Artwork Audit + Missing Gelato Products**
Status: In progress (some work already done in terminal)

> **Terminal-side status (2026-07-18):** Full Dropbox sweep run and mostly actioned. 20 missing fine-art pieces added (H.C. Andersen, Her Er En Sandhed, Fantasy, Det Er Bare Tanker, Red to Blue, a new Mixed Media category with 5 pieces, the About-page brand-mark collage as its own entry, 7 more Candy pieces, 2 more Rainbow colorways, 4 standalone Tufting/Embroidery pieces). All fine-art additions only — **no new Gelato products created**, per Hard Rule 2. Still open: `green-background` (no usable photo exists anywhere in its Dropbox folder), `collage-bw` (turns out to be a cropped detail from an unrelated test-swatch pinboard, not a real 100×70cm piece — needs your call: remove or rewrite), the "Rabbit" graphic-mark series found separately in `Shop of Words/` (product-catalog scope, needs a CSV, not started), and `DID-E-004_stranger-things` (an embroidered Netflix logo reproduction — **not adding**, real trademark exposure). **Not yet determined: which of the newly-added fine-art pieces, if any, should also become Gelato print products** — that's a judgment call this doc assumes but doesn't answer.

Some artwork from Dropbox was missed in the initial run. Missing pieces need to be added to the Fine Art section. Some of those pieces also need corresponding Gelato print products.

Rules:
- Do NOT touch existing Gelato products — additive only
- New Gelato products are created via CSV import (see Section 5 on Gelato)
- Sebastian imports the CSV manually — you generate it, he imports it

---

**MAJOR 2 — Gelato Product Audit** ⚠️ DO NOT TOUCH WITHOUT READING SECTION 5 IN FULL

Status: Ongoing — Sebastian is doing this manually in the Gelato dashboard while Claude Code handles site tasks in parallel.

This is NOT a Claude Code task right now. Sebastian is manually editing products in Gelato (adding variants, fixing image placement on templates, selecting correct mockups). This work requires his full attention and must not be interrupted or pre-empted by any script.

Your role here is limited to:
- Generating new product CSVs when Sebastian asks (see Section 5)
- Running read-only Shopify inventory scripts when asked
- Nothing else

> **Terminal-side status (2026-07-18):** Respected — no Gelato/Shopify write scripts run tonight, only read-only research (`GELATO_HISTORY_SUMMARY.md`, a full synthesis of every Gelato issue/decision in the project's history, saved to the repo root for the Cowork reassessment).

---

**MAJOR 3 — E2E Testing**
Status: Not started. Must happen after Major 1 and 2 are complete.

> **Terminal-side status:** Correctly not started.

Full user journey: browse → PDP → add to cart → checkout → confirmation. All product types. All variants. Desktop and mobile. Commission enquiry form. Newsletter signup.

Do not start this until Sebastian says Major 1 and 2 are done.

---

**MAJOR 4 — Full Site Copy Review**
Status: Not started. Requires Stine (the artist) to review and approve.

No AI-generated filler copy should remain at launch. This is a human task — flag it to Sebastian when other work is done but do not attempt to write or replace copy yourself.

> **Terminal-side status:** Correctly not started/attempted. Worth noting: a "P2 copy cull" pass already ran weeks ago on obvious filler phrases (ISSUES.md), but that's not the same as Stine's full review this item calls for.

---

### MINOR TASKS (do these while Sebastian works on Gelato)

These are safe to work on in parallel. Pick them one at a time. Complete and verify before moving to the next.

**MINOR 1 — UX fixes from screenshots** (see Section 6 for full list)
**MINOR 2 — Shop by Motif page** (see Section 6)
**MINOR 3 — Email routing** (requires Sebastian to confirm addresses first — ask before starting)
**MINOR 4 — DNS → dayindayin.com** (final step, do last)

---

## 5. Gelato — critical rules. Read before touching anything.

This section exists because the Gelato integration has failed repeatedly throughout the project. The full failure history is in `GELATO_HISTORY_SUMMARY.md`. Every rule below was learned the hard way.

**HARD RULE 0 — The API cannot set artwork on a Gelato product.**
Three mechanisms were tried. All return HTTP 200 and silently do nothing. Do not try again. Do not suggest trying again. The only verified path for setting artwork is CSV import via the Gelato UI — manually, by Sebastian.

**HARD RULE 1 — productUIDs must be fetched fresh every time.**
Never reuse a UID from a previous CSV or from memory. Always run `scripts/audit-csv-uids.ts` against the live template API before generating any CSV. Two batches were silently destroyed by stale UIDs (tote bag and tank top).

**HARD RULE 2 — CSV import is Sebastian's job, not yours.**
You generate the CSV. Sebastian imports it in the Gelato UI and matches it to templates. You never import directly. You never trigger any import programmatically.

**HARD RULE 3 — Deleting a product in Gelato deletes it in Shopify too. Irreversible.**
Do not suggest deleting products as a fix for anything. Do not run any delete script.

**HARD RULE 4 — CSV import creates new products only. It cannot update existing ones.**
If a product with the same name already exists in Gelato, the import silently fails — zero products imported, zero error shown. This is how it works. The only way to fix an existing broken product is manual editing in the Gelato dashboard UI.

**HARD RULE 5 — Tag `do-not-touch` products before any script runs.**
Sebastian has hand-edited ~30-40 products that are currently correct. These are not tagged yet. Until they are tagged, no script should touch existing products. If you are asked to run a Shopify inventory script, output a read-only spreadsheet only — no changes.

**HARD RULE 6 — Two artwork types need different treatment.**
Full-bleed colour photos (paintings, photographs of physical works) and isolated graphics on transparent backgrounds (digital illustrations like Neko Paw, SHERO) behave differently in Gelato templates. Never apply the same CSV logic to both without distinguishing them.

**The CSV format (5 columns, confirmed working):**
```
"Product Title","Product Description","Product UID","Print File URL","Should Publish Images?"
```
- Product Title must be unique across all existing Gelato products
- Product UID comes from the live template API — never guessed
- Print File URL is a GitHub raw URL pointing to the image file
- Should Publish Images? is always "Yes"

**CSV templates are at:**
`/Users/flamant-mini/Documents/FLAMANT/dayindayin-site/DayInDayIn Images/`

There are 17 template CSVs, one per product type:
- `gelato_mug_export.csv` — UID: `mug_product_msz_11-oz_mmat_ceramic-white_cl_4-0`
- `gelato_tote_export.csv` — UID: `bag_product_bsc_tote-bag_bqa_prm_bsi_std-t_bco_natural_bpr_4-4`
- `gelato_postcard_hor_export.csv` — landscape postcard
- `gelato_postcard_ver_export.csv` — portrait postcard
- `gelato_fap_vertical_export.csv` — fine art poster, portrait orientation
- `gelato_fap_horizontal_export.csv` — fine art poster, landscape orientation
- `gelato_fap_square_export.csv` — fine art poster, square
- `gelato_fine_art_poster_export.csv` — original fine art poster batch
- `gelato_framed_horizontal_export.csv` — framed print, landscape
- `gelato_framed_vertical_export.csv` — framed print, portrait
- `gelato_greeting_card_export.csv`
- `gelato_water_bottle_export.csv` — UID: `bottle_product_bsz_17-oz_bmat_stainless-steel-white_cl_4-0`
- `gelato_tank_top_export.csv` — UID: `apparel_product_gca_t-shirt_gsc_tank-top_gcu_unisex_gqa_prm_gsi_m_gco_white_gpr_4-0`
- `gelato_semiglossy_poster_export.csv`
- `gelato_wood_print_export.csv`
- `gelato_dadcap_export.csv`
- `gelato_shopofwords_byob_export.csv`

**Artwork images are on GitHub:**
Base URL: `https://raw.githubusercontent.com/flamant-studio/dayindayin/main/DayInDayIn%20Images/`
Subdirectories: `neko/`, `shero/`, `masks/`, `botanical/`, `flowers/`, `elephants/`, `tufting/`, `tourism/`, `patterns/`, `various/`, `shop-of-words/`, `animals/`

**Image transparency rules:**
- Mugs, water bottles, tank tops, tote bags → need transparent PNG (artwork sits on product; background must not be visible)
- Posters, framed prints, postcards, greeting cards, wood prints → do NOT need transparency; white/colour background is correct
- Background removal for complex artwork is done via remove.bg (web service) — not scriptable

---

## 6. UX task backlog — for parallel execution

These are all site-only tasks. No Gelato involvement. Each one should be treated as a complete mini-project: read the relevant code, understand what exists, make the change, test it, report back.

**Before starting any UX task:**
- Read the relevant page/component code in full
- Confirm you know exactly where the change needs to be made
- If you cannot find it, say so — do not guess
- After completing, take a Playwright screenshot of desktop AND mobile and confirm the QA criteria below are met

**Screenshot reference files are at:**
`/Users/flamant-mini/Desktop/dayindayin_task_screenshots/` (files named 1.png through 18.png)

---

### UX TASK 7 — Footer: Consolidate two lines into one
Lowest risk. Start here.

Current state: Two-line footer.
Line 1: "Ships to EU, UK & Norway · Secure checkout via Shopify · Prints from 56 kr"
Line 2: "© 2026 Stine Weirsøe Flamant · Flamant Tekst & Design" + Sitemap link + "Printed by Gelato" link

Target: Single line: `© 2026 Stine Weirsøe Flamant · Ships to EU, UK & Norway · Secure checkout via Shopify · Printed by Gelato`
- Keep Gelato and Sitemap as links
- Drop "Prints from 56 kr" (price will need updating and doesn't belong in footer)
- Drop "Flamant Tekst & Design" (redundant)

**Before starting:** Find the footer component. Confirm it is hardcoded, not pulled from a CMS or Shopify metafields. If it is dynamic, stop and report back — do not guess.

QA:
- [ ] Desktop: single line, no wrapping
- [ ] Mobile: wraps gracefully, nothing overflows or gets cut off

> **Terminal-side status: ALREADY DONE** (UX-7, shipped 2026-07-11, `LOG.md`). Footer is hardcoded in `components/Footer.tsx`, confirmed not CMS-driven. Collapsed to one line per this exact brief. Not re-verified against these exact QA checkboxes tonight — worth a quick live look before assuming it still matches word-for-word.

---

### UX TASK 6 — Home: Remove Studio Notes + comment out blog
Remove the "From the studio" section from the homepage. Comment out (do NOT delete) the Studio Notes / blog pages and any nav links pointing to them. They may return when real copy from Stine exists.

**Before starting:** Find every place the Studio Notes section is referenced — homepage component, nav, any routing. Map it all before touching anything.

QA:
- [ ] Desktop: no Studio Notes section on homepage
- [ ] Mobile: same
- [ ] Nav: no broken links, no 404s
- [ ] Blog pages are commented out, not deleted — confirm they can be uncommented cleanly

> **Terminal-side status: ALREADY DONE** (UX-6, 2026-07-11). Routes renamed `app/art-journal` → `app/_art-journal`, `app/blog` → `app/_blog` (Next.js private-folder convention — 404s, code intact, trivially reversible, matches "commented out not deleted" in spirit). Nav links removed from Footer + 404 page. Removed from sitemap.

---

### UX TASK 4 — Home: Minimise newsletter signup, move to footer
Remove the full newsletter block from the homepage body. Add a minimal version to the footer: single email input + submit button, no headline, no description copy.

**Note:** If newsletter is wired to a third-party service (Mailchimp, Klaviyo, etc.), the form action/endpoint must be preserved exactly — do not break the subscription flow.

**Before starting:** Find the newsletter component and confirm how it submits (form action, JS handler, third-party embed). Confirm before moving.

QA:
- [ ] Desktop: no newsletter block on homepage body
- [ ] Desktop: footer has email input + button, no marketing copy
- [ ] Mobile: footer input is usable, does not overflow

> **Terminal-side status: ALREADY DONE** (UX-4, 2026-07-11). Full homepage newsletter section removed; `NewsletterSignup` got a `variant="minimal"` (single input + button, no copy) living in the footer brand column. Third-party submit endpoint preserved (untouched).

---

### UX TASK 8 — Shop: Fix or remove "Newest" sort button
The Newest/Price sort buttons do nothing when clicked. Either make them work or remove them. Do not show UI that does nothing.

**Before starting:** Check whether the sort is wired to any data-fetching logic. If it is partially implemented, finish it. If there is no data layer behind it at all, remove the buttons.

QA:
- [ ] Desktop: sort buttons either work or are gone
- [ ] Mobile: same

> **Terminal-side status: INVESTIGATED, NOT A BUG** (UX-8, 2026-07-11). Sort is fully wired — `?sort=price-asc`/`price-desc` genuinely reorder, verified against live prices. "Newest" is the default; clicking it while already active correctly does nothing, same as any toggle at rest. No change made.

---

### UX TASK 9 — Shop: Remove Floral and Botanical filter tabs
These series have only 3 products each and are too sparse for their own tabs. Remove the tabs. Products remain accessible under "All Series".

QA:
- [ ] Desktop: Floral and Botanical tabs are gone from the filter bar
- [ ] Mobile: remaining tabs scroll correctly
- [ ] Products themselves are not deleted

> **Terminal-side status: ALREADY DONE, then taken further.** Tabs dropped from the visible bar 2026-07-11 (UX-9), still reachable via `?filter=`. Then last night (2026-07-17), per your direct request, "Botanical" was removed as a *category* entirely — not just the tab — across the series list, filter regex, Shopify tag matching, sitemap, and Fluid signal-extraction. Floral tab is still hidden-but-reachable as originally speced; Botanical no longer exists anywhere.

---

### UX TASK 16 — Fine Art PDP: Update CTA copy
The Fine Art PDP CTA currently says "Discover this work". Change it to "Enquire about price" on all Fine Art original work PDPs. Shop/print PDPs keep "Add to cart".

QA:
- [ ] Desktop: all Fine Art original PDPs show "Enquire about price"
- [ ] Mobile: button text fits within button, no truncation
- [ ] Shop PDPs unchanged

> **Terminal-side status: ALREADY DONE** (UX-16, 2026-07-11). "Discover this work" → "Enquire about price" site-wide; sold-work variant also updated for consistency. Shop/print PDPs' "Add to cart" untouched.

---

### UX TASK 2 — Home: Uniform series tiles
The "Browse by Series" tiles are inconsistent in size, crop, and whitespace. Standardise to a single consistent aspect ratio. Artwork should fill the tile edge to edge — no dead white space or frame padding inside tiles. Cropping into the artwork is allowed and encouraged.

QA:
- [ ] Desktop: all tiles are the same aspect ratio and visual weight
- [ ] Mobile: tiles scroll horizontally, all same size

> **Terminal-side status: ALREADY DONE, twice.** First pass 2026-07-11 (uniform `SeriesTile`, shared component). You then flagged (2026-07-17) that the tiles were still showing product photos (framed prints, awkward crops), not iconic art — so this was rebuilt from scratch: 7 hand-picked, hand-cropped flat-art images sourced from the public artwork repo, each filling its tile edge-to-edge with no dead space, replacing a "search Shopify by keyword" mechanism that kept surfacing product mockups. Verified live.

---

### UX TASK 1 — Home: Replace Liebes Panopticon hero image
Current hero image shows the back/WIP side of the tufted canvas. Find a better image of this piece — front-facing, finished — in the asset library and replace it. The dark green text panel on the right stays unchanged.

**Before starting:** Find where the hero image is set in the codebase (component prop, CMS field, hardcoded path). Find what other images of "Liebes Panopticon" exist in the asset library. Confirm before changing.

QA:
- [ ] Desktop: hero shows a front-facing, finished shot of the work
- [ ] Mobile: image reads well at narrow viewport

> **Terminal-side status: ALREADY DONE** (2026-07-12). The "no valid photo exists" conclusion from an earlier pass was itself wrong — only Vercel Blob had been checked, not Dropbox's `_KUNST/COLLECTION CURRENT` library, which had a full "web ready" folder. Turned out to be a multi-panel composite piece (why the old images looked unrelated). Real front-facing photos re-uploaded, cache-busted.

---

### UX TASK 5 — Home: Replace reused images in studio collage strip
The horizontal studio collage strip reuses images that appear elsewhere on the site. Replace all reused images with fresh ones from the lifestyle category or artwork not featured elsewhere.

**Before starting:** Audit which images are in the strip and cross-reference against the rest of the site. Produce a list of what needs replacing before making any change.

QA:
- [ ] Desktop: no image in the strip appears anywhere else on the site
- [ ] Mobile: strip renders correctly

> **Terminal-side status: ALREADY DONE** (UX-5, 2026-07-11). Swapped to the 3 genuinely-unused lifestyle photos plus one work-gallery detail shot never surfaced elsewhere.

---

### UX TASK 13 — PDP: Replace zoom lightbox with inline image carousel
Remove the zoom-on-click lightbox. Replace with left/right arrows that cycle through product images inline — no modal, no lightbox.

QA:
- [ ] Desktop: arrows cycle images, no lightbox opens on click
- [ ] Mobile: swipe works, or arrows are visible and tappable

> **Terminal-side status: ALREADY DONE** (UX-13, 2026-07-11, with a real functional bug caught and fixed 2026-07-12 — the arrows initially didn't change the image, root-caused to variant-selection state overriding navigation). `ImageLightbox`/`useLightbox` intentionally left alone for the Fine Art "Studio views" gallery, a separate legitimate use.

---

### UX TASK 15 — Fine Art PDP: Fix backside images as hero
Some tufted works use the back/underside of the piece as the primary image. The front must always be first. Fix "Jellyfish" explicitly. Audit all other Fine Art PDPs for the same issue and fix those too.

QA:
- [ ] Desktop: every Fine Art PDP shows a front-facing image as hero
- [ ] Mobile: same

> **Terminal-side status: ALREADY DONE** (UX-15, 2026-07-11), Jellyfish explicitly fixed as named, plus Floral Thing. Audited all 26 tufting works: 2 more (Liebes Panopticon — since fixed separately, see Task 1; Bedroom Rug/Wall Rug) have no valid front photo anywhere in the archive at all, not just a bad angle — flagged, not fixable without new photography or a corrected upload from Stine.

---

### UX TASK 12 — PDP: Add "Similar pieces" and "Recently viewed" carousels
Add two carousels below the product info section on all shop PDPs:
1. "Similar pieces" — same series or same product type
2. "Recently viewed" — last 4-6 products viewed this session (sessionStorage or localStorage)

Use whatever carousel component already exists on the site — do not build a new one.

QA:
- [ ] Desktop: both carousels render correctly
- [ ] Mobile: both scroll horizontally

> **Terminal-side status: ALREADY EXISTED, verified working, not touched** (UX-12, 2026-07-11) — both carousels (`More from {series}`/`You might also like` and `RecentlyViewed` via localStorage) predate this brief.

---

### UX TASK 17 — Fine Art PDP: Replace single carousel with two
Currently shows one "More hand tufting" carousel. Replace with:
1. "More from this medium" — other works in the same medium
2. "Recently viewed" — same as Task 12

Use the same shared carousel component as Task 12.

QA:
- [ ] Desktop: two carousels render
- [ ] Mobile: both scroll correctly

> **Terminal-side status: ALREADY DONE** (UX-17, 2026-07-11) — new `RecentlyViewedWorks` component added alongside the existing "More {medium}" carousel. **Also fixed last night (2026-07-18):** this section was rendering at full, unconstrained viewport width on the fine-art PDP (no `max-width` on that page's outer container, unlike every other section) — cards were rendering far oversized. Wrapped in a matching container; ~48px bottom spacing added per your follow-up. Verified live.

---

### UX TASK 14 — Unify series carousel into one shared component
The homepage and Fine Art page both have a series carousel but they are separate implementations. Extract into one shared `<SeriesCarousel>` component used in both places.

**Before starting:** Find both carousel implementations, compare them, confirm the props needed. Do not start until you understand both.

QA:
- [ ] Desktop: both placements look identical
- [ ] Mobile: both behave identically

> **Terminal-side status: ALREADY DONE** (UX-14/2, 2026-07-11) — `SeriesTile` extracted as one shared component used by both the homepage strip and `/collections`; also fixed a real staleness bug found along the way (`/collections` still listed renamed/removed series).

---

### UX TASK 18 — Remove "All Works" page, add view toggle to Fine Art page
The "All Works" page duplicates the Fine Art page with a grid view. Add a view toggle to the Fine Art page (grid / browse, persisted in URL as `?view=grid`). Redirect the old All Works URL to Fine Art. Remove the standalone page.

QA:
- [ ] Desktop: toggle switches layout
- [ ] Mobile: grid view is usable (minimum 2 columns)
- [ ] Old All Works URL redirects, no 404

> **Terminal-side status: ALREADY DONE** (UX-18, 2026-07-12/13). `/archive`'s dense grid merged into `/fine-art?view=grid` behind a List/Grid toggle; old page deleted, `/archive` 301-redirects through with category param preserved; every internal link updated to the new URL directly.

---

### UX TASK 11 — Fix non-functional variant selectors on PDP
Clicking White/Black or Side A/Side B on PDPs does nothing. Investigate: is this a Shopify variant configuration issue or a frontend wiring issue? Fix the root cause. This is likely widespread — audit all multi-variant products.

**Note:** From project history, this is a known systemic issue (127/127 multi-variant products affected). The root cause is missing per-variant images in Shopify, not a frontend bug. However, the Shopify Storefront API silently falls back to the default image instead of showing an error, making broken selectors look like working ones. A partial fix was shipped that discloses "photo shown is a reference" — check current state before deciding what to fix.

QA:
- [ ] Desktop: variant selector updates image on click (or discloses honestly that it cannot)
- [ ] Mobile: same

> **Terminal-side status: PARTIALLY DONE — this is the one real remaining item.** Root cause confirmed exactly as this doc describes (2026-07-11): Shopify's Storefront API silently falls back to the default photo instead of returning `null`. Site-side fix shipped — detects the fallback and discloses "photo shown is a reference" instead of a dead-looking selector. Audit re-confirmed 127/127 multi-variant products affected. **Not done:** the actual root fix (per-variant mockup photography/generation) — this has no owner or plan yet and is explicitly tied to the unresolved GELATO_STRATEGY.md curate-vs-automate decision (Major 2 territory, not something Claude Code can resolve alone).

---

### MINOR 2 — Shop by Motif page
New page grouping products by visual motif (hands, masks, botanicals, sea creatures, etc.). Reference: https://mikofu.com/motifs for design inspiration. Add nav link from Shop header and/or homepage.

**Before starting:** Ask Sebastian which motifs to include and how to group them. Do not invent the groupings.

QA:
- [ ] Desktop: motif grid renders cleanly
- [ ] Mobile: stacks or scrolls correctly

> **Terminal-side status: NOT STARTED** — correctly blocked, per this doc's own instruction, on Sebastian confirming which motifs and groupings. Not asked yet.

---

### MINOR 4 — DNS → dayindayin.com
**Do this last. Only when Sebastian says everything else is done.**

Point dayindayin.com to Vercel. Set up www redirect. Verify SSL. Check for any hardcoded staging URLs in the codebase.

QA:
- [ ] https://dayindayin.com loads
- [ ] https://www.dayindayin.com redirects correctly
- [ ] SSL valid
- [ ] No mixed content warnings

> **Terminal-side status: NOT STARTED** — correctly last, per this doc's own sequencing. Site remains on the temp Vercel URL only.

---

## 7. What you must not do

- Do not run any Gelato or Shopify script without Sebastian explicitly asking for it
- Do not delete any product, variant, page, or file — comment out if needed, never delete
- Do not push to production without Sebastian confirming the change looks correct
- Do not call a task done without running the specific QA checks listed for it
- Do not take a Playwright screenshot and call it QA without having something specific to verify
- Do not start a task you do not have full information to complete — stop and say what you need
- Do not attempt background/edge removal on artwork images — use remove.bg (manual, web service)
- Do not improvise when you hit something unexpected — stop, log what you found, wait for instruction

---

## 8. How to report back

When a task is complete, say:

**Task:** [name]
**Status:** Done / Not done
**What I did:** [one short paragraph]
**QA result:** [each checkbox: pass or fail, with one sentence of evidence]
**Anything Sebastian needs to know:** [only if relevant — keep it short]

If it is not done, say why, what you tried, and what you need to continue. Do not pad. Do not apologise. Just be clear.

---

*End of handover. If anything in this document conflicts with what you find in the codebase, the codebase wins — and you flag the discrepancy before proceeding.*
