# Day In Day In — Design System
*The single source of truth. Values here match the real code (`app/globals.css`) as of 2026-06-29.*
*Companion: `DESIGN_AUDIT.md` documents where the live site currently diverges from this. This file is where it's heading.*

---

## HOW TO READ THIS

Three layers, simplest to most assembled — fix the lower layers and the upper ones improve for free:

1. **Raw materials** — colour, type, spacing. The fixed vocabulary everything is made from.
2. **Building blocks** — buttons, cards, headings, heroes. A *small, closed* set. If a screen needs something not in this set, that's a design decision to make here first — not a new one-off.
3. **Pages** — blocks arranged into templates.

**Status legend** (so it's honest about reality):
- ✅ **Canonical & built** — exists once, use it as-is.
- 🔧 **Canonical target, not yet consolidated** — this is the agreed shape, but the code still has multiple hand-built copies to merge into it. See `DESIGN_AUDIT.md`.

**The golden rule:** one job → one block → one place in the code. Before building anything, check if the block already exists. We do not ship a sixth product card.

---

## BRAND PRINCIPLES

- **Art first.** The work is the product. UI recedes; art leads.
- **Remove until it hurts, then stop.**
- **Mobile-first.** The phone is where discovery happens.
- **No ads, no algorithmic feeling, no dark patterns.**
- **Warm confidence** — not intimidating, not soft.

---

## THE FIXED SPINE (global chrome — consistent everywhere, do not fork)

| Element | Component | Rule |
|---|---|---|
| Header / navigation | `Nav` | ✅ One. Sticky, height `--nav-h` (56px). Logo left, links centre, currency + cart right. Mobile = hamburger → side drawer. |
| Footer | `Footer` | ✅ One. Identical on every route. |
| Cart drawer | `CartDrawer` | ✅ One. Slide-out right. |
| Cookie banner / analytics / scroll-to-top | — | ✅ Global, set once in the root layout. |

> Note: there is **no** mobile bottom tab bar. (An earlier draft of this doc described one; it was never built. Mobile nav is the hamburger drawer.)

---

## LAYER 1 — RAW MATERIALS

### Colour

The real palette (token → value → role). **Never type a hex value in a component — always use the token.**

| Token | Value | Name | Use for |
|---|---|---|---|
| `--c-bg` | `#F0EBE3` | Warm Chalk | Page background |
| `--c-white` | `#FFFFFF` | White | Card interiors, product-image backgrounds |
| `--c-text` | `#1A1714` | Ink | All body copy and headings |
| `--c-muted` | `#7A746F` | Stone | Labels, metadata, secondary text |
| `--c-surface` | `#E8E1D6` | Linen | Section backgrounds that need gentle separation (not cards) |
| `--c-border` | `#E2D8CE` | — | Hairlines, dividers, input borders |
| `--c-accent` | `#D94F2C` | Vermillion | **Primary CTA only.** Add-to-cart, send enquiry, send brief. |
| `--c-accent-2` | `#2E5D4B` | Forest | Secondary accent, "in stock" / positive states |
| `--c-accent-light` | `#FCE8E2` | Blush | Tint backgrounds behind accent content |
| `--c-studio` | `#1D2218` | Studio Dark | Dark editorial panels (richer than black) |
| `--c-parchment` | `#F5EDE4` | Parchment | Light warm paper sections |
| `--c-ochre` | `#C4902A` | Ochre | Sparingly — drawn from the Neko artworks |

**Rules.** Vermillion is for primary action only — never decorative, never navy. Cards are `--c-white`, never `--c-surface` or `--c-bg`. New colours don't get used until they're added to this table.

### Typography

Two families, fixed:
- **`--font-display`** — Playfair Display (serif). Page titles, section headings, product/work names, editorial pull-quotes.
- **`--font-body`** — Inter (sans). Everything else: body, labels, buttons, prices, nav.

Type scale (token → rem → ≈px → role):

| Token | rem | ≈px | Role |
|---|---|---|---|
| `--text-xs` | 0.6875 | 11 | Micro labels, badges |
| `--text-sm` | 0.8125 | 13 | Category labels, metadata, prices |
| `--text-base` | 1 | 16 | Body copy |
| `--text-lg` | 1.125 | 18 | Lead paragraphs |
| `--text-xl` | 1.25 | 20 | Card titles, sub-headings |
| `--text-2xl` | 1.5 | 24 | H3 |
| `--text-3xl` | 2 | 32 | H2 section titles |
| `--text-4xl` | 2.75 | 44 | H1 page titles |
| `--text-5xl` | 4 | 64 | Hero headlines |
| `--text-6xl` | 6 | 96 | Oversized display (rare) |

**Hierarchy rules.** One H1 per page. Section titles (H2) heavier than card titles. Never skip levels. Font sizes come from this scale — no hand-typed `rem`/`px`.

### Spacing

One scale. The base step is 4px; the scale is **non-linear by design** (note the gaps — there is no `sp-7`, `sp-9`, etc.).

| Token | rem | ≈px | Use for |
|---|---|---|---|
| `--sp-1` | 0.25 | 4 | Micro gaps |
| `--sp-2` | 0.5 | 8 | Tight within-element |
| `--sp-3` | 0.75 | 12 | Default element padding |
| `--sp-4` | 1 | 16 | Standard component spacing |
| `--sp-5` | 1.5 | 24 | Card padding, sub-spacing |
| `--sp-6` | 2 | 32 | Medium gaps |
| `--sp-8` | 3 | 48 | Between related sections |
| `--sp-10` | 4 | 64 | Section spacing |
| `--sp-12` | 5 | 80 | Distinct section breaks |
| `--sp-16` | 7 | 112 | Major page breaks |

**The rule that matters most:** *all* margin and padding comes from this scale. No hand-typed spacing. (This is currently the system's weakest point — only ~35% of spacing is on-scale today. Bringing it to ~95% is the single biggest calm-the-site win.)

### Layout, radius, motion

| Token | Value | Use |
|---|---|---|
| `--max-w` | 1440px | Outer page max width |
| `--nav-h` | 56px | Header height (sticky offsets reference this) |
| `--r-sm` / `--r-md` | 4px / 8px | Corner radius (small / card) |
| `--t-fast` / `--t-base` | 150ms / 250ms | Transitions, with `--ease` |

**Page-width tokens — 🔧 target.** Pages currently improvise five different max-widths (520/700/780/1100/1200px). Replace with **three named widths** and use nothing else:
- `--w-prose` ≈ 700px (legal, practical, single-column reading)
- `--w-wide` ≈ 1100px (about, commissions, editorial)
- `--w-full` ≈ 1280–1440px (shop grid, galleries)

---

## LAYER 2 — THE BUILDING BLOCKS (the closed set)

### Buttons 🔧
Three styles, no more. (Today there are 8+ ad-hoc button classes — consolidate to these.)
- **Primary** — `--c-accent` fill, white text, Inter semibold, uppercase, small letter-spacing, near-square corners. For: add to cart, send enquiry, send brief, browse shop.
- **Secondary** — transparent, 1.5px `--c-text` border, ink text. For: back, see originals, secondary actions.
- **Text link** — `--c-accent`, underline on hover; arrow (→) form for "view all" / nav hints.

### Cards — exactly four 🔧
One component per job. (Today ~19 hand-built copies — see audit.) Each card = white interior, image area on top, title/meta below, consistent hover (subtle lift).

| Card | For | Image area | Notes |
|---|---|---|---|
| **Product card** | Shop items (Gelato) | **one 4:5 box, `contain`, never crop** (locked 2026-06-29) | title · type · price · save (heart). CTA is **always "View product →"** — never "Add to cart", regardless of whether the product page offers a choice. Every format uses the same box; non-portrait mockups get even gutters in the card background. |
| **Artwork card** | Original works | 3:4, art fills | title · year · optional SOLD badge · enquire-on-hover |
| **Editorial card** | Journal / posts | 3:2 | date · title · excerpt |
| **Series card** | Collections / series | 3:4 | label · count |

**Consistency rules across all cards:** one hover behaviour (subtle shadow lift — not zoom on some, fade on others). One crop rule per card type (don't mix `cover` and `contain` for the same content across pages).

### Section heading 🔧
The "small label + H2 + optional subtitle + optional 'view all →'" pattern. **One block.** (Today rebuilt 10 times.) Every grid/section on the site opens with this.

### Heroes — two 🔧
- **Image hero** — full-bleed image/video, gradient overlay, headline + sub + CTA bottom-left. (Home.)
- **Text hero** — centred label + H1 + sub, no image; optional badge/stat row. (Fine-art, commissions, about, journal.)

That's it. Five hand-built heroes collapse into these two.

### Galleries — one 🔧
Currently two separate components (`ImageGallery` for shop, `WorksGallery` for art). Merge into **one** configurable gallery: main image + thumbnails + lightbox, with a "flat grid" mode for artworks. Lightbox: full-screen, `contain`, keyboard ← → Esc, focus ring in `--c-accent`.

### Breadcrumb — one 🔧
One component, **always at the top** of detail pages (today it's top on shop, bottom on artwork — pick top). Format: Section / Subcategory / Current. `--text-sm`, `--c-muted`.

### Already shared — leave alone ✅
- **Carousel** (`CollectionSlideshow`) — the one carousel. Auto-rotate, opacity fade.
- **Newsletter** (`NewsletterSignup`) — one block, surface background.
- **Shopping nudge** (`ShoppingNudge`).

---

## LAYER 3 — PAGE TEMPLATES

Eight templates. Each is just the blocks above, arranged. Use the three width tokens; never a fourth.

| Template | Pages | Width | Shape |
|---|---|---|---|
| **A — Shop / PLP** | /shop, /search, collections | full | Text hero + filters + product-card grid |
| **B — Product detail** | /shop/[handle] | full | Gallery (left) + sticky info/variants/ATC (right) + cross-sells |
| **C — Artwork detail** | /works/[slug] | wide | Image hero + info grid + gallery + related |
| **D — Editorial/landing** | / (home) | full | Image hero + sections, links out to shop |
| **E — Journal** | /art-journal, /blog/[slug] | wide/prose | Featured + editorial-card grid; post = header → image → body → share → newsletter |
| **F — Utility/prose** | /about, /commissions, /contact, /practical | wide/prose | Text hero + sections + end CTA |
| **G — Confirmation** | /order-confirmed | prose | Centred success + timeline |
| **H — Legal** | /legal/* | prose | Bare prose, shared styles |

> Decision still open: `/preview-a`, `/preview-b`, `/preview-c` are three orphaned alternate-design experiments (hidden from search, unlinked). **Pick one direction to fold in, or delete all three.** They are not part of this system until that's decided.

---

## THE GELATO IMAGE SYSTEM (read before touching product cards)

Product-card images are **Gelato mockups** synced through Shopify. This section is the contract.

### The boundary — who controls what
- Mockups arrive as **opaque JPEGs, no transparency.** The backdrop is baked-in pixels.
- **In code you control only:** the card background colour and the card's box (now locked: one 4:5 box, `contain`, never crop).
- **The scene/background inside the photo is Gelato's.** To change the grey behind a poster sheet or the white behind a mug, you change the **Gelato template** — CSS cannot.

### The on-site card rule (locked 2026-06-29)
One **4:5 box, `contain`, never crop**, white card background, for every format. This makes every card's framing and chrome identical regardless of product. The remaining visual variance lives **inside** the mockup image and is a Gelato problem (below). We do NOT crop the art to hide it.

### Why the grid still won't read as a set until Gelato is fixed — two root causes
1. **Two mockup-background families.** Art prints & posters render as a **sheet on light grey**; framed/mug/tote/tank/bottle render on **white**. Side by side, grey-sheet + white-product never cohere.
2. **The artwork's own background leaks through.** Proven 2026-06-29 with two posters: *Neko — Pink* (line-art on **white**) reads as a small airy sheet; *Neko Paw — Pink* (full-bleed **teal**) reads as a solid colour block — **same template, same 2048² size, different art background.** Not an A4/A3 issue, not a site issue.

### The Gelato standardisation needed (Sebastian's templates)
- **Standardise every mockup to ONE background** (recommend a warm white / `--c-parchment`). This is the single highest-leverage fix — it makes the grid cohere no matter the artwork.
- **White-on-white products** (tank top, water bottle): the white garment/bottle on white vanishes. Needs either a faint mockup backdrop tint or a hairline in the card.
- **Pick one "flat art" presentation:** postcards bleed full, greeting cards show a white margin, art prints show paper, posters show a grey sheet. One rule.
- **Greeting cards** arrive at ~half resolution — softer than everything else; re-render larger if possible.

---

## WHAT'S NON-CONFORMANT TODAY

This file is the target. The live site diverges — fully catalogued in `DESIGN_AUDIT.md`. Headline gaps:
- Spacing only ~35% on-scale (target ~95%).
- ~19 product/artwork card builds → consolidate to 4.
- Section heading rebuilt 10× → 1.
- 5 heroes → 2; 2 galleries → 1; 2 breadcrumbs → 1; 8+ buttons → 3.
- 5 ad-hoc page widths → 3 tokens.

---

## CHANGE RULE

Living document. **Update this file the moment a design decision is locked** — a new token, a consolidated block, a Gelato presentation rule. If a screen needs something not described here, the decision is made *here first*, then built. The doc leads; the code follows. (The previous version drifted out of sync and became misleading — that must not recur.)
