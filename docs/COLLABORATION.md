# Two Claude sessions on one repository

The owner works with two Claude Code sessions at the same time:

| Name | Where it runs | Notes |
|---|---|---|
| `cloud` | Claude Code on the web (a fresh container per session) | Anything not pushed is lost when the container is reclaimed |
| `desktop` | Claude Code on the owner's computer | Has the owner's files, browser and Figma; the clone stays on disk between sessions |

Both push to the same GitHub repository (`sandmanz26/dribbble_result`). This file is how they avoid
overwriting each other. Read it after `AGENTS.md`, and follow it in every session.

## 1. The rule in one line

**One branch has one owner at a time, and ownership is written in `docs/CLAIMS.md` on `main`
before any work starts.** The other session may read that branch, but never pushes to it.

## 2. Start of every session

```bash
git fetch origin --prune
git switch main && git pull --ff-only origin main
cat docs/CLAIMS.md                 # who owns what right now
```

1. Find the branch you were asked to work on in `docs/CLAIMS.md`.
   - **Claimed by the other session:** stop and tell the owner. Do not edit, build into or push
     to that branch. Reading it is fine.
   - **Free, or claimed by you:** claim or refresh it (section 3), then start.
2. Bring the project branch up to date before touching it:
   ```bash
   cd ../<project-folder>          # its worktree (AGENTS.md section 6)
   git pull --ff-only origin <branch>
   ```
   If `--ff-only` fails, the branch has commits you do not have. Stop and look before changing anything.

## 3. Claiming and releasing

`docs/CLAIMS.md` has one row per branch that someone is working on. To claim:

```bash
git switch main && git pull --ff-only origin main
# add or edit your row in docs/CLAIMS.md
git commit -am "Claim <branch> for <cloud|desktop>"
git push origin main
```

- If the push is rejected, the other session pushed to `main` first. Run
  `git pull --rebase origin main` (this replays only your own unpushed commit), check that nobody
  claimed the same branch in the meantime, then push again. If they did, theirs stands; tell the owner.
- **Release** the row (delete it) when the work is pushed and the owner has seen it, with a commit
  `Release <branch> from <cloud|desktop>`.
- A claim older than 3 days with no commits on its branch may be released by the other session.
  Tell the owner in the same reply.
- The owner can override any claim by saying so. Record the new owner in the row.

## 4. New projects: reserve the number first

Two sessions starting a brief at the same time would both pick the next `projectN`. To prevent that,
reserve before scaffolding:

1. Pull `main`. Look at the highest `projectN` in `projects.json` **and** in `docs/CLAIMS.md`.
2. Add a row to `docs/CLAIMS.md` with the next number, the branch name and the password you will
   use (a fresh random `xx-xxxx-xxxx`). Commit `Reserve projectN for <cloud|desktop>` and push.
3. Only then create the orphan branch (AGENTS.md section 6). Check first that the branch name does
   not already exist on the remote: `git ls-remote --heads origin claude/<name>`.
4. When the project is registered in `projects.json` and `middleware.js`, delete the reservation row
   in the same commit.

Never reuse a password or a localStorage prefix that appears anywhere in `AGENTS.md` or
`docs/CLAIMS.md`.

## 5. Working on `main` (the deploy hub)

`main` is shared, so both sessions edit it. Keep `main` commits small and frequent, and always pull right
before editing:

```bash
git switch main && git pull --ff-only origin main
# edit
npm test && node build.mjs        # before every push to main
git push origin main               # rejected? git pull --rebase origin main, re-run npm test, push
```

- The files that conflict most are `projects.json`, `middleware.js`, `test/middleware.test.mjs`,
  `AGENTS.md`, `docs/RECAP.md` and `docs/proposals.md`. Add your own entries. Never reorder,
  reformat or rewrite the other session's lines.
- If a rebase conflicts, keep **both** sides' entries. If you cannot tell what the other side meant,
  stop and ask the owner. Do not drop their lines.
- Every push to `main` redeploys the live site. Do not push `main` while the other session's project
  branch is half-finished **and** registered; the build would publish it as it is. If in doubt, ask.
- Never force-push anything (also AGENTS.md section 9). `git pull --rebase` is only allowed for your
  own commits that are not pushed yet.

## 6. Working on a project branch

- Push small commits often, at least at the end of every task. The cloud container can disappear at any
  time.
- Before ending a session, update the **Status** section at the top of that branch's `README.md`:
  what was done, what is next, and anything half-done. This is the hand-over note the other session
  reads if the branch changes owner.
- Do not touch another project's branch to "share" something. Projects never share code
  (AGENTS.md section 2).
- If a push to a project branch is rejected, someone else pushed to it. This should not happen with
  claims, so stop and tell the owner instead of merging blindly.

## 7. Machine-specific things

| Topic | `cloud` | `desktop` |
|---|---|---|
| Folders | `/home/user/<project>` worktrees next to `/home/user/dribbble_result` | Same layout recommended: a `dribbble_result` clone plus one worktree folder per project branch beside it |
| Live site | Cannot open the Vercel domain (proxy) | Should test the live URL with its password after each `main` push |
| Photos | Open Images via S3 works; many hosts are blocked | Any source the owner approves; still self-host as WebP and credit (AGENTS.md section 5) |
| Scratch files | Session scratchpad, never committed | Keep outside the repo or in an ignored folder |
| Design-taste skill output | `.taste-skill/` (ignored per project) | Same; add it to the project's `.gitignore` if missing |

Both machines must commit `package-lock.json` changes made by `npm install`. Never commit
`node_modules/`, `dist/`, `out/` or `.projects/`.

## 8. Commits

Use the same style on both machines (AGENTS.md section 9): imperative summary, short body explaining
why. Add one line to the body saying which session made it, `Session: cloud` or `Session: desktop`,
so `git log` shows who changed what. No AI model names or IDs.

## 9. When something goes wrong

| Situation | Do |
|---|---|
| Both sessions edited the same branch | Stop both. Push nothing more. Tell the owner which commits each made (`git log origin/<branch>..HEAD` and the reverse) |
| `main` build broke after the other session's push | Do not fix their project. Tell the owner; a fix to the hub files themselves is fine |
| A claim blocks urgent work | Ask the owner to reassign it; do not take it silently |
| You find uncommitted changes you did not make (desktop only) | They are the owner's or the other session's. Do not discard them; ask |
