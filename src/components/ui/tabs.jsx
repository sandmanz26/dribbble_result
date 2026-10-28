import * as T from '@radix-ui/react-tabs'
import { cn } from '@/lib/utils'

// shadcn/ui Tabs: a segmented track, the active tab lifted.
export const Tabs = T.Root
export const TabsList = ({ className, ...p }) => <T.List className={cn('inline-flex h-9 items-center gap-1 rounded-lg bg-white/[0.04] p-1 ring-1 ring-inset ring-white/5', className)} {...p} />
export const TabsTrigger = ({ className, ...p }) => <T.Trigger className={cn('inline-flex h-7 items-center gap-1.5 rounded-md px-3 text-[13px] text-muted-foreground transition-all hover:text-foreground data-[state=active]:bg-white/10 data-[state=active]:text-foreground data-[state=active]:shadow-sm', className)} {...p} />
export const TabsContent = T.Content
