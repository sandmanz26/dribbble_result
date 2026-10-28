import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { ChevronSort, Launch, Logout, Time } from '@carbon/icons-react'
import { useStore } from '../store.jsx'
import { useNow } from './Sessions.jsx'
import { sessionNow } from '../data/sessions.js'
import { Avatar, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, Tip, TooltipProvider } from '@/components/ui/misc'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

// The brand mark: a rising line in gold on a dark tile.
export function Mark({ size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="#16181c" />
      <path d="M6 21l6-6 5 4 9-9" fill="none" stroke="#d4ae62" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// The app shell, after shadcn/ui's sidebar block: a labelled sidebar with the area's pages, the
// market's state and the signed-in person at the foot; a sticky header with the page path and the
// live UTC clock. Below 1024px the sidebar folds to an icon rail, below 768px to a bottom bar.
export default function Shell({ items, children, label, area, user }) {
  const { set, toast, notify } = useStore()
  const nav = useNavigate()
  const loc = useLocation()
  const now = useNow(15000)
  const info = sessionNow(now)
  const here = items.find(([to, , , end]) => (end ? loc.pathname === to : loc.pathname.startsWith(to))) || items[0]
  const clock = `${String(now.getUTCHours()).padStart(2, '0')}:${String(now.getUTCMinutes()).padStart(2, '0')}`
  const out = () => { set({ session: null }); nav('/login') }
  return (
    <TooltipProvider>
      <div className="dash relative min-h-screen overflow-x-clip">
        <div className="dash-grid" aria-hidden="true" />
        <div className="dash-glow" aria-hidden="true" />
        <aside aria-label={label} className="fixed inset-y-0 left-0 z-30 hidden w-16 flex-col border-r border-border bg-[#0a0b0e]/90 backdrop-blur md:flex lg:w-64">
          <NavLink to="/" className="flex h-14 items-center gap-2.5 px-4 lg:px-5">
            <Mark />
            <span className="hidden font-display text-[17px] tracking-tight lg:inline">GlobalTrade</span>
            <Badge tone="gold" className="ml-auto hidden lg:inline-flex">{area}</Badge>
          </NavLink>
          <nav className="flex flex-1 flex-col gap-0.5 px-2.5 pt-4 lg:px-3">
            <p className="hidden px-2 pb-2 text-[11px] text-muted-foreground lg:block">Menu</p>
            {items.map(([to, name, Icon, end]) => (
              <Tip key={to} label={name}>
                <span className="block"><NavLink to={to} end={end} aria-label={name} className={({ isActive }) => cn(
                  'group relative flex h-9 items-center gap-3 rounded-md px-2.5 text-[13.5px] text-muted-foreground transition-colors hover:bg-white/[0.04] hover:text-foreground',
                  isActive && 'bg-white/[0.06] text-foreground before:absolute before:-left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:rounded-full before:bg-primary before:shadow-[0_0_12px_rgb(212_174_98/0.8)] lg:before:-left-3',
                )}>
                  <Icon size={18} className="shrink-0" />
                  <span className="hidden lg:inline">{name}</span>
                </NavLink></span>
              </Tip>
            ))}
          </nav>
          <div className="hidden px-3 pb-3 lg:block">
            <div className="rounded-lg border border-border bg-white/[0.02] p-3">
              <p className="flex items-center gap-2 text-xs"><span className={cn('live-dot size-1.5 rounded-full', info.open.length ? 'bg-positive' : 'bg-muted-foreground')} />{info.open.length ? `${info.open.map((s) => s.city).join(' and ')} open` : 'Between sessions'}</p>
              <p className="mt-1 text-[11px] leading-snug text-muted-foreground">{info.line}</p>
            </div>
          </div>
          <div className="border-t border-border p-2.5 lg:p-3">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex w-full items-center gap-2.5 rounded-md p-1.5 text-left hover:bg-white/[0.04]" aria-label="Account menu">
                <Avatar name={user.name} />
                <span className="hidden min-w-0 flex-1 lg:block"><span className="block truncate text-[13px]">{user.name}</span><span className="block truncate text-[11px] text-muted-foreground">{user.sub}</span></span>
                <ChevronSort size={16} className="hidden text-muted-foreground lg:block" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" side="top">
                <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => nav('/')}><Launch size={16} />GlobalTrade website</DropdownMenuItem>
                <DropdownMenuItem onSelect={out}><Logout size={16} />Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </aside>

        <div className="relative md:pl-16 lg:pl-64">
          <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-[#08090b]/70 px-4 backdrop-blur-xl md:px-6">
            <NavLink to="/" className="md:hidden" aria-label="GlobalTrade website"><Mark size={24} /></NavLink>
            <p className="text-[13px] text-muted-foreground"><span className="hidden sm:inline">{area} <span className="px-1.5 text-white/20">/</span></span><span className="text-foreground">{here[1]}</span></p>
            <span className="ml-auto flex items-center gap-2">
              <Badge tone="neutral" className="hidden sm:inline-flex"><span className="live-dot size-1.5 rounded-full bg-positive" />Demo prices</Badge>
              <span className="flex h-8 items-center gap-1.5 rounded-md border border-border bg-white/[0.02] px-2.5 text-xs tabular-nums text-muted-foreground"><Time size={14} />{clock} UTC</span>
            </span>
          </header>
          <main className="mx-auto grid max-w-[1440px] gap-5 px-4 pb-24 pt-6 md:px-6 md:pb-10">{children}</main>
        </div>

        <nav aria-label={`${label}, mobile`} className="fixed inset-x-0 bottom-0 z-30 flex h-16 items-stretch justify-around border-t border-border bg-[#0a0b0e]/95 backdrop-blur md:hidden">
          {items.map(([to, name, Icon, end]) => (
            <NavLink key={to} to={to} end={end} aria-label={name} className={({ isActive }) => cn('flex flex-1 flex-col items-center justify-center gap-1 text-[10px] text-muted-foreground', isActive && 'text-primary')}>
              <Icon size={20} /><span className="max-w-16 truncate">{name.split(' ')[0]}</span>
            </NavLink>
          ))}
          <button onClick={out} aria-label="Log out" className="flex flex-1 flex-col items-center justify-center gap-1 text-[10px] text-muted-foreground"><Logout size={20} /><span>Log out</span></button>
        </nav>

        {toast && (
          <div role="status" className="fixed bottom-20 left-1/2 z-50 flex -translate-x-1/2 items-center gap-4 rounded-lg border border-border bg-popover px-4 py-3 text-sm shadow-2xl md:bottom-6">
            <span>{toast.text}</span>
            {toast.undo && <button className="font-medium text-primary underline-offset-4 hover:underline" onClick={() => { toast.undo(); notify(null) }}>Undo</button>}
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}
