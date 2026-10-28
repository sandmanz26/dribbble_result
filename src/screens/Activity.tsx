import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '@/store'
import { ActorName } from '@/components/flow'
import { Button } from '@/components/ui/button'
import { Pill, Skel, Tab, TabList, Tabs } from '@/components/ui/misc'
import { Empty, ErrorBlock, PageHead, useScreenState } from '@/components/page'
import { clockAgo } from '@/lib/utils'

// The audit trail: every action by Patrick or a person, kept apart from any conversation. One row
// per action, newest first, with undo where the action allows it.
const RESULT = { ok: { t: 'Done', tone: 'pos' }, failed: { t: 'Failed', tone: 'neg' }, asked: { t: 'Asked a person', tone: 'warn' }, undone: { t: 'Undone', tone: 'neu' } } as const

export default function Activity() {
  const { log, undo } = useStore()
  const screen = useScreenState()
  const [who, setWho] = useState('all')
  const rows = useMemo(() => (screen === 'empty' ? [] : log.filter((l) => who === 'all' || (who === 'patrick' ? l.actor.kind === 'agent' : l.actor.kind === 'human'))), [log, who, screen])
  return (
    <div className="grid gap-5 p-5 md:p-6">
      <PageHead title="Activity" sub="Everything done today, by Patrick and by people. Kept for 7 years with the patient record." />
      <Tabs value={who} onValueChange={setWho}>
        <TabList>
          <Tab value="all">Everyone</Tab><Tab value="patrick">Patrick</Tab><Tab value="people">People</Tab>
        </TabList>
      </Tabs>
      <p className="tnum text-[13px] text-muted">{rows.length} actions</p>
      {screen === 'error' && <ErrorBlock what="the activity log" />}
      {screen === 'loading' && <div className="grid gap-3">{Array.from({ length: 8 }, (_, i) => <Skel key={i} className="h-9" />)}</div>}
      {screen !== 'loading' && screen !== 'error' && (rows.length === 0 ? <Empty title="No activity yet today">Actions appear here the moment they happen.</Empty> : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-[13.5px]">
            <thead><tr className="text-left text-[12.5px] text-muted"><th className="w-16 pb-2 font-normal">Time</th><th className="w-48 pb-2 font-normal">Who</th><th className="pb-2 font-normal">What</th><th className="w-36 pb-2 font-normal">Result</th><th className="w-24 pb-2" /></tr></thead>
            <tbody>
              {rows.map((l) => (
                <tr key={l.id} className="border-t border-rule fd-in">
                  <td className="tnum py-3 text-muted">{clockAgo(l.min)}</td>
                  <td><ActorName actor={l.actor} /></td>
                  <td className="pr-4"><span className="text-muted">{l.verb}</span> {l.object}{l.taskId && <> · <Link to={`/queue/${l.taskId}`} className="font-mono text-[12.5px] text-accent hover:underline">{l.taskId}</Link></>}</td>
                  <td><Pill tone={RESULT[l.result].tone}>{RESULT[l.result].t}</Pill></td>
                  <td className="text-right">{l.undo && l.taskId && <Button size="sm" variant="ghost" onClick={() => undo(l.taskId!)}>Undo</Button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  )
}
