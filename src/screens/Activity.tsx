import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '@/store'
import { Avatar, PageHead, Segmented } from '@/components/kit'
import { Pill } from '@/components/ui/misc'

const RESULT = { ok: ['Done', 'pos'], failed: ['Failed', 'neg'], asked: ['Asked a person', 'warn'], undone: ['Undone', 'neu'] } as const

// The audit trail required for electronic medical records: who did what, to which record, when.
export default function Activity() {
  const { log } = useStore()
  const [who, setWho] = useState<'all' | 'asa' | 'people'>('all')
  const rows = useMemo(() => log.filter((l) => who === 'all' || (who === 'asa' ? l.who === 'Asa' : l.who !== 'Asa')), [log, who])
  return (
    <div className="grid gap-5 p-5 md:p-7">
      <PageHead title="Activity log" sub="Every action on a record, by staff or by Asa. Kept with the medical record and cannot be edited." />
      <div className="flex items-center justify-between"><Segmented label="Who" value={who} onChange={setWho} options={[{ value: 'all', label: 'Everyone' }, { value: 'asa', label: 'Asa' }, { value: 'people', label: 'Staff' }]} /><span className="tnum text-[13px] text-muted">{rows.length} entries</span></div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-[13.5px]">
          <thead><tr className="text-left text-[12px] text-muted"><th className="w-16 pb-2 font-normal">Time</th><th className="w-56 pb-2 font-normal">Who</th><th className="pb-2 font-normal">What</th><th className="w-36 pb-2 font-normal">Result</th></tr></thead>
          <tbody>{rows.map((l) => (
            <tr key={l.id} className="border-t border-rule fd-in">
              <td className="tnum py-2.5 text-muted">{new Date(l.at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</td>
              <td><span className="flex items-center gap-2"><Avatar name={l.who} size={22} />{l.who === 'Asa' ? <span>Asa <span className="text-faint">(assistant)</span></span> : l.who}</span></td>
              <td className="py-2.5 pr-4"><span className="text-muted">{l.verb}</span> {l.link ? <Link to={l.link} className="hover:underline">{l.object}</Link> : l.object}</td>
              <td><Pill tone={RESULT[l.result][1]}>{RESULT[l.result][0]}</Pill></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  )
}
