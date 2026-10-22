import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { BRAND_META, shapeFor, STYLE_META, tokenVars } from './tokens.js'
import { simulation } from '../data/api.js'

const KEY = 'nb-prefs'
const Ctx = createContext(null)

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {}
  } catch {
    return {}
  }
}

function useSystemDark() {
  const [q] = useState(() => (typeof matchMedia === 'function' ? matchMedia('(prefers-color-scheme: dark)') : null))
  const [dark, setDark] = useState(q ? q.matches : false)
  useEffect(() => {
    if (!q) return
    const on = (e) => setDark(e.matches)
    q.addEventListener('change', on)
    return () => q.removeEventListener('change', on)
  }, [q])
  return dark
}

export function BrandProvider({ children }) {
  const saved = load()
  const urlBrand = new URLSearchParams(location.hash.split('?')[1] || '').get('brand')
  const [brand, setBrand] = useState(
    urlBrand === 'valvoline' || urlBrand === 'nubrakes' ? urlBrand : saved.brand || 'nubrakes',
  )
  const [schemePref, setSchemePref] = useState(saved.scheme || 'system')
  const urlStyle = new URLSearchParams(location.hash.split('?')[1] || '').get('v')
  const [style, setStyle] = useState(urlStyle === '2' ? 'v2' : urlStyle === '1' ? 'v1' : saved.style || 'v1')
  // Prototype-only switches so reviewers can see loading and error states inside the real flows.
  const [slow, setSlow] = useState(Boolean(saved.slow))
  const [failures, setFailures] = useState(Boolean(saved.failures))
  // Numbered UX recommendation markers on the screens. On by default so reviewers see the reasoning.
  const [uxNotes, setUxNotes] = useState(saved.uxNotes ?? true)
  const systemDark = useSystemDark()
  const scheme = schemePref === 'system' ? (systemDark ? 'dark' : 'light') : schemePref

  simulation.slow = slow
  simulation.failures = failures

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ brand, scheme: schemePref, style, slow, failures, uxNotes }))
    } catch {}
  }, [brand, schemePref, style, slow, failures, uxNotes])

  useEffect(() => {
    const root = document.documentElement
    for (const [k, v] of Object.entries(tokenVars(brand, scheme, style))) root.style.setProperty(k, v)
    root.dataset.brand = brand
    root.dataset.style = style
    root.dataset.scheme = scheme
    root.dataset.dangerStyle = shapeFor(brand, style)['button-danger-style']
    root.style.colorScheme = scheme
    document.title = `${BRAND_META[brand].name} ${brand === 'valvoline' ? 'Mobile Brake Service' : 'Mobile Brake Repair'}`
  }, [brand, scheme, style])

  const value = useMemo(
    () => ({ brand, setBrand, scheme, schemePref, setSchemePref, slow, setSlow, failures, setFailures, uxNotes, setUxNotes, style, setStyle, styleMeta: STYLE_META[style], meta: BRAND_META[brand] }),
    [brand, scheme, schemePref, style, slow, failures, uxNotes],
  )
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useBrand = () => useContext(Ctx)

// Renders children with another brand/scheme's tokens, scoped to this element.
// Used on the System page to show both brands side by side.
// `vars` overrides single tokens (the System page uses it to show a before state).
export function BrandScope({ brand, scheme, style = 'v1', className = '', vars, dangerStyle, children, ...rest }) {
  return (
    <div
      data-brand={brand}
      data-scheme={scheme}
      data-style={style}
      data-danger-style={dangerStyle || shapeFor(brand, style)['button-danger-style']}
      className={`brand-scope ${className}`}
      style={{ ...tokenVars(brand, scheme, style), ...vars, colorScheme: scheme }}
      {...rest}
    >
      {children}
    </div>
  )
}
