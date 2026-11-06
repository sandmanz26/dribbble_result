// Mock data for Pathwell, a career transition admin console. Generated from a fixed seed so every visit sees the same numbers.
// Everything here is sample data: companies, people, coaches, roles and figures are invented.

export const TODAY = new Date(2022, 9, 13, 10, 20) // Thu 13 Oct 2022, the demo clock

let s = 20221013
const rnd = () => { s = (s * 1664525 + 1013904223) % 4294967296; return s / 4294967296 }
const pick = (a) => a[Math.floor(rnd() * a.length)]
const int = (a, b) => a + Math.floor(rnd() * (b - a + 1))
const daysAgo = (n) => { const d = new Date(TODAY); d.setDate(d.getDate() - n); return d }

export const STAGES = ['Onboarding', 'Profile ready', 'Applying', 'Interviewing', 'Offer', 'Landed']
export const STAGE_TONE = ['grey', 'blue', 'blue', 'amber', 'green', 'green']

export const PROGRAMS = [
  { id: 'northwind', employer: 'Northwind Logistics', name: 'Warehouse automation transition', seats: 84, tier: 'Plus', start: new Date(2022, 5, 6), months: 6, redeploy: true, hr: 'Daniel Okafor', logo: 'NL', colour: '#4c6fff' },
  { id: 'halcyon', employer: 'Halcyon Bank', name: 'Branch network consolidation', seats: 46, tier: 'Core', start: new Date(2022, 7, 1), months: 4, redeploy: false, hr: 'Priya Raman', logo: 'HB', colour: '#16a37f' },
  { id: 'corvid', employer: 'Corvid Media', name: 'Newsroom restructure', seats: 30, tier: 'Executive', start: new Date(2022, 6, 18), months: 6, redeploy: true, hr: 'Ellen Marsh', logo: 'CM', colour: '#f2994a' },
]

export const COACHES = [
  { id: 'c1', name: 'Rosa Delgado', focus: 'Logistics and operations', langs: 'English, Spanish', cap: 22, rating: 4.9 },
  { id: 'c2', name: 'Marcus Webb', focus: 'Finance and banking', langs: 'English', cap: 20, rating: 4.7 },
  { id: 'c3', name: 'Aiko Tanaka', focus: 'Tech and data careers', langs: 'English, Japanese', cap: 18, rating: 4.8 },
  { id: 'c4', name: 'Samuel Adeyemi', focus: 'Leadership and executives', langs: 'English, Yoruba', cap: 12, rating: 5.0 },
  { id: 'c5', name: 'Hannah Kowalski', focus: 'Media and communications', langs: 'English, Polish', cap: 18, rating: 4.6 },
  { id: 'c6', name: 'Luis Ortega', focus: 'Skilled trades and reskilling', langs: 'English, Spanish', cap: 24, rating: 4.7 },
  { id: 'c7', name: 'Grace Lin', focus: 'Customer and retail roles', langs: 'English, Mandarin', cap: 20, rating: 4.8 },
  { id: 'c8', name: 'Owen Brennan', focus: 'Career change and returners', langs: 'English', cap: 16, rating: 4.5 },
]

const FIRST = ['Ava', 'Jamal', 'Sofia', 'Ethan', 'Mei', 'Carlos', 'Olivia', 'Noah', 'Fatima', 'Liam', 'Grace', 'Diego', 'Hana', 'Isaac', 'Leila', 'Mateo', 'Chloe', 'Andre', 'Nina', 'Kofi', 'Ruth', 'Tomas', 'Yara', 'Ben', 'Zara', 'Victor', 'Imani', 'Paul', 'Lucia', 'Sam', 'Aaliyah', 'Henry', 'Rina', 'Omar', 'Elena', 'Jordan', 'Maya', 'Kai', 'Sara', 'Dev']
const LAST = ['Johnson', 'Nguyen', 'Garcia', 'Patel', 'Kim', 'Brown', 'Okoye', 'Silva', 'Murphy', 'Chen', 'Hassan', 'Rossi', 'Walker', 'Novak', 'Mensah', 'Ortiz', 'Reyes', 'Fischer', 'Ali', 'Turner', 'Moreau', 'Haddad', 'Lopez', 'Wright', 'Sato', 'Bianchi', 'Cohen', 'Hughes']
const CITIES = ['Columbus, OH', 'Memphis, TN', 'Dallas, TX', 'Chicago, IL', 'Atlanta, GA', 'Phoenix, AZ', 'Charlotte, NC', 'Indianapolis, IN', 'Newark, NJ', 'Denver, CO']
const ROLES = {
  northwind: [['Warehouse associate', 'IC'], ['Forklift operator', 'IC'], ['Inventory clerk', 'IC'], ['Shift supervisor', 'Manager'], ['Dispatch coordinator', 'IC'], ['Operations manager', 'Manager'], ['Site director', 'Director']],
  halcyon: [['Personal banker', 'IC'], ['Teller', 'IC'], ['Branch manager', 'Manager'], ['Loan officer', 'IC'], ['Regional director', 'Director'], ['Customer service rep', 'IC']],
  corvid: [['Reporter', 'IC'], ['Copy editor', 'IC'], ['Photo editor', 'IC'], ['Managing editor', 'Manager'], ['Audience producer', 'IC'], ['Executive editor', 'Director']],
}
const SKILLS = {
  northwind: ['Inventory systems', 'Forklift certified', 'Team scheduling', 'Safety compliance', 'Excel', 'WMS software', 'Vendor coordination', 'Quality checks'],
  halcyon: ['Customer service', 'Cash handling', 'Lending basics', 'Compliance', 'Sales', 'CRM', 'Coaching staff', 'Financial planning'],
  corvid: ['Writing', 'Editing', 'SEO', 'Video', 'Social media', 'Project management', 'Data reporting', 'Photography'],
}
const LANDED_AS = {
  IC: ['Logistics coordinator', 'Maintenance technician', 'Customer success associate', 'Claims specialist', 'Content specialist', 'Operations analyst', 'Junior data analyst', 'Patient access rep'],
  Manager: ['Operations lead', 'Program manager', 'Customer success manager', 'Content manager', 'Fulfillment manager'],
  Director: ['VP operations', 'Head of content', 'Director of member services'],
}
const COACH_FOR = { northwind: ['c1', 'c6', 'c8', 'c3'], halcyon: ['c2', 'c7', 'c8'], corvid: ['c5', 'c4', 'c3', 'c8'] }
const NOTES = ['Wants to stay near family, open to hybrid.', 'Interested in moving into data roles.', 'Needs help translating floor experience to resume.', 'Strong network, low confidence in interviews.', 'Exploring a certification before applying.', 'Prefers a smaller company.', 'Caring for a parent, needs flexible hours.', 'Asked about internal roles first.']

function build() {
  const out = []
  let n = 0
  for (const p of PROGRAMS) {
    const count = Math.round(p.seats * (p.id === 'northwind' ? 0.83 : p.id === 'halcyon' ? 0.87 : 0.8))
    const elapsed = Math.round((TODAY - p.start) / 864e5)
    for (let i = 0; i < count; i++) {
      n++
      const [title, level] = pick(ROLES[p.id])
      const enrolledAgo = int(Math.max(3, elapsed - 160), elapsed)
      const tenure = int(1, 18)
      const w = rnd()
      const ageBias = enrolledAgo / Math.max(elapsed, 1)
      let stage = w < 0.08 ? 0 : w < 0.2 ? 1 : w < 0.45 ? 2 : w < 0.62 ? 3 : w < 0.7 ? 4 : 5
      if (ageBias < 0.25 && stage > 2) stage = int(0, 2)
      if (ageBias > 0.7 && stage < 2 && rnd() < 0.6) stage = 5
      const skills = [...SKILLS[p.id]].sort(() => rnd() - 0.5).slice(0, int(3, 5))
      const lastActive = stage === 5 ? int(2, 40) : rnd() < 0.18 ? int(15, 34) : int(0, 9)
      const mood = Array.from({ length: 6 }, (_, k) => Math.max(1, Math.min(5, Math.round(3 + (stage - 2) * 0.35 + (rnd() - 0.5) * 2 - (k > 3 && rnd() < 0.15 ? 1.5 : 0)))))
      const landed = stage === 5
      const daysToLand = landed ? int(28, Math.min(enrolledAgo, 140) || 40) : null
      const internal = landed && p.redeploy && rnd() < 0.3
      const person = {
        id: `P-${String(1000 + n)}`,
        name: `${pick(FIRST)} ${pick(LAST)}`,
        program: p.id, employer: p.employer, title, level, city: pick(CITIES), tenure,
        coach: pick(COACH_FOR[p.id]),
        stage, enrolled: daysAgo(enrolledAgo), lastActive,
        resume: Math.min(98, int(42, 78) + stage * 4),
        apps: stage >= 2 ? int(3, 26) : int(0, 2), interviews: stage >= 3 ? int(1, 7) : 0,
        sessions: int(1, 3) + Math.floor(enrolledAgo / 21),
        mood, skills, consent: rnd() < 0.86,
        note: pick(NOTES),
        landed: landed ? { as: internal ? 'Internal: ' + pick(['Automation technician', 'Inventory analyst', 'Fleet planner', 'Audience analyst']) : pick(LANDED_AS[level]), days: daysToLand, pay: int(-8, 18), internal, on: daysAgo(Math.max(1, enrolledAgo - daysToLand)) } : null,
      }
      person.risk = riskOf(person)
      out.push(person)
    }
  }
  return out
}

function riskOf(p) {
  if (p.stage === 5) return []
  const r = []
  if (p.lastActive >= 14) r.push(`No activity for ${p.lastActive} days`)
  const m = p.mood
  if (m[5] <= 2 && m[2] >= 3) r.push('Mood dropped in the last two check-ins')
  if (p.stage >= 2 && p.apps >= 15 && p.interviews <= 1) r.push('Many applications, few interviews')
  if (p.resume < 55 && p.stage >= 2) r.push('Applying with a resume score under 55')
  return r
}

export const PEOPLE = build()
export const person = (id) => PEOPLE.find((p) => p.id === id)
export const coach = (id) => COACHES.find((c) => c.id === id)
export const program = (id) => PROGRAMS.find((p) => p.id === id)

// Weekly landed count for the last 16 weeks, per program.
export function weeklyLanded(ids) {
  const weeks = Array.from({ length: 10 }, (_, i) => { const d = new Date(TODAY); d.setDate(d.getDate() - (9 - i) * 7); return d })
  return {
    labels: weeks.map((d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
    series: PROGRAMS.filter((p) => ids.includes(p.id)).map((p) => ({
      name: p.employer,
      data: weeks.map((w, i) => PEOPLE.filter((x) => x.program === p.id && x.landed && x.landed.on <= w && (i === 0 || x.landed.on > weeks[i - 1])).length),
    })),
  }
}

// Sessions in the demo week (Mon 10 to Fri 14 Oct 2022), placed from the people and their coaches.
export const SESSIONS = (() => {
  const list = []
  const types = ['1:1 coaching', 'Resume review', 'Mock interview', 'Offer negotiation', 'Kickoff']
  const pool = PEOPLE.filter((p) => p.stage < 5)
  for (let d = 0; d < 5; d++) {
    for (const c of COACHES) {
      const k = int(1, 4)
      const used = new Set()
      for (let j = 0; j < k; j++) {
        let h = int(9, 16); while (used.has(h)) h = h === 16 ? 9 : h + 1
        used.add(h)
        const p = pick(pool.filter((x) => x.coach === c.id).length ? pool.filter((x) => x.coach === c.id) : pool)
        const type = p.stage === 0 ? 'Kickoff' : p.stage === 4 ? 'Offer negotiation' : p.stage === 3 ? pick(['Mock interview', '1:1 coaching']) : pick(types.slice(0, 2))
        const day = new Date(2022, 9, 10 + d, h, pick([0, 30]))
        list.push({ id: `S-${list.length + 1}`, coach: c.id, person: p.id, type, at: day, mins: type === 'Kickoff' ? 60 : 45, status: day < TODAY ? (rnd() < 0.08 ? 'No-show' : 'Done') : 'Booked' })
      }
    }
  }
  return list.sort((a, b) => a.at - b.at)
})()

// Internal openings the employer shared for redeployment.
export const OPENINGS = [
  { id: 'R-201', program: 'northwind', title: 'Automation technician', site: 'Columbus, OH', skills: ['Safety compliance', 'Quality checks', 'WMS software', 'Forklift certified'], pay: '$24 to $29 an hour', reskill: '6-week robotics maintenance course, paid' },
  { id: 'R-202', program: 'northwind', title: 'Inventory analyst', site: 'Remote', skills: ['Inventory systems', 'Excel', 'WMS software', 'Quality checks'], pay: '$58k to $66k', reskill: 'SQL basics, 4 weeks' },
  { id: 'R-203', program: 'northwind', title: 'Fleet planner', site: 'Dallas, TX', skills: ['Vendor coordination', 'Team scheduling', 'Excel'], pay: '$55k to $63k', reskill: 'None' },
  { id: 'R-204', program: 'northwind', title: 'Site safety lead', site: 'Memphis, TN', skills: ['Safety compliance', 'Team scheduling', 'Quality checks'], pay: '$61k to $70k', reskill: 'OSHA 30, 2 weeks' },
  { id: 'R-301', program: 'corvid', title: 'Audience analyst', site: 'Chicago, IL', skills: ['Data reporting', 'SEO', 'Social media'], pay: '$62k to $72k', reskill: 'GA4 certification, 2 weeks' },
  { id: 'R-302', program: 'corvid', title: 'Video producer', site: 'Hybrid, Atlanta, GA', skills: ['Video', 'Editing', 'Social media', 'Project management'], pay: '$60k to $70k', reskill: 'None' },
]
export function matches(o) {
  return PEOPLE.filter((p) => p.program === o.program && p.stage < 5)
    .map((p) => { const hit = o.skills.filter((k) => p.skills.includes(k)); return { p, hit, pct: Math.round((hit.length / o.skills.length) * 100) } })
    .filter((m) => m.pct >= 50).sort((a, b) => b.pct - a.pct || b.p.resume - a.p.resume).slice(0, 6)
}

// Demand index (0 to 100) for role families by metro, from the sample job feed.
export const MARKET = {
  metros: ['Columbus', 'Memphis', 'Dallas', 'Chicago', 'Atlanta', 'Phoenix', 'Charlotte', 'Denver'],
  families: ['Logistics and supply chain', 'Customer success', 'Healthcare admin', 'Data and analytics', 'Skilled trades', 'Sales', 'Content and marketing', 'Finance operations'],
}
MARKET.grid = MARKET.families.map((f, i) => MARKET.metros.map((m, j) => Math.round(25 + ((i * 37 + j * 53) % 60) + (i === 0 && j < 3 ? 15 : 0) + (i === 4 ? 10 : 0))))

export const fmt = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
export const fmtShort = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
export const initials = (n) => n.split(' ').map((x) => x[0]).join('').slice(0, 2)
export const avatarTone = (n) => ['#4c6fff', '#16a37f', '#f2994a', '#e5484d', '#8e4ec6', '#0091ff', '#d6409f', '#12a594'][n.charCodeAt(0) % 8]
