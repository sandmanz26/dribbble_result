import { useEffect } from 'react'
import { Navigate, Route, Routes, useSearchParams } from 'react-router-dom'
import { usePortal } from './store.jsx'
import Prototype from './shared/Prototype.jsx'
import V1Entry from './v1/Entry.jsx'
import V1Shell from './v1/Shell.jsx'
import V1Overview from './v1/Overview.jsx'
import V1Students from './v1/Students.jsx'
import V2Entry from './v2/Entry.jsx'
import V2Day from './v2/Day.jsx'

// A portal screen needs a language and a grade; without them it goes back to the entry.
// Deep links can carry both: #/v2/today?lang=si&grade=12
function Gate({ to, children }) {
  const { lang, grade, setLang, setGrade } = usePortal()
  const [params] = useSearchParams()
  const qLang = ['en', 'si'].includes(params.get('lang')) ? params.get('lang') : null
  const qGrade = Number(params.get('grade')) >= 1 && Number(params.get('grade')) <= 13 ? Number(params.get('grade')) : null
  useEffect(() => {
    if (qLang) setLang(qLang)
    if (qGrade) setGrade(qGrade)
  }, [qLang, qGrade, setLang, setGrade])
  if (!(lang || qLang) || !(grade || qGrade)) return <Navigate to={to} replace />
  if ((qLang && qLang !== lang) || (qGrade && qGrade !== grade)) return null
  return children
}

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/v1" replace />} />
        <Route path="/v1" element={<V1Entry />} />
        <Route path="/v1/portal" element={<Gate to="/v1"><V1Shell /></Gate>}>
          <Route index element={<V1Overview />} />
          <Route path="students" element={<V1Students />} />
        </Route>
        <Route path="/v2" element={<V2Entry />} />
        <Route path="/v2/today" element={<Gate to="/v2"><V2Day /></Gate>} />
        <Route path="*" element={<Navigate to="/v1" replace />} />
      </Routes>
      <Prototype />
    </>
  )
}
