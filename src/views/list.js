import { S, emp, div as getDiv, today } from '../store.js'
import { STATUSES, STAGES, EXIT_TYPES, DIVISIONS } from '../data.js'
import { esc, fdate, rel, pill, avatar, on, toast, modal, modalHead } from '../ui.js'
import { diffDays } from '../severance.js'
import { clearanceItems } from './case.js'

const typeLabel = (t) => EXIT_TYPES.find((x) => x.id === t)?.label || t

export function progress(c) {
  const items = clearanceItems(c)
  const done = items.filter((i) => i.state !== 'pending').length
  return { done, total: items.length }
}

function lifecycleModal() {
  const flow = [
    ['draft', 'Saved but not sent. Nothing has reached the employee.'],
    ['sent', 'Notice or acknowledgment sent. Waiting for the employee to accept, counter or ask questions by the deadline.'],
    ['negotiating', 'The employee countered (amount, last day, assets). Each offer and counter is logged.'],
    ['redeploy', 'Layoff only: an internal role is offered first. Accepting it closes the case as withdrawn.'],
    ['bipartite', 'Formal talks between company and employee after a dispute. The law gives 30 days.'],
    ['mediation', 'No agreement after bipartite. Registered with the local manpower office (Disnaker). If that fails, the Industrial Relations Court.'],
    ['accepted', 'Terms agreed and signed: acceptance letter or Perjanjian Bersama.'],
    ['clearance', 'Assets returned, access closed, work handed over, BPJS reported.'],
    ['settlement', 'Final pay, leave payout and severance calculated and paid.'],
    ['completed', 'Paid, certificate of employment issued, case closed.'],
    ['withdrawn', 'Closed without an exit: resignation withdrawn, retained or redeployed.'],
  ]
  modal(`${modalHead('What the statuses mean', 'Every case moves through these steps. Disputes are a side path.')}
    <ol class="p-5 space-y-3 overflow-auto">${flow.map(([k, t]) => `<li class="grid grid-cols-[170px_1fr] gap-3 items-start max-sm:grid-cols-1 max-sm:gap-1">${pill(k)}<p class="text-sm text-muted">${t}</p></li>`).join('')}</ol>`, { wide: true })
}

export function render({ query }) {
  const f = { stage: query.stage || 'all', q: query.q || '', div: 'all', type: 'all', wf: 'all', sort: 'lastDay' }
  return {
    title: 'Offboarding list',
    html: `
  <div class="rise">
    <div class="flex flex-wrap items-end justify-between gap-3 mb-5">
      <div>
        <h1 class="text-2xl sm:text-[28px] font-semibold tracking-[-0.02em]">Offboarding list</h1>
        <p class="text-sm text-muted mt-1">Sorted by last working day. <button id="legend" class="underline underline-offset-2 hover:text-ink">What the statuses mean</button></p>
      </div>
      <a href="#/new" class="btn btn-primary"><span class="icon-[majesticons--plus-line] size-4"></span>New offboarding</a>
    </div>
    <div id="tabs" class="flex gap-1 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0" role="tablist"></div>
    <div class="mt-3 grid grid-cols-2 md:grid-cols-[minmax(0,1fr)_190px_190px_150px] gap-2">
      <div class="relative col-span-2 md:col-span-1"><span class="icon-[majesticons--search-line] size-4 text-muted absolute left-3 top-3"></span><input id="q" class="field pl-9" placeholder="Search name, case number or position" value="${esc(f.q)}" /></div>
      <select id="div" class="field" aria-label="Division"><option value="all">All divisions</option>${DIVISIONS.map((d) => `<option value="${d.id}">${esc(d.name)}</option>`).join('')}</select>
      <select id="type" class="field" aria-label="Exit type"><option value="all">All exit types</option>${EXIT_TYPES.map((t) => `<option value="${t.id}">${esc(t.label)}</option>`).join('')}</select>
      <select id="wf" class="field col-span-2 md:col-span-1" aria-label="Workforce"><option value="all">All workforce</option><option value="internal">Internal</option><option value="external">External</option></select>
    </div>
    <div id="rows" class="mt-4"></div>
  </div>`,
    mount(root, { go }) {
      const $ = (s) => root.querySelector(s)
      if (query.new) {
        const c = S().cases.find((x) => x.id === query.new)
        if (c) toast(c.status === 'draft' ? `${c.id} saved as a draft` : `${c.id} created and the notice was sent to ${emp(c.emp).name}`)
      }
      const filtered = () => {
        const q = f.q.toLowerCase()
        return S().cases.filter((c) => {
          const e = emp(c.emp)
          return (f.stage === 'all' ? c.status !== 'draft' || true : STATUSES[c.status].stage === f.stage)
            && (f.div === 'all' || e.div === f.div) && (f.type === 'all' || c.type === f.type) && (f.wf === 'all' || e.type === f.wf)
            && (!q || (e.name + c.id + e.position + e.empNo).toLowerCase().includes(q))
        }).sort((a, b) => {
          const closed = (x) => ['completed', 'withdrawn'].includes(x.status) ? 1 : 0
          return closed(a) - closed(b) || (closed(a) ? b.lastDay.localeCompare(a.lastDay) : a.lastDay.localeCompare(b.lastDay))
        })
      }
      function drawTabs() {
        const cases = S().cases
        $('#tabs').innerHTML = STAGES.map((s) => {
          const n = s.id === 'all' ? cases.length : cases.filter((c) => STATUSES[c.status].stage === s.id).length
          return `<button role="tab" aria-selected="${f.stage === s.id}" data-s="${s.id}" class="tab stage">${esc(s.label)}<span class="text-xs num text-muted">${n}</span></button>`
        }).join('')
        on(root, '.stage', 'click', (e, el) => { f.stage = el.dataset.s; history.replaceState(null, '', `#/offboarding${f.stage !== 'all' ? '?stage=' + f.stage : ''}`); drawTabs(); drawRows() })
      }
      function drawRows() {
        const rows = filtered()
        if (!rows.length) {
          $('#rows').innerHTML = `<div class="card p-10 text-center"><span class="icon-[majesticons--inbox-line] size-8 text-muted"></span><p class="mt-2 font-medium">No cases here</p><p class="text-sm text-muted mt-1">${f.q || f.div !== 'all' || f.type !== 'all' || f.wf !== 'all' ? 'Try clearing the search or filters.' : 'Nothing in this stage right now.'}</p></div>`
          return
        }
        const line = (c) => {
          const e = emp(c.emp)
          const p = progress(c)
          const dd = diffDays(c.lastDay, today)
          const closed = ['completed', 'withdrawn'].includes(c.status)
          const overdueDeadline = ['sent', 'redeploy'].includes(c.status) && c.deadline && diffDays(c.deadline, today) < 0
          const next = overdueDeadline ? `Response was due ${fdate(c.deadline)}` : STATUSES[c.status].next
          const showBar = ['accepted', 'clearance', 'settlement', 'completed'].includes(c.status)
          return { c, e, p, dd, closed, next, overdueDeadline, showBar }
        }
        const data = rows.map(line)
        $('#rows').innerHTML = `
        <div class="card hidden md:block overflow-hidden">
          <table class="w-full text-sm">
            <thead class="text-xs text-muted text-left border-b border-line bg-sunk">
              <tr><th class="font-medium px-5 py-3">Employee</th><th class="font-medium px-3 py-3">Exit type</th><th class="font-medium px-3 py-3">Last day</th><th class="font-medium px-3 py-3">Status</th><th class="font-medium px-3 py-3 w-[150px]">Clearance</th><th class="font-medium px-5 py-3 text-right">Owner</th></tr>
            </thead>
            <tbody class="divide-y divide-line">
              ${data.map(({ c, e, p, dd, closed, next, overdueDeadline, showBar }) => `
              <tr data-id="${c.id}" class="row cursor-pointer hover:bg-sunk ${query.new === c.id ? 'flash' : ''}">
                <td class="px-5 py-3.5"><a href="#/offboarding/${c.id}" class="flex items-center gap-3">${avatar(e.name)}<span class="min-w-0"><span class="block font-medium">${esc(e.name)}</span><span class="block text-xs text-muted">${esc(e.position)} · <span class="num">${c.id}</span>${e.type === 'external' ? ' · External' : ''}</span></span></a></td>
                <td class="px-3 py-3.5"><span class="block">${esc(typeLabel(c.type))}</span><span class="block text-xs text-muted truncate max-w-[200px]">${esc(c.reason || 'No reason yet')}</span></td>
                <td class="px-3 py-3.5 whitespace-nowrap"><span class="block num">${fdate(c.lastDay)}</span><span class="block text-xs ${!closed && dd < 0 ? 'text-red-700 dark:text-red-400 font-medium' : 'text-muted'}">${closed ? (c.status === 'withdrawn' ? 'Not leaving' : 'Left') : rel(c.lastDay)}</span></td>
                <td class="px-3 py-3.5">${pill(c.status)}<span class="block text-xs mt-1 max-w-[230px] ${overdueDeadline ? 'text-red-700 dark:text-red-400 font-medium' : 'text-muted'}">${esc(next)}</span></td>
                <td class="px-3 py-3.5">${showBar ? `<div class="flex items-center gap-2"><div class="h-1.5 flex-1 rounded-full bg-sunk border border-line overflow-hidden"><div class="h-full bg-ink" style="width:${(p.done / p.total) * 100}%"></div></div><span class="text-xs num text-muted">${p.done}/${p.total}</span></div>` : '<span class="text-xs text-muted">Not started</span>'}</td>
                <td class="px-5 py-3.5 text-right"><span class="inline-flex" title="${esc(c.owner)}">${avatar(c.owner, 'size-7 text-[10px]')}</span></td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
        <div class="md:hidden space-y-2">
          ${data.map(({ c, e, p, dd, closed, next, overdueDeadline, showBar }) => `
            <a href="#/offboarding/${c.id}" class="card block p-4 ${query.new === c.id ? 'flash' : ''}">
              <div class="flex items-start gap-3">${avatar(e.name)}<div class="min-w-0 flex-1"><p class="font-medium truncate">${esc(e.name)}</p><p class="text-xs text-muted truncate">${esc(typeLabel(c.type))} · ${c.id}</p></div><div class="text-right shrink-0"><p class="text-sm num">${fdate(c.lastDay)}</p><p class="text-xs ${!closed && dd < 0 ? 'text-red-700 font-medium' : 'text-muted'}">${closed ? '' : rel(c.lastDay)}</p></div></div>
              <div class="mt-3 flex items-center justify-between gap-2">${pill(c.status)}${showBar ? `<span class="text-xs text-muted num">Clearance ${p.done}/${p.total}</span>` : ''}</div>
              <p class="text-xs mt-2 ${overdueDeadline ? 'text-red-700 font-medium' : 'text-muted'}">${esc(next)}</p>
            </a>`).join('')}
        </div>
        <p class="text-xs text-muted mt-3">${rows.length} case${rows.length > 1 ? 's' : ''}</p>`
        on(root, '.row', 'click', (ev, el) => { if (!ev.target.closest('a')) go('#/offboarding/' + el.dataset.id) })
      }
      on(root, '#legend', 'click', lifecycleModal)
      on(root, '#q', 'input', (e, el) => { f.q = el.value; drawRows() })
      on(root, '#div', 'change', (e, el) => { f.div = el.value; drawRows() })
      on(root, '#type', 'change', (e, el) => { f.type = el.value; drawRows() })
      on(root, '#wf', 'change', (e, el) => { f.wf = el.value; drawRows() })
      drawTabs(); drawRows()
    },
  }
}
