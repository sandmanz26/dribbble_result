// Mara's diary for Nov and Dec 2026.
// confirmed = booked; pencil 1 = asked first; pencil 2 = asked second.
// A second pencil can "challenge" the first: the first then has 24 hours to confirm or release.

export const holds = [
  { id: 'saltmarsh', title: 'Saltmarsh', kind: 'Feature film', status: 'confirmed', from: '2026-10-29', to: '2026-12-11', weekdays: true, photo: 'set-warehouse' },
  { id: 'low-tide', title: 'Low Tide', kind: 'Music video', status: 'pencil1', from: '2026-11-28', to: '2026-11-29', expires: 'Fri 20 Nov', photo: 'set-beach' },
  { id: 'paper-moon', title: 'Paper Moon', kind: 'Feature film', status: 'pencil1', from: '2026-12-14', to: '2026-12-23', expires: 'Mon 30 Nov', photo: 'set-film' },
  { id: 'halfway-house', title: 'Halfway House', kind: 'TV pilot', status: 'pencil2', from: '2026-12-14', to: '2026-12-22', photo: 'set-apartment' },
]

export const statusLabel = {
  confirmed: 'Booked',
  pencil1: '1st pencil',
  pencil2: '2nd pencil',
  waiting: 'Challenge sent',
  released: 'Released',
}
