# Dayindayin — Agent Task Backlog
Generated: 2026-07-11
Source: Screenshots 1–18 (task 3 deleted by requester)
Agent note: After each task, verify on BOTH desktop AND mobile. Desktop is the stronger platform currently; mobile needs extra attention.
Asset path on disk: /Users/flamant-mini/Desktop/dayindayin_task_screenshots/

---

## TASK 1 — Home: Replace Liebes Panopticon hero image
**Page:** Home  **Section:** Featured artwork hero banner (left image panel)  **Screenshot:** `1.png`
**Problem:** Current image shows the back/WIP side of the tufted canvas on a wooden frame. Looks unfinished.
**What to do:**
- Search the asset library for other images of "Liebes Panopticon"
- Select the best front-facing, finished shot of the piece
- Replace the current hero image with it
- Keep the dark green text panel on the right unchanged
**QA:**
- [ ] Desktop: image fills left panel cleanly, no awkward crop
- [ ] Mobile: image still reads well at narrow viewport

---

## TASK 2 — Home: Make "Browse by Series" tiles uniform icon-like crops
**Page:** Home  **Section:** "Browse by Series" horizontal scroll  **Screenshot:** `2.png`
**Problem:** Tiles are inconsistent — some show full artwork with white frames/matting, others are cropped differently, resulting in uneven visual weight and lots of dead white space in some tiles.
**What to do:**
- Standardise all series tiles to the same aspect ratio (suggest 1:1 square or consistent rectangle)
- Allow/encourage cropping into the artwork so it reads as a bold icon, not a full reproduction
- Remove white border/frame padding from within the tile — the artwork should fill the tile edge to edge
- Ensure all tiles feel visually "alike" at a glance — same size, same shape, same crop style
**QA:**
- [ ] Desktop: tiles look uniform in a horizontal row
- [ ] Mobile: tiles scroll horizontally and are all same size

---

## TASK 4 — Home: Minimise newsletter signup and move to footer
**Page:** Home  **Section:** Newsletter signup block (currently a prominent standalone section)  **Screenshot:** `4.png`
**What to do:**
- Remove the full newsletter section from the homepage body
- Add a minimal newsletter signup to the footer — just a single input field + submit button, no headline copy, no description text
- No marketing language ("From the studio — direct", algorithm talk, etc.) — keep it dead simple
**QA:**
- [ ] Desktop: footer shows compact email input + button
- [ ] Mobile: footer input is usable on small screen, doesn't overflow

---

## TASK 5 — Home: Replace reused images in the studio collage strip
**Page:** Home  **Section:** Horizontal photo strip / studio collage (4-panel wide image)  **Screenshot:** `5.png`
**Problem:** Some images in this strip are reused from other placements on the site (gallery, PDPs, etc.). This is wasteful given the volume of available assets.
**What to do:**
- Audit which images in the strip are already used elsewhere on the site
- Replace all reused images with fresh ones — pull from the "lifestyle" category in the asset library first, then from any artwork not already featured
- Do NOT reuse any image that appears on a PDP, in the series tiles, or in the hero banner
**QA:**
- [ ] Desktop: strip looks lively and varied
- [ ] Mobile: strip scrolls or stacks without broken layout

---

## TASK 6 — Home: Remove Studio Notes section + comment out blog
**Page:** Home + Studio Notes / Blog pages  **Screenshot:** `6.png`
**What to do:**
- Remove the "From the studio" / Studio Notes section entirely from the homepage
- Comment out (do NOT delete) the Studio Notes / Blog section and all associated blog post pages — use `{/* ... */}` or `<!-- ... -->` as appropriate
- Remove any nav links pointing to the blog/studio notes for now
- These may return when actual copy from Stine is ready
**QA:**
- [ ] Desktop: homepage has no trace of studio notes section
- [ ] Mobile: same
- [ ] Nav: no broken links to commented-out pages

---

## TASK 7 — Footer: Consolidate two lines into one
**Page:** All pages (footer)  **Screenshot:** `7.png`
**Problem:** Footer currently has two separate lines:
1. "Ships to EU, UK & Norway · Secure checkout via Shopify · Prints from 56 kr"
2. "© 2026 Stine Weirsøe Flamant · Flamant Tekst & Design" + Sitemap / Printed by Gelato
**What to do:**
- Merge into a single footer line
- Suggested format: `© 2026 Stine Weirsøe Flamant · Ships to EU, UK & Norway · Secure checkout via Shopify · Printed by Gelato`
- Keep all links (Gelato, Sitemap) inline if they fit; drop "Prints from 56 kr" if space is tight
**QA:**
- [ ] Desktop: single clean footer line, no wrapping issues
- [ ] Mobile: line wraps gracefully if needed, nothing overflows

---

## TASK 8 — Shop: Fix or remove non-functional "Newest" sort button
**Page:** Shop  **Screenshot:** `8.png`
**Problem:** "Newest" button appears selected/active but clicking it does nothing.
**What to do:**
- Option A (preferred): Make sort actually work — Newest, Price ↑, Price ↓ should re-sort the product grid
- Option B (fallback): If sort is not wired to the data layer, remove the sort buttons entirely rather than showing broken UI
- Do not show a button that does nothing
**QA:**
- [ ] Desktop: sort changes product order (or buttons are gone)
- [ ] Mobile: same

---

## TASK 9 — Shop: Remove "Floral" and "Botanical" series filter tabs
**Page:** Shop  **Screenshot:** `9.png` and `10.png`
**Problem:** Floral (3 items) and Botanical (3 items) are too sparse to merit their own filter tabs in the shop.
**What to do:**
- Remove "Floral" and "Botanical" tabs from the series filter bar
- Their products should still be accessible under "All Series"
- Do not delete the products themselves
**QA:**
- [ ] Desktop: filter bar shows remaining series only
- [ ] Mobile: filter bar scrolls correctly with fewer tabs

---

## TASK 11 — PDP: Fix non-functional variant selectors (Color / Design Side)
**Page:** Product detail page — e.g. "Botanical — Blanc" mug  **Screenshot:** `11.png`
**Problem:** Clicking "White"/"Black" color selector or "Side A"/"Side B" design selector does nothing — product image and price do not update.
**What to do:**
- Investigate whether this is a Shopify variant setup issue or a frontend rendering issue
- Check that Shopify product variants are correctly configured (each color × side combination should be a distinct variant with its own image)
- Check that the frontend variant selector is correctly wired to swap image + price on selection
- Fix for this product, then audit other products with variant selectors and fix any others with the same issue
**QA:**
- [ ] Desktop: clicking White/Black updates image; clicking Side A/B updates image
- [ ] Mobile: same
- [ ] No console errors on variant change

---

## TASK 12 — PDP: Add two carousels below product info
**Page:** Product detail page (all shop products)  **Screenshot:** `12.png`
**What to do:**
Add two horizontal carousels below the main product info section:
1. **"Similar pieces"** — same series or same product type (e.g. other mugs in Botanical)
2. **"Recently viewed"** — last 4–6 products the user has viewed this session (store in localStorage)
- Use consistent carousel component (same as used elsewhere on site)
- Both carousels should have left/right arrow navigation
- Labels: "Similar pieces" and "Recently viewed"
**QA:**
- [ ] Desktop: both carousels render below the fold after product info
- [ ] Mobile: carousels scroll horizontally, arrows or swipe works

---

## TASK 13 — PDP: Replace zoom lightbox with image carousel (left/right arrows)
**Page:** Product detail page — product image area  **Screenshot:** `13.png`
**Problem:** Current zoom lightbox doesn't zoom enough to be useful and feels clunky.
**What to do:**
- Remove the zoom-on-click lightbox behaviour
- Replace with a simple left/right arrow carousel on the main product image card
- Clicking left/right cycles through all product images inline on the page (no modal/lightbox)
- Image thumbnails below the main image (if present) should also be clickable to jump to that image
**QA:**
- [ ] Desktop: arrows appear on hover, click cycles images
- [ ] Mobile: swipe gesture works to cycle images; arrows visible on tap

---

## TASK 14 — Fine Art page: Unify series tiles with home page series component
**Page:** Fine Art page — series/collection carousel  **Screenshot:** `14.png`
**Problem:** The Fine Art page has its own carousel component for series, distinct from the one on the homepage. This is unnecessary duplication.
**What to do:**
- Extract the series tile carousel into a single shared component (e.g. `<SeriesCarousel>`)
- Use this one component on both the homepage "Browse by Series" section and the Fine Art page
- The component should accept a prop for which series to show (all, or a filtered subset)
- Styling from Task 2 (uniform icon crops) should apply here too
**QA:**
- [ ] Desktop: both placements look identical in style
- [ ] Mobile: both placements behave identically

---

## TASK 15 — Fine Art PDP: Fix backside images used as main image
**Page:** Fine Art product detail pages — tufted works  **Screenshot:** `15.png` (shows "Jellyfish" using a back/underside image as hero)
**Problem:** Some tufted artworks are using the reverse/back side of the work as the primary (first) product image. The front of the work should always be first.
**What to do:**
- Fix the "Jellyfish" listing — move the front-facing image to position 1
- Audit all other Fine Art listings (especially tufted works) and fix any others where the back or a non-front image is in the primary slot
- The back/detail images can remain in the carousel but must not be position 1
**QA:**
- [ ] Desktop: all Fine Art PDPs show a front-of-work image as the hero
- [ ] Mobile: same

---

## TASK 16 — Fine Art PDP: Update CTA copy
**Page:** Fine Art product detail page  **Screenshot:** `16.png`
**Problem:** CTA button currently says "Discover this work" — too vague and not action-oriented for a purchase/enquiry flow.
**What to do:**
- Change CTA copy to "Contact to buy" OR "Enquire about price" (pick the one that best fits the site's tone)
- Apply consistently to all Fine Art original work PDPs
- Shop/print PDPs (with fixed prices) keep their existing "Add to cart" CTA unchanged
**QA:**
- [ ] Desktop: CTA text updated on all Fine Art original PDPs
- [ ] Mobile: button text fits within button width, no truncation

---

## TASK 17 — Fine Art PDP: Add two carousels at bottom (not just "More hand tufting")
**Page:** Fine Art product detail page — bottom section  **Screenshot:** `17.png`
**Problem:** Fine Art PDPs currently show only one "More hand tufting" carousel. This is too narrow and misses cross-category discovery.
**What to do:**
- Replace the single "More hand tufting" carousel with two carousels (same pattern as Task 12):
  1. **"More from this medium"** — other Fine Art works in same medium (tufting, embroidery, etc.)
  2. **"Recently viewed"** — last 4–6 Fine Art works viewed this session
- Use the same shared carousel component
**QA:**
- [ ] Desktop: two carousels render below artwork info
- [ ] Mobile: both carousels scroll correctly

---

## TASK 18 — All Works page: Remove page, add view toggle to Fine Art page
**Page:** Fine Art > All Works (`/fine-art/all-works` or similar)  **Screenshot:** `18.png`
**Problem:** "All Works" is a separate page with a grid view, but its role overlaps confusingly with the main Fine Art page. The grid view is useful, but shouldn't require a separate page to access.
**What to do:**
- Add a view toggle to the Fine Art main page with at minimum two modes:
  - **Grid** (the dense grid currently on All Works)
  - **Carousel / Browse** (the current Fine Art page layout)
  - Optionally: **List** (title + year + medium per row) if easy to add
- The toggle should persist in the URL (e.g. `?view=grid`) so links are shareable
- Remove the standalone "All Works" page once the toggle is working
- Update any nav links or internal links pointing to the old All Works page
**QA:**
- [ ] Desktop: toggle switches layout without page reload
- [ ] Mobile: grid view works on mobile (2-column minimum); toggle is accessible
- [ ] No 404 for old All Works URL (redirect to Fine Art page)

---

*End of task backlog — 16 tasks total (task 3 was deleted by requester)*
