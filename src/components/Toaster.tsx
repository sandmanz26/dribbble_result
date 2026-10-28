import { useEffect, useState } from 'react'
import { Cross2Icon } from '@radix-ui/react-icons'
import { UNDO_MS, useStore } from '@/store'

// Results of actions, bottom right. Reversible actions carry Undo with a visible countdown.
export function Toaster() {
  const { toasts, undo, dismiss } = useStore()
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 grid w-[min(380px,calc(100vw-32px))] gap-2" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto flex items-start gap-3 rounded-card bg-ink p-3 text-[13.5px] text-white fd-in">
          <span className={t.tone === 'err' ? 'mt-1 size-2 shrink-0 rounded-full bg-[#ff8a80]' : 'mt-1 size-2 shrink-0 rounded-full bg-[#7fd1a6]'} aria-hidden="true" />
          <p className="min-w-0 flex-1">{t.text}</p>
          {t.undoTaskId && <UndoButton onUndo={() => undo(t.undoTaskId!)} />}
          <button className="text-white/60 hover:text-white" onClick={() => dismiss(t.id)} aria-label="Dismiss"><Cross2Icon /></button>
        </div>
      ))}
    </div>
  )
}

function UndoButton({ onUndo }: { onUndo: () => void }) {
  const [left, setLeft] = useState(UNDO_MS / 1000)
  useEffect(() => { const t = setInterval(() => setLeft((l) => Math.max(0, l - 1)), 1000); return () => clearInterval(t) }, [])
  return <button className="tnum shrink-0 rounded-control bg-white/15 px-2 py-0.5 text-[12.5px] font-semibold hover:bg-white/25" onClick={onUndo}>Undo {left}s</button>
}
