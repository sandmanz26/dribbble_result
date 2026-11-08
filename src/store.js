import { CASES, EMAIL_TEMPLATES, DOCUMENTS, RULES, CLEARANCE_STANDARD, USERS, COMPANY, EMPLOYEES, DIVISIONS, DEMO_TODAY } from './data.js'

const KEY = 'pmt-state-v1'
const SESSION = 'pmt-session-v1'
const clone = (x) => JSON.parse(JSON.stringify(x))

function seed() {
  return {
    v: 1,
    cases: clone(CASES),
    templates: clone(EMAIL_TEMPLATES),
    documents: clone(DOCUMENTS).map((x) => ({ ...x, status: 'published' })),
    rules: clone(RULES),
    clearance: clone(CLEARANCE_STANDARD).map((x) => ({ ...x, on: true })),
    users: clone(USERS),
    settings: {
      company: clone(COMPANY),
      theme: 'system',
      notify: { lastDay: true, deadline: true, bipartite: true, weekly: false },
      integrations: { hris: true, payroll: true, bpjs: false, directory: true, esign: false },
      revokeAt: 'lastday-1800',
      seq: 41,
    },
  }
}

let state
try { state = JSON.parse(localStorage.getItem(KEY)) } catch { state = null }
if (!state || state.v !== 1) state = seed()

export const S = () => state
export function save() { try { localStorage.setItem(KEY, JSON.stringify(state)) } catch {} }
export function update(fn) { fn(state); save() }
export function reset() { state = seed(); save() }

export const today = DEMO_TODAY
export const emp = (id) => EMPLOYEES.find((e) => e.id === id)
export const div = (id) => DIVISIONS.find((x) => x.id === id)
export const caseById = (id) => state.cases.find((c) => c.id === id)
export const activeCaseFor = (empId) => state.cases.find((c) => c.emp === empId && !['completed', 'withdrawn'].includes(c.status))
export const rule = (type) => state.rules.find((r) => r.type === type)
export const tpl = (id) => state.templates.find((t) => t.id === id)

export function session() { try { return JSON.parse(localStorage.getItem(SESSION)) } catch { return null } }
export function signIn(user) { try { localStorage.setItem(SESSION, JSON.stringify({ name: user.name, email: user.email, role: user.role, title: user.title })) } catch {} }
export function signOut() { try { localStorage.removeItem(SESSION) } catch {} }
