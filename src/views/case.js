import { S, update, emp as getEmp, div as getDiv, caseById, rule, tpl, today, session } from '../store.js'
import { STATUSES, EXIT_TYPES, SYSTEMS, OPENINGS, LOCATIONS, VENDORS } from '../data.js'
import { esc, idr, fdate, rel, pill, avatar, on, toast, modal, modalHead, merge } from '../ui.js'
import { settlement, addDays, diffDays } from '../severance.js'
import { profileCard, settlementCard, assetIcon, vars } from './create.js'

const typeLabel = (t) => EXIT_TYPES.find((x) => x.id === t)?.label || t

export function clearanceItems(c) {
  const e = getEmp(c.emp)
  const st = c.clear === 'all' ? null : c.clear || {}
  const val = (id) => (st ? st[id] || 'pending' : 'done')
  const items = []
  for (const s of S().clearance.filter((x) => x.on && x.for === e.type)) items.push({ id: s.id, label: s.label, dept: s.dept, kind: 'task' })
  for (const a of e.assets) items.push({ id: 'asset-' + a.kind, label: 'Return ' + a.label.toLowerCase(), sub: `${a.model} · ${a.tag}`, dept: a.dept, kind: 'asset', asset: a })
  for (const s of e.systems) items.push({ id: 'access-' + s, label: 'Close access: ' + SYSTEMS[s], dept: 'IT', kind: 'access' })
  if (e.loan) items.push({ id: 'loan', label: `Settle cooperative loan (${idr(e.loan)}), deducted from final pay`, dept: 'Finance', kind: 'task' })
  return items.map((i) => ({ ...i, state: val(i.id) }))
}

function lostAssets(c) {
  return clearanceItems(c).filter((i) => i.kind === 'asset' && i.state === 'lost').map((i) => ({ label: i.asset.label, value: i.asset.value }))
}

const TABS = [['overview', 'Overview'], ['response', 'Response'], ['clearance', 'Clearance'], ['documents', 'Documents'], ['settlement', 'Settlement']]
const DOC_STATE = {
  pending: ['Not prepared', 'text-muted'],
  generated: ['Prepared', 'text-sky-700 dark:text-sky-300'],
  sent: ['Sent for signature', 'text-amber-700 dark:text-amber-300'],
  signed: ['Signed', 'text-green-700 dark:text-green-400'],
}

export function render({ params }) {
  const c = caseById(params.id)
  if (!c) return { title: 'Not found', html: `<div class="card p-10 text-center"><p class="font-medium">Case ${esc(params.id)} not found</p><a href="#/offboarding" class="btn mt-4">Back to the list</a></div>` }
  const e = getEmp(c.emp)
  const tab = TABS.some(([k]) => k === params.tab) ? params.tab : 'overview'
  const s = settlement(e, { ...c, lostAssets: lostAssets(c) }, S().settings.company)
  const items = clearanceItems(c)
  const done = items.filter((i) => i.state !== 'pending').length
  const closed = ['completed', 'withdrawn'].includes(c.status)
  const dd = diffDays(c.lastDay, today)
  const r = rule(c.type)

  return {
    title: `${e.name} · ${c.id}`,
    html: `
  <div class="rise">
    <a href="#/offboarding" class="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink mb-4"><span class="icon-[majesticons--arrow-left-line] size-4"></span>Offboarding list</a>
    <div class="flex flex-wrap items-start gap-4 justify-between">
      <div class="flex items-start gap-4 min-w-0">
        ${avatar(e.name, 'size-14 text-base')}
        <div class="min-w-0">
          <div class="flex flex-wrap items-center gap-2.5"><h1 class="text-2xl font-semibold tracking-[-0.01em]">${esc(e.name)}</h1>${pill(c.status)}</div>
          <p class="text-sm text-muted mt-1">${esc(e.position)} · ${esc(getDiv(e.div).name)} · ${e.type === 'external' ? 'External, ' + esc(VENDORS[e.vendor].name) : e.contract}</p>
          <p class="text-sm mt-1"><span class="num font-medium">${c.id}</span> · ${esc(typeLabel(c.type))}${c.reason ? ', ' + esc(c.reason.toLowerCase()) : ''}</p>
        </div>
      </div>
      <div id="actions" class="flex flex-wrap gap-2"></div>
    </div>

    <dl class="mt-6 card p-2 grid grid-cols-2 md:grid-cols-5 gap-2">
      <div class="p-4 rounded-[18px] bg-sunk"><dt class="text-xs text-muted">Notice date</dt><dd class="mt-1 text-sm font-medium num">${fdate(c.notice)}</dd></div>
      <div class="p-4 rounded-[18px] bg-sunk"><dt class="text-xs text-muted">Last working day</dt><dd class="mt-1 text-sm font-medium num">${fdate(c.lastDay)} <span class="font-normal ${!closed && dd < 0 ? 'text-red-700 dark:text-red-400' : 'text-muted'}">${closed ? '' : rel(c.lastDay)}</span></dd></div>
      <div class="p-4 rounded-[18px] bg-sunk"><dt class="text-xs text-muted">Response deadline</dt><dd class="mt-1 text-sm font-medium num">${fdate(c.deadline)}</dd></div>
      <div class="p-4 rounded-[18px] bg-sunk"><dt class="text-xs text-muted">Clearance</dt><dd class="mt-1 text-sm font-medium num">${done} of ${items.length}</dd></div>
      <div class="p-4 rounded-[18px] bg-sunk max-md:col-span-2"><dt class="text-xs text-muted">${s.vendorPays ? 'Settlement' : 'Net settlement (est.)'}</dt><dd class="mt-1 text-sm font-medium num">${s.vendorPays ? 'Paid by vendor' : idr(s.net)}</dd></div>
    </dl>

    <div class="mt-4 rounded-full bg-accent-soft px-5 py-3 flex items-center gap-3 text-sm">
      <span class="icon-[majesticons--flag-line] size-5 text-accent shrink-0"></span>
      <p><span class="font-medium">Next:</span> ${esc(STATUSES[c.status].next)}${c.status === 'bipartite' && c.bipartiteStart ? `. Day ${diffDays(today, c.bipartiteStart) + 1} of 30, limit ${fdate(addDays(c.bipartiteStart, 30))}` : ''}${['sent', 'redeploy'].includes(c.status) && diffDays(c.deadline, today) < 0 ? `. <span class="text-red-700 dark:text-red-400 font-medium">The response deadline passed ${rel(c.deadline)}.</span>` : ''}</p>
    </div>

    <div class="mt-6 flex gap-1 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0" role="tablist">
      ${TABS.map(([k, l]) => `<a role="tab" aria-selected="${k === tab}" href="#/offboarding/${c.id}/${k}" class="tab" ${k === tab ? 'aria-current="page"' : ''}>${l}${k === 'clearance' ? `<span class="text-xs num text-muted">${done}/${items.length}</span>` : k === 'response' && c.talks.length ? `<span class="text-xs num text-muted">${c.talks.length}</span>` : ''}</a>`).join('')}
    </div>
    <div id="tab" class="mt-6"></div>
  </div>`,
    mount(root, ctx) {
      const $ = (q) => root.querySelector(q)
      const me = session()
      const log = (text, who = me.name, kind = 'system') => c.log.push([today, who, text, kind])
      const commit = (msg) => { update(() => {}); if (msg) toast(msg); ctx.keepScroll = true; ctx.rerender() }
      const setStatus = (st, text) => { c.status = st; log(text) }

      // ---------- actions ----------
      const A = []
      const btn = (id, label, primary = false, icon = '') => A.push(`<button data-a="${id}" class="act btn ${primary ? 'btn-primary' : ''}">${icon}${label}</button>`)
      const firstName = e.name.split(' ')[0]
      switch (c.status) {
        case 'draft': btn('send', 'Send notice', true, '<span class="icon-[majesticons--send-line] size-4"></span>'); btn('delete', 'Delete draft'); break
        case 'sent': btn('accept', 'Record acceptance', true); btn('counter', 'Record counter-proposal'); if (c.type === 'layoff') btn('offerRole', 'Offer internal role'); break
        case 'negotiating': btn('agree', 'Terms agreed', true); btn('offer', 'Send new offer'); btn('bipartite', 'Start bipartite'); break
        case 'redeploy': btn('roleYes', `${firstName} accepted the role`, true); btn('roleNo', 'Declined, continue layoff'); break
        case 'bipartite': btn('agree', 'Agreement reached', true); btn('mediation', 'Register for mediation'); break
        case 'mediation': btn('agree', 'Agreement reached', true); btn('mednote', 'Record mediator recommendation'); break
        case 'accepted': btn('clearance', 'Start clearance', true); break
        case 'clearance': A.push(`<button data-a="settle" class="act btn btn-primary" ${done < items.length ? 'disabled title="Finish clearance first"' : ''}>Move to final settlement</button>`); btn('remind', 'Send clearance reminder'); break
        case 'settlement': btn('close', 'Mark paid and close', true); break
      }
      if (!closed && c.status !== 'draft') A.push(`<button data-a="withdraw" class="act btn btn-quiet">Withdraw</button>`)
      $('#actions').innerHTML = A.join('')

      const askModal = (title, sub, body, okLabel, onOk) => modal(`${modalHead(title, sub)}<form class="p-5 space-y-4">${body}<div class="flex justify-end gap-2 pt-2"><button type="button" class="btn" data-close>Cancel</button><button class="btn btn-primary">${okLabel}</button></div></form>`, {
        onMount(dlg) { dlg.querySelector('form').addEventListener('submit', (ev) => { ev.preventDefault(); const fd = Object.fromEntries(new FormData(ev.target)); if (onOk(fd, dlg) !== false) dlg.close() }) },
      })

      const ACT = {
        send() {
          const t = tpl(c.template)
          setStatus('sent', `Approved by ${r.approvals.join(', ')}`)
          log(`Sent "${t?.name || 'notice'}" to ${e.type === 'external' ? VENDORS[e.vendor].name : e.name}`)
          if (!c.deadline || c.deadline < today) c.deadline = addDays(today, r.responseDays)
          commit('Notice sent')
        },
        delete() {
          askModal('Delete this draft?', 'Nothing was sent, so this only removes the draft.', '', 'Delete draft', () => {
            update((st) => { st.cases = st.cases.filter((x) => x.id !== c.id) }); toast('Draft deleted'); ctx.go('#/offboarding')
          })
        },
        accept() {
          askModal('Record acceptance', `${e.name} accepts the terms and last day.`, `
            <div><label class="label" for="how">How it was received</label><select id="how" name="how" class="field"><option>Signed letter</option><option>Reply by email</option><option>Self-service portal</option><option>In the meeting, minutes signed</option></select></div>`,
          'Mark accepted', (fd) => { setStatus('accepted', `Accepted by ${e.name} (${fd.how.toLowerCase()})`); c.talks.push([today, 'employee', `Accepted the terms (${fd.how.toLowerCase()})`, null]); commit('Marked as accepted') })
        },
        counter() {
          askModal('Record counter-proposal', 'Write down what the employee asked for, in their words.', `
            <div><label class="label" for="t">What they asked for</label><textarea id="t" name="t" rows="3" class="field" required placeholder="e.g. Two extra months of wages and to keep the laptop"></textarea></div>
            <div><label class="label" for="amt">Additional amount asked <span class="text-muted font-normal">(optional, Rp)</span></label><input id="amt" name="amt" inputmode="numeric" class="field num" placeholder="0" /></div>`,
          'Save counter', (fd) => { if (!fd.t.trim()) return false; c.talks.push([today, 'employee', fd.t.trim(), +String(fd.amt).replace(/\D/g, '') || null]); setStatus('negotiating', `${e.name} sent a counter-proposal`); commit('Counter-proposal recorded') })
        },
        offer() {
          askModal('Send new offer', 'This is logged and emailed to the employee.', `
            <div><label class="label" for="t">Offer</label><textarea id="t" name="t" rows="3" class="field" required placeholder="e.g. One additional month and the laptop at book value"></textarea></div>
            <div><label class="label" for="amt">Additional amount offered <span class="text-muted font-normal">(Rp)</span></label><input id="amt" name="amt" inputmode="numeric" class="field num" placeholder="0" /></div>
            <div><label class="label" for="dl">Reply by</label><input id="dl" name="dl" type="date" class="field num" value="${addDays(today, 5)}" /></div>`,
          'Send offer', (fd) => { if (!fd.t.trim()) return false; c.talks.push([today, 'company', fd.t.trim(), +String(fd.amt).replace(/\D/g, '') || null]); c.deadline = fd.dl; log('New offer sent'); commit('Offer sent') })
        },
        agree() {
          const last = [...c.talks].reverse().find((t) => t[3])
          askModal('Record the agreement', c.type === 'resign' ? 'Both sides agree on the terms.' : 'The agreed terms go into the Perjanjian Bersama (PB).', `
            <div><label class="label" for="extra">Agreed amount on top of the formula (Rp)</label><input id="extra" name="extra" inputmode="numeric" class="field num" value="${last ? last[3] : 0}" /><p class="hint">Last figure discussed: ${last ? idr(last[3]) : 'none'}.</p></div>
            <div><label class="label" for="ld">Last working day</label><input id="ld" name="ld" type="date" class="field num" value="${c.lastDay}" /></div>`,
          'Save agreement', (fd) => {
            c.agreedExtra = +String(fd.extra).replace(/\D/g, '') || 0
            c.lastDay = fd.ld || c.lastDay
            c.docs['doc-pb'] = c.docs['doc-pb'] === 'signed' ? 'signed' : 'generated'
            c.talks.push([today, 'company', `Agreement reached: ${idr(c.agreedExtra)} on top of the formula, last day ${fdate(c.lastDay)}`, c.agreedExtra || null])
            setStatus('accepted', `Agreement reached${['bipartite', 'mediation'].includes(c.status) ? ' (' + STATUSES[c.status].label + ')' : ''}, PB prepared`)
            commit('Agreement recorded')
          })
        },
        bipartite() { c.bipartiteStart = today; setStatus('bipartite', 'Bipartite talks started (30-day limit)'); commit('Bipartite started') },
        mediation() { setStatus('mediation', 'No agreement in bipartite. Registered for mediation at Disnaker with the bipartite minutes'); commit('Registered for mediation') },
        mednote() {
          askModal('Mediator recommendation (anjuran)', 'Both sides answer in writing within 10 working days.', `<div><label class="label" for="t">Recommendation</label><textarea id="t" name="t" rows="3" class="field" required></textarea></div>`,
            'Save', (fd) => { if (!fd.t.trim()) return false; c.talks.push([today, 'company', 'Mediator recommendation: ' + fd.t.trim(), null]); log('Mediator recommendation recorded'); commit('Saved') })
        },
        offerRole() {
          const opts = OPENINGS.map((o) => ({ o, score: o.skills.filter((x) => e.skills.includes(x)).length })).sort((a, b) => b.score - a.score)
          askModal('Offer an internal role', 'The layoff pauses while the employee decides.', `
            <div><label class="label" for="role">Role</label><select id="role" name="role" class="field">${opts.map(({ o, score }) => `<option value="${o.id}">${esc(o.title)} · ${o.grade} · ${esc(LOCATIONS[o.loc])} (${score} skills match)</option>`).join('')}</select></div>`,
          'Offer role', (fd) => { c.redeployRole = fd.role; c.talks.push([today, 'company', `Internal role ${fd.role} offered`, null]); setStatus('redeploy', `Offered ${fd.role} ${OPENINGS.find((o) => o.id === fd.role).title}`); c.deadline = addDays(today, 5); commit('Role offered') })
        },
        roleYes() {
          const o = OPENINGS.find((x) => x.id === c.redeployRole)
          c.talks.push([today, 'employee', `Accepted ${o ? o.title : 'the internal role'}`, null])
          setStatus('withdrawn', `Redeployed to ${o ? o.id + ' ' + o.title : 'an internal role'}. Layoff cancelled`)
          commit(`${e.name} is redeployed, case closed`)
        },
        roleNo() { c.talks.push([today, 'employee', 'Declined the internal role', null]); setStatus('sent', 'Internal role declined, layoff continues'); c.deadline = addDays(today, 5); commit('Layoff continues') },
        clearance() { c.clear = c.clear === 'all' ? 'all' : (c.clear || {}); setStatus('clearance', 'Clearance started. IT, GA, Finance and the manager notified'); commit('Clearance started'); ctx.go(`#/offboarding/${c.id}/clearance`) },
        remind() { log('Clearance reminder sent to the employee'); commit(`Reminder sent to ${firstName}`) },
        settle() { setStatus('settlement', 'Clearance complete. Sent to payroll for final settlement'); c.docs['doc-settle'] = c.docs['doc-settle'] || 'generated'; commit('Sent to payroll') },
        close() {
          askModal('Mark paid and close', 'Confirms final pay and issues the certificate of employment.', `
            <div><label class="label" for="pd">Payment date</label><input id="pd" name="pd" type="date" class="field num" value="${today}" /></div>
            <label class="flex items-center gap-2 text-sm"><input type="checkbox" name="pak" checked class="size-4 accent-[var(--color-accent)]" />Issue certificate of employment (paklaring)</label>`,
          'Close case', (fd) => { if (fd.pak && c.type !== 'termination') c.docs['doc-pak'] = 'signed'; setStatus('completed', `Final pay transferred on ${fdate(fd.pd)}${fd.pak ? ', paklaring issued' : ''}. Case closed`); commit('Case closed') })
        },
        withdraw() {
          askModal('Withdraw this case?', 'Use this when the employee stays: resignation withdrawn, retained or the decision is reversed.', `
            <div><label class="label" for="why">Why</label><select id="why" name="why" class="field"><option>Resignation withdrawn</option><option>Retained with a counter-offer</option><option>Decision reversed</option><option>Created by mistake</option></select></div>`,
          'Withdraw', (fd) => { setStatus('withdrawn', `Withdrawn: ${fd.why.toLowerCase()}`); commit('Case withdrawn') })
        },
      }
      on(root, '.act', 'click', (ev, el) => ACT[el.dataset.a]?.())

      // ---------- tabs ----------
      const T = {
        overview() {
          return `<div class="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-6 items-start">
            <div class="space-y-5 min-w-0">
              ${c.note ? `<section class="card p-5"><h2 class="text-sm font-semibold">File note</h2><p class="text-sm text-muted mt-1.5 leading-relaxed">${esc(c.note)}</p></section>` : ''}
              <section class="card p-5">
                <div class="flex items-center justify-between"><h2 class="text-sm font-semibold">History</h2><button id="addNote" class="btn btn-sm"><span class="icon-[majesticons--plus-line] size-4"></span>Add note</button></div>
                <ol class="mt-4 relative border-l border-line ml-2 space-y-5">
                  ${[...c.log].reverse().map(([d, who, text, kind]) => `<li class="pl-5 relative"><span class="absolute -left-[5px] top-1.5 size-[9px] rounded-full ${kind === 'employee' ? 'bg-accent' : 'bg-ink'} ring-4 ring-surface"></span><p class="text-sm">${esc(text)}</p><p class="text-xs text-muted mt-0.5"><span class="num">${fdate(d)}</span> · ${esc(who)}</p></li>`).join('')}
                </ol>
              </section>
            </div>
            <div class="space-y-4">${profileCard(e)}
              <div class="card p-5 text-sm"><p class="font-semibold">People on this case</p>
                <ul class="mt-3 space-y-2.5">
                  <li class="flex items-center gap-3">${avatar(c.owner, 'size-8 text-[11px]')}<span><span class="block">${esc(c.owner)}</span><span class="block text-xs text-muted">Case owner</span></span></li>
                  <li class="flex items-center gap-3">${avatar(e.manager, 'size-8 text-[11px]')}<span><span class="block">${esc(e.manager)}</span><span class="block text-xs text-muted">Line manager, signs handover</span></span></li>
                </ul></div>
            </div>
          </div>`
        },
        response() {
          const bip = c.bipartiteStart ? Math.min(30, diffDays(today, c.bipartiteStart) + 1) : 0
          return `<div class="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-6 items-start">
            <section class="card p-5 min-w-0">
              <h2 class="text-sm font-semibold">Offers and responses</h2>
              ${c.talks.length ? `<ol class="mt-4 space-y-3">${c.talks.map(([d, by, text, amt]) => `
                <li class="flex ${by === 'employee' ? 'justify-start' : 'justify-end'}">
                  <div class="max-w-[86%] rounded-[24px] px-4 py-3 ${by === 'employee' ? 'bg-accent-soft' : 'bg-sunk border border-line'}">
                    <p class="text-xs text-muted">${by === 'employee' ? esc(e.name) : 'Company'} · <span class="num">${fdate(d)}</span></p>
                    <p class="text-sm mt-1">${esc(text)}</p>
                    ${amt ? `<p class="text-sm font-semibold num mt-1">${idr(amt)}</p>` : ''}
                  </div>
                </li>`).join('')}</ol>` : `<p class="mt-3 text-sm text-muted">${c.status === 'draft' ? 'Nothing sent yet.' : 'No response recorded yet.'}</p>`}
              ${!closed && c.status !== 'draft' ? `<div class="mt-5 pt-4 border-t border-line flex flex-wrap gap-2">
                ${['sent', 'negotiating'].includes(c.status) ? '<button data-a="counter" class="act2 btn btn-sm">Record counter-proposal</button><button data-a="offer" class="act2 btn btn-sm">Send new offer</button>' : ''}
                ${['sent', 'negotiating', 'bipartite', 'mediation'].includes(c.status) ? '<button data-a="agree" class="act2 btn btn-sm">Terms agreed</button>' : ''}
              </div>` : ''}
            </section>
            <aside class="space-y-4">
              ${c.bipartiteStart ? `<div class="card p-5"><p class="text-sm font-semibold">Bipartite</p><p class="text-xs text-muted mt-1">Started ${fdate(c.bipartiteStart)} · UU 2/2004 gives 30 days</p>
                <div class="mt-3 h-2 rounded-full bg-sunk border border-line overflow-hidden"><div class="h-full ${bip > 23 ? 'bg-red-600' : 'bg-ink'}" style="width:${(bip / 30) * 100}%"></div></div>
                <p class="text-xs mt-2 num">${c.status === 'bipartite' ? `Day ${bip} of 30` : 'Ended'}</p></div>` : ''}
              ${c.redeployRole ? (() => { const o = OPENINGS.find((x) => x.id === c.redeployRole); return `<div class="card p-5"><p class="text-sm font-semibold">Internal role offered</p><p class="text-sm mt-2">${esc(o.title)}</p><p class="text-xs text-muted">${o.id} · ${o.grade} · ${esc(LOCATIONS[o.loc])}</p></div>` })() : ''}
              <div class="card p-5 text-sm"><p class="font-semibold">How disputes go</p>
                <ol class="mt-3 space-y-2 text-muted list-decimal pl-4">
                  <li>Bipartite talks, up to 30 days, with signed minutes</li>
                  <li>Mediation or conciliation at Disnaker</li>
                  <li>Industrial Relations Court (PHI)</li>
                </ol>
                <p class="text-xs text-muted mt-3">Wages continue while the process runs, unless a suspension is in place.</p></div>
            </aside>
          </div>`
        },
        clearance() {
          const groups = {}
          for (const i of items) (groups[i.dept] ||= []).push(i)
          const canEdit = ['accepted', 'clearance', 'settlement'].includes(c.status)
          return `
          ${!canEdit && !closed ? `<div class="mb-4 rounded-[24px] border border-line bg-sunk p-4 text-sm">Clearance opens once the terms are accepted. You can see what will be collected below.</div>` : ''}
          <div class="flex items-center gap-3 mb-4"><div class="h-2 flex-1 rounded-full bg-surface border border-line overflow-hidden"><div class="h-full bg-ink" style="width:${(done / items.length) * 100}%"></div></div><p class="text-sm num">${done} of ${items.length} done</p></div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            ${Object.entries(groups).map(([dept, list]) => `
            <section class="card">
              <div class="px-5 py-3.5 border-b border-line flex items-center justify-between"><h2 class="text-sm font-semibold">${esc(dept)}</h2><span class="text-xs text-muted num">${list.filter((i) => i.state !== 'pending').length}/${list.length}</span></div>
              <ul class="divide-y divide-line">
                ${list.map((i) => `
                <li class="px-5 py-3 flex items-center gap-3">
                  ${i.kind === 'asset' ? `<span class="size-8 rounded-full bg-sunk grid place-items-center shrink-0">${assetIcon(i.asset.kind)}</span>` : `<span class="size-8 grid place-items-center shrink-0">${i.state === 'done' ? '<span class="icon-[majesticons--check-circle-line] size-5 text-green-700 dark:text-green-400"></span>' : i.state === 'waived' ? '<span class="icon-[majesticons--minus-circle-line] size-5 text-muted"></span>' : '<span class="size-4 rounded-full border-2 border-line"></span>'}</span>`}
                  <div class="min-w-0 flex-1"><p class="text-sm ${i.state === 'done' ? 'text-muted line-through decoration-line' : ''}">${esc(i.label)}</p>${i.sub ? `<p class="text-xs text-muted num truncate">${esc(i.sub)}</p>` : ''}</div>
                  ${canEdit ? `<select data-id="${i.id}" class="ci field h-8 w-[118px] text-xs" aria-label="State of ${esc(i.label)}">
                    <option value="pending" ${i.state === 'pending' ? 'selected' : ''}>Open</option>
                    <option value="done" ${i.state === 'done' ? 'selected' : ''}>${i.kind === 'asset' ? 'Returned' : 'Done'}</option>
                    ${i.kind === 'asset' ? `<option value="lost" ${i.state === 'lost' ? 'selected' : ''}>Lost, deduct</option>` : `<option value="waived" ${i.state === 'waived' ? 'selected' : ''}>Not needed</option>`}
                  </select>` : `<span class="text-xs ${i.state === 'pending' ? 'text-muted' : ''}">${i.state === 'pending' ? 'Open' : i.state === 'lost' ? 'Lost' : i.state === 'waived' ? 'Not needed' : 'Done'}</span>`}
                </li>`).join('')}
              </ul>
            </section>`).join('')}
          </div>
          <p class="text-xs text-muted mt-4">Access closes at 18:00 on the last working day unless IT closes it earlier. Lost assets are deducted at book value.</p>`
        },
        documents() {
          const docs = S().documents
          const ids = Object.keys(c.docs)
          const extra = docs.filter((d) => !ids.includes(d.id) && d.types.includes(c.type))
          return `<div class="card">
            <ul class="divide-y divide-line">
              ${ids.length ? ids.map((id) => { const d = docs.find((x) => x.id === id); const stt = c.docs[id]; return `
              <li class="px-5 py-4 flex flex-wrap items-center gap-3">
                <span class="size-9 rounded-full bg-sunk grid place-items-center shrink-0"><span class="icon-[majesticons--document-line] size-5"></span></span>
                <div class="min-w-0 flex-1"><p class="text-sm font-medium">${esc(d.name)}</p><p class="text-xs text-muted">${esc(d.local)} · ${esc(d.lang)} · signed by ${esc(d.signer.toLowerCase())}</p></div>
                <span class="text-xs font-medium ${DOC_STATE[stt][1]} w-[120px]">${DOC_STATE[stt][0]}</span>
                <div class="flex gap-1.5">
                  <button data-id="${id}" class="prev btn btn-sm btn-quiet" aria-label="Preview ${esc(d.name)}"><span class="icon-[majesticons--eye-line] size-4"></span>Preview</button>
                  ${stt === 'pending' ? `<button data-id="${id}" data-to="generated" class="dstep btn btn-sm">Prepare</button>` : stt === 'generated' ? `<button data-id="${id}" data-to="sent" class="dstep btn btn-sm">Send for signature</button>` : stt === 'sent' ? `<button data-id="${id}" data-to="signed" class="dstep btn btn-sm">Mark signed</button>` : ''}
                </div>
              </li>` }).join('') : '<li class="p-5 text-sm text-muted">No documents on this case yet.</li>'}
            </ul>
            ${extra.length ? `<div class="px-5 py-4 border-t border-line flex flex-wrap items-center gap-2"><label for="addDoc" class="text-sm text-muted">Add a document</label><select id="addDoc" class="field h-9 w-auto min-w-[240px]"><option value="">Choose</option>${extra.map((d) => `<option value="${d.id}">${esc(d.name)}</option>`).join('')}</select></div>` : ''}
          </div>
          <p class="text-xs text-muted mt-3">Letters are bilingual where the law needs Bahasa Indonesia (UU 24/2009). The Indonesian text prevails.</p>`
        },
        settlement() {
          const jkp = ['layoff', 'mutual', 'contract'].includes(c.type) && e.type === 'internal'
          return `<div class="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-6 items-start">
            <div class="min-w-0">${settlementCard(s)}</div>
            <aside class="space-y-4">
              ${e.type === 'internal' ? `<div class="card p-5 text-sm"><p class="font-semibold">BPJS</p>
                <ul class="mt-3 space-y-2.5 text-muted">
                  <li><span class="text-ink">Old-age savings (JHT):</span> the employee can claim the full balance one month after leaving.</li>
                  ${jkp ? `<li><span class="text-ink">Job loss benefit (JKP):</span> eligible. Cash for up to 6 months (45% of wage for 3 months, then 25%, wage capped at Rp 5 jt), plus training and job information.</li>` : `<li><span class="text-ink">Job loss benefit (JKP):</span> not available for ${esc(typeLabel(c.type).toLowerCase())}.</li>`}
                  <li><span class="text-ink">Health (BPJS Kesehatan):</span> report as non-active. ${['layoff'].includes(c.type) ? 'Coverage continues 6 months after a layoff.' : ''}</li>
                </ul></div>` : ''}
              <div class="card p-5 text-sm"><p class="font-semibold">Payment</p><p class="text-muted mt-2">Paid with the payroll run after the last working day, together with prorated wages for the final month. PPh 21 is final and reported on form 1721-A1.</p></div>
            </aside>
          </div>`
        },
      }
      $('#tab').innerHTML = T[tab]()

      on(root, '.act2', 'click', (ev, el) => ACT[el.dataset.a]?.())
      on(root, '#addNote', 'click', () => askModal('Add a note', 'Visible to HR only.', `<div><label class="label" for="t">Note</label><textarea id="t" name="t" rows="3" class="field" required></textarea></div>`, 'Add note', (fd) => { if (!fd.t.trim()) return false; log(fd.t.trim()); commit('Note added') }))
      on(root, '.ci', 'change', (ev, el) => {
        if (c.clear === 'all') c.clear = Object.fromEntries(items.map((i) => [i.id, 'done']))
        c.clear[el.dataset.id] = el.value
        const it = items.find((i) => i.id === el.dataset.id)
        if (el.value !== 'pending') log(`${it.label}: ${el.selectedOptions[0].textContent.toLowerCase()}`, me.name)
        if (c.status === 'accepted') setStatus('clearance', 'Clearance started')
        commit()
      })
      on(root, '.dstep', 'click', (ev, el) => {
        c.docs[el.dataset.id] = el.dataset.to
        const d = S().documents.find((x) => x.id === el.dataset.id)
        log(`${d.name}: ${DOC_STATE[el.dataset.to][0].toLowerCase()}`)
        commit()
      })
      on(root, '#addDoc', 'change', (ev, el) => { if (el.value) { c.docs[el.value] = 'pending'; commit('Document added') } })
      on(root, '.prev', 'click', (ev, el) => letterPreview(S().documents.find((x) => x.id === el.dataset.id), c, e, s))
    },
  }
}

export function letterPreview(d, c, e, s) {
  const st = S()
  const v = c && e ? vars(e, c, s) : vars(null, {}, null)
  const no = `${String(112 + (c ? parseInt(c.id.slice(-3)) : 0)).padStart(3, '0')}/HR-ADN/XI/2026`
  const tail = {
    'doc-bast': 'The items listed in the clearance record were handed over in the condition stated, and both sides sign this record.',
    'doc-pb': `Both parties agree to end the employment relationship on ${v.last_day}, with the settlement of ${v.severance_total}, which settles all rights and obligations. This agreement is registered at the Industrial Relations Court.`,
    'doc-pak': `This is to certify that ${v.employee_name} worked at ${v.company} as ${v.position} until ${v.last_day}, and performed their duties well. This letter is issued for whatever purpose it may serve.`,
  }[d.id] || `With reference to the employment of ${v.employee_name} as ${v.position} in ${v.division}, this letter confirms the end of employment effective ${v.last_day}, with rights settled as set out in the attached statement.`
  modal(`${modalHead(esc(d.name), `${esc(d.local)} · version ${d.version} · ${esc(d.lang)}`)}
    <div class="p-5 overflow-auto max-h-[64vh] bg-sunk">
      <article class="bg-white text-[#1c1a17] rounded-lg border border-line p-8 text-[13px] leading-relaxed max-w-[620px] mx-auto">
        <p class="font-semibold">${esc(st.settings.company.name)}</p>
        <p class="text-[11px] text-[#686358]">${esc(st.settings.company.address)}</p>
        <hr class="my-4 border-[#dcd8ce]" />
        <p class="text-center font-semibold uppercase tracking-wide">${esc(d.local)}</p>
        <p class="text-center text-[11px] text-[#686358]">${esc(d.name)} · No. ${no}</p>
        <p class="mt-5">Kepada Yth. / To: <b>${esc(v.employee_name)}</b>, ${esc(v.position)}</p>
        <p class="mt-3">${esc(tail)}</p>
        <p class="mt-3 text-[#686358] italic">[Bahasa Indonesia text, which prevails, is set beside the English in the issued letter.]</p>
        <div class="mt-10 grid grid-cols-2 gap-6 text-[12px]"><div><p>Jakarta, ${fdate(today)}</p><p class="mt-12 border-t border-[#dcd8ce] pt-1">${esc(d.signer)}</p></div><div><p>&nbsp;</p><p class="mt-12 border-t border-[#dcd8ce] pt-1">${esc(v.employee_name)}</p></div></div>
      </article>
    </div>
    <div class="px-5 py-3 border-t border-line flex justify-end gap-2"><button class="btn" data-close>Close</button><button class="btn" onclick="window.print()"><span class="icon-[majesticons--printer-line] size-4"></span>Print</button></div>`, { wide: true })
}
