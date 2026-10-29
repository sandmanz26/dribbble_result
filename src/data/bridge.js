// Sample data for the prototype. Every score on screen is computed from these rows; nothing is typed in twice.
export const TODAY = new Date('2026-10-29T09:10:00')

// How much a piece of evidence counts. A claim counts a little, a link to the work more, a verified record fully.
export const STRENGTH = {
  verified: { v: 1, label: 'Verified', note: 'Checked by a person or a university record' },
  linked: { v: 0.7, label: 'Linked', note: 'You linked the work itself; nobody has checked it yet' },
  claimed: { v: 0.3, label: 'Claimed', note: 'Your own statement, no work attached' },
}
export const LEVEL = { 1: 'Foundation', 2: 'Working', 3: 'Advanced' }

// Short labels for chips, and the names as they read inside a sentence.
export const SKILL_SHORT = { py: 'Python', stats: 'Statistics', gis: 'GIS', sensors: 'Sensors', writing: 'Writing', ethics: 'Ethics', interview: 'Interviewing', coding: 'Coding', nlp: 'NLP', arabic: 'Arabic', wetlab: 'Wet lab', bio: 'Bioinformatics' }
export const SKILL_IN = { py: 'Python data analysis', stats: 'regression and statistics', gis: 'GIS mapping', sensors: 'sensor calibration', writing: 'scientific writing', ethics: 'human subjects ethics', interview: 'qualitative interviewing', coding: 'qualitative coding', nlp: 'text analysis (NLP)', arabic: 'Arabic reading', wetlab: 'wet-lab technique', bio: 'bioinformatics' }

export const SKILLS = {
  py: 'Python data analysis', stats: 'Regression and statistics', gis: 'GIS mapping', sensors: 'Sensor calibration',
  writing: 'Scientific writing', ethics: 'Human subjects ethics', interview: 'Qualitative interviewing', coding: 'Qualitative coding',
  nlp: 'Text analysis (NLP)', arabic: 'Arabic reading', wetlab: 'Wet-lab technique', bio: 'Bioinformatics',
}

export const STUDENT = {
  id: 'lina', name: 'Lina Haddad', first: 'Lina', year: 'Third year', programme: 'BSc Environmental Science', university: 'Northgate University',
  hours: 10, passport: 'BRG-7Q4-LH2',
}

export const EVIDENCE = [
  { id: 'e1', skill: 'gis', level: 2, strength: 'verified', kind: 'Course', title: 'GEOG 214 Introduction to GIS', detail: 'Grade A minus', by: 'Registrar record', date: '2025-12-18' },
  { id: 'e2', skill: 'py', level: 2, strength: 'verified', kind: 'Bridge task', title: 'Clean a week of sensor logs', detail: 'Scored 88 of 100', by: 'Reviewed by Dr. Amara Okonkwo’s lab', date: '2026-04-09' },
  { id: 'e3', skill: 'py', level: 1, strength: 'linked', kind: 'Code', title: 'air-quality-dashboard', detail: 'Repository, 1,240 lines of Python', by: 'Linked by you', date: '2026-02-02' },
  { id: 'e4', skill: 'sensors', level: 2, strength: 'verified', kind: 'Lab report', title: 'Calibrating low-cost PM2.5 sensors', detail: 'Graded 17 of 20', by: 'Verified by TA Jonah Pereira', date: '2026-03-21' },
  { id: 'e5', skill: 'ethics', level: 1, strength: 'verified', kind: 'Certificate', title: 'CITI Human Subjects Research, social and behavioural', detail: 'Valid until Sep 2028', by: 'CITI Program record', date: '2025-09-30' },
  { id: 'e6', skill: 'stats', level: 1, strength: 'verified', kind: 'Course', title: 'STAT 230 Applied Regression', detail: 'Grade B plus', by: 'Registrar record', date: '2026-05-14' },
  { id: 'e7', skill: 'writing', level: 1, strength: 'claimed', kind: 'Statement', title: 'Wrote two lab reports as lead author', detail: 'No file attached', by: 'You', date: '2026-06-01' },
  { id: 'e8', skill: 'arabic', level: 2, strength: 'claimed', kind: 'Statement', title: 'Arabic, home language', detail: 'No reading check yet', by: 'You', date: '2026-06-01' },
  { id: 'e9', skill: 'nlp', level: 1, strength: 'linked', kind: 'Notebook', title: 'Sentiment in campus survey comments', detail: 'Notebook link', by: 'Linked by you', date: '2026-08-11' },
]

export const PEOPLE = {
  okonkwo: { name: 'Dr. Amara Okonkwo', short: 'Okonkwo', lab: 'Urban Climate Lab', dept: 'Environmental Engineering', hue: 168 },
  ferreira: { name: 'Dr. Tomás Ferreira', short: 'Ferreira', lab: 'Computational Social Science Lab', dept: 'Sociology', hue: 28 },
  idris: { name: 'Dr. Salma Idris', short: 'Idris', lab: 'Coastal Lives Project', dept: 'Anthropology', hue: 292 },
  zhou: { name: 'Dr. Mei Lin Zhou', short: 'Zhou', lab: 'Wetland Ecology Group', dept: 'Biology', hue: 96 },
  mensah: { name: 'Dr. Joseph Mensah', short: 'Mensah', lab: 'Heat and Health Unit', dept: 'Public Health', hue: 220 },
  park: { name: 'Dr. Hana Park', short: 'Park', lab: 'Protein Design Lab', dept: 'Biochemistry', hue: 340 },
}

export const PROJECTS = [
  { id: 'bus-stop-heat', short: 'Bus-stop heat', pi: 'okonkwo', title: 'Mapping heat at bus stops with low-cost sensors', hours: 8, pay: 'Paid, $18 an hour, or course credit', start: '2027-01-11', deadline: '2026-11-20', spots: 2, photo: 'survey-pole',
    summary: 'Thirty sensors go up at bus stops across the east side this winter. You calibrate them, clean the logs, and map which stops run hottest at the hours people wait.',
    reqs: [{ skill: 'py', w: 30, level: 2 }, { skill: 'gis', w: 25, level: 2 }, { skill: 'sensors', w: 25, level: 2 }, { skill: 'stats', w: 20, level: 2 }] },
  { id: 'campus-air-network', short: 'Air network', pi: 'okonkwo', title: 'Campus air-quality network, field technician', hours: 6, pay: 'Paid, $17 an hour', start: '2026-11-16', deadline: '2026-11-06', spots: 1, photo: 'gps-moor',
    summary: 'Keep twelve campus sensors running through the winter: swap filters, check readings against the reference station, and log every fault.',
    reqs: [{ skill: 'sensors', w: 40, level: 2 }, { skill: 'py', w: 30, level: 1 }, { skill: 'gis', w: 30, level: 1 }] },
  { id: 'wetland-nitrogen', short: 'Wetland nitrogen', pi: 'zhou', title: 'Nitrogen in restored wetlands: sampling and analysis', hours: 10, pay: 'Course credit', start: '2027-02-01', deadline: '2026-12-04', spots: 3, photo: 'water-test',
    summary: 'Monthly water samples from four restored wetlands, analysed in the lab, then a model of how nitrogen falls with distance from the inflow.',
    reqs: [{ skill: 'wetlab', w: 30, level: 1 }, { skill: 'stats', w: 30, level: 1 }, { skill: 'gis', w: 20, level: 1 }, { skill: 'writing', w: 20, level: 1 }] },
  { id: 'telegram-rumours', short: 'Telegram rumours', pi: 'ferreira', title: 'How health rumours travel in Arabic Telegram channels', hours: 8, pay: 'Paid, $18 an hour', start: '2027-01-18', deadline: '2026-11-27', spots: 2, photo: 'laptops-pair',
    summary: 'Follow forty public channels for a year of posts, label rumours with a codebook, and trace how each one spreads and is corrected.',
    reqs: [{ skill: 'nlp', w: 30, level: 2 }, { skill: 'py', w: 25, level: 2 }, { skill: 'arabic', w: 25, level: 2 }, { skill: 'ethics', w: 20, level: 1 }] },
  { id: 'fishing-oral-histories', short: 'Fishing histories', pi: 'idris', title: 'Oral histories of Red Sea fishing families', hours: 6, pay: 'Course credit', start: '2027-01-25', deadline: '2026-12-11', spots: 2, photo: 'library-shelves',
    summary: 'Record and transcribe interviews with three generations of fishing families, then code them for how the catch, the coast and the work have changed.',
    reqs: [{ skill: 'interview', w: 35, level: 2 }, { skill: 'coding', w: 25, level: 1 }, { skill: 'ethics', w: 20, level: 1 }, { skill: 'arabic', w: 20, level: 2 }] },
  { id: 'protein-stability', short: 'Protein stability', pi: 'park', title: 'Screening protein stability against structure predictions', hours: 12, pay: 'Paid, $19 an hour', start: '2027-01-11', deadline: '2026-11-30', spots: 1, photo: 'microscope-group',
    summary: 'Measure how two hundred enzyme variants hold up to heat and compare each with its predicted structure.',
    reqs: [{ skill: 'wetlab', w: 35, level: 2 }, { skill: 'bio', w: 30, level: 2 }, { skill: 'py', w: 20, level: 1 }, { skill: 'stats', w: 15, level: 1 }] },
]

// What closes each gap: a Bridge micro-task, reviewed by a person, or a record to upload.
export const CLOSERS = {
  stats: { what: 'Fit a mixed-effects model to campus temperature data', how: 'Bridge task, about 3 hours, reviewed by a lab member', counts: 'verified' },
  writing: { what: 'Upload a graded lab report and ask your TA to verify it', how: 'About 5 minutes, then the TA confirms', counts: 'verified' },
  arabic: { what: 'Take the Arabic reading check', how: '20 minutes, scored at once', counts: 'verified' },
  nlp: { what: 'Label 200 posts with a codebook and report agreement', how: 'Bridge task, about 4 hours, reviewed by a lab member', counts: 'verified' },
  interview: { what: 'Join the ethnographic interviewing workshop', how: 'Two Saturdays in February, certificate on completion', counts: 'verified' },
  coding: { what: 'Code ten interview excerpts with the starter codebook', how: 'Bridge task, about 2 hours, reviewed', counts: 'verified' },
  wetlab: { what: 'Book the pipetting and sample-handling induction', how: 'One afternoon in the teaching lab, signed off by a technician', counts: 'verified' },
  bio: { what: 'Complete the Biopython starter notebook', how: 'Bridge task, about 3 hours, reviewed', counts: 'verified' },
  py: { what: 'Take the data-cleaning task', how: 'Bridge task, about 2 hours, reviewed', counts: 'verified' },
  gis: { what: 'Map a provided dataset in QGIS and share the project file', how: 'Bridge task, about 2 hours, reviewed', counts: 'verified' },
  sensors: { what: 'Calibrate a sensor against the reference station', how: 'One session with the lab technician', counts: 'verified' },
  ethics: { what: 'Complete CITI Human Subjects training', how: 'About 4 hours online, certificate on completion', counts: 'verified' },
}

// Best evidence for a skill, and how much it counts against a required level.
export function bestFor(evidence, skill, level) {
  const own = evidence.filter((e) => e.skill === skill)
  let best = null
  for (const e of own) {
    const base = STRENGTH[e.strength].v
    const fit = e.level >= level ? 1 : 0.5
    const v = base * fit
    if (!best || v > best.v) best = { e, v, short: e.level < level }
  }
  return best || { e: null, v: 0, short: false }
}

export function readiness(project, evidence = EVIDENCE) {
  const rows = project.reqs.map((r) => {
    const b = bestFor(evidence, r.skill, r.level)
    const pts = Math.round(r.w * b.v * 10) / 10
    return { ...r, name: SKILLS[r.skill], best: b.e, v: b.v, short: b.short, pts, gap: Math.round((r.w - pts) * 10) / 10 }
  })
  const score = Math.round(rows.reduce((s, r) => s + r.pts, 0))
  const missing = rows.filter((r) => r.v < 1).sort((a, b) => b.gap - a.gap)
  return { score, rows, missing, ready: score >= 75 }
}

PROJECTS.forEach((p) => console.assert(p.reqs.reduce((s, r) => s + r.w, 0) === 100, `weights of ${p.id} add to 100`))

export const APPLICATIONS = [
  { project: 'bus-stop-heat', state: 'shortlisted', at: '2026-10-21', note: 'Shortlisted. Interview Wednesday 4 November, 14:00, Engineering 2.14' },
  { project: 'campus-air-network', state: 'draft', at: '2026-10-28', note: 'Draft. Closes Friday 6 November' },
]

export const CREDIT_ROLES = ['Conceptualization', 'Data curation', 'Formal analysis', 'Funding acquisition', 'Investigation', 'Methodology', 'Project administration', 'Resources', 'Software', 'Supervision', 'Validation', 'Visualization', 'Writing: original draft', 'Writing: review and editing']

export const CONTRIBUTIONS = [
  { id: 'c1', project: 'Campus air-quality pilot', lab: 'Urban Climate Lab', pi: 'okonkwo', from: '2026-03-02', to: '2026-06-26', hours: 96,
    roles: ['Data curation', 'Investigation', 'Software'], output: 'Dataset: Campus PM2.5, spring 2026 (lab repository)', state: 'verified', on: '2026-07-02',
    words: 'Lina cleaned and documented four months of sensor logs and wrote the script the lab now uses to flag drift.' },
  { id: 'c2', project: 'Heat and health literature review', lab: 'Heat and Health Unit', pi: 'mensah', from: '2026-09-07', to: '2026-10-23', hours: 30,
    roles: ['Investigation', 'Writing: review and editing'], output: 'Review draft, 46 sources screened', state: 'pending', on: null, words: null },
]

// The researcher's side: Dr. Okonkwo's two open projects and who applied.
export const RESEARCHER = { id: 'okonkwo', first: 'Amara' }

const A = (id, project, scores, hours, at, state, name = null) => ({ id, project, scores, hours, at, state, name })
// scores: strength per required skill, in the project's requirement order (1 verified at level, 0.7 linked, 0.5 below level, 0.3 claimed, 0 none)
export const APPLICANTS = [
  A('A-31', 'bus-stop-heat', [1, 1, 1, 0.5], 10, '2026-10-21', 'shortlisted', 'Lina Haddad'),
  A('A-27', 'bus-stop-heat', [1, 0.7, 1, 1], 8, '2026-10-19', 'shortlisted', 'Omar Siddiqui'),
  A('A-44', 'bus-stop-heat', [0.7, 1, 0.5, 1], 12, '2026-10-26', 'new'),
  A('A-39', 'bus-stop-heat', [1, 0.5, 0.3, 1], 8, '2026-10-24', 'new'),
  A('A-12', 'bus-stop-heat', [0.7, 0.7, 0.7, 0.5], 6, '2026-10-14', 'task'),
  A('A-50', 'bus-stop-heat', [1, 0, 0.5, 0.7], 10, '2026-10-27', 'new'),
  A('A-48', 'bus-stop-heat', [0.3, 1, 0, 1], 8, '2026-10-27', 'new'),
  A('A-35', 'bus-stop-heat', [0.5, 0.3, 0.3, 0.7], 8, '2026-10-23', 'new'),
  A('A-08', 'bus-stop-heat', [0.3, 0.3, 0, 0.5], 4, '2026-10-12', 'declined'),
  A('A-41', 'campus-air-network', [1, 0.7, 1], 6, '2026-10-25', 'new'),
  A('A-46', 'campus-air-network', [0.5, 1, 0.7], 8, '2026-10-26', 'new'),
  A('A-29', 'campus-air-network', [0.3, 0.7, 1], 6, '2026-10-22', 'new'),
]
export const scoreOf = (a) => { const p = PROJECTS.find((x) => x.id === a.project); return Math.round(p.reqs.reduce((s, r, i) => s + r.w * a.scores[i], 0)) }

// Lina's applicant score must match her own readiness for the same project.
console.assert(scoreOf(APPLICANTS[0]) === readiness(PROJECTS[0]).score, 'A-31 score matches Lina’s readiness')

export const VERIFY = [
  { id: 'v1', who: 'Omar Siddiqui', project: 'Campus air-quality pilot', from: '2026-03-02', to: '2026-06-26', hours: 88, roles: ['Investigation', 'Validation'], asked: '2026-10-26' },
  { id: 'v2', who: 'Priya Raman', project: 'Rooftop temperature loggers', from: '2026-05-04', to: '2026-08-14', hours: 120, roles: ['Data curation', 'Visualization', 'Software'], asked: '2026-10-20' },
  { id: 'v3', who: 'Daniel Osei', project: 'Rooftop temperature loggers', from: '2026-06-01', to: '2026-08-14', hours: 40, roles: ['Investigation'], asked: '2026-10-09' },
]

export const VIEWS = [
  { who: 'Dr. Amara Okonkwo, Urban Climate Lab', at: '2026-10-27T16:42', via: 'Your application to Mapping heat at bus stops' },
  { who: 'Someone with your passport link', at: '2026-10-24T09:05', via: 'Passport link sent on 23 October' },
  { who: 'Dr. Amara Okonkwo, Urban Climate Lab', at: '2026-10-22T11:18', via: 'Your application to Mapping heat at bus stops' },
]

export const projectOf = (id) => PROJECTS.find((p) => p.id === id)
export const daysUntil = (iso) => Math.round((new Date(iso + 'T23:59:00') - TODAY) / 86400000)
