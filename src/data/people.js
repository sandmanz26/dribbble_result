// Sample travellers. Verification is what the app actually checked: phone (SMS code),
// email (link) and an optional ID check. Sample data: none of these are real people.
export const ME = 'nadia'

export const PEOPLE = {
  nadia: { name: 'Nadia Rahman', home: 'Kuala Lumpur', hue: 168, verified: { phone: true, email: true, id: true }, since: '2025', trips: 4, languages: ['English', 'Malay'], about: 'Product designer. Slow travel, early mornings, good noodles.' },
  kenji: { name: 'Kenji Morita', home: 'Osaka', hue: 18, verified: { phone: true, email: true, id: true }, since: '2023', trips: 11, languages: ['Japanese', 'English'], about: 'Grew up in Kansai. I plan walks around the quiet side streets.' },
  ines: { name: 'Inês Carvalho', home: 'Porto', hue: 330, verified: { phone: true, email: true, id: true }, since: '2024', trips: 7, languages: ['Portuguese', 'English', 'Spanish'], about: 'Ceramics, tea, and trains over planes when I can.' },
  priya: { name: 'Priya Nair', home: 'Bengaluru', hue: 262, verified: { phone: true, email: true, id: true }, since: '2024', trips: 5, languages: ['English', 'Hindi', 'Malayalam'], about: 'Doctor. I carry the first aid kit, always.' },
  tom: { name: 'Tom Becker', home: 'Berlin', hue: 210, verified: { phone: true, email: true, id: false }, since: '2025', trips: 2, languages: ['German', 'English'], about: 'Photographer on a long sabbatical.' },
  hana: { name: 'Hana Kim', home: 'Seoul', hue: 300, verified: { phone: true, email: true, id: true }, since: '2023', trips: 9, languages: ['Korean', 'English', 'Japanese'], about: 'Budget trips, hostels, night buses.' },
  sam: { name: 'Sam Whitfield', home: 'Melbourne', hue: 48, verified: { phone: true, email: false, id: false }, since: '2026', trips: 0, languages: ['English'], about: '' },
  lucas: { name: 'Lucas Ferreira', home: 'São Paulo', hue: 120, verified: { phone: true, email: true, id: false }, since: '2025', trips: 3, languages: ['Portuguese', 'English'], about: 'Surfer, cook, bad at mornings.' },
  elena: { name: 'Elena Rossi', home: 'Milan', hue: 0, verified: { phone: true, email: true, id: true }, since: '2022', trips: 14, languages: ['Italian', 'English', 'French'], about: 'Architect. I will make you walk to see a staircase.' },
  mei: { name: 'Mei Lin Tan', home: 'Singapore', hue: 190, verified: { phone: true, email: true, id: true }, since: '2023', trips: 8, languages: ['English', 'Mandarin'], about: 'Street food first, museums when it rains.' },
  oscar: { name: 'Óscar Ruiz', home: 'Mexico City', hue: 85, verified: { phone: true, email: true, id: true }, since: '2022', trips: 16, languages: ['Spanish', 'English'], about: 'Mountain guide on weekends. Altitude is my thing.' },
  zainab: { name: 'Zainab Bello', home: 'Lagos', hue: 280, verified: { phone: true, email: true, id: true }, since: '2024', trips: 6, languages: ['English', 'Yoruba', 'French'], about: 'Finance by day, hiking by holiday.' },
  dawit: { name: 'Dawit Haile', home: 'Addis Ababa', hue: 232, verified: { phone: true, email: true, id: false }, since: '2025', trips: 3, languages: ['Amharic', 'English'], about: 'Coffee person. I will find the best cup in any town.' },
  freya: { name: 'Freya Lund', home: 'Oslo', hue: 150, verified: { phone: true, email: true, id: true }, since: '2023', trips: 10, languages: ['Norwegian', 'English'], about: 'Winter is the best season. I can prove it.' },
}

export const person = (id) => ({ id, ...PEOPLE[id] })
export const firstName = (id) => PEOPLE[id]?.name.split(' ')[0]
export const initials = (id) => PEOPLE[id]?.name.split(' ').map((w) => w[0]).slice(0, 2).join('')

// Trust level, from what was checked. ID-verified is the top level; phone and email are the floor
// for joining any group.
export function trust(id, overrides) {
  const v = overrides || PEOPLE[id]?.verified || {}
  if (v.id && v.phone && v.email) return 'id'
  if (v.phone && v.email) return 'contact'
  return 'partial'
}
