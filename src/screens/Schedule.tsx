import { useStore } from '@/store'
import { POLI, staff } from '@/data/clinic'
import { SCHEDULE } from '@/data/ops'
import { Avatar, PageHead, Panel } from '@/components/kit'
import { Pill } from '@/components/ui/misc'
import { cn } from '@/lib/utils'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// Practice hours per doctor. The same schedule is published to Mobile JKN, which only lets patients
// book inside these hours and up to the daily quota.
export default function Schedule() {
  const { visits } = useStore()
  const dow = new Date().getDay()
  return (
    <div className="grid gap-6 p-5 md:p-7">
      <PageHead title="Doctor schedule" sub="Practice hours and daily quota. Changes are published to Mobile JKN so online booking matches who is actually here.">
        <Pill tone="pos">Published to Mobile JKN</Pill>
      </PageHead>
      <Panel pad={false}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-[13.5px]">
            <thead><tr className="text-left text-[12px] text-muted"><th className="px-4 py-3 font-normal">Doctor</th>{DAYS.map((d, i) => <th key={d} className={cn('py-3 font-normal', i + 1 === dow && 'font-semibold text-ink')}>{d}{i + 1 === dow && ' (today)'}</th>)}<th className="px-4 py-3 text-right font-normal">Today</th></tr></thead>
            <tbody>{SCHEDULE.map((s) => {
              const st = staff(s.staffId)
              const booked = visits.filter((v) => v.doctorId === s.staffId).length
              return (
                <tr key={s.staffId} className="border-t border-rule">
                  <td className="px-4 py-3"><span className="flex items-center gap-2.5"><Avatar name={st.name} size={28} /><span><b className="block font-semibold">{st.name}</b><span className="text-[12.5px] text-muted">{POLI[st.poli!].name} clinic · quota {s.quota}/day</span></span></span></td>
                  {DAYS.map((_, i) => {
                    const d = s.days.find((x) => x[0] === i + 1)
                    return <td key={i} className="py-3 pr-2">{d ? <span className={cn('inline-block rounded-[6px] px-2 py-1 text-[12.5px] tnum', i + 1 === dow ? 'bg-accent text-white' : 'bg-accent-soft text-accent-ink')}>{d[1]} to {d[2]}</span> : <span className="text-faint">off</span>}</td>
                  })}
                  <td className="tnum px-4 py-3 text-right">{s.days.find((x) => x[0] === dow) ? <><b className="font-semibold">{booked}</b><span className="text-muted"> / {s.quota}</span></> : <span className="text-faint">off</span>}</td>
                </tr>
              )
            })}</tbody>
          </table>
        </div>
      </Panel>
      <p className="text-[13px] text-muted">Sunday closed. Leave and swaps are entered at least one day ahead so Mobile JKN bookings can be moved.</p>
    </div>
  )
}
