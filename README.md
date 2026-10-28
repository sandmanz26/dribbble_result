# Faceup: restock walk from a planogram and a stock count (project10)

Mobile app prototype for the retail planogram brief. An associate adds two files, a planogram and an
inventory count, as CSV or Excel. The app matches their columns, joins them on SKU in the browser
and turns them into a walk in route order: planned facings, room on the shelf, floor and backroom
stock, how many to bring out, and a status for every place. React 18, Vite 5, react-router
(HashRouter), Bootstrap Icons, Rethink Sans with JetBrains Mono for SKUs, papaparse and
read-excel-file. No backend.

- Walk: aisle map in the store's sign colours, filters, every place or one row per item, a sheet
  per stop with a stepper for units moved and reasons when it could not be filled.
- Check: planogram items missing from the count, counted items with no place, items in several
  places and how their floor stock is split, rows that could not be read, automatic clean-ups.
- Files: drop or choose a file, see what was read, fix any column the app could not match.
- Summary: progress by aisle, the reorder list, and the walk as a CSV download.
- Sample files in `public/samples/` (`npm run samples` rebuilds them from `src/data/sample.js`).
- Review link: `#/?demo=walk` opens the walk with the samples. Saved state: `fu-state-v1`.

On a computer the app sits in a phone frame with a reviewer panel; on a phone it runs full screen.

```bash
npm ci && npm run dev
npm run build   # dist/
```
