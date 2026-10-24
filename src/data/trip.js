// The shared plan for "Kyoto in maple season", the trip the demo user is in.
// Everything the trip screens show starts here; the store layers the user's changes on top.

// Date poll: each member marks every window yes, maybe or no.
export const DATE_POLL = {
  closes: '2026-10-26',
  windows: [
    { id: 'a', start: '2026-11-14', end: '2026-11-21' },
    { id: 'b', start: '2026-11-15', end: '2026-11-22' },
    { id: 'c', start: '2026-11-21', end: '2026-11-28' },
  ],
  votes: {
    kenji: { a: 'yes', b: 'yes', c: 'no' },
    ines: { a: 'yes', b: 'maybe', c: 'yes' },
    priya: { a: 'yes', b: 'yes', c: 'no' },
    tom: { a: 'maybe', b: 'yes', c: 'yes' },
    // nadia has not voted yet: the demo user does that
  },
}

// Budget plan per person, USD, excluding flights. The parts add up to the group's budget.
export const PLAN = [
  { id: 'stay', label: 'Stay', amount: 560, note: 'Machiya, 7 nights, split 5 ways' },
  { id: 'food', label: 'Food', amount: 420, note: 'About $60 a day' },
  { id: 'move', label: 'Getting around', amount: 120, note: 'ICOCA card, Nara and Arashiyama trains' },
  { id: 'do', label: 'Things to do', amount: 180, note: 'Temple entries, tea ceremony' },
  { id: 'buffer', label: 'Buffer', amount: 120, note: 'For the day it rains' },
]

// Shared costs paid so far. `split` lists who shares each cost equally.
export const EXPENSES = [
  { id: 'e1', what: 'Machiya deposit', cat: 'stay', paidBy: 'kenji', amount: 940, split: ['kenji', 'nadia', 'ines', 'priya', 'tom'], on: '2026-10-02' },
  { id: 'e2', what: 'Tea ceremony, Camellia Garden', cat: 'do', paidBy: 'ines', amount: 175, split: ['kenji', 'nadia', 'ines', 'priya', 'tom'], on: '2026-10-11' },
  { id: 'e3', what: 'Nara day passes', cat: 'move', paidBy: 'priya', amount: 54, split: ['nadia', 'priya', 'tom'], on: '2026-10-19' },
]

// Itinerary. Items marked `proposed` are still being voted on.
export const ITINERARY = [
  { day: 0, items: [
    { id: 'i1', time: '15:00', title: 'Check in at the machiya', where: 'Higashiyama', by: 'kenji' },
    { id: 'i2', time: '19:00', title: 'Dinner along Pontochō', where: 'Pontochō', by: 'ines' },
  ] },
  { day: 1, items: [
    { id: 'i3', time: '06:30', title: 'Fushimi Inari before the crowds', where: 'Fushimi', by: 'kenji' },
    { id: 'i4', time: '13:30', title: 'Tōfuku-ji maples', where: 'Higashiyama', by: 'priya' },
  ] },
  { day: 2, items: [
    { id: 'i5', time: '07:00', title: 'Arashiyama bamboo grove', where: 'Arashiyama', by: 'tom' },
    { id: 'i6', time: '10:00', title: 'Ōkōchi Sansō garden', where: 'Arashiyama', by: 'kenji' },
  ] },
  { day: 3, items: [
    { id: 'i7', time: '09:00', title: 'Nara day trip', where: 'Nara', by: 'priya', going: ['nadia', 'priya', 'tom'] },
  ] },
  { day: 4, items: [
    { id: 'i8', time: '11:00', title: 'Tea ceremony', where: 'Camellia Garden', by: 'ines' },
    { id: 'i9', time: '18:00', title: 'Gion at dusk', where: 'Gion', by: 'ines' },
  ] },
  { day: 5, items: [
    { id: 'i10', time: '09:30', title: 'Kurama to Kibune hike', where: 'North Kyoto', by: 'tom', proposed: true, votes: { tom: 'yes', kenji: 'yes', ines: 'no' } },
    { id: 'i11', time: '14:00', title: 'Rest afternoon', where: 'Machiya', by: 'priya', proposed: true, votes: { priya: 'yes', ines: 'yes' } },
  ] },
  { day: 6, items: [
    { id: 'i12', time: '17:30', title: 'Kiyomizu-dera night illumination', where: 'Higashiyama', by: 'kenji' },
  ] },
  { day: 7, items: [
    { id: 'i13', time: '10:00', title: 'Check out', where: 'Higashiyama', by: 'kenji' },
  ] },
]

// Packing: shared items are claimed by one person; personal items are each person's own list.
export const SHARED_PACKING = [
  { id: 'p1', what: 'First aid kit', by: 'priya' },
  { id: 'p2', what: 'Pocket wifi', by: 'kenji' },
  { id: 'p3', what: 'Laundry sheets', by: null },
  { id: 'p4', what: 'Power strip, Type A', by: null },
  { id: 'p5', what: 'Card game for the evenings', by: 'ines' },
]
export const MY_PACKING = [
  { id: 'm1', what: 'Warm layer for 8°C mornings', done: true },
  { id: 'm2', what: 'Walking shoes you can slip off at temples', done: false },
  { id: 'm3', what: 'Cash in yen: many temples take cash only', done: false },
  { id: 'm4', what: 'Type A plug adapter', done: true },
  { id: 'm5', what: 'Passport and travel insurance', done: false },
]

// Chats. Times are local to the demo day.
export const CHATS = {
  kyoto: {
    kind: 'group', group: 'kyoto',
    messages: [
      { id: 'c1', from: 'kenji', at: 'Yesterday 21:14', text: 'Deposit is paid for the machiya. Five rooms, shared kitchen, ten minutes to Gion.' },
      { id: 'c2', from: 'ines', at: 'Yesterday 21:20', text: 'Tea ceremony booked for the 18th at 11:00. I added it to the costs.' },
      { id: 'c3', from: 'tom', at: 'Today 08:02', text: 'Can we vote on the Kurama hike? Day 6 looks free.' },
      { id: 'c4', from: 'priya', at: 'Today 08:40', text: 'Date poll closes Monday. Nadia, you are the last vote.' },
    ],
  },
  kenji: {
    kind: 'direct', with: 'kenji',
    messages: [
      { id: 'd1', from: 'kenji', at: 'Tue 18:05', text: 'Welcome to the group. If you land at Kansai airport, the Haruka train is the easy one.' },
      { id: 'd2', from: 'nadia', at: 'Tue 18:30', text: 'Thank you! Landing 12:40 on the 14th.' },
    ],
  },
  sam: {
    kind: 'request', with: 'sam',
    messages: [
      { id: 'r1', from: 'sam', at: 'Today 07:15', text: 'hey saw you on the kyoto trip, want to meet up before? can send you my number' },
    ],
  },
}

export const NOTIFICATIONS = [
  { id: 'n1', kind: 'poll', at: 'Today 08:40', text: 'The Kyoto date poll closes Monday. You have not voted yet.', to: '/trip/kyoto/dates' },
  { id: 'n2', kind: 'cost', at: 'Sat 19 Oct', text: 'Priya added Nara day passes, $54, split three ways.', to: '/trip/kyoto/budget' },
  { id: 'n3', kind: 'safety', at: 'Today 07:15', text: 'A message from someone who has not verified their email went to Requests.', to: '/chats' },
  { id: 'n4', kind: 'group', at: 'Thu 1 Oct', text: 'Kenji accepted you into Kyoto in maple season.', to: '/g/kyoto' },
]
