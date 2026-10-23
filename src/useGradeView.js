import { useMemo } from 'react'
import { usePortal } from './store.jsx'
import {
  attendanceToday, belowFloor, DEMO_NOW, freeTeachers, getGrade, reliefSlots, teacherById, termResults, toMin,
} from './data/school.js'

// Everything a grade screen shows, computed once from the grade's rows.
// The prototype's "Before 07:50" state is the same day at 07:30: no register is marked yet.
export function useGradeView() {
  const { grade, mode, assignedFor } = usePortal()
  const assigned = assignedFor(grade)
  return useMemo(() => {
    const data = getGrade(grade)
    const early = mode === 'empty'
    const now = early ? toMin('07:30') : DEMO_NOW.minutes
    const view = early
      ? { ...data, classes: data.classes.map((c) => ({ ...c, register: { marked: false, absent: [], markedAt: null } })) }
      : data
    const relief = reliefSlots(view, early ? {} : assigned, now)
    const open = relief.filter((s) => !s.coverId && s.state !== 'past')
    return {
      data: view,
      now,
      early,
      attendance: attendanceToday(view),
      relief,
      open,
      results: termResults(view),
      floor: belowFloor(view).sort((a, b) => a.s.termAtt - b.s.termAtt),
      free: (n) => freeTeachers(view, n, early ? {} : assigned),
      teacher: (id) => teacherById(view, id),
      leaveTeachers: view.onLeave.map((id) => teacherById(view, id)),
    }
  }, [grade, mode, assigned])
}

export const pct = (v, d = 1) => (v == null ? null : v.toFixed(d))
