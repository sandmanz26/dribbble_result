// Kofi's view: crewing Northlight season 2. Sample data.
export const crewProduction = {
  title: 'Northlight',
  kind: 'Series, season 2',
  dates: '11 Jan to 19 Feb 2027',
  where: 'Glasgow and Leith',
  prep: 'Prep starts 4 Jan',
  photo: 'set-night',
}

// status: booked | pencil | open
export const board = [
  { dept: 'Camera', roles: [
    { role: 'Director of photography', who: 'june', status: 'booked' },
    { role: 'Camera operator', who: 'ruben', status: 'booked' },
    { role: '1st assistant camera', status: 'open', replies: 2 },
  ] },
  { dept: 'Lighting', roles: [
    { role: 'Gaffer', status: 'open', replies: 4, key: 'gaffer' },
    { role: 'Best boy electric', status: 'open', replies: 1 },
    { role: 'Electrician', who: 'theo', status: 'pencil' },
  ] },
  { dept: 'Grip', roles: [
    { role: 'Key grip', who: 'dele', status: 'booked' },
    { role: 'Dolly grip', status: 'open', replies: 0 },
  ] },
  { dept: 'Art', roles: [
    { role: 'Production designer', who: 'noor', status: 'pencil' },
  ] },
]

// Replies to the gaffer call, ranked by fit for the dates, not by who shouted first.
export const gafferReplies = [
  { who: 'mara', avail: 'free', note: 'All 30 days', worked: ['june', 'ruben', 'dele'], rate: 520, credits: 'Saltmarsh, Halfway House, The Long Field' },
  { who: 'arlo', avail: 'free', note: 'All 30 days. Usually best boy, stepping up', worked: ['june'], rate: 440, credits: 'Common Room, Saltmarsh' },
  { who: 'theo', avail: 'pencil', note: 'Someone else holds 11 to 22 Jan', worked: ['dele'], rate: 470, credits: 'Low Tide, Dry Creek' },
  { who: 'sol', avail: 'booked', note: 'Until 29 Jan', worked: [], rate: 500, credits: 'Glass Harbour' },
]
