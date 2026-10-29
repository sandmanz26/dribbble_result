// Password gate for the project prototypes (Vercel Routing Middleware).
//
//   /<slug>/...  → needs that project's password, then serves the static build
//   anything else → "Nothing to see here."
//
// Passwords live here, server-side only; the browser only ever holds a signed
// cookie scoped to that project's path. PASSWORD_<SLUG> env vars override them.
import { next } from '@vercel/functions'

const PASSWORDS = {
  project1: 'PR001', // Wanderlog Gang
  project2: 'PR002', // Proof
  project3: 'PR003', // NuBrakes dual-brand
  project4: 'PR004', // Scrapyard BC-01
  project5: 'DRI05', // Nelum Vidyalaya student management
  project6: 'wp-3xsf-qcya', // Westpoint case study (private, under NDA)
  project7: 'cv-cqkr-rhyg', // Caravan group travel app
  project8: 'td-9ymu-nhd4', // Tend wellness ritual app
  project9: 'gt-m3bk-20lf', // GlobalTrade broker website and dashboards
  project10: 'fu-p6pu-f2la', // Faceup planogram restock app
  project11: 'ck-7rmz-q4hp', // Flock & Flame chicken and grill menu app
  project12: 'gs-k2vx-9dnb', // Golden Stone Logistics, China and Ghana freight website
  project13: 'og-7q0a-vvo8', // Oppsett, golf exercise setups on the real photo
  project14: 'db-2mmw-55ap', // Darb, bilingual Arabic and English Saudi logistics website
  project15: 'br-5zo1-i3nv', // Skill-to-Research Bridge, student and lab dashboards with a passport
  rawat: 'fd-w8tq-3jxc', // Rawat clinic operations, the owner's portfolio piece (same build as flowdirector)
  flowdirector: 'fd-w8tq-3jxc',
  selvedge: 'sv-4rkx-msbd', // Selvedge retail OS, portfolio case for the Dribbble retail ERP brief // Flow Director clinic operations prototype (Upwork, not a projectN slug)
}

// Nothing on this site may be indexed: every response says so, and robots.txt turns crawlers away.
const NOINDEX = 'noindex, nofollow, noarchive, nosnippet, noimageindex'
const ROBOTS_TXT = 'User-agent: *\nDisallow: /\n'

const COOKIE_DAYS = 30
const SECRET = 'project-briefs-gate-v1' // bump to sign everyone out

export const config = {
  matcher: '/:path*',
}

const passwordFor = (slug) => process.env[`PASSWORD_${slug.toUpperCase()}`] || PASSWORDS[slug]

async function tokenFor(slug) {
  const data = new TextEncoder().encode(`${SECRET}:${slug}:${passwordFor(slug)}`)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

const readCookie = (request, name) => {
  const header = request.headers.get('cookie') || ''
  const hit = header.split(';').map((c) => c.trim()).find((c) => c.startsWith(`${name}=`))
  return hit ? decodeURIComponent(hit.slice(name.length + 1)) : null
}

const html = (body, status, extra = {}) =>
  new Response(body, {
    status,
    headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'x-robots-tag': NOINDEX, ...extra },
  })

const PAGE_STYLE = `
  :root { --bg: #fafafa; --ink: #18181b; --muted: #71717a; --line: rgb(24 24 27 / 0.14); --danger: #b42318; color-scheme: light; }
  @media (prefers-color-scheme: dark) { :root { --bg: #111113; --ink: #f4f4f5; --muted: #a1a1aa; --line: rgb(244 244 245 / 0.16); --danger: #ff8a7a; color-scheme: dark; } }
  * { box-sizing: border-box; }
  html, body { height: 100%; }
  body { margin: 0; display: grid; place-items: center; padding: 24px; background: var(--bg); color: var(--ink);
    font: 16px/1.5 ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif; -webkit-font-smoothing: antialiased; }
  main { width: min(360px, 100%); }
  h1 { font-size: 22px; letter-spacing: -0.02em; font-weight: 620; margin: 0 0 6px; }
  p { margin: 0; color: var(--muted); }
`

const nothingPage = () => html(`<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex, nofollow">
<title>Nothing to see here</title><style>${PAGE_STYLE}</style></head>
<body><main><p>Nothing to see here.</p></main></body></html>`, 404)

const loginPage = (slug, error) => html(`<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex, nofollow">
<title>Password required</title><style>${PAGE_STYLE}
  form { display: grid; gap: 8px; margin-top: 28px; }
  label { font-size: 14px; font-weight: 600; }
  input { font: inherit; color: var(--ink); background: transparent; height: 48px; padding: 0 14px; border-radius: 10px; border: 1.5px solid var(--line); }
  input:focus { outline: none; border-color: var(--ink); }
  input[aria-invalid="true"] { border-color: var(--danger); }
  .error { color: var(--danger); font-size: 14px; font-weight: 500; }
  button { margin-top: 8px; height: 48px; border: 0; border-radius: 999px; background: var(--ink); color: var(--bg); font: inherit; font-weight: 600; cursor: pointer; }
  button:active { transform: scale(0.98); }
</style></head>
<body><main>
  <h1>This prototype is private</h1>
  <p>Enter the password you were given to open it.</p>
  <form method="post" action="/${slug}/">
    <label for="pw">Password</label>
    <input id="pw" name="password" type="password" autocomplete="current-password" autofocus required
      ${error ? 'aria-invalid="true" aria-describedby="pw-err"' : ''}>
    ${error ? '<p class="error" id="pw-err" role="alert">That password is not correct.</p>' : ''}
    <input type="hidden" name="hash" id="hash">
    <button type="submit">Open</button>
  </form>
</main>
<script>document.getElementById('hash').value = location.hash</script>
</body></html>`, 401)

export default async function middleware(request) {
  const url = new URL(request.url)
  const slug = url.pathname.split('/')[1]

  if (url.pathname === '/robots.txt') {
    return new Response(ROBOTS_TXT, { headers: { 'content-type': 'text/plain; charset=utf-8', 'x-robots-tag': NOINDEX } })
  }

  if (!slug || !passwordFor(slug)) return nothingPage()
  if (url.pathname === `/${slug}`) return Response.redirect(new URL(`/${slug}/${url.search}`, url), 308)

  const cookieName = `gate_${slug}`
  const token = await tokenFor(slug)

  if (request.method === 'POST' && url.pathname === `/${slug}/`) {
    const form = await request.formData()
    if (form.get('password') !== passwordFor(slug)) {
      await new Promise((r) => setTimeout(r, 600)) // slow down guessing
      return loginPage(slug, true)
    }
    const raw = String(form.get('hash') || '').replace(/[\u0000-\u001f\u007f]/g, '')
    const hash = raw.startsWith('#') ? raw : ''
    return new Response(null, {
      status: 303,
      headers: {
        location: `/${slug}/${hash}`,
        'set-cookie': `${cookieName}=${token}; Path=/${slug}/; Max-Age=${COOKIE_DAYS * 86400}; HttpOnly; Secure; SameSite=Lax`,
        'cache-control': 'no-store',
        'x-robots-tag': NOINDEX,
      },
    })
  }

  if (readCookie(request, cookieName) === token) return next()
  return loginPage(slug, false)
}
