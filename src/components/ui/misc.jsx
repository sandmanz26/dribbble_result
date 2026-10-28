import * as Av from '@radix-ui/react-avatar'
import * as Pr from '@radix-ui/react-progress'
import * as Tt from '@radix-ui/react-tooltip'
import * as Dm from '@radix-ui/react-dropdown-menu'
import { cn } from '@/lib/utils'

// shadcn/ui Avatar, Progress, Tooltip and DropdownMenu.
export function Avatar({ name, className }) {
  const init = name.split(' ').map((w) => w[0]).slice(0, 2).join('')
  return <Av.Root className={cn('inline-flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary/40 to-primary/5 text-[11px] font-medium text-primary ring-1 ring-primary/30', className)}><Av.Fallback>{init}</Av.Fallback></Av.Root>
}
export function Progress({ value, className, tone = 'bg-primary' }) {
  return <Pr.Root value={value} className={cn('relative h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]', className)}><Pr.Indicator className={cn('h-full rounded-full transition-transform duration-500', tone)} style={{ transform: `translateX(-${100 - Math.min(100, value)}%)` }} /></Pr.Root>
}
export const TooltipProvider = Tt.Provider
export function Tip({ label, children, side = 'right' }) {
  return (
    <Tt.Root delayDuration={150}>
      <Tt.Trigger asChild>{children}</Tt.Trigger>
      <Tt.Portal><Tt.Content side={side} sideOffset={8} className="dash z-50 rounded-md border border-border bg-popover px-2 py-1 text-xs">{label}</Tt.Content></Tt.Portal>
    </Tt.Root>
  )
}
export const DropdownMenu = Dm.Root
export const DropdownMenuTrigger = Dm.Trigger
export function DropdownMenuContent({ className, ...p }) {
  return <Dm.Portal><Dm.Content sideOffset={8} align="end" className={cn('dash z-50 min-w-48 rounded-lg border border-border bg-popover p-1 shadow-2xl', className)} {...p} /></Dm.Portal>
}
export const DropdownMenuItem = ({ className, ...p }) => <Dm.Item className={cn('flex h-8 cursor-pointer select-none items-center gap-2 rounded-md px-2 text-sm outline-none data-[highlighted]:bg-white/[0.06]', className)} {...p} />
export const DropdownMenuLabel = ({ className, ...p }) => <Dm.Label className={cn('px-2 py-1.5 text-xs text-muted-foreground', className)} {...p} />
export const DropdownMenuSeparator = () => <Dm.Separator className="my-1 h-px bg-border" />
