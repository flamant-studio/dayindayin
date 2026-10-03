FAIL: a11y.md says A11Y: FAIL (9 violations); HELM readability rule makes that a FAIL whatever else passed
phase: live
traffic: low (FLAMANT root HELM blast radius line says low; this project's CLAUDE.md has no HELM line, so assumed)
revert: yes (git revert + Vercel redeploy; new blobs are additive at new paths)
externals: no (images and copy only)

Verified:
- Content is ship-ready. The DoD is met: finds wired, no process shot as hero, gate green (gate.txt: tsc + next build), 390 and 1280 shots exist, Blob URLs return 200, commit 84fc48e exists, Existing-material section present. No design reference, so no fidelity.md is needed. Quality of the content work: 8/10.
- The a11y violations do come from sitewide components and the shared work template. The DD3 diff against main touches only lib/data.ts (25 lines) plus _review files, so it cannot have introduced them. They would exist on main today.
- Why this is still FAIL: the rule I apply says A11Y: FAIL means FAIL, and a reviewer cannot waive it. Excusing it as "pre-existing" would be a rule amendment, which only Sebastian or the constitution can make.
- Your claim that a sitewide a11y item is already tracked is only partly true. QUEUE.md has no such item. DD1b is "Stine's answers to the five CONFIRM items", and it is FAIL for this same reason (QUEUE.md line 14 says "Needs a sitewide a11y item or rule amendment"). So the blocker is untracked.
- Fix path, one of two: (a) add a sitewide a11y item (footer 11px, tap targets, availLabel 3.86:1 contrast, CartDrawer aria-hidden-focus), merge it, then re-review DD3, which should then PASS with no further content work; or (b) amend the rule so that a11y violations not in the diff are non-blocking, after which DD3 and DD1b become PASS.
- Minor, not blocking: the bather hero is a tight crop and repeats as the first gallery tile. Live recheck after merge is still outstanding. The 6 works-2022plus shots are a justified follow-up (no title source).
