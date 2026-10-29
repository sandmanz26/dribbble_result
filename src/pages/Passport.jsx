import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useStore } from '../store.jsx'
import { STUDENT, PEOPLE, SKILLS, CREDIT_ROLES, VIEWS } from '../data/bridge.js'
import { Toggle, Strength, fmtDate } from '../ui/kit.jsx'
import * as I from '../ui/icons.js'

// The passport itself: the same component on the student's screen and behind the share link.
function Book({ s, viewer = false }) {
  const pv = s.privacy
  const shown = (k) => !viewer || pv.sections[k]
  const verifiedEv = s.evidence.filter((e) => e.strength === 'verified')
  const hours = s.contributions.filter((c) => c.state === 'verified').reduce((t, c) => t + c.hours, 0)
  return (
    <article className="book" aria-label="Contribution Passport">
      <header className="book-cover">
        <span className="book-kind">Contribution Passport</span>
        <h2>{!viewer || pv.nameOnPassport ? STUDENT.name : 'Name hidden by the holder'}</h2>
        <p>{STUDENT.programme}, {STUDENT.university}</p>
        <p className="book-id">Passport {STUDENT.passport}{shown('hours') && <> · {hours} verified research hours</>}</p>
      </header>
      {shown('contributions') && (
        <section className="book-page" aria-label="Contributions">
          {s.contributions.filter((c) => !viewer || c.state === 'verified').map((c) => (
            <div key={c.id} className={`stamp ${c.state === 'verified' ? 'is-ok' : 'is-wait'}`}>
              <div className="stamp-head"><b>{c.project}</b><span>{c.lab} · {fmtDate(c.from, { month: 'short', year: 'numeric' })} to {fmtDate(c.to, { month: 'short', year: 'numeric' })}{shown('hours') && ` · ${c.hours} h`}</span></div>
              <ul className="roles" aria-label="Roles (CRediT)">{c.roles.map((r) => <li key={r} className={c.state === 'verified' ? 'hl' : ''}>{r}</li>)}</ul>
              {c.words && <p className="stamp-words">“{c.words}”</p>}
              <p className="stamp-out">{c.output}</p>
              <p className="stamp-by">{c.state === 'verified' ? <><I.Verified size={16} aria-hidden="true" /> Verified by {PEOPLE[c.pi].name} on {fmtDate(c.on, { day: 'numeric', month: 'long', year: 'numeric' })}</> : <><I.Clock size={16} aria-hidden="true" /> Waiting for {PEOPLE[c.pi].name} to verify</>}</p>
            </div>
          ))}
        </section>
      )}
      {shown('evidence') && (
        <section className="book-page" aria-label="Verified skills">
          <h3>Verified skills</h3>
          <ul className="book-skills">{verifiedEv.map((e) => <li key={e.id}><Strength s="verified" /><span><b>{SKILLS[e.skill]}</b><small>{e.title}{(!viewer || pv.grades) && e.kind === 'Course' ? `, ${e.detail.toLowerCase()}` : ''}</small></span></li>)}</ul>
        </section>
      )}
      <footer className="book-foot">Roles follow CRediT, the Contributor Roles Taxonomy used by journals. Each entry is signed by the researcher who supervised it.</footer>
    </article>
  )
}

export default function Passport() {
  const { s, dispatch } = useStore()
  const pv = s.privacy
  const [copied, setCopied] = useState(false)
  const url = `${window.location.origin}${window.location.pathname}#/p/${STUDENT.passport}`
  const copy = async () => { try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 1800) } catch { /* no clipboard */ } }
  const exportJson = () => {
    const data = { '@context': 'https://schema.org', '@type': 'Person', name: pv.nameOnPassport ? STUDENT.name : null, identifier: STUDENT.passport,
      contributions: s.contributions.filter((c) => c.state === 'verified').map((c) => ({ project: c.project, organisation: c.lab, start: c.from, end: c.to, hours: pv.sections.hours ? c.hours : undefined, creditRoles: c.roles, verifiedBy: PEOPLE[c.pi].name, verifiedOn: c.on })) }
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })); a.download = `passport-${STUDENT.passport}.json`; a.click()
    dispatch({ type: 'toast', text: 'Passport saved as JSON' })
  }
  const sections = [['contributions', 'Contributions and roles'], ['evidence', 'Verified skills'], ['hours', 'Hours'], ['statements', 'Claims without evidence']]
  return (
    <div className="page">
      <header className="title-row">
        <div><h1>Contribution Passport</h1><p className="sub">A record you keep after you graduate: what you did on each project, in the roles journals use, signed by the researcher.</p></div>
        <div className="row-btns"><button className="btn" onClick={() => window.print()}><I.Download size={16} /> PDF</button><button className="btn" onClick={exportJson}><I.Download size={16} /> JSON</button></div>
      </header>
      <div className="row r-8-4">
        <div className="col"><Book s={s} /></div>
        <aside className="col">
          <section className="panel" aria-labelledby="sh-h">
            <div className="panel-head"><h2 id="sh-h">Sharing</h2></div>
            <div className="sw-row"><label htmlFor="sw-link"><b>Passport link</b><small>{pv.link ? `Works for ${pv.expiry} days, then switches off` : 'Off. Nobody can open it.'}</small></label><Toggle id="sw-link" on={pv.link} onChange={(v) => dispatch({ type: 'privacy', patch: { link: v } })} label="Passport link" /></div>
            {pv.link && (
              <>
                <div className="copy-row"><input readOnly value={url} aria-label="Passport link" onFocus={(e) => e.target.select()} /><button className="btn" onClick={copy}><I.Copy size={16} /> {copied ? 'Copied' : 'Copy'}</button></div>
                <label className="field"><span>Link expires after</span><select value={pv.expiry} onChange={(e) => dispatch({ type: 'privacy', patch: { expiry: +e.target.value } })}><option value={30}>30 days</option><option value={90}>90 days</option><option value={365}>One year</option></select></label>
                <Link to={`/p/${STUDENT.passport}`} className="more"><I.Eye size={16} /> See it as a viewer</Link>
              </>
            )}
          </section>
          <section className="panel" aria-labelledby="in-h">
            <div className="panel-head"><h2 id="in-h">What the link shows</h2></div>
            <div className="sw-row"><label htmlFor="sw-name"><b>Your name</b><small>Off shows your passport number only</small></label><Toggle id="sw-name" on={pv.nameOnPassport} onChange={(v) => dispatch({ type: 'privacy', patch: { nameOnPassport: v } })} label="Your name" /></div>
            {sections.map(([k, l]) => <div key={k} className="sw-row"><label htmlFor={`sw-${k}`}><b>{l}</b></label><Toggle id={`sw-${k}`} on={pv.sections[k]} onChange={(v) => dispatch({ type: 'section', key: k, on: v })} label={l} /></div>)}
          </section>
          <section className="panel" aria-labelledby="vw-h">
            <div className="panel-head"><h2 id="vw-h">Recent views</h2></div>
            <ul className="plain">{VIEWS.map((v) => <li key={v.at}><b>{v.who}</b><small className="muted block">{fmtDate(v.at.slice(0, 10))}, {v.at.slice(11)} · {v.via}</small></li>)}</ul>
          </section>
          <p className="fine">CRediT roles: {CREDIT_ROLES.length} in all, from {CREDIT_ROLES[0].toLowerCase()} to {CREDIT_ROLES[CREDIT_ROLES.length - 1].toLowerCase()}.</p>
        </aside>
      </div>
    </div>
  )
}

export function PublicPassport() {
  const { id } = useParams()
  const { s } = useStore()
  const ok = id === STUDENT.passport && s.privacy.link
  return (
    <div className="public">
      <header className="public-bar"><Link to="/" className="brand"><span className="mark" aria-hidden="true"><span /></span><b>Bridge</b></Link><Link to="/app/passport" className="more">Back to your passport</Link></header>
      <main className="public-main" id="content">
        <h1 className="sr">Contribution Passport {id}</h1>
        {ok ? <Book s={s} viewer /> : <div className="empty"><p className="empty-t">This passport link is switched off</p><p>The holder has turned the link off or it has expired. Ask them for a new one.</p></div>}
      </main>
    </div>
  )
}
