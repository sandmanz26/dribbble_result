// Mock marketplace data (no backend). Ratings, review counts and prices are sample values.
// Portrait placeholders come from randomuser.me.
const face = (g, n) => `https://randomuser.me/api/portraits/${g}/${n}.jpg`

export const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'wedding', label: 'Weddings' },
  { id: 'portrait', label: 'Portraits' },
  { id: 'event', label: 'Events' },
  { id: 'product', label: 'Product' },
  { id: 'food', label: 'Food' },
  { id: 'architecture', label: 'Interiors' },
  { id: 'music', label: 'Music' },
  { id: 'sport', label: 'Sport' },
]

const pkg = (id, name, hours, deliver, price, includes) => ({ id, name, hours, deliver, price, includes })

export const creators = [
  {
    id: 'amara-okafor', name: 'Amara Okafor', avatar: face('women', 65), area: 'Hackney',
    medium: 'photo', title: 'Wedding photographer', cats: ['wedding', 'portrait'],
    rating: 4.9, reviews: 128, jobs: 214, responds: 'within 2 hours', since: 2017,
    bio: 'Documentary-style wedding photography. I stay in the background and photograph what actually happens on the day.',
    media: [['wedding', 0], ['wedding', 1], ['wedding', 2], ['wedding', 3], ['portrait', 6], ['wedding', 5]],
    packages: [
      pkg('elopement', 'Elopement', 3, '2 weeks', 850, ['Up to 3 hours of coverage', '150+ edited photos', 'Online gallery']),
      pkg('half-day', 'Half day', 6, '3 weeks', 1650, ['Ceremony to first dance', '400+ edited photos', 'Online gallery', 'Second shooter']),
      pkg('full-day', 'Full day', 10, '4 weeks', 2400, ['Prep to last dance', '700+ edited photos', 'Second shooter', 'Printed album']),
    ],
    available: ['2026-11-07', '2026-11-14', '2026-11-21', '2026-11-28', '2026-12-05'],
  },
  {
    id: 'kenji-watanabe', name: 'Kenji Watanabe', avatar: face('men', 52), area: 'Shoreditch',
    medium: 'photo', title: 'Product and still life', cats: ['product', 'food'],
    rating: 4.8, reviews: 64, jobs: 131, responds: 'within 1 hour', since: 2019,
    bio: 'Studio product photography for e-commerce and campaigns. My Shoreditch studio has a sweep, a kitchen set and natural light.',
    media: [['product', 0], ['product', 1], ['product', 2], ['product', 3], ['product', 4], ['product', 5]],
    packages: [
      pkg('ecom', 'E-commerce set', 4, '5 days', 320, ['Up to 15 products', 'White background', '2 angles per product']),
      pkg('lifestyle', 'Lifestyle set', 6, '1 week', 680, ['Up to 8 products', 'Styled scenes', 'Prop sourcing']),
      pkg('campaign', 'Campaign day', 9, '2 weeks', 1450, ['Creative direction', 'Up to 20 hero images', 'Usage rights for 1 year']),
    ],
    available: ['2026-10-26', '2026-10-28', '2026-11-02', '2026-11-04', '2026-11-09', '2026-11-11'],
  },
  {
    id: 'lucia-ferreyra', name: 'Lucía Ferreyra', avatar: face('women', 33), area: 'Peckham',
    medium: 'photo', title: 'Portraits and fashion', cats: ['portrait'],
    rating: 5.0, reviews: 41, jobs: 77, responds: 'within 3 hours', since: 2020,
    bio: 'Portraits for actors, founders and musicians. Sessions are relaxed and we review the photos together on set.',
    media: [['portrait', 0], ['portrait', 1], ['portrait', 2], ['portrait', 3], ['portrait', 4], ['portrait', 5]],
    packages: [
      pkg('headshot', 'Headshots', 1, '3 days', 180, ['1 hour session', '2 looks', '8 retouched images']),
      pkg('personal', 'Personal brand', 3, '1 week', 420, ['3 hour session', '2 locations', '25 retouched images']),
    ],
    available: ['2026-10-24', '2026-10-25', '2026-10-31', '2026-11-01', '2026-11-07'],
  },
  {
    id: 'jonas-lindqvist', name: 'Jonas Lindqvist', avatar: face('men', 11), area: 'King’s Cross',
    medium: 'video', title: 'Brand films', cats: ['product'],
    rating: 4.7, reviews: 37, jobs: 58, responds: 'within a day', since: 2016,
    bio: 'Short brand films and social cut-downs, from script to grade. I work with a small crew of two to four people.',
    media: [['street', 0, '1:42'], ['product', 6, '0:58'], ['street', 1, '2:10'], ['street', 2, '0:30']],
    packages: [
      pkg('social', 'Social cut-downs', 5, '1 week', 1400, ['Half-day shoot', '3 vertical edits up to 30s', 'Licensed music']),
      pkg('brand', 'Brand film', 10, '3 weeks', 3800, ['Full-day shoot, crew of 3', '90 second hero film', '3 cut-downs', 'Colour grade']),
    ],
    available: ['2026-11-12', '2026-11-19', '2026-11-26'],
  },
  {
    id: 'priya-raman', name: 'Priya Raman', avatar: face('women', 47), area: 'Canary Wharf',
    medium: 'both', title: 'Events and conferences', cats: ['event', 'music'],
    rating: 4.9, reviews: 96, jobs: 188, responds: 'within 1 hour', since: 2018,
    bio: 'Conference, launch and party coverage. Same-day highlights for social media are included in every package.',
    media: [['event', 0], ['concert', 0], ['event', 1, '1:05'], ['event', 2], ['concert', 1]],
    packages: [
      pkg('evening', 'Evening event', 3, '48 hours', 450, ['3 hours on site', '150+ edited photos', '10 same-night previews']),
      pkg('conference', 'Conference day', 9, '3 days', 1150, ['Full day on site', '500+ edited photos', 'Speaker portraits']),
      pkg('photo-video', 'Photo and video', 9, '1 week', 2100, ['Two-person team', '2 minute highlight film', '500+ photos']),
    ],
    available: ['2026-10-27', '2026-10-29', '2026-11-03', '2026-11-05', '2026-11-10'],
  },
  {
    id: 'mateo-rossi', name: 'Mateo Rossi', avatar: face('men', 64), area: 'Islington',
    medium: 'photo', title: 'Interiors and architecture', cats: ['architecture'],
    rating: 4.8, reviews: 52, jobs: 120, responds: 'within 4 hours', since: 2015,
    bio: 'Interiors for architects, designers and short-let hosts. Every image is corrected for verticals and colour.',
    media: [['architecture', 0], ['architecture', 1], ['architecture', 2], ['architecture', 3], ['architecture', 4], ['architecture', 5]],
    packages: [
      pkg('listing', 'Property listing', 2, '48 hours', 380, ['Up to 2 bedrooms', '25 edited images', 'Floor plan sketch']),
      pkg('portfolio', 'Architect portfolio', 5, '1 week', 890, ['Twilight exteriors', '40 edited images', 'Detail shots']),
    ],
    available: ['2026-10-23', '2026-10-30', '2026-11-06', '2026-11-13'],
  },
  {
    id: 'nadia-haddad', name: 'Nadia Haddad', avatar: face('women', 21), area: 'Camden',
    medium: 'video', title: 'Music videos and live sessions', cats: ['music'],
    rating: 4.9, reviews: 29, jobs: 44, responds: 'within 5 hours', since: 2021,
    bio: 'Music videos and multi-camera live sessions for independent artists. I also handle the audio sync and grade.',
    media: [['concert', 2, '3:24'], ['concert', 3, '4:01'], ['concert', 0, '2:48'], ['street', 4, '3:12']],
    packages: [
      pkg('session', 'Live session', 4, '10 days', 900, ['3 cameras', '1 song, fully mixed', 'Vertical cut']),
      pkg('video', 'Music video', 10, '3 weeks', 2600, ['Treatment and storyboard', 'Full-day shoot', 'Edit and grade']),
    ],
    available: ['2026-11-15', '2026-11-22', '2026-11-29'],
  },
  {
    id: 'tom-bellamy', name: 'Tom Bellamy', avatar: face('men', 85), area: 'Borough',
    medium: 'photo', title: 'Food and restaurants', cats: ['food'],
    rating: 4.7, reviews: 73, jobs: 160, responds: 'within 2 hours', since: 2018,
    bio: 'Menus, openings and cookbooks. I shoot in your kitchen during service hours so the food is real and hot.',
    media: [['food', 0], ['food', 1], ['food', 2], ['food', 3]],
    packages: [
      pkg('menu', 'Menu refresh', 3, '4 days', 290, ['Up to 12 dishes', 'Overhead and 45° angles', 'Delivery app crops']),
      pkg('opening', 'Restaurant opening', 6, '1 week', 720, ['Dishes, team and interior', '60 edited images']),
    ],
    available: ['2026-10-26', '2026-10-27', '2026-11-02', '2026-11-03', '2026-11-09'],
  },
  {
    id: 'ayo-adeyemi', name: 'Ayọ Adeyemi', avatar: face('men', 36), area: 'Stratford',
    medium: 'both', title: 'Sport and action', cats: ['sport'],
    rating: 4.8, reviews: 45, jobs: 93, responds: 'within 3 hours', since: 2019,
    bio: 'Clubs, athletes and sportswear brands. Fast lenses, high frame rates and quick turnaround on match days.',
    media: [['sport', 0], ['sport', 1, '0:45'], ['sport', 2]],
    packages: [
      pkg('match', 'Match day', 3, '24 hours', 400, ['Full match coverage', '120 edited photos', '10 images within 1 hour']),
      pkg('athlete', 'Athlete campaign', 6, '1 week', 1250, ['Photo and slow-motion video', '30 retouched images', '30s edit']),
    ],
    available: ['2026-10-25', '2026-11-01', '2026-11-08', '2026-11-15'],
  },
  {
    id: 'eliza-marsh', name: 'Eliza Marsh', avatar: face('women', 79), area: 'Richmond',
    medium: 'video', title: 'Wedding films', cats: ['wedding'],
    rating: 4.9, reviews: 58, jobs: 96, responds: 'within a day', since: 2016,
    bio: 'Wedding films with real audio from your vows and speeches. Calm, unobtrusive, and delivered with a full-length edit.',
    media: [['wedding', 4, '4:30'], ['wedding', 6, '2:15'], ['wedding', 7, '6:02'], ['portrait', 7, '1:20']],
    packages: [
      pkg('highlights', 'Highlights film', 8, '6 weeks', 1200, ['8 hours of coverage', '4 minute highlight film', 'Ceremony audio']),
      pkg('feature', 'Feature film', 10, '8 weeks', 2350, ['10 hours, two shooters', '15 minute film', 'Full ceremony and speeches']),
    ],
    available: ['2026-11-07', '2026-11-21', '2026-12-12'],
  },
]

export const reviewsPool = [
  { name: 'Hannah Whitfield', text: 'Easy to work with from the first message. The gallery arrived three days early.', stars: 5, when: 'September 2026' },
  { name: 'Marcus Oyelaran', text: 'Clear about timings and pricing, and the results were better than our brief.', stars: 5, when: 'August 2026' },
  { name: 'Sophie Achterberg', text: 'Great eye for detail. We had one round of edits and it was handled the same day.', stars: 4, when: 'July 2026' },
  { name: 'Rahul Menon', text: 'Professional on the day and kept everyone relaxed. Would book again.', stars: 5, when: 'June 2026' },
]

export const getCreator = (id) => creators.find((c) => c.id === id)
export const fromPrice = (c) => Math.min(...c.packages.map((p) => p.price))
export const money = (n) => `£${n.toLocaleString('en-GB')}`
export const SERVICE_FEE = 0.06 // client-side marketplace fee (sample)
