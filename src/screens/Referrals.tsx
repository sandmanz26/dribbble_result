import { Link } from 'react-router-dom'
import { useStore } from '@/store'
import { StateGlyph, StatePill, ActorName } from '@/components/flow'
import { Skel } from '@/components/ui/misc'
import { Empty, ErrorBlock, PageHead, useScreenState } from '@/components/page'
import { ago } from '@/lib/utils'

const EXTRA = [
  { id: 'T-2083', title: 'Amir Haddad', from: 'Fax, Lakeside Orthopedics', state: 'done' as const, min: 52 },
  { id: 'T-2076', title: 'Ruth Abara', from: 'Fax, Northgate Family Medicine', state: 'done' as const, min: 151 },
]

export default function Referrals() {
  const { tasks } = useStore()
  const screen = useScreenState()
  const refs = tasks.filter((t) => t.workflow === 'referral')
  return (
    <div className="grid gap-5 p-5 md:p-6">
      <PageHead title="Referrals" sub="Every referral that arrived today and where it is. Patrick reads each fax, matches the patient, checks insurance and proposes the first visit." />
      {screen === 'error' && <ErrorBlock what="referrals" />}
      {screen === 'loading' && <div className="grid gap-3">{Array.from({ length: 5 }, (_, i) => <Skel key={i} className="h-12" />)}</div>}
      {screen === 'empty' && <Empty title="No referrals today">New faxes and e-referrals show up here within a minute of arriving.</Empty>}
      {screen === 'ready' && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-[13.5px]">
            <thead><tr className="text-left text-[12.5px] text-muted"><th className="pb-2 font-normal">Referral</th><th className="pb-2 font-normal">State</th><th className="pb-2 font-normal">Owner</th><th className="pb-2 text-right font-normal">Arrived</th></tr></thead>
            <tbody>
              {refs.map((t) => (
                <tr key={t.id} className="border-t border-rule">
                  <td className="py-3"><Link to={t.runId ? `/runs/${t.runId}` : `/queue/${t.id}`} className="flex items-center gap-3 hover:underline"><StateGlyph state={t.state} /><span><b className="block font-semibold">{t.patient?.name ?? 'Patient not known yet'}</b><span className="text-muted">{t.title}</span></span></Link></td>
                  <td><StatePill state={t.state} /></td>
                  <td><ActorName actor={t.owner} /></td>
                  <td className="tnum text-right text-muted">{ago(t.createdMin)}</td>
                </tr>
              ))}
              {EXTRA.map((r) => (
                <tr key={r.id} className="border-t border-rule">
                  <td className="py-3"><span className="flex items-center gap-3"><StateGlyph state={r.state} /><span><b className="block font-semibold">{r.title}</b><span className="text-muted">{r.from}, filed to chart</span></span></span></td>
                  <td><StatePill state={r.state} /></td>
                  <td><ActorName actor={{ kind: 'agent', name: 'Patrick' }} /></td>
                  <td className="tnum text-right text-muted">{ago(r.min)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
