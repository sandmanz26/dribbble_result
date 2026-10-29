// Runs the middleware against plain Requests (Node 18+). No Vercel account needed.
import assert from 'node:assert/strict'
import middleware from '../middleware.js'

const BASE = 'https://example.vercel.app'
const get = (path, cookie) => middleware(new Request(BASE + path, { headers: cookie ? { cookie } : {} }))
const post = (path, fields) => middleware(new Request(BASE + path, { method: 'POST', body: new URLSearchParams(fields) }))
const passed = (res) => res.headers.get('x-middleware-next') === '1'
const cookieOf = (res) => res.headers.get('set-cookie').split(';')[0]

const cases = [
  ['root shows nothing', async () => { const r = await get('/'); assert.equal(r.status, 404); assert.match(await r.text(), /Nothing to see here/) }],
  ['unknown path shows nothing', async () => assert.equal((await get('/project99/')).status, 404)],
  ['project without cookie asks for password', async () => { const r = await get('/project1/'); assert.equal(r.status, 401); assert.match(await r.text(), /type="password"/) }],
  ['assets are gated too', async () => assert.equal((await get('/project2/assets/index.js')).status, 401)],
  ['no trailing slash redirects', async () => { const r = await get('/project1'); assert.equal(r.status, 308); assert.equal(r.headers.get('location'), BASE + '/project1/') }],
  ['wrong password shows error', async () => { const r = await post('/project1/', { password: 'PR002' }); assert.equal(r.status, 401); assert.match(await r.text(), /not correct/) }],
  ['project1 accepts PR001 and keeps the deep link', async () => {
    const r = await post('/project1/', { password: 'PR001', hash: '#/trip/kyoto-in-bloom' })
    assert.equal(r.status, 303)
    assert.equal(r.headers.get('location'), '/project1/#/trip/kyoto-in-bloom')
    assert.match(r.headers.get('set-cookie'), /Path=\/project1\/; .*HttpOnly; Secure/)
    assert.ok(passed(await get('/project1/', cookieOf(r))))
    assert.ok(passed(await get('/project1/photos/kyoto-in-bloom-0-480.webp', cookieOf(r))))
  }],
  ['project3 accepts PR003', async () => { const r = await post('/project3/', { password: 'PR003', hash: '#/quote/vehicle' }); assert.equal(r.headers.get('location'), '/project3/#/quote/vehicle'); assert.ok(passed(await get('/project3/assets/index.js', cookieOf(r)))) }],
  ['project6 accepts its own password only', async () => {
    assert.equal((await post('/project6/', { password: 'PR006' })).status, 401)
    const r = await post('/project6/', { password: 'wp-3xsf-qcya' })
    assert.ok(passed(await get('/project6/', cookieOf(r))))
  }],
  ['project7 accepts its own password', async () => { const r = await post('/project7/', { password: 'cv-cqkr-rhyg', hash: '#/trip/kyoto/budget' }); assert.equal(r.headers.get('location'), '/project7/#/trip/kyoto/budget'); assert.ok(passed(await get('/project7/', cookieOf(r)))) }],
  ['project9 and project10 take their own passwords only', async () => { assert.equal((await post('/project9/', { password: 'gt-m3bk-20lf' })).status, 303); const r = await post('/project10/', { password: 'fu-p6pu-f2la', hash: '#/?demo=walk' }); assert.equal(r.status, 303); assert.ok(passed(await get('/project10/samples/inventory-store-214.xlsx', cookieOf(r)))); assert.equal((await post('/project10/', { password: 'gt-m3bk-20lf' })).status, 401) }],
  ['project13 takes its own password only', async () => { const r = await post('/project13/', { password: 'og-7q0a-vvo8', hash: '#/new' }); assert.equal(r.status, 303); assert.ok(passed(await get('/project13/', cookieOf(r)))); assert.equal((await post('/project13/', { password: 'sv-4rkx-msbd' })).status, 401) }],
  ['selvedge takes its own password only', async () => { const r = await post('/selvedge/', { password: 'sv-4rkx-msbd', hash: '#/today' }); assert.equal(r.status, 303); assert.ok(passed(await get('/selvedge/', cookieOf(r)))); assert.equal((await post('/selvedge/', { password: 'fd-w8tq-3jxc' })).status, 401) }],
  ['rawat takes its password and keeps its own cookie', async () => { const r = await post('/rawat/', { password: 'fd-w8tq-3jxc', hash: '#/today' }); assert.equal(r.status, 303); assert.ok(passed(await get('/rawat/', cookieOf(r)))); assert.equal((await post('/rawat/', { password: 'ck-7rmz-q4hp' })).status, 401) }],
  ['project11, project12 and flowdirector take their own passwords only', async () => { assert.equal((await post('/project11/', { password: 'ck-7rmz-q4hp' })).status, 303); assert.equal((await post('/project12/', { password: 'gs-k2vx-9dnb' })).status, 303); const r = await post('/flowdirector/', { password: 'fd-w8tq-3jxc', hash: '#/queue' }); assert.equal(r.status, 303); assert.ok(passed(await get('/flowdirector/', cookieOf(r)))); assert.equal((await post('/flowdirector/', { password: 'ck-7rmz-q4hp' })).status, 401); assert.equal((await post('/project12/', { password: 'fd-w8tq-3jxc' })).status, 401) }],
  ['project8 accepts its own password and serves the report', async () => { const r = await post('/project8/', { password: 'td-9ymu-nhd4' }); assert.ok(passed(await get('/project8/research.pdf', cookieOf(r)))); assert.equal((await get('/project8/research.pdf')).status, 401) }],
  ['robots.txt turns every crawler away', async () => { const r = await get('/robots.txt'); assert.equal(r.status, 200); assert.match(await r.text(), /Disallow: \//) }],
  ['every gate page says noindex', async () => {
    for (const r of [await get('/'), await get('/project6/'), await post('/project1/', { password: 'x' })]) assert.match(r.headers.get('x-robots-tag'), /noindex/)
  }],
  ['project5 accepts DRI05', async () => { const r = await post('/project5/', { password: 'DRI05' }); assert.ok(passed(await get('/project5/', cookieOf(r)))) }],
  ['project4 accepts PR004', async () => { const r = await post('/project4/', { password: 'PR004' }); assert.ok(passed(await get('/project4/sprites/layout.json', cookieOf(r)))) }],
  ['project2 accepts PR002', async () => { const r = await post('/project2/', { password: 'PR002' }); assert.ok(passed(await get('/project2/', cookieOf(r)))) }],
  ['project1 cookie does not open project2', async () => {
    const r = await post('/project1/', { password: 'PR001' })
    const c = cookieOf(r).replace('gate_project1', 'gate_project2')
    assert.equal((await get('/project2/', c)).status, 401)
  }],
  ['forged cookie is rejected', async () => assert.equal((await get('/project1/', 'gate_project1=PR001')).status, 401)],
  ['control characters in hash are stripped', async () => {
    const r = await post('/project2/', { password: 'PR002', hash: '#/x\r\nSet-Cookie: evil=1' })
    assert.equal(r.headers.get('location'), '/project2/#/xSet-Cookie: evil=1')
  }],
]

let failed = 0
for (const [name, fn] of cases) {
  try { await fn(); console.log('ok  ', name) } catch (e) { failed++; console.log('FAIL', name, '\n     ', e.message) }
}
console.log(`\n${cases.length - failed}/${cases.length} passed`)
process.exit(failed ? 1 : 0)
