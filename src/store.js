// Local prototype state. Every key is prefixed exa- (projects share one origin).
import { useEffect, useState } from 'react'

const KEY = 'exa-state-v1'
const blank = { role: null, subject: 'economics', board: 'AQA', examYear: '2027', name: '', email: '', attempts: [], account: false }

function read() {
  try {
    return { ...blank, ...JSON.parse(localStorage.getItem(KEY) || '{}') }
  } catch {
    return { ...blank }
  }
}

let state = read()
const subs = new Set()

export function getState() {
  return state
}

export function setState(patch) {
  state = { ...state, ...(typeof patch === 'function' ? patch(state) : patch) }
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    /* private mode: keep working in memory */
  }
  subs.forEach((f) => f(state))
}

export function resetState() {
  state = { ...blank }
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* ignore */
  }
  subs.forEach((f) => f(state))
}

export function useStore() {
  const [s, set] = useState(state)
  useEffect(() => {
    subs.add(set)
    return () => subs.delete(set)
  }, [])
  return s
}
