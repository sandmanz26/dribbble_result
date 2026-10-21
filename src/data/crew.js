export const crew = [
  { id: 'maya', name: 'Maya', role: 'Navigator', color: '#e8563a' },
  { id: 'dimas', name: 'Dimas', role: 'Photographer', color: '#2f6f73' },
  { id: 'lena', name: 'Lena', role: 'Storyteller', color: '#e9a23b' },
  { id: 'theo', name: 'Theo', role: 'Chief Snacker', color: '#6b4b8a' },
  { id: 'sari', name: 'Sari', role: 'Budget Keeper', color: '#4f7d3a' },
]

export const crewById = Object.fromEntries(crew.map((c) => [c.id, c]))
