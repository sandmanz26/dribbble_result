import { Link, useParams } from 'react-router-dom'
import { UPCOMING } from '@/data/demo'
import { Button } from '@/components/ui/button'
import { Pill } from '@/components/ui/misc'

// Menu items that are planned but not designed in this round stay in the navigation, so the
// structure is visible, and open this page instead of a dead end.
export default function Upcoming() {
  const { path } = useParams()
  const u = UPCOMING.find((x) => x.path === path)
  return (
    <div className="grid min-h-full place-items-center p-6">
      <div className="grid max-w-[460px] justify-items-start gap-3">
        <Pill tone="info">Upcoming</Pill>
        <h1 className="text-[22px] font-semibold">{u?.label ?? 'Not designed yet'}</h1>
        <p className="text-[14px]">{u?.what}</p>
        <p className="text-[13.5px] text-muted">Not part of this first round. It will use the same job states, approval pattern and activity trail as the queue.</p>
        <div className="flex gap-2"><Button asChild variant="primary"><Link to="/queue">Go to the queue</Link></Button><Button asChild><Link to="/handoff">See the handoff notes</Link></Button></div>
      </div>
    </div>
  )
}
