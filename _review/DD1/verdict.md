FAIL: no a11y.md (web-visible item requires A11Y: PASS), plus an invented medium still renders on touched works
phase: live
traffic: low (per caller; project CLAUDE.md has no HELM blast-radius line)
revert: yes (git revert)
externals: no

Verified: gate.txt green (tsc + next build exit 0); commits 7a9acd2 and f9ac9f9 exist; 390 and 1280 screenshots present for all categories and 3 PDPs. fidelity not applicable (no design reference). Live URL checks are deferred until merge, as the caller said.
Brief fidelity is good. All 12 redirects in next.config.ts match the brief (apple-scraps, colour-study, green-background, vase-on-stool, person-walking, seb-livingroom, hc-andersen, minnie-mouse, tufting-on-embroidered-background, pink-bag, polaroids-on-fabrics, theres-nothing-here). Copy was stripped of invented lines. Hiding, the digital category, the unframed note, and the Mariann, Purple Sun, det-er-bare-tanker and blue-branch availability notes are all handled. The judgment calls are reasonable, including withholding the "Rogerbakken" address and the sold:true flag, which matches the Purple Sun pattern.

Blockers:
1. `_review/DD1/a11y.md` does not exist. The rule is that web-visible work needs it with first line `A11Y: PASS`, so this is an automatic FAIL.
2. Invented facts still render. In pdp-buddha-390.png the Medium row says "Acrylic and oil stick on canvas" and the Location row says "Copenhagen, Denmark". Neither is in the brief, and the brief says the Buddha work is wrapped in plastic, so its medium is unknown. The cause is the CATEGORY_MEDIUM fallback in `app/works/[slug]/page.tsx`: painting works with no `materials` field show a generic medium. This affects every touched painting without a materials value (universe-1/2/3, universe-collection, buddha, and so on). It breaks G2 ("remove invented facts"). Fix: omit the Medium row when `materials` is empty, or set it explicitly only where Stine stated it.
3. Minor: the Buddha 390 page shows the cookie banner overlapping the copy in the proof screenshot. Capture the screenshots with the banner dismissed.

Fix the two blockers (a11y.md via helm-visual-qa, and the medium fallback) and re-review.

Quality 6/10: the content and redirect work is careful and faithful, but the missing a11y proof and the generic medium fallback undercut the "Stine's facts only" brief.
