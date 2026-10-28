import { Link } from 'react-router-dom'
import { ArrowRightIcon } from '@radix-ui/react-icons'
import { useStore } from '@/store'
import { HOURS, ME } from '@/data/demo'
import { Indeterminate, Progress, StateGlyph } from '@/components/flow'
import { Pill, Skel } from '@/components/ui/misc'
import { Empty, ErrorBlock, PageHead, useScreenState } from '@/components/page'
import { ago, cn, sla } from '@/lib/utils'

export default function Today() {
  const { tasks } = useStore()
  const screen = useScreenState()
  const needs = tasks.filter((t) => t.state === 'needs_review').sort((a, b) => (a.slaMin ?? 9e9) - (b.slaMin ?? 9e9))
  const failed = tasks.filter((t) => t.state === 'failed')
  const running = tasks.filter((t) => t.state === 'running' || t.state === 'approving' || t.state === 'waiting' || t.state === 'queued')
  const byAgent = HOURS.reduce((s, h) => s + h.agent, 0)
  const byPeople = HOURS.reduce((s, h) => s + h.human, 0)
  const hour = new Date().getHours()
  const name = ME.kind === 'human' ? ME.name.split(' ')[0] : ''
  const empty = screen === 'empty'

  return (
    <div className="grid gap-6 p-5 md:p-6">
      <PageHead title={`${hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'}, ${name}`} sub={empty ? 'Nothing is waiting for you.' : `${needs.length + failed.length} things need a person. The most urgent is due in ${needs[0] ? sla(needs[0].slaMin ?? 0).replace(' left', '') : 'a while'}.`} />

      {screen === 'error' && <ErrorBlock what="today's summary" />}
      {screen === 'loading' && <div className="grid gap-6 md:grid-cols-4">{[0, 1, 2, 3].map((i) => <Skel key={i} className="h-[92px]" />)}</div>}

      {(screen === 'ready' || empty) && (
        <>
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            <Kpi label="Needs you" value={empty ? 0 : needs.length} note={empty ? 'All clear' : `${needs.filter((t) => (t.slaMin ?? 999) < 60).length} due within the hour`} />
            <Kpi label="Failed, needs a choice" value={empty ? 0 : failed.length} note={empty ? 'None' : 'Recovery options ready'} />
            <Kpi label="Patrick is running" value={empty ? 0 : running.length} note={empty ? 'Idle' : `${running.filter((t) => t.state === 'waiting').length} waiting on payers or senders`} />
            <Kpi label="Finished since 08:00" value={empty ? 0 : byAgent + byPeople} note={empty ? 'No work yet today' : `${byAgent} by Patrick, ${byPeople} by people`} />
          </div>

          <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
            <section className="grid content-start gap-3" aria-labelledby="h-needs">
              <div className="flex items-baseline justify-between"><h2 id="h-needs" className="text-[16px] font-semibold">For you, most urgent first</h2><Link to="/queue" className="flex items-center gap-1 text-[13px] text-accent hover:underline">Open the queue<ArrowRightIcon /></Link></div>
              {empty ? <Empty title="Nothing needs you right now">Patrick asks here when a rule says so or when something fails.</Empty> : (
                <ul className="grid">
                  {[...failed, ...needs].map((t) => (
                    <li key={t.id}>
                      <Link to={`/queue/${t.id}`} className="grid grid-cols-[16px_1fr_auto] items-center gap-3 border-b border-rule py-3 hover:bg-raised md:px-2">
                        <StateGlyph state={t.state} />
                        <span className="min-w-0"><b className="block truncate text-[14px] font-semibold">{t.title}</b><span className="block truncate text-[13px] text-muted">{t.patient?.name ?? ''}{t.patient ? ' · ' : ''}{t.summary}</span></span>
                        <span className="flex items-center gap-2">{t.state === 'failed' ? <Pill tone="neg">Failed</Pill> : t.slaMin !== undefined && <Pill tone={t.slaMin < 60 ? 'warn' : 'neu'}>{sla(t.slaMin)}</Pill>}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="grid content-start gap-3" aria-labelledby="h-run">
              <h2 id="h-run" className="text-[16px] font-semibold">Patrick right now</h2>
              {empty ? <p className="text-[13.5px] text-muted">Nothing running.</p> : (
                <ul className="grid gap-4">
                  {running.map((t) => (
                    <li key={t.id} className="grid gap-2">
                      <Link to={`/queue/${t.id}`} className="flex items-start gap-2.5 hover:underline">
                        <StateGlyph state={t.state} />
                        <span className="min-w-0"><b className="block text-[14px] font-medium">{t.title}</b><span className="block text-[12.5px] text-muted">{t.state === 'waiting' ? t.waitingOn : t.state === 'queued' ? t.summary : `Started ${ago(t.createdMin)}`}</span></span>
                      </Link>
                      {t.state === 'running' && <div className="pl-6">{t.progress ? <Progress {...t.progress} /> : <Indeterminate />}</div>}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          {!empty && <HoursChart />}
        </>
      )}
    </div>
  )
}

function Kpi({ label, value, note }: { label: string; value: number; note: string }) {
  return (
    <div className="grid gap-1">
      <p className="text-[13px] font-semibold text-muted">{label}</p>
      <p className="tnum text-[28px] leading-tight">{value}</p>
      <p className="text-[12.5px] text-muted">{note}</p>
    </div>
  )
}

// One question: who is doing the work, hour by hour? Patrick in the product colour, people in grey.
function HoursChart() {
  const max = Math.max(...HOURS.map((h) => h.agent + h.human))
  const H = 140
  return (
    <section className="grid gap-3" aria-labelledby="h-hours">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="h-hours" className="text-[16px] font-semibold">Work finished per hour</h2>
        <p className="flex items-center gap-4 text-[12.5px] text-muted"><span className="flex items-center gap-1.5"><i className="size-2.5 rounded-[3px] bg-chart-1" />Patrick</span><span className="flex items-center gap-1.5"><i className="size-2.5 rounded-[3px] bg-chart-2" />People</span></p>
      </div>
      <p className="text-[13.5px]">Patrick finished about three items for every one done by a person; the dip at 12:00 is lunch, when fewer faxes arrive.</p>
      <div className="grid grid-cols-6 items-end gap-3" style={{ height: H + 24 }} role="img" aria-label={HOURS.map((h) => `${h.h}:00 Patrick ${h.agent}, people ${h.human}`).join('; ')}>
        {HOURS.map((h) => (
          <div key={h.h} className="grid justify-items-center gap-1.5">
            <span className="tnum text-[12px] text-muted">{h.agent + h.human}</span>
            <div className="flex w-full max-w-14 flex-col-reverse overflow-hidden rounded-[4px]" style={{ height: ((h.agent + h.human) / max) * H }}>
              <div className="bg-chart-1" style={{ height: `${(h.agent / (h.agent + h.human)) * 100}%` }} />
              <div className={cn('bg-chart-2')} style={{ height: `${(h.human / (h.agent + h.human)) * 100}%` }} />
            </div>
            <span className="tnum text-[12px] text-muted">{h.h}:00</span>
          </div>
        ))}
      </div>
    </section>
  )
}

