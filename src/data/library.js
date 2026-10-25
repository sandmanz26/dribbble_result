// The practice library. Breath patterns are counts in seconds per phase; herbs carry their
// cautions so the ritual can swap one out when the profile says it is not right for this person.
// Herbal notes follow NCCIH "at a glance" summaries in tone: traditional use, small studies,
// no cure claims. Sample content for the prototype: a herbalist and clinician must review it.

export const MOODS = [
  { id: 'bright', label: 'Bright', line: 'Clear and easy', icon: 'sun' },
  { id: 'steady', label: 'Steady', line: 'Fine, a bit flat', icon: 'cloud' },
  { id: 'heavy', label: 'Heavy', line: 'Low or slow', icon: 'heavy' },
  { id: 'stormy', label: 'Stormy', line: 'Wound up, on edge', icon: 'bolt' },
  { id: 'tired', label: 'Tired', line: 'Running on empty', icon: 'moon' },
]

export const BREATHS = {
  long: { name: 'Long exhale', counts: [4, 0, 6, 0], why: 'Breathing out for longer than you breathe in is a simple way to slow down.', field: 'sky' },
  box: { name: 'Box breathing', counts: [4, 4, 4, 4], why: 'Even, counted breaths give a busy mind one thing to hold on to.', field: 'sky' },
  478: { name: '4-7-8', counts: [4, 7, 8, 0], why: 'A long hold and a slow exhale, often used to wind down before sleep.', field: 'night' },
  coherent: { name: 'Even breath', counts: [5, 0, 5, 0], why: 'Five seconds in, five out. About six breaths a minute.', field: 'sky' },
}

export const SITS = {
  ground: { name: 'Five things', kind: 'Grounding', line: 'Name five things you see, four you hear, three you can touch.', field: 'clay' },
  scan: { name: 'Body scan', kind: 'Rest', line: 'Move your attention from your feet to your face, slowly.', field: 'night' },
  count: { name: 'Counting breaths', kind: 'Focus', line: 'Count each out-breath to ten, then start again.', field: 'sky' },
  kind: { name: 'Kind words', kind: 'Warmth', line: 'Offer yourself the words you would give a friend today.', field: 'clay' },
  open: { name: 'Open sky', kind: 'Awareness', line: 'Let thoughts pass like weather. Notice, do not follow.', field: 'sky' },
}

export const HERBS = {
  lemonbalm: {
    latin: 'Melissa officinalis', name: 'Lemon balm', part: 'Leaf', prep: 'Infusion', steep: 300,
    amount: '1 to 2 teaspoons dried leaf in 250 ml water just off the boil',
    when: 'Afternoon or evening', taste: 'Bright, lemony, a little grassy',
    use: 'Traditionally used for restlessness. Small studies suggest it may help with mild stress.',
    cautions: [{ flag: 'thyroid', text: 'May affect thyroid medicine. Ask your clinician first.' }, { flag: 'sedatives', text: 'May add to the effect of sleep medicine.' }],
    evidence: 'Limited', field: 'sage',
  },
  chamomile: {
    latin: 'Matricaria chamomilla', name: 'Chamomile', part: 'Flower', prep: 'Infusion', steep: 300,
    amount: '1 tablespoon dried flowers in 250 ml water just off the boil, covered',
    when: 'An hour before bed', taste: 'Soft, honeyed, like hay in the sun',
    use: 'Used for centuries for sleep and an unsettled stomach. Tea-level amounts are likely safe for most people.',
    cautions: [{ flag: 'ragweed', text: 'Skip it if you react to ragweed, daisies or marigolds.' }, { flag: 'thinners', text: 'May interact with blood thinners such as warfarin.' }, { flag: 'pregnant', text: 'Ask your midwife or doctor before regular use in pregnancy.' }],
    evidence: 'Some', field: 'sage',
  },
  peppermint: {
    latin: 'Mentha × piperita', name: 'Peppermint', part: 'Leaf', prep: 'Infusion', steep: 240,
    amount: '1 teaspoon dried leaf or a small handful fresh in 250 ml hot water',
    when: 'Morning or after lunch', taste: 'Cool and sharp',
    use: 'A common, gentle tea. Many people find the cool aroma clears the head.',
    cautions: [{ flag: 'reflux', text: 'Can make heartburn or reflux worse.' }],
    evidence: 'Limited', field: 'sage',
  },
  ginger: {
    latin: 'Zingiber officinale', name: 'Ginger', part: 'Root', prep: 'Decoction', steep: 600,
    amount: '4 thin slices of fresh root simmered in 300 ml water',
    when: 'Morning', taste: 'Warm, peppery',
    use: 'A warming kitchen herb, traditionally taken on cold, slow mornings. Studied mostly for nausea.',
    cautions: [{ flag: 'thinners', text: 'Large amounts may add to the effect of blood thinners.' }],
    evidence: 'Some', field: 'sage',
  },
  rooibos: {
    latin: 'Aspalathus linearis', name: 'Rooibos', part: 'Leaf and stem', prep: 'Infusion', steep: 300,
    amount: '1 teaspoon in 250 ml boiling water',
    when: 'Any time', taste: 'Sweet, nutty, no caffeine',
    use: 'A caffeine-free tea with no known common interactions. A safe swap when other herbs do not suit you.',
    cautions: [],
    evidence: 'Tradition', field: 'sage',
  },
}

export const FLAGS = [
  { id: 'pregnant', label: 'Pregnant or breastfeeding' },
  { id: 'thinners', label: 'I take blood thinners' },
  { id: 'sedatives', label: 'I take sleep or anxiety medicine' },
  { id: 'thyroid', label: 'I take thyroid medicine' },
  { id: 'ragweed', label: 'Allergic to ragweed or daisies' },
  { id: 'reflux', label: 'I get heartburn or reflux' },
]
