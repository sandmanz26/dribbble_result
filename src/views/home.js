import { S, session, emp, today } from '../store.js'
import { STATUSES } from '../data.js'
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

const go = (label) => `<span class="size-10 rounded-full bg-sunk grid place-items-center transition-transform group-hover:translate-x-1" aria-hidden="true"><span class="icon-[majesticons--arrow-right-line] size-5"></span></span><span class="sr-only">${label}</span>`

export function render() {
  const st = S()
  const me = session()
  const cases = st.cases
  const count = (stage) => cases.filter((c) => STATUSES[c.status].stage === stage).length
  const active = cases.filter((c) => !['completed', 'withdrawn', 'draft'].includes(c.status)).length
  const items = agenda(cases).slice(0, 7)
  const urgent = items.filter((i) => i.urgent).length
  const segs = [['response', 'bg-amber-400', 'Waiting on employee'], ['dispute', 'bg-rose-500', 'In dispute'], ['exit', 'bg-emerald-500', 'Exiting'], ['draft', 'bg-slate-300 dark:bg-slate-600', 'Drafts']]
  const total = segs.reduce((s, [k]) => s + count(k), 0) || 1
  const draftTpl = st.templates.filter((t) => t.status === 'draft').length
  const offInt = Object.entries(st.settings.integrations).filter(([, v]) => !v).length

  return {
    title: 'Home',
    html: `
    <div class="rise">
      <div class="flex flex-wrap items-end justify-between gap-4 mb-7">
        <div>
          <p class="text-sm text-muted">${flong(today)}</p>
          <h1 class="text-[30px] sm:text-[38px] leading-tight font-semibold tracking-[-0.02em] mt-1">Good morning, ${esc(me.name.split(' ')[0])}</h1>
        </div>
        <a href="#/offboarding?stage=response" class="inline-flex items-center gap-2 h-10 pl-2 pr-4 rounded-full bg-surface shadow-[0_1px_2px_rgb(21_32_57/0.05)] text-sm hover:bg-sunk">
          <span class="size-6 rounded-full bg-accent-soft text-accent grid place-items-center text-xs font-semibold num">${urgent}</span>
          ${active} active cases, ${urgent} need you soon
        </a>
      </div>

      <div class="grid gap-4 lg:grid-cols-3 lg:grid-rows-[auto_auto]">
        <div class="relative rounded-[28px] p-7 sm:p-8 bg-accent text-accent-ink group lg:row-span-2 overflow-hidden flex flex-col min-h-[300px]">
          <span class="absolute -right-16 -top-16 size-64 rounded-full bg-white/10" aria-hidden="true"></span>
          <span class="absolute -right-6 top-24 size-32 rounded-full bg-white/[0.07]" aria-hidden="true"></span>
          <span class="relative size-14 rounded-full bg-white/15 grid place-items-center"><span class="icon-[majesticons--user-remove-line] size-7"></span></span>
          <h2 class="relative mt-auto pt-12 text-[26px] leading-tight font-semibold"><a href="#/new" class="after:absolute after:inset-0 after:rounded-[28px]">Create new offboarding</a></h2>
          <p class="relative mt-2 text-[15px] opacity-85 max-w-[340px]">Pick the person and the exit type. Assets, settlement and letters fill in on their own.</p>
          <div class="relative z-10 mt-6 flex flex-wrap gap-2">
            <a href="#/new?type=resign" class="h-9 px-4 rounded-full bg-white/15 hover:bg-white/25 text-[13px] inline-flex items-center">Resignation</a>
            <a href="#/new?type=layoff" class="h-9 px-4 rounded-full bg-white/15 hover:bg-white/25 text-[13px] inline-flex items-center">Layoff</a>
            <a href="#/new?type=contract" class="h-9 px-4 rounded-full bg-white/15 hover:bg-white/25 text-[13px] inline-flex items-center">Contract end</a>
            <a href="#/new?workforce=external" class="h-9 px-4 rounded-full bg-white/15 hover:bg-white/25 text-[13px] inline-flex items-center">Outsourced worker</a>
          </div>
        </div>

        <div class="relative card !rounded-[28px] p-7 group lg:col-span-2">
          <div class="flex items-start justify-between gap-4">
            <div class="flex items-center gap-4">
              <span class="size-12 rounded-full bg-accent-soft text-accent grid place-items-center shrink-0"><span class="icon-[majesticons--checkbox-list-detail-line] size-6"></span></span>
              <div><h2 class="text-xl font-semibold"><a href="#/offboarding" class="after:absolute after:inset-0 after:rounded-[28px]">Offboarding list</a></h2><p class="text-sm text-muted mt-0.5">Where every case stands right now</p></div>
            </div>
            ${go('Open the list')}
          </div>
          <div class="mt-7 flex h-3 rounded-full overflow-hidden bg-sunk gap-1">${segs.map(([k, c]) => count(k) ? `<span class="${c} rounded-full" style="width:${(count(k) / total) * 100}%"></span>` : '').join('')}</div>
          <div class="relative z-10 mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
            ${segs.map(([k, c, l]) => `<a href="#/offboarding?stage=${k}" class="rounded-2xl bg-sunk hover:bg-accent-soft px-4 py-3 transition-colors"><span class="flex items-center gap-1.5 text-xs text-muted"><span class="size-2 rounded-full ${c}"></span>${l}</span><span class="block text-2xl font-semibold num mt-1 font-[family-name:var(--font-display)]">${count(k)}</span></a>`).join('')}
          </div>
        </div>

        <div class="relative card !rounded-[28px] p-7 group">
          <div class="flex items-start justify-between"><span class="size-12 rounded-full bg-accent-soft text-accent grid place-items-center"><span class="icon-[majesticons--file-text-line] size-6"></span></span>${go('Open rules and documents')}</div>
          <h2 class="mt-6 text-xl font-semibold"><a href="#/rules" class="after:absolute after:inset-0 after:rounded-[28px]">Rules & documents</a></h2>
          <p class="mt-1 text-sm text-muted">Exit rules, email templates, letters and the clearance checklist.</p>
          <p class="mt-5 text-sm"><span class="font-semibold num">${st.rules.length}</span> rules <span class="text-muted">·</span> <span class="font-semibold num">${st.templates.length}</span> templates <span class="text-muted">·</span> <span class="font-semibold num">${st.documents.length}</span> letters</p>
          ${draftTpl ? `<p class="mt-1.5 text-xs text-muted">${draftTpl} template still in draft</p>` : ''}
        </div>

        <div class="relative card !rounded-[28px] p-7 group">
          <div class="flex items-start justify-between"><span class="size-12 rounded-full bg-accent-soft text-accent grid place-items-center"><span class="icon-[majesticons--settings-cog-line] size-6"></span></span>${go('Open settings')}</div>
          <h2 class="mt-6 text-xl font-semibold"><a href="#/settings" class="after:absolute after:inset-0 after:rounded-[28px]">Settings</a></h2>
          <p class="mt-1 text-sm text-muted">Company details, notifications, connected systems and theme.</p>
          <p class="mt-5 text-sm"><span class="font-semibold num">${Object.values(st.settings.integrations).filter(Boolean).length}</span> systems connected <span class="text-muted">·</span> <span class="font-semibold num">${st.settings.company.workweek}</span>-day week</p>
          ${offInt ? `<p class="mt-1.5 text-xs text-muted">${offInt} systems not connected yet</p>` : ''}
        </div>
      </div>

      <section class="mt-10">
        <div class="flex items-center justify-between mb-3 px-1">
          <h2 class="text-lg font-semibold">Coming up</h2>
          <a href="#/offboarding" class="text-sm text-accent font-medium hover:underline underline-offset-4">See all cases</a>
        </div>
        <div class="card !rounded-[28px] p-2">
          ${items.length ? items.map((i) => `
            <a href="#/offboarding/${i.c.id}" class="flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-3 rounded-[20px] hover:bg-sunk transition-colors">
              <div class="w-14 shrink-0 text-center rounded-2xl py-1.5 ${i.urgent ? 'bg-rose-50 dark:bg-rose-900/30' : 'bg-sunk'}"><p class="text-sm font-semibold num">${fshort(i.date)}</p><p class="text-[11px] ${i.urgent ? 'text-rose-700 dark:text-rose-300 font-medium' : 'text-muted'}">${rel(i.date)}</p></div>
              ${avatar(i.e.name, 'size-10 text-xs')}
              <div class="min-w-0 flex-1"><p class="text-sm font-medium truncate">${esc(i.e.name)} <span class="text-muted font-normal">· ${esc(i.e.position)}</span></p><p class="text-xs text-muted truncate">${esc(i.what)} · ${i.c.id}</p></div>
              <span class="hidden sm:inline">${pill(i.c.status)}</span>
            </a>`).join('') : `<p class="p-6 text-sm text-muted">Nothing due in the next three weeks.</p>`}
        </div>
      </section>
    </div>`,
  }
}
