// The design decision log, shown on the design system page. Each entry: what we saw,
// what we decided, and the reason (research, a measurement, or a principle).
export const DECISIONS = [
  {
    area: 'Idea', title: 'Each day is a cyanotype',
    saw: 'The second version still looked like every wellness app: pastel cards, a soft serif, chat bubbles. The owner called it ugly, and nothing on it belonged to Tend alone.',
    did: 'One picture runs through the whole app: a sun print. The weather from the check-in sets how deep the blue goes, and the herb in today’s cup is printed on it as a white silhouette.',
    why: 'A cyanotype is made by the day’s light, which is exactly what the check-in asks about, and botanists used it to record plants, which is what the herbal guidance is. No competitor in the research owns either.',
  },
  {
    area: 'Colour', title: 'One hue, five exposures',
    saw: 'Five practice colours plus a teal accent read as a paint chart and still looked generic.',
    did: 'Prussian blue is the only colour. Bright, steady, heavy, stormy and tired are five depths of it; paper and ink do everything else. The next action wears the blue at full strength.',
    why: 'The project rule is one accent. Tones of one hue can still tell five weathers apart, and a two-week row of them reads at a glance like a set of prints on a wall.',
  },
  {
    area: 'Check-in', title: 'The answers develop the print',
    saw: 'The chat version filled the screen with grey bubbles and pushed the controls to the bottom. It looked like a messaging template.',
    did: 'One question per screen under today’s print. Picking the weather exposes the sheet, the herb your answers point to appears on it, and each answer is added to its caption. You can step back a question.',
    why: 'The person watches their minute turn into something. That is the one live thing on the screen, and it keeps the check-in short without feeling like a form.',
  },
  {
    area: 'Check-in', title: 'Mood is weather, answered in one tap',
    saw: 'Mood scales of 1 to 10 ask people to rate themselves, which feels like a test first thing in the morning.',
    did: 'Five weather words with one line each, shown as a list with the exposure each one makes. Home offers the same five as swatches, so the first tap starts the check-in.',
    why: 'A metaphor is quicker to answer honestly than a number, and the history can then read like a forecast instead of a score.',
  },
  {
    area: 'Ritual', title: 'A label, not a menu',
    saw: 'Four coloured cards at the same size made the ritual a menu, and the reason for each step hid in a tinted box.',
    did: 'The print is prepared for you and dated. Under it the steps are lines with their minutes in the margin; the step to do now opens with its reason and one Start button. Any other step shows its reason on tap.',
    why: 'The screen has one question: what do I do now? The open step answers it. Showing why on every step keeps the trust promise from the research.',
  },
  {
    area: 'Herbs', title: 'Checked against the profile before it is shown',
    saw: 'A herb that clashes with a medicine or an allergy is a real risk, and a disclaimer does not prevent it.',
    did: 'Health flags from onboarding are checked first. A clashing herb is swapped for one with no common interactions, and the swap is explained.',
    why: 'Safety designed in, not bolted on. The content follows NIH NCCIH summaries and needs review by a herbalist and clinician before launch.',
  },
  {
    area: 'Herbs', title: 'The plant’s own print, then the label',
    saw: 'Herbal advice in other apps is a paragraph of text and a stock photo.',
    did: 'The herb is shown as its own sun print with its Latin name, then a label: amount, steep, when, how often. The steep timer is the one blue block on the page.',
    why: 'Each plant is drawn from how it really grows (opposite toothed leaves for the mints, daisy heads for chamomile, a jointed root for ginger), so the picture teaches recognition rather than decorating.',
  },
  {
    area: 'History', title: 'Two weeks as a row of prints',
    saw: 'The fortnight was a grid of small weather icons on white tiles, with a hand-written insight.',
    did: 'Fourteen small prints in weekday columns, each in that day’s exposure with that day’s herb; missed days are empty dashed frames. The finding above it is computed from the data.',
    why: 'Blank frames, not red ones, keep the no-guilt promise. A computed sentence cannot drift from the prints it describes.',
  },
  {
    area: 'Players', title: 'Breath as a tide on the print, the sit on the night print',
    saw: 'Every breathing app uses an expanding circle.',
    did: 'The breath player fills the screen with today’s exposure; light rises as you breathe in and drains as you breathe out, over the real counts. The sit always uses the deepest exposure, with a moon that fills.',
    why: 'Following a whole screen works with soft eyes. Reduced motion keeps the counts and drops the movement.',
  },
  {
    area: 'Type and shape', title: 'A chemist’s label face, cut paper corners',
    saw: 'Instrument Serif and pill shapes are the default look of the category.',
    did: 'Besley, a Clarendon like the type on old pharmacy labels, for what Tend says; Hanken Grotesk for what you read and tap. Every block, field and button has the same 6 px corner.',
    why: 'The face comes from the herb world the product is built on, and one corner size makes the app feel cut from one sheet.',
  },
]
