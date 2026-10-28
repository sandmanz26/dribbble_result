import { useId } from 'react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Warning } from '@carbon/icons-react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { fmt } from '../data/market.js'

const hm = (t) => new Date(t).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })

// The page's title, its one finding, and room for actions on the right.
export function PageHeader({ title, finding, children }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="grid gap-1.5">
        <h1 className="font-display text-[28px] font-light leading-tight tracking-[-0.03em]">{title}</h1>
        {finding && <p className="max-w-[70ch] text-[13.5px] text-muted-foreground">{finding}</p>}
      </div>
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </div>
  )
}

// A figure with its label, the one line that explains it, and its recent path as a sparkline.
export function Kpi({ label, value, sub, spark, tone = 'gold', icon: Icon, className }) {
  const gid = useId().replace(/:/g, '')
  const col = tone === 'neg' ? '#f0716b' : tone === 'pos' ? '#4fd1a1' : '#d4ae62'
  return (
    <Card className={cn('overflow-hidden p-5', className)}>
      <div className="flex items-center justify-between gap-2 text-[12.5px] text-muted-foreground">
        <span>{label}</span>
        {Icon && <span className="grid size-7 place-items-center rounded-md bg-white/[0.04] ring-1 ring-inset ring-white/5"><Icon size={14} /></span>}
      </div>
      <p className="mt-3 font-display text-[28px] font-light leading-none tracking-[-0.03em] tabular-nums">{value}</p>
      <div className="mt-3 flex items-end justify-between gap-3">
        <p className="text-[12px] text-muted-foreground tabular-nums">{sub}</p>
        {spark && spark.length > 1 && (
          <div className="h-9 w-24 shrink-0" aria-hidden="true">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={spark.map((v, i) => ({ i, v }))} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
                <defs><linearGradient id={gid} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={col} stopOpacity={0.35} /><stop offset="100%" stopColor={col} stopOpacity={0} /></linearGradient></defs>
                <YAxis hide domain={['dataMin', 'dataMax']} />
                <Area type="monotone" dataKey="v" stroke={col} strokeWidth={1.5} fill={`url(#${gid})`} isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </Card>
  )
}

// A live price chart: gold line over a soft fill, price scale on the right, a crosshair readout.
export function PriceArea({ id, data, height = 300 }) {
  const gid = useId().replace(/:/g, '')
  const rows = data.map((d) => ({ t: d.t, p: d.p }))
  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={rows} margin={{ top: 10, right: 4, bottom: 0, left: 0 }}>
          <defs><linearGradient id={gid} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#d4ae62" stopOpacity={0.28} /><stop offset="100%" stopColor="#d4ae62" stopOpacity={0} /></linearGradient></defs>
          <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis dataKey="t" tickFormatter={hm} tick={{ fill: '#8b909a', fontSize: 11 }} axisLine={false} tickLine={false} minTickGap={60} />
          <YAxis orientation="right" domain={['auto', 'auto']} tickFormatter={(v) => fmt(id, v)} tick={{ fill: '#8b909a', fontSize: 11 }} axisLine={false} tickLine={false} width={72} />
          <Tooltip cursor={{ stroke: 'rgba(255,255,255,0.25)', strokeDasharray: '3 3' }} content={({ active, payload }) => active && payload?.length ? (
            <div className="rounded-md border border-border bg-popover px-2.5 py-1.5 text-xs shadow-xl"><p className="font-medium tabular-nums">{fmt(id, payload[0].payload.p)}</p><p className="text-muted-foreground">{hm(payload[0].payload.t)} UTC</p></div>
          ) : null} />
          <Area type="monotone" dataKey="p" stroke="#d4ae62" strokeWidth={1.75} fill={`url(#${gid})`} isAnimationActive={false} activeDot={{ r: 4, fill: '#d4ae62', stroke: '#08090b', strokeWidth: 2 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export function Notice({ children, tone = 'wait' }) {
  return <p className={cn('flex items-start gap-2.5 rounded-lg px-3.5 py-3 text-[13px] ring-1 ring-inset', tone === 'wait' ? 'bg-warning/[0.07] text-warning ring-warning/20' : 'bg-white/[0.03] text-muted-foreground ring-white/10')}><Warning size={16} className="mt-0.5 shrink-0" />{children}</p>
}
export const Empty = ({ children }) => <p className="px-5 py-8 text-center text-[13px] text-muted-foreground">{children}</p>
