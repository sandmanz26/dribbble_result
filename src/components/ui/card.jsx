import { cn } from '../../lib/utils.js'

// Cards sit darker than the ground; the title is 16/600, the section label 20/400 in grey belongs outside.
export function Card({ className, ...p }) { return <section className={cn('rounded-card bg-surface p-5', className)} {...p} /> }
export function CardHead({ title, children, className, id }) {
  return <div className={cn('mb-4 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1', className)}><h2 id={id} className="shrink-0 text-[15px] font-semibold">{title}</h2>{children}</div>
}
