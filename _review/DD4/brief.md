# DD4 — sitewide accessibility violations
DoD (one line): a11y check shows 0 violations on home, /fine-art (all 7 categories + grid view), 3+ work pages, /shop, 1 product page, at 390 and 1280; tsc + next build green; reviewer verdict on disk.
Deliver-in: Vercel (push to main auto-deploys, per project CLAUDE.md). This worktree run does not push — post-run fast-forwards helm/DD4 into main; proof is therefore captured on a local `next start` production build of this branch, not the live URL.
Risk: visual-only changes to type scale/colours sitewide; a wrong call makes text slightly bigger/darker, revert = one git revert.
Mandate: proceed alone.

Assuming (conservative reading): thresholds from agents/helm-visual-qa.md step 5 — text >=4.5:1 (large >=3), copy >=14px at 390 (>=12px at desktop, meta), tap targets (buttons/inputs) >=44px tall, no wrapped CTAs, no horizontal overflow, axe wcag2a+2aa clean. "3 work pages" = /works/mariann, /works/purple-sun, /works/fireworks (+ /works/on-the-light-table); the DD1b slugs monument/no-title-tufted-face 404 and vase-on-stool redirects to /fine-art?view=grid&category=photography, so they cannot be checked directly. Product page = /shop/mug-shero-teal.

## Existing material
- _review/DD1b/a11y.md, _review/DD3/a11y.md (source violation lists, in main tree) — used as the baseline.
- DESIGN_SYSTEM.md / app/globals.css tokens — fixes made at token level first (--text-xs/--text-sm/--c-muted).
- Live site: https://dayindayin-site.vercel.app (pre-change baseline; checked indirectly via the DD1b/DD3 reports).
- Prior work: LOG.md DD1/DD1b/DD3 lines; DD1 already fixed heroCount and availLabel colour.
- None found elsewhere (searched _review/, LOG.md, QUEUE.md).
