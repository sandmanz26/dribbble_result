// Sample product line. Flavour names, nutrition and prices are placeholders for the client to confirm.
export const FLAVOURS = [
  {
    id: 'choc', name: 'Chocolate Peanut Butter', short: 'Choc PB', img: 'tub-choc',
    field: '#5b3523', ink: '#fff1dc', pop: '#ff7a1a',
    taste: 'Like the middle of a peanut butter cup. Thick with milk, still good with water.',
    ings: [
      ['Whey protein isolate', 'Grass-fed milk, filtered until it is almost all protein.'],
      ['Cocoa', 'Dutch-process cocoa for the chocolate. Nothing labelled "flavour".'],
      ['Peanut flour', 'Roasted peanuts with the oil pressed out, so it mixes smooth.'],
      ['Monk fruit', 'Sweet from a melon, not from sugar. That is why there is 1 g.'],
      ['Sea salt', 'A pinch, the way you would salt caramel.'],
    ],
    facts: { kcal: 130, protein: 24, sugar: 1, carbs: 4, fat: 2 },
  },
  {
    id: 'vanilla', name: 'Vanilla Cinnamon', short: 'Vanilla', img: 'tub-vanilla',
    field: '#f2b632', ink: '#2a1a0c', pop: '#7a4520',
    taste: 'Warm, like the milk at the bottom of a bowl of cinnamon cereal.',
    ings: [
      ['Whey protein isolate', 'Grass-fed milk, filtered until it is almost all protein.'],
      ['Vanilla bean', 'Ground pods, you can see the specks.'],
      ['Cinnamon', 'Ceylon cinnamon, softer and sweeter than the usual kind.'],
      ['Monk fruit', 'Sweet from a melon, not from sugar.'],
      ['Sea salt', 'A pinch to round it off.'],
    ],
    facts: { kcal: 120, protein: 25, sugar: 1, carbs: 3, fat: 1.5 },
  },
  {
    id: 'straw', name: 'Strawberry', short: 'Strawberry', img: 'tub-straw',
    field: '#ff4f8b', ink: '#2b0a15', pop: '#d9192f',
    taste: 'Strawberry milk from when you were eight, without the syrup.',
    ings: [
      ['Whey protein isolate', 'Grass-fed milk, filtered until it is almost all protein.'],
      ['Freeze-dried strawberry', 'Real fruit, dried cold so it keeps its colour.'],
      ['Beetroot', 'A little for the pink. No dyes.'],
      ['Monk fruit', 'Sweet from a melon, not from sugar.'],
      ['Sea salt', 'A pinch to wake up the fruit.'],
    ],
    facts: { kcal: 120, protein: 24, sugar: 2, carbs: 4, fat: 1.5 },
  },
  {
    id: 'caramel', name: 'Salted Caramel', short: 'Caramel', img: 'tub-caramel',
    field: '#1f3a8a', ink: '#fff1dc', pop: '#e0a63c',
    taste: 'Toffee and a hit of salt. The one people drink as dessert.',
    ings: [
      ['Whey protein isolate', 'Grass-fed milk, filtered until it is almost all protein.'],
      ['Burnt sugar', 'A tiny amount of real caramel, cooked dark.'],
      ['Coconut milk powder', 'For the creamy finish.'],
      ['Monk fruit', 'Sweet from a melon, not from sugar.'],
      ['Sea salt', 'More than a pinch. It is in the name.'],
    ],
    facts: { kcal: 130, protein: 24, sugar: 1, carbs: 4, fat: 2.5 },
  },
]

export const PERSONAS = [
  {
    id: 'athletes', img: 'athlete', time: '05:00', who: 'Athletes',
    head: 'Ready for the 5 am start.',
    lede: 'Twenty-four grams of protein after the session, five ingredients you can read, and a taste that makes the shake the good part of the morning.',
    reasons: [['Recovers like it should', '24 g of whey isolate a scoop, the amount most coaches ask for after training.'], ['Nothing to test for', 'Five ingredients, no blends hiding behind one name.'], ['Mixes in a shaker', 'No clumps, no blender, ten seconds at the side of the track.']],
    flavour: 'choc', review: 1,
  },
  {
    id: 'shift-workers', img: 'nurse', time: '07:10', who: 'Shift workers',
    head: 'Ready when the shift ends at 7.',
    lede: 'Something real to drink after twelve hours on your feet, when the canteen is closed and the drive home is long.',
    reasons: [['A meal when there is no time', '130 calories and 24 g of protein that keeps you going until you sleep.'], ['Easy on a tired stomach', 'Whey isolate, low in lactose, 1 g of sugar.'], ['Lives in a locker', 'Single-serve sachets in the starter pack, no tub needed.']],
    flavour: 'vanilla', review: 2,
  },
  {
    id: 'parents', img: 'parent', time: '06:30', who: 'Busy parents',
    head: 'Ready before the school run.',
    lede: 'Breakfast for you while they eat theirs. Shake it, drink it, find the other shoe.',
    reasons: [['Breakfast in one hand', 'Twenty-four grams of protein instead of the crusts off their toast.'], ['A label you would give the kids', 'Five ingredients, no artificial sweeteners or dyes.'], ['Tastes like a treat', 'Salted caramel or strawberry, never "chalk".']],
    flavour: 'straw', review: 0,
  },
]

// Sample reviews: placeholders until verified reviews come from the store.
export const REVIEWS = [
  { name: 'Dana R.', where: 'Ohio', who: 'Mother of two', stars: 5, flavour: 'straw', t: 'My daughter steals it, which says everything about the taste. I like that I can read the whole label in five seconds.' },
  { name: 'Marcus T.', where: 'Georgia', who: '400 m runner', stars: 5, flavour: 'choc', t: 'Mixes in a shaker with no lumps. Chocolate peanut butter after morning sprints is the only reason I get up.' },
  { name: 'Priya K.', where: 'Texas', who: 'ER nurse, nights', stars: 5, flavour: 'vanilla', t: 'I drink the vanilla in the car park at 7 am. Easy on the stomach after a twelve-hour shift.' },
  { name: 'Jo L.', where: 'Colorado', who: 'Weekend climber', stars: 4, flavour: 'caramel', t: 'Salted caramel tastes like dessert. Would love a bigger tub.' },
  { name: 'Sam O.', where: 'Arizona', who: 'Firefighter', stars: 5, flavour: 'choc', t: 'Five ingredients and none of them I have to look up. Keep a tub at the station.' },
  { name: 'Lena W.', where: 'Oregon', who: 'Teacher, coach', stars: 5, flavour: 'straw', t: 'Finally a strawberry that does not taste like a candle.' },
]

export const PRINCIPLES = [
  ['If you cannot say it, it is not in it', 'Every tub has five ingredients. Read them out loud in the shop, that is the test.'],
  ['Taste first', 'We make it taste like something you look forward to, because the shake you skip does nothing.'],
  ['Ready for real life', 'Not only for the gym. For the 5 am start, the long shift and the morning with three lunch boxes.'],
]

export const FAQ = [
  ['How much protein is in a scoop?', '24 to 25 g from whey protein isolate, depending on the flavour. The full panel is on every tub and on this page.'],
  ['What sweetens it?', 'Monk fruit. No sucralose, no aspartame, no sugar alcohols. That is why each scoop has 1 to 2 g of sugar.'],
  ['Is it tested?', 'Each batch is tested by an independent lab for what is on the label and for banned substances. The certificate number is printed on the lid. (Placeholder: the client confirms the testing programme.)'],
  ['Can I mix it with water?', 'Yes. Milk makes it thicker, water keeps it lighter. Both mix in a shaker in about ten seconds.'],
  ['What is in the starter pack?', 'Four single-serve sachets, one of each flavour, and a shaker. Delivery is free and you can order a tub of the one you liked after.'],
]

export const flavour = (id) => FLAVOURS.find((f) => f.id === id) || FLAVOURS[0]
