// Rimba is a placeholder restaurant. Names, prices and reviews are sample content.
export const photo = (name, w = 1600) => `photos/${name}-${w}.webp`

export const COURSES = [
  {
    key: 'course-1', short: 'Tomato', name: 'Tomatoes, torch ginger, cold tamarind',
    text: 'The first heirloom tomatoes from Pak Wayan in Tabanan, in a cold tamarind broth with shaved torch ginger flower. Sharp, cold and pink, to wake you up.',
    from: 'Tabanan, 40 km', cooked: 'Not cooked. The broth sits overnight.',
  },
  {
    key: 'course-2', short: 'Squid', name: 'Charred squid, green sambal, lime leaf',
    text: 'Squid from the boats at Amed, scored and charred hard over coconut husk. Green sambal of raw chilli and shallot, lime leaf cut finer than thread.',
    from: 'Amed, 2 hours by road', cooked: '90 seconds over coconut husk',
  },
  {
    key: 'course-3', short: 'Duck', name: 'Ember-roasted duck, betutu, banana leaf',
    text: 'Our signature. Duck rubbed with betutu spice paste, wrapped in banana leaf and buried in embers for six hours, then glazed and finished over open flame.',
    from: 'Gianyar, 12 km', cooked: 'Six hours in the embers',
  },
  {
    key: 'course-4', short: 'Jackfruit', name: 'Smoked jackfruit, coconut, long pepper',
    text: 'Young jackfruit smoked over cacao wood until it pulls like meat, in a thick coconut gravy with Javanese long pepper. The dish our vegetarian guests ask for again.',
    from: 'The garden behind the kitchen', cooked: 'Smoked for three hours',
  },
  {
    key: 'course-5', short: 'Palm sugar', name: 'Palm sugar ice, burnt coconut, salted pandan',
    text: 'Ice cream made with palm sugar from Karangasem, a coconut tuile burnt on the hearth, salted pandan cream and toasted rice. Sweet, smoky and a little salty.',
    from: 'Karangasem, 80 km', cooked: 'Tuile on the hearth stone',
  },
]

export const MENU = {
  tasting: {
    label: 'Tasting menu',
    note: 'Five courses, served Tuesday to Sunday from 6pm. Changes with the harvest. Tell us about allergies when you book.',
    items: [
      { name: 'Five courses over fire', desc: 'The evening as described above', price: 950, photo: 'course-3' },
      { name: 'Paired drinks', desc: 'Arak, natural wine and house ferments, one per course', price: 650, photo: 'drink' },
      { name: 'Vegetarian five courses', desc: 'Same fire, nothing that swims or flies', price: 850, photo: 'course-4', tags: ['veg'] },
    ],
  },
  hearth: {
    label: 'From the hearth',
    note: 'À la carte at the hearth bar and on the terrace. Made for sharing; two or three plates each is about right.',
    items: [
      { name: 'Ikan bakar in banana leaf', desc: 'Whole reef fish, turmeric, embers. For two or three', price: 420, photo: 'embers', spice: 2 },
      { name: 'Sate lilit', desc: 'Minced mackerel on lemongrass, sambal matah', price: 145, photo: 'sharing', spice: 1 },
      { name: 'Charred squid', desc: 'Green sambal, kaffir lime', price: 165, photo: 'course-2', spice: 2 },
      { name: 'Smoked jackfruit', desc: 'Coconut, long pepper', price: 135, photo: 'course-4', tags: ['veg'] },
      { name: 'Red rice from Jatiluwih', desc: 'Steamed in bamboo', price: 45, photo: 'pantry', tags: ['veg'] },
      { name: 'Sharing feast', desc: 'A bit of everything for four. Also for pickup', price: 1450, photo: 'sharing', spice: 1 },
    ],
  },
  drinks: {
    label: 'To drink',
    note: 'Our bar works with Balinese arak distillers and two natural wine growers in Java and Lombok.',
    items: [
      { name: 'Kecombrang', desc: 'Arak, torch ginger, lime, salt', price: 165, photo: 'drink' },
      { name: 'Smoke and honey', desc: 'Arak aged on cacao wood, forest honey', price: 175, photo: 'drink' },
      { name: 'Jamu soda', desc: 'Turmeric, tamarind, sparkling water. No alcohol', price: 75, photo: 'pantry', tags: ['nil'] },
      { name: 'Natural wine by the glass', desc: 'Ask what is open tonight', price: 150, photo: 'bar' },
    ],
  },
}

export const ROOMS = [
  { photo: 'arrival', title: 'The way in', text: 'A lantern path through the garden. Arrive ten minutes early and we will pour you something at the bar.' },
  { photo: 'hero', title: 'The dining room', text: 'Open on three sides to the valley. Eleven tables, all facing the fire.' },
  { photo: 'bar', title: 'The hearth bar', text: 'Twelve seats in front of the cooks. À la carte, and walk-ins welcome before 7pm.' },
  { photo: 'terrace', title: 'The terrace', text: 'Four tables over the river valley. Cooler, quieter, best on a clear night.' },
  { photo: 'private', title: 'The long room', text: 'Up to sixteen guests under a woven bamboo roof. For birthdays and families.' },
]

export const REVIEWS = [
  { text: 'We came for the duck and stayed three hours. The cooks explain every dish, nobody rushes you.', who: 'Hannah M.', where: 'Melbourne' },
  { text: 'Sitting at the hearth bar is the best seat in Ubud. You watch the fish go into the embers.', who: 'Rizky A.', where: 'Jakarta' },
  { text: 'They changed half the menu for my shellfish allergy without making it a thing.', who: 'Julien P.', where: 'Lyon' },
]

export const SEATING = [
  { key: 'room', label: 'Dining room' },
  { key: 'bar', label: 'Hearth bar' },
  { key: 'terrace', label: 'Terrace' },
]

export const TIMES = ['17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00']

// Which slots are taken, by day offset and time. Sample data.
export const FULL = { 0: ['19:00', '19:30', '20:00'], 1: ['19:30'], 3: ['18:30', '19:00', '19:30', '20:00', '20:30'], 4: ['19:00', '19:30', '20:00', '20:30', '21:00', '18:30'] }

export const NOW = new Date('2026-11-03T15:20:00') // Tuesday afternoon, demo clock
export const CLOSED_DAY = 1 // Monday

export const idr = (k) => `${k.toLocaleString('en')}k`
