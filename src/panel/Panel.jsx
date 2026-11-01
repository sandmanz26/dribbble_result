import { Link } from 'react-router-dom'
import { useStore } from '../store.jsx'

// Reviewer panel beside the phone on desktop. Hidden on phones.
export default function Panel() {
  const { s, set, firstReleases, reset, toast } = useStore()
  return (
    <aside className="panel" aria-label="Prototype controls">
      <p className="wordmark"><i className="live" aria-hidden="true" />Rolling</p>
      <h2 className="panel__h">A phone app for the people who make film and TV</h2>
      <p className="panel__p">
        Crew and creatives live by three things: tomorrow's call sheet, which productions are holding their dates,
        and who they have worked with. Rolling puts those in one place. Production uses the same app to crew up.
      </p>

      <div className="panel__group">
        <p className="panel__label">View as</p>
        <div className="chips">
          <button className="chip" aria-pressed={s.as === 'crew'} onClick={() => set({ as: 'crew', onboarded: true })}>Crew: Mara, gaffer</button>
          <button className="chip" aria-pressed={s.as === 'production'} onClick={() => set({ as: 'production', onboarded: true })}>Production: Kofi</button>
        </div>
      </div>

      <div className="panel__group">
        <p className="panel__label">Shoot day</p>
        <div className="chips">
          {[['precall', 'Before call'], ['rolling', 'Rolling'], ['wrapped', 'Wrapped']].map(([v, l]) => (
            <Link key={v} to="/" className="chip" aria-pressed={s.scene === v} onClick={() => set({ scene: v, onboarded: true })}>{l}</Link>
          ))}
        </div>
      </div>

      <div className="panel__group">
        <p className="panel__label">Pencils</p>
        <p className="panel__p">A second pencil can challenge the first. The first then has 24 hours to confirm or let go.</p>
        <div className="chips">
          <Link to="/avails" className="chip" onClick={() => set({ as: 'crew', onboarded: true })}>Open avails</Link>
          <button className="chip" disabled={s.challenge !== 'sent'} onClick={() => { firstReleases(); toast('Paper Moon let Mara go') }}>Paper Moon lets go</button>
        </div>
      </div>

      <div className="panel__group">
        <p className="panel__label">Try</p>
        <ul className="panel__links">
          <li><Link to="/calls/northlight-gaffer" onClick={() => set({ as: 'crew', onboarded: true })}>Offer avails for a series</Link></li>
          <li><Link to="/calls/dry-creek-spark" onClick={() => set({ as: 'crew', onboarded: true })}>A call that clashes with your booking</Link></li>
          <li><Link to="/crew/gaffer" onClick={() => set({ as: 'production', onboarded: true })}>Crew up a gaffer as production</Link></li>
          <li><Link to="/welcome">First run</Link></li>
        </ul>
      </div>

      <div className="panel__group panel__row">
        <div className="chips" role="group" aria-label="Appearance">
          {[['system', 'Auto'], ['light', 'Light'], ['dark', 'Dark']].map(([v, l]) => (
            <button key={v} className="chip" aria-pressed={s.theme === v} onClick={() => set({ theme: v })}>{l}</button>
          ))}
        </div>
        <button className="chip" onClick={() => { reset(); toast('Demo reset') }}>Reset demo</button>
      </div>

      <p className="panel__fine">Prototype with sample data. Names, productions, rates and dates are invented. Placeholder name. <Link to="/credits">Photo credits</Link></p>
    </aside>
  )
}
