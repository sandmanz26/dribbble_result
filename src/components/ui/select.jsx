import * as S from '@radix-ui/react-select'
import { Checkmark, ChevronDown } from '@carbon/icons-react'
import { cn } from '@/lib/utils'

// shadcn/ui Select on Radix: a real listbox with keyboard support, styled for the dark theme.
export function Select({ value, onValueChange, options, label, className }) {
  return (
    <S.Root value={value} onValueChange={onValueChange}>
      <S.Trigger aria-label={label} className={cn('flex h-9 w-full items-center justify-between gap-2 rounded-md border border-input bg-white/[0.03] px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20', className)}>
        <S.Value />
        <S.Icon><ChevronDown size={16} className="text-muted-foreground" /></S.Icon>
      </S.Trigger>
      <S.Portal>
        <S.Content position="popper" sideOffset={6} className="dash z-50 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-lg border border-border bg-popover p-1 shadow-2xl">
          <S.Viewport>
            {options.map((o) => (
              <S.Item key={o} value={o} className="relative flex h-8 cursor-pointer select-none items-center rounded-md pl-7 pr-3 text-sm outline-none data-[highlighted]:bg-white/[0.06]">
                <S.ItemIndicator className="absolute left-2"><Checkmark size={14} className="text-primary" /></S.ItemIndicator>
                <S.ItemText>{o}</S.ItemText>
              </S.Item>
            ))}
          </S.Viewport>
        </S.Content>
      </S.Portal>
    </S.Root>
  )
}
