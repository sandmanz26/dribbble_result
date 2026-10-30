import * as S from '@radix-ui/react-slider'
import { cn } from '../../lib/utils.js'

export function Slider({ className, label, ...p }) {
  return (
    <S.Root className={cn('relative flex h-6 w-full touch-none items-center', className)} {...p}>
      <S.Track className="relative h-px grow bg-control"><S.Range className="absolute h-px bg-amber" /></S.Track>
      <S.Thumb aria-label={label} className="block size-4 rounded-full border border-amber bg-ground" />
    </S.Root>
  )
}
