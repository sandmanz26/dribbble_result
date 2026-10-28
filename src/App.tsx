import { useEffect, useState } from 'react'
import { NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import * as Dialog from '@radix-ui/react-dialog'
import * as Popover from '@radix-ui/react-popover'
import {
  HomeIcon, IdCardIcon, ListBulletIcon, HeartIcon, ChatBubbleIcon, MixIcon, CubeIcon, CardStackIcon, PersonIcon, CalendarIcon,
  ArchiveIcon, UpdateIcon, BarChartIcon, MagicWandIcon, CounterClockwiseClockIcon, GearIcon, MagnifyingGlassIcon, HamburgerMenuIcon, Cross2Icon, CheckIcon, ChevronDownIcon, DesktopIcon, LockClosedIcon,
} from '@radix-ui/react-icons'
import { CLINIC, ROLE_LABEL, type Role } from '@/data/clinic'
import { useStore } from '@/store'
import { can, type Mod } from '@/lib/access'
import { Avatar, Toaster } from '@/components/kit'
import { Kbd } from '@/components/ui/misc'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Today from '@/screens/Today'
import Registration from '@/screens/Registration'
import QueueBoard from '@/screens/QueueBoard'
import Vitals from '@/screens/Vitals'
import Consult from '@/screens/Consult'
import Lab from '@/screens/Lab'
import Pharmacy from '@/screens/Pharmacy'
import Cashier from '@/screens/Cashier'
import VisitView from '@/screens/VisitView'
import Patients from '@/screens/Patients'
import Schedule from '@/screens/Schedule'
import Inventory from '@/screens/Inventory'
import Integrations from '@/screens/Integrations'
import Reports from '@/screens/Reports'
import Asa from '@/screens/Asa'
import Activity from '@/screens/Activity'
import Settings from '@/screens/Settings'
import Display from '@/screens/Display'
import Search from '@/screens/Search'

type Item = { to: string; mod: Mod; label: string; icon: typeof HomeIcon }
const GROUPS: { label?: string; items: Item[] }[] = [
  { items: [{ to: '/', mod: 'today', label: 'Today', icon: HomeIcon }] },
  { label: 'Patient flow', items: [
    { to: '/registration', mod: 'registration', label: 'Front desk', icon: IdCardIcon },
    { to: '/queue', mod: 'queue', label: 'Queue board', icon: ListBulletIcon },
    { to: '/vitals', mod: 'vitals', label: 'Vitals and triage', icon: HeartIcon },
    { to: '/consult', mod: 'consult', label: 'Consultations', icon: ChatBubbleIcon },
    { to: '/lab', mod: 'lab', label: 'Lab', icon: MixIcon },
    { to: '/pharmacy', mod: 'pharmacy', label: 'Pharmacy', icon: CubeIcon },
    { to: '/cashier', mod: 'cashier', label: 'Cashier', icon: CardStackIcon },
  ] },
  { label: 'Records', items: [
    { to: '/patients', mod: 'patients', label: 'Patients', icon: PersonIcon },
    { to: '/schedule', mod: 'schedule', label: 'Doctor schedule', icon: CalendarIcon },
  ] },
  { label: 'Operations', items: [
    { to: '/inventory', mod: 'inventory', label: 'Drug stock', icon: ArchiveIcon },
    { to: '/integrations', mod: 'integrations', label: 'BPJS and SATUSEHAT', icon: UpdateIcon },
    { to: '/reports', mod: 'reports', label: 'Reports', icon: BarChartIcon },
  ] },
  { label: 'Clinic', items: [
    { to: '/asa', mod: 'asa', label: 'Asa assistant', icon: MagicWandIcon },
    { to: '/activity', mod: 'activity', label: 'Activity log', icon: CounterClockwiseClockIcon },
    { to: '/settings', mod: 'settings', label: 'Settings', icon: GearIcon },
  ] },
]

function useCounts() {
  const { visits, asa, jobs, drugs } = useStore()
  const at = (s: string) => visits.filter((v) => v.stage === s).length
  return {
    registration: visits.filter((v) => v.stage === 'booked').length,
    vitals: at('vitals'), consult: at('doctor_queue') + at('consult'), lab: at('lab'), pharmacy: at('pharmacy'), cashier: at('cashier'),
    asa: asa.filter((a) => a.state === 'needs_review' || a.state === 'failed').length,
    integrations: jobs.filter((j) => j.state === 'failed').length,
    inventory: drugs.filter((d) => d.batches.reduce((s, b) => s + b.qty, 0) < d.min).length,
  } as Partial<Record<Mod, number>>
}

function Nav({ onGo }: { onGo?: () => void }) {
  const { role } = useStore()
  const counts = useCounts()
  return (
    <nav aria-label="Main" className="grid content-start gap-4 px-3 pb-4">
      {GROUPS.map((g, i) => {
        const items = g.items.filter((it) => can(role, it.mod))
        if (!items.length) return null
        return (
          <div key={i} className="grid gap-0.5">
            {g.label && <p className="px-2 pb-1 text-[11.5px] font-semibold text-faint">{g.label}</p>}
            {items.map((it) => (
              <NavLink key={it.to} to={it.to} end={it.to === '/'} onClick={onGo} className={({ isActive }) => cn('group flex h-8 items-center gap-2.5 rounded-control px-2 text-[13.5px] text-muted transition-colors hover:bg-active hover:text-ink', isActive && 'bg-sheet font-semibold text-ink outline outline-1 outline-edge')}>
                <it.icon className="size-4 shrink-0" />{it.label}
                {counts[it.mod] ? <span className={cn('tnum ml-auto grid h-5 min-w-5 place-items-center rounded-full px-1.5 text-[11px] font-semibold', it.mod === 'integrations' || it.mod === 'inventory' ? 'bg-neg-bg text-neg-ink' : 'bg-active text-ink')}>{counts[it.mod]}</span> : null}
              </NavLink>
            ))}
          </div>
        )
      })}
    </nav>
  )
}

function RoleSwitch() {
  const { role, setRole, me } = useStore()
  const nav = useNavigate()
  const roles: Role[] = ['manager', 'frontdesk', 'nurse', 'doctor', 'pharmacist', 'cashier']
  return (
    <Popover.Root>
      <Popover.Trigger className="flex h-9 items-center gap-2 rounded-control pl-1 pr-2 hover:bg-active" aria-label="Switch demo role">
        <Avatar name={me.name} size={28} />
        <span className="hidden text-left leading-tight sm:block"><b className="block text-[13px] font-semibold">{me.name}</b><span className="block text-[11.5px] text-muted">{ROLE_LABEL[role]}</span></span>
        <ChevronDownIcon className="text-muted" />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content align="end" sideOffset={6} className="z-50 w-72 rounded-card border border-edge bg-sheet p-1.5 fd-in">
          <p className="px-2 pb-1.5 pt-1 text-[12px] text-muted">Demo: see the clinic as another role. The menu and permissions change.</p>
          {roles.map((r) => (
            <Popover.Close key={r} asChild>
              <button onClick={() => { setRole(r); nav('/') }} className="flex w-full items-center gap-2 rounded-[6px] px-2 py-1.5 text-left text-[13.5px] hover:bg-raised">
                <span className="w-4">{role === r && <CheckIcon />}</span>{ROLE_LABEL[r]}
              </button>
            </Popover.Close>
          ))}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}

function Guard({ mod, children }: { mod: Mod; children: React.ReactNode }) {
  const { role } = useStore()
  if (can(role, mod)) return <>{children}</>
  return (
    <div className="grid min-h-full place-items-center p-6">
      <div className="grid max-w-[420px] justify-items-center gap-2 text-center">
        <span className="grid size-10 place-items-center rounded-full bg-raised"><LockClosedIcon /></span>
        <h1 className="text-[18px] font-semibold">Not available for {ROLE_LABEL[role].toLowerCase()}</h1>
        <p className="text-[13.5px] text-muted">Access is set per role in Settings. Medical records are shown only to staff who treat or serve the patient, and every opening is logged.</p>
      </div>
    </div>
  )
}

const today = () => new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

export default function App() {
  const [menu, setMenu] = useState(false)
  const [search, setSearch] = useState(false)
  const loc = useLocation()
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setSearch(true) } }
    window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k)
  }, [])
  if (loc.pathname === '/display') return <Display />
  const G = (mod: Mod, el: React.ReactNode) => <Guard mod={mod}>{el}</Guard>
  return (
    <div className="grid h-full grid-cols-1 grid-rows-[52px_1fr_auto] lg:grid-cols-[248px_1fr]">
      <div className="hidden items-center gap-2.5 px-5 lg:flex">
        <Logo /><span className="text-[15px] font-bold tracking-[-0.02em]">Rawat</span>
        <span className="ml-auto max-w-[110px] truncate text-[11.5px] text-faint">{CLINIC.short}</span>
      </div>
      <header className="flex h-[52px] items-center gap-3 px-3 lg:pl-1 lg:pr-3">
        <button className="grid size-9 place-items-center rounded-control hover:bg-active lg:hidden" onClick={() => setMenu(true)} aria-label="Open menu"><HamburgerMenuIcon /></button>
        <span className="flex items-center gap-2 lg:hidden"><Logo /><b className="text-[15px]">Rawat</b></span>
        <div className="hidden min-w-0 leading-tight lg:block">
          <p className="truncate text-[13.5px] font-semibold">{CLINIC.name}</p>
          <p className="text-[12px] text-muted">{today()}</p>
        </div>
        <button className="mx-auto hidden h-9 w-full max-w-[460px] items-center gap-2 rounded-control border border-edge bg-sheet px-3 text-[13px] text-faint md:flex" onClick={() => setSearch(true)}>
          <MagnifyingGlassIcon />Find a patient by name, NIK, BPJS or RM number<span className="ml-auto flex gap-1"><Kbd>⌘</Kbd><Kbd>K</Kbd></span>
        </button>
        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <Button asChild variant="ghost" size="sm" className="hidden xl:inline-flex"><a href="#/display" target="_blank" rel="noreferrer"><DesktopIcon />Waiting room screen</a></Button>
          <button className="grid size-9 place-items-center rounded-control hover:bg-active md:hidden" onClick={() => setSearch(true)} aria-label="Search"><MagnifyingGlassIcon /></button>
          <RoleSwitch />
        </div>
      </header>
      <aside className="hidden overflow-y-auto lg:block"><Nav /></aside>
      <main className="min-w-0 overflow-hidden bg-sheet lg:mr-2 lg:rounded-sheet lg:border lg:border-edge">
        <div className="h-full overflow-y-auto" key={loc.pathname.split('/')[1]}>
          <Routes>
            <Route path="/" element={<Today />} />
            <Route path="/registration" element={G('registration', <Registration />)} />
            <Route path="/queue" element={G('queue', <QueueBoard />)} />
            <Route path="/vitals" element={G('vitals', <Vitals />)} />
            <Route path="/vitals/:id" element={G('vitals', <Vitals />)} />
            <Route path="/consult" element={G('consult', <Consult />)} />
            <Route path="/consult/:id" element={G('consult', <Consult />)} />
            <Route path="/lab" element={G('lab', <Lab />)} />
            <Route path="/pharmacy" element={G('pharmacy', <Pharmacy />)} />
            <Route path="/cashier" element={G('cashier', <Cashier />)} />
            <Route path="/visits/:id" element={G('patients', <VisitView />)} />
            <Route path="/patients" element={G('patients', <Patients />)} />
            <Route path="/patients/:id" element={G('patients', <Patients />)} />
            <Route path="/schedule" element={G('schedule', <Schedule />)} />
            <Route path="/inventory" element={G('inventory', <Inventory />)} />
            <Route path="/integrations" element={G('integrations', <Integrations />)} />
            <Route path="/reports" element={G('reports', <Reports />)} />
            <Route path="/asa" element={G('asa', <Asa />)} />
            <Route path="/activity" element={G('activity', <Activity />)} />
            <Route path="/settings" element={G('settings', <Settings />)} />
            <Route path="*" element={<Today />} />
          </Routes>
        </div>
      </main>
      <DemoBanner />
      <Dialog.Root open={menu} onOpenChange={setMenu}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-black/30" />
          <Dialog.Content className="fixed inset-y-0 left-0 z-50 w-[280px] overflow-y-auto bg-frame pt-3 fd-in" aria-describedby={undefined}>
            <div className="mb-3 flex items-center justify-between px-5"><Dialog.Title className="flex items-center gap-2 text-[15px] font-bold"><Logo />Rawat</Dialog.Title><Dialog.Close className="grid size-8 place-items-center rounded-control hover:bg-active" aria-label="Close menu"><Cross2Icon /></Dialog.Close></div>
            <Nav onGo={() => setMenu(false)} />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      <Search open={search} onOpenChange={setSearch} />
      <Toaster />
    </div>
  )
}

// The mark: a plus drawn from two rounded bars that do not quite meet, the gap read as a path.
export function Logo({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <rect width="24" height="24" rx="7" fill="var(--color-accent)" />
      <rect x="10" y="5" width="4" height="7" rx="2" fill="#fff" /><rect x="10" y="13.5" width="4" height="5.5" rx="2" fill="#fff" opacity=".7" />
      <rect x="5" y="10" width="7" height="4" rx="2" fill="#fff" /><rect x="13.5" y="10" width="5.5" height="4" rx="2" fill="#fff" opacity=".7" />
    </svg>
  )
}

function DemoBanner() {
  return (
    <div className="col-span-full flex items-center justify-center gap-2 bg-ink px-4 py-2 text-center text-[12.5px] text-white/85" role="note">
      <span className="rounded-full bg-white/15 px-2 py-0.5 text-[11.5px] font-semibold text-white">Demo</span>
      Design prototype with synthetic data.<span className="hidden sm:inline"> Not a real clinic, not connected to BPJS, Mobile JKN or SATUSEHAT.</span>
    </div>
  )
}
