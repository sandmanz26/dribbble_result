import { useEffect, useState } from 'react'
import { NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import * as Dialog from '@radix-ui/react-dialog'
import { HomeIcon, StackIcon, CounterClockwiseClockIcon, MixerHorizontalIcon, FileTextIcon, CalendarIcon, IdCardIcon, PersonIcon, ChatBubbleIcon, BarChartIcon, Link2Icon, ReaderIcon, MagnifyingGlassIcon, HamburgerMenuIcon, Cross2Icon, QuestionMarkCircledIcon } from '@radix-ui/react-icons'
import { CLINIC, ME, UPCOMING } from '@/data/demo'
import { useStore } from '@/store'
import { ActorMark } from '@/components/flow'
import { Kbd, Pill, Tip } from '@/components/ui/misc'
import { Toaster } from '@/components/Toaster'
import { cn } from '@/lib/utils'
import Today from '@/screens/Today'
import Queue from '@/screens/Queue'
import RunView from '@/screens/Run'
import Activity from '@/screens/Activity'
import Rules from '@/screens/Rules'
import Referrals from '@/screens/Referrals'
import Handoff from '@/screens/Handoff'
import Upcoming from '@/screens/Upcoming'

const UP_ICONS: Record<string, typeof CalendarIcon> = { scheduling: CalendarIcon, authorizations: IdCardIcon, patients: PersonIcon, messages: ChatBubbleIcon, reports: BarChartIcon, integrations: Link2Icon }

function Nav({ onGo }: { onGo?: () => void }) {
  const { tasks } = useStore()
  const needs = tasks.filter((t) => t.state === 'needs_review' || t.state === 'failed').length
  const running = tasks.filter((t) => t.state === 'running' || t.state === 'approving' || t.state === 'waiting' || t.state === 'queued').length
  const item = (to: string, Icon: typeof HomeIcon, label: string, extra?: React.ReactNode) => (
    <NavLink to={to} end={to === '/'} onClick={onGo} className={({ isActive }) => cn('flex h-8 items-center gap-2.5 rounded-control px-2 text-[13.5px] text-muted hover:bg-active hover:text-ink', isActive && 'bg-active font-semibold text-ink')}>
      <Icon className="size-4" />{label}{extra && <span className="ml-auto">{extra}</span>}
    </NavLink>
  )
  return (
    <div className="flex h-full flex-col gap-5 px-3 pb-3">
      <nav aria-label="Main" className="grid gap-0.5">
        {item('/', HomeIcon, 'Today')}
        {item('/queue', StackIcon, 'Queue', needs ? <span className="tnum grid h-5 min-w-5 place-items-center rounded-full bg-ink px-1.5 text-[11.5px] font-semibold text-white">{needs}</span> : null)}
        {item('/referrals', FileTextIcon, 'Referrals')}
        {item('/activity', CounterClockwiseClockIcon, 'Activity')}
        {item('/rules', MixerHorizontalIcon, 'Rules for Patrick')}
      </nav>
      <div className="grid gap-0.5">
        <p className="px-2 pb-1 text-[12px] font-medium text-faint">Upcoming</p>
        {UPCOMING.map((u) => {
          const Icon = UP_ICONS[u.path]
          return (
            <NavLink key={u.path} to={`/upcoming/${u.path}`} onClick={onGo} className={({ isActive }) => cn('flex h-8 items-center gap-2.5 rounded-control px-2 text-[13.5px] text-faint hover:bg-active', isActive && 'bg-active text-ink')}>
              <Icon className="size-4" />{u.label}<Pill className="ml-auto h-[18px] px-1.5 text-[11px]">Soon</Pill>
            </NavLink>
          )
        })}
      </div>
      <div className="mt-auto grid gap-2">
        {item('/handoff', ReaderIcon, 'Design handoff')}
        <div className="flex items-center gap-2.5 rounded-card bg-sheet p-2.5 border border-edge">
          <ActorMark actor={{ kind: 'agent', name: 'Patrick' }} size={28} />
          <div className="min-w-0 text-[12.5px] leading-tight">
            <p className="font-semibold">Patrick is working</p>
            <p className="tnum text-muted">{running} jobs · {needs} for people</p>
          </div>
          <span className="ml-auto size-2 rounded-full bg-positive fd-pulse" aria-hidden="true" />
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [menu, setMenu] = useState(false)
  const loc = useLocation()
  const nav = useNavigate()
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.key === 'g') { (window as unknown as { _g: number })._g = Date.now(); return }
      const g = Date.now() - ((window as unknown as { _g?: number })._g ?? 0) < 800
      if (g && e.key === 'q') nav('/queue')
      if (g && e.key === 't') nav('/')
      if (g && e.key === 'a') nav('/activity')
    }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [nav])

  return (
    <div className="grid h-full grid-cols-1 grid-rows-[48px_1fr] lg:grid-cols-[228px_1fr] lg:grid-rows-[48px_1fr]">
      <div className="hidden items-center gap-2.5 px-5 lg:flex">
        <span className="grid size-6 place-items-center rounded-[6px] bg-accent text-white"><svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M2 3h10M2 7h7M2 11h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></span>
        <span className="text-[14px] font-semibold">Flow Director</span>
      </div>
      <header className="flex h-12 items-center gap-3 px-3 lg:px-2 lg:pr-4">
        <button className="grid size-8 place-items-center rounded-control hover:bg-active lg:hidden" onClick={() => setMenu(true)} aria-label="Open menu"><HamburgerMenuIcon /></button>
        <span className="text-[14px] font-semibold lg:hidden">Flow Director</span>
        <span className="hidden text-[13px] text-muted lg:inline">{CLINIC.name}</span>
        <button className="mx-auto hidden h-8 w-full max-w-[520px] items-center gap-2 rounded-control bg-sheet px-2.5 text-[13px] text-faint border border-edge md:flex" onClick={() => nav('/queue')}>
          <MagnifyingGlassIcon />Search patients, tasks, faxes<span className="ml-auto flex gap-1"><Kbd>⌘</Kbd><Kbd>K</Kbd></span>
        </button>
        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <Tip label="Shortcuts: g then t, q or a to jump; j and k move in the queue; a approves"><button className="grid size-8 place-items-center rounded-control text-muted hover:bg-active" aria-label="Keyboard shortcuts"><QuestionMarkCircledIcon /></button></Tip>
          <Tip label={`${ME.kind === 'human' ? ME.name : ''}, ${ME.kind === 'human' ? ME.role : ''}`}><span><ActorMark actor={ME} size={28} /></span></Tip>
        </div>
      </header>
      <aside className="hidden lg:block"><Nav /></aside>
      <main className="min-w-0 overflow-hidden bg-sheet lg:mb-2 lg:mr-2 lg:rounded-sheet lg:border lg:border-edge">
        <div className="h-full overflow-y-auto" key={loc.pathname.split('/')[1]}>
          <Routes>
            <Route path="/" element={<Today />} />
            <Route path="/queue" element={<Queue />} />
            <Route path="/queue/:id" element={<Queue />} />
            <Route path="/runs/:id" element={<RunView />} />
            <Route path="/referrals" element={<Referrals />} />
            <Route path="/activity" element={<Activity />} />
            <Route path="/rules" element={<Rules />} />
            <Route path="/handoff" element={<Handoff />} />
            <Route path="/upcoming/:path" element={<Upcoming />} />
            <Route path="*" element={<Today />} />
          </Routes>
        </div>
      </main>
      <Dialog.Root open={menu} onOpenChange={setMenu}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-black/30" />
          <Dialog.Content className="fixed inset-y-0 left-0 z-50 w-[280px] bg-frame pt-3 fd-in" aria-describedby={undefined}>
            <div className="mb-3 flex items-center justify-between px-5"><Dialog.Title className="text-[14px] font-semibold">Flow Director</Dialog.Title><Dialog.Close className="grid size-8 place-items-center rounded-control hover:bg-active" aria-label="Close menu"><Cross2Icon /></Dialog.Close></div>
            <Nav onGo={() => setMenu(false)} />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      <Toaster />
    </div>
  )
}
