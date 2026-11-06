import { useState } from 'react'
import { Card, Chart, base } from '../ui.jsx'
import { MARKET } from '../data.js'

export default function Market() {
  const [metro, setMetro] = useState(0)
  const col = MARKET.families.map((f, i) => ({ f, v: MARKET.grid[i][metro] })).sort((a, b) => b.v - a.v)
  return (
    <>
      <div className="page-head"><div><h1>Job market</h1><p>Demand for the roles our participants move into, by metro. Index 0 to 100 from the weekly job feed (sample data).</p></div></div>
      <div className="grid-2-1">
        <Card title="Demand heatmap" sub="Darker means more open roles per job seeker">
          <Chart type="heatmap" height={420}
            series={MARKET.families.map((f, i) => ({ name: f, data: MARKET.metros.map((m, j) => ({ x: m, y: MARKET.grid[i][j] })) })).reverse()}
            options={base({
              colors: ['#4c6fff'],
              plotOptions: { heatmap: { radius: 6, enableShades: true, shadeIntensity: 0.6, colorScale: { ranges: [{ from: 0, to: 45, color: '#c9d4ff' }, { from: 46, to: 65, color: '#8ea3ff' }, { from: 66, to: 100, color: '#4c6fff' }] } } },
              dataLabels: { enabled: true, style: { fontSize: '11px', fontWeight: 500 } },
              stroke: { width: 3, colors: ['#fff'] },
              legend: { show: false },
              chart: { events: { dataPointSelection: (e, c, cfg) => setMetro(cfg.dataPointIndex) } },
            })} />
        </Card>
        <Card title={`Best bets in ${MARKET.metros[metro]}`} sub="Pick a metro to compare" action={<select className="mini-select" value={metro} onChange={(e) => setMetro(+e.target.value)} aria-label="Metro">{MARKET.metros.map((m, i) => <option key={m} value={i}>{m}</option>)}</select>}>
          <ol className="rank">
            {col.map((x, i) => <li key={x.f}><span className="rank-n">{i + 1}</span><span className="grow">{x.f}</span><b>{x.v}</b></li>)}
          </ol>
          <p className="muted small">Coaches use this to steer applications toward roles with more openings near home.</p>
        </Card>
      </div>
    </>
  )
}
