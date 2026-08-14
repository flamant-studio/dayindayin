# Handover — resolve the dayindayin / dayindayin-site duplicate
*From: Cowork (portfolio audit session), 2026-08-14 · To: Claude Code, run from `~/Documents/FLAMANT/dayindayin-site`*

## What happened

The Portfolio Auditor has flagged "dayindayin and dayindayin-site are duplicate repos — pick one" for several runs. Investigated properly this session: **there is nothing to merge.** They are two clones of the *same* GitHub repository, `https://github.com/flamant-studio/dayindayin.git`. `dayindayin/` is simply a stale checkout that stopped being used on 2026-07-19. Sebastian has approved deleting it outright, plus a cleanup pass on this repo.

## Proof (already verified, do not redo — but do re-verify step 1 before deleting)

| Check | Result |
|---|---|
| `git remote -v` in both | Identical — `flamant-studio/dayindayin.git` |
| `dayindayin` HEAD | `cd99573` (2026-07-19) — "Merge origin (dayindayin-site history) + commit pre-existing elephant images" |
| `dayindayin-site` HEAD | `cbe6bc4` (2026-08-04) — "LB-3: document newsletter tagging + existing-customer opt-in fix" |
| Is `cd99573` an ancestor of `cbe6bc4`? | **Yes** — `git merge-base --is-ancestor` passes. dayindayin is 55 commits behind, on the same line of history. |
| Commits in `dayindayin` not in `dayindayin-site` | **0** |
| Files in `dayindayin`'s working tree not in `dayindayin-site`'s | **0** (of 447 tracked files) |
| `dayindayin` working tree | Clean — no untracked, no modified |
| `dayindayin-site` `main` vs `origin/main` | Equal — everything is pushed |
| Disk | `dayindayin/` = **1.7 GB** (716 MB `.git`, 928 MB images) |

Nothing unique exists in `dayindayin/`. Every byte is either in this repo or on GitHub.

## Your move — three tasks, in this order

### 1. Re-verify, then delete `dayindayin/`
Confirm the ancestry check still passes before removing anything (cheap, and it's the one thing standing between "safe delete" and "lost work"):

```bash
cd ~/Documents/FLAMANT/dayindayin-site
DD=$(git -C ~/Documents/FLAMANT/dayindayin rev-parse HEAD)
git -C ~/Documents/FLAMANT/dayindayin status --porcelain          # must print nothing
git merge-base --is-ancestor "$DD" HEAD && echo "SAFE TO DELETE"
```

Success = `status` prints nothing **and** `SAFE TO DELETE` appears. If either fails, stop and report — do not delete.

Then remove the folder. It is recoverable via `git clone https://github.com/flamant-studio/dayindayin.git` if ever needed.

### 2. Deal with the 22 uncommitted files here
`git status` in this repo shows 22 untracked files, all real work that has never been committed:

- **13 audit/check scripts** in `scripts/` — `check-framed-shopify.ts`, `check-gelato-framed.ts`, `audit-dad-caps.ts`, `check-canary-state.ts`, `compare-stuck-variants.ts`, `check-missing-descriptions.ts` and similar. These look like one-off diagnostic tooling from the framed-variant and Gelato work.
- **3 PNGs** — `DayInDayIn Images/shero/shero_{blue,purple,teal}_clean.png`
- The remaining 6 — inspect and judge.

Read each one and sort into: **commit** (reusable tooling or real assets — most of the `check-*` scripts probably qualify, and per the Bible's deterministic-rail rule a diagnostic that gets run twice belongs in the repo), or **gitignore** (genuinely throwaway scratch). Don't delete anything without saying which and why. Commit in one or two clearly-messaged commits and push.

### 3. Prune the stale worktrees
Three agent worktrees under `.claude/worktrees/` are all marked `prunable`, all parked on the same old commit `056cf7c`:

```bash
cd ~/Documents/FLAMANT/dayindayin-site && git worktree prune -v && git worktree list
```

Success = only the main worktree remains in the list. Then delete the three now-orphaned `worktree-agent-*` branches if they hold nothing (`git branch -D` after confirming each is merged or empty).

### 4. Update the docs so the auditor stops flagging it
- `~/Documents/FLAMANT/CLAUDE.md` — remove the `dayindayin/ ← sister repo of dayindayin-site` line from the folder tree, and drop "sister repo" from the dayindayin-site PROJECTS entry.
- `~/Documents/FLAMANT/dayindayin-site/LOG.md` — one dated entry recording the deletion and what was committed.

## Notes / decisions taken

- **Folder name stays `dayindayin-site`** even though the GitHub repo is `dayindayin`. Renaming would break paths in the master `CLAUDE.md`, PORTFOLIO.md links, `.vercel/`, and any local tooling — not worth it for cosmetic consistency. Flagging the mismatch here so it isn't rediscovered as a mystery later.
- The `dev` branch on origin is 320 commits behind `main` and has nothing `main` lacks. Not touched in this pass; worth deleting on GitHub eventually.
- `.env.local` exists only in `dayindayin-site` — do not copy, move, or read it during any of the above.
