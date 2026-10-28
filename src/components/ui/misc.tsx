import * as TooltipP from '@radix-ui/react-tooltip'
import * as TabsP from '@radix-ui/react-tabs'
import * as SwitchP from '@radix-ui/react-switch'
import { cn } from '@/lib/utils'

export const TooltipProvider = TooltipP.Provider
export function Tip({ label, children, side = 'top' }: { label: React.ReactNode; children: React.ReactNode; side?: 'top' | 'right' | 'bottom' | 'left' }) {
  return (
    <TooltipP.Root delayDuration={250}>
      <TooltipP.Trigger asChild>{children}</TooltipP.Trigger>
      <TooltipP.Portal>
        <TooltipP.Content side={side} sideOffset={6} className="z-50 max-w-64 rounded-control bg-ink px-2 py-1 text-[12.5px] text-white fd-in">{label}</TooltipP.Content>
      </TooltipP.Portal>
    </TooltipP.Root>
  )
}

export const Tabs = TabsP.Root
export function TabList({ className, ...p }: TabsP.TabsListProps) {
  return <TabsP.List className={cn('flex gap-5 border-b border-edge', className)} {...p} />
}
export function Tab({ className, ...p }: TabsP.TabsTriggerProps) {
  return <TabsP.Trigger className={cn('relative -mb-px flex h-9 items-center gap-1.5 border-b-2 border-transparent text-[13.5px] text-muted hover:text-ink data-[state=active]:border-ink data-[state=active]:font-semibold data-[state=active]:text-ink', className)} {...p} />
}
export const TabPanel = TabsP.Content

export function Switch(p: SwitchP.SwitchProps) {
  return (
    <SwitchP.Root className="relative h-4 w-7 shrink-0 rounded-full bg-control transition-colors data-[state=checked]:bg-accent" {...p}>
      <SwitchP.Thumb className="block size-3 translate-x-0.5 rounded-full bg-white transition-transform data-[state=checked]:translate-x-[13px]" />
    </SwitchP.Root>
  )
}

export function Kbd({ children }: { children: React.ReactNode }) {
  return <kbd className="inline-grid h-[18px] min-w-[18px] place-items-center rounded-[4px] border border-edge bg-sheet px-1 font-mono text-[11px] text-muted">{children}</kbd>
}

export function Pill({ tone = 'neu', children, className }: { tone?: 'pos' | 'neg' | 'warn' | 'neu' | 'info'; children: React.ReactNode; className?: string }) {
  const t = { pos: 'bg-pos-bg text-pos-ink', neg: 'bg-neg-bg text-neg-ink', warn: 'bg-warn-bg text-warn-ink', neu: 'bg-neu-bg text-neu-ink', info: 'bg-info-bg text-info-ink' }[tone]
  return <span className={cn('inline-flex h-5 items-center gap-1 rounded-full px-2 text-[12px] font-medium whitespace-nowrap', t, className)}>{children}</span>
}

export function Skel({ className }: { className?: string }) {
  return <span className={cn('block fd-skel', className)} aria-hidden="true" />
}
