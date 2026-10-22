// UX recommendations shown as numbered markers on the screens (toggle in the Prototype panel).
// The JD says flow structure already exists; these are the small, reasoned changes worth flagging,
// each with the metric that would show whether it worked.
export const UX_NOTES = [
  {
    id: 'price-first',
    where: '/',
    title: 'Price before contact details',
    why: 'Only vehicle and ZIP are needed to price brakes. Asking for a phone number or email before showing a price is a common drop-off point in service quotes.',
    measure: 'Home visit to quote viewed rate',
  },
  {
    id: 'acquisition',
    where: '/',
    title: 'Say the acquisition once, plainly',
    why: 'Returning customers need to know their account, history and warranty still count. One sentence, same wording in both brands, repeated in the FAQ.',
    measure: 'Support contacts about accounts or warranty after the rebrand',
  },
  {
    id: 'symptoms',
    where: '/quote/issue',
    title: 'Let people start from the symptom',
    why: 'Most customers know the noise, not the repair. Symptoms map to a service with a one-line reason, and the technician confirms before any work.',
    measure: 'Drop-off on the service step; share of quotes started from symptoms',
  },
  {
    id: 'location',
    where: '/quote/location',
    title: 'Catch location problems before scheduling',
    why: 'Apartment rules, slopes and street parking cause failed visits. Asking for the spot type up front lets us warn the customer before a technician drives out.',
    measure: 'Visits rescheduled or failed because of access',
  },
  {
    id: 'breakdown',
    where: '/quote/price',
    title: 'Itemise the price and say how long it holds',
    why: 'Parts, labor and tax shown separately, "coming to you" shown as included, and a 7-day hold answer the two doubts that stall a booking: hidden fees and price changes.',
    measure: 'Quote viewed to booked rate; price disputes after the job',
  },
  {
    id: 'windows',
    where: '/quote/time',
    title: 'A full day is never a dead end',
    why: 'Closed and fully booked days explain why and jump to the next open day in one tap, instead of a blank list.',
    measure: 'Drop-off on the time step',
  },
  {
    id: 'presence',
    where: '/quote/time',
    title: 'Ask early if they will be there',
    why: 'Knowing about keys before the visit removes the "no access" failure and lets busy customers book without taking time off.',
    measure: 'Visits blocked by no access to keys',
  },
  {
    id: 'contact-last',
    where: '/quote/details',
    title: 'Contact last, nothing charged at booking',
    why: 'By this step the customer has a price and a time. To confirm with the PM: whether today a card is held at booking. If so, this is the place to test removing it.',
    measure: 'Details step completion',
  },
  {
    id: 'mobile-summary',
    where: '/quote/vehicle',
    title: 'Running total and sticky action on mobile',
    why: 'On phones the summary collapses into one line with the total, and Continue stays at thumb height, so people do not scroll back to check what they chose.',
    measure: 'Back navigation inside the flow on mobile',
  },
  {
    id: 'tech',
    where: '/booking',
    title: 'Show who is coming',
    why: 'A stranger is coming to the customer’s home or workplace. Name, certification, the van to look for and live arrival status replace the "where is my technician" call.',
    measure: 'Inbound calls asking for arrival time',
  },
  {
    id: 'approval',
    where: '/booking',
    title: 'Extra work is approved in the app',
    why: 'Upselling fear is a reason not to book mobile. The technician sends the measurement, the reason and the price; declining never changes the original quote.',
    measure: 'Add-on approval rate; disputes about extra charges',
  },
  {
    id: 'reschedule',
    where: '/booking',
    title: 'Reschedule is easier than cancel',
    why: 'Reschedule is the first action and opens the same arrival picker. Cancel asks for a reason in one tap, which feeds back into the funnel.',
    measure: 'Reschedules vs cancellations',
  },
]

export const noteById = (id) => UX_NOTES.find((n) => n.id === id)
export const noteNumber = (id) => UX_NOTES.findIndex((n) => n.id === id) + 1
