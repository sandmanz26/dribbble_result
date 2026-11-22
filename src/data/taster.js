// The taster lesson used on the homepage, the free lesson and the student app.
// Extract figures are sample figures written for this prototype, labelled as such on screen.

export const SUBJECTS = [
  { id: 'economics', name: 'Economics', boards: ['AQA 7136', 'Edexcel 9EC0', 'OCR H460', 'Cambridge 9708', 'Edexcel International'], taster: 'Price elasticity of demand', minutes: 6, ready: true },
  { id: 'business', name: 'Business', boards: ['AQA 7132', 'Edexcel 9BS0', 'OCR H431', 'Cambridge 9609', 'Edexcel International'], taster: 'Why businesses choose social media marketing', minutes: 7, ready: false },
  { id: 'psychology', name: 'Psychology', boards: ['AQA 7182', 'Edexcel 9PS0', 'OCR H567', 'Cambridge 9990'], taster: 'Conformity: Asch and the types of conformity', minutes: 7, ready: false },
  { id: 'sociology', name: 'Sociology', boards: ['AQA 7192', 'OCR H580', 'Cambridge 9699'], taster: 'Functionalist views of the family', minutes: 6, ready: false },
]

export const BOARDS = ['AQA', 'Edexcel', 'OCR', 'Cambridge International', 'Edexcel International']

export const LESSON = {
  id: 'ped',
  subject: 'Economics',
  title: 'Price elasticity of demand',
  spec: 'AQA 3.1.3.2 · Edexcel 9EC0 1.2.3 · OCR 2.3',
  minutes: 6,
  author: 'Jonathan Pledger',
  examinerNote:
    'Two things examiners look for: show your working with the minus sign, then say which time period you mean. Petrol is inelastic next week and less so in five years.',
  idea: {
    heading: 'How much does demand move when the price moves?',
    body: [
      'The law of demand says people buy less when the price rises. It does not say how much less. Price elasticity of demand (PED) measures that.',
      'PED = % change in quantity demanded ÷ % change in price.',
      'If the answer is between 0 and −1, demand is inelastic: quantity falls by a smaller percentage than the price rises. Below −1, demand is elastic.',
    ],
  },
  worked: {
    heading: 'Worked example: petrol',
    steps: [
      ['Price goes from 140p to 154p a litre', '+10%'],
      ['A filling station sells 1,000 litres a day, then 980', '−2%'],
      ['PED = −2% ÷ +10%', '−0.2'],
      ['Between 0 and −1', 'Inelastic'],
    ],
    takeaway: 'Revenue went from £1,400 to £1,509.20 a day. When demand is inelastic, a higher price brings in more money.',
  },
  checks: [
    {
      q: 'Price rises by 20% and quantity demanded falls by 30%. What is the PED?',
      options: ['−0.67', '−1.5', '+1.5', '−10'],
      answer: 1,
      why: '−30 ÷ 20 = −1.5. Bigger than 1 in size, so elastic.',
    },
    {
      q: 'Which of these is most likely to make demand for a good more elastic?',
      options: ['It is a necessity', 'It has many close substitutes', 'It is a small share of income', 'It is habit-forming'],
      answer: 1,
      why: 'With close substitutes, buyers switch easily when the price rises.',
    },
    {
      q: 'A firm faces inelastic demand and raises its price. Total revenue will…',
      options: ['Rise', 'Fall', 'Stay the same', 'Fall to zero'],
      answer: 0,
      why: 'Quantity falls by a smaller % than price rises, so price × quantity goes up.',
    },
  ],
}

export const EXTRACT = {
  label: 'Extract A',
  note: 'Sample extract written for this prototype',
  title: 'Fuel duty and the price of petrol',
  body: [
    'In 2026 a litre of petrol in the UK cost about 140p, of which around 53p was fuel duty and a further 23p was VAT.',
    'Studies of UK drivers put the short-run price elasticity of demand for petrol at around −0.2. Over five years or more it is closer to −0.6, as households change cars, move house or switch to public transport.',
    'For many workers outside large cities there is no practical alternative to driving to work.',
  ],
}

export const QUESTION = {
  id: 'ped-9',
  command: 'Explain',
  text: 'Using Extract A, explain why a rise in fuel duty is likely to increase the government’s tax revenue in the short run.',
  marks: 9,
  suggestedMinutes: 11,
  aos: [
    { id: 'AO1', name: 'Knowledge', max: 3, ask: 'Define PED and say what inelastic means.' },
    { id: 'AO2', name: 'Application', max: 2, ask: 'Use the figure and the situation in Extract A.' },
    { id: 'AO3', name: 'Analysis', max: 4, ask: 'Build a chain: price rises, quantity falls by less, so revenue rises.' },
  ],
  levels: [
    { level: 3, range: [7, 9], text: 'A well-developed chain of reasoning, applied to the extract, with accurate use of PED.' },
    { level: 2, range: [4, 6], text: 'Some analysis with relevant knowledge, but the chain has gaps or the extract is used thinly.' },
    { level: 1, range: [1, 3], text: 'Isolated points or assertions with little explanation.' },
  ],
  starters: [
    { ao: 'AO1', text: 'Price elasticity of demand measures how responsive quantity demanded is to a change in price.' },
    { ao: 'AO2', text: 'Extract A suggests the short-run PED for petrol is about −0.2, so ' },
    { ao: 'AO3', text: 'Therefore when fuel duty raises the pump price, ' },
  ],
}

export const SAMPLES = {
  weak: {
    label: 'A first try',
    text: 'When tax goes up the government gets more money because people pay more tax. Petrol is expensive so people will pay it anyway.',
  },
  middle: {
    label: 'Getting there',
    text: 'Petrol is inelastic because people need it to drive to work. If the government puts up fuel duty the price will go up but people will still buy petrol. This means the government gets more money from tax. Extract A says that the PED is −0.2 which is inelastic.',
  },
  strong: {
    label: 'Top of the band',
    text: 'Price elasticity of demand measures how responsive quantity demanded is to a change in price. Extract A suggests the short-run PED for petrol is about −0.2, so demand is price inelastic. This is because most drivers have no close substitute in the short run: they still need to commute and cannot switch to an electric car overnight. Therefore when fuel duty rises and the pump price goes up, quantity demanded falls by a much smaller percentage than the price rises. As a result, the government collects more duty on each litre while losing only a few litres of sales, so total tax revenue increases. Over five years the PED moves towards −0.6, so the gain may shrink as drivers adapt.',
  },
}
