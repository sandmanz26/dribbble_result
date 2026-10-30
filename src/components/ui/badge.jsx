import { cva } from 'class-variance-authority'
import { cn } from '../../lib/utils.js'

const badgeVariants = cva('inline-flex items-center gap-1 rounded-full px-2 h-5 text-[11.5px] font-semibold whitespace-nowrap', {
  variants: {
    tone: {
      neutral: 'bg-raised text-[#bdbdc0]',
      good: 'bg-[#1b2828] text-[#5fc39c]',
      bad: 'bg-[#2c1a20] text-bad',
      warn: 'bg-[#2a2416] text-warn',
      amber: 'bg-amber text-amber-ink',
    },
  },
  defaultVariants: { tone: 'neutral' },
})

export function Badge({ className, tone, ...props }) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />
}
