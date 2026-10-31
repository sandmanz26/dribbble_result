// Sample content for the prototype. Names, companies, citations, scores, dates and fees are placeholders.
// Portraits are placeholders too (see Credits); the people shown are not the people named here.

export const YEAR = 2027
export const DATES = [
  { key: 'open', label: 'Entries open', date: '2026-11-02' },
  { key: 'early', label: 'Early entry closes', date: '2027-01-15' },
  { key: 'close', label: 'Entries close', date: '2027-02-26' },
  { key: 'shortlist', label: 'Shortlists published', date: '2027-04-20' },
  { key: 'ceremony', label: 'Winners named in New York', date: '2027-06-03' },
]
export const dateOf = (k) => new Date(DATES.find((d) => d.key === k).date + 'T12:00:00')
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
export const fmtDate = (d, short = false) => `${d.getDate()} ${short ? MONTHS[d.getMonth()].slice(0, 3) : MONTHS[d.getMonth()]}${short ? '' : ` ${d.getFullYear()}`}`

export const GROUPS = [
  { key: 'innovation', name: 'Innovation', says: 'New products that change what the work looks like.' },
  { key: 'experience', name: 'Experience', says: 'Software people choose to use, and can.' },
  { key: 'growth', name: 'Growth', says: 'Companies that grew on product, not on spend.' },
  { key: 'leadership', name: 'Leadership', says: 'The people behind the products.' },
]

// Weights are percentages and add up to 100 in every category.
export const CATEGORIES = [
  { slug: 'best-fintech-innovation', group: 'innovation', name: 'Best FinTech Innovation', for: 'A product that makes moving, lending, saving or accounting for money simpler or fairer.', keys: 'payments banking lending invoices accounting money finance cards treasury payroll',
    criteria: [['Problem and proof', 30], ['Safety and compliance', 25], ['Ease for the customer', 25], ['Results since launch', 20]] },
  { slug: 'best-ai-agent', group: 'innovation', name: 'Best AI Agent', for: 'Software that completes real work on its own and hands it back with its reasons.', keys: 'ai agent automation llm assistant model autonomous workflow copilot',
    criteria: [['Work done end to end', 30], ['Shows its reasons', 25], ['Safe by default', 25], ['Measured results', 20]] },
  { slug: 'best-developer-tool', group: 'innovation', name: 'Best Developer Tool', for: 'A tool that removes a step from building, shipping or running software.', keys: 'developer api sdk devops cli testing deploy code infrastructure observability',
    criteria: [['Time saved', 30], ['Quality of the docs', 20], ['Reliability', 30], ['Community adoption', 20]] },
  { slug: 'best-security-product', group: 'innovation', name: 'Best Security Product', for: 'Protection that teams keep switched on because it does not get in the way.', keys: 'security identity privacy compliance encryption access fraud soc',
    criteria: [['Threat covered', 30], ['Low friction', 25], ['Evidence of catches', 25], ['Transparency', 20]] },
  { slug: 'best-data-platform', group: 'innovation', name: 'Best Data Platform', for: 'A product that turns scattered data into answers people trust.', keys: 'data analytics bi warehouse dashboards reporting metrics etl',
    criteria: [['Answers people trust', 30], ['Time to first answer', 25], ['Governance', 25], ['Scale', 20]] },
  { slug: 'most-user-friendly', group: 'experience', name: 'Most User-Friendly', for: 'The product new users understand without a manual, a call or a course.', keys: 'ux usability design onboarding simple easy interface',
    criteria: [['First-use success', 35], ['Clarity of language', 20], ['Accessibility', 25], ['Support needed', 20]] },
  { slug: 'best-onboarding', group: 'experience', name: 'Best Onboarding', for: 'The fastest honest path from sign-up to the first useful result.', keys: 'onboarding activation signup setup trial first run',
    criteria: [['Time to first value', 35], ['Drop-off reduced', 25], ['Respect for the user', 20], ['Help when stuck', 20]] },
  { slug: 'best-accessibility', group: 'experience', name: 'Best Accessibility', for: 'A product built so people with disabilities can do the whole job, not part of it.', keys: 'accessibility a11y screen reader inclusive wcag keyboard',
    criteria: [['Whole tasks completed', 35], ['Tested with users', 25], ['Standards met', 20], ['Ongoing commitment', 20]] },
  { slug: 'best-bootstrapped-saas', group: 'growth', name: 'Best Bootstrapped SaaS', for: 'A software business grown on customer revenue, with little or no outside funding.', keys: 'bootstrapped saas revenue profitable indie small business subscription',
    criteria: [['Revenue quality', 30], ['Customer love', 30], ['Efficiency', 20], ['Product craft', 20]] },
  { slug: 'best-vertical-saas', group: 'growth', name: 'Best Vertical SaaS', for: 'Software built for one industry and its real workflow, from clinics to construction.', keys: 'vertical industry healthcare clinic construction legal logistics restaurant education',
    criteria: [['Fit to the trade', 35], ['Adoption in the trade', 25], ['Outcomes', 25], ['Integration', 15]] },
  { slug: 'tech-leader-of-the-year', group: 'leadership', name: 'Tech Leader of the Year', for: 'A leader whose decisions made their product, team and customers better this year.', keys: 'leader ceo cto founder executive manager leadership',
    criteria: [['Decisions and results', 35], ['Team built', 25], ['Customers served', 20], ['Integrity', 20]] },
  { slug: 'breakthrough-founder', group: 'leadership', name: 'Breakthrough Founder', for: 'A founder in their first five years whose product already changed how a field works.', keys: 'founder startup early new company first breakthrough',
    criteria: [['What changed', 35], ['Traction', 25], ['Team and culture', 20], ['Vision with evidence', 20]] },
]
export const catOf = (slug) => CATEGORIES.find((c) => c.slug === slug)

export const JURY = [
  { slug: 'renee-thomas', name: 'Renée Thomas', role: 'Jury chair', org: 'Former VP Product, a payments company', photo: 'p-05', bio: 'Twenty years building payments and lending products in New York and London. Chairs the jury, scores like every other juror and breaks ties.', declares: 'No current advisory roles. Holds no shares in any entrant.', recused: [], judges: ['best-fintech-innovation', 'most-user-friendly', 'tech-leader-of-the-year', 'best-vertical-saas', 'best-bootstrapped-saas'] },
  { slug: 'luis-moreno', name: 'Luis Moreno', role: 'Juror', org: 'Engineering director, a cloud company', photo: 'p-02', bio: 'Leads platform teams that run software for a few hundred thousand developers. Judges on reliability, not demos.', declares: 'Angel investor in two developer-tool startups, neither entered this year.', recused: [], judges: ['best-developer-tool', 'best-ai-agent', 'best-security-product', 'breakthrough-founder', 'best-data-platform', 'best-bootstrapped-saas'] },
  { slug: 'jonas-berg', name: 'Jonas Berg', role: 'Juror', org: 'Partner, a seed fund', photo: 'p-03', bio: 'Backs early SaaS companies across Europe and the US. Joined to judge growth on revenue quality, not headlines.', declares: 'His fund holds a stake in an entrant to Best Bootstrapped SaaS. He does not score that category.', recused: ['best-bootstrapped-saas'], judges: ['breakthrough-founder', 'best-vertical-saas', 'best-bootstrapped-saas', 'tech-leader-of-the-year'] },
  { slug: 'adam-klein', name: 'Adam Klein', role: 'Juror', org: 'Chief information security officer, a hospital group', photo: 'p-08', bio: 'Buys and runs security software for 40,000 staff. Asks what the product caught last quarter.', declares: 'No financial interest in any entrant.', recused: [], judges: ['best-security-product', 'best-data-platform', 'best-ai-agent', 'best-developer-tool'] },
  { slug: 'sara-malik', name: 'Sara Malik', role: 'Juror', org: 'Accessibility lead, a public broadcaster', photo: 'p-09', bio: 'Runs accessibility testing with disabled users every week. Scores whole tasks, not checklists.', declares: 'Unpaid adviser to a nonprofit that entered Best Accessibility. She does not score that entry.', recused: [], judges: ['best-accessibility', 'most-user-friendly', 'best-onboarding'] },
  { slug: 'nia-adeyemi', name: 'Nia Adeyemi', role: 'Juror', org: 'Head of research, a design consultancy', photo: 'p-10', bio: 'Leads usability research for banks, insurers and health services in the US and West Africa.', declares: 'Her consultancy worked for one entrant in 2025. She does not score that entry.', recused: [], judges: ['most-user-friendly', 'best-onboarding', 'best-fintech-innovation', 'best-accessibility'] },
]
export const jurorOf = (slug) => JURY.find((j) => j.slug === slug)

// 2026 winners. scores[juror] = one score out of 10 per criterion, in the category's criteria order.
export const WINNERS = [
  { slug: 'mei-lin-zhao', name: 'Mei Lin Zhao', role: 'Co-founder and CEO', company: 'Relaywise', city: 'Seattle', photo: 'p-04', cat: 'best-ai-agent',
    citation: 'for an agent that closes support tickets end to end and shows the customer every step it took.',
    product: 'Relaywise answers and resolves customer support tickets, then attaches its reasoning to each reply.',
    facts: [['Tickets resolved without a person', '61%'], ['Customer reopen rate', '3.4%'], ['Founded', '2023']],
    scores: { 'luis-moreno': [9, 9, 8, 8], 'adam-klein': [8, 9, 9, 8] } },
  { slug: 'marcus-bell', name: 'Marcus Bell', role: 'Founder and CEO', company: 'Ledgerline', city: 'Atlanta', photo: 'p-06', cat: 'best-fintech-innovation',
    citation: 'for paying small suppliers the day they invoice, at a price they can read in one line.',
    product: 'Ledgerline pays suppliers on invoice day and collects from the buyer later, with one flat fee shown before signing.',
    facts: [['Suppliers paid', '18,400'], ['Average days to cash', '0.9'], ['Founded', '2021']],
    scores: { 'renee-thomas': [9, 8, 9, 8], 'nia-adeyemi': [9, 8, 10, 8] } },
  { slug: 'ana-ribeiro', name: 'Ana Ribeiro', role: 'Head of design', company: 'Tallyhand', city: 'Austin', photo: 'p-11', cat: 'most-user-friendly',
    citation: 'for bookkeeping that a first-time shop owner finished in eleven minutes, with no call to support.',
    product: 'Tallyhand is bookkeeping for owner-run shops, written in plain words and usable with a screen reader.',
    facts: [['Median first-session time', '11 min'], ['Support contacts per 100 users', '1.8'], ['Founded', '2020']],
    scores: { 'renee-thomas': [9, 9, 8, 9], 'sara-malik': [9, 9, 9, 8], 'nia-adeyemi': [10, 9, 8, 9] } },
  { slug: 'daniel-reyes', name: 'Daniel Reyes', role: 'Founder', company: 'Patchbay', city: 'San Francisco', photo: 'p-13', cat: 'best-developer-tool',
    citation: 'for turning a failed deploy into a fix you can review in the same minute.',
    product: 'Patchbay reads a failed deploy, proposes a fix as a pull request and explains the cause in two sentences.',
    facts: [['Teams using it weekly', '3,100'], ['Median time to fix', '6 min'], ['Founded', '2024']],
    scores: { 'luis-moreno': [9, 8, 9, 8], 'adam-klein': [8, 9, 9, 7] } },
  { slug: 'david-cho', name: 'David Cho', role: 'Chief technology officer', company: 'Quietlock', city: 'Boston', photo: 'p-07', cat: 'best-security-product',
    citation: 'for sign-in protection that stopped account takeovers without adding a single step for honest users.',
    product: 'Quietlock scores every sign-in in the background and asks for proof only when something is wrong.',
    facts: [['Takeovers stopped in 2025', '41,000'], ['Extra steps for normal sign-ins', 'None'], ['Founded', '2019']],
    scores: { 'luis-moreno': [9, 9, 8, 8], 'adam-klein': [9, 9, 9, 7] } },
  { slug: 'yasmin-haddad', name: 'Yasmin Haddad', role: 'Founder and CEO', company: 'Clinicly', city: 'Chicago', photo: 'p-12', cat: 'best-vertical-saas',
    citation: 'for giving small clinics back an hour a day, by building the front desk around how they already work.',
    product: 'Clinicly runs booking, intake and billing for independent clinics, set up in an afternoon.',
    facts: [['Clinics live', '2,300'], ['Front-desk time saved', '62 min a day'], ['Founded', '2021']],
    scores: { 'jonas-berg': [9, 9, 8, 8], 'renee-thomas': [9, 8, 9, 8] } },
  { slug: 'thomas-weller', name: 'Thomas Weller', role: 'Chief executive', company: 'Northgrid Software', city: 'Denver', photo: 'p-01', cat: 'tech-leader-of-the-year',
    citation: 'for moving a 900-person company to four-day releases while cutting customer-reported bugs by half.',
    product: 'Northgrid makes scheduling software for utilities and field teams across North America.',
    facts: [['Release cadence', 'every 4 days'], ['Customer-reported bugs', '-52%'], ['Employees', '900']],
    scores: { 'renee-thomas': [9, 9, 8, 9], 'jonas-berg': [9, 8, 9, 9] } },
]
export const winnerOf = (slug) => WINNERS.find((w) => w.slug === slug)
export const winnerFor = (cat) => WINNERS.find((w) => w.cat === cat)

// Weighted total out of 100: each criterion's mean score (out of 10) times its weight, summed.
export function scoreOf(w) {
  const c = catOf(w.cat)
  const jurors = Object.keys(w.scores)
  const means = c.criteria.map((_, i) => jurors.reduce((s, j) => s + w.scores[j][i], 0) / jurors.length)
  const total = c.criteria.reduce((s, [, wt], i) => s + (means[i] * wt) / 10, 0)
  return { jurors, means, total: Math.round(total * 10) / 10 }
}

export const FINALISTS = {
  'best-ai-agent': ['Relaywise', 'Quillstack', 'Fieldmind', 'Openbook Ops'],
  'best-fintech-innovation': ['Ledgerline', 'Coinharbor', 'Paywell', 'Stillwater Pay'],
  'most-user-friendly': ['Tallyhand', 'Plainform', 'Roomkey', 'Kindred HR'],
  'best-developer-tool': ['Patchbay', 'Sigil CI', 'Tracebird', 'Shipnote'],
  'best-security-product': ['Quietlock', 'Hallpass ID', 'Ninefold', 'Seawall'],
  'best-vertical-saas': ['Clinicly', 'Groundwork', 'Lawpad', 'Freightbook'],
  'tech-leader-of-the-year': ['Thomas Weller, Northgrid', 'Priya Natarajan, Openbook', 'Sam Okafor, Paywell'],
}

export const FEES = [
  { group: 'Entering', items: [
    ['One category', 295, 'Early entry until 15 January: $245'],
    ['Each further category', 150, 'Same product, written for that category'],
    ['Company under $2M a year in revenue', 95, 'Per category, any time before the deadline'],
    ['Nonprofits and open-source projects', 0, 'Free, one category'],
  ] },
  { group: 'The evening in New York', items: [
    ['Ceremony seat', 350, 'Dinner and the ceremony, 3 June'],
    ['Table of ten', 3200, 'Finalists get two seats free'],
    ['Watch online', 0, 'Free, with the winners and their scorecards live'],
  ] },
]
export const NEVER = ['A higher score', 'A place on a shortlist', 'A category made for your company', 'Your logo on a winner’s page']

export const FAQ = [
  ['Who can enter?', 'Any company selling software, from anywhere. In 2027 the ceremony is in New York and most jurors work in the US; entries from other countries are judged the same way.'],
  ['How are winners chosen?', 'Each entry is scored by at least two jurors on the category’s published criteria. The highest weighted total wins. Ties go to the jury chair. Every winner’s scores are published with the citation.'],
  ['Can a juror judge a company they are connected to?', 'No. Jurors declare their interests before judging. A juror with a connection is recused from that entry or that whole category, and the page says so.'],
  ['What do I need for an entry?', 'A 400-word answer per criterion, a link to the product or a demo account, and evidence for any number you quote. There is no word count for the product itself.'],
  ['What happens if my product is not eligible?', 'We tell you within ten days of entering and refund the fee in full.'],
  ['Do winners pay anything?', 'No. Winners receive the award, the citation and a page with their scorecard. There is no winner’s package to buy.'],
]
