FAIL: DD2 DoD not met (live removals and new art prints not done; no a11y.md; after_ proof is not the deployed result)
phase: live (dayindayin-site.vercel.app, checkout paused)
traffic: low (the project CLAUDE.md has no HELM blast radius line; the parent FLAMANT root says low)
revert: yes (the branch is git-revertable; the Shopify archives would be reversible)
externals: yes (live Shopify catalog writes and a Gelato CSV import)

Route: the DoD asked for live removals and new products. The runner only edited the manifest and CSV and wrote a handoff script, `scripts/dd2-apply.ts`. The Shopify writes were denied and never ran. The CSV import is Sebastian's job.

Verified:
- `gate.txt` ends with a clean build tail. `tsc` was not rechecked.
- `curl -sIL https://dayindayin-site.vercel.app/shop` returns 200.
- The `after_apparel_390.png` card shows "TANK TOP" under the title. S1 appears done, but it is branch work. I did not confirm it is deployed.
- `_review/DD2/a11y.md` is missing. The task is web-visible, so the readability rule makes this a FAIL.
- The brief has an `## Existing material` section. Both entries I opened are consistent with the brief.

Against the DoD:
- SHERO art prints removed: NOT DONE. They are still live; only the manifest and CSV rows were removed.
- Art prints for dead flowers, taped objects, red & green moss, polaroids and blue flower on green wood: NOT DONE. Only a CSV was prepared. Polaroids has no print file at all, and the 1500x1000 sources are soft at A4.
- Broken caps dropped: NOT DONE. The investigation is useful (artwork defects, no red cap exists) but nothing was archived.
- The 7-point verification on new products: not applicable, since no products exist.
- Before/after screenshots of the live shop: the `after_` shots show only the type label, with no catalog change.

Score 3/10. The label change and the cap diagnosis are real and specific. The handoff is honest. Three of the four fixes are undone.

What it needs: either rerun `scripts/dd2-apply.ts` with Shopify write access (or split DD2 so S1 ships alone), and add `a11y.md`. The new art prints are blocked on Sebastian's CSV import and on a decision about the 1500x1000 sources.
