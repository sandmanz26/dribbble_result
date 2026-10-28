import { cn } from '@/lib/utils'

// shadcn/ui Table.
export const Table = ({ className, ...p }) => <div className="relative w-full overflow-x-auto"><table className={cn('w-full caption-bottom text-sm', className)} {...p} /></div>
export const TableHeader = ({ className, ...p }) => <thead className={cn('[&_tr]:border-b', className)} {...p} />
export const TableBody = ({ className, ...p }) => <tbody className={cn('[&_tr:last-child]:border-0', className)} {...p} />
export const TableFooter = ({ className, ...p }) => <tfoot className={cn('border-t bg-white/[0.02] font-medium', className)} {...p} />
export const TableRow = ({ className, ...p }) => <tr className={cn('border-b transition-colors hover:bg-white/[0.025] data-[state=selected]:bg-accent', className)} {...p} />
export const TableHead = ({ className, ...p }) => <th className={cn('h-9 px-3 text-left align-middle text-xs font-normal text-muted-foreground whitespace-nowrap first:pl-5 last:pr-5', className)} {...p} />
export const TableCell = ({ className, ...p }) => <td className={cn('px-3 py-2.5 align-middle whitespace-nowrap tabular-nums first:pl-5 last:pr-5', className)} {...p} />
