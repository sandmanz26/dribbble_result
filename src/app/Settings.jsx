import { useState } from 'react'
import { useStore } from '../store.jsx'
import { BUDGETS, MONTH, WORKSPACE, fmt, forecast } from '../data/myelin.js'
import { Switch } from '../components/ui/switch.jsx'
import { Slider } from '../components/ui/slider.jsx'
import { Button } from '../components/ui/button.jsx'

function Row({ title, desc, children, id }) {
  return (
    <section className="grid gap-4 border-t border-line py-7 md:grid-cols-[minmax(0,380px)_1fr] md:gap-10" aria-labelledby={id}>
      <div><h2 id={id} className="text-[15px] font-semibold">{title}</h2><p className="mt-1 text-[13.5px] text-muted">{desc}</p></div>
      <div className="rounded-card bg-surface p-5">{children}</div>
    </section>
  )
}

export default function Settings() {
  const { s, dispatch } = useStore()
  const [retain, setRetain] = useState([90])
  const [team, setTeam] = useState(true)
  const [sources, setSources] = useState({ mail: true, helpdesk: true, drive: false })
  const f = forecast(s.budget)
  return (
    <div>
      <header className="mb-6"><h1 className="text-[26px] font-semibold">Settings</h1><p className="mt-1 text-[14px] text-muted">How much the workspace thinks, what it remembers, and for how long.</p></header>
      <dl className="mb-2 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
        <div><dt className="text-[12.5px] text-muted">Forecast this month</dt><dd className="num mt-1 text-[26px]">{fmt.usd(f.cost)}</dd></div>
        <div><dt className="text-[12.5px] text-muted">Monthly cap</dt><dd className="num mt-1 text-[26px]">{fmt.usd(WORKSPACE.cap)}</dd></div>
        <div><dt className="text-[12.5px] text-muted">Tasks on Reason</dt><dd className="num mt-1 text-[26px]">{fmt.pct(f.share)}</dd></div>
        <div><dt className="text-[12.5px] text-muted">Baseline</dt><dd className="num mt-1 text-[26px]">{fmt.usd(MONTH.base)}</dd></div>
      </dl>
      <p className="mb-4 text-[12.5px] text-muted"><a href="#/app/spend" className="underline underline-offset-4 hover:text-ink">View the spend</a></p>

      <Row id="b-h" title="Thinking budget" desc="How sure a fast path must be before it answers on its own. Higher means more thinking, better for anything sent outside, and a higher bill.">
        <div role="radiogroup" aria-label="Thinking budget" className="grid gap-2 sm:grid-cols-3">
          {Object.entries(BUDGETS).map(([k, b]) => {
            const on = s.budget === k
            return (
              <button key={k} role="radio" aria-checked={on} onClick={() => dispatch({ type: 'budget', key: k, label: b.name })}
                className={`sel-under grid gap-1 rounded-[6px] bg-ground p-3 text-left ${on ? 'active' : 'hover:bg-raised'}`} data-on={on}>
                <span className="text-[14px] font-semibold">{b.name}</span>
                <span className="num text-[12.5px] text-muted">answers at {fmt.pct(b.threshold)} sure</span>
                <span className="num text-[12.5px]">{fmt.usd(forecast(k).cost)} a month</span>
              </button>
            )
          })}
        </div>
        <p className="mt-4 text-[13.5px]">{BUDGETS[s.budget].says}</p>
        <p className="mt-2 text-[12.5px] text-muted">Forecasts use this month’s {MONTH.n.toLocaleString('en-US')} tasks. Anyone can still press Think it through on a single answer.</p>
      </Row>

      <Row id="m-h" title="Memory" desc="Unused memories fade so old facts stop shaping answers. Pinned memories never fade.">
        <label className="text-[13.5px] font-semibold" htmlFor="retain">Let unused memories fade after <span className="num">{retain[0]}</span> days</label>
        <Slider id="retain" className="mt-3" min={30} max={365} step={15} value={retain} onValueChange={setRetain} label="Days before unused memories fade" />
        <div className="mt-2 flex justify-between text-[12px] text-muted num"><span>30 days</span><span>1 year</span></div>
        <div className="mt-5 flex items-center justify-between gap-4 border-t border-rule pt-4"><span><b className="block text-[13.5px] font-semibold">Share memories with the team</b><span className="text-[13px] text-muted">Off keeps each person’s memories to their own tasks.</span></span><Switch checked={team} onCheckedChange={setTeam} aria-label="Share memories with the team" /></div>
      </Row>

      <Row id="s-h" title="Sources" desc="Where memories may come from. Nothing is read from a source until it is switched on here.">
        {[['mail', 'Shared mail inbox', 'Supplier and customer threads'], ['helpdesk', 'Help desk', 'Tickets and macros'], ['drive', 'Drive', 'Policies, product sheets, planning docs']].map(([k, t, d]) => (
          <div key={k} className="flex items-center justify-between gap-4 border-t border-rule py-3 first:border-0 first:pt-0"><span><b className="block text-[13.5px] font-semibold">{t}</b><span className="text-[13px] text-muted">{d}</span></span><Switch checked={sources[k]} onCheckedChange={(v) => setSources({ ...sources, [k]: v })} aria-label={t} /></div>
        ))}
      </Row>

      <Row id="d-h" title="Your data" desc="Export everything the workspace remembers, or wipe it.">
        <div className="flex flex-wrap gap-2"><Button variant="outline">Export memory as JSON</Button><Button variant="ghost" onClick={() => dispatch({ type: 'reset' })}>Reset the demo</Button></div>
      </Row>
    </div>
  )
}
