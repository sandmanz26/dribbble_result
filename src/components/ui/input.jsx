import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

// shadcn/ui Input and Textarea.
const base = 'w-full rounded-md border border-input bg-white/[0.03] px-3 text-sm text-foreground placeholder:text-muted-foreground/70 transition-colors focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 disabled:opacity-50 aria-[invalid=true]:border-destructive/70'
export const Input = forwardRef(({ className, ...p }, ref) => <input ref={ref} className={cn(base, 'h-9', className)} {...p} />)
export const Textarea = forwardRef(({ className, ...p }, ref) => <textarea ref={ref} className={cn(base, 'min-h-24 py-2 resize-y', className)} {...p} />)
export const Label = ({ className, ...p }) => <label className={cn('grid gap-1.5 text-xs text-muted-foreground', className)} {...p} />
