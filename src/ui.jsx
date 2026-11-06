import { lazy, Suspense } from 'react'
import { FiArrowUpRight, FiArrowDownRight } from 'react-icons/fi'
import { initials, avatarTone, STAGES, STAGE_TONE } from './data.js'

const ApexChart = lazy(() => import('react-apexcharts'))

export function Chart(props) {
  return (
    <Suspense fallback={<div className="chart-skel" style={{ height: props.height }} />}>
      <ApexChart {...props} />
    </Suspense>
  )
}

// Shared look for every chart: Poppins, soft grid, no toolbar.
export const base = (extra = {}) => ({
  chart: { fontFamily: 'Poppins, sans-serif', toolbar: { show: false }, zoom: { enabled: false }, animations: { speed: 500 }, foreColor: '#8a92a6', ...extra.chart },
  grid: { borderColor: '#eef0f6', strokeDashArray: 4, ...extra.grid },
  dataLabels: { enabled: false },
  legend: { fontSize: '12px', markers: { radius: 12 }, ...extra.legend },
  tooltip: { theme: 'light' },
  ...Object.fromEntries(Object.entries(extra).filter(([k]) => !['chart', 'grid', 'legend'].includes(k))),
})

export function Avatar({ name, size = 36, hidden }) {
  if (hidden) return <span className="avatar ghost" style={{ width: size, height: size }} aria-hidden="true">?</span>
  return <span className="avatar" style={{ width: size, height: size, background: avatarTone(name), fontSize: size * 0.38 }} aria-hidden="true">{initials(name)}</span>
}

export function Stage({ i }) {
  return <span className={`badge ${STAGE_TONE[i]}`}><i />{STAGES[i]}</span>
}

export function Badge({ tone = 'grey', children }) {
  return <span className={`badge ${tone}`}>{children}</span>
}

export function Kpi({ icon: Icon, label, value, delta, good = true, note, tone = 'blue' }) {
  const up = delta >= 0
  return (
    <div className="card kpi">
      <div className="kpi-top">
        <span className={`kpi-ico ${tone}`}><Icon aria-hidden="true" /></span>
        {delta != null && <span className={`delta ${up === good ? 'pos' : 'neg'}`}>{up ? <FiArrowUpRight /> : <FiArrowDownRight />}{Math.abs(delta)}%</span>}
      </div>
      <p className="kpi-val">{value}</p>
      <p className="kpi-label">{label}</p>
      {note && <p className="kpi-note">{note}</p>}
    </div>
  )
}

export function Card({ title, sub, action, children, className = '', pad = true }) {
  return (
    <section className={`card ${className}`}>
      {(title || action) && (
        <header className="card-head">
          <div>{title && <h2>{title}</h2>}{sub && <p>{sub}</p>}</div>
          {action}
        </header>
      )}
      <div className={pad ? 'card-body' : ''}>{children}</div>
    </section>
  )
}

export function Progress({ value, tone = 'blue' }) {
  return <span className={`progress ${tone}`} role="progressbar" aria-valuenow={value} aria-valuemin="0" aria-valuemax="100"><b style={{ width: `${value}%` }} /></span>
}

export function Empty({ icon: Icon, title, text, children }) {
  return (
    <div className="empty">
      <span className="kpi-ico blue big"><Icon aria-hidden="true" /></span>
      <b>{title}</b>
      <p>{text}</p>
      {children}
    </div>
  )
}
