// Quote draft shared by the hero widget and the quote flow. Saved locally so a customer who
// leaves mid-quote comes back to where they were.
import { createContext, useContext, useEffect, useState } from 'react'
import { sizeOf } from '../data/vehicles.js'

const KEY = 'nb-quote-draft'

export const EMPTY_DRAFT = {
  vehicle: null,
  entry: 'plate',
  plateState: 'TX',
  plate: '',
  symptoms: [],
  mode: 'symptoms',
  service: null,
  axle: 'front',
  zip: '',
  metro: null,
  address: '',
  locationType: 'driveway',
  accessNotes: '',
  tier: 'standard',
  slot: null,
  contact: { name: '', phone: '', email: '', sms: true },
  presence: 'present',
}

const Ctx = createContext(null)

export function DraftProvider({ children }) {
  const [draft, setDraft] = useState(() => {
    try {
      return { ...EMPTY_DRAFT, ...JSON.parse(localStorage.getItem(KEY)) }
    } catch {
      return EMPTY_DRAFT
    }
  })
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(draft))
    } catch {}
  }, [draft])
  const update = (patch) => setDraft((d) => ({ ...d, ...(typeof patch === 'function' ? patch(d) : patch) }))
  const reset = () => setDraft(EMPTY_DRAFT)
  return <Ctx.Provider value={{ draft, update, reset, size: sizeOf(draft.vehicle) }}>{children}</Ctx.Provider>
}

export const useDraft = () => useContext(Ctx)
