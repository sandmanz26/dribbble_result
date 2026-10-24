import { useState } from 'react'
import { useStore } from '../store.jsx'
import Icon from './Icon.jsx'
import { Sheet } from './kit.jsx'
import { firstName } from '../data/people.js'

const REASONS = [
  ['fake', 'Fake profile or not who they say'],
  ['money', 'Asking for money or payment details'],
  ['alone', 'Pressure to meet alone or leave the group'],
  ['harass', 'Harassment or hateful messages'],
  ['spam', 'Spam or selling something'],
  ['other', 'Something else'],
]

// Reporting goes to a person on the safety team; the reported person is never told who reported.
export function ReportSheet({ who, open, onClose }) {
  const { s, set, notify } = useStore()
  const [step, setStep] = useState(0)
  const [reason, setReason] = useState('')
  const [detail, setDetail] = useState('')
  const [alsoBlock, setAlsoBlock] = useState(true)
  const [ref, setRef] = useState('')
  const close = () => { setStep(0); setReason(''); setDetail(''); onClose() }
  const submit = () => {
    const r = `CR-${String(Date.now()).slice(-5)}`
    setRef(r)
    set({ reports: [...s.reports, { who, reason, detail, ref: r }], blocked: alsoBlock && !s.blocked.includes(who) ? [...s.blocked, who] : s.blocked })
    setStep(2)
  }
  return (
    <Sheet open={open} onClose={close} title={step === 2 ? 'Report sent' : `Report ${firstName(who)}`}>
      {step === 0 && (
        <div className="sheet-body">
          <p className="meta">{firstName(who)} will not know who reported them.</p>
          <fieldset className="radios">
            <legend className="sr-only">What happened</legend>
            {REASONS.map(([v, l]) => (
              <label key={v} className={`radio ${reason === v ? 'on' : ''}`}>
                <input type="radio" name="reason" value={v} checked={reason === v} onChange={() => setReason(v)} />
                {l}
              </label>
            ))}
          </fieldset>
          <button className="btn primary block" disabled={!reason} onClick={() => setStep(1)}>Continue</button>
        </div>
      )}
      {step === 1 && (
        <div className="sheet-body">
          <label htmlFor="rd">What happened <span className="meta small">(optional)</span></label>
          <textarea id="rd" rows={4} placeholder="Dates, what was said. The messages are attached for you." value={detail} onChange={(e) => setDetail(e.target.value)} />
          <label className="check"><input type="checkbox" checked={alsoBlock} onChange={(e) => setAlsoBlock(e.target.checked)} /> Also block {firstName(who)}</label>
          <p className="meta small">If you feel unsafe right now, call local emergency services first.</p>
          <button className="btn danger block" onClick={submit}>Send report</button>
        </div>
      )}
      {step === 2 && (
        <div className="sheet-body">
          <div className="note ok"><Icon name="shield" /><div><strong>A person on our safety team reviews it within 24 hours.</strong><p>Reference {ref}. You will hear back in Notifications.{alsoBlock ? ` ${firstName(who)} is blocked.` : ''}</p></div></div>
          <button className="btn primary block" onClick={() => { close(); notify({ text: `Report ${ref} sent.` }) }}>Done</button>
        </div>
      )}
    </Sheet>
  )
}

export function BlockSheet({ who, open, onClose, onDone }) {
  const { s, set, notify } = useStore()
  const block = () => {
    set({ blocked: [...s.blocked, who] })
    onClose()
    onDone?.()
    notify({ text: `${firstName(who)} is blocked.`, undo: () => set((c) => ({ blocked: c.blocked.filter((x) => x !== who) })) })
  }
  return (
    <Sheet open={open} onClose={onClose} title={`Block ${firstName(who)}?`}>
      <div className="sheet-body">
        <ul className="checklist">
          <li><Icon name="tick" /> They cannot message you or see your profile</li>
          <li><Icon name="tick" /> You will not be put in the same new group</li>
          <li><Icon name="info" /> If you share a group already, the host is not told</li>
        </ul>
        <button className="btn danger block" onClick={block}>Block</button>
        <button className="btn ghost block" onClick={onClose}>Cancel</button>
      </div>
    </Sheet>
  )
}
