import { createContext, useContext, useEffect, useReducer } from 'react'
import { EVIDENCE, APPLICATIONS, CONTRIBUTIONS, APPLICANTS, VERIFY } from './data/bridge.js'

const KEY = 'brg-state-v1'
const fresh = () => ({
  evidence: EVIDENCE, applications: APPLICATIONS, contributions: CONTRIBUTIONS, applicants: APPLICANTS, verify: VERIFY, verified: [],
  privacy: { visibility: 'applied', blind: true, grades: false, nameOnPassport: true, link: true, expiry: 90, sections: { contributions: true, evidence: true, hours: true, statements: false } },
  blindLab: true, toast: null,
})

function load() {
  try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && s.evidence) return { ...fresh(), ...s, toast: null } } catch { /* first visit */ }
  return fresh()
}

function reducer(s, a) {
  switch (a.type) {
    case 'reset': return fresh()
    case 'toast': return { ...s, toast: a.text }
    case 'addEvidence': return { ...s, evidence: [a.item, ...s.evidence], toast: 'Evidence added. It counts as soon as you save it.' }
    case 'removeEvidence': return { ...s, evidence: s.evidence.filter((e) => e.id !== a.id), toast: 'Evidence removed' }
    case 'apply': {
      const exists = s.applications.find((x) => x.project === a.project)
      const row = { project: a.project, state: 'sent', at: '2026-10-29', note: 'Sent today. The lab sees your evidence, not your name, until they shortlist you.' }
      return { ...s, applications: exists ? s.applications.map((x) => (x.project === a.project ? row : x)) : [row, ...s.applications], toast: 'Application sent' }
    }
    case 'withdraw': return { ...s, applications: s.applications.filter((x) => x.project !== a.project), toast: 'Application withdrawn' }
    case 'privacy': return { ...s, privacy: { ...s.privacy, ...a.patch } }
    case 'section': return { ...s, privacy: { ...s.privacy, sections: { ...s.privacy.sections, [a.key]: a.on } } }
    case 'applicant': return { ...s, applicants: s.applicants.map((x) => (x.id === a.id ? { ...x, state: a.state, reason: a.reason } : x)), toast: a.toast }
    case 'blindLab': return { ...s, blindLab: a.on }
    case 'verify': return { ...s, verify: s.verify.filter((v) => v.id !== a.id), verified: [{ ...s.verify.find((v) => v.id === a.id), roles: a.roles, hours: a.hours, at: '2026-10-29' }, ...s.verified], toast: a.toast }
    default: return s
  }
}

const Ctx = createContext(null)
export function StoreProvider({ children }) {
  const [s, dispatch] = useReducer(reducer, null, load)
  useEffect(() => { try { const { toast, ...keep } = s; localStorage.setItem(KEY, JSON.stringify(keep)) } catch { /* storage off */ } }, [s])
  useEffect(() => { if (!s.toast) return; const id = setTimeout(() => dispatch({ type: 'toast', text: null }), 3200); return () => clearTimeout(id) }, [s.toast])
  return <Ctx.Provider value={{ s, dispatch }}>{children}</Ctx.Provider>
}
export const useStore = () => useContext(Ctx)
