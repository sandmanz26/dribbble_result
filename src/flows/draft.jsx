// Quote draft shared by the hero widget and the quote flow. Saved locally so a customer who
// leaves mid-quote comes back to where they were.
import { createContext, useContext, useEffect, useState } from 'react'
import { sizeOf } from '../data/vehicles.js'
import { fmtDay } from '../data/schedule.js'

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
  keysAt: '',
  // Set when the quote resolves; the price is held for HOLD_DAYS from here.
  quotedAt: null,
  // Last step the customer reached, so the home page can offer it back.
  lastStep: 'vehicle',
  // { from, reason } when an edit or an expired hold dropped the quote. The price step explains it.
  priceChange: null,
  // Location types without a private spot ask whether it is flat with room to open the doors: 'yes' | 'unsure'.
  spotOk: null,
  // Out-of-area customers can still see a price. The flow then ends on the price step with a waitlist.
  noBooking: false,
  slotDropped: false,
}

export const HOLD_DAYS = 7

export const currentTotal = (d) => (d.quote ? (d.quote[d.tier] || d.quote.standard)?.total ?? null : null)

export function holdUntil(d) {
  if (!d.quotedAt) return null
  const x = new Date(d.quotedAt)
  x.setDate(x.getDate() + HOLD_DAYS)
  return x
}

// "Price held until Thu, Oct 29", or a relative line before the quote has a date.
export const holdText = (d) =>
  d.quotedAt
    ? `Price held until ${fmtDay(holdUntil(d), { weekday: 'short', month: 'short', day: 'numeric' })}`
    : `Price held for ${HOLD_DAYS} days from your quote`

export const isHoldExpired = (d) => Boolean(d.quotedAt) && holdUntil(d) < new Date()

// Use instead of a bare quote:null so the price step can say why the number moved.
export function invalidateQuote(d, reason) {
  return {
    quote: null,
    quotedAt: null,
    priceChange: d.quote ? { from: currentTotal(d), reason } : d.priceChange,
  }
}

const Ctx = createContext(null)

export function DraftProvider({ children }) {
  const [draft, setDraft] = useState(() => {
    let d
    try {
      d = { ...EMPTY_DRAFT, ...JSON.parse(localStorage.getItem(KEY)) }
    } catch {
      return EMPTY_DRAFT
    }
    // Older drafts kept the key location under keysNote.
    if (!d.keysAt && d.keysNote) d.keysAt = d.keysNote
    if (isHoldExpired(d)) d = { ...d, ...invalidateQuote(d, 'refreshed') }
    return d
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
