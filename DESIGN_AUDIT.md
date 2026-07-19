# Day In Day In — Design System, As It Actually Is
*A reverse-engineered audit of the real site, 2026-06-29. Not the wish-list — the truth.*
*Method: Brad Frost "interface inventory" — catalogue every unique building block actually in the code, then count the duplicates.*

---

## THE ONE-LINE VERDICT

**You don't have a design system. You have one documented on paper that the site ignores, and a real site that was hand-built page by page — so the same brick exists in 5–19 slightly different versions.** The good news: the skeleton (header, footer, cart) is clean and consistent, and the raw materials (colours, type) are 80% of the way to a system. The mess is in the middle layer — the building blocks — and it's fixable.

---

## HOW TO HOLD THIS IN YOUR HEAD: the Lego box

Think of the site as a box of Lego. A healthy box has **a small set of distinct bricks**, and every page is built by snapping those same bricks together. Your box has the opposite problem: roughly **a dozen kinds of brick, but 3–5 slightly-different copies of most of them** — a product-card brick that comes in 19 near-identical versions, a "section heading" brick rebuilt from scratch 10 times. Nothing snaps together, because no two bricks are quite the same shape.

The whole audit below is just: **how many real bricks do you have, how many are accidental duplicates, and which ones are actually shared.**

There are three layers, simplest to most assembled:

1. **Raw materials** — colours, fonts, spacing. (The plastic the bricks are made of.)
2. **Building blocks** — buttons, cards, headers, heroes, galleries. (The bricks.)
3. **Pages** — the blocks snapped together into shop, fine-art, about, etc. (The finished models.)

Fix the materials and bricks, and every page improves automatically. That's the entire point of a system.

---

## LAYER 0 — THE FIXED SPINE (this part is good)

Some things ARE consistent on every single page. This is your stable foundation — don't touch it:

| Element | Status |
|---|---|
| **Header / nav** (`Nav`) | ✅ One component, identical everywhere. Sticky, logo + links + cart. |
| **Footer** (`Footer`) | ✅ One component, identical everywhere. |
| **Cart drawer** (`CartDrawer`) | ✅ One, global. |
| **Cookie banner, analytics, scroll-to-top** | ✅ Global, consistent. |

**One correction to the old doc:** it claims a "mobile bottom tab bar (Home / Shop / Fine Art / Cart)." **That does not exist.** Mobile uses a hamburger + side drawer. The paper described a site that was never built.

Everything below the header and above the footer is where the inconsistency lives.

---

## LAYER 1 — RAW MATERIALS (80% there, but the paper lies)

**Colours, type, and spacing are defined as proper tokens in the code** (`globals.css`) — that part is right. The problems:

- **The written design doc (`DESIGN_SYSTEM.md`) is obsolete and actively misleading.** *Every* core colour value in it is wrong vs the real code. It says the background is `#F8F7F4`; the site uses `#F0EBE3`. It says the accent is `#C4694F`; the site uses `#D94F2C`. Anyone designing from that doc designs the wrong site.
- **Adherence is uneven.** How often the code uses the proper token vs a hand-typed value:

| Material | Uses the system | Hand-typed one-offs |
|---|---|---|
| Colour | **79%** ✅ | 21% |
| Font size | 59% ⚠ | 41% |
| **Spacing** | **35%** 🔴 | 65% |

Spacing is the weak link: two-thirds of all margins and padding are typed by hand (`1.25rem`, `0.75rem`, `3px`…) instead of using the scale. **This is the single biggest reason pages feel slightly "off" from each other** — every page improvises its own rhythm. (This is exactly the whitespace problem you flagged on commissions last week, but site-wide.)

---

## LAYER 2 — THE BUILDING BLOCKS (this is the mess)

Here is the real inventory. The pattern is the same everywhere: **a handful of real block types, each built many times instead of once.**

### Product / artwork cards — the worst offender
**~19 separate card builds** across the site for what should be **4 card types.** No shared card component exists; almost every page re-implements its own. Concretely they collapse to four real jobs:

| The real card type | Should be | Reality |
|---|---|---|
| Product card (shop item + price) | 1 component | Built ~6 times (home, shop, search, saved, collection, cross-sell), each slightly different |
| Artwork card (original work) | 1 component | Built ~5 times (fine-art grid, archive, works-related, blog-related, originals cross-sell) |
| Editorial / post card (journal) | 1 component | Built 3 times, 3 different image shapes (4:3, 4:3, 16:9) |
| Series / collection card | 1 component | Built 2 ways |

The tells that prove these are accidental copies, not intentional variety:
- **The same product is cropped differently depending on the page** — `cover` (fills, crops the art) on shop, `contain` (whole image) on saved/recently-viewed.
- **Aspect ratios fragment** — 4:5 here, 1:1 there, 3:4 elsewhere, for the same content.
- **Hover behaviour is random** — some cards lift, some fade, some zoom, some do nothing.
- **The "heart/save" button appears on some card copies and not others.**

### Section headings — built 10 times
The "small label + big heading + optional subtitle + grid" pattern — the most common structure on the site — is **re-coded from scratch on 10 different sections**, each with its own names. It should be **one block.**

### Everything else
| Block | Real production count | Should be | Note |
|---|---|---|---|
| Hero banners | **5** (home video, fine-art, commissions, about, journal) | 2 (image hero + text hero) | Each hand-built; same title styling re-typed each time |
| Image galleries | **2** whole separate components | 1 | `ImageGallery` (shop) vs `WorksGallery` (art) do the same job two ways |
| Breadcrumb | **2** (and in different positions — top on shop, bottom on artwork) | 1 | Inline markup, never a component |
| Buttons / CTAs | **8+** different classes | 2–3 (primary, secondary, text link) | No button component exists at all |
| Image strips / "two-up" blocks | **5** | 1–2 | lifestyle, BTS, process, etc. — all bespoke |
| Carousel / slideshow | 1 ✅ | 1 | `CollectionSlideshow` — actually shared, good |
| Newsletter | 1 ✅ | 1 | `NewsletterSignup` — shared, good |

**Components that are genuinely reused across the site: only 3** — newsletter, slideshow, shopping-nudge. Everything else is copy-paste.

---

## LAYER 3 — THE PAGES (8 hand-built templates, no shared skeleton)

There are **8 distinct page templates**, and none of them share a skeleton — each page hard-codes its own widths, spacing, and section order:

1. Shop product detail · 2. Original artwork detail · 3. Hero + multi-section (about, commissions) · 4. Two-column form (contact) · 5. Info + anchor nav (practical) · 6. Filter + grid (archive) · 7. Centred success (order-confirmed) · 8. Bare prose (legal).

Even the page width is improvised: `700px`, `780px`, `1100px`, `1200px`, `520px` — five different "max widths" with no rule. There should be three named widths (prose / wide / full) and nothing else.

**Plus a hidden liability:** there are 3 orphaned "preview" pages (`/preview-a`, `/preview-b`, `/preview-c`) — full alternate design experiments (magazine, poster, minimal), hidden from search and not linked anywhere. They're not hurting users, but they're confusing dead weight and a decision you never closed. **Pick one direction or delete them.**

---

## THE GELATO LAYER — what you actually receive, and who controls the background

You asked the sharpest question: *what do we get from Gelato for the cards, does it differ per product type, what background, and is that set by us or by the template?* I pulled the real mockups for every product type and looked at them. Here's the truth.

### The boundary — this is the key fact
**The card frame is yours. The picture inside it is Gelato's, baked into a flat photo.**
- The mockups arrive as **opaque JPEGs with no transparency.** There is no "empty" background you can swap — the backdrop is fixed pixels.
- **In code you control only three things:** the card's background colour (currently white), whether the image is **cropped** to fill or **letterboxed** to fit, and the card's shape (4:5 or 1:1).
- **To change the actual scene behind a product — the white sweep behind a mug, the wood under a print — you must change the Gelato template. CSS cannot.**

### What Gelato actually delivers falls into TWO genres
This is the root of why the shop grid looks unsettled — you're mixing two fundamentally different kinds of picture in one grid:

**Genre A — "the artwork itself" (flat, edge-to-edge):**
| Type | What the image is | Background |
|---|---|---|
| Art print | the flat art on pale paper | near-white paper texture |
| Postcard | the flat art, **full-bleed to all 4 edges** | none — art fills everything |
| Greeting card | the flat art with a thin white margin | white card |
| Wood print | the flat art printed on birch | **warm wood grain** |

**Genre B — "the object, photographed on white":**
| Type | What the image is | Background |
|---|---|---|
| Framed print | the framed object + realistic drop shadow | pure white |
| Mug | the mug (art cropped off the edge) | pure white |
| Tote bag | the canvas bag (tall/portrait) | pure white |
| Tank top | the **white** garment, flat | pure white → **white-on-white, barely visible** |
| Water bottle | the **white** bottle, tall | pure white → **white-on-white, lots of empty space** |

### What this means
1. **The inconsistency is half upstream, half yours.** The *genre difference* (flat art vs object-on-white, wood vs paper vs white) is baked into Gelato and can only be fixed by choosing/standardising mockup scenes in Gelato. The *crop, shape, and card background* are yours in code.
2. **Your white card background is mostly the right call** — it's seamless behind all the Genre-B "object on white" mockups. But it **fails for white-on-white products** (tank top, water bottle vanish) and it **fights the wood print and full-bleed postcards** (which bring their own non-white surface).
3. **Dimensions differ but less than you'd fear:** most are square 2048×2048; totes are tall; postcards landscape or portrait; **greeting cards arrive at half resolution (~1000px)** — they'll look softer than everything else.
4. **Actionable upstream:** the biggest single win Gelato-side is fixing the white-on-white products (a different mockup scene, or a faint card background/border behind them) and deciding whether paper-goods show full-bleed art or a product shot — right now it's mixed.

---

## WHAT EXISTS NOW → WHAT IT SHOULD BE (the consolidation, in one table)

| Block | Now | Target |
|---|---|---|
| Product/artwork cards | ~19 builds | **4 components** |
| Section headings | 10 builds | **1** |
| Heroes (production) | 5 | **2** |
| Galleries | 2 components | **1** |
| Breadcrumb | 2 inline | **1** |
| Buttons | 8+ classes | **2–3** |
| Page max-widths | 5 ad-hoc | **3 named** |
| Spacing | 35% on-system | **~95% on-system** |
| Preview pages | 3 orphans | **0–1 (decide)** |
| Written design doc | obsolete, wrong values | **1 accurate source of truth** |

---

## RECOMMENDATION — the order to fix it

Don't redesign. **Consolidate.** The visual language is mostly fine; the problem is that it's built many times. The sequence that gives the most calm for the least risk:

1. **Rewrite the design doc to match reality** (half a day) — kill the misleading one. One accurate source of truth, in this language, not CSS.
2. **Standardise spacing onto the scale** — biggest visual-calm win, lowest risk. This alone fixes most of the "every page feels slightly different" feeling.
3. **Build the 4 real card components and the 1 section-heading block**, then replace the ~29 hand-built copies with them. After this the grids finally look like a set.
4. **Unify the 2 galleries and the breadcrumb; introduce a real button.**
5. **Gelato-side:** fix white-on-white products and decide the paper-goods rule (flat art vs product shot). This is the only part you can't do in code alone.
6. **Close the preview-page decision.**

If you want, my recommended next step is **#1 — I write the single accurate design-system doc** (the honest replacement for the broken one), structured exactly like this, so we have a real reference before any building starts. Say the word and I'll draft it for your review.

---
*Evidence: full code inventory of 24 routes / ~40 components / 49 stylesheets, plus live Gelato mockups pulled per product type. Method per Brad Frost, [Interface Inventory](https://bradfrost.com/blog/post/interface-inventory/) + [Atomic Design](https://atomicdesign.bradfrost.com/).*
