// Builds every project branch listed in projects.json into one static site:
//   out/<slug>/   that branch's production build (served behind middleware.js)
// Each project keeps its own branch, dependencies and design; this file only assembles them.
import { execSync } from 'node:child_process'
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'

const REPO = process.env.PROJECTS_REPO || 'https://github.com/sandmanz26/dribbble_result.git'
const projects = JSON.parse(readFileSync('projects.json', 'utf8'))
const run = (cmd, cwd) => execSync(cmd, { cwd, stdio: 'inherit' })

// Build cache: a project whose branch head has not moved since the last deploy is copied from
// the cache instead of being cloned, installed and built again. Vercel keeps node_modules between
// builds, so the cache lives there (vercel.json uses `npm install`, which leaves it in place).
// Set NO_BUILD_CACHE=1 to force a full rebuild.
const CACHE = process.env.BUILD_CACHE_DIR || 'node_modules/.cache/project-builds'
const useCache = !process.env.NO_BUILD_CACHE
const heads = new Map()
if (useCache) {
  try {
    const out = execSync(`git ls-remote --heads ${REPO}`, { encoding: 'utf8' })
    for (const line of out.trim().split('\n')) {
      const [sha, ref] = line.split('\t')
      heads.set(ref.replace('refs/heads/', ''), sha)
    }
  } catch (e) {
    console.log('Could not read branch heads, building everything:', e.message)
  }
}
let reused = 0

rmSync('out', { recursive: true, force: true })
rmSync('.projects', { recursive: true, force: true })
mkdirSync('out', { recursive: true })

for (const p of projects) {
  const dir = `.projects/${p.slug}`
  const sha = heads.get(p.branch)
  const cached = sha && `${CACHE}/${p.slug}/${sha}`
  if (cached && existsSync(`${cached}/index.html`)) {
    console.log(`\n> ${p.title}: ${p.branch} unchanged at ${sha.slice(0, 7)}, reusing the cached build`)
    cpSync(cached, `out/${p.slug}`, { recursive: true })
    reused++
    continue
  }
  console.log(`\n> ${p.title}: ${p.branch}`)
  run(`git clone --depth 1 --single-branch --branch ${p.branch} ${REPO} ${dir}`)
  run('npm ci --no-audit --no-fund', dir)
  run('npm run build', dir)
  cpSync(`${dir}/dist`, `out/${p.slug}`, { recursive: true })
  noindexPages(`out/${p.slug}`)
  if (cached) {
    // Keep only the newest build per project so the cache does not grow.
    const built = execSync('git rev-parse HEAD', { cwd: dir, encoding: 'utf8' }).trim()
    rmSync(`${CACHE}/${p.slug}`, { recursive: true, force: true })
    if (built === sha) cpSync(`out/${p.slug}`, cached, { recursive: true })
  }
  rmSync(dir, { recursive: true, force: true })
}

// The root is intentionally empty; middleware.js answers "/" and gates each project.
writeFileSync('out/index.html', '<!doctype html><meta charset="utf-8"><meta name="robots" content="noindex, nofollow"><title>Nothing to see here</title><p>Nothing to see here.</p>')
writeFileSync('out/robots.txt', 'User-agent: *\nDisallow: /\n')
console.log(`\nBuilt ${projects.length} projects into out/ (${reused} reused from the cache, ${projects.length - reused} built)`)

// Every page carries its own noindex too, in case a header is ever lost (vercel.json and the
// middleware also send X-Robots-Tag). A page that already has a robots meta is left alone.
function noindexPages(root) {
  for (const entry of readdirSync(root, { withFileTypes: true, recursive: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.html')) continue
    const file = `${entry.parentPath ?? entry.path}/${entry.name}`
    const page = readFileSync(file, 'utf8')
    if (/<meta[^>]+name=["']robots["']/i.test(page)) continue
    writeFileSync(file, page.replace(/<head([^>]*)>/i, '<head$1><meta name="robots" content="noindex, nofollow">'))
  }
}
