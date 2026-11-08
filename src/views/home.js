import { S, session, emp, today } from '../store.js'
import { STATUSES, STAGES } from '../data.js'
import { esc, flong, fshort, rel, pill, avatar } from '../ui.js'
import { addDays, diffDays } from '../severance.js'

export function agenda(cases) {
  const items = []
  for (const c of cases) {
    if (['completed', 'withdrawn'].includes(c.status)) continue
    const e = emp(c.emp)
    if (c.status === 'draft') items.push({ date: c.created, c, e, what: 'Draft not sent yet', urgent: false })
    if (['sent', 'redeploy'].includes(c.status) && c.deadline) items.push({ date: c.deadline, c, e, what: 'Response due', urgent: diffDays(c.deadline, today) <= 1 })
    if (c.status === 'bipartite' && c.bipartiteStart) items.push({ date: addDays(c.bipartiteStart, 30), c, e, what: 'Bipartite 30-day limit', urgent: diffDays(addDays(c.bipartiteStart, 30), today) <= 7 })
    if (['accepted', 'clearance', 'settlement', 'negotiating', 'bipartite', 'mediation', 'sent'].includes(c.status) && diffDays(c.lastDay, today) <= 21) items.push({ date: c.lastDay, c, e, what: diffDays(c.lastDay, today) < 0 ? 'Last day passed, not closed' : 'Last working day', urgent: diffDays(c.lastDay, today) < 0 })
  }
  return items.sort((a, b) => a.date.localeCompare(b.date))
}

export function render() {
  const st = S()
  const me = session()
  const cases = st.cases
  const count = (stage) => cases.filter((c) => STATUSES[c.status].stage === stage).length
  const active = cases.filter((c) => !['completed', 'withdrawn', 'draft'].includes(c.status)).length
  const items = agenda(cases).slice(0, 7)
  const urgent = items.filter((i) => i.urgent).length
  const hour = 9
  const greet = hour < 11 ? 'Good morning' : hour < 15 ? 'Good afternoon' : 'Good evening'
  const segs = [['response', 'bg-sky-500'], ['dispute', 'bg-rose-500'], ['exit', 'bg-emerald-600'], ['draft', 'bg-stone-400']]
  const total = segs.reduce((s, [k]) => s + count(k), 0) || 1
  const draftTpl = st.templates.filter((t) => t.status === 'draft').length
  const offInt = Object.entries(st.settings.integrations).filter(([, v]) => !v).length

  return {
    title: 'Home',
    html: `
    <div class="rise">
      <div class="flex flex-wrap items-end justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <p class="text-sm text-muted">${flong(today)}</p>
          <h1 class="text-[28px] sm:text-[32px] font-semibold tracking-[-0.02em] mt-1">${greet}, ${esc(me.name.split(' ')[0])}</h1>
        </div>
        <p class="text-sm text-muted">${active} active cases${urgent ? `, <span class="text-ink font-medium">${urgent} need you soon</span>` : ''}</p>
      </div>

      <div class="grid md:grid-cols-2 gap-4">
        <div class="relative card p-6 sm:p-7 bg-accent text-accent-ink border-accent group">
          <div class="flex items-start justify-between">
            <span class="size-11 rounded-[10px] bg-white/15 grid place-items-center"><span class="icon-[majesticons--user-remove-line] size-6"></span></span>
            <span class="icon-[majesticons--arrow-right-line] size-6 transition-transform group-hover:translate-x-1"></span>
          </div>
          <h2 class="mt-8 text-xl font-semibold"><a href="#/new" class="after:absolute after:inset-0 after:rounded-[10px]">Create new offboarding</a></h2>
          <p class="mt-1.5 text-sm opacity-85 max-w-[420px]">Pick the person, the exit type and the letter. Assets, settlement and documents fill in on their own.</p>
          <div class="relative z-10 mt-6 flex flex-wrap gap-2">
            <span class="text-xs opacity-80 w-full">Start from</span>
            <a href="#/new?type=resign" class="h-8 px-3 rounded-full bg-white/15 hover:bg-white/25 text-[13px] inline-flex items-center">Resignation</a>
            <a href="#/new?type=layoff" class="h-8 px-3 rounded-full bg-white/15 hover:bg-white/25 text-[13px] inline-flex items-center">Layoff</a>
            <a href="#/new?type=contract" class="h-8 px-3 rounded-full bg-white/15 hover:bg-white/25 text-[13px] inline-flex items-center">Contract end</a>
            <a href="#/new?workforce=external" class="h-8 px-3 rounded-full bg-white/15 hover:bg-white/25 text-[13px] inline-flex items-center">Outsourced worker</a>
          </div>
        </div>

        <div class="relative card p-6 sm:p-7 hover:border-ink/30 group">
          <div class="flex items-start justify-between">
            <span class="size-11 rounded-[10px] bg-sunk border border-line grid place-items-center"><span class="icon-[majesticons--checkbox-list-detail-line] size-6"></span></span>
            <span class="icon-[majesticons--arrow-right-line] size-6 text-muted transition-transform group-hover:translate-x-1"></span>
          </div>
          <h2 class="mt-8 text-xl font-semibold"><a href="#/offboarding" class="after:absolute after:inset-0 after:rounded-[10px]">Offboarding list</a></h2>
          <p class="mt-1.5 text-sm text-muted">Every case with where it stands: waiting on the employee, in dispute, exiting or closed.</p>
          <div class="mt-6">
            <div class="flex h-2 rounded-full overflow-hidden bg-sunk gap-0.5">${segs.map(([k, c]) => count(k) ? `<span class="${c}" style="width:${(count(k) / total) * 100}%"></span>` : '').join('')}</div>
            <dl class="relative z-10 mt-3 grid grid-cols-4 gap-2 text-sm">
              ${segs.map(([k, c]) => `<a href="#/offboarding?stage=${k}" class="rounded-[6px] hover:bg-sunk -m-1 p-1"><dt class="flex items-center gap-1.5 text-xs text-muted"><span class="size-2 rounded-full ${c}"></span>${STAGES.find((s) => s.id === k).label.replace('Waiting on employee', 'Waiting')}</dt><dd class="text-lg font-semibold num mt-0.5">${count(k)}</dd></a>`).join('')}
            </dl>
          </div>
        </div>

        <div class="relative card p-6 sm:p-7 hover:border-ink/30 group">
          <div class="flex items-start justify-between">
            <span class="size-11 rounded-[10px] bg-sunk border border-line grid place-items-center"><span class="icon-[majesticons--file-text-line] size-6"></span></span>
            <span class="icon-[majesticons--arrow-right-line] size-6 text-muted transition-transform group-hover:translate-x-1"></span>
          </div>
          <h2 class="mt-8 text-xl font-semibold"><a href="#/rules" class="after:absolute after:inset-0 after:rounded-[10px]">Rules & documents</a></h2>
          <p class="mt-1.5 text-sm text-muted">Exit rules, email templates, letters and the clearance checklist that every case follows.</p>
          <dl class="mt-6 grid grid-cols-3 gap-2 text-sm">
            <div><dt class="text-xs text-muted">Exit rules</dt><dd class="text-lg font-semibold num mt-0.5">${st.rules.length}</dd></div>
            <div><dt class="text-xs text-muted">Email templates</dt><dd class="text-lg font-semibold num mt-0.5">${st.templates.length}</dd></div>
            <div><dt class="text-xs text-muted">Documents</dt><dd class="text-lg font-semibold num mt-0.5">${st.documents.length}</dd></div>
          </dl>
          ${draftTpl ? `<p class="mt-3 text-xs text-muted">${draftTpl} template in draft, not used until published</p>` : ''}
        </div>

        <div class="relative card p-6 sm:p-7 hover:border-ink/30 group">
          <div class="flex items-start justify-between">
            <span class="size-11 rounded-[10px] bg-sunk border border-line grid place-items-center"><span class="icon-[majesticons--settings-cog-line] size-6"></span></span>
            <span class="icon-[majesticons--arrow-right-line] size-6 text-muted transition-transform group-hover:translate-x-1"></span>
          </div>
          <h2 class="mt-8 text-xl font-semibold"><a href="#/settings" class="after:absolute after:inset-0 after:rounded-[10px]">Settings</a></h2>
          <p class="mt-1.5 text-sm text-muted">Company details, approval chains, users and roles, notifications and connected systems.</p>
          <dl class="mt-6 grid grid-cols-3 gap-2 text-sm">
            <div><dt class="text-xs text-muted">Users</dt><dd class="text-lg font-semibold num mt-0.5">${st.users.length}</dd></div>
            <div><dt class="text-xs text-muted">Work week</dt><dd class="text-lg font-semibold num mt-0.5">${st.settings.company.workweek} days</dd></div>
            <div><dt class="text-xs text-muted">Not connected</dt><dd class="text-lg font-semibold num mt-0.5">${offInt}</dd></div>
          </dl>
          ${offInt ? `<p class="mt-3 text-xs text-muted">BPJS reporting is done by hand until it is connected</p>` : ''}
        </div>
      </div>

      <section class="mt-8">
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-base font-semibold">Coming up</h2>
          <a href="#/offboarding" class="text-sm text-muted hover:text-ink">See all cases</a>
        </div>
        <div class="card divide-y divide-line">
          ${items.length ? items.map((i) => `
            <a href="#/offboarding/${i.c.id}" class="flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3.5 hover:bg-sunk first:rounded-t-[10px] last:rounded-b-[10px]">
              <div class="w-14 shrink-0"><p class="text-sm font-semibold num">${fshort(i.date)}</p><p class="text-xs ${i.urgent ? 'text-red-700 dark:text-red-400 font-medium' : 'text-muted'}">${rel(i.date)}</p></div>
              ${avatar(i.e.name)}
              <div class="min-w-0 flex-1"><p class="text-sm font-medium truncate">${esc(i.e.name)} <span class="text-muted font-normal">· ${esc(i.e.position)}</span></p><p class="text-xs text-muted truncate">${esc(i.what)} · ${i.c.id}</p></div>
              <span class="hidden sm:inline">${pill(i.c.status)}</span>
            </a>`).join('') : `<p class="p-6 text-sm text-muted">Nothing due in the next three weeks.</p>`}
        </div>
      </section>
    </div>`,
  }
}
