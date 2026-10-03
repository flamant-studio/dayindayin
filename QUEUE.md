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

## DD2 — Shop tweaks from the same recording (S1–S7)          `TODO`
Status: WAITING after_any=DD1
Size: M
Source: brief section SHOP (S1–S7), transcript [52:59–62:11]; CLAUDE.md asset-flow + process contract (Sebastian owns Gelato templates — if a fix needs a template change, write it up for him instead of improvising).
Fix: product type visible on every product card (art print vs postcard vs cap…); remove Shiro from Art Prints; remove the one tufting single that doesn't suit an art print (identify it on the live Art Prints page; name it in the report); add art-print products for the fine-art photographs/paintings Stine confirmed (dead flowers, taped objects, red & green moss, polaroids, blue flower on green wood, Sri Lanka masks if file quality allows) via the existing manifest/Gelato pipeline; investigate the red/American Dad cap renders and drop the broken colourways if they can't be fixed by data.
DoD: live shop pages screenshot before/after; every new product passes Sebastian's 7-point "verified" definition in CLAUDE.md; reviewer verdict.
Gate: npx tsc --noEmit; next build; reviewer verdict.

## DD3 — wire the photos found in Dropbox          `TODO`
Status: PARKED until the cloud Dropbox search has written _memo/DROPBOX_FINDS.txt (orchestrator unparks)
Size: M
Source: _memo/DROPBOX_FINDS.txt + _memo/dropbox_finds/ (images staged by the cloud search); brief section PHOTO-NEEDED.
Fix: for each find marked USE: upload to Vercel Blob in the existing works/<category>/<slug> layout, set hero/gallery, add new works for missing pieces only where the find is a finished full shot (title/medium from the brief, otherwise from Stine's own Dropbox folder names). Never use a process shot as hero.
DoD: live pages updated; before/after screenshots; reviewer verdict.
Gate: npx tsc --noEmit; next build; reviewer verdict.
