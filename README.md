# Project briefs: deploy hub

> AI assistants: read [`AGENTS.md`](AGENTS.md) first. It explains the one-project-per-branch setup.

This branch (`main`) holds no project code. It builds every project branch into one Vercel site and
puts each project behind its own password:

| URL | Project | Branch | Password |
|---|---|---|---|
| `/project1/` | Wanderlog Gang (website) | `claude/modest-mayer-eyddvw` | `PR001` |
| `/project2/` | Proof (mobile app) | `claude/photo-video-marketplace-app` | `PR002` |
| `/project3/` | NuBrakes dual-brand (website + booking flow) | `claude/nubrakes-dual-brand` | `PR003` |
| `/project4/` | Scrapyard BC-01 (audio plugin UI) | `claude/busticated-audio-plugin` | `PR004` |
| `/project5/` | Nelum Vidyalaya (bilingual student management, V1 and V2) | `claude/student-portal-bilingual` | `PR005` |
| `/` and anything else | "Nothing to see here." | | |

- `build.mjs` clones each branch in `projects.json`, runs `npm ci && npm run build` and copies its
  `dist/` to `out/<slug>/`. Projects stay isolated: own branch, own dependencies, own design.
- `middleware.js` (Vercel Routing Middleware) runs before every request. Passwords are checked on the
  server; after a correct password the browser gets an HttpOnly cookie for that project's path only
  (30 days). Every file under `/<slug>/`, including JS, CSS and images, needs the cookie.

## Vercel setup
1. Import the repository in Vercel (or open the existing project).
2. Settings > Git > Production Branch: `main`.
3. Leave build settings on defaults; `vercel.json` sets the build command and output directory.
4. Deploy, then share links such as `https://<project>.vercel.app/project1/`.

The repository must stay public, or `build.mjs` needs a token to clone the project branches
(set `PROJECTS_REPO` to `https://<token>@github.com/<owner>/<repo>.git` in Vercel env vars).

Pushing to a project branch does not rebuild `main` by itself: redeploy `main` in Vercel, or call a
Vercel Deploy Hook after pushing a project branch.

## Passwords
Hardcoded in `middleware.js`. Because this repository is public, anyone reading the code on GitHub can see
them. To keep a password out of the code, set an environment variable in Vercel, e.g. `PASSWORD_PROJECT1`,
which overrides the hardcoded value. Changing `SECRET` in `middleware.js` signs everyone out.

## Adding a project
1. Add `{ "slug": "project3", "branch": "...", "title": "..." }` to `projects.json`.
2. Add `project3: 'PR003'` to `PASSWORDS` in `middleware.js`.
The project must build to `dist/` with relative asset paths (Vite `base: './'`) and a hash router.

## Local checks
```
npm install
npm test           # middleware: gate, cookies, redirects
node build.mjs     # full build into out/
```
