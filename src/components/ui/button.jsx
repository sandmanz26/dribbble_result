import { forwardRef } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'
import { cn } from '../../lib/utils.js'

// shadcn/ui Button, restyled: pill controls, 34px tall, the amber fill kept for the one primary action.
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-[13px] font-semibold transition-colors disabled:pointer-events-none disabled:opacity-40 [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary: 'bg-amber text-amber-ink hover:bg-[#f5c070]',
        secondary: 'bg-control text-ink hover:bg-[#44444b]',
        outline: 'border border-control text-ink hover:bg-raised',
        ghost: 'text-muted hover:bg-raised hover:text-ink',
        danger: 'bg-bad text-white hover:bg-[#ec6f84]',
      },
      size: { default: 'h-[34px] px-4', sm: 'h-7 px-3 text-xs', lg: 'h-11 px-6 text-sm', icon: 'size-[34px]' },
    },
    defaultVariants: { variant: 'secondary', size: 'default' },
  },
)

export const Button = forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button'
  return <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
})
Button.displayName = 'Button'
