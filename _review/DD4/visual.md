# DD4 visual capture
Source: production build of branch helm/DD4 at http://localhost:3100 (not deployed). Chromium headless, viewports 390x844 and 1280x800, full-page, cookie consent pre-set (did_cookie_consent=accept).
Files: _review/DD4/cap/<page>-mobile-390.png and <page>-desktop-1280.png for home, fine-art, fine-art-grid, fine-art-embroidery, works-mariann, works-purple-sun, works-fireworks, shop, shop-mug (mug = /shop/mug-shero-teal). Plus cap/home-mobile-390-cookie-banner.png (banner showing, viewport only).
Console/network: cap/console.txt. Only noise: aborted Next RSC prefetches (ERR_ABORTED), aborted GA collect on navigation, and "preloaded CSS not used" warnings on /fine-art desktop. No JS errors, no HTTP >=400.
Observed: home hero white text on dark scrim over photo, legible; no horizontal overflow; CTAs single line. I did not read every screenshot for layout; I checked home 390 hero and the Copy-link button visually. Layout/overlap review of the other captures is left to the reviewer.
Readability detail: _review/DD4/a11y.md
