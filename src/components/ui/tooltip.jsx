import * as T from '@radix-ui/react-tooltip'

export const TooltipProvider = T.Provider
export function Tip({ label, side = 'right', children }) {
  return (
    <T.Root delayDuration={200}>
      <T.Trigger asChild>{children}</T.Trigger>
      <T.Portal><T.Content side={side} sideOffset={8} className="z-50 rounded-[4px] border border-line bg-raised px-2 py-1 text-xs text-ink shadow-[0_8px_20px_rgba(0,0,0,.4)]">{label}</T.Content></T.Portal>
    </T.Root>
  )
}
