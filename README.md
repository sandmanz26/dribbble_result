# Project briefs: deploy hub

This branch (`main`) holds no project code. It assembles every project branch into one static site:

```
/                  index of projects
/wanderlog-gang/   branch claude/modest-mayer-eyddvw
/proof/            branch claude/photo-video-marketplace-app
```

`build.mjs` clones each branch listed in `projects.json`, runs `npm ci && npm run build` inside it and
copies its `dist/` to `out/<slug>/`. Projects stay isolated: own branch, own dependencies, own design.

## Vercel
1. Import the repository in Vercel (or open the existing project).
2. Settings > Git > Production Branch: `main`.
3. Leave build settings on "Override: off". `vercel.json` sets the build command (`node build.mjs`),
   output directory (`out`) and `trailingSlash: true` (needed so `/proof` becomes `/proof/` and relative asset paths resolve).
4. Deploy.

The repository must stay public, or `build.mjs` needs a token to clone the project branches
(set `PROJECTS_REPO` to an authenticated URL such as `https://<token>@github.com/<owner>/<repo>.git`).

Pushing to a project branch does not rebuild `main` on its own. Redeploy `main` in Vercel, or create a
Vercel Deploy Hook and call it after pushing a project branch.

## Adding a project
Add one entry to `projects.json` (slug, branch, title, kind, brief, thumb) and drop a thumbnail in `thumbs/`.
The project must build to `dist/` with relative asset paths (Vite `base: './'`) and a hash router.

## Local build
```
node build.mjs
npx serve out    # or: cd out && python3 -m http.server
```
