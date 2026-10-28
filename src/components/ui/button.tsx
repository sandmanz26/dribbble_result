import { forwardRef } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

// shadcn's Button, plus a `pending` state: the label stays, a spinner replaces the icon and the
// button keeps its width, so an optimistic action never makes the layout jump.
const button = cva(
  'inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-control text-[13.5px] font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary: 'bg-ink text-white hover:bg-[#2a302f]',
        secondary: 'bg-sheet text-ink border border-control hover:bg-raised',
        ghost: 'text-ink hover:bg-raised',
        danger: 'bg-sheet text-negative border border-control hover:bg-neg-bg',
        link: 'text-accent underline-offset-4 hover:underline px-0 h-auto',
      },
      size: { sm: 'h-7 px-2.5 text-[13px]', md: 'h-8 px-3', lg: 'h-9 px-4' },
    },
    defaultVariants: { variant: 'secondary', size: 'md' },
  },
)

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof button> & { asChild?: boolean; pending?: boolean }

export const Button = forwardRef<HTMLButtonElement, Props>(({ className, variant, size, asChild, pending, children, disabled, ...rest }, ref) => {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp ref={ref} className={cn(button({ variant, size }), className)} disabled={disabled || pending} aria-busy={pending || undefined} {...rest}>
      {pending ? <><span className="size-3.5 rounded-full border-2 border-current border-r-transparent fd-spin" aria-hidden="true" />{children}</> : children}
    </Comp>
  )
})
Button.displayName = 'Button'
