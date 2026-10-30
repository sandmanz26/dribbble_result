import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { TaskSquare } from 'iconsax-react'
import { useStore } from '../store.jsx'
import { Segmented, Status, Empty, fmtDate, useLoading, SkeletonRows } from '../ui/kit.jsx'

const ORDER = { submitted: 0, draft: 1, open: 2, locked: 3 }

export default function Marks() {
  const { state, user } = useStore()
  const [params, setParams] = useSearchParams()
  const isReg = user.role === 'registrar'
  const view = params.get('view') || (isReg ? 'review' : 'mine')
  const loading = useLoading(300)

  const list = useMemo(() => {
    let a = state.assessments
    if (!isReg) a = a.filter((x) => x.teacher === user.name)
    else if (view === 'review') a = a.filter((x) => x.status === 'submitted')
    else if (view === 'late') a = a.filter((x) => x.status === 'open' || x.status === 'draft')
    return [...a].sort((x, y) => ORDER[x.status] - ORDER[y.status] || x.cls.localeCompare(y.cls, 'en', { numeric: true }))
  }, [state.assessments, isReg, view, user])

  const roster = (cls) => state.students.filter((s) => s.cls === cls && s.status !== 'withdrawn').length
  const locked = state.assessments.filter((a) => a.status === 'locked').length

  return (
    <div className="page">
      <header className="page-head">
        <h1>Marks</h1>
        <p>Term 2 midterm. {isReg ? `${locked} of ${state.assessments.length} sheets published.` : `Due ${fmtDate(state.assessments[0].due, { day: 'numeric', month: 'long' })}.`}</p>
      </header>
      {isReg && (
        <Segmented label="Show" value={view} onChange={(v) => setParams({ view: v }, { replace: true })} options={[
          { value: 'review', label: `To review (${state.assessments.filter((a) => a.status === 'submitted').length})` },
          { value: 'late', label: 'Not in yet' },
          { value: 'all', label: 'All' },
        ]} />
      )}
      {loading ? <SkeletonRows n={5} /> : list.length ? (
        <div className="sheet-list">
          {list.map((a) => {
            const n = roster(a.cls), done = Object.keys(a.marks).length
            return (
              <Link key={a.id} to={`/marks/${a.id}`} className="sheet-item">
                <span className="sheet-cls">{a.cls}</span>
                <span className="sheet-main">
                  <strong>{a.subject}</strong>
                  <small>{a.teacher || 'Subject teacher'}{a.status === 'submitted' ? '' : `, due ${fmtDate(a.due, { day: 'numeric', month: 'short' })}`}</small>
                </span>
                <span className="sheet-end">
                  <Status value={a.status} />
                  <span className="progress-text"><b>{done}</b>/{n}</span>
                </span>
              </Link>
            )
          })}
        </div>
      ) : (
        <Empty icon={<TaskSquare size={28} color="currentColor" />} title={view === 'review' ? 'Nothing to review' : 'All sheets are in'}>
          {view === 'review' ? 'When a teacher submits marks, they wait here for you to check and publish.' : 'Every class has marks entered for this assessment.'}
        </Empty>
      )}
    </div>
  )
}
