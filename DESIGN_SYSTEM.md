# Day In Day In — Design System
*dayindayin-site · Last updated: 2026-06-20*

---

## Guiding Principle

The site has two distinct modes: **Portfolio** (Fine Art, Works) and **Shop** (products, commissions). Portfolio mode is immersive — art fills the screen, words step back. Shop mode is functional — clarity and speed. The design system must serve both without collapsing into either.

Remove until it hurts, then stop.

---

## 1. Hierarchy

Every page is structured as:

```
PAGE
└── SECTION (border-top separates sections)
    └── ELEMENT (heading, grid, image block)
        └── SUB-ELEMENT (card, accordion row)
            └── ATOM (button, badge, label, icon, price)
```

**Rule:** Nothing should be both a section separator AND a section opener. One border per gap, always on the TOP of the incoming section (never `border-bottom` on the outgoing one). Violation = double lines.

---

## 2. Colour

All colours live in `app/globals.css` as CSS custom properties.

| Token | Hex | Role |
|---|---|---|
| `--c-bg` | `#F0EBE3` | Page background — warm off-white |
| `--c-white` | `#FFFFFF` | Card/surface white (shop cards) |
| `--c-text` | `#1A1714` | Primary text — near-black |
| `--c-muted` | `#7A746F` | Secondary text, labels, meta |
| `--c-surface` | `#E8E1D6` | Card surfaces, section fills |
| `--c-border` | `#E2D8CE` | All borders, dividers |
| `--c-accent` | `#D94F2C` | Vermillion — primary CTA, accent lines |
| `--c-accent-2` | `#2E5D4B` | Forest green — success state (cart added) |
| `--c-accent-light` | `#FCE8E2` | Accent tint — backgrounds behind accent text |
| `--c-studio` | `#1D2218` | Deep studio dark — hover overlays on art |
| `--c-parchment` | `#F5EDE4` | Warm paper — pull quotes, feature blocks |
| `--c-ochre` | `#C4902A` | Warm gold — milestone years, highlights |

**Rules:**
- Primary body text: always `--c-text` on `--c-bg`
- Small text (< `--text-xs`): use `--c-text` not `--c-muted` — WCAG AA fails at small sizes with muted
- Accent (`--c-accent`) reserved for: primary CTA buttons, accent border lines (2px solid on pull-quotes), active states, sale prices
- Never use raw hex values in component CSS — always reference a `--c-*` token

---

## 3. Typography

Two typefaces. No others.

| Font | Token | Usage |
|---|---|---|
| Playfair Display | `var(--font-display)` | Display headings (h1, h2 hero), pull-quotes, price display |
| Inter | `var(--font-body)` | Everything else |

### Type Scale

| Token | Size | Usage |
|---|---|---|
| `--text-xs` | 0.6875rem (11px) | Labels, badges, meta, captions |
| `--text-sm` | 0.8125rem (13px) | Body small, card titles, nav links |
| `--text-base` | 1rem (16px) | Body copy |
| `--text-lg` | 1.125rem (18px) | Emphasis paragraphs |
| `--text-xl` | 1.25rem (20px) | Sub-headings |
| `--text-2xl` | 1.5rem (24px) | Section h2, card display headings |
| `--text-3xl` | 2rem (32px) | Page sub-headings |
| `--text-4xl` | 2.75rem (44px) | Page h1 (responsive, use clamp) |
| `--text-5xl` | 4rem (64px) | Hero h1 desktop |
| `--text-6xl` | 6rem (96px) | Reserved for full-bleed hero moments only |

**Rules:**
- All display (Playfair) headings: `font-weight: 700`, `letter-spacing: -0.02em` to `-0.03em`
- All uppercase labels: `font-weight: 600 or 700`, `letter-spacing: 0.10em to 0.14em`, `font-size: --text-xs`
- Body copy: `font-weight: 300` (light) at `--text-base` or `--text-sm`, `line-height: 1.7 to 1.9`
- Never use raw `rem`/`px` values in component CSS — always use a `--text-*` token
- Exception: `clamp()` for hero h1 is acceptable, e.g. `clamp(2.5rem, 6vw, 4.5rem)`

---

## 4. Spacing

The spacing scale is geometric (not linear). Rule: each step up = meaningful visual step.

| Token | Value | Used for |
|---|---|---|
| `--sp-1` | 0.25rem | Icon gap, tiny padding adjustments |
| `--sp-2` | 0.5rem | Gap between label + value pairs |
| `--sp-3` | 0.75rem | Card inner padding, tight spacing |
| `--sp-4` | 1rem | Button padding, form field gap |
| `--sp-5` | 1.5rem | Card gap in grids, section element spacing |
| `--sp-6` | 2rem | Page horizontal padding (mobile: `--sp-5`) |
| `--sp-8` | 3rem | Section padding-top/bottom |
| `--sp-10` | 4rem | Large section gaps |
| `--sp-12` | 5rem | Major section separation |
| `--sp-16` | 7rem | Page bottom padding |

**Rules:**
- Section vertical gap (between two page sections): `var(--sp-10)` to `var(--sp-12)`
- Section internal padding: `var(--sp-8)` top/bottom
- Grid gap: `var(--sp-4)` to `var(--sp-5)` desktop, `var(--sp-3)` mobile
- Never use raw values in CSS — always reference a `--sp-*` token
- Exception: `3px` gap between mosaic tiles (intentional very-tight gap for editorial grids)

---

## 5. Layout & Containers

| Context | Max Width |
|---|---|
| Shop / Fine Art page | 1200px |
| Editorial pages (about, commissions, contact) | 760px to 780px |
| PDP (product detail) | 1100px |
| Blog / journal | 680px |

**Page padding:** `var(--sp-6)` horizontal on desktop, `var(--sp-5)` on mobile.
**Breakpoints:**
- Mobile: `max-width: 768px` (primary)
- Mid: `max-width: 1024px` (3-col → 2-col grid adjustments)
- Narrow: `max-width: 640px` (price cards, category tiles → single col)

---

## 6. Grid Systems

### Shop product grid
- Desktop: `repeat(4, 1fr)` — 4 columns
- Mid (≤1024px): `repeat(3, 1fr)` — 3 columns
- Mobile: `repeat(2, 1fr)` — 2 columns
- Gap: `var(--sp-5)` desktop, `var(--sp-3)` mobile

### Fine Art grid
- Desktop: `repeat(3, 1fr)` — 3 columns (larger images)
- Mobile: `repeat(2, 1fr)`
- Gap: `var(--sp-5)` desktop, `var(--sp-3)` mobile

### Featured editorial mosaic (fine-art hero)
- Desktop: `2fr 1fr` — large work left, 3 stacked right
- Mobile: single column hero, then 3-col row below
- Tile gap: `3px` (editorial seam, not a spacing token)

### Medium / category grid
- Desktop: `repeat(4, 1fr)` or `repeat(3, 1fr)` depending on context
- Mobile: `repeat(2, 1fr)`

### Price / commission cards
- Desktop: `repeat(3, 1fr)`
- Mobile: `1fr` (stack)

---

## 7. Section Separators

One rule: **`border-top` on the incoming section only.**

```css
/* CORRECT */
.sectionB {
  padding-top: var(--sp-8);
  border-top: 1px solid var(--c-border);
}

/* WRONG — causes double line */
.sectionA { border-bottom: 1px solid var(--c-border); }
.sectionB { border-top: 1px solid var(--c-border); }
```

**When to use a 2px accent border instead of 1px border:** only on the artist pull-quote (`.statement`) — the 2px terracotta top edge marks an editorial moment. Nowhere else.

**What governs vertical space between sections?** The `.section` component's `margin-bottom: var(--sp-12)` + `border-top: 1px solid var(--c-border)` on the next section. The section itself owns its top boundary, not the element above it.

---

## 8. Image Treatment

Two rules cover all product images:

| Product type | Behaviour | CSS |
|---|---|---|
| Artwork (prints, postcards, greeting cards, photo prints) | Fill the container completely | `object-fit: cover` |
| Mockup (apparel, mugs, totes, bags) | Show full product, contained | `object-fit: contain` |

Classification: `isArtworkProduct()` in `lib/shopify/products.ts` using the `ARTWORK_LABELS` Set.

**Fine art cards:** always `object-fit: cover`, `aspect-ratio: 1` (square crop in grid, portrait in featured mosaic).

**PDP (product detail):** dynamic `aspect-ratio` from Shopify image `width/height` dimensions — not a fixed ratio. Prevents letterboxing on landscape/square Gelato mockups.

**Portfolio (works pages):** `object-fit: cover`, natural aspect ratio from the work's source image.

**Card image backgrounds:**
- Shop cards: `background: #fff` (pure white — contrast against `--c-bg`)
- Fine art cards: `background: var(--c-surface)` (warm linen surface)

---

## 9. Atoms

### Buttons

**Primary CTA**
```
background: var(--c-accent)
color: white
padding: var(--sp-4) var(--sp-8)
font-size: var(--text-sm)
font-weight: 600
letter-spacing: 0.08em to 0.12em
text-transform: uppercase
hover: opacity 0.88 OR background: #c03a20 (darker accent)
```

**Secondary / Outline**
```
background: transparent
border: 1px solid var(--c-border)
color: var(--c-text)
Same padding/type as primary
hover: border-color: var(--c-text)
```

**Quick Add (card hover)**
```
position: absolute, bottom 0.75rem, inset horizontal 0.75rem
background: rgba(0,0,0,0.72) with backdrop-filter: blur(4px)
color: white
font-size: var(--text-xs) or 0.7rem
opacity: 0 → 1 on card hover
On touch (hover: none): opacity 1, full width, no border-radius
```

**Ghost / text link**
```
color: var(--c-muted)
hover: color: var(--c-text) or var(--c-accent)
No background, no border
```

### Badges & Labels

**Badge (New / Sale)**
```
position: absolute, top: var(--sp-2), left: var(--sp-2)
font-size: var(--text-xs)
font-weight: 600
letter-spacing: 0.08em
text-transform: uppercase
padding: 0.2rem 0.5rem
background: var(--c-accent) (or green for sale)
color: white
```

**Status badge (commissions open)**
```
display: inline-flex
border-radius: 999px
background: #EBF7F0
border: 1px solid #B8E0C8
color: #2E7D52
animated dot inside
```

**Uppercase label (section intro)**
```
font-size: var(--text-xs)
font-weight: 600 or 700
letter-spacing: 0.12em to 0.14em
text-transform: uppercase
color: var(--c-muted)
display: block
margin-bottom: var(--sp-3)
```

### Accordion

```
toggle: ghost button, --text-sm, color: --c-muted → --c-text on hover
expand: grid-template-rows: 0fr → 1fr, 200ms ease
use CSS grid trick (NOT height animation, NOT max-height) for smooth expand
```

---

## 10. Component Molecules

### Shop Card
```
[ image container: aspect-ratio 4/5, white bg ]
  [ Quick Add button: absolute, revealed on hover ]
  [ Badge: absolute top-left ]
[ card body: padding-top --sp-3 ]
  [ category label: --text-xs, --c-muted, uppercase ]
  [ title: --text-sm, weight 600 ]
  [ price: --text-sm, weight 600 ]
```
Card image: cover for artwork, contain for mockups.

### Fine Art Card
```
[ image container: aspect-ratio 1, --c-surface bg ]
  [ overlay: rgba(studio, 0.42) on hover ]
  [ "View work →": absolute bottom-left, revealed on hover ]
[ card body: padding-top --sp-3 ]
  [ title (left) + year (right): flex space-between ]
```

### PDP Layout (2-column desktop)
```
Left (55%): ImageGallery
Right (45%): Info panel
  1. Type label (breadcrumb context)
  2. h1 (product title)
  3. Price (SelectedPrice component)
  4. Specs row (single-variant products only)
  5. Description
  6. Variant picker + ATC button (ProductOptions)
  7. Trust block (delivery estimate + Gelato credit)
  8. Shipping & Returns accordion
  9. Artist link
  10. Share buttons
```

---

## 11. Desktop vs Mobile Rulesets

### Desktop (> 768px)
- Full horizontal nav at top
- 3–4 col grids
- PDP: 2-col (image left, info right)
- Fine art featured: 2fr/1fr mosaic
- Page padding: `var(--sp-6)` horizontal
- Hero type: full scale (`clamp` resolves to max)

### Mobile (≤ 768px)
- Bottom tab bar (Home / Shop / Artist / Cart) — `height: 60px`
- `main` has `padding-bottom: 60px + safe-area-inset`
- 2-col grids (shop), 2-col grids (fine art)
- PDP: stacked (image on top, info below)
- Featured mosaic: single hero image + 3-col secondary row
- Page padding: `var(--sp-5)` horizontal
- Touch devices: Quick Add button always visible (no hover required)
- Font sizes: reduce 1 scale step for display headings

### What changes between desktop and mobile
- Layout: multi-col → stacked/2-col
- Navigation: top header → bottom tab bar
- Hover states → touch-always-visible states (Quick Add, overlays)
- Section gaps: `var(--sp-12)` → `var(--sp-8)` typically

### What stays the same
- Color tokens (no dark mode)
- Type scale tokens (sizes stay, layout reflows)
- Border weight (always 1px `--c-border`)
- Button sizes (same padding — mobile fingers need at least 44px tap target)

---

## 12. Prohibited Patterns

These have caused bugs. Do not use.

| ❌ Don't | ✅ Do instead |
|---|---|
| `border-bottom` + `border-top` between sections | `border-top` on incoming section only |
| Raw hex in component CSS (`#555`, `#888`) | `var(--c-muted)` or `var(--c-text)` |
| Raw rem/px in component CSS (`0.85rem`, `14px`) | `var(--text-sm)`, `var(--text-xs)` |
| Raw spacing in CSS (`margin: 24px`) | `var(--sp-6)` |
| `max-height` animation for accordions | CSS grid `grid-template-rows: 0fr → 1fr` |
| Fixed `aspect-ratio` on PDP images | Dynamic from Shopify image dimensions |
| Single `objectFit: contain` for all cards | `isArtworkProduct()` → cover/contain |
| `NewsletterSignup` on Fine Art or Commissions | Standalone on /shop only |
| Stats/number blocks on portfolio pages | Let the art speak |

---

## 13. SEO / Structured Data Pattern

Every page includes JSON-LD in a `<script type="application/ld+json">` tag.

- Home: `WebSite` + `WebPage`
- Shop: `ItemList` of products
- PDP: `Product` with `offers`, `brand`, `image`
- Fine Art: `ArtGallery` + `ItemList` + `BreadcrumbList`
- About: `Person` + `Organization`
- Works (individual): `VisualArtwork`

Do not add more schema types without a specific SEO reason.
