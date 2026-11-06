// Sample content for Fuwa Matcha Club, a fun matcha cafe. Name, address, prices and sourcing details are samples.
export const CAFE = {
  name: 'Fuwa Matcha Club',
  street: '214 Gertrude Street', suburb: 'Fitzroy, Melbourne',
  hours: [['Mon to Fri', 7, 17], ['Sat and Sun', 8, 17]],
  quiet: 'Quiet hour, 8 to 9 every morning: no music, just the whisk.',
}

export const CATS = [
  { id: 'matcha', name: 'Matcha' },
  { id: 'latte', name: 'Lattes' },
  { id: 'fizz', name: 'Fizzy and fun' },
  { id: 'sweet', name: 'Sweets' },
  { id: 'home', name: 'Take home' },
]

export const MENU = [
  { id: 'usucha', cat: 'matcha', name: 'Usucha', jp: '薄茶', img: 'usucha', bg: '#a9c47f', price: 7, line: 'Ceremonial matcha whisked with 80°C water. Grassy, sweet, a little like steamed spinach in the best way.', tags: ['Hot', 'No milk'], caf: 'Medium' },
  { id: 'iced', cat: 'latte', name: 'Iced Matcha Latte', jp: 'アイス抹茶ラテ', img: 'iced', bg: '#f6d978', price: 7.5, line: 'Our daily blend poured over cold milk and ice. The one most people come back for.', tags: ['Iced', 'Oat ok'], caf: 'Medium', star: true },
  { id: 'strawberry', cat: 'latte', name: 'Strawberry Matcha', jp: 'いちご抹茶', img: 'strawberry', bg: '#f3e6cf', price: 8.5, line: 'Crushed strawberries we cook every morning, cold milk, then matcha on top. Three layers, stir it or not.', tags: ['Iced', 'Oat ok'], caf: 'Medium', star: true },
  { id: 'hojicha', cat: 'latte', name: 'Hojicha Latte', jp: 'ほうじ茶ラテ', img: 'hojicha', bg: '#f4b8b1', price: 7, line: 'Roasted green tea, toasty like caramel and almost no caffeine. Good after three.', tags: ['Iced or hot', 'Low caffeine'], caf: 'Low' },
  { id: 'yuzu', cat: 'fizz', name: 'Yuzu Matcha Tonic', jp: '柚子抹茶トニック', img: 'yuzu', bg: '#a8dcf5', price: 8, line: 'Tonic, a slice of yuzu, matcha floating on top like a cloud. Bright and bitter in a good way.', tags: ['Iced', 'Dairy free'], caf: 'Medium', star: true },
  { id: 'float', cat: 'fizz', name: 'Matcha Float', jp: '抹茶フロート', img: 'float', bg: '#d4c3ee', price: 9, line: 'Sparkling matcha soda, a swirl of vanilla soft serve and one cherry. Spoon included.', tags: ['Iced'], caf: 'Medium' },
  { id: 'softserve', cat: 'sweet', name: 'Matcha Soft Serve', jp: '抹茶ソフト', img: 'softserve', bg: '#f6d978', price: 6.5, line: 'Made with the same ceremonial matcha. Rich, not too sweet, in a crisp cone.', tags: ['Cone or cup'], caf: 'Low' },
  { id: 'cheesecake', cat: 'sweet', name: 'Matcha Basque Cheesecake', jp: '抹茶バスクチーズケーキ', img: 'cheesecake', bg: '#f4b8c8', price: 9.5, line: 'Burnt top, soft green middle. Baked every morning, gone by two most days.', tags: ['Slice'], caf: 'Low' },
  { id: 'tin-ceremonial', cat: 'home', name: 'Ceremonial Matcha, 30 g', jp: '儀式用', img: 'tin-ceremonial', bg: '#8fb35a', price: 38, line: 'First harvest from Wazuka, stone milled. For usucha at home. About 15 bowls.', tags: ['Tin', 'Grade: ceremonial'], caf: 'Medium' },
  { id: 'tin-daily', cat: 'home', name: 'Daily Matcha, 50 g', jp: '日常用', img: 'tin-daily', bg: '#a8dcf5', price: 29, line: 'The blend in our lattes. Holds up to milk, still smooth on its own. About 25 lattes.', tags: ['Tin', 'Grade: latte'], caf: 'Medium' },
  { id: 'tin-hojicha', cat: 'home', name: 'Hojicha Powder, 50 g', jp: 'ほうじ茶', img: 'tin-hojicha', bg: '#f4b8b1', price: 24, line: 'Roasted in Kyoto, ground fine for lattes. The evening one.', tags: ['Tin', 'Low caffeine'], caf: 'Low' },
]

export const STEPS = [
  { img: 'field', n: '01', t: 'Shaded for three weeks', d: 'In Wazuka, Kyoto, the bushes sit under black cloth for about 21 days before the first spring picking. Less sun means more of the sweet amino acids and that deep green.' },
  { img: 'mill', n: '02', t: 'Stone milled, slowly', d: 'The dried leaves are ground between granite stones, about 40 grams an hour, so the powder never gets hot and keeps its taste.' },
  { img: 'whisk', n: '03', t: 'Whisked to order', d: 'Every drink starts with matcha sifted into a bowl and whisked by hand with a bamboo chasen until it turns fluffy. Fuwa-fuwa.' },
]

export const PROOF = [
  ['First harvest', 'only the spring picking'],
  ['Wazuka, Kyoto', 'one farm, named on every tin'],
  ['Tested each lot', 'by an outside lab before it ships'],
  ['Picked in May', 'this season’s harvest, not last year’s'],
]

export const usd = (n) => `$${n.toFixed(2).replace(/\.00$/, '')}`
export const isOpen = (d = new Date()) => {
  const day = d.getDay(); const h = d.getHours() + d.getMinutes() / 60
  const [, a, b] = day === 0 || day === 6 ? CAFE.hours[1] : CAFE.hours[0]
  return { open: h >= a && h < b, until: b, from: a }
}
