// The design decision log, shown on the design system page. Each entry: what we saw,
// what we decided, and the reason (research, a measurement, or a principle).
export const DECISIONS = [
  {
    area: 'Check-in', title: 'Mood is weather, answered in one tap',
    saw: 'Mood scales of 1 to 10 ask people to rate themselves, which feels like a test first thing in the morning.',
    did: 'Five weather words with one line each: bright, steady, heavy, stormy, tired.',
    why: 'A metaphor is quicker to answer honestly than a number, and the dashboard can then read like a forecast instead of a score.',
  },
  {
    area: 'Check-in', title: 'A conversation, one question at a time',
    saw: 'The brief asks for conversational intake. Forms with five fields feel like admin.',
    did: 'Tend asks, you tap, the answer appears as your reply. One question on screen at a time, a counter in the bar.',
    why: 'One question per screen is the rule for app screens. A note at the top says why we ask and that answers stay on the phone, which also fills the empty first screen with something useful.',
  },
  {
    area: 'Colour', title: 'Colour means a practice, never a mood',
    saw: 'The first pass gave each mood its own colour. Five hues on the check-in and the calendar read as a rainbow and competed with the practice colours.',
    did: 'Moods are told apart by their icon shape, in ink. Colour belongs only to the five practices: sky, sage, clay, night, paper. Teal marks the next action.',
    why: 'One meaning per colour. A person learns “green means the tea” in one ritual; if green also meant a mood, the code would never settle.',
  },
  {
    area: 'Ritual', title: 'The step to do now is the biggest thing on screen',
    saw: 'Four steps at the same size made the ritual a menu. People had to work out where to start.',
    did: 'The current step opens large with its reason and one Start button. Done and later steps fold to a single line each.',
    why: 'The screen has one question: what do I do now? The largest block answers it. Competitors such as Headspace and Balance win beginners with one obvious next step.',
  },
  {
    area: 'Ritual', title: 'Every step says why it was chosen',
    saw: 'Herbal apps tell you what to take without saying why, which our research flagged as their main trust gap.',
    did: 'The open step always shows its reason, tied to what you said (“You said you feel stormy, so the exhale is longer than the inhale”).',
    why: 'Trust is the product. Showing the reason costs one line and turns a suggestion into a decision the person can agree with.',
  },
  {
    area: 'Herbs', title: 'Checked against the profile before it is shown',
    saw: 'A herb that clashes with a medicine or an allergy is a real risk, and a disclaimer does not prevent it.',
    did: 'Health flags from onboarding are checked first. A clashing herb is swapped for one with no common interactions, and the swap is explained on the label.',
    why: 'Safety designed in, not bolted on. The content follows NIH NCCIH summaries and needs review by a herbalist and clinician before launch.',
  },
  {
    area: 'Herbs', title: 'The protocol is an apothecary label',
    saw: 'Herbal advice in other apps is a paragraph of text.',
    did: 'Latin name, part, preparation, amount, steep, when, how often, cautions and evidence in words, in the form of a label.',
    why: 'The label is the printed object of this world. It forces every herb record to carry the same fields, which matches the client’s governed knowledge base.',
  },
  {
    area: 'Players', title: 'Breath as a tide, meditation as a moon',
    saw: 'Every breathing app uses an expanding circle.',
    did: 'The whole screen fills as you breathe in and empties as you breathe out, over the real counts. The sit is a moon filling from new to full, with rain or a low hum made in the browser.',
    why: 'Using the full screen means you can follow it with soft eyes. Reduced motion keeps the counts and drops the movement.',
  },
  {
    area: 'Dashboard', title: 'Two weeks as a calendar, minutes as numbers',
    saw: 'The fortnight was a strip of fifteen tiny icons and the minutes chart had no values.',
    did: 'Two rows of seven days under weekday letters, missed days left blank. Each bar carries its minutes; today is teal.',
    why: 'Charts without values hide magnitude. Blank days, not red ones, keep the no-guilt promise; one Insight Timer reviewer singled out its lack of manipulative streaks as a reason to stay.',
  },
  {
    area: 'Type', title: 'One scale of six sizes',
    saw: 'The first pass used eleven font sizes.',
    did: '12, 14, 16, 22, 30 and 44 px, plus the breath count as the one display size. Instrument Serif speaks for Tend; Instrument Sans is for everything you scan.',
    why: 'The inspector measured eleven sizes; the studied app screens use four to nine. Fewer sizes make the hierarchy obvious.',
  },
]
