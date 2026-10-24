// Destinations. Coordinates are real; costs are sample ranges for a mid-range traveller,
// shown as ranges so they never read as measured figures. Country ids are ISO 3166 numeric
// (the ids world-atlas uses) so the map can shade the right country.
export const PLACES = {
  kyoto: {
    name: 'Kyoto', country: 'Japan', iso: '392', at: [135.768, 35.011], span: 420,
    line: 'Temples, gardens and the maple season in late November.',
    best: ['Apr', 'May', 'Oct', 'Nov'], day: [90, 150], weather: 'Nov: 8 to 17°C, dry',
    tags: ['Temples', 'Food', 'Walking'],
  },
  lisbon: {
    name: 'Lisbon', country: 'Portugal', iso: '620', at: [-9.139, 38.722], span: 560,
    line: 'Hills, tiles and long lunches by the river.',
    best: ['Mar', 'Apr', 'May', 'Sep', 'Oct'], day: [70, 120], weather: 'Dec: 9 to 15°C, some rain',
    tags: ['City', 'Food', 'Architecture'],
  },
  bali: {
    name: 'Bali', country: 'Indonesia', iso: '360', at: [115.188, -8.409], span: 300,
    line: 'Rice terraces inland, reefs off the east coast.',
    best: ['May', 'Jun', 'Jul', 'Aug', 'Sep'], day: [45, 90], weather: 'Jan: 24 to 31°C, wet season',
    tags: ['Diving', 'Rest', 'Nature'],
  },
  cusco: {
    name: 'Cusco', country: 'Peru', iso: '604', at: [-71.967, -13.532], span: 1100,
    line: 'The base for the Inca Trail at 3,400 m.',
    best: ['May', 'Jun', 'Jul', 'Aug', 'Sep'], day: [55, 100], weather: 'May: 1 to 20°C, dry',
    tags: ['Hiking', 'History', 'Altitude'],
  },
  hoian: {
    name: 'Hội An', country: 'Vietnam', iso: '704', at: [108.338, 15.880], span: 650,
    line: 'Lantern streets, tailors and the best bánh mì argument in Vietnam.',
    best: ['Feb', 'Mar', 'Apr', 'May'], day: [35, 70], weather: 'Feb: 20 to 26°C, light rain',
    tags: ['Food', 'Old town', 'Beach'],
  },
  tbilisi: {
    name: 'Tbilisi', country: 'Georgia', iso: '268', at: [44.793, 41.715], span: 900,
    line: 'Sulphur baths, natural wine and a lot of khachapuri.',
    best: ['May', 'Jun', 'Sep', 'Oct'], day: [40, 80], weather: 'Mar: 4 to 15°C',
    tags: ['Wine', 'City', 'Walking'],
  },
  oaxaca: {
    name: 'Oaxaca', country: 'Mexico', iso: '484', at: [-96.727, 17.073], span: 900,
    line: 'Markets, mezcal and Día de Muertos at the start of November.',
    best: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb'], day: [45, 85], weather: 'Nov: 11 to 27°C, dry',
    tags: ['Festival', 'Food', 'Craft'],
  },
  lofoten: {
    name: 'Lofoten', country: 'Norway', iso: '578', at: [13.616, 68.153], span: 460,
    line: 'Fishing villages under the northern lights.',
    best: ['Feb', 'Mar', 'Jun', 'Jul'], day: [140, 230], weather: 'Feb: -3 to 2°C, dark by 16:00',
    tags: ['Aurora', 'Nature', 'Photography'],
  },
  capetown: {
    name: 'Cape Town', country: 'South Africa', iso: '710', at: [18.424, -33.925], span: 560,
    line: 'Table Mountain, penguins and the drive to the Cape.',
    best: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar'], day: [60, 110], weather: 'Jan: 16 to 27°C, windy',
    tags: ['Nature', 'Coast', 'Wine'],
  },
}

export const place = (id) => ({ id, ...PLACES[id] })
