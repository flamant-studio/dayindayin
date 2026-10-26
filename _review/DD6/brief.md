# DD6 brief
DoD: run scripts/dd2-apply.ts so exactly 6 products (shero-iii/indigo/purple-fine-art-print, neko-paw-cap-blue/lilac/yellow) go ARCHIVED; before/after status list of ALL products diffs to exactly those 6; live shop screenshots 1280+390 before/after; LOG line.
Assuming the project has no HELM gate line in CLAUDE.md, so the gate is the task's own: read-back diff = exactly 6 changes.
Deliver-in: Shopify Admin API live write (store is the live Shopify store behind dayindayin-site.vercel.app); no code deploy needed.
Risk: wrong product archived hides a sellable product from the shop; reversible by setting status back to ACTIVE.
Mandate: proceed alone (Sebastian approved in D4).
## Existing material
- scripts/dd2-apply.ts (archives the 6 handles, reads keys from main-tree .env.local) — used as-is
- scripts/screenshot.ts (existing screenshot helper)
- DD2/DD5 in LOG.md and DECISIONS_NEEDED.md D4 (approval)
- Live: https://dayindayin-site.vercel.app/shop
