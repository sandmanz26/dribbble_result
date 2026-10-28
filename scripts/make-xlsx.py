# Writes public/samples/inventory-store-214.xlsx from scripts/inventory.json.
import json
from openpyxl import Workbook
d = json.load(open('scripts/inventory.json'))
wb = Workbook()
ws = wb.active
ws.title = 'Count 28 Oct'
ws.append(d['head'])
for r in d['rows']:
    ws.append(r)
for col, w in zip('ABCDEF', [10, 44, 16, 10, 13, 18]):
    ws.column_dimensions[col].width = w
wb.save('public/samples/inventory-store-214.xlsx')
print('xlsx written')
