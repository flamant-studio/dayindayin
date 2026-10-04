# DayinDayin — runner queue
Priority (Sebastian 2026-10-03): DayinDayin now sits alongside Blaze of Destruction — "Blaze is the project that happened to grow. DayinDayin is the project I always wanted to do." Goal: go live soon.
Read CLAUDE.md (autonomy, WHERE THINGS LIVE, push to main = deploy, proof on https://dayindayin-site.vercel.app).

## DD1 — Fine Art pass 2: copy, titles, categories, removals from Stine's 2026-10-03 recording          `TODO`
Status: DONE (PASS, awaiting post-run merge)
Size: M
Source: _memo/STINE_FINE_ART_BRIEF_2026-10-03.txt (the brief — follow it exactly; sections EMBROIDERY, PAINTING, PHOTOGRAPHY, MIXED MEDIA, HANDHOOKING, NEW CATEGORY, GLOBAL RULES) and _memo/STINE_FINE_ART_TRANSCRIPT_2026-10-03.txt (timestamps cited per line). Method = the Tufting pass, commit 9691a61 (renames with permanent redirects in next.config.ts, availabilityNote, series tags, hidden list).
Fix: lib/data.ts + next.config.ts redirects + fine-art page/category plumbing for the new 'digital' WorkCategory; merge the duplicate Polaroids works; remove apple-scraps, colour-study, green-background (+ vase-on-stool, default) with redirects to their category; hide theres-nothing-here. Rewrite copy to Stine's facts only — strip every invented line. Leave the five CONFIRM items on their stated defaults and list them in the report.
DoD: tsc clean, next build green, pushed to main, live pages checked on https://dayindayin-site.vercel.app (every renamed slug redirects; each category page screenshot 1280×800 + 390×844 in _review/DD1/); a before→after table of every work touched in _review/DD1/changes.txt.
Gate: npx tsc --noEmit; next build; reviewer verdict.

## DD1b — Stine's answers to the five CONFIRM items          `TODO`
Status: PASS, not merged rebase onto main conflicts — branch helm/DD1b + worktree left at .helm-wt/DD1b
Size: S
Source: Sebastian 2026-10-03 21:09, answering _memo/STINE_FINE_ART_BRIEF_2026-10-03.txt section CONFIRM.
Fix: (1) collage-bw -> title "Monument" (slug monument, permanent redirect). (2) mariann -> title "I drømmevæverens værksted" (keep the Mariann pair note); add the companion work "Min far, kejseren" (for Torben) as its pair ONLY when a finished photo exists (DD3 / _memo/dropbox_finds/) — until then mention it in Mariann's copy, no empty work page. (3) The tufted face behind glass (was tufting-on-embroidered-background) -> title "No title", slug no-title-tufted-face, redirect. (4) vase-on-stool STAYS — restore it if DD1 removed it (and drop its redirect). (5) Tufted art prints all stay (see DD2).
DoD: live pages checked on https://dayindayin-site.vercel.app, redirects work; LOG.md line.
Gate: npx tsc --noEmit; next build; reviewer verdict.

## DD2 — Shop tweaks from the same recording (S1–S7)          `TODO`
Status: BLOCKED D2 — new art prints need Sebastian's Gelato CSV import (+ live archive via scripts/dd2-apply.ts)
Size: M
Source: brief section SHOP (S1–S7), transcript [52:59–62:11]; CLAUDE.md asset-flow + process contract (Sebastian owns Gelato templates — if a fix needs a template change, write it up for him instead of improvising).
Fix: product type visible on every product card (art print vs postcard vs cap…); remove the SHERO art prints only (Sebastian 2026-10-03 21:09: "Shiro" in the brief = SHERO; remove only the art-print versions — SHERO — III, SHERO — Indigo, SHERO — Purple; SHERO mugs, totes, cards stay); KEEP all tufted art prints (Purple Sun, Round Earth, Floral Thing, Candy I — Sebastian: "Just leave the tufted ones in"); add art-print products for the fine-art photographs/paintings Stine confirmed (dead flowers, taped objects, red & green moss, polaroids, blue flower on green wood, Sri Lanka masks if file quality allows) via the existing manifest/Gelato pipeline; investigate the red/American Dad cap renders and drop the broken colourways if they can't be fixed by data.
DoD: live shop pages screenshot before/after; every new product passes Sebastian's 7-point "verified" definition in CLAUDE.md; reviewer verdict.
Gate: npx tsc --noEmit; next build; reviewer verdict.

## DD3 — wire the photos found in Dropbox          `TODO`
Status: PASS
Size: M
Source: _memo/DROPBOX_FINDS.txt + _memo/dropbox_finds/ (images staged by the cloud search); brief section PHOTO-NEEDED.
Decision (Sebastian 2026-10-03): digital works in other-works/ (Neko paw, Untitled_Artwork, Maske Mod, Geometric garden) are already on-site as Gelato products - do NOT add them as works. Flickr finds come later, out of scope.
Fix: for each find marked USE: upload to Vercel Blob in the existing works/<category>/<slug> layout, set hero/gallery, add new works for missing pieces only where the find is a finished full shot (title/medium from the brief, otherwise from Stine's own Dropbox folder names). Never use a process shot as hero.
DoD: live pages updated; before/after screenshots; reviewer verdict.
Gate: npx tsc --noEmit; next build; reviewer verdict.

## DD4 — fix the sitewide accessibility violations that block every verdict          `TODO`
Status: PASS — sitewide a11y fixed at tokens/shared components; check 0 violations on 15 pages x 390+1280; reviewer PASS. Branch helm/DD4.
Size: M
Source: _review/DD1b/a11y.md and _review/DD3 — "A11Y: FAIL — 35 violations", sitewide (not caused by DD1b/DD3); reviewer rule turns any a11y FAIL into an item FAIL. Sebastian's standing rule: readable pages, 4.5:1 contrast, no tiny grey text.
Fix: fix every violation at its source (design tokens / shared components first, DESIGN_SYSTEM.md), not per page. Then re-run the same a11y check on the pages DD1b and DD3 touched and set DD1b and DD3 to PASS if that was their only failure (their content work is done and live).
DoD: a11y check 0 violations on home, /fine-art (all categories), 3 work pages, /shop, 1 product page, mobile + desktop; gate green; reviewer verdict.
Gate: npx tsc --noEmit; next build; a11y check; reviewer verdict.
