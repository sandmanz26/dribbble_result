import { cn } from '@/lib/utils'

// shadcn/ui Card. The top edge carries a faint light so panels read as glass over the grid.
export const Card = ({ className, ...p }) => <div className={cn('card-edge rounded-xl border border-border bg-card/80 backdrop-blur-sm', className)} {...p} />
export const CardHeader = ({ className, ...p }) => <div className={cn('flex items-start justify-between gap-3 px-5 pt-5', className)} {...p} />
export const CardTitle = ({ className, as: T = 'h2', ...p }) => <T className={cn('text-[15px] font-medium leading-tight tracking-tight', className)} {...p} />
export const CardDescription = ({ className, ...p }) => <p className={cn('text-[13px] text-muted-foreground', className)} {...p} />
export const CardContent = ({ className, ...p }) => <div className={cn('px-5 pb-5 pt-4', className)} {...p} />
