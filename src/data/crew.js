// Portrait placeholders from randomuser.me; swap for the gang's real photos.
export const crew = [
  { id: 'maya', name: 'Maya', role: 'Plans the routes', photo: 'https://randomuser.me/api/portraits/women/68.jpg' },
  { id: 'dimas', name: 'Dimas', role: 'Takes the photos', photo: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { id: 'lena', name: 'Lena', role: 'Writes most posts', photo: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { id: 'theo', name: 'Theo', role: 'Finds the food', photo: 'https://randomuser.me/api/portraits/men/75.jpg' },
  { id: 'sari', name: 'Sari', role: 'Keeps the budget', photo: 'https://randomuser.me/api/portraits/women/90.jpg' },
]
export const crewById = Object.fromEntries(crew.map((c) => [c.id, c]))
