import { forwardRef } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

// shadcn/ui Button, in GlobalTrade's dark theme: gold is the one primary action.
export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-150 disabled:pointer-events-none disabled:opacity-40 active:translate-y-px [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:brightness-110 shadow-[0_0_0_1px_rgb(255_255_255/0.15)_inset,0_8px_24px_-8px_rgb(212_174_98/0.6)]',
        secondary: 'bg-secondary text-foreground border border-border hover:bg-accent',
        outline: 'border border-input bg-transparent hover:bg-accent',
        ghost: 'hover:bg-accent text-muted-foreground hover:text-foreground',
        destructive: 'bg-destructive/15 text-destructive hover:bg-destructive/25',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: { default: 'h-9 px-4', sm: 'h-8 px-3 text-xs', lg: 'h-10 px-6', icon: 'size-9' },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
)

export const Button = forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button'
  return <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
})
