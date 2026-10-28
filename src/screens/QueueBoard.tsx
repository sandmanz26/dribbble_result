import { useState } from 'react'
import { Link } from 'react-router-dom'
import { DesktopIcon } from '@radix-ui/react-icons'
import { patientOf, useStore } from '@/store'
import { POLI, staff, type Poli } from '@/data/clinic'
import { STAGES } from '@/data/visits'
import { FLOOR, waitTone } from '@/components/floor'
import { PageHead, PayerPill, Segmented, Rows, ErrorBlock, useScreenState } from '@/components/kit'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// Every patient in the clinic, by station. Cards turn amber after 40 minutes and red after 60.
export default function QueueBoard() {
  const { visits, patients } = useStore()
  const screen = useScreenState()
  const [poli, setPoli] = useState<'all' | Poli>('all')
  const shown = visits.filter((v) => poli === 'all' || v.poli === poli)
  return (
    <div className="grid min-h-full grid-rows-[auto_1fr] gap-5 p-5 md:p-7">
      <PageHead title="Queue board" sub="Where every patient is right now. Waits count from arrival; the clinic's limit to see a doctor is 60 minutes.">
        <Segmented label="Clinic" value={poli} onChange={setPoli} options={[{ value: 'all', label: 'All' }, ...(Object.keys(POLI) as Poli[]).map((p) => ({ value: p, label: POLI[p].name }))]} />
        <Button asChild><a href="#/display" target="_blank" rel="noreferrer"><DesktopIcon />Waiting room screen</a></Button>
      </PageHead>
      {screen === 'loading' && <Rows n={6} />}
      {screen === 'error' && <ErrorBlock what="the queue" />}
      {screen === 'ready' && (
        <div className="-mx-5 overflow-x-auto px-5 md:-mx-7 md:px-7">
          <div className="grid min-w-[1080px] grid-cols-6 gap-3">
            {FLOOR.map((s) => {
              const here = shown.filter((v) => v.stage === s).sort((a, b) => b.arrivedMin - a.arrivedMin)
              return (
                <section key={s} className="grid content-start gap-2 rounded-card bg-raised p-2" aria-label={STAGES.find((x) => x.id === s)!.name}>
                  <header className="flex items-baseline justify-between px-1.5 pb-1 pt-0.5"><h2 className="text-[13px] font-semibold">{STAGES.find((x) => x.id === s)!.short}</h2><span className="tnum text-[12.5px] text-muted">{here.length}</span></header>
                  {here.length === 0 && <p className="px-1.5 pb-2 text-[12.5px] text-faint">Empty</p>}
                  {here.map((v) => {
                    const p = patientOf(patients, v.patientId)
                    const t = waitTone(v.arrivedMin)
                    return (
                      <Link key={v.id} to={`/visits/${v.id}`} className={cn('grid gap-2 rounded-[9px] border bg-sheet p-3 hover:border-control', t === 'neg' ? 'border-[#efc2bd]' : t === 'warn' ? 'border-[#ecd3a6]' : 'border-edge')}>
                        <div className="flex items-baseline justify-between gap-2"><span className="font-mono text-[14px] font-semibold">{v.no}</span><span className={cn('tnum text-[12px]', t === 'neg' ? 'font-semibold text-negative' : t === 'warn' ? 'font-medium text-warning' : 'text-muted')}>{v.arrivedMin} min</span></div>
                        <p className="truncate text-[13.5px] font-medium">{p.name}</p>
                        <p className="line-clamp-2 text-[12.5px] text-muted">{v.complaint}</p>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <PayerPill payer={v.payer} check={v.bpjsCheck} />
                          {v.vitals?.triage === 'red' && <span className="rounded-full bg-negative px-2 text-[11.5px] font-semibold leading-5 text-white">Triage red</span>}
                        </div>
                        <p className="truncate text-[12px] text-faint">{staff(v.doctorId).name}</p>
                      </Link>
                    )
                  })}
                </section>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
