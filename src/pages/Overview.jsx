import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PATHS, PATH_ORDER, TASKS, NOW, fmt, totals } from '../data/myelin.js'
import { Button } from '../components/ui/button.jsx'
import { Slider } from '../components/ui/slider.jsx'
import { Trace, PathMark, PathChip } from '../ui/kit.jsx'
import { Mark } from '../App.jsx'

const EXAMPLE = {
  reflex: ['What is our refund rule for damaged items?', '50 ms', 'about $0.00002'],
  recall: ['Draft the reply to Lindgren Timber about the oak delay', '1.2 s', 'about $0.0009'],
  reason: ['Why did returns rise in September?', '31 s', 'about $0.14'],
}

// The recording runs: the day's tasks play onto the trace, as a chart recorder would draw them.
function LiveTrace() {
  const from = new Date(NOW.getTime() - 24 * 3600 * 1000)
  const all = useMemo(() => TASKS.filter((t) => t.at >= from), []) // eslint-disable-line react-hooks/exhaustive-deps
  const [n, setN] = useState(() => (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches ? all.length : 20))
  useEffect(() => { if (n >= all.length) return; const id = setTimeout(() => setN((x) => Math.min(all.length, x + 3)), 40); return () => clearTimeout(id) }, [n, all.length])
  const shown = all.slice(0, n)
  const T = totals(shown)
  return (
    <div data-ui className="rounded-card bg-surface p-5 md:p-6">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
        <p className="text-[14px] font-semibold">Fernwood Studio, one day of work</p>
        <p className="num text-[13px] text-muted">{T.n} tasks · {fmt.pct(T.fast)} on fast paths · {fmt.usd(T.cost)} instead of {fmt.usd(T.base)}</p>
      </div>
      <Trace tasks={shown} from={from} to={NOW} height={150} />
    </div>
  )
}

// Starting points for the calculator; repeat shares from the research notes, volumes for a team of about ten.
const TEAMS = [['Customer support', 20000, 80], ['Operations', 12000, 70], ['Finance reporting', 6000, 65], ['Research', 4000, 20]]

function Calculator() {
  const [vol, setVol] = useState([12000])
  const [rep, setRep] = useState([70])
  const base = vol[0] * 0.06 // average large-model task in the sample workspace
  const fast = rep[0] / 100
  const cost = base * ((1 - fast) + fast * 0.012)
  const saved = 1 - cost / base
  return (
    <div data-ui className="grid gap-6 rounded-card bg-surface p-6 md:grid-cols-[1fr_320px] md:gap-10">
      <div className="grid content-start gap-7">
        <div>
          <label className="flex justify-between text-[14px]" htmlFor="vol"><span>Tasks a month</span><span className="num">{vol[0].toLocaleString('en-US')}</span></label>
          <Slider id="vol" className="mt-3" min={1000} max={60000} step={1000} value={vol} onValueChange={setVol} label="Tasks a month" />
        </div>
        <div>
          <label className="flex justify-between text-[14px]" htmlFor="rep"><span>Share that repeats or is already known</span><span className="num">{rep[0]}%</span></label>
          <Slider id="rep" className="mt-3" min={10} max={95} step={5} value={rep} onValueChange={setRep} label="Share of repeat work" />
          <p className="mt-2 text-[13px] text-muted">Support, ops and reporting teams usually sit between 50% and 80%. Open-ended research sits under 20%.</p>
        </div>
        <fieldset>
          <legend className="text-[14px]">Or start from a team like yours</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {TEAMS.map(([name, n, r]) => {
              const on = vol[0] === n && rep[0] === r
              return <button key={name} type="button" aria-pressed={on} onClick={() => { setVol([n]); setRep([r]) }} className={`rounded-full border px-3.5 py-1.5 text-[13px] transition-colors ${on ? 'border-amber text-ink' : 'border-control text-muted hover:text-ink'}`}>{name} <span className="num text-faint">{r}%</span></button>
            })}
          </div>
        </fieldset>
      </div>
      <dl className="grid content-start gap-4 border-line md:border-l md:pl-8">
        <div><dt className="text-[13px] text-muted">Reasoning everything</dt><dd className="num text-[28px]">{fmt.usd(base)}</dd></div>
        <div><dt className="text-[13px] text-muted">With Myelin</dt><dd className="num text-[28px] text-amber">{fmt.usd(cost)}</dd></div>
        <div><dt className="text-[13px] text-muted">Cheaper by</dt><dd className="num text-[28px]">{fmt.pct(saved)}</dd></div>
        <p className="text-[13px] text-muted">Assumes $0.06 for a large-model task and about 1% of that on Reflex or Recall. Reaching 80% needs about 80% of the work to repeat.</p>
      </dl>
    </div>
  )
}

function useRise() {
  useEffect(() => {
    const els = [...document.querySelectorAll('[data-rise]')]
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return
    document.documentElement.classList.add('js-rise')
    const io = new IntersectionObserver((en) => en.forEach((x) => { if (x.isIntersecting) { x.target.classList.add('is-in'); io.unobserve(x.target) } }), { rootMargin: '0px 0px -8% 0px' })
    els.forEach((e, i) => { e.style.setProperty('--d', `${(i % 4) * 80}ms`); io.observe(e) })
    return () => io.disconnect()
  }, [])
}

export default function Overview() {
  useRise()
  const T = totals(TASKS.filter((t) => t.at >= new Date(NOW.getTime() - 24 * 3600 * 1000)))
  const sample = TASKS.find((t) => t.id === 'T-2211')
  return (
    <div className="ov min-h-screen">
      <a href="#ov" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-full focus:bg-amber focus:px-4 focus:py-2 focus:text-amber-ink">Skip to content</a>
      <header className="mx-auto flex max-w-[1320px] items-center gap-6 px-5 py-5 md:px-8">
        <Link to="/" className="flex items-center gap-2 text-[16px] font-semibold"><Mark size={26} />Myelin</Link>
        <nav className="ml-auto hidden gap-6 text-[14px] text-muted md:flex" aria-label="Sections"><a href="#paths" className="hover:text-ink">How it thinks</a><a href="#cost" className="hover:text-ink">Cost</a><a href="#surfaces" className="hover:text-ink">Web, desktop, mobile</a><a href="#why" className="hover:text-ink">Why it looks like this</a></nav>
        <Button variant="primary" asChild className="ml-auto md:ml-0"><Link to="/app">Open the workspace</Link></Button>
      </header>

      <main id="ov" className="mx-auto max-w-[1320px] px-5 md:px-8">
        <section className="grid gap-10 pb-14 pt-10 md:pt-16 lg:grid-cols-[1.5fr_1fr] lg:items-end" aria-labelledby="h1">
          <div>
            <h1 id="h1" className="font-display text-[clamp(44px,6.2vw,96px)] font-black leading-[0.95] tracking-[-0.035em]"><span className="block">Thinks only</span><span className="block">when it has to.</span></h1>
            <p className="mt-8 max-w-none text-[19px] md:max-w-[44ch] leading-relaxed text-ink">Myelin is an AI for teams that answers from habit or memory when that is good enough, and reasons from scratch only when the work is new. Every answer shows the path it took and what it saved.</p>
            <div className="mt-8 flex flex-wrap items-center gap-4"><Button variant="primary" size="lg" asChild><Link to="/app">Open the workspace</Link></Button><a href="#paths" className="text-[14px] text-muted underline underline-offset-4 hover:text-ink">How it decides</a></div>
          </div>
          <figure>
            <div className="overflow-hidden rounded-card"><img src="photos/switchboard.webp" alt="Operators at a telephone switchboard, Port Adelaide" width="1024" height="858" className="drift aspect-[5/4] w-full object-cover grayscale" fetchpriority="high" /></div>
            <figcaption className="mt-2 text-[13px] text-muted">A telephone switchboard, Port Adelaide. Routing each call to the right line is an old idea.</figcaption>
          </figure>
        </section>

        <LiveTrace />

        <section id="paths" className="py-28" aria-labelledby="paths-h">
          <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
            <div>
              <h2 data-rise id="paths-h" className="font-display text-[clamp(32px,4vw,56px)] font-bold leading-[1.02] tracking-[-0.02em]">Three paths, cheapest first</h2>
              <p className="mt-5 max-w-none text-[16px] text-ink md:max-w-[42ch]">Like a person, it does what it already knows by habit, looks up what it has seen before, and only thinks hard about what is new. Attention picks the path; if the fast answer is not sure enough, it escalates on its own and says so.</p>
            </div>
            <ol className="grid gap-2">
              {PATH_ORDER.map((p) => (
                <li key={p} data-rise className="grid gap-2 rounded-card bg-surface p-5 md:grid-cols-[150px_1fr_150px] md:gap-6">
                  <p className="flex items-center gap-2 text-[20px] font-semibold"><PathMark path={p} size={14} />{PATHS[p].name}</p>
                  <div><p className="text-[16px]">{PATHS[p].what}.</p><p className="mt-1 text-[14px] text-muted">“{EXAMPLE[p][0]}”</p></div>
                  <p className="num text-[14px] md:text-right"><span className="block">{EXAMPLE[p][1]}</span><span className="text-muted">{EXAMPLE[p][2]}</span></p>
                </li>
              ))}
            </ol>
          </div>
          <div data-ui className="mt-10 rounded-card bg-surface p-5">
            <p className="text-[13px] text-muted">Every answer carries its path</p>
            <p className="mt-2 text-[15px]">{sample.ask}</p>
            <PathChip t={sample} className="mt-2" />
          </div>
        </section>

        <section id="cost" className="pb-28" aria-labelledby="cost-h">
          <div className="mb-8 grid gap-4 lg:grid-cols-[1fr_1.4fr] lg:items-end">
            <h2 data-rise id="cost-h" className="font-display text-[clamp(32px,4vw,56px)] font-bold leading-[1.02] tracking-[-0.02em]">What cheaper means for your team</h2>
            <p className="max-w-none text-[16px] text-ink md:max-w-[56ch]">The saving depends on how much of the work repeats. Yesterday the sample workspace ran <span className="num text-ink">{fmt.pct(T.pct)}</span> under the cost of reasoning everything. Move the sliders to your own mix.</p>
          </div>
          <Calculator />
        </section>

        <section id="surfaces" className="pb-28" aria-labelledby="sf-h">
          <h2 data-rise id="sf-h" className="mb-8 font-display text-[clamp(32px,4vw,56px)] font-bold leading-[1.02] tracking-[-0.02em]">One brain, three jobs</h2>
          <ol className="grid gap-x-10 gap-y-24 md:grid-cols-3 md:gap-y-8">
            {[
              ['/app', 'Web', 'The workspace: the day’s trace, every task and its path, memory you can edit, habits to approve, spend against the baseline.'],
              ['/desktop', 'Desktop', 'Quick ask over the app you are in. Alt Space, ask, Enter pastes the answer back. The tray keeps today’s numbers in view.'],
              ['/mobile', 'Mobile', 'A glance at the day, a task by voice or photo, and approving the habits it proposed overnight.'],
            ].map(([to, t, d]) => (
              <li key={to} data-rise>
                <Link to={to} className="group block"><b className="block font-display text-[clamp(40px,4.4vw,64px)] font-bold leading-none tracking-[-0.03em] transition-colors group-hover:text-amber">{t}</b><span className="mt-4 block text-[16px] text-ink">{d}</span><span className="mt-3 inline-block text-[14px] text-muted underline underline-offset-4 group-hover:text-ink">Open {t.toLowerCase()}</span></Link>
              </li>
            ))}
          </ol>
        </section>

        <section id="why" className="grid gap-10 pb-28 lg:grid-cols-[1fr_1.2fr]" aria-labelledby="why-h">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <h2 data-rise id="why-h" className="font-display text-[clamp(32px,4vw,56px)] font-bold leading-[1.02] tracking-[-0.02em]">Measured, not imagined</h2>
            <p className="mt-5 max-w-none text-[16px] text-ink md:max-w-[46ch]">Brain-inspired AI usually gets a glowing brain and a purple gradient. Myelin borrows from the instruments that study real brains instead: the chart recorder’s trace, the switchboard’s routing, figures that line up. It shows what the system did, not what it looks like inside.</p>
            <ul className="mt-6 grid gap-3 text-[15px]">
              <li>No model picker before you start. It chooses; you can overrule.</li>
              <li>No spinner that only says “thinking”. Waiting shows the path and the reason.</li>
              <li>Savings always beside their baseline, escalations listed openly.</li>
              <li>Nothing learned without a person approving it.</li>
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <figure data-rise className="col-span-2"><img src="photos/eeg-cap.webp" alt="A participant in an EEG cap and eye-tracking glasses solving a puzzle" width="1024" height="773" loading="lazy" className="aspect-[16/9] w-full rounded-card object-cover" /><figcaption className="mt-2 text-[13px] text-muted">EEG cap and eye tracking during a puzzle task.</figcaption></figure>
            <figure data-rise><img src="photos/console.webp" alt="Operator console of an NEC 2203 mainframe" width="1024" height="768" loading="lazy" className="aspect-[4/3] w-full rounded-card object-cover" /><figcaption className="mt-2 text-[13px] text-muted">NEC 2203 mainframe console.</figcaption></figure>
            <figure data-rise><img src="photos/valves.webp" alt="Glowing vacuum tubes inside a 1938 radio" width="1024" height="682" loading="lazy" className="aspect-[4/3] w-full rounded-card object-cover" /><figcaption className="mt-2 text-[13px] text-muted">Valves in a 1938 Philco radio.</figcaption></figure>
          </div>
        </section>
      </main>

      <footer className="bg-surface">
        <div className="mx-auto grid max-w-[1320px] gap-8 px-5 py-14 md:grid-cols-[1fr_auto] md:px-8">
          <div>
            <p className="font-display text-[clamp(40px,6vw,88px)] font-black leading-none tracking-[-0.035em]">Myelin</p>
            <p className="mt-3 max-w-[52ch] text-[14px] text-muted">A design prototype for a brain-inspired AI platform. The name, the workspace and every figure are samples.</p>
          </div>
          <nav className="grid content-end gap-2 text-[14px]" aria-label="More"><Link className="hover:text-amber" to="/app">Web workspace</Link><Link className="hover:text-amber" to="/desktop">Desktop</Link><Link className="hover:text-amber" to="/mobile">Mobile</Link><Link className="text-muted hover:text-ink" to="/credits">Photo credits</Link></nav>
        </div>
      </footer>
    </div>
  )
}
