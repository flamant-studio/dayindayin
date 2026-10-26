# DD5 brief
DoD (one line): everything for DD2 up to Sebastian's single Gelato CSV upload is done — full upscales print-ready (dpi table), CSV validated vs live Gelato template, IMPORT.md ≤1 phone screen, ONE yes/no for the Shopify archive, D3 no longer open.
Deliver-in: Vercel (project CLAUDE.md); print files ship via committed PNGs in this repo (origin = GitHub dayindayin, raw URLs are what Gelato fetches).
Risk: wrong/soft print file reaches paying customers' posters, or Shopify archive hides products; both held for Sebastian (CSV import, D4).
Mandate: proceed alone for upscale/validation/docs; must reach Sebastian for the Gelato import and the Shopify write (D4).
Assuming: helm/DD2 branch (CSV, scripts) was never merged to main, so I merged it into helm/DD5; /tmp/sr upscales were pruned so I regenerated them (EDSR x4, same method as approved crops).
## Existing material
- DayInDayIn Images/gelato_dd2_new_art_prints_export.csv (from helm/DD2), scripts/dd2-apply.ts, DD2 HANDOFF in main _review/DD2/
- Approved crops: main _review/DD2/upscale/*.png; D3 "OK, all 4" in DECISIONS_NEEDED.md
- Live: raw.githubusercontent.com/flamant-studio/dayindayin/main/... returns the 1500px originals (200) until main with upscales is pushed
