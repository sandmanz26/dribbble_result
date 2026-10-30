import * as D from '@radix-ui/react-dialog'
import { Close } from 'pixelarticons/react'
import { cn } from '../../lib/utils.js'

export const Dialog = D.Root
export const DialogTrigger = D.Trigger
export function DialogContent({ className, title, description, children, ...p }) {
  return (
    <D.Portal>
      <D.Overlay className="fixed inset-0 z-40 bg-black/60" />
      <D.Content className={cn('fixed left-1/2 top-1/2 z-50 w-[min(520px,calc(100vw-32px))] -translate-x-1/2 -translate-y-1/2 rounded-[6px] border border-line bg-surface p-6 shadow-[0_12px_28px_rgba(0,0,0,.45)]', className)} {...p}>
        <div className="mb-4 flex items-start justify-between gap-4">
          <div><D.Title className="text-base font-semibold">{title}</D.Title>{description && <D.Description className="mt-1 text-[13px] text-muted">{description}</D.Description>}</div>
          <D.Close aria-label="Close" className="rounded-full p-1 text-muted hover:bg-raised hover:text-ink"><Close width={16} height={16} /></D.Close>
        </div>
        {children}
      </D.Content>
    </D.Portal>
  )
}
export const DialogClose = D.Close
