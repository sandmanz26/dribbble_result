// Builds every project branch listed in projects.json into one static site:
//   out/<slug>/   that branch's production build (served behind middleware.js)
// Each project keeps its own branch, dependencies and design; this file only assembles them.
import { execSync } from 'node:child_process'
import { cpSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'

const REPO = process.env.PROJECTS_REPO || 'https://github.com/sandmanz26/dribbble_result.git'
const projects = JSON.parse(readFileSync('projects.json', 'utf8'))
const run = (cmd, cwd) => execSync(cmd, { cwd, stdio: 'inherit' })

rmSync('out', { recursive: true, force: true })
rmSync('.projects', { recursive: true, force: true })
mkdirSync('out', { recursive: true })

for (const p of projects) {
  const dir = `.projects/${p.slug}`
  console.log(`\n> ${p.title}: ${p.branch}`)
  run(`git clone --depth 1 --single-branch --branch ${p.branch} ${REPO} ${dir}`)
  run('npm ci --no-audit --no-fund', dir)
  run('npm run build', dir)
  cpSync(`${dir}/dist`, `out/${p.slug}`, { recursive: true })
  noindexPages(`out/${p.slug}`)
}

// The root is intentionally empty; middleware.js answers "/" and gates each project.
writeFileSync('out/index.html', '<!doctype html><meta charset="utf-8"><meta name="robots" content="noindex, nofollow"><title>Nothing to see here</title><p>Nothing to see here.</p>')
writeFileSync('out/robots.txt', 'User-agent: *\nDisallow: /\n')
console.log(`\nBuilt ${projects.length} projects into out/`)

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
