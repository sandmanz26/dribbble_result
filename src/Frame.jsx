import { useEffect, useState } from 'react'
import { useStore, SAMPLE } from './store.jsx'
import { Mark } from './ui/kit.jsx'

// On a computer: a phone, and a reviewer panel beside it. On a phone: the app, full screen.
const Q = '(min-width: 760px) and (min-height: 700px)'
function useWide() {
  const [w, setW] = useState(() => window.matchMedia(Q).matches)
  useEffect(() => {
    const m = window.matchMedia(Q)
    const f = () => setW(m.matches)
    m.addEventListener('change', f)
    return () => m.removeEventListener('change', f)
  }, [])
  return w
}

export default function Frame({ children }) {
  const wide = useWide()
  const { reset, loadSamples, notify } = useStore()
  if (!wide) return <div className="bare">{children}</div>
  return (
    <div className="stage">
      <aside className="panel" aria-label="About this prototype">
        <div className="panel-brand"><Mark /><div><b>Faceup</b><span>A restock walk from a planogram and a stock count</span></div></div>
        <p>Clickable prototype for the retail planogram brief. Files are read and joined on SKU in the browser; there is no server.</p>
        <h2>The sample files are messy on purpose</h2>
        <ul>
          <li>Four planogram items are missing from the count.</li>
          <li>Four counted items have no place on the planogram.</li>
          <li>Three items live in two places: their shelf and an endcap.</li>
          <li>One SKU in the CSV count has a stray space before it.</li>
          <li>The column names differ between the files.</li>
        </ul>
        <h2>Try it</h2>
        <ul>
          <li><button className="linkbtn" onClick={async () => { await loadSamples(); notify({ text: 'Sample files loaded.' }) }}>Load the sample files</button></li>
          <li><a href={SAMPLE.plano} download>Planogram CSV</a> · <a href="samples/inventory-store-214.xlsx" download>Count, Excel</a> · <a href={SAMPLE.inv} download>Count, CSV</a></li>
          <li><button className="linkbtn" onClick={reset}>Start again with no files</button></li>
        </ul>
      </aside>
      <div className="device"><div className="device-screen"><div className="statusbar" aria-hidden="true"><span>6:52</span><span className="sb-icons"><i /><i /><i /></span></div>{children}</div></div>
    </div>
  )
}
