import { useState } from 'react'
import UilMinus from '@iconscout/react-unicons/icons/uil-minus'
import UilPlus from '@iconscout/react-unicons/icons/uil-plus'
import UilCopy from '@iconscout/react-unicons/icons/uil-copy'
import UilLink from '@iconscout/react-unicons/icons/uil-link'
import { useStore } from '../store.jsx'
import { CREATOR, FORMATS, ADDONS, BRANDS, PAST_BRAND_PAYMENTS, rp } from '../data/studio.js'
import { food, Mono } from '../ui.jsx'

const STEP = 500000
// Brands who opened the kit link this week (sample).
const OPENED = [['Bumbu Ibu Sari', 'Today, 08:40', '3 min'], ['Kopi Pagiku', 'Yesterday, 21:55', '1 min'], ['Antar Cepat', 'Yesterday, 13:20', '6 min'], ['Teman Jalan', '29 Oct', '4 min']]
const k = (n) => (n >= 1e6 ? `${(n / 1e6).toLocaleString('en-US', { maximumFractionDigits: 1 })}M` : `${Math.round(n / 1000)}k`)

export default function Kit() {
  const { s, dispatch, deals } = useStore()
  const [copied, setCopied] = useState(false)
  const partners = [...new Set([...deals.filter((d) => d.stage === 'paid' || d.stage === 'posted').map((d) => BRANDS[d.brand].name), ...PAST_BRAND_PAYMENTS.map((p) => p.brand)])]
  const link = 'riuh.studio/k/makankira'
  const changed = Object.entries(FORMATS).filter(([key, f]) => s.rates[key] !== f.rate).length
  return (
    <>
      <div className="title-row">
        <div>
          <h1>Media kit</h1>
          <p className="sub">What brands see when Bima sends your link. Change a rate on the left and the kit and every offer check update at once.</p>
        </div>
        <div className="actions">
          <span className="linkbox"><UilLink size={16} /><span className="num">{link}</span></span>
          <button className="btn primary" onClick={async () => { try { await navigator.clipboard.writeText(`https://${link}`) } catch { /* blocked */ } setCopied(true); dispatch({ type: 'toast', text: 'Link copied. It always shows your latest numbers.' }) }}><UilCopy size={16} />{copied ? 'Copied' : 'Copy link'}</button>
        </div>
      </div>

      <div className="grid">
        <div className="span-5 stack">
        <section className="panel" aria-labelledby="rc-h">
          <div className="panel-head"><h2 id="rc-h">Rate card</h2><span className="meta">{changed ? `${changed} changed` : 'Saved'}</span></div>
          <ul className="asks">
            {Object.entries(FORMATS).map(([key, f]) => (
              <li key={key}>
                <span>{f.name}</span>
                <span className="stepper wide">
                  <button onClick={() => dispatch({ type: 'rate', key, value: s.rates[key] - STEP })} aria-label={`Lower ${f.name}`}><UilMinus size={16} /></button>
                  <span className="num">{rp(s.rates[key])}</span>
                  <button onClick={() => dispatch({ type: 'rate', key, value: s.rates[key] + STEP })} aria-label={`Raise ${f.name}`}><UilPlus size={16} /></button>
                </span>
              </li>
            ))}
          </ul>
          <h3 className="h3" style={{ marginTop: 20 }}>Add-ons</h3>
          <dl className="lines">
            {Object.values(ADDONS).map((a) => <div key={a.name}><dt>{a.name} <span className="muted">· {a.unit}</span></dt><dd className="num">+{Math.round(a.pct * 100)}%</dd></div>)}
          </dl>
          <div className="switch-row">
            <span><b>Show rates on the kit</b><span className="muted">Off sends brands to Bima for a quote.</span></span>
            <button className={`toggle${s.showRates ? ' on' : ''}`} role="switch" aria-checked={s.showRates} aria-label="Show rates on the kit" onClick={() => dispatch({ type: 'showRates' })}><span /></button>
          </div>
        </section>
          <section className="panel" aria-labelledby="op-h">
            <div className="panel-head"><h2 id="op-h">Opened by</h2><span className="meta">last 7 days</span></div>
            <ul className="rows">
              {OPENED.map(([who, when, mins]) => <li key={who} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '10px 0' }}><span><b style={{ fontWeight: 500 }}>{who}</b><span className="muted" style={{ display: 'block', fontSize: 13 }}>{when}</span></span><span className="muted num">{mins}</span></li>)}
            </ul>
          </section>
        </div>

        <section className="span-7" aria-labelledby="kit-h">
          <h2 id="kit-h" className="sr-only">Preview</h2>
          <article className="kit">
            <div className="kit-cover">
              {['nasi-goreng-udang', 'mie-pedas', 'latte-cat', 'es-campur'].map((p) => <img key={p} src={food(p)} alt="" width="200" height="200" />)}
            </div>
            <div className="kit-body">
              <div className="kit-who">
                <Mono name={CREATOR.name} hue={CREATOR.hue} size={56} />
                <div><h3>{CREATOR.name}</h3><p className="muted">{CREATOR.handle} · {CREATOR.niche} · {CREATOR.city}</p></div>
              </div>
              <p className="kit-line">Honest street food and home cooking from Jakarta, in one-minute videos people actually finish.</p>
              <table className="t kit-stats">
                <thead><tr><th>Platform</th><th className="r">Followers</th><th className="r">Avg. views</th><th className="r">Engagement</th></tr></thead>
                <tbody>{CREATOR.platforms.map((p) => <tr key={p.key}><td>{p.name}</td><td className="r num">{k(p.followers)}</td><td className="r num">{k(p.avgViews)}</td><td className="r num">{p.er.toFixed(1)}%</td></tr>)}</tbody>
              </table>
              <div className="kit-aud">
                <div>
                  <h4>Audience</h4>
                  <div className="gender" role="img" aria-label={CREATOR.audience.gender.map(([g, v]) => `${g} ${v}%`).join(', ')}>
                    {CREATOR.audience.gender.map(([g, v], i) => <span key={g} style={{ width: `${v}%`, background: i ? 'var(--accent-track)' : 'var(--accent)' }} />)}
                  </div>
                  <p className="small" style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>{CREATOR.audience.gender.map(([g, v]) => <span key={g}>{g} {v}%</span>)}</p>
                  <ul className="bars">{CREATOR.audience.age.map(([a, v]) => <li key={a}><span>{a}</span><span className="bar"><span style={{ width: `${(v / 41) * 100}%` }} /></span><span className="num">{v}%</span></li>)}</ul>
                </div>
                <div>
                  <h4>Top cities</h4>
                  <ul className="bars">{CREATOR.audience.cities.map(([c, v]) => <li key={c}><span>{c}</span><span className="bar"><span style={{ width: `${(v / 31) * 100}%` }} /></span><span className="num">{v}%</span></li>)}</ul>
                  <h4 style={{ marginTop: 16 }}>Worked with</h4>
                  <p className="partners">{partners.slice(0, 8).join(' · ')}</p>
                </div>
              </div>
              {s.showRates ? (
                <div className="kit-rates">
                  <h4>Rates</h4>
                  <dl>{Object.entries(FORMATS).map(([key, f]) => <div key={key}><dt>{f.name}</dt><dd className="num">{rp(s.rates[key])}</dd></div>)}</dl>
                  <p className="small muted">Paid usage, exclusivity and whitelisting priced on top. 50% deposit, the rest after the insight report.</p>
                </div>
              ) : <p className="kit-rates muted">Rates on request through Riuh Talent.</p>}
              <p className="small muted kit-foot">Numbers from the last 30 days, updated 3 Nov 2026. Managed by Riuh Talent, Jakarta.</p>
            </div>
          </article>
        </section>
      </div>
    </>
  )
}
