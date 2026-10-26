PASS
phase: live (dayindayin-site, Vercel)
traffic: low
revert: yes (git revert; no Gelato/Shopify writes were made)
externals: no (Gelato import and D4 Shopify archive are explicitly left to Sebastian, not executed)

Verified:
- IMPORT.md is 18 lines, one action, "you should see", fallback; fits one phone screen. csv_validation.txt "ALL PASS" (header, UID in live template 18600284, same UID as the 31 live horizontal prints, Publish=Yes, URLs 200). dpi table present: 677/484/342 dpi at 6x8/A4/A3.
- `file` confirms the 4 PNGs are 6000x4000 (flowers/Blue Flower, Dead Flowers, Red and Green Moss; various/Taped Objects). Other files untouched.
- D3 shows "RESOLVED ... OK, all 4" in DECISIONS_NEEDED.md; D4 is a single yes/no and is in NEEDS-YOU.md. brief.md has Existing material, Deliver-in, Risk, Mandate. Gate: tsc 0, build 0, csv pass. HEAD 668d16b exists. No TODO/lorem in touched docs/scripts; no template files touched.
- Nothing web-visible changed, so no screenshots/a11y required.

Findings:
- Real dependency: CSV image URLs point at raw GitHub main, which still serves the 1500px originals (validation line says origin serves ~0.6 MB vs 17 MB local). If Sebastian imports before the push, he gets soft products. IMPORT.md covers this only in a bottom "Soft preview?" line; it should be a precondition at the top. Minor, not a blocker.
- helm/DD5 carries ProductCard.tsx and lib/shopify/products.ts changes from the merged DD2 branch (not DD5 work); they build clean but are outside this item's brief.
- Outcome by the DoD's method (prep everything, hold external steps); no divergence.

Quality 8/10: complete and honest proof, correct scope on external actions; deducted for the buried push-first precondition.
