import { S, update, reset, session } from '../store.js'
import { esc, avatar, on, toast, modal, modalHead } from '../ui.js'

const TABS = [['company', 'Company'], ['users', 'Users and roles'], ['notifications', 'Notifications'], ['integrations', 'Integrations'], ['appearance', 'Appearance and data']]
const ROLES = {
  'HR Admin': 'Everything, including rules, settings and users',
  HRBP: 'Create and run cases for their divisions',
  Legal: 'Read cases, approve terminations and agreements, edit letters',
  Payroll: 'Settlement and final pay, read-only elsewhere',
  IT: 'Clearance items for devices and access only',
  GA: 'Clearance items for ID cards, keys, vehicles and uniforms only',
}
const INTEGRATIONS = [
  ['hris', 'HRIS', 'Employee records, contracts, leave balance and reporting lines', 'Synced 08:40 today'],
  ['payroll', 'Payroll', 'Sends the final settlement to the next payroll run', 'Last export 31 Oct'],
  ['directory', 'IT directory', 'Assets per person and system accounts, closes access on the last day', 'Synced 08:40 today'],
  ['bpjs', 'BPJS reporting', 'Prepares the non-active report for BPJS Ketenagakerjaan and Kesehatan', 'Not connected, reported by hand'],
  ['esign', 'E-signature', 'Sends letters and the Perjanjian Bersama for signing (certified provider)', 'Not connected'],
]
const toggle = (name, on, label) => `<label class="relative inline-flex shrink-0 cursor-pointer"><input type="checkbox" name="${name}" class="peer sr-only" ${on ? 'checked' : ''} aria-label="${esc(label)}" /><span class="w-9 h-5 rounded-full bg-line peer-checked:bg-accent transition-colors"></span><span class="absolute left-0.5 top-0.5 size-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4"></span></label>`

export function render({ params }) {
  const tab = TABS.some(([k]) => k === params.tab) ? params.tab : 'company'
  return {
    title: 'Settings',
    html: `
  <div class="rise">
    <div class="mb-5">
      <h1 class="text-2xl sm:text-[28px] font-semibold tracking-[-0.02em]">Settings</h1>
      <p class="text-sm text-muted mt-1">Applies to everyone at ${esc(S().settings.company.short)}.</p>
    </div>
    <nav class="flex gap-1 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0" aria-label="Sections">
      ${TABS.map(([k, l]) => `<a href="#/settings/${k}" class="tab" ${k === tab ? 'aria-current="page"' : ''}>${l}</a>`).join('')}
    </nav>
    <div id="body" class="mt-4 max-w-[880px]"></div>
  </div>`,
    mount(root, ctx) {
      const $ = (q) => root.querySelector(q)
      const st = S()
      const redraw = (msg) => { if (msg) toast(msg); ctx.keepScroll = true; ctx.rerender() }
      const isAdmin = session().role === 'HR Admin'

      if (tab === 'company') {
        const c = st.settings.company
        $('#body').innerHTML = `
        <form id="cf" class="card">
          <div class="p-5 sm:p-6 grid sm:grid-cols-2 gap-4">
            <div class="sm:col-span-2"><label class="label" for="cn">Legal name</label><input id="cn" name="name" class="field" value="${esc(c.name)}" /></div>
            <div><label class="label" for="cs">Short name</label><input id="cs" name="short" class="field" value="${esc(c.short)}" /></div>
            <div><label class="label" for="np">NPWP</label><input id="np" name="npwp" class="field" value="${esc(c.npwp)}" /></div>
            <div class="sm:col-span-2"><label class="label" for="ad">Address on letters</label><textarea id="ad" name="address" rows="2" class="field">${esc(c.address)}</textarea></div>
            <div><label class="label" for="ww">Work week</label><select id="ww" name="workweek" class="field"><option value="5" ${c.workweek === 5 ? 'selected' : ''}>5 days (leave payout = wage / 21)</option><option value="6" ${c.workweek === 6 ? 'selected' : ''}>6 days (leave payout = wage / 25)</option></select><p class="hint">Used to pay out unused annual leave.</p></div>
            <div><label class="label" for="rv">Close system access</label><select id="rv" name="revokeAt" class="field"><option value="lastday-1800" ${st.settings.revokeAt === 'lastday-1800' ? 'selected' : ''}>18:00 on the last working day</option><option value="notice" ${st.settings.revokeAt === 'notice' ? 'selected' : ''}>On the day the notice is sent</option></select><p class="hint">Terminations for cause always close access on the same day.</p></div>
          </div>
          <div class="px-5 sm:px-6 py-3 border-t border-line flex justify-end"><button class="btn btn-primary" ${isAdmin ? '' : 'disabled title="HR Admin only"'}>Save changes</button></div>
        </form>`
        on(root, '#cf', 'submit', (e) => {
          e.preventDefault(); const fd = new FormData(e.target)
          update(() => { Object.assign(c, { name: fd.get('name'), short: fd.get('short'), npwp: fd.get('npwp'), address: fd.get('address'), workweek: +fd.get('workweek') }); st.settings.revokeAt = fd.get('revokeAt') })
          redraw('Company settings saved')
        })
      }

      if (tab === 'users') {
        $('#body').innerHTML = `
        <div class="card">
          <div class="px-5 py-3.5 border-b border-line flex items-center justify-between gap-3"><h2 class="text-sm font-semibold">${st.users.length} people with access</h2><button id="inv" class="btn btn-sm" ${isAdmin ? '' : 'disabled'}><span class="icon-[majesticons--user-add-line] size-4"></span>Add person</button></div>
          <ul class="divide-y divide-line">
            ${st.users.map((u, i) => `<li class="px-5 py-3 flex flex-wrap items-center gap-3">
              ${avatar(u.name)}
              <div class="min-w-0 flex-1"><p class="text-sm font-medium">${esc(u.name)}</p><p class="text-xs text-muted truncate">${esc(u.title)} · ${esc(u.email)}</p></div>
              <select data-i="${i}" class="role field h-9 w-[150px]" aria-label="Role of ${esc(u.name)}" ${isAdmin ? '' : 'disabled'}>${Object.keys(ROLES).map((r) => `<option ${r === u.role ? 'selected' : ''}>${r}</option>`).join('')}</select>
            </li>`).join('')}
          </ul>
        </div>
        <div class="card mt-4 p-5"><h2 class="text-sm font-semibold">What each role can do</h2>
          <dl class="mt-3 grid sm:grid-cols-[140px_1fr] gap-x-4 gap-y-2 text-sm">${Object.entries(ROLES).map(([r, d]) => `<dt class="font-medium">${r}</dt><dd class="text-muted">${d}</dd>`).join('')}</dl>
          <p class="text-xs text-muted mt-4">Salary, settlement and file notes are visible to HR Admin, HRBP, Legal and Payroll only.</p></div>`
        on(root, '.role', 'change', (e, el) => { update(() => { st.users[+el.dataset.i].role = el.value }); toast(`${st.users[+el.dataset.i].name} is now ${el.value}`) })
        on(root, '#inv', 'click', () => modal(`${modalHead('Add person', 'They sign in with company single sign-on.')}
          <form class="p-5 space-y-4"><div><label class="label" for="un">Full name</label><input id="un" name="name" class="field" required /></div>
          <div><label class="label" for="ue">Work email</label><input id="ue" name="email" type="email" class="field" required placeholder="name@arunika.co.id" /></div>
          <div><label class="label" for="ur">Role</label><select id="ur" name="role" class="field">${Object.keys(ROLES).map((r) => `<option>${r}</option>`).join('')}</select></div>
          <div class="flex justify-end gap-2"><button type="button" class="btn" data-close>Cancel</button><button class="btn btn-primary">Add</button></div></form>`, {
          onMount(dlg) { dlg.querySelector('form').addEventListener('submit', (e) => { e.preventDefault(); const fd = new FormData(e.target); if (!fd.get('name').trim() || !String(fd.get('email')).includes('@')) return; update(() => st.users.push({ name: fd.get('name').trim(), email: fd.get('email').trim().toLowerCase(), role: fd.get('role'), title: fd.get('role') })); dlg.close(); redraw('Person added') }) },
        }))
      }

      if (tab === 'notifications') {
        const n = st.settings.notify
        const rows = [['lastDay', 'Last working day is 3 days away', 'Case owner, line manager, IT and GA'], ['deadline', 'A response deadline passes', 'Case owner'], ['bipartite', 'Bipartite reaches day 23 of 30', 'Case owner and Legal'], ['weekly', 'Weekly summary every Monday 08:00', 'HR Admin']]
        $('#body').innerHTML = `<form id="nf" class="card divide-y divide-line">${rows.map(([k, l, who]) => `<div class="px-5 py-4 flex items-center gap-4"><div class="flex-1"><p class="text-sm font-medium">${l}</p><p class="text-xs text-muted">Email to: ${who}</p></div>${toggle(k, n[k], l)}</div>`).join('')}</form>`
        on(root, '#nf input', 'change', (e, el) => { update(() => { n[el.name] = el.checked }); toast(el.checked ? 'Notification on' : 'Notification off') })
      }

      if (tab === 'integrations') {
        const g = st.settings.integrations
        $('#body').innerHTML = `<div class="card divide-y divide-line">${INTEGRATIONS.map(([k, l, d, s]) => `
          <div class="px-5 py-4 flex items-center gap-4">
            <span class="size-10 rounded-[8px] bg-sunk border border-line grid place-items-center shrink-0"><span class="icon-[majesticons--data-line] size-5"></span></span>
            <div class="flex-1 min-w-0"><p class="text-sm font-medium">${l}</p><p class="text-xs text-muted">${d}</p><p class="text-xs mt-1 ${g[k] ? 'text-green-700 dark:text-green-400' : 'text-muted'}">${g[k] ? (s.startsWith('Not') ? 'Connected' : s) : 'Not connected'}</p></div>
            <button data-k="${k}" class="int btn btn-sm">${g[k] ? 'Disconnect' : 'Connect'}</button>
          </div>`).join('')}</div>
          <p class="text-xs text-muted mt-3">Prototype: connections are simulated. No data leaves the browser.</p>`
        on(root, '.int', 'click', (e, el) => { update(() => { g[el.dataset.k] = !g[el.dataset.k] }); redraw(g[el.dataset.k] ? 'Connected' : 'Disconnected') })
      }

      if (tab === 'appearance') {
        $('#body').innerHTML = `
        <div class="card p-5"><h2 class="text-sm font-semibold">Theme</h2>
          <div class="mt-3 grid grid-cols-3 gap-2 max-w-[420px]" role="radiogroup">${[['system', 'System'], ['light', 'Light'], ['dark', 'Dark']].map(([k, l]) => `<button role="radio" aria-checked="${st.settings.theme === k}" data-t="${k}" class="th h-10 rounded-[8px] border text-sm ${st.settings.theme === k ? 'border-accent bg-accent-soft font-medium' : 'border-line hover:bg-sunk'}">${l}</button>`).join('')}</div>
        </div>
        <div class="card p-5 mt-4"><h2 class="text-sm font-semibold">Demo data</h2><p class="text-sm text-muted mt-1">Cases, templates and settings you changed are kept in this browser. Reset to start again from the sample data.</p><button id="rs" class="btn mt-4"><span class="icon-[majesticons--refresh-line] size-4"></span>Reset demo data</button></div>`
        on(root, '.th', 'click', (e, el) => { update(() => { st.settings.theme = el.dataset.t }); import('../main.js').then((m) => m.applyTheme()); redraw() })
        on(root, '#rs', 'click', () => modal(`${modalHead('Reset demo data?', 'All cases and edits made in this browser go back to the sample data.')}<div class="p-5 flex justify-end gap-2"><button class="btn" data-close>Cancel</button><button id="ok" class="btn btn-primary">Reset</button></div>`, {
          onMount(dlg) { dlg.querySelector('#ok').addEventListener('click', () => { reset(); dlg.close(); redraw('Demo data reset') }) },
        }))
      }
    },
  }
}
