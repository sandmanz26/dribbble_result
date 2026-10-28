import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { ExclamationTriangleIcon, ReloadIcon } from '@radix-ui/react-icons'
import { Button } from './ui/button'

// Review links can force a screen's state: ?state=loading | empty | error. Otherwise a screen shows
// a short real loading state on first open, like the first fetch would.
export function useScreenState(ms = 450): 'loading' | 'empty' | 'error' | 'ready' {
  const q = new URLSearchParams(useLocation().search).get('state')
  const [ready, setReady] = useState(false)
  useEffect(() => { const t = setTimeout(() => setReady(true), ms); return () => clearTimeout(t) }, [ms])
  if (q === 'loading' || q === 'empty' || q === 'error') return q
  return ready ? 'ready' : 'loading'
}

export function PageHead({ title, sub, children }: { title: string; sub?: React.ReactNode; children?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div className="grid gap-1">
        <h1 className="text-[22px] font-semibold leading-tight tracking-[-0.01em]">{title}</h1>
        {sub && <p className="text-[13.5px] text-muted">{sub}</p>}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  )
}

export function ErrorBlock({ what, onRetry }: { what: string; onRetry?: () => void }) {
  return (
    <div className="grid justify-items-start gap-3 rounded-card bg-neg-bg p-4 text-neg-ink" role="alert">
      <p className="flex items-center gap-2 font-semibold"><ExclamationTriangleIcon />Couldn&apos;t load {what}</p>
      <p className="text-[13.5px]">The server did not answer (request timed out after 10 s). Nothing you did was lost; actions you took are saved and will send when the connection is back.</p>
      <Button size="sm" onClick={onRetry ?? (() => window.location.replace(window.location.href.replace(/[?&]state=error/, '')))}><ReloadIcon />Try again</Button>
    </div>
  )
}

export function Empty({ title, children, action }: { title: string; children?: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="grid justify-items-center gap-2 px-6 py-14 text-center">
      <p className="text-[15px] font-semibold">{title}</p>
      {children && <p className="max-w-[44ch] text-[13.5px] text-muted">{children}</p>}
      {action}
    </div>
  )
}
