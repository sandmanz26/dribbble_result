// Builds every project branch listed in projects.json into one static site:
//   out/index.html        project index
//   out/<slug>/           that branch's production build
// Each project keeps its own branch, dependencies and design; this file only assembles them.
import { execSync } from 'node:child_process'
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'

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
}

if (existsSync('thumbs')) cpSync('thumbs', 'out/thumbs', { recursive: true })
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])
const items = projects.map((p) => `
      <li>
        <a href="${p.slug}/">
          <span class="thumb ${p.kind === 'Mobile app' ? 'phone' : ''}"><img src="${p.thumb}" alt="" loading="lazy"></span>
          <span class="meta">${esc(p.kind)}</span>
          <strong>${esc(p.title)}</strong>
          <span class="brief">${esc(p.brief)}</span>
        </a>
      </li>`).join('')

writeFileSync('out/index.html', readFileSync('index.template.html', 'utf8').replace('<!-- PROJECTS -->', items))
console.log(`\nBuilt ${projects.length} projects into out/`)
