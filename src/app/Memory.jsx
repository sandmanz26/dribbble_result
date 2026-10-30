import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Search, Bookmark, Trash } from 'pixelarticons/react'
import { useStore } from '../store.jsx'
import { MEMORY, HABITS, fmt } from '../data/myelin.js'
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs.jsx'
import { Button } from '../components/ui/button.jsx'
import { Badge } from '../components/ui/badge.jsx'
import { Dialog, DialogContent } from '../components/ui/dialog.jsx'

const KINDS = { fact: 'Facts', event: 'Events' }

// Strength, like myelin: grows with use, thins without it. Drawn as a short bar in the row.
function Strength({ v }) {
  return <span className="inline-flex items-center gap-2"><span className="relative h-1 w-16 bg-control" aria-hidden="true"><span className="absolute inset-y-0 left-0 bg-ink" style={{ width: `${v}%` }} /></span><span className="num w-7 text-right">{v}</span></span>
}

export default function Memory() {
  const { s, dispatch } = useStore()
  const loc = useLocation()
  const focus = new URLSearchParams(loc.search).get('id')
  const [tab, setTab] = useState(focus?.startsWith('E') ? 'event' : 'fact')
  const [q, setQ] = useState('')
  const [forget, setForget] = useState(null)
  const rows = MEMORY.filter((m) => m.kind === tab && !s.forgotten.includes(m.id) && (!q || m.text.toLowerCase().includes(q.toLowerCase())))
  const affected = forget ? HABITS.filter((h) => h.steps.some((x) => x.includes(forget.id))) : []
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-5">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div><h1 className="text-[26px] font-semibold">Memory</h1><p className="mt-1 max-w-[70ch] text-[14px] text-muted">What the workspace knows, how strongly, and where it came from. Strength grows each time a memory helps an answer and fades when nobody uses it.</p></div>
        <p className="num text-[13px] text-muted">{MEMORY.length - s.forgotten.length} memories · {HABITS.length} habits</p>
      </header>
      <Tabs value={tab} onValueChange={setTab}><TabsList aria-label="Kind of memory">{Object.entries(KINDS).map(([k, l]) => <TabsTrigger key={k} value={k}>{l} <span className="num ml-1 text-muted">{MEMORY.filter((m) => m.kind === k && !s.forgotten.includes(m.id)).length}</span></TabsTrigger>)}<TabsTrigger value="habit" onClick={() => { window.location.hash = '#/app/habits' }}>Habits <span className="num ml-1 text-muted">{HABITS.length}</span></TabsTrigger></TabsList></Tabs>
      <label className="flex h-9 w-full max-w-[320px] items-center gap-2 rounded-full border border-line px-3 focus-within:border-amber"><Search width={14} height={14} className="text-muted" /><span className="sr-only">Search memory</span><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search what it knows" className="w-full bg-transparent text-[13px] outline-none placeholder:text-faint" /></label>
      <div className="relative min-w-0 overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-[13.5px]">
          <thead className="text-[12px] text-muted"><tr><th className="pb-2 font-normal">Memory</th><th className="pb-2 text-right font-normal">Strength</th><th className="pb-2 text-right font-normal">Used</th><th className="pb-2 text-right font-normal">Last used</th><th className="pb-2 font-normal">Source</th><th className="pb-2"><span className="sr-only">Actions</span></th></tr></thead>
          <tbody>
            {rows.map((m) => (
              <tr key={m.id} className={`border-t border-rule align-top ${focus === m.id ? 'bg-raised/60' : ''} ${m.fading ? 'opacity-60' : ''}`}>
                <td className="max-w-[440px] py-3 pr-4">
                  <span className="num mr-2 text-muted">{m.id}</span>{m.text}
                  <span className="mt-1 flex flex-wrap gap-1.5">
                    {s.pinned.includes(m.id) && <Badge>Pinned</Badge>}
                    <Badge>{m.scope === 'me' ? 'Only Maya' : 'Team'}</Badge>
                    {m.conflict && !s.conflict && <Badge tone="warn">Conflicts with {m.conflict}</Badge>}
                    {m.fading && <Badge>Fading</Badge>}
                  </span>
                </td>
                <td className="py-3 pr-4 text-right"><Strength v={m.strength} /></td>
                <td className="num py-3 pr-4 text-right">{m.uses}</td>
                <td className="num py-3 pr-4 text-right text-muted">{fmt.day(m.last)}</td>
                <td className="py-3 pr-4 text-muted">{m.source}</td>
                <td className="whitespace-nowrap py-3 text-right">
                  <Button size="icon" variant="ghost" aria-label={s.pinned.includes(m.id) ? `Unpin ${m.id}` : `Pin ${m.id}`} aria-pressed={s.pinned.includes(m.id)} onClick={() => dispatch({ type: 'pin', id: m.id })}><Bookmark /></Button>
                  <Button size="icon" variant="ghost" aria-label={`Forget ${m.id}`} onClick={() => setForget(m)}><Trash /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!rows.length && <p className="mt-4 rounded-card border border-dashed border-line p-6 text-center text-[13.5px] text-muted">Nothing matches. Memories appear as the workspace answers questions and reads connected sources.</p>}
      </div>
      <p className="text-[12.5px] text-muted">Pinned memories never fade. "Only Maya" memories are used for Maya’s tasks and nobody else’s.</p>
      <Dialog open={!!forget} onOpenChange={(o) => !o && setForget(null)}>
        {forget && (
          <DialogContent title={`Forget ${forget.id}?`} description="Answers stop using it at once. It cannot be brought back; the source it came from stays where it is.">
            <p className="rounded-[4px] bg-raised p-3 text-[13.5px]">{forget.text}</p>
            <p className="mt-3 text-[13px] text-muted">Used in <span className="num text-ink">{forget.uses}</span> answers. {affected.length ? `Habits that rely on it: ${affected.map((h) => h.name).join(', ')}.` : 'No habit relies on it.'}</p>
            <div className="mt-5 flex justify-end gap-2"><Button variant="ghost" onClick={() => setForget(null)}>Keep it</Button><Button variant="danger" onClick={() => { dispatch({ type: 'forget', id: forget.id }); setForget(null) }}>Forget</Button></div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}
