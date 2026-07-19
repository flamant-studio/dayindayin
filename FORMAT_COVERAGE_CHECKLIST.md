# Format coverage checklist — Gelato products missing sizes

Generated 2026-07-19 via `scripts/audit-format-coverage.ts` (live Gelato API read, no writes made).

64 of 78 Fine Art Print / Poster / Framed Print / Art Print products currently have only ONE size variant live (usually the smallest/default from CSV import), even though the underlying Gelato template supports more.

**Three different size systems are in play — do not force A4/A3/A2 onto all of them:**
- **Fine Art Print** template maxes out at A3. Full range: 15×20cm, 21×29.7cm (≈A4), A3. No A2 exists on this template at all.
- **Poster** template: 21×29.7cm (≈A4), A3, A2 — a few also offer A1 (template version inconsistency, not a mistake to fix).
- **Framed Print** template: 21×29.7cm (≈A4), A3, A2, A1 **× Black/White/Wood frame color** — full grid is 12 variants (4 sizes × 3 colors). 24 of 25 Framed Print products currently have only the ONE variant from CSV import (A4, Black frame) — missing all 11 other combinations. Only "Elephants — 4x4 — Framed Print" is partway there (9 of 12, missing the 3 A1 combos). This replaces the size-only entries below for Framed Print — treat every Framed Print row as "add the full 4×3 grid minus whatever's already live," not just sizes.
- **Art Print** (square format — Neko Paw Blue, Sea Monsters, Poppy/Poppies, Kaninskoven, etc.) uses cm sizes only: 25×25, 30×30, 40×40, 50×50cm. No A-sizes apply here at all.

Recommendation: add every size the template already offers, not just up to A2 — it's already available on the template at zero extra cost, and more options only helps the customer. Flag if you disagree before running this.

## Exceptions — inspect manually first, may behave differently in the UI
- Mask — II — Framed Print
- Geometric Garden — Art Print
- Neko Paw — Black & White — Art Print

(These three returned no template size data from the API — could be an older template version or a data quirk. Don't assume they follow the same pattern as their siblings until you've looked at one directly.)

## Framed Print — full size × color grid (12 combos: 21×29.7/A3/A2/A1 × Black/White/Wood)

All currently have exactly 1 live variant (21×29.7, Black) except Elephants — 4x4 (9 of 12; missing only the 3 A1 combos). "Missing" below lists every size/color combo not yet live — add all of them.

- Floral Thing — Framed Print : ADD 21×29.7/White, 21×29.7/Wood, A3/Black, A3/White, A3/Wood, A2/Black, A2/White, A2/Wood, A1/Black, A1/White, A1/Wood
- Elephant — Lilac — Framed Print : ADD (same 11 combos as above)
- Red and Green Moss — Framed Print : ADD (same 11 combos as above)
- Elephant — Green — Framed Print : ADD (same 11 combos as above)
- Purple Sun — Framed Print : ADD (same 11 combos as above)
- On the Light Table — Framed Print : ADD (same 11 combos as above)
- Elsk — Framed Print : ADD (same 11 combos as above)
- Flowers on Linen — Framed Print : ADD (same 11 combos as above)
- Rainbow II — Framed Print : ADD (same 11 combos as above)
- Elephant — Yellow — Framed Print : ADD (same 11 combos as above)
- Taped Objects — Framed Print : ADD (same 11 combos as above)
- Two Cats — Framed Print : ADD (same 11 combos as above)
- Neko Paw — Yellow & Blue — Framed Print : ADD (same 11 combos as above)
- Mask — I — Framed Print : ADD (same 11 combos as above)
- Sommerby — Framed Print : ADD (same 11 combos as above)
- Mask — Calling — Framed Print : ADD (same 11 combos as above)
- Neko Paw — Yellow Neon — Framed Print : ADD (same 11 combos as above)
- Neko Human II — Framed Print : ADD (same 11 combos as above)
- Neko Paw — Pink — Framed Print : ADD (same 11 combos as above)
- Mask — Blasé — Framed Print : ADD (same 11 combos as above)
- Solar Face — Framed Print : ADD (same 11 combos as above)
- Moon Face — Framed Print : ADD (same 11 combos as above)
- Mask — III — Framed Print : ADD (same 11 combos as above)
- Elephants — 4x4 — Framed Print : ADD A1/Black, A1/White, A1/Wood only (already has the other 9)
- Mask — II — Framed Print : EXCEPTION — see above, inspect manually first

## Fine Art Print / Poster / Art Print — size only (no color dimension)

- Candy I — Fine Art Print : has [21×29.7cm] : ADD [15×20cm, A3]
- Tourism — IV — Fine Art Print : has [21×29.7cm] : ADD [15×20cm, A3]
- Sri Lanka Masks — Fine Art Print : has [21×29.7cm] : ADD [15×20cm, A3]
- SHERO — III — Fine Art Print : has [21×29.7cm] : ADD [15×20cm, A3]
- No Ordinary Stone — Fine Art Print : has [21×29.7cm] : ADD [15×20cm, A3]
- Round Earth — Fine Art Print : has [21×29.7cm] : ADD [15×20cm, A3]
- Vase on Stool — Fine Art Print : has [21×29.7cm] : ADD [15×20cm, A3]
- SHERO — Indigo — Fine Art Print : has [21×29.7cm] : ADD [15×20cm, A3]
- On the Light Table — Fine Art Print : has [21×29.7cm] : ADD [15×20cm, A3]
- Red and Green Moss — Fine Art Print : has [21×29.7cm] : ADD [15×20cm, A3]
- Tourism — I — Fine Art Print : has [21×29.7cm] : ADD [15×20cm, A3]
- Tourism — III — Fine Art Print : has [21×29.7cm] : ADD [15×20cm, A3]
- Elsk — Fine Art Print : has [21×29.7cm] : ADD [15×20cm, A3]
- Purple Flower — Fine Art Print : has [21×29.7cm] : ADD [15×20cm, A3]
- Floral Thing — Fine Art Print : has [21×29.7cm] : ADD [15×20cm, A3]
- Flowers on Linen — Fine Art Print : has [21×29.7cm] : ADD [15×20cm, A3]
- Style Exploration — Fine Art Print : has [21×29.7cm] : ADD [15×20cm, A3]
- SHERO — Purple — Fine Art Print : has [21×29.7cm] : ADD [15×20cm, A3]
- Sea Monsters — Blue — Fine Art Print : has [21×29.7cm] : ADD [15×20cm, A3]
- Purple Sun — Fine Art Print : has [21×29.7cm] : ADD [15×20cm, A3]
- Mask — I — Poster : has [21×29.7cm] : ADD [A3, A2]
- Mask — II — Poster : has [21×29.7cm] : ADD [A3, A2]
- Neko Paw — Yellow — Poster : has [21×29.7cm] : ADD [A3, A2]
- Mask — Dream — Poster : has [21×29.7cm] : ADD [A3, A2]
- Sommerby — Poster : has [21×29.7cm] : ADD [A3, A2]
- Solar Face — Poster : has [21×29.7cm] : ADD [A3, A2]
- Neko Human II — Poster : has [21×29.7cm] : ADD [A3, A2]
- Neko Paw — Yellow & Blue — Poster : has [21×29.7cm] : ADD [A3, A2]
- Moon Face — Poster : has [21×29.7cm] : ADD [A3, A2]
- Neko Paw — Yellow II — Poster : has [21×29.7cm] : ADD [A3, A2]
- Sea Monsters — Steel — Poster : has [21×29.7cm] : ADD [A3, A2]
- Neko Paw — Red — Poster : has [21×29.7cm] : ADD [A3, A2]
- Tourism — II — Poster : has [21×29.7cm] : ADD [A3, A2]
- Floating Poppies — Art Print : has [30×30cm] : ADD [25×25cm, 40×40cm, 50×50cm]
- Night Poppies — Art Print : has [30×30cm] : ADD [25×25cm, 40×40cm, 50×50cm]
- Neko Paw — Blue — Art Print : has [30×30cm] : ADD [25×25cm, 40×40cm, 50×50cm]
- Sea Monsters — Gold — Art Print : has [30×30cm] : ADD [25×25cm, 40×40cm, 50×50cm]
- Kaninskoven — Art Print : has [30×30cm] : ADD [25×25cm, 40×40cm, 50×50cm]
- Sleeping Cat — Art Print : has [30×30cm] : ADD [25×25cm, 40×40cm, 50×50cm]
- Sea Monsters — Cream — Art Print : has [30×30cm] : ADD [25×25cm, 40×40cm, 50×50cm]
- Monsters — Pattern — Art Print : has [30×30cm] : ADD [25×25cm, 40×40cm, 50×50cm]

## Already fully covered — skip these
Elephants — 4x4 — Framed Print, Mask Study — Fine Art Print, Two Cats — Fine Art Print, Neko Paw — Pink — Poster, Neko — Pink — Poster, Neko Paw — Lilac — Poster, Neko Paw — Yellow Neon — Poster, Mask — III — Poster, Mask — Blasé — Poster, Mask — Calling — Poster, Poppy Field — Art Print
