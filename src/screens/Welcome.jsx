import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store.jsx'
import Icon from '../ui/Icon.jsx'
import MapArt from '../map/MapArt.jsx'
import { place } from '../data/places.js'

// Sign-up is four short steps. Phone and email are required to join any group;
// the ID check is optional, and only unlocks groups that ask for it.
const STEPS = ['phone', 'code', 'email', 'id', 'rules']
const CODE = '2468'

export default function Welcome() {
  const { set } = useStore()
  const nav = useNavigate()
  const [step, setStep] = useState('intro')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [codeErr, setCodeErr] = useState(false)
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [idState, setIdState] = useState('none')
  const [agree, setAgree] = useState(false)
  const [busy, setBusy] = useState(false)
  const field = useRef(null)
  useEffect(() => { field.current?.focus() }, [step])

  const go = (s) => setStep(s)
  const finish = () => {
    set({ onboarded: true, account: { phone, email, id: idState } })
    nav('/', { replace: true })
  }
  const demo = () => {
    set({ onboarded: true, account: { phone: '+60 12 345 6789', email: 'nadia.rahman@mail.com', id: 'done' } })
    nav('/', { replace: true })
  }
  const n = STEPS.indexOf(step)

  if (step === 'intro') {
    return (
      <div className="welcome">
        <div className="welcome-maps" aria-hidden="true">
          <MapArt place={place('kyoto')} w={180} h={150} label={false} />
          <MapArt place={place('lisbon')} w={180} h={150} label={false} />
          <MapArt place={place('cusco')} w={180} h={150} label={false} />
          <MapArt place={place('lofoten')} w={180} h={150} label={false} />
        </div>
        <div className="welcome-copy">
          <span className="brand-mark" aria-hidden="true" />
          <h1>Travel with people you can trust</h1>
          <p>Find a group going where you want to go, plan the trip together, and know who everyone is before you meet.</p>
        </div>
        <div className="welcome-actions">
          <button className="btn primary block" onClick={() => go('phone')}>Create an account</button>
          <button className="btn ghost block" onClick={demo}>Explore as Nadia, a demo traveller</button>
        </div>
      </div>
    )
  }

  const phoneOk = phone.replace(/\D/g, '').length >= 8
  const emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)

  return (
    <div className="onb">
      <header className="onb-head">
        <button className="iconbtn" aria-label="Back" onClick={() => go(n <= 0 ? 'intro' : STEPS[n - 1])}><Icon name="back" size={22} /></button>
        <div className="onb-progress" role="progressbar" aria-valuemin={1} aria-valuemax={STEPS.length} aria-valuenow={n + 1} aria-label={`Step ${n + 1} of ${STEPS.length}`}>
          {STEPS.map((s, i) => <span key={s} className={i <= n ? 'on' : ''} />)}
        </div>
        <span className="onb-count num">{n + 1}/{STEPS.length}</span>
      </header>

      {step === 'phone' && (
        <form className="onb-body" onSubmit={(e) => { e.preventDefault(); if (phoneOk) { setBusy(true); setTimeout(() => { setBusy(false); go('code') }, 600) } }}>
          <h1>Your phone number</h1>
          <p>We text you a code. Your number is never shown to other travellers.</p>
          <label htmlFor="ph">Mobile number</label>
          <input id="ph" ref={field} inputMode="tel" autoComplete="tel" placeholder="+60 12 345 6789" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <button className="btn primary block" disabled={!phoneOk || busy}>{busy ? 'Sending code' : 'Send code'}</button>
        </form>
      )}

      {step === 'code' && (
        <form className="onb-body" onSubmit={(e) => {
          e.preventDefault()
          if (code === CODE) { setCodeErr(false); go('email') } else setCodeErr(true)
        }}>
          <h1>Enter the code</h1>
          <p>Sent to {phone}. For this demo the code is {CODE}.</p>
          <label htmlFor="otp">4-digit code</label>
          <input id="otp" ref={field} className="otp num" inputMode="numeric" autoComplete="one-time-code" maxLength={4} value={code}
            aria-invalid={codeErr} aria-describedby={codeErr ? 'otp-err' : undefined}
            onChange={(e) => { setCode(e.target.value.replace(/\D/g, '')); setCodeErr(false) }} />
          {codeErr && <p className="err" id="otp-err" role="alert">That code is not right. Check the text and try again.</p>}
          <button className="btn primary block" disabled={code.length !== 4}>Verify number</button>
          <button type="button" className="btn text" onClick={() => setCode('')}>Send a new code</button>
        </form>
      )}

      {step === 'email' && (
        <form className="onb-body" onSubmit={(e) => { e.preventDefault(); if (emailOk) setSent(true) }}>
          <h1>Your email</h1>
          <p>For trip updates and to recover your account. We send a link to confirm it.</p>
          <label htmlFor="em">Email</label>
          <input id="em" ref={field} type="email" autoComplete="email" placeholder="name@mail.com" value={email} onChange={(e) => { setEmail(e.target.value); setSent(false) }} />
          {!sent ? (
            <button className="btn primary block" disabled={!emailOk}>Send confirmation link</button>
          ) : (
            <div className="note ok">
              <Icon name="mail" />
              <div>
                <strong>Link sent to {email}</strong>
                <p>Open it on this phone. In the demo, tap below as if you had.</p>
                <button type="button" className="btn primary small" onClick={() => go('id')}>I opened the link</button>
              </div>
            </div>
          )}
        </form>
      )}

      {step === 'id' && (
        <div className="onb-body">
          <h1>Verify your ID</h1>
          <p>Optional. Some groups only accept ID-verified travellers. Your document is checked once and never shown to anyone.</p>
          <ul className="id-levels">
            <li><Icon name="tick" /> Phone verified</li>
            <li><Icon name="tick" /> Email verified</li>
            <li className={idState === 'done' ? '' : 'todo'}><Icon name={idState === 'done' ? 'verified' : 'id'} /> {idState === 'done' ? 'ID verified' : idState === 'pending' ? 'Checking your ID' : 'ID not checked yet'}</li>
          </ul>
          {idState === 'none' && (
            <>
              <button className="btn primary block" onClick={() => { setIdState('pending'); setTimeout(() => setIdState('done'), 1400) }}>Scan passport or national ID</button>
              <button className="btn ghost block" onClick={() => go('rules')}>Skip for now</button>
            </>
          )}
          {idState === 'pending' && <div className="note"><span className="spinner" aria-hidden="true" /> Matching your face to the photo on the document.</div>}
          {idState === 'done' && <button className="btn primary block" onClick={() => go('rules')}>Continue</button>}
        </div>
      )}

      {step === 'rules' && (
        <div className="onb-body">
          <h1>How we travel together</h1>
          <ul className="rules">
            <li><strong>Be who you say you are.</strong> One account, your real name and photo.</li>
            <li><strong>Meet in public first.</strong> The first meet-up with a new group is in a public place.</li>
            <li><strong>Say no, and hear no.</strong> Anyone can leave a plan, a chat or a group without a reason.</li>
            <li><strong>Money stays in the trip.</strong> Never send money to someone outside the group's shared costs.</li>
            <li><strong>Report what feels wrong.</strong> Reports go to a person on our safety team, not the person you report.</li>
          </ul>
          <label className="check">
            <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
            I agree to the community guidelines
          </label>
          <button className="btn primary block" disabled={!agree} onClick={finish}>Start exploring</button>
        </div>
      )}
    </div>
  )
}
