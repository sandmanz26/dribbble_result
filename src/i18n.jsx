import { createContext, useContext, useEffect, useMemo, useState } from 'react'

// Arabic is the first language of the site; English is the mirror. Every string lives as { ar, en }.
const KEY = 'darb-lang-v1'
const Ctx = createContext(null)

function initial() {
  const q = new URLSearchParams(window.location.hash.split('?')[1] || '').get('lang')
  if (q === 'en' || q === 'ar') return q
  try { return localStorage.getItem(KEY) || 'ar' } catch { return 'ar' }
}

export function LangProvider({ children }) {
  const [lang, setLang] = useState(initial)
  useEffect(() => {
    const html = document.documentElement
    html.lang = lang === 'ar' ? 'ar-SA' : 'en'
    html.dir = lang === 'ar' ? 'rtl' : 'ltr'
    try { localStorage.setItem(KEY, lang) } catch { /* private window */ }
  }, [lang])
  const value = useMemo(() => {
    const ar = lang === 'ar'
    const locale = ar ? 'ar-SA' : 'en-GB'
    const nf = new Intl.NumberFormat(locale)
    return {
      lang, ar, dir: ar ? 'rtl' : 'ltr', setLang,
      t: (o) => (o == null ? '' : typeof o === 'string' ? o : o[lang] ?? o.en),
      n: (v) => nf.format(v),
      // Gregorian first, Hijri (Umm al-Qura) beside it: both calendars are in daily use in the Kingdom.
      date: (d, opts = { day: 'numeric', month: 'long', year: 'numeric' }) => new Intl.DateTimeFormat(locale, opts).format(d),
      hijri: (d) => new Intl.DateTimeFormat(ar ? 'ar-SA-u-ca-islamic-umalqura' : 'en-u-ca-islamic-umalqura', { day: 'numeric', month: 'long', year: 'numeric' }).format(d),
      time: (d) => new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Riyadh' }).format(d),
    }
  }, [lang])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useLang = () => useContext(Ctx)
