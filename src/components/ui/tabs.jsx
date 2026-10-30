import * as T from '@radix-ui/react-tabs'
import { cn } from '../../lib/utils.js'

// Underline tabs on a full-width 1px rule; the active tab gets the 1px amber line as wide as its label.
export const Tabs = T.Root
export const TabsList = ({ className, ...p }) => <T.List className={cn('flex gap-6 border-b border-line overflow-x-auto', className)} {...p} />
export const TabsTrigger = ({ className, ...p }) => <T.Trigger className={cn('sel-under h-9 text-[13px] font-semibold text-muted data-[state=active]:text-ink hover:text-ink whitespace-nowrap', className)} {...p} />
export const TabsContent = ({ className, ...p }) => <T.Content className={cn('pt-5 outline-none', className)} {...p} />
