import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

// shadcn/ui Badge with status tones: a pale tint and the same hue as text.
const badge = cva('inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium whitespace-nowrap ring-1 ring-inset', {
  variants: {
    tone: {
      neutral: 'bg-white/5 text-muted-foreground ring-white/10',
      ok: 'bg-positive/10 text-positive ring-positive/20',
      wait: 'bg-warning/10 text-warning ring-warning/20',
      bad: 'bg-destructive/10 text-destructive ring-destructive/20',
      gold: 'bg-primary/10 text-primary ring-primary/25',
    },
  },
  defaultVariants: { tone: 'neutral' },
})
export function Badge({ className, tone, dot, children, ...p }) {
  return <span className={cn(badge({ tone }), className)} {...p}>{dot && <span className="size-1.5 rounded-full bg-current" />}{children}</span>
}
