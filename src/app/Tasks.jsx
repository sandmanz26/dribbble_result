import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'pixelarticons/react'
import { useStore } from '../store.jsx'
import { PATHS, PATH_ORDER, PEOPLE, fmt } from '../data/myelin.js'
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs.jsx'
import { PathChip, Avatar } from '../ui/kit.jsx'

const PAGE = 40

export default function Tasks() {
  const { tasks } = useStore()
  const [tab, setTab] = useState('all')
  const [q, setQ] = useState('')
  const [n, setN] = useState(PAGE)
  const list = tasks.slice().reverse().filter((t) => (tab === 'all' || (tab === 'escalated' ? t.escalated : t.path === tab)) && (!q || `${t.ask} ${t.type} ${PEOPLE[t.who].name}`.toLowerCase().includes(q.toLowerCase())))
  const count = (k) => (k === 'all' ? tasks.length : k === 'escalated' ? tasks.filter((t) => t.escalated).length : tasks.filter((t) => t.path === k).length)
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-5">
      <header><h1 className="text-[26px] font-semibold">Tasks</h1><p className="mt-1 text-[14px] text-muted">Everything the workspace asked, the path each took and what it cost.</p></header>
      <Tabs value={tab} onValueChange={(v) => { setTab(v); setN(PAGE) }}>
        <TabsList aria-label="Filter by path">
          {['all', ...PATH_ORDER, 'escalated'].map((k) => <TabsTrigger key={k} value={k}>{k === 'all' ? 'All' : k === 'escalated' ? 'Escalated' : PATHS[k].name} <span className="num ml-1 text-muted">{count(k)}</span></TabsTrigger>)}
        </TabsList>
      </Tabs>
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex h-9 w-full max-w-[320px] items-center gap-2 rounded-full border border-line px-3 focus-within:border-amber"><Search width={14} height={14} className="text-muted" /><span className="sr-only">Search tasks</span><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search tasks" className="w-full bg-transparent text-[13px] outline-none placeholder:text-faint" /></label>
        <span className="num ml-auto text-[12.5px] text-muted">{list.length} tasks</span>
      </div>
      {list.length ? (
        <div className="relative min-w-0 overflow-x-auto">
        <table className="w-full table-fixed text-left text-[13.5px] sm:table-auto">
          <thead className="text-[12px] text-muted"><tr><th className="pb-2 font-normal">Task</th><th className="hidden pb-2 font-normal md:table-cell">Who</th><th className="hidden pb-2 font-normal sm:table-cell">Type</th><th className="pb-2 text-right font-normal">When</th></tr></thead>
          <tbody>
            {list.slice(0, n).map((t) => (
              <tr key={t.id} className="border-t border-rule hover:bg-raised/40">
                <td className="break-words py-3 pr-4"><Link to={`/app/tasks/${t.id}`} className="block"><span className="block">{t.ask}</span><PathChip t={t} className="mt-1" /></Link></td>
                <td className="hidden py-3 pr-4 md:table-cell"><span className="flex items-center gap-2"><Avatar who={t.who} size={20} />{PEOPLE[t.who].name.split(' ')[0]}</span></td>
                <td className="hidden py-3 pr-4 text-muted sm:table-cell">{t.type}</td>
                <td className="num w-[64px] whitespace-nowrap py-3 text-right align-top text-muted sm:w-auto"><span className="hidden sm:inline">{fmt.day(t.at)} </span>{fmt.clock(t.at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      ) : <p className="rounded-card border border-dashed border-line p-6 text-center text-[13.5px] text-muted">No tasks match. {tab === 'escalated' ? 'Nothing escalated in this window.' : 'Try another word.'}</p>}
      {n < list.length && <button className="justify-self-center text-[13px] text-muted underline underline-offset-4 hover:text-ink" onClick={() => setN(n + PAGE)}>Show {Math.min(PAGE, list.length - n)} more</button>}
    </div>
  )
}
