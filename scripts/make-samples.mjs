// Writes the sample files a reviewer can download and upload again: the planogram as CSV and the
// inventory count as both CSV and Excel (the Excel file is written by make-xlsx.py).
import { writeFileSync } from 'node:fs'
import { PLANOGRAM, INVENTORY, PLANO_HEAD, INV_HEAD, STORE } from '../src/data/sample.js'

const cell = (v) => (/[",\n]/.test(String(v)) ? `"${String(v).replaceAll('"', '""')}"` : String(v))
const csv = (head, rows) => [head, ...rows].map((r) => r.map(cell).join(',')).join('\n') + '\n'
writeFileSync('public/samples/planogram-store-214.csv', csv(PLANO_HEAD, PLANOGRAM.map((r) => [STORE.id, ...r])))
writeFileSync('public/samples/inventory-store-214.csv', csv(INV_HEAD, INVENTORY))
writeFileSync('scripts/inventory.json', JSON.stringify({ head: INV_HEAD, rows: INVENTORY }))
console.log('samples written')
