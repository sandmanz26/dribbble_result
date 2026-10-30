import * as S from '@radix-ui/react-switch'
import { cn } from '../../lib/utils.js'

export function Switch({ className, ...p }) {
  return (
    <S.Root className={cn('relative h-5 w-9 shrink-0 rounded-full bg-control transition-colors data-[state=checked]:bg-ink', className)} {...p}>
      <S.Thumb className="block size-4 translate-x-0.5 rounded-full bg-ink transition-transform data-[state=checked]:translate-x-[18px] data-[state=checked]:bg-ground" />
    </S.Root>
  )
}
