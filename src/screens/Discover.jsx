import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { IconSearch, IconAdjustmentsHorizontal, IconX, IconMoodEmpty } from '@tabler/icons-react'
import { TabBar, Img, Sheet, Empty, ICON } from '../components/ui.jsx'
import CreatorCard from '../components/CreatorCard.jsx'
import { creators, CATEGORIES, fromPrice, money } from '../data/creators.js'
import { coverOf } from '../data/media.js'
import { useStore } from '../app/store.jsx'

const WEEK_END = '2026-10-28' // "this week" relative to the prototype's date
const DEFAULT_FILTERS = { medium: 'any', maxPrice: 4000, minRating: 0 }

export default function Discover() {
  const { user } = useStore()
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('all')
  const [open, setOpen] = useState(false)
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [draft, setDraft] = useState(DEFAULT_FILTERS)
  const activeCount = (filters.medium !== 'any') + (filters.maxPrice < 4000) + (filters.minRating > 0)

  const results = useMemo(() => {
    const term = q.trim().toLowerCase()
    return creators.filter((c) =>
      (cat === 'all' || c.cats.includes(cat)) &&
      (!term || [c.name, c.title, c.area, ...c.cats].join(' ').toLowerCase().includes(term)) &&
      (filters.medium === 'any' || c.medium === filters.medium || c.medium === 'both') &&
      fromPrice(c) <= filters.maxPrice && c.rating >= filters.minRating)
  }, [q, cat, filters])

  const soon = creators.filter((c) => c.available.some((d) => d <= WEEK_END))
  const browsing = !q && cat === 'all' && !activeCount
  const reset = () => { setQ(''); setCat('all'); setFilters(DEFAULT_FILTERS); setDraft(DEFAULT_FILTERS) }

  return (
    <>
      <div className="screen safe-top has-tabs">
        <div className="pad" style={{ display: 'grid', gap: 16 }}>
          <h1>{user?.name ? `Hi ${user.name.split(' ')[0]}, who are you looking for?` : 'Who are you looking for?'}</h1>
          <div style={{ display: 'flex', gap: 8 }}>
            <label className="search" style={{ flex: 1 }}>
              <IconSearch size={20} stroke={1.6} />
              <input type="search" placeholder="Name, style or area" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search creators" />
              {q && <button onClick={() => setQ('')} aria-label="Clear search"><IconX size={18} /></button>}
            </label>
            <button className="icon-btn" style={{ width: 48, height: 48, background: activeCount ? 'var(--ink)' : 'var(--sunk)', color: activeCount ? 'var(--on-ink)' : 'inherit' }}
              onClick={() => { setDraft(filters); setOpen(true) }} aria-label={`Filters${activeCount ? `, ${activeCount} active` : ''}`}>
              <IconAdjustmentsHorizontal {...ICON} />
            </button>
          </div>
        </div>

        <div className="chips" style={{ marginTop: 16 }} role="group" aria-label="Category">
          {CATEGORIES.map((c) => <button key={c.id} className="chip" aria-pressed={cat === c.id} onClick={() => setCat(c.id)}>{c.label}</button>)}
        </div>

        {browsing && (
          <section className="section" aria-labelledby="soon-h">
            <div className="section-row"><h2 id="soon-h">Free this week</h2></div>
            <div className="mini">
              {soon.map((c) => (
                <Link key={c.id} to={`/creator/${c.id}`}>
                  <Img src={coverOf(c, 330)} alt="" />
                  <span><h3 style={{ fontSize: 14 }}>{c.name}</h3><span className="small muted">{c.title}</span></span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="section" aria-labelledby="all-h">
          <div className="section-row">
            <h2 id="all-h">{browsing ? 'Top rated in London' : `${results.length} ${results.length === 1 ? 'creator' : 'creators'}`}</h2>
            {!browsing && <button onClick={reset}>Clear all</button>}
          </div>
          {results.length
            ? <div className="feed">{results.map((c, n) => <CreatorCard key={c.id} c={c} index={n} />)}</div>
            : <Empty icon={IconMoodEmpty} title="No creators match" text="Try a different search term or loosen your filters." action={<button className="btn ghost sm" onClick={reset}>Clear filters</button>} />}
        </section>
      </div>

      <TabBar />

      <Sheet open={open} onClose={() => setOpen(false)} label="Filters">
        <div style={{ display: 'grid', gap: 24 }}>
          <h2>Filters</h2>
          <div className="field">
            <label id="f-medium">Type of work</label>
            <div className="seg" role="tablist" aria-labelledby="f-medium">
              {[['any', 'Any'], ['photo', 'Photo'], ['video', 'Video']].map(([v, l]) => (
                <button key={v} role="tab" aria-selected={draft.medium === v} onClick={() => setDraft({ ...draft, medium: v })}>{l}</button>
              ))}
            </div>
          </div>
          <div className="field">
            <label htmlFor="f-price">Starting price up to <span className="num">{draft.maxPrice >= 4000 ? 'any' : money(draft.maxPrice)}</span></label>
            <input id="f-price" type="range" min="200" max="4000" step="100" value={draft.maxPrice} onChange={(e) => setDraft({ ...draft, maxPrice: +e.target.value })} style={{ accentColor: 'var(--ink)' }} />
          </div>
          <div className="field">
            <label id="f-rating">Minimum rating</label>
            <div className="seg" role="tablist" aria-labelledby="f-rating">
              {[[0, 'Any'], [4.7, '4.7+'], [4.9, '4.9+']].map(([v, l]) => (
                <button key={v} role="tab" aria-selected={draft.minRating === v} onClick={() => setDraft({ ...draft, minRating: v })}>{l}</button>
              ))}
            </div>
          </div>
          <div className="row2">
            <button className="btn ghost" onClick={() => setDraft(DEFAULT_FILTERS)}>Reset</button>
            <button className="btn" onClick={() => { setFilters(draft); setOpen(false) }}>Show results</button>
          </div>
        </div>
      </Sheet>
    </>
  )
}
