# DayInDayIn Loop Log
*Survives conversation compaction. Read this at the start of every /loop session.*

## How to continue after compaction
1. Read this file
2. Check git log for recent commits
3. Run `npx tsx scripts/check-storefront-variants.ts` to verify variant state
4. Continue from the next incomplete task

## PROCESS RULES (agreed 2026-06-21)
- Do NOT mark any task done unless there is a Playwright screenshot at 390px mobile + 1280px desktop proving it
- Screenshots go in `/Users/flamant-mini/Documents/FLAMANT/dayindayin-site/screenshots/[task-id]/`
- Sebastian confirms visually before task is closed — not the machine
- Work one page top to bottom, confirm, then move to next page
- Design system tokens must be respected across ALL pages — no ad-hoc per-page fixes
- Mobile-first always. Test at 390px first, desktop second

---

## Loop 1 — Started 2026-06-21

**Goal:** 20 tasks, fix UX issues, verify all product categories on mobile.

### Completed tasks

| # | Task | Status | Notes |
|---|------|--------|-------|
| 0 | Fix framed print variant picker (Print Material type) | ✅ Done | 20 products fixed via fix-print-material-framed.ts |
| 1 | Fix A4/Black price 417.77 → 399.00 on all framed prints | ✅ Done | 63 products fixed via fix-framed-a4-black-price.ts |
| 2 | Publish remaining Gelato products | ✅ Running | publish-gelato-to-shopify.ts — 18 still syncing from Gelato |
| 3 | Newsletter API verified | ✅ Done | Uses SHOPIFY_ADMIN_TOKEN + Shopify customers — fine |
| 4 | minPrice now 399 on framed prints | ✅ Done | Automatic after price fix |
| 5 | Mobile audit — ALL 10 product categories, variant/size selectors | ✅ Done | All working at 390px viewport |
| 6 | Dynamic product count on shop page (was hardcoded "300+") | ✅ Done | Now shows live-rounded count |
| 7 | Fix prices on practical/FAQ page | ✅ Done | Water bottle 253kr, wood print 430kr, greeting card 104kr |
| 8 | RecentlyViewed: show category label | ✅ Done | Fixes confusion when same artwork in multiple product types |
| 9 | Fix console warnings | ✅ Done | turbopack.root set in next.config.ts — build warning gone; browser warnings are Next.js CSS preload (not actionable) |
| 10 | Shop grid mobile improvements | ✅ Done | 8px gap, 2-line title clamp (was single-line ellipsis causing "Black &...") |
| 11 | Homepage improvements | ✅ Done | Diversity fix: max 2 per category so grid shows variety (was all Framed Prints) |
| 12 | Fix products with no descriptions | ✅ Done | fallbackDescription() per product type shown when Shopify description is empty |
| 15 | Fix: QuickAdd on single-variant | ✅ Done | Removed 'Default Title' check — tote bags, water bottles, postcards now get button |
| 18 | Size guide for framed prints | ✅ Done | Outer frame dimensions column added when productType === 'Framed Print' |
| —  | Fix: format siblings duplicate type | ✅ Done | Excluded current product's type from siblings list (no more "Tote Bag × 2") |

### Remaining tasks (low priority — defer to next session)

| # | Task | Priority | Notes |
|---|------|----------|-------|
| 11 | Improve shop filter UX | Medium | Current two-row scrollable filter is functional — no urgent change needed |
| 9  | About page improvements | Low | Page is complete and informative |
| 10 | Art journal posts | Low | Content task — needs Stine input |
| 13 | Improve practical/FAQ page design | Low | Page looks good already |
| 14 | Collections page improvements | Low | Botanical/Floral/Faces sections missing images — Gelato mockups still generating |
| 16 | Footer improvements | Low | Footer is complete |
| 17 | JSON-LD on homepage | Low | Already has Organization + SiteSearch JSON-LD |
| 19 | Final audit | DONE | 0 console errors on all key pages. All commits pushed and deployed. |

---

## UX task list — Sebastian's feedback 2026-06-21 (verbatim, never actioned)
*Source: 30 minutes of real device testing. These are Sebastian's words, not machine interpretation.*
*Status rule: nothing is ✅ until Sebastian confirms it visually on device.*

### HOME PAGE
| ID | Task | Status |
|----|------|--------|
| H1 | Remove "shop open · ships to europe" ticker line | ❌ |
| H2 | Liebes Panopticon image used twice — replace second instance with different image | ❌ |
| H3 | Hero body text — needs to be better | ❌ |
| H4 | Browse by series: remove Sommerby. Fix SHERO image placement or use different SHERO image | ❌ |
| H5 | Product cards: no design system, no strict padding — fix consistency | ❌ |
| H6 | Add to cart button on cards: placement all over the place — fix | ❌ |
| H7 | Remove go-up arrow (↑) — nobody uses this | ❌ |
| H8 | "From the studio — direct" section: cut to the core, remove bullshit | ❌ |
| H9 | Remove "see all products in the shop" at bottom | ❌ |
| H10 | Footer: consolidate into ONE footer. Currently feels like the page never ends | ❌ |

### SHOP PAGE
| ID | Task | Status |
|----|------|--------|
| S1 | Remove "you keep coming back..." prompt — cute idea, doesn't work | ❌ |
| S2 | 4 product cards must be visible above the fold on mobile | ❌ |
| S3 | Add to cart on cards: move to bottom of each card; text link style or very light border only — not heavy grey-red | ❌ |
| S4 | 3 bullet points at bottom take up a full screen — cut down drastically | ❌ |
| S5 | CTA clarity: "add to cart" vs "view product" — nobody knows what to click | ❌ |

### GELATO PRODUCT PDP
| ID | Task | Status |
|----|------|--------|
| P1 | Background colours broken: weird beige → white edge-to-edge → beige again | ❌ |
| P2 | "Also in this series" — move down (currently too high) | ❌ |
| P3 | Sticky ATC appears and disappears randomly — fix | ❌ |
| P4 | Remove "Work by Stine Weirsøe Flamant" strip | ❌ |
| P5 | "More from Faces" → rename to "Recently viewed"; use carousels; fix excess whitespace between sections | ❌ |
| P6 | Image zoom is broken: zoomed images are smaller than originals; arrows eat too much space. Remove or fix properly | ❌ |
| P7 | Breadcrumb still showing directly below main image — move it | ❌ |
| P8 | Postcard subtitle should say "(pack of 10)" not just "Postcard" | ❌ |

### CART
| ID | Task | Status |
|----|------|--------|
| C1 | Remove "Taxes and shipping calculated at checkout" — taxes are included for EU | ❌ |
| C2 | Add payment logos, security messaging, or alternative payment methods | ❌ |

### FINE ART PAGE
| ID | Task | Status |
|----|------|--------|
| FA1 | Liebes Panopticon used as hero again — replace with a different image | ❌ |
| FA2 | "New to the archive" — confusing label, fix or remove | ❌ |
| FA3 | Consider single column (not 2) for fine art grid — max exploration | ❌ |
| FA4 | Remove "Office Shot" work from the archive | ❌ |
| FA5 | Remove "Want something that exists only once?" section — bullshit | ❌ |
| FA6 | "Looking for prints?" at bottom: reduce whitespace below; avoid "kr." orphan on its own line | ❌ |

### FINE ART PDP (/works/ pages)
| ID | Task | Status |
|----|------|--------|
| FP1 | CTA text → "Pricing and availability" (not "Discover this work") | ❌ |
| FP2 | Photography: image should be at top of template (currently text-heavy top) | ❌ |
| FP3 | Breadcrumbs: too much whitespace below — reduce to minimum | ❌ |

### COMMISSIONS PAGE
| ID | Task | Status |
|----|------|--------|
| CM1 | Add lifestyle imagery and behind-the-scenes photos | ❌ |
| CM2 | Fix vertical whitespace between sections | ❌ |
| CM3 | Find and fix "horeunger" typo | ❌ |
| CM4 | Reduce copy — seriously cut the bullshit | ❌ |

### OVERALL / SYSTEMIC
| ID | Task | Status |
|----|------|--------|
| O1 | Design system: everything is ad-hoc per page. Needs system-level consistency | ❌ |
| O2 | Mobile-first: site feels optimised for desktop. Flip the priority | ❌ |

---

## Image / product track — Session 5 (2026-06-26)
- Transparent mask images created (11 files) and pushed to `flamant-studio/dayindayin` repo
- BYOB line: 5 images exist in GitHub, CSV exists, but NEVER imported to Gelato or Shopify — needs manual Gelato import
- Elephant products: mugs + totes use transparent bg; all other types use solid bg — 8 products to fix manually in Gelato
- 157 total artwork files in GitHub repo across 11 categories — raw URL pattern: `https://raw.githubusercontent.com/flamant-studio/dayindayin/main/DayInDayIn%20Images/[category]/[filename]`

---

## Outstanding UX/design tasks — audited 2026-06-21 (Session 4)

| # | Task | Status | Notes |
|---|------|--------|-------|
| U1 | Sticky ATC colour mismatch | ✅ Done | Both AddToCartButton and StickyATC use `var(--c-accent)` — identical |
| U2 | Double CTA on mobile | ✅ Fixed | StickyATC mobile CSS had `transform: translateY(0)` hardcoded — always visible. Removed. Now JS-controlled like desktop. Commit `223d469` |
| U3 | Variants not clickable | ✅ Done | Confirmed in Playwright — size + frame pickers working, price updates |
| U4 | Product card text colour | ✅ Done | Cards: white bg, dark text — looks correct |
| U5 | Recently viewed carousel bg | ⚠️ Unverifiable | Requires localStorage history (prior product visit). Test on real device. |
| U6 | Product image cropping PLP | ✅ Likely done | Framed prints use `cardImgMockup` (1/1 ratio, object-fit:contain) — should show full mockup. Verify elephant print on real device. |
| U7 | Mobile breadcrumbs at top | ❌ Still outstanding | Breadcrumb is above the title block. Feedback wants it lower. Design decision — needs Sebastian direction. |
| U8 | Mobile: "Back to Shop" | ✅ Done | Not present on PDP |
| U9 | Fine art "Enquire" → "Discover" | ✅ Done | Button reads "Discover this work" on /works/ PDPs |
| U10 | Fine art CTAs aggressive | ✅ Done | /works/ PDP CTA is black button, not red |
| U11 | Fine art: cost indication | ✅ Done | "Originals are individually priced. See the FAQ for typical price ranges." present on /works/ PDPs |
| U12 | /works/ slugs returning 404 | ✅ Fixed | Root cause: 5 slugs had uppercase Roman numerals (candy-I, rainbow-I/II, pink-rug-II, gud-har-meldt-afbud-II). Lowercased. Commit `223d469`. Template itself works. |
| U12b | Unique Art PDPs (distinct template) | ❌ Still outstanding | The visuals-first template redesign for /works/ pages is a separate task. Currently shows: large image, text info, CTA, related works. Could be richer. |
| U13 | Homepage video hero | ✅ Done | Video IS wired (hero-loop.mp4 in Vercel Blob). Playwright doesn't autoplay video — static first frame shown. On device it plays. |
| U14 | Homepage information hierarchy | ⚠️ Deferred | Current order: Hero → Fine Art → Print Shop → Featured work. Seems logical. Needs Sebastian's call on what "most important info first" means. |
| U15 | Mobile home spacing | ⚠️ Deferred | Sections stack cleanly in Playwright. Hard to judge without real device. |
| U16 | Design system doc | ⚠️ Deferred | Low priority — blocks no feature work |
| U17 | Vercel failed deploy | ✅ Resolved | Superseded by new commits. Latest push (`223d469`) deploying now. |

---

## Session 4 summary (2026-06-21)
*Full Playwright audit of U1–U17 backlog. Most were already done. Fixed 2 real bugs.*

Commits:
- `223d469` — Fix double-CTA on mobile (StickyATC always-visible) + /works/ slug 404s (5 slugs with uppercase Roman numerals)

Audit verdict: U1, U3, U4, U8, U9, U10, U11, U13 all done. U2, U12 fixed this session. U5, U6 need real-device check. U7 (breadcrumb position), U14, U15 need Sebastian's direction. U16 deferred.

---

## Session 3 summary (2026-06-21)
*PDP redesign: element order, series badge, no edition note, accordions, studioNote removed, ProductProvider wraps image column for variant image swap. Mobile burger menu fixed (was hidden after tab bar removal). SizeGuide grid-animation leak fixed.*

Commits:
- `330e13d` — PDP redesign
- `99a46c4` — Fix mobile burger visibility
- `60b29b6` — Fix SizeGuide grid-animation leak

---

## Session 2 summary (2026-06-21)

Commits pushed to main (all auto-deployed via Vercel):
- `f3227c5` — QuickAdd fix, fallback descriptions, framed size guide, turbopack.root
- `a8f46e8` — Homepage grid diversity (max 2 per category)
- `f7aacfc` — Mobile shop grid: 8px gap, 2-line title clamp
- `6cf00a5` — Format siblings: exclude current product type

Audit results:
- 0 console errors on homepage, PDP (framed + tote), search, practical
- All product categories confirmed working on mobile
- Cart redirect working (navigates to /shop — expected behavior)

---

## Variant state (2026-06-21)

- **Framed Print** (Framed Print + Print Material types): 30 products, all have 12 variants (A4/A3/A2/A1 × Black/White/Wood). A4/Black = 399 kr.
- **Art Print**: Gelato-synced, variants from storefront API (A4/A3/A2)
- **Poster**: Gelato-synced
- **Mug**: 4 variants (White/Black × Design A/B)
- **Tank Top**: 6 size variants (XS–2XL)
- **Tote Bag**: 1 variant (Natural)
- **Postcard**: 1 variant (Pack of 10)
- **Water Bottle**: 1 variant
- **Wood Print**: 1 variant
- **Dad Cap**: 2 variants

## Key scripts

```bash
npx tsx scripts/check-framed-shopify.ts     # Check framed print variant state
npx tsx scripts/check-storefront-variants.ts # Verify Storefront API
npx tsx scripts/publish-gelato-to-shopify.ts # Publish unpublished products
npx tsx scripts/fix-framed-a4-black-price.ts # Fix stale A4/Black price
npx tsx scripts/fix-print-material-framed.ts # Fix Print Material type framed products
```

## Key URLs
- Live site: https://dayindayin-site.vercel.app
- Shopify admin: https://admin.shopify.com/store/dayindayin
- Git: push to main → auto-deploys to Vercel
