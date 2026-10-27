# DD7 brief
DoD: publish the 4 new fine art prints (blue-flower-on-green-wood, dead-flowers, red-and-green-moss, taped-objects "— Fine Art Print") to the Online Store with scripts/publish-to-online-store.ts limited to those 4 handles; before/after status+published list of ALL products diffs to exactly 4 changes; 7-point table per product; live shop screenshots 1280+390 showing the 4 prints; LOG line.
Assuming the gate is the task's own (project CLAUDE.md has no HELM gate line): read-back diff = exactly 4 changes. Assuming "status list" includes the Online Store published flag, since the 4 products are expected to already be ACTIVE-but-unpublished (created hidden) — the change is publication.
Deliver-in: Shopify Admin API live write against the store behind https://dayindayin-site.vercel.app (the project's established target); no code deploy.
Risk: publishing a product with wrong/blurry images or prices puts it in front of shoppers; reversible via publishableUnpublish / status DRAFT.
Mandate: proceed alone (Sebastian's DD5 IMPORT.md: "I run the publish script and the 7-point check; you do nothing").
## Existing material
- scripts/publish-to-online-store.ts (publishes ALL active unpublished; I add a HANDLES filter, nothing else) — reused
- scripts/dd2-apply.ts (pattern for handle-scoped writes with main-tree .env.local), scripts/screenshot.ts
- _review/DD5/IMPORT.md (import record), _review/DD2/brief.md (7-point definition), DD6 before/after pattern
- Live: https://dayindayin-site.vercel.app/shop (checked in step below)
