import { S, update, emp as getEmp, div as getDiv, activeCaseFor, rule, tpl, today, session } from '../store.js'
import { EMPLOYEES, DIVISIONS, EXIT_TYPES, REASONS, OPENINGS, LOCATIONS, VENDORS, SYSTEMS, COMPANY } from '../data.js'
import { esc, idr, fdate, avatar, merge, on, toast } from '../ui.js'
import { settlement, tenure, addDays, addWorkingDays, diffDays } from '../severance.js'

const EXIT_ICON = {
  resign: '<span class="icon-[majesticons--logout-half-circle-line] size-5"></span>',
  layoff: '<span class="icon-[majesticons--sitemap-line] size-5"></span>',
  termination: '<span class="icon-[majesticons--shield-exclamation-line] size-5"></span>',
  contract: '<span class="icon-[majesticons--calendar-line] size-5"></span>',
  mutual: '<span class="icon-[majesticons--comments-line] size-5"></span>',
  retire: '<span class="icon-[majesticons--sun-line] size-5"></span>',
}
const ASSET_ICON = {
  lt: '<span class="icon-[majesticons--laptop-line] size-4"></span>', mon: '<span class="icon-[majesticons--monitor-line] size-4"></span>',
  ph: '<span class="icon-[majesticons--device-mobile-line] size-4"></span>', sim: '<span class="icon-[majesticons--sim-card-line] size-4"></span>',
  tab: '<span class="icon-[majesticons--device-tablet-line] size-4"></span>', scn: '<span class="icon-[majesticons--barcode-2-line] size-4"></span>',
  id: '<span class="icon-[majesticons--scan-user-line] size-4"></span>', key: '<span class="icon-[majesticons--key-line] size-4"></span>',
  car: '<span class="icon-[majesticons--car-line] size-4"></span>', mtr: '<span class="icon-[majesticons--scooter-line] size-4"></span>',
  uni: '<span class="icon-[majesticons--t-shirt-line] size-4"></span>', cc: '<span class="icon-[majesticons--creditcard-line] size-4"></span>',
}
export const assetIcon = (k) => ASSET_ICON[k] || ''

export function vars(e, c, s) {
  const st = S()
  const me = session()
  return {
    employee_name: e?.name || '[Employee]', first_name: e?.name.split(' ')[0] || '[Name]', position: e?.position || '[Position]',
    division: e ? getDiv(e.div).name : '[Division]', last_day: c.lastDay ? fdate(c.lastDay) : '[Last day]',
    response_deadline: c.deadline ? fdate(c.deadline) : '[Deadline]', severance_total: s ? (s.vendorPays ? 'paid by the vendor' : idr(s.gross)) : '[Amount]',
    manager: e?.manager || '[Manager]', hr_contact: c.owner || me?.name || 'People & Culture', vendor: e?.vendor ? VENDORS[e.vendor].name : '[Vendor]', company: st.settings.company.name,
  }
}

export function profileCard(e, { compact = false } = {}) {
  if (!e) return `<div class="card p-6 text-center"><span class="icon-[majesticons--user-circle-line] size-8 text-muted"></span><p class="mt-2 text-sm font-medium">No employee selected</p><p class="text-xs text-muted mt-1">Their assets, contract and access appear here.</p></div>`
  const t = tenure(e.joinDate, today)
  const d = getDiv(e.div)
  const assetsTotal = e.assets.reduce((s, a) => s + a.value, 0)
  return `
  <div class="card overflow-hidden">
    <div class="p-5 flex items-start gap-3 border-b border-line">
      ${avatar(e.name, 'size-12 text-sm')}
      <div class="min-w-0">
        <p class="font-semibold truncate">${esc(e.name)}</p>
        <p class="text-sm text-muted truncate">${esc(e.position)}</p>
        <p class="text-xs text-muted mt-1 num">${e.empNo} · ${e.contract}${e.vendor ? ' · ' + esc(VENDORS[e.vendor].name) : ''}</p>
      </div>
    </div>
    <dl class="kv grid grid-cols-2 gap-x-4 gap-y-3 p-5 border-b border-line">
      <div><dt>Division</dt><dd>${esc(d.name)}</dd></div>
      <div><dt>Location</dt><dd>${esc(LOCATIONS[e.loc])}</dd></div>
      <div><dt>Joined</dt><dd class="num">${fdate(e.joinDate)}</dd></div>
      <div><dt>Tenure</dt><dd class="num">${t.label}</dd></div>
      <div><dt>Line manager</dt><dd>${esc(e.manager)}</dd></div>
      <div><dt>${e.contractEnd ? 'Contract ends' : 'Grade'}</dt><dd class="num">${e.contractEnd ? fdate(e.contractEnd) : esc(e.grade)}</dd></div>
      ${e.type === 'internal' ? `<div><dt>Monthly wage</dt><dd class="num">${idr(e.base + e.allowance)}</dd></div><div><dt>Leave left</dt><dd class="num">${e.leaveLeft} days</dd></div>` : `<div class="col-span-2"><dt>Vendor contact</dt><dd>${esc(VENDORS[e.vendor].pic)}</dd></div>`}
    </dl>
    <div class="p-5 ${compact ? '' : 'border-b border-line'}">
      <div class="flex items-baseline justify-between"><p class="text-sm font-semibold">Assets held <span class="text-muted font-normal num">(${e.assets.length})</span></p>${assetsTotal ? `<p class="text-xs text-muted num">book value ${idr(assetsTotal)}</p>` : ''}</div>
      ${e.assets.length ? `<ul class="mt-3 space-y-2">${e.assets.map((a) => `
        <li class="flex items-center gap-3 text-sm"><span class="size-8 rounded-full bg-sunk grid place-items-center shrink-0">${assetIcon(a.kind)}</span>
          <span class="min-w-0 flex-1"><span class="block truncate">${esc(a.label)}</span><span class="block text-xs text-muted truncate num">${esc(a.model)} · ${a.tag}</span></span>
          <span class="text-xs text-muted shrink-0">${a.dept}</span></li>`).join('')}</ul>` : '<p class="mt-2 text-sm text-muted">No company assets on record.</p>'}
    </div>
    ${compact ? '' : `
    <div class="p-5 border-b border-line">
      <p class="text-sm font-semibold">System access <span class="text-muted font-normal num">(${e.systems.length})</span></p>
      ${e.systems.length ? `<div class="mt-2.5 flex flex-wrap gap-1.5">${e.systems.map((s) => `<span class="h-7 px-2.5 rounded-full bg-sunk border border-line text-xs inline-flex items-center">${esc(SYSTEMS[s])}</span>`).join('')}</div>` : '<p class="mt-2 text-sm text-muted">None.</p>'}
    </div>
    <div class="p-5 grid grid-cols-2 gap-4 text-sm">
      <div><p class="text-xs text-muted">Outstanding loan</p><p class="mt-0.5 num ${e.loan ? 'font-medium' : ''}">${e.loan ? idr(e.loan) : 'None'}</p></div>
      <div><p class="text-xs text-muted">Work email</p><p class="mt-0.5 truncate">${esc(e.email)}</p></div>
    </div>`}
  </div>`
}

export function settlementCard(s) {
  if (!s) return ''
  if (s.vendorPays) return `<div class="card p-5"><p class="text-sm font-semibold">Settlement</p><p class="text-sm text-muted mt-1.5">${esc(s.basis)}</p></div>`
  const ded = s.deductions.reduce((a, x) => a + x.amount, 0)
  return `
  <div class="card">
    <div class="p-5 border-b border-line flex items-baseline justify-between gap-3"><p class="text-sm font-semibold">Settlement estimate</p><p class="text-xs text-muted">PP 35/2021</p></div>
    <div class="p-5 space-y-2.5 text-sm">
      ${s.lines.length ? s.lines.map((l) => `<div class="flex justify-between gap-3"><div class="min-w-0"><p>${esc(l.label)}</p><p class="text-xs text-muted num">${esc(l.basis)}</p></div><p class="num shrink-0">${idr(l.amount)}</p></div>`).join('') : '<p class="text-muted">No settlement lines for this exit.</p>'}
      <div class="flex justify-between gap-3 pt-2.5 border-t border-line"><p class="font-medium">Gross</p><p class="num font-medium">${idr(s.gross)}</p></div>
      <div class="flex justify-between gap-3 text-muted"><p>PPh 21 final on severance</p><p class="num">- ${idr(s.tax)}</p></div>
      ${s.deductions.map((x) => `<div class="flex justify-between gap-3 text-muted"><p>${esc(x.label)}</p><p class="num">- ${idr(x.amount)}</p></div>`).join('')}
      <div class="flex justify-between gap-3 pt-2.5 border-t border-line"><p class="font-semibold">Net to employee</p><p class="num font-semibold text-base">${idr(s.net)}</p></div>
      <p class="text-xs text-muted leading-relaxed pt-1">${esc(s.basis)} Wage basis ${idr(s.wage)} per month (base plus fixed allowance). Estimate only; payroll and legal confirm.</p>
    </div>
  </div>`
}

export function render({ query }) {
  const me = session()
  const f = {
    workforce: query.workforce === 'external' ? 'external' : 'internal',
    div: 'all', q: '', emp: null, type: query.type || null, reason: '', note: '',
    notice: today, lastDay: '', deadline: '', template: '', docs: null, owner: me.name,
    redeploy: false, redeployRole: '', errors: {},
  }
  if (query.emp) { const e = getEmp(query.emp); if (e) { f.emp = e.id; f.workforce = e.type; f.div = e.div } }
  const owners = S().users.filter((u) => ['HR Admin', 'HRBP'].includes(u.role))

  return {
    title: 'Create new offboarding',
    html: `
  <div class="rise">
    <div class="flex flex-wrap items-end justify-between gap-3 mb-6">
      <div>
        <h1 class="text-2xl sm:text-[28px] font-semibold tracking-[-0.02em]">Create new offboarding</h1>
        <p class="text-sm text-muted mt-1">Fill in four parts. The rule for the exit type sets dates, letters and the settlement.</p>
      </div>
    </div>
    <form id="f" novalidate class="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] gap-6 items-start">
      <div class="space-y-5 min-w-0">

        <section class="card p-5 sm:p-6">
          <h2 class="flex items-center gap-2.5 font-semibold"><span class="size-7 rounded-full bg-accent-soft text-accent text-xs font-semibold grid place-items-center num">1</span>Who is leaving</h2>
          <div class="mt-5 grid sm:grid-cols-2 gap-4">
            <fieldset>
              <legend class="label">Workforce</legend>
              <div class="grid grid-cols-2 p-1 rounded-full bg-sunk" role="radiogroup">
                <button type="button" class="wf h-9 rounded-lg text-sm" data-v="internal">Internal</button>
                <button type="button" class="wf h-9 rounded-lg text-sm" data-v="external">External</button>
              </div>
              <p id="wfHint" class="hint"></p>
            </fieldset>
            <div>
              <label class="label" for="div">Division</label>
              <select id="div" class="field"><option value="all">All divisions</option>${DIVISIONS.map((d) => `<option value="${d.id}">${esc(d.name)}</option>`).join('')}</select>
            </div>
          </div>
          <div class="mt-4">
            <label class="label" for="q">Employee</label>
            <div class="relative"><span class="icon-[majesticons--search-line] size-4 text-muted absolute left-3 top-3"></span><input id="q" class="field pl-9" placeholder="Search by name, position or employee number" autocomplete="off" /></div>
            <div id="empList" class="mt-2 max-h-[300px] overflow-auto rounded-2xl bg-sunk p-1.5 space-y-0.5" role="listbox" aria-label="Employees"></div>
            <p id="err-emp" class="err hidden"></p>
          </div>
          <div id="profileMobile" class="lg:hidden mt-4"></div>
        </section>

        <section class="card p-5 sm:p-6">
          <h2 class="flex items-center gap-2.5 font-semibold"><span class="size-7 rounded-full bg-accent-soft text-accent text-xs font-semibold grid place-items-center num">2</span>Exit type and reason</h2>
          <div id="types" class="mt-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2.5" role="radiogroup" aria-label="Exit type"></div>
          <p id="err-type" class="err hidden"></p>
          <div class="mt-4 grid sm:grid-cols-2 gap-4">
            <div>
              <label class="label" for="reason">Reason</label>
              <select id="reason" class="field"></select>
              <p id="err-reason" class="err hidden"></p>
            </div>
            <div>
              <label class="label" for="owner">Case owner</label>
              <select id="owner" class="field">${owners.map((u) => `<option ${u.name === f.owner ? 'selected' : ''}>${esc(u.name)}</option>`).join('')}</select>
            </div>
          </div>
          <div class="mt-4">
            <label class="label" for="note">Notes for the file <span class="text-muted font-normal">(not sent to the employee)</span></label>
            <textarea id="note" rows="3" class="field" placeholder="Context, investigation number, what was discussed"></textarea>
          </div>
          <div id="redeploy" class="mt-4"></div>
        </section>

        <section class="card p-5 sm:p-6">
          <h2 class="flex items-center gap-2.5 font-semibold"><span class="size-7 rounded-full bg-accent-soft text-accent text-xs font-semibold grid place-items-center num">3</span>Dates</h2>
          <div class="mt-5 grid sm:grid-cols-3 gap-4">
            <div><label class="label" for="notice">Notice date</label><input id="notice" type="date" class="field num" /></div>
            <div><label class="label" for="lastDay">Last working day</label><input id="lastDay" type="date" class="field num" /><p id="err-lastDay" class="err hidden"></p></div>
            <div><label class="label" for="deadline">Response deadline</label><input id="deadline" type="date" class="field num" /></div>
          </div>
          <div id="ruleNote" class="mt-4"></div>
        </section>

        <section class="card p-5 sm:p-6">
          <h2 class="flex items-center gap-2.5 font-semibold"><span class="size-7 rounded-full bg-accent-soft text-accent text-xs font-semibold grid place-items-center num">4</span>Email and documents</h2>
          <div class="mt-5">
            <label class="label" for="template">Email template</label>
            <select id="template" class="field"></select>
            <p id="err-template" class="err hidden"></p>
          </div>
          <div id="preview" class="mt-4"></div>
          <div class="mt-5">
            <p class="label">Documents to prepare</p>
            <div id="docs" class="grid grid-cols-1 sm:grid-cols-2 gap-2"></div>
          </div>
          <div id="approvals" class="mt-5"></div>
        </section>

        <div class="sticky bottom-0 z-20 -mx-4 sm:mx-0 px-4 sm:px-5 py-3 bg-ground/95 backdrop-blur border-t sm:border sm:rounded-full border-line sm:shadow-[0_10px_30px_-16px_rgb(21_32_57/0.3)] flex flex-wrap items-center gap-2 justify-end">
          <p id="formMsg" class="text-sm text-muted mr-auto"></p>
          <a href="#/" class="btn btn-quiet">Cancel</a>
          <button type="button" id="draft" class="btn">Save as draft</button>
          <button type="submit" class="btn btn-primary"><span class="icon-[majesticons--send-line] size-4"></span>Create and send notice</button>
        </div>
      </div>

      <aside class="hidden lg:block space-y-4">
        <div id="profile"></div>
        <div id="settle"></div>
      </aside>
    </form>
  </div>`,
    mount(root, { go }) {
      const $ = (s) => root.querySelector(s)
      const used = new Set(S().cases.filter((c) => !['completed', 'withdrawn'].includes(c.status)).map((c) => c.emp))

      const types = () => EXIT_TYPES.filter((t) => t.for === f.workforce)
      const E = () => (f.emp ? getEmp(f.emp) : null)

      function applyDefaults() {
        const r = f.type ? rule(f.type) : null
        if (!r) return
        const e = E()
        if (f.type === 'contract' && e?.contractEnd) f.lastDay = e.contractEnd
        else if (f.type === 'ext-end' && e?.contractEnd && diffDays(e.contractEnd, f.notice) <= 45) f.lastDay = e.contractEnd
        else f.lastDay = addDays(f.notice, r.noticeDays)
        f.deadline = addDays(f.notice, r.responseDays)
        f.template = r.template
        f.docs = S().documents.filter((d) => d.types.includes(f.type)).map((d) => d.id)
        f.reason = ''
        $('#lastDay').value = f.lastDay; $('#deadline').value = f.deadline
      }

      function drawWorkforce() {
        root.querySelectorAll('.wf').forEach((b) => {
          const on = b.dataset.v === f.workforce
          b.setAttribute('aria-checked', on); b.setAttribute('role', 'radio')
          b.className = `wf h-9 rounded-full text-sm ${on ? 'bg-surface font-medium shadow-[0_1px_2px_rgb(21_32_57/0.08),0_4px_10px_-6px_rgb(21_32_57/0.25)]' : 'text-muted hover:text-ink'}`
        })
        $('#wfHint').textContent = f.workforce === 'internal' ? 'On our payroll: permanent (PKWTT) and fixed-term (PKWT).' : 'Outsourced or freelance. The vendor settles their rights; we collect assets and close access.'
      }

      function drawList() {
        const q = f.q.toLowerCase()
        const rows = EMPLOYEES.filter((e) => e.type === f.workforce && (f.div === 'all' || e.div === f.div) && (!q || (e.name + e.position + e.empNo).toLowerCase().includes(q)))
        $('#empList').innerHTML = rows.length ? rows.map((e) => {
          const busy = used.has(e.id) && e.id !== f.emp
          const sel = e.id === f.emp
          const c = busy ? activeCaseFor(e.id) : null
          return `<button type="button" role="option" aria-selected="${sel}" ${busy ? 'aria-disabled="true"' : ''} data-id="${e.id}" class="emp w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left ${sel ? 'bg-surface ring-2 ring-accent' : busy ? 'opacity-55 cursor-not-allowed' : 'hover:bg-surface'}">
            ${avatar(e.name, 'size-8 text-[11px]')}
            <span class="min-w-0 flex-1"><span class="block text-sm font-medium truncate">${esc(e.name)}</span><span class="block text-xs text-muted truncate">${esc(e.position)} · ${esc(getDiv(e.div).name)}</span></span>
            <span class="text-right shrink-0"><span class="block text-xs num text-muted">${e.empNo}</span><span class="block text-xs ${busy ? 'text-ink font-medium' : 'text-muted'}">${busy ? 'In ' + c.id : e.contract}</span></span>
            ${sel ? '<span class="icon-[majesticons--check-circle-line] size-5 text-accent shrink-0"></span>' : ''}
          </button>`
        }).join('') : `<p class="p-4 text-sm text-muted">No ${f.workforce} employees match. Try another division or name.</p>`
        on(root, '.emp', 'click', (ev, el) => {
          if (el.getAttribute('aria-disabled')) { toast(`${getEmp(el.dataset.id).name} already has an open case`, 'warn'); return }
          f.emp = el.dataset.id; f.errors.emp = null
          if (f.type) applyDefaults()
          drawList(); drawAll()
        })
      }

      function drawTypes() {
        const e = E()
        $('#types').innerHTML = types().map((t) => {
          const disabled = e && ((t.id === 'contract' && e.contract !== 'PKWT'))
          const sel = f.type === t.id
          return `<button type="button" role="radio" aria-checked="${sel}" ${disabled ? 'disabled' : ''} data-t="${t.id}" class="xt text-left rounded-2xl border p-3.5 flex gap-3 items-start ${sel ? 'border-accent bg-accent-soft' : 'border-line hover:border-accent/40 hover:bg-sunk'} disabled:opacity-45 disabled:cursor-not-allowed">
            <span class="mt-0.5 ${sel ? 'text-accent' : 'text-muted'}">${EXIT_ICON[t.icon]}</span>
            <span><span class="block text-sm font-medium">${esc(t.label)}</span><span class="block text-xs text-muted">${disabled ? 'Only for PKWT contracts' : esc(t.who)}</span></span>
          </button>`
        }).join('')
        on(root, '.xt', 'click', (ev, el) => { f.type = el.dataset.t; f.errors.type = null; applyDefaults(); drawAll() })
      }

      function drawReasons() {
        const list = f.type ? REASONS[f.type] : []
        $('#reason').innerHTML = `<option value="">${f.type ? 'Choose a reason' : 'Choose an exit type first'}</option>` + list.map((r) => `<option ${r === f.reason ? 'selected' : ''}>${esc(r)}</option>`).join('')
        $('#reason').disabled = !f.type
      }

      function drawRedeploy() {
        const e = E()
        if (!(f.type === 'layoff' && e)) { $('#redeploy').innerHTML = ''; return }
        const matches = OPENINGS.map((o) => ({ o, score: o.skills.filter((s) => e.skills.includes(s)).length })).filter((m) => m.score > 0).sort((a, b) => b.score - a.score)
        $('#redeploy').innerHTML = `
          <div class="rounded-xl border border-line bg-sunk p-4">
            <div class="flex items-start gap-3">
              <span class="icon-[majesticons--git-branch-line] size-5 text-accent mt-0.5 shrink-0"></span>
              <div class="min-w-0 flex-1">
                <p class="text-sm font-medium">Check internal openings first</p>
                <p class="text-xs text-muted mt-0.5">The law asks companies to try to avoid layoffs. ${matches.length ? `${matches.length} open role${matches.length > 1 ? 's' : ''} match ${esc(e.name.split(' ')[0])}'s skills.` : 'No open role matches this person’s skills right now.'}</p>
                ${matches.length ? `<div class="mt-3 space-y-1.5">${matches.map(({ o, score }) => `
                  <label class="flex items-center gap-3 rounded-xl bg-surface border border-line px-3 py-2.5 cursor-pointer has-[:checked]:border-accent">
                    <input type="radio" name="role" value="${o.id}" class="accent-[var(--color-accent)]" ${f.redeployRole === o.id ? 'checked' : ''} />
                    <span class="min-w-0 flex-1"><span class="block text-sm">${esc(o.title)} <span class="text-muted num">· ${o.grade}</span></span><span class="block text-xs text-muted truncate">${o.id} · ${esc(getDiv(o.div).name)} · ${esc(LOCATIONS[o.loc])}</span></span>
                    <span class="text-xs text-muted shrink-0">${score} skill${score > 1 ? 's' : ''} match</span>
                  </label>`).join('')}</div>
                <label class="mt-3 flex items-center gap-2 text-sm"><input id="offerRole" type="checkbox" class="size-4 accent-[var(--color-accent)]" ${f.redeploy ? 'checked' : ''} />Offer the selected role before the layoff goes ahead</label>` : ''}
              </div>
            </div>
          </div>`
        on(root, 'input[name=role]', 'change', (ev, el) => { f.redeployRole = el.value; f.redeploy = true; drawRedeploy() })
        on(root, '#offerRole', 'change', (ev, el) => { f.redeploy = el.checked; if (f.redeploy && !f.redeployRole && matches[0]) f.redeployRole = matches[0].o.id; drawRedeploy() })
      }

      function checkDates() {
        const msgs = []
        f.errors.lastDay = null
        if (!f.type || !f.lastDay) return msgs
        const e = E()
        if (diffDays(f.lastDay, f.notice) < 0) f.errors.lastDay = 'The last day cannot be before the notice date.'
        if (f.type === 'resign' && diffDays(f.lastDay, f.notice) < 30 && !f.errors.lastDay) msgs.push(['warn', 'Less than 30 days’ notice. Allowed only if the company agrees to an earlier last day (PP 35/2021, art. 36).'])
        if (f.type === 'layoff' && f.lastDay < addWorkingDays(f.notice, 14) && !f.errors.lastDay) f.errors.lastDay = `Notice must reach the employee 14 working days before the last day. Earliest: ${fdate(addWorkingDays(f.notice, 14))}.`
        if (f.type === 'contract' && e?.contractEnd && f.lastDay !== e.contractEnd) msgs.push(['warn', `The contract ends on ${fdate(e.contractEnd)}. Ending earlier means paying the rest of the contract (UU 13/2003, art. 62).`])
        if (f.type === 'retire' && diffDays(f.lastDay, f.notice) < 30) msgs.push(['warn', 'Retirement notice is usually given three months ahead.'])
        return msgs
      }

      function drawRule() {
        const r = f.type ? rule(f.type) : null
        const msgs = checkDates()
        const le = $('#err-lastDay'); le.textContent = f.errors.lastDay || ''; le.classList.toggle('hidden', !f.errors.lastDay)
        $('#ruleNote').innerHTML = r ? `
          <div class="rounded-xl bg-sunk border border-line p-3.5 text-sm flex gap-3"><span class="icon-[majesticons--information-circle-line] size-5 text-muted shrink-0"></span><div><p><span class="font-medium">Rule:</span> ${esc(r.note)}</p><p class="text-xs text-muted mt-1 num">Default notice ${r.noticeDays} days, response window ${r.responseDays} days. <a href="#/rules/exit" class="underline underline-offset-2">Edit rule</a></p></div></div>
          ${msgs.map(([, m]) => `<div class="mt-2 rounded-xl border border-amber-300 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800 p-3.5 text-sm flex gap-3"><span class="icon-[majesticons--exclamation-line] size-5 text-amber-700 dark:text-amber-400 shrink-0"></span><p>${esc(m)}</p></div>`).join('')}` : '<p class="text-sm text-muted">Choose an exit type to apply its rule.</p>'
      }

      function drawTemplates() {
        const all = S().templates.filter((t) => t.status === 'published')
        const rec = all.filter((t) => f.type && t.types.includes(f.type))
        const rest = all.filter((t) => !rec.includes(t))
        $('#template').innerHTML = `<option value="">Choose a template</option>` +
          (rec.length ? `<optgroup label="Recommended for this exit">${rec.map((t) => `<option value="${t.id}" ${t.id === f.template ? 'selected' : ''}>${esc(t.name)}</option>`).join('')}</optgroup>` : '') +
          `<optgroup label="Other templates">${rest.map((t) => `<option value="${t.id}" ${t.id === f.template ? 'selected' : ''}>${esc(t.name)}</option>`).join('')}</optgroup>`
      }

      function currentSettlement() {
        const e = E()
        if (!e || !f.type) return null
        return settlement(e, { type: f.type, reason: f.reason, lastDay: f.lastDay || today }, S().settings.company)
      }

      function drawPreview() {
        const t = f.template ? tpl(f.template) : null
        const e = E()
        if (!t) { $('#preview').innerHTML = ''; return }
        const v = vars(e, { lastDay: f.lastDay, deadline: f.deadline, owner: f.owner }, currentSettlement())
        const to = !e ? '[Employee]' : e.type === 'external' ? `${VENDORS[e.vendor].name} (${VENDORS[e.vendor].pic})` : `${e.name} <${e.personalEmail}>, ${e.email}`
        $('#preview').innerHTML = `
          <div class="rounded-xl border border-line overflow-hidden">
            <dl class="text-xs grid grid-cols-[64px_1fr] gap-y-1.5 px-4 py-3 bg-sunk border-b border-line">
              <dt class="text-muted">To</dt><dd class="truncate">${esc(to)}</dd>
              <dt class="text-muted">Cc</dt><dd class="truncate">${esc(e ? e.manager : '[Manager]')}, ${esc(f.owner)}</dd>
              <dt class="text-muted">Subject</dt><dd class="font-medium text-sm">${esc(merge(t.subject, v))}</dd>
            </dl>
            <div class="relative">
              <pre id="body" class="px-4 py-4 text-sm whitespace-pre-wrap font-sans leading-relaxed max-h-[180px] overflow-hidden">${esc(merge(t.body, v))}</pre>
              <div id="fade" class="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-surface to-transparent pointer-events-none"></div>
            </div>
            <div class="px-4 pb-3"><button type="button" id="more" class="text-sm font-medium underline underline-offset-2">Show the whole email</button></div>
          </div>`
        on(root, '#more', 'click', (ev, el) => { const b = $('#body'); const open = b.classList.toggle('max-h-[180px]'); $('#fade').classList.toggle('hidden', !open); el.textContent = open ? 'Show the whole email' : 'Show less' })
      }

      function drawDocs() {
        const list = S().documents.filter((d) => !f.type || d.types.includes(f.type))
        if (!f.type) { $('#docs').innerHTML = '<p class="text-sm text-muted sm:col-span-2">Choose an exit type to see the documents it needs.</p>'; return }
        $('#docs').innerHTML = list.map((d) => `
          <label class="min-w-0 flex items-start gap-2.5 rounded-2xl border border-line px-3.5 py-2.5 cursor-pointer has-[:checked]:border-ink/40">
            <input type="checkbox" class="doc mt-0.5 size-4 accent-[var(--color-accent)]" value="${d.id}" ${f.docs?.includes(d.id) ? 'checked' : ''} />
            <span class="min-w-0"><span class="block text-sm">${esc(d.name)}</span><span class="block text-xs text-muted truncate">${esc(d.local)}</span></span>
          </label>`).join('')
        on(root, '.doc', 'change', () => { f.docs = [...root.querySelectorAll('.doc:checked')].map((x) => x.value) })
      }

      function drawApprovals() {
        const r = f.type ? rule(f.type) : null
        $('#approvals').innerHTML = r ? `<p class="label">Approval chain</p><ol class="flex flex-wrap items-center gap-1.5 text-sm">${r.approvals.map((a, i) => `<li class="flex items-center gap-1.5">${i ? '<span class="icon-[majesticons--chevron-right-line] size-4 text-muted"></span>' : ''}<span class="h-7 px-2.5 rounded-full border border-line inline-flex items-center text-xs">${esc(a)}</span></li>`).join('')}</ol><p class="hint">Sending records the approvals in the case history. Change the chain in Rules &amp; documents.</p>` : ''
      }

      function drawSide() {
        const e = E()
        $('#profile').innerHTML = profileCard(e)
        $('#profileMobile').innerHTML = e ? profileCard(e, { compact: true }) : ''
        $('#settle').innerHTML = settlementCard(currentSettlement())
      }

      function drawAll() {
        drawWorkforce(); drawTypes(); drawReasons(); drawRedeploy(); drawRule(); drawTemplates(); drawPreview(); drawDocs(); drawApprovals(); drawSide()
        $('#div').value = f.div
      }

      // wire inputs
      $('#notice').value = f.notice
      on(root, '.wf', 'click', (ev, el) => {
        if (f.workforce === el.dataset.v) return
        f.workforce = el.dataset.v; f.emp = null; f.type = null; f.template = ''; f.docs = null; f.redeploy = false
        drawList(); drawAll()
      })
      on(root, '#div', 'change', (ev, el) => { f.div = el.value; drawList() })
      on(root, '#q', 'input', (ev, el) => { f.q = el.value; drawList() })
      on(root, '#reason', 'change', (ev, el) => { f.reason = el.value; f.errors.reason = null; root.querySelector('#err-reason').classList.add('hidden'); drawPreview(); drawSide() })
      on(root, '#note', 'input', (ev, el) => { f.note = el.value })
      on(root, '#owner', 'change', (ev, el) => { f.owner = el.value; drawPreview() })
      on(root, '#notice', 'change', (ev, el) => { f.notice = el.value || today; if (f.type) applyDefaults(); drawRule(); drawPreview(); drawSide() })
      on(root, '#lastDay', 'change', (ev, el) => { f.lastDay = el.value; drawRule(); drawPreview(); drawSide() })
      on(root, '#deadline', 'change', (ev, el) => { f.deadline = el.value; drawPreview() })
      on(root, '#template', 'change', (ev, el) => { f.template = el.value; drawPreview() })

      if (f.type && !types().some((t) => t.id === f.type)) f.type = null
      if (f.type) applyDefaults()
      drawList(); drawAll()

      function validate() {
        const err = {}
        if (!f.emp) err.emp = 'Choose who is leaving.'
        if (!f.type) err.type = 'Choose the exit type.'
        if (f.type && !f.reason) err.reason = 'Choose a reason.'
        if (!f.template) err.template = 'Choose the email to send.'
        checkDates()
        if (f.errors.lastDay) err.lastDay = f.errors.lastDay
        if (!f.lastDay) err.lastDay = 'Set the last working day.'
        for (const k of ['emp', 'type', 'reason', 'template', 'lastDay']) {
          const el = root.querySelector('#err-' + k)
          el.textContent = err[k] || ''; el.classList.toggle('hidden', !err[k])
        }
        const n = Object.keys(err).length
        $('#formMsg').innerHTML = n ? `<span class="text-red-700 dark:text-red-400">${n} thing${n > 1 ? 's' : ''} to fix before sending</span>` : ''
        if (n) root.querySelector('#err-' + Object.keys(err)[0])?.closest('section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return !n
      }

      function create(send) {
        if (send && !validate()) return
        if (!send && !f.emp) { validate(); return }
        const st = S()
        const id = `OFB-2026-${String(st.settings.seq).padStart(3, '0')}`
        const e = E()
        const r = f.type ? rule(f.type) : null
        const status = !send ? 'draft' : f.redeploy && f.redeployRole ? 'redeploy' : 'sent'
        const log = [[today, me.name, send ? 'Case created' : 'Draft created', 'system']]
        if (send) {
          log.push([today, me.name, `Approved by ${r.approvals.join(', ')}`, 'system'])
          log.push([today, me.name, `Sent "${tpl(f.template).name}" to ${e.type === 'external' ? VENDORS[e.vendor].name : e.name}`, 'system'])
          if (status === 'redeploy') log.push([today, me.name, `Offered ${f.redeployRole} ${OPENINGS.find((o) => o.id === f.redeployRole).title}`, 'system'])
        }
        update((s) => {
          s.settings.seq += 1
          s.cases.unshift({
            id, emp: f.emp, type: f.type || 'resign', reason: f.reason, note: f.note, notice: f.notice, lastDay: f.lastDay || addDays(today, 30), deadline: f.deadline,
            status, template: f.template, owner: f.owner, created: today, redeployRole: f.redeploy ? f.redeployRole : undefined,
            log, talks: status === 'redeploy' ? [[today, 'company', `Internal role ${f.redeployRole} offered before the layoff`, null]] : [], clear: {},
            docs: Object.fromEntries((f.docs || []).map((d) => [d, send && ['doc-ack', 'doc-notice', 'doc-contract', 'doc-retire', 'doc-vendor', 'doc-pb'].includes(d) ? 'sent' : 'pending'])),
          })
        })
        go(`#/offboarding?new=${id}`)
      }
      on(root, '#f', 'submit', (ev) => { ev.preventDefault(); create(true) })
      on(root, '#draft', 'click', () => create(false))
    },
  }
}
