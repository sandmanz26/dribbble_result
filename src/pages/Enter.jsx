import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CATEGORIES, GROUPS, WINNERS, dateOf, fmtDate } from '../data/awards.js'
import { Ribbon, photo } from '../ui.jsx'

const KEY = 'tla-entry-v1'
const STEPS = ['Eligibility', 'Categories', 'Your product', 'Review']
const SIZES = [['under2', 'Under $2M a year in revenue', 95], ['over2', '$2M a year or more', 295], ['nonprofit', 'Nonprofit or open-source project', 0]]
const blank = { step: 0, sells: '', size: '', cats: [], name: '', site: '', company: '', what: '', demo: '', done: null }

function load() { try { return { ...blank, ...JSON.parse(localStorage.getItem(KEY)) } } catch { return blank } }

// Fees for the review: first category at the size rate (early rate before 15 January), then $150 each.
export function feeOf(size, n, today = new Date()) {
  if (!n || !size) return 0
  if (size === 'nonprofit') return 0
  if (size === 'under2') return 95 * n
  const first = today < dateOf('early') ? 245 : 295
  return first + 150 * (n - 1)
}

export default function Enter() {
  const [params] = useSearchParams()
  const [f, setF] = useState(load)
  const [err, setErr] = useState({})
  useEffect(() => { const c = params.get('cat'); if (c && !f.cats.includes(c) && f.cats.length < 3 && !f.done) setF((x) => ({ ...x, cats: [...x.cats, c] })) }, []) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(f)) } catch { /* private mode */ } }, [f])
  const set = (k, v) => { setF((x) => ({ ...x, [k]: v })); setErr((e) => ({ ...e, [k]: undefined })) }
  const max = f.size === 'nonprofit' ? 1 : 3
  const check = () => {
    const e = {}
    if (f.step === 0) { if (!f.sells) e.sells = 'Choose one.'; else if (f.sells === 'no') e.sells = 'The awards are for products people can use or buy today. You can enter once it is live.'; if (!f.size) e.size = 'Choose the size that fits.' }
    if (f.step === 1 && !f.cats.length) e.cats = 'Choose at least one category.'
    if (f.step === 1 && f.cats.length > max) e.cats = `Choose up to ${max}.`
    if (f.step === 2) { if (f.name.trim().length < 2) e.name = 'Give the product’s name.'; if (f.company.trim().length < 2) e.company = 'Give the company’s name.'; if (!/^https?:\/\/\S+\.\S+/.test(f.site.trim())) e.site = 'Use a full address, starting with https://'; if (f.what.trim().split(/\s+/).length < 8) e.what = 'Two sentences at least: what it does and for whom.' }
    setErr(e)
    // Send focus to the first thing that needs fixing.
    const firstBad = Object.keys(e)[0]
    if (firstBad) requestAnimationFrame(() => { const el = document.getElementById(firstBad) || document.querySelector(`[name="${firstBad}"]`) || document.querySelector('.err'); el?.focus?.() })
    return !Object.keys(e).length
  }
  const next = () => { if (check()) set('step', Math.min(3, f.step + 1)) }
  const back = () => set('step', Math.max(0, f.step - 1))
  const submit = () => set('done', `TLA-27-${String(4100 + Math.floor(Math.random() * 800))}`)
  const reset = () => { setF(blank); setErr({}) }
  const fee = feeOf(f.size, f.cats.length)
  const stepHead = useRef(null)
  const moved = useRef(false)
  // Each step is announced and focused when you arrive at it, so keyboard and screen reader users are not left on the old button.
  useEffect(() => { if (moved.current) stepHead.current?.focus(); moved.current = true }, [f.step, f.done])

  return (
    <>
      <section className="page-head" aria-labelledby="ph">
        <h1 id="ph" data-rise>Enter the 2027 awards</h1>
        <p data-rise>Four short steps, and your draft is kept on this device. Entries close {fmtDate(dateOf('close'))}. No payment is taken in this prototype.</p>
      </section>
      <section className="wrap" style={{ marginTop: 48, paddingBottom: 40 }}>
        <div className="two w75" style={{ alignItems: 'start' }}>
          <div className="panel" style={{ padding: 0 }} data-rise>
            <Ribbon thin />
            <div style={{ padding: 'clamp(22px,3vw,40px)' }}>
              {f.done ? (
                <div role="status" className="step-body">
                  <h2 ref={stepHead} tabIndex={-1} style={{ fontSize: 'var(--step-lead)', fontWeight: 600 }}>Entry received</h2>
                  <p style={{ marginTop: 12 }}>Your reference is <b>{f.done}</b>. We check eligibility within ten days and write to you either way. If it is not eligible, the fee is refunded in full.</p>
                  <p style={{ marginTop: 12 }} className="muted">Next: write your 400-word answer for each criterion and add a demo account. You can do it any time before {fmtDate(dateOf('close'))}.</p>
                  <div className="form-nav"><Link to="/categories" className="link">Back to the categories</Link><button className="ghost" onClick={reset}>Start another entry</button></div>
                </div>
              ) : (
                <>
                  <ol className="steps" aria-label="Steps" data-rise>{STEPS.map((s, i) => <li key={s} className={i === f.step ? 'on' : i < f.step ? 'done' : ''} aria-current={i === f.step ? 'step' : undefined}>{s}</li>)}</ol>
                  <h2 className="step-title" ref={stepHead} tabIndex={-1}>{STEPS[f.step]}<span className="sr-only">, step {f.step + 1} of 4</span></h2>
                  <div className="step-body" key={f.step}>
                  {f.step === 0 && (
                    <>
                      <fieldset className="field" style={{ border: 0, padding: 0, margin: '0 0 22px' }}>
                        <legend>Is the product live, with paying customers or active users?</legend>
                        <div className="choice">{[['yes', 'Yes, people use it today'], ['no', 'Not yet']].map(([v, l]) => <label key={v}><input type="radio" name="sells" id={v === 'yes' ? 'sells' : undefined} checked={f.sells === v} onChange={() => set('sells', v)} />{l}</label>)}</div>
                        {err.sells && <p className="err" role="alert">{err.sells}</p>}
                      </fieldset>
                      <fieldset className="field" style={{ border: 0, padding: 0, margin: 0 }}>
                        <legend>Size of the company</legend>
                        <p className="hint">The fee depends on this. We may ask for proof.</p>
                        <div className="choice">{SIZES.map(([v, l, p]) => <label key={v}><input type="radio" name="size" id={v === SIZES[0][0] ? 'size' : undefined} checked={f.size === v} onChange={() => set('size', v)} /><span>{l}<br /><span className="muted small">{p ? `From $${p} a category` : 'Free, one category'}</span></span></label>)}</div>
                        {err.size && <p className="err" role="alert">{err.size}</p>}
                      </fieldset>
                    </>
                  )}
                  {f.step === 1 && (
                    <fieldset className="field" style={{ border: 0, padding: 0, margin: 0 }}>
                      <legend id="cats" tabIndex={-1}>Which categories? Up to {max}.</legend>
                      <p className="hint">Not sure? The <Link className="link" to="/categories">category finder</Link> matches what your product does.</p>
                      {GROUPS.map((g) => (
                        <div key={g.key} style={{ marginTop: 14 }}>
                          <p className="small muted" style={{ marginBottom: 6 }}>{g.name}</p>
                          <div className="choice">{CATEGORIES.filter((c) => c.group === g.key).map((c) => {
                            const on = f.cats.includes(c.slug)
                            return <label key={c.slug}><input type="checkbox" checked={on} disabled={!on && f.cats.length >= max} onChange={() => set('cats', on ? f.cats.filter((x) => x !== c.slug) : [...f.cats, c.slug])} /><span>{c.name}<br /><span className="muted small">{c.for}</span></span></label>
                          })}</div>
                        </div>
                      ))}
                      {err.cats && <p className="err" role="alert">{err.cats}</p>}
                    </fieldset>
                  )}
                  {f.step === 2 && (
                    <>
                      {[['name', 'Product name', 'text', ''], ['company', 'Company', 'text', ''], ['site', 'Website', 'url', 'https://']].map(([k, l, t, ph]) => (
                        <div className="field" key={k}><label htmlFor={k}>{l}</label><input id={k} type={t} value={f[k]} placeholder={ph} onChange={(e) => set(k, e.target.value)} aria-invalid={!!err[k]} aria-describedby={err[k] ? `${k}-e` : undefined} />{err[k] && <p className="err" id={`${k}-e`}>{err[k]}</p>}</div>
                      ))}
                      <div className="field"><label htmlFor="what">What it does, and for whom</label><p className="hint">Plain words. The jury reads this before anything else.</p><textarea id="what" value={f.what} onChange={(e) => set('what', e.target.value)} aria-invalid={!!err.what} aria-describedby={err.what ? 'what-e' : undefined} />{err.what && <p className="err" id="what-e">{err.what}</p>}</div>
                      <div className="field"><label htmlFor="demo">Demo access for the jury (optional now)</label><p className="hint">A test account or a booking link. You can add it later.</p><input id="demo" value={f.demo} onChange={(e) => set('demo', e.target.value)} /></div>
                    </>
                  )}
                  {f.step === 3 && (
                    <dl style={{ display: 'grid', gap: 14 }}>
                      <div><dt className="muted small">Product</dt><dd>{f.name}, by {f.company}</dd></div>
                      <div><dt className="muted small">Website</dt><dd>{f.site}</dd></div>
                      <div><dt className="muted small">Categories</dt><dd>{f.cats.map((c) => CATEGORIES.find((x) => x.slug === c).name).join(', ')}</dd></div>
                      <div><dt className="muted small">What it does</dt><dd>{f.what}</dd></div>
                      <div><dt className="muted small">Fee</dt><dd style={{ fontSize: 'var(--step-lead)', letterSpacing: '-0.02em' }}>{fee ? `$${fee}` : 'Free'}</dd></div>
                    </dl>
                  )}
                  </div>
                  <div className="form-nav" data-rise>
                    {f.step > 0 ? <button className="ghost" onClick={back}>Back</button> : <span />}
                    {f.step < 3 ? <button className="btn" onClick={next}>Continue</button> : <button className="btn" onClick={submit}>Send the entry</button>}
                  </div>
                </>
              )}
            </div>
          </div>
          <aside className="panel" aria-labelledby="sum-h" style={{ background: 'var(--surface)' }} data-rise>
            <h2 id="sum-h">Your entry so far</h2>
            <dl style={{ marginTop: 16, display: 'grid', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}><dt>Categories</dt><dd>{f.cats.length || 'None yet'}</dd></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}><dt>Fee</dt><dd>{f.size ? (fee ? `$${fee}` : 'Free') : 'Choose a size'}</dd></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}><dt>Early rate until</dt><dd>{fmtDate(dateOf('early'))}</dd></div>
            </dl>
            <p data-rise style={{ marginTop: 20 }}>The fee is the same for every company of your size, and refunded if your product is not eligible. It never buys a score, a shortlist place or a category.</p>
            <div style={{ marginTop: 24, overflow: 'hidden' }}><img className="drift" src={photo('crystal')} alt="Two crystal award trophies" width="1024" height="796" loading="lazy" style={{ width: '100%', aspectRatio: '4 / 3', objectFit: 'cover', filter: 'grayscale(1)' }} /></div>
            <p data-rise style={{ marginTop: 20, fontWeight: 500 }}>Started here in 2026</p>
            <div className="pair" style={{ marginTop: 10 }}>
              {WINNERS.slice(0, 4).map((w) => <Link key={w.slug} to={`/winners/${w.slug}`} data-rise className="plate"><img src={photo(w.photo)} alt={`${w.name}, ${w.company}`} width="900" height="1125" loading="lazy" style={{ width: '100%', aspectRatio: '4 / 5', objectFit: 'cover', filter: 'grayscale(1)' }} /></Link>)}
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}
