import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { STRINGS } from './strings.js'
import { defaultRelief, getGrade } from './data/school.js'

// One saved object for the whole portal. Keys on this origin are prefixed per project.
const KEY = 'sp-state-v1'
const read = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {}
  } catch {
    return {}
  }
}

const Ctx = createContext(null)

export function PortalProvider({ children }) {
  const saved = read()
  const [lang, setLang] = useState(saved.lang || null)
  const [grade, setGrade] = useState(saved.grade || null)
  const [relief, setRelief] = useState(saved.relief || {})
  const [theme, setTheme] = useState(saved.theme || 'system')
  // Prototype-only: show each block's loading, error and before-registers states.
  const [mode, setMode] = useState('live')

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ lang, grade, relief, theme }))
    } catch {}
  }, [lang, grade, relief, theme])

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'system') root.removeAttribute('data-theme')
    else root.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    document.documentElement.lang = lang === 'si' ? 'si' : 'en'
  }, [lang])

  const value = useMemo(() => {
    const L = lang || 'en'
    const t = (key, vars) => fill(STRINGS[L][key] ?? STRINGS.en[key] ?? key, vars)
    // Both scripts at once: the chosen one first. V2 sets every label this way.
    const both = (key, vars) => ({ main: t(key, vars), other: fill(STRINGS[L === 'si' ? 'en' : 'si'][key] ?? key, vars) })
    const name = (o) => (o ? o[L] ?? o.en : '')
    const other = (o) => (o ? o[L === 'si' ? 'en' : 'si'] ?? o.en : '')
    const assignedFor = (g) => relief[g] ?? defaultRelief(getGrade(g))
    const assign = (g, key, teacherId) =>
      setRelief((r) => {
        const cur = { ...(r[g] ?? defaultRelief(getGrade(g))) }
        if (teacherId) cur[key] = teacherId
        else delete cur[key]
        return { ...r, [g]: cur }
      })
    const resetDemo = () => setRelief({})
    return { lang, L, setLang, grade, setGrade, theme, setTheme, mode, setMode, t, both, name, other, assignedFor, assign, resetDemo }
  }, [lang, grade, relief, theme, mode])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const usePortal = () => useContext(Ctx)

function fill(str, vars) {
  if (!vars) return str
  return str.replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? `{${k}}`))
}
