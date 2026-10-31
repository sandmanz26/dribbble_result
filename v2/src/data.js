// Osier is a placeholder restaurant. People, prices and quotes are sample content.
export const img = (name, w = 1600) => `photos/${name}-${w}.webp`

export const COURSES = [
  { key: 'c1-oyster', name: 'Oyster', title: 'Native oyster, cucumber, dill', text: 'From Mersea Island, opened to order. Cold, clean and a little sweet, to start the evening.' },
  { key: 'c2-scallop', name: 'Scallop', title: 'Hand-dived scallop, brown butter, hazelnut', text: 'Dived off Orkney the day before. Seared on one side only, finished with butter browned at the pass.' },
  { key: 'c3-celeriac', name: 'Celeriac', title: 'Celeriac baked in salt, black truffle', text: 'Baked whole in a salt crust for four hours, then carved at the table. Our signature since we opened.' },
  { key: 'c4-turbot', name: 'Turbot', title: 'Turbot, mussels, sea herbs', text: 'Line-caught turbot from Cornwall, poached on the bone. Mussels, sea aster and a light butter sauce.' },
  { key: 'c5-duck', name: 'Duck', title: 'Aged duck, beetroot, cherry', text: 'Aylesbury duck aged for fourteen days, roasted on the crown. Beetroot from our grower in Kent.' },
  { key: 'c6-apple', name: 'Apple', title: 'Bramley apple, buckwheat, sour cream', text: 'Apples from the orchard at Brogdale, caramelised thin, with sour cream ice and toasted buckwheat.' },
]

export const MENU = [
  ['Native oyster, cucumber, dill', 'Muscadet, Domaine de la Pépière 2022'],
  ['Hand-dived scallop, brown butter, hazelnut', 'Chablis Premier Cru, Raveneau 2020'],
  ['Celeriac baked in salt, black truffle', 'Savagnin, Domaine Tissot 2019'],
  ['Turbot, mussels, sea herbs', 'Meursault, Roulot 2019'],
  ['Aged duck, beetroot, cherry', 'Pinot Noir, Gusbourne, Kent 2020'],
  ['Bramley apple, buckwheat, sour cream', 'Tokaji Aszú 5 Puttonyos 2013'],
]

export const ROOMS = [
  { photo: 'service', name: 'The dining room', text: 'Ten tables under candlelight on the ground floor of a Georgian townhouse. One sitting a night, from 7pm.' },
  { photo: 'counter', name: "The chef's table", text: 'Six seats at the kitchen counter. The same menu, served by the cooks who make it.' },
  { photo: 'cellar', name: 'The cellar', text: 'A vaulted room under the street for up to ten guests, among the wine. Booked by request.' },
]

export const GUESTS = [
  { text: 'The quietest room in London. Three hours went by and nobody once rushed us.', who: 'Eleanor W.', where: 'London' },
  { text: 'The celeriac is carved at the table. We still talk about it.', who: 'Marcus and Ada', where: 'New York' },
]

export const NOW = new Date('2026-11-05T15:40:00') // Thursday afternoon, demo clock
export const CLOSED = [0, 1] // Sunday, Monday
export const TIMES = ['18:30', '19:00', '19:15', '19:30', '20:00', '20:30']
export const FULL = { 0: ['19:00', '19:15', '19:30', '20:00'], 1: ['19:30', '20:00'], 2: ['18:30', '19:00', '19:15', '19:30', '20:00', '20:30'], 3: ['19:15'] }
export const PRICE = 245
export const PAIRING = 165
