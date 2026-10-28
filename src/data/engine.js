// The join. Two files come in (a planogram and an inventory count), their columns are matched to
// the fields below, rows are cleaned, joined on SKU and turned into a walk in route order.
// Everything runs in the browser; nothing is uploaded anywhere.
import Papa from 'papaparse'

export const FIELDS = {
  plano: [
    { id: 'sku', label: 'SKU', need: true, alias: ['sku', 'item', 'item #', 'item no', 'article', 'product code', 'code'] },
    { id: 'name', label: 'Description', need: false, alias: ['description', 'item description', 'name', 'product', 'product name'] },
    { id: 'aisle', label: 'Aisle', need: true, alias: ['aisle', 'aisle no', 'gondola'] },
    { id: 'bay', label: 'Bay', need: true, alias: ['bay', 'section', 'segment', 'module'] },
    { id: 'shelf', label: 'Shelf', need: true, alias: ['shelf', 'level', 'shelf no'] },
    { id: 'pos', label: 'Position', need: false, alias: ['pos', 'position', 'slot', 'sequence'] },
    { id: 'facings', label: 'Facings', need: true, alias: ['facings', 'faces', 'facing', 'front'] },
    { id: 'depth', label: 'Units deep', need: false, alias: ['depth', 'deep', 'units deep', 'capacity per facing'] },
    { id: 'fixture', label: 'Fixture', need: false, alias: ['fixture', 'fixture type', 'type'] },
  ],
  inv: [
    { id: 'sku', label: 'SKU', need: true, alias: ['sku', 'item', 'item #', 'item no', 'article', 'product code', 'code'] },
    { id: 'name', label: 'Description', need: false, alias: ['description', 'item description', 'name', 'product'] },
    { id: 'floor', label: 'On the floor', need: true, alias: ['floor', 'floor qty', 'shelf qty', 'on shelf', 'sales floor', 'store qty'] },
    { id: 'back', label: 'In the backroom', need: true, alias: ['backroom', 'backroom qty', 'back', 'warehouse', 'warehouse qty', 'stockroom', 'reserve'] },
    { id: 'counted', label: 'Counted at', need: false, alias: ['last count', 'counted', 'count date', 'date'] },
  ],
}

const norm = (s) => String(s ?? '').trim().toLowerCase().replace(/[_\-.]+/g, ' ').replace(/\s+/g, ' ')

// Match each field to a column by name: exact alias first, then a column that contains the alias.
export function autoMap(headers, kind) {
  const h = headers.map(norm)
  const used = new Set()
  const map = {}
  for (const f of FIELDS[kind]) {
    let i = h.findIndex((x, k) => !used.has(k) && f.alias.includes(x))
    if (i < 0) i = h.findIndex((x, k) => !used.has(k) && f.alias.some((a) => a.length > 3 && x.includes(a)))
    if (i >= 0) { map[f.id] = i; used.add(i) }
  }
  return map
}

// Read a CSV or Excel file into a header row and data rows of strings.
export async function readFile(file) {
  const name = file.name.toLowerCase()
  if (name.endsWith('.xlsx')) {
    // Loaded only when an Excel file arrives, so CSV-only use stays light.
    const { readSheet } = await import('read-excel-file/browser')
    const sheet = await readSheet(file)
    const rows = Array.isArray(sheet) ? sheet : sheet.data || sheet.rows || []
    return clean(rows.map((r) => r.map((c) => (c == null ? '' : c instanceof Date ? c.toISOString().slice(0, 16).replace('T', ' ') : String(c)))), file.name)
  }
  if (name.endsWith('.csv') || name.endsWith('.txt') || file.type === 'text/csv') {
    const text = await file.text()
    return readText(text, file.name)
  }
  throw new Error(`${file.name} is not a CSV or Excel (.xlsx) file.`)
}
export function readText(text, fileName) {
  const out = Papa.parse(text.replace(/^﻿/, ''), { skipEmptyLines: 'greedy' })
  if (out.errors.length && !out.data.length) throw new Error(`Could not read ${fileName}: ${out.errors[0].message}`)
  return clean(out.data, fileName)
}
function clean(rows, fileName) {
  const filled = rows.filter((r) => r.some((c) => String(c).trim() !== ''))
  if (filled.length < 2) throw new Error(`${fileName} has no data rows under its header.`)
  return { fileName, headers: filled[0].map((c) => String(c).trim()), rows: filled.slice(1) }
}

const num = (v) => {
  const n = Number(String(v).replace(/,/g, '').trim())
  return Number.isFinite(n) ? n : NaN
}
const aisleKey = (a) => {
  const s = String(a).trim().toUpperCase()
  if (/^E\d+$/.test(s)) return { kind: 'end', n: Number(s.slice(1)), label: `Endcap ${s.slice(1)}`, code: s }
  const n = Number(s)
  return Number.isFinite(n) ? { kind: 'aisle', n, label: `Aisle ${n}`, code: String(n) } : { kind: 'other', n: 999, label: `Area ${s}`, code: s }
}

// Join the two files. Returns the stops in walking order, one item per SKU, and every problem found.
export function build(plano, inv, maps) {
  const P = maps.plano
  const I = maps.inv
  const issues = { missing: [], extra: [], multi: [], trimmed: [], badRows: [], dupCount: [] }

  // Inventory: one record per SKU. A SKU counted twice is summed and reported.
  const stock = new Map()
  inv.rows.forEach((r, k) => {
    const raw = String(r[I.sku] ?? '')
    const sku = raw.trim()
    if (!sku) { issues.badRows.push({ file: 'inventory', row: k + 2, why: 'No SKU' }); return }
    if (raw !== sku) issues.trimmed.push({ sku, file: 'inventory', row: k + 2 })
    const floor = num(r[I.floor])
    const back = num(r[I.back])
    if (Number.isNaN(floor) || Number.isNaN(back)) { issues.badRows.push({ file: 'inventory', row: k + 2, why: `Count is not a number for ${sku}` }); return }
    const prev = stock.get(sku)
    if (prev) { issues.dupCount.push({ sku, row: k + 2 }); prev.floor += floor; prev.back += back; return }
    stock.set(sku, { sku, name: I.name != null ? String(r[I.name]).trim() : '', floor, back, counted: I.counted != null ? String(r[I.counted]) : '' })
  })

  // Planogram: one record per location.
  const locs = []
  plano.rows.forEach((r, k) => {
    const raw = String(r[P.sku] ?? '')
    const sku = raw.trim()
    if (!sku) { issues.badRows.push({ file: 'planogram', row: k + 2, why: 'No SKU' }); return }
    if (raw !== sku) issues.trimmed.push({ sku, file: 'planogram', row: k + 2 })
    const facings = num(r[P.facings])
    const depth = P.depth != null ? num(r[P.depth]) : 1
    if (!(facings > 0)) { issues.badRows.push({ file: 'planogram', row: k + 2, why: `Facings missing for ${sku}` }); return }
    const a = aisleKey(r[P.aisle])
    const bay = num(r[P.bay]) || 0
    const shelf = num(r[P.shelf]) || 0
    const pos = P.pos != null ? num(r[P.pos]) || 0 : 0
    locs.push({
      key: `${a.code}-${bay}-${shelf}-${pos}-${sku}`, sku, name: P.name != null ? String(r[P.name]).trim() : '',
      aisle: a, bay, shelf, pos, facings, depth: depth > 0 ? depth : 1, capacity: facings * (depth > 0 ? depth : 1),
      fixture: P.fixture != null ? String(r[P.fixture]).trim() : '',
    })
  })

  // Walking order: endcaps at the front first, then the aisles in a snake (odd aisles front to
  // back, even aisles back to front); within a bay, top shelf first, left to right.
  const ord = (l) => [l.aisle.kind === 'end' ? 0 : l.aisle.kind === 'aisle' ? 1 : 2, l.aisle.n, l.aisle.kind === 'aisle' && l.aisle.n % 2 === 0 ? -l.bay : l.bay, l.shelf, l.pos]
  locs.sort((x, y) => { const a = ord(x); const b = ord(y); for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return a[i] - b[i]; return 0 })

  // Group locations by SKU and split the counted floor stock across them by capacity, home shelf
  // (the aisle location) first, so a SKU with two homes shows what each place needs.
  const bySku = new Map()
  locs.forEach((l, i) => { l.step = i + 1; if (!bySku.has(l.sku)) bySku.set(l.sku, []); bySku.get(l.sku).push(l) })
  const items = []
  for (const [sku, ls] of bySku) {
    const st = stock.get(sku)
    const capacity = ls.reduce((a, l) => a + l.capacity, 0)
    if (ls.length > 1) issues.multi.push({ sku, name: ls[0].name, places: ls.map((l) => l.aisle.label).join(' and ') })
    if (!st) {
      issues.missing.push({ sku, name: ls[0].name, where: ls.map((l) => `${l.aisle.label}, bay ${l.bay}`).join('; ') })
      ls.forEach((l) => Object.assign(l, { floor: null, back: null, need: null, move: null, status: 'missing' }))
      items.push({ sku, name: ls[0].name, locs: ls, capacity, floor: null, back: null, need: null, move: null, status: 'missing' })
      continue
    }
    // Floor stock split: fill the home shelf first, the rest goes to the other places in order.
    const homeFirst = [...ls].sort((a, b) => (a.aisle.kind === 'aisle' ? 0 : 1) - (b.aisle.kind === 'aisle' ? 0 : 1))
    let left = st.floor
    homeFirst.forEach((l, k) => { const take = k === homeFirst.length - 1 ? left : Math.min(left, l.capacity); l.floor = take; left -= take })
    let back = st.back
    for (const l of ls) {
      l.need = Math.max(0, l.capacity - l.floor)
      l.move = Math.min(l.need, back)
      back -= l.move
      l.back = st.back
      l.status = status(l.floor, l.capacity, l.need, l.move)
    }
    const need = Math.max(0, capacity - st.floor)
    const move = Math.min(need, st.back)
    items.push({ sku, name: st.name || ls[0].name, locs: ls, capacity, floor: st.floor, back: st.back, need, move, status: status(st.floor, capacity, need, move), counted: st.counted })
  }
  for (const [sku, st] of stock) if (!bySku.has(sku)) issues.extra.push({ sku, name: st.name, floor: st.floor, back: st.back })

  return { stops: locs, items, issues, counts: { plano: plano.rows.length, inv: inv.rows.length, matched: items.filter((i) => i.status !== 'missing').length } }
}

// fill: the backroom covers the gap · partial: it covers part · reorder: gap, nothing in back
// out: nothing on the shelf and nothing in back · full: shelf at or over capacity
function status(floor, capacity, need, move) {
  if (floor >= capacity) return 'full'
  if (move >= need) return 'fill'
  if (move > 0) return 'partial'
  return floor === 0 ? 'out' : 'reorder'
}

export const STATUS = {
  fill: { label: 'Fill from back', short: 'Fill', order: 1 },
  partial: { label: 'Fill part, rest short', short: 'Part', order: 2 },
  out: { label: 'Empty, none in back', short: 'Out', order: 0 },
  reorder: { label: 'Low, none in back', short: 'Low', order: 3 },
  missing: { label: 'Not in the count', short: 'No count', order: 4 },
  full: { label: 'Full', short: 'Full', order: 5 },
}

// The unified list as a CSV the associate can send on.
export function toCsv(stops, done) {
  const head = ['Step', 'Aisle', 'Bay', 'Shelf', 'Position', 'SKU', 'Description', 'Facings', 'Capacity', 'Floor', 'Backroom', 'Move', 'Status', 'Done']
  const rows = stops.map((l) => [l.step, l.aisle.code, l.bay, l.shelf, l.pos, l.sku, l.name, l.facings, l.capacity, l.floor ?? '', l.back ?? '', l.move ?? '', STATUS[l.status].label, done[l.key] != null ? `moved ${done[l.key]}` : ''])
  const cell = (v) => (/[",\n]/.test(String(v)) ? `"${String(v).replaceAll('"', '""')}"` : String(v))
  return [head, ...rows].map((r) => r.map(cell).join(',')).join('\n')
}
