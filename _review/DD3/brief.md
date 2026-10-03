# DD3 — wire the photos found in Dropbox
DoD: finds marked USE (and MAYBE only where the site image is a process shot/missing) uploaded to Vercel Blob in works/<category>/<slug>, hero/gallery set in lib/data.ts, new works only for finished full shots with a sourced title; no process shot as hero; digital other-works skipped; before/after screenshots; reviewer verdict. Gate: npx tsc --noEmit; next build.
Deliver-in: Vercel (push to main auto-deploys; Blob store already used by lib/data.ts). Worktree rule: runner does not push, post-run fast-forwards to main — so "after" screenshots are of a local production build of this branch plus the Blob URLs, live-page recheck happens after merge.
Risk: low — images are additive at new Blob paths (no overwrite of existing blobs); revert = git revert.
Mandate: proceed alone.

## Existing material
- _memo/DROPBOX_FINDS.txt + _memo/dropbox_finds/<target>/ (main tree, untracked) — the staged finds, 38 MB
- _memo/STINE_FINE_ART_BRIEF_2026-10-03.txt — titles/medium source (PHOTO-NEEDED section)
- lib/data.ts — current slugs/hero/gallery (BLOB base 29kekabbrd49avje.public.blob.vercel-storage.com/works)
- Live: https://dayindayin-site.vercel.app/works/<slug> (checked in before-captures)
- Prior work: LOG.md Dropbox sweeps 2026-07-18 / 2026-08-02; DD1 (copy/titles) merged to main.

## Assumptions
- Decision (Sebastian 2026-10-03): other-works/ digital pieces skipped; Flickr out of scope.
- New file names (never overwrite old blobs) so image-optimizer caches can't serve stale bytes.
- MAYBE mariann (can't tell which parent), purple-flower, yarn: site already has genuine non-process shots -> not touched. cat-doll: site shot is a process shot -> use finished doll find as hero.
- works-2022plus (6 Camera Uploads shots): finished but NO title or medium in the brief or any Dropbox folder name (they are phone-stream files). Assuming X because inventing titles for Stine's art is worse than a gap: not added; listed as follow-up. The Bather: brief names it ("hende der bader"), title "The Bather", painting; large vs small unknown -> one work, sizes omitted.
