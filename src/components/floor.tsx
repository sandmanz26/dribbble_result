import { Link } from 'react-router-dom'
import { patientOf, useStore } from '@/store'
import { STAGES, type Stage, type Visit } from '@/data/visits'
import { POLI } from '@/data/clinic'
import { cn } from '@/lib/utils'

// The clinic floor as one line: every station, how many people are there, and who has waited
// longest. Waits are counted from arrival; over 60 minutes is the clinic's limit.
export const FLOOR: Stage[] = ['vitals', 'doctor_queue', 'consult', 'lab', 'pharmacy', 'cashier']
const LINK: Partial<Record<Stage, string>> = { vitals: '/vitals', doctor_queue: '/consult', consult: '/consult', lab: '/lab', pharmacy: '/pharmacy', cashier: '/cashier' }

export function waitTone(min: number) { return min >= 60 ? 'neg' : min >= 40 ? 'warn' : 'ok' }

export function FloorLine({ visits }: { visits: Visit[] }) {
  const { patients } = useStore()
  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-card border border-edge bg-edge sm:grid-cols-3 xl:grid-cols-6">
      {FLOOR.map((s, i) => {
        const here = visits.filter((v) => v.stage === s).sort((a, b) => b.arrivedMin - a.arrivedMin)
        const longest = here[0]
        return (
          <Link key={s} to={LINK[s] ?? '/queue'} className="group relative grid content-start gap-3 bg-sheet p-4 hover:bg-raised">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[12.5px] font-medium text-muted"><span className="tnum mr-1.5 text-faint">{i + 1}</span>{STAGES.find((x) => x.id === s)!.short}</span>
              {i < FLOOR.length - 1 && <span className="hidden h-px w-6 bg-control xl:block" aria-hidden="true" />}
            </div>
            <p className="tnum text-[30px] font-medium leading-none tracking-[-0.03em]">{here.length}</p>
            <div className="flex -space-x-1.5" aria-hidden="true">
              {here.slice(0, 6).map((v) => {
                const p = patientOf(patients, v.patientId)
                const t = waitTone(v.arrivedMin)
                return <span key={v.id} className={cn('grid size-6 place-items-center rounded-full border-2 border-sheet text-[9.5px] font-semibold', t === 'neg' ? 'bg-neg-bg text-neg-ink' : t === 'warn' ? 'bg-warn-bg text-warn-ink' : 'bg-neu-bg text-neu-ink')}>{p.name.split(' ').map((w) => w[0]).slice(0, 2).join('')}</span>
              })}
              {here.length > 6 && <span className="grid size-6 place-items-center rounded-full border-2 border-sheet bg-active text-[9.5px] font-semibold">+{here.length - 6}</span>}
            </div>
            <p className={cn('text-[12px]', !longest ? 'text-faint' : waitTone(longest.arrivedMin) === 'neg' ? 'font-medium text-negative' : 'text-muted')}>
              {longest ? <>Longest: {longest.no} · {longest.arrivedMin} min</> : 'Nobody waiting'}
            </p>
          </Link>
        )
      })}
    </div>
  )
}

export const poliName = (p: keyof typeof POLI) => POLI[p].name
