# DayInDayIn — Improvement Backlog
*Logged 2026-05-24. Non-blocking. Work through when ready.*

---

## 20 Pending Tasks

### UX / Features

1. **Wishlist / saved items**
   Heart icon on every product card. State in localStorage. Accessible at `/saved`. Shows all saved products with remove + add-to-cart actions.

2. **Cart item thumbnails**
   Cart drawer currently shows title + price only. Add product image thumbnail (50×50px) next to each line item.

3. **Low stock badge**
   On the variant selector: when a variant has ≤ 5 units available, show "Only X left" in a small badge. Requires `quantityAvailable` field in Storefront variant query.

4. **Sticky add-to-cart bar (PDP)**
   A fixed bar at the bottom of the screen on product pages that appears once the main ATC button scrolls out of view. Contains product name + price + ATC button. Critical for mobile conversion.

5. **Product page: tags as filter links**
   Series + category tags shown below the product title on PDP. Each tag links to `/shop?filter=<tag>`. Helps discovery.

6. **Back-in-stock email capture**
   On sold-out variants: replace or supplement the disabled ATC button with a "Notify me" email field. Store in Klaviyo or a simple Supabase table.

7. **Pinterest / copy-link sharing**
   Small share row on product pages. Pinterest saves the product image URL; "Copy link" copies current URL. No tracking required.

8. **Mobile shop filter UX**
   TYPE and SERIES filter rows are two long horizontal scroll lists on mobile. Replace with collapsible accordion or bottom sheet — reduce visual noise on first load.

9. **Currency display toggle**
   DKK default. EUR / GBP toggle for international visitors. Client-side only — multiply displayed price, no Shopify multi-currency. Small toggle in header or on product page.

10. **"Shop by vibe" curated page**
    A `/collections` page with 4–6 hand-curated sets: "Gift under 500 kr", "Bold statements", "Quiet works", "For the bathroom", etc. Static page, manually updated. Each set links to a pre-filtered `/shop?filter=` URL.

---

### Content

11. **About page — real content**
    `/about` currently has placeholder content. Needs: real artist bio, process description, at least one or two studio/work-in-progress images, contact CTA. Stine should review final copy.

12. **Order tracking / confirmation page**
    `/order-confirmed` page that Shopify redirects to after checkout. Reads `order_id` and `email` from URL params. Shows friendly confirmation state, "back to shop" link.

---

### Technical / SEO

13. **sitemap.xml via App Router**
    Create `app/sitemap.ts` that generates all product handles (`/shop/[handle]`) + static pages. Currently only `app/robots.ts` exists. 273+ URLs to include.

14. **Dynamic OG images for products**
    `app/shop/[handle]/opengraph-image.tsx` using Next.js `ImageResponse`. Shows product image + title + brand. Gives rich previews when shared on social/Slack.

15. **`lang` attribute and i18n prep**
    Set `<html lang="en">` in layout. Add `hreflang` meta for Danish (`/da`) in preparation for a future Danish-language version. No full translation needed yet — just the structural groundwork.

16. **Print CSS**
    `@media print` styles for product pages. Clean layout: product image + title + price + description only. Useful for gifting — people print and include with gifts.

17. **Accessibility audit**
    Run axe-core or WAVE against all pages. Known gaps to check: focus ring visibility on `--c-bg` background, ARIA labels on icon-only buttons (cart, close), `alt` text coverage on all images.

18. **PostHog analytics — cookieless**
    Client-side event tracking: `pageview`, `product_viewed`, `add_to_cart`, `filter_selected`. PostHog cookieless mode is GDPR-compliant without a consent banner. Add after DNS is live.

19. **Error boundary for Shopify API failures**
    `app/shop/error.tsx` — a friendly error state if the Shopify Storefront API times out or returns an error. Currently the shop page crashes with a Next.js error overlay.

20. **Image optimisation audit**
    Check that all above-the-fold images have `priority` prop. Audit Vercel Blob image sizes — some Gelato mockups may be over 2MB. Add `quality={80}` where missing.

---

## 3 Alternate Design Concepts

Preview pages created at:
- `/preview-a` — Magazine / Editorial (white, gallery-style, 3-column)
- `/preview-b` — Graphic / Poster (newsprint, big type, 2-column list)
- `/preview-c` — Quiet / Kinfolk (warm linen, centered, minimal)

These do not replace the existing design. Review, choose, or mix-and-match elements.
