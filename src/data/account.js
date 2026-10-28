// The demo client's account. Sample data: every total on screen is computed from these rows.
import { byId } from './market.js'

export const CLIENT = {
  id: 'GT-104882', name: 'Sofia Brandt', email: 'sofia.brandt@example.com', country: 'Germany',
  joined: '2026-09-01', verified: '2026-09-02', currency: 'USD', leverage: '1:30',
}

// Profit in USD for a position on this instrument. Quote currency USD: price move times units.
// USD/JPY is quoted in yen, so the yen result is converted at the closing price.
export function pnl(id, side, lots, open, close) {
  const ins = byId[id]
  const units = lots * ins.lot
  const move = (close - open) * (side === 'Buy' ? 1 : -1)
  const raw = move * units
  return id === 'USDJPY' ? raw / close : raw
}

const CLOSED_RAW = [
  ['T-50211', '2026-09-03 09:14', '2026-09-03 15:40', 'EURUSD', 'Buy', 0.5, 1.07912, 1.08240],
  ['T-50347', '2026-09-08 13:02', '2026-09-09 10:11', 'XAUUSD', 'Buy', 0.2, 3871.6, 3893.15],
  ['T-50398', '2026-09-12 07:45', '2026-09-12 12:30', 'GBPUSD', 'Sell', 0.5, 1.27840, 1.28102],
  ['T-50460', '2026-09-22 14:20', '2026-09-24 16:05', 'BTCUSD', 'Buy', 0.05, 66210.0, 67894.5],
  ['T-50533', '2026-10-01 08:30', '2026-10-01 17:55', 'USDJPY', 'Sell', 0.4, 152.410, 151.874],
  ['T-50601', '2026-10-09 15:12', '2026-10-10 09:40', 'XAUUSD', 'Sell', 0.1, 3941.2, 3958.7],
  ['T-50688', '2026-10-15 10:05', '2026-10-15 14:48', 'EURUSD', 'Sell', 1.0, 1.08930, 1.08611],
  ['T-50742', '2026-10-21 13:31', '2026-10-22 11:02', 'ETHUSD', 'Buy', 0.8, 2468.4, 2402.1],
]
export const CLOSED = CLOSED_RAW.map(([id, opened, closed, ins, side, lots, open, close]) => ({
  id, opened, closed, ins, side, lots, open, close, pnl: Math.round(pnl(ins, side, lots, open, close) * 100) / 100,
}))

export const OPEN = [
  { id: 'T-50790', opened: '2026-10-27 08:12', ins: 'XAUUSD', side: 'Buy', lots: 0.05, open: 3961.2, stop: 3930.0, target: 4020.0 },
  { id: 'T-50806', opened: '2026-10-27 14:47', ins: 'EURUSD', side: 'Sell', lots: 0.1, open: 1.08610, stop: 1.09100, target: 1.07900 },
]

export const FUNDS = [
  { id: 'D-2210', date: '2026-09-02', kind: 'Deposit', method: 'Card ending 4417', amount: 2000, status: 'Completed' },
  { id: 'D-2381', date: '2026-09-19', kind: 'Deposit', method: 'Bank transfer, Sparkasse ending 0932', amount: 1500, status: 'Completed' },
  { id: 'W-0712', date: '2026-10-06', kind: 'Withdrawal', method: 'Bank transfer, Sparkasse ending 0932', amount: 600, status: 'Completed' },
  { id: 'W-0788', date: '2026-10-27', kind: 'Withdrawal', method: 'Bank transfer, Sparkasse ending 0932', amount: 400, status: 'In review' },
]

// Balance = completed money in minus completed money out plus closed profit.
export function balances(funds, closed = CLOSED) {
  const done = funds.filter((f) => f.status === 'Completed')
  const dep = done.filter((f) => f.kind === 'Deposit').reduce((a, f) => a + f.amount, 0)
  const wd = done.filter((f) => f.kind === 'Withdrawal').reduce((a, f) => a + f.amount, 0)
  const realised = Math.round(closed.reduce((a, t) => a + t.pnl, 0) * 100) / 100
  const held = funds.filter((f) => f.kind === 'Withdrawal' && f.status === 'In review').reduce((a, f) => a + f.amount, 0)
  return { dep, wd, realised, held, balance: Math.round((dep - wd + realised) * 100) / 100 }
}
// Margin at 1:30 leverage, in USD, at the given price.
export function margin(pos, price) {
  const ins = byId[pos.ins]
  const notional = pos.ins === 'USDJPY' ? pos.lots * ins.lot : pos.lots * ins.lot * price
  return Math.round((notional / 30) * 100) / 100
}
const sum = CLOSED.reduce((a, t) => a + t.pnl, 0)
console.assert(Math.abs(balances(FUNDS).realised - Math.round(sum * 100) / 100) < 0.001, 'realised profit adds up')
