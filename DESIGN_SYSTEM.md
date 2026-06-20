# Day In Day In — Design System
*Living document. Update whenever a design decision is made and locked.*
*Last updated: 2026-06-20*

---

## BRAND PRINCIPLES

- Art first. The work is the product. UI recedes; art leads.
- Remove until it hurts, then stop.
- Mobile-first. The phone is where discovery happens.
- No ads, no algorithmic feeling, no dark patterns.
- Warm confidence — not intimidating, not soft.

---

## COLOR PALETTE

### Core tokens (defined in `app/globals.css` as CSS custom properties)

| Token | Hex | Usage |
|-------|-----|-------|
| `--c-bg` | `#F8F7F4` | Page background — Chalk |
| `--c-text` | `#2C3440` | Primary text — Slate |
| `--c-accent` | `#C4694F` | CTAs, active states, links — Terracotta |
| `--c-muted` | `#9A9590` | Secondary text, labels — Stone |
| `--c-muted-strong` | `#6E6A65` | Small text (WCAG AA on Chalk) |
| `--c-surface` | `#F0EDE8` | Cards, surfaces — Linen |
| `--c-success` | `#5C8C6E` | Saved/wishlist states — Sage |

### White rule
**Product card info areas, image containers, Recently Viewed cards = `#FFFFFF` (pure white).**
Cards must visually separate from the Chalk page background. Never use `--c-surface` or `--c-bg` as a card background.

### Color usage rules
- `--c-accent` (Terracotta) = primary CTA buttons ONLY. Sticky bars, add-to-cart, "Send enquiry" — all terracotta. Never navy, never dark.
- `--c-text` (Slate) = all body copy and headings
- `--c-muted` = category labels, secondary metadata
- `--c-surface` = section backgrounds that need subtle differentiation (not cards)
- Never introduce new colors without updating this doc

---

## TYPOGRAPHY

### Typefaces
- **Display/Brand:** Playfair Display — serif. Used for: H1, H2 section titles, editorial headings, product names on PDPs, hero headlines.
- **UI/Body:** Inter — clean sans. Used for: body copy, labels, navigation, buttons, metadata, prices.

### Type scale (CSS custom properties in globals.css)

| Token | Size | Usage |
|-------|------|-------|
| `--text-xs` | 11px | Micro labels, badges |
| `--text-sm` | 13px | Category labels, metadata |
| `--text-base` | 15px | Body copy |
| `--text-md` | 17px | Lead paragraphs |
| `--text-lg` | 20px | Section intros |
| `--text-xl` | 24px | H3, sub-headings |
| `--text-2xl` | 32px | H2 section titles |
| `--text-3xl` | 44px | H1 page titles |
| `--text-hero` | 56–72px | Hero headlines (fluid) |

### Heading hierarchy rules
- H1: One per page. Playfair Display. Large. The page identity.
- H2: Section titles. Playfair Display. Consistent size across the page.
- H3: Sub-section or card titles. Inter semibold or Playfair Display italic.
- **Never skip levels.** H1 → H2 → H3 only.
- **Section titles must be visually heavier than product/card titles.**

---

## SPACING SYSTEM

Base unit: 4px. All spacing is multiples of 4.

| Token | Value | Usage |
|-------|-------|-------|
| `--sp-1` | 4px | Micro gaps |
| `--sp-2` | 8px | Tight spacing within elements |
| `--sp-3` | 12px | Default element padding |
| `--sp-4` | 16px | Standard component spacing |
| `--sp-6` | 24px | Card padding, section sub-spacing |
| `--sp-8` | 32px | Medium section gaps |
| `--sp-12` | 48px | Large section gaps |
| `--sp-16` | 64px | Section-to-section spacing |
| `--sp-24` | 96px | Major page section breaks |

### Section separation rules
- Sections that belong together: `--sp-8` to `--sp-12` between them
- Distinct page sections: `--sp-16` to `--sp-24`
- Never use padding alone to separate sections — use whitespace + heading hierarchy together
- "Most important info first" — hero → product grid → series → editorial → newsletter. Never bury primary content.

---

## PRODUCT CARD — SPEC

```
┌─────────────────────────┐  ← border-radius: 8px (--radius-md)
│                         │  ← background: #FFFFFF
│    [IMAGE AREA]         │  ← variable height by product type (see below)
│    background: #FFFFFF  │
│                         │
├─────────────────────────┤
│  Product Title          │  ← Inter semibold 14px, --c-text
│  CATEGORY LABEL         │  ← Inter 11px uppercase, --c-muted
│  149 kr                 │  ← Inter 14px, --c-text
└─────────────────────────┘  ← background: #FFFFFF
```

**Card info section = always white (#FFFFFF). Never chalk, never linen.**

### Image area aspect ratios by product type
| Product type | Aspect ratio | objectFit | Notes |
|---|---|---|---|
| Art Print (portrait) | 3:4 | contain | White bg |
| Art Print (landscape) | 4:3 | contain | White bg |
| Poster (portrait) | 3:4 | contain | White bg |
| Postcard (landscape) | 3:2 | contain | White bg |
| Framed Print | 1:1 or 4:5 | contain | White bg — use taller ratio to show frame properly |
| Mug | 1:1 | contain | White bg |
| Tote Bag | 3:4 | contain | Natural bg matches product |
| Apparel (tank top) | 3:4 | contain | White bg |
| Greeting Card | 3:2 | contain | White bg |
| Wood Print | 1:1 | contain | White bg |
| Water Bottle | 1:2 | contain | White bg |
| Dad Cap | 4:3 | contain | White bg |

---

## BUTTONS

### Primary CTA
- Background: `--c-accent` (#C4694F Terracotta)
- Text: #FFFFFF, Inter semibold, 13px uppercase, letter-spacing 0.06em
- Padding: 14px 28px
- Border-radius: 2px (near-square, intentional)
- Hover: darken 8%
- **Use for: Add to cart, Send enquiry, Browse the shop, Send a brief**

### Secondary CTA
- Background: transparent
- Border: 1.5px solid `--c-text`
- Text: `--c-text`, same spec as primary
- **Use for: See originals, Back to home, secondary actions**

### Sticky add-to-cart bar
- Background: `--c-accent` (Terracotta) — NOT navy, NOT dark slate
- Text: #FFFFFF
- Product name: Inter regular 14px left-aligned
- Price + button: right-aligned

### Text links
- Color: `--c-accent`
- No underline at rest, underline on hover
- Arrow links (→): used for "view all", navigation hints

---

## ICONOGRAPHY

- Style: Geometric, minimal, 1.5px stroke weight
- Size: 16px (inline), 20px (standalone), 24px (feature)
- Color: inherits from context (`--c-text` or `--c-muted`)
- Source: Custom SVG inline (no icon library dependency)
- Icons in use: cart (bag), heart (wishlist), search, close (×), chevron (›), share, Pinterest, Instagram, truck (shipping)

---

## PAGE TEMPLATES

### Template A — Shop / PLP
- Hero text (H1 + count/meta) + filter bar
- Product grid (4 col desktop, 2 col mobile)
- No decorative imagery — product images do the work

### Template B — PDP (Gelato products)
- Image gallery (left) + info panel (right) on desktop, stacked on mobile
- Variant selectors (size, colour, format) — always visible, always interactive
- Specs table
- Description
- Format siblings strip ("Also as:")
- Sticky add-to-cart bar
- More from series
- Recently viewed

### Template C — Original Work PDP (/works/[slug])
- VISUALS FIRST — large hero image, then image gallery showing ALL available photos
- Title, medium, year, dimensions
- Description (longer, richer than Gelato products)
- "Price on enquiry" + enquire CTA
- Artist note (if available)
- More from same category
- Link to print equivalents if they exist in the shop

### Template D — Editorial / Landing
- Full-bleed hero (image or video)
- Section hierarchy: primary → secondary → supporting
- No product grids — links out to shop

### Template E — Art Journal / Blog
- Featured post (large) + grid of remaining
- Individual post: header → hero image → body → share → shop CTA → newsletter → archive

### Template F — Utility (About, Commissions, FAQ, Contact, Legal)
- Simple single-column with prose content
- No product grids
- Clear CTAs at the end

---

## NAVIGATION

### Desktop header
- Logo left, primary nav center (Shop / Fine Art / Commissions / About), utility right (DKK / Cart)
- Sticky on scroll, background: `--c-bg` at 96% opacity, backdrop-blur
- Active state: underline in `--c-accent`

### Mobile bottom tab bar
- 4 tabs: Home / Shop / Fine Art / Cart
- Active: icon filled + label in `--c-accent`
- Background: #FFFFFF with top border 1px `--c-surface`

### Breadcrumb
- Present on: PDPs, Works, Blog posts, Legal pages
- Format: Section / Subcategory / Current page
- Size: `--text-sm`, `--c-muted`

---

## SECTION TEMPLATES

### Section with header + grid
```
[LABEL — small caps, --c-muted]
[H2 Title — Playfair]
[Optional subtitle — Inter, --c-muted]
[Grid content]
[View all → link]
```
Top margin from previous section: `--sp-24`

### Editorial split (image + text)
```
[Image — 55% width] | [Text block — 45%]
                       [Series label]
                       [H2 Title]
                       [Body paragraph]
                       [CTA link]
```

### Trust bar
- Single horizontal row, centered
- Items separated by · dots
- `--text-sm`, `--c-muted`

### Newsletter section
- Background: dark (--c-text) OR light linen
- Short headline + subline + email input + submit

---

## ANIMATIONS & TRANSITIONS

- Default transition: 200ms ease (`--t-fast`)
- Page transitions: none (Next.js default, keep it clean)
- Hover on cards: subtle shadow lift (box-shadow 0 4px 16px rgba(0,0,0,0.08))
- Image zoom on hover: scale(1.02), overflow hidden, 300ms ease
- Never: bounce, spin, slide-in from outside viewport
- Loading states: skeleton screens (chalk background with animated shimmer)

---

## RESPONSIVE BREAKPOINTS

| Name | Width | Grid columns |
|------|-------|-------------|
| Mobile | < 640px | 2 (products), 1 (content) |
| Tablet | 640–1024px | 2–3 |
| Desktop | > 1024px | 4 (products), 2–3 (editorial) |

Max content width: 1280px, centered with `auto` margins.

---

## OPEN DESIGN ISSUES (cross-reference ISSUES.md)

- ISS-02: Card info area must be white — not yet implemented across all PLPs
- ISS-03: Framed print card aspect ratio — needs distinct ratio in grid
- ISS-04: Sticky bar must use Terracotta, not navy
- ISS-05: Recently viewed image container must be white
- ISS-06: Original Works PDP — needs Template C implementation
- ISS-07: Homepage section hierarchy needs restructure per "most important first"
