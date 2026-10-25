// Turns a check-in into today's ritual. Every choice keeps its reason, so the ritual can say
// why it chose each step, and a herb that does not suit the profile is swapped, with the reason shown.
import { BREATHS, HERBS, SITS } from './library.js'

export function buildRitual(c, flags = []) {
  const calmNeed = c.mood === 'stormy' || c.stress >= 4
  const lowEnergy = c.mood === 'tired' || c.mood === 'heavy' || c.energy <= 2
  const short = c.minutes <= 5
  const evening = c.time === 'evening'

  // Breath
  let breath = 'coherent'
  let breathWhy = 'You feel fairly even, so an even rhythm keeps it there.'
  if (evening && (c.sleep < 7 || c.goal === 'sleep')) { breath = '478'; breathWhy = 'It is evening and rest is the aim, so the slow 4-7-8 pattern.' }
  else if (calmNeed) { breath = 'long'; breathWhy = `You said ${c.mood === 'stormy' ? 'you feel stormy' : 'stress is high'}, so the exhale is longer than the inhale.` }
  else if (c.goal === 'focus') { breath = 'box'; breathWhy = 'Focus is the aim, and even counts give the mind a frame.' }

  // Sit
  let sit = 'open'
  let sitWhy = 'A light, open sit to notice how the day feels.'
  if (calmNeed) { sit = 'ground'; sitWhy = 'Grounding brings you back to the room when you feel wound up.' }
  else if (evening || c.goal === 'sleep') { sit = 'scan'; sitWhy = 'A body scan helps you let go of the day before bed.' }
  else if (c.goal === 'focus') { sit = 'count'; sitWhy = 'Counting breaths trains attention for the work ahead.' }
  else if (c.mood === 'heavy') { sit = 'kind'; sitWhy = 'On heavy days, a few kind words land better than effort.' }

  // Herb
  let herb = 'peppermint'
  let herbWhy = 'A cool, clear cup for a working morning.'
  if (evening || c.goal === 'sleep') { herb = 'chamomile'; herbWhy = 'A soft evening cup, traditionally used before sleep.' }
  else if (calmNeed) { herb = 'lemonbalm'; herbWhy = 'Lemon balm is traditionally used for restlessness.' }
  else if (lowEnergy && !evening) { herb = 'ginger'; herbWhy = 'A warming cup for a slow start.' }
  let swapped = null
  const clash = HERBS[herb].cautions.find((x) => flags.includes(x.flag))
  if (clash) {
    swapped = { from: herb, reason: clash.text }
    herb = 'rooibos'
    herbWhy = `Swapped from ${HERBS[swapped.from].name.toLowerCase()} because of your profile. Rooibos has no common interactions.`
  }

  // Lengths follow the time they have
  const total = c.minutes
  const breathMin = short ? 2 : total >= 20 ? 5 : 3
  const sitMin = short ? 2 : total >= 20 ? 10 : 5
  const steps = [
    { kind: 'breath', id: breath, minutes: breathMin, why: breathWhy, title: BREATHS[breath].name, field: BREATHS[breath].field },
    { kind: 'herb', id: herb, minutes: Math.round(HERBS[herb].steep / 60), why: herbWhy, title: `${HERBS[herb].name} ${HERBS[herb].prep.toLowerCase()}`, field: 'sage', swapped, parallel: true },
    { kind: 'sit', id: sit, minutes: sitMin, why: sitWhy, title: SITS[sit].name, field: SITS[sit].field },
    { kind: 'journal', id: 'journal', minutes: 1, why: 'One line to remember how today felt.', title: 'One line', field: 'paper' },
  ]
  // The tea steeps while you sit, so it does not add to the time.
  const minutes = steps.filter((s) => !s.parallel).reduce((a, s) => a + s.minutes, 0)
  return { steps, minutes, name: ritualName(c, calmNeed, lowEnergy, evening) }
}

function ritualName(c, calm, low, evening) {
  if (evening) return 'Evening unwind'
  if (calm) return 'Settle the storm'
  if (c.goal === 'focus') return 'Clear head'
  if (low) return 'Slow start'
  return 'Morning tend'
}

export function prompt(c) {
  if (c.mood === 'stormy') return 'What is one thing you can leave until tomorrow?'
  if (c.mood === 'heavy') return 'What would you say to a friend who felt like this?'
  if (c.mood === 'tired') return 'What drained you, and what gave a little back?'
  if (c.time === 'evening') return 'What is one small thing that went right today?'
  return 'What would make today feel well spent?'
}
