# DD1 — Fine Art pass 2 (Stine's 2026-10-03 recording)

DoD (one line): lib/data.ts, next.config.ts redirects and fine-art/PDP category plumbing implement the brief's EMBROIDERY/PAINTING/PHOTOGRAPHY/MIXED/HANDHOOKING/NEW CATEGORY/GLOBAL sections with Stine's facts only; tsc clean, next build green, pushed to main, live slugs redirect, category pages screenshotted at 1280×800 + 390×844, before→after table in changes.txt, reviewer verdict.

Deliver-in: Vercel (push to main auto-deploys https://dayindayin-site.vercel.app — per project CLAUDE.md). Worktree run: runner commits on helm/DD1; post-run fast-forwards into main and pushes, then live checks.
Risk: renaming/removing slugs breaks indexed /works/ URLs if a redirect is missed; wrong copy on a public art portfolio. All reversible with git revert.
Mandate: proceed alone (no accounts, money, or external messages; taste calls already made by Stine in the brief).

Blast radius: phase live; traffic low (dayindayin.dk DNS not pointed, Shopify checkout paused per LOG 2026-08-29; project CLAUDE.md has no HELM blast-radius line); revert yes (git revert); externals no.

## Assumptions
- Brief's "red-to-blue" = existing slug `red-to-blue-broderi` (slug kept, copy fixed).
- "default" removal: no work with slug `default` exists in lib/data.ts; nothing to do (noted in changes.txt).
- Polaroids merge: survivor slug `polaroids`, category mixed, gallery = both works' images; `polaroids-on-fabrics` redirects to it.
- Hidden = new optional `hidden` flag on Work; hidden works are excluded from `works` (grid, sitemap, search, static params) and their URL redirects (temporary) to the category. theres-nothing-here only.
- office-shot was on the page-level HIDDEN_SLUGS; the brief says it is "a work in itself" -> unhidden.
- Digital category: only Bird Man exists as a fine-art work; Tourism and the Shiro/Neko drawings are shop products with no work entry (no images/records invented).
- Items needing new photos stay as is with copy fixed, flagged in changes.txt PHOTO-NEEDED. No Dropbox work in this item (that is DD3).
- Shop section (S1-S7) is DD2, not here.
- Five CONFIRM items on stated defaults: 1 collage-bw title (keep "Collage (Black & White)" is wrong per Stine -> working title below), 2 Mariann pair title (keep "Mariann"), 3 tufted face (working "Cut-Out Face"), 4 vase-on-stool removed, 5 tufting single leaving Art Prints (DD2).

## Existing material
- _memo/STINE_FINE_ART_BRIEF_2026-10-03.txt and _memo/STINE_FINE_ART_TRANSCRIPT_2026-10-03.txt (main tree) — the source of truth.
- Method precedent: commit 9691a61 (Tufting pass), LOG.md 2026-08-30 entry.
- lib/data.ts, next.config.ts, app/fine-art/page.tsx, app/works/[slug]/page.tsx, app/about/page.tsx, lib/motifs.ts (bird-man fineArtHref) — existing plumbing reused.
- Live site https://dayindayin-site.vercel.app — checked after deploy.
- Searched: _review/, LOG.md, DECISIONS_NEEDED.md for prior DD1 work: none.
