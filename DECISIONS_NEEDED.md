# DECISIONS_NEEDED — dayindayin-site

## D1 — RESOLVED 2026-10-04 06:2x (Sebastian): find the RAW / full-size originals first (Dropbox finds in _memo/DROPBOX_FINDS.txt, Dropbox, the Mac); if none exist for a piece, upscale locally (free tool, no new costs) and put ONE 100 % test crop per piece in _review/DD2/ for Sebastian before any import. Polaroids: same. — DD2: new art prints from 1500×1000 sources (and Polaroids)
Question: import Dead Flowers, Taped Objects, Red and Green Moss, Blue Flower on Green Wood as art prints from the 1500×1000 px files (~127 dpi at A4, soft), or upscale first? And does Stine have a print-ready Polaroids file?
Why it blocks: the Gelato CSV import is Sebastian's (process contract) and print quality is his taste call. CSV is ready: `DayInDayIn Images/gelato_dd2_new_art_prints_export.csv`.
Options: (a) import as-is; (b) upscale first; (c) skip these works.
Recommendation: (b) upscale, then import. Polaroids: ask Stine for a file.
Done 2026-10-26: SHERO art prints + broken caps archived (DD6); 4 new art prints imported to Gelato (orchestrator, Sebastian's Chrome). Publish + 7-point check: DD7 (runner).

## D2 — DD2 new art prints: import soft 1500×1000 sources or upscale first?
Why it blocks: Gelato CSV import is Sebastian's step; sources ~127 dpi at A4; Polaroids has no print file. Options: import as-is / upscale first. Recommendation: upscale first. See .helm-wt/DD2/_review/DD2/BLOCKED.md
**ANSWER (orchestrator 2026-10-04, per Sebastian's D1 ruling 2026-10-03):** upscale first, locally; one test crop per piece to Sebastian before any Gelato import. Polaroids: skip until a print file exists.

## D3 — RESOLVED 2026-10-04 13:0x (Sebastian: "OK, all 4") — DD2: do the 4 upscaled test crops look print-worthy?
Approved: blue-flower, dead-flowers, red-green-moss, taped-objects. Full 6000×4000 upscales made by DD5 (2026-10-26); nothing further to decide.

## D-DD2 — one action left (updated by DD5 2026-10-26): upload the Gelato CSV
The 4 full upscales are committed over the same-named files (the CSV URLs already point at them) and ship with main; CSV validated against the live template. Your step: Gelato UI → import `DayInDayIn Images/gelato_dd2_new_art_prints_export.csv`. Steps with "you should see": `_review/DD5/IMPORT.md`.

## D4 ✅ ANSWERED 2026-10-26 18:14 (Sebastian: "yes, these all go") — DD5: archive 6 live Shopify products (yes/no)?
Question: OK to run `npx tsx scripts/dd2-apply.ts`, which sets exactly these 6 to ARCHIVED (reversible: set back to ACTIVE)?
- SHERO — III — Fine Art Print (`shero-iii-fine-art-print`), SHERO — Indigo — Fine Art Print (`shero-indigo-fine-art-print`), SHERO — Purple — Fine Art Print (`shero-purple-fine-art-print`) — your 2026-10-03 call (art prints only; SHERO mugs/totes/cards stay).
- Neko Paw Cap — Blue / — Lilac / — Yellow (`neko-paw-cap-blue|lilac|yellow`) — artwork on the mockups is wrong (clipped paw / wrong design / garbled patch) and can't be fixed by data.
Touches nothing else (Neko Paw Cap — Pink is left as is; nothing is deleted). Recommendation: yes. Reply "D4 yes" or "D4 no".
