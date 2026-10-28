// Sample menu for the prototype. Names, prices and descriptions are placeholders for the shop to
// replace; they are written at full density so the design is reviewed with real-length content.
// Everything the owner edits in Manage is stored as an override on top of this file.

export const CURRENCY = '$'
export const money = (n) => `${CURRENCY}${n.toFixed(2)}`

// Each board takes the colour of one of the four sauces on the counter: ketchup, mustard, mayo and
// green herb. It is the menu's wayfinding, and it puts the food on a colour it stands out against.
export const CATS = [
  { id: 'fried', name: 'Fried', long: 'Fried chicken', field: '#DA2A36', ink: '#1C0500', sauce: 'Ketchup red', icon: 'Chicken',
    line: 'Brined for twelve hours, double dredged, fried to order.' },
  { id: 'grilled', name: 'Grilled', long: 'Grilled chicken', field: '#F2B035', ink: '#1E1300', sauce: 'Mustard', icon: 'Fire',
    line: 'Marinated overnight, finished over charcoal.' },
  { id: 'mayo', name: 'Mayo', long: 'Mayo dishes', field: '#F4E7C8', ink: '#2A1D08', sauce: 'Mayonnaise', icon: 'Bowl',
    line: 'House mayonnaise, made every morning: garlic, chili or plain.' },
  { id: 'grill', name: 'Grill specials', long: 'Grill specials', field: '#5FA463', ink: '#0B2210', sauce: 'Green herb', icon: 'Flame',
    line: 'From the big grill, Friday to Sunday and every evening after six.' },
]
export const catOf = (id) => CATS.find((c) => c.id === id)

// heat: whether the dish takes a heat level. mins: minutes on the line, used for the ready time.
export const ITEMS = [
  { id: 'crunch-2', cat: 'fried', name: 'Crunch Box, 2 pieces', art: 'drumstick', price: 6.5, heat: true, mins: 12,
    desc: 'Two pieces of bone-in fried chicken, a soft roll and one dip.' },
  { id: 'bucket-4', cat: 'fried', name: 'Four-piece bucket', art: 'bucket', price: 11.9, heat: true, mins: 14,
    desc: 'Four mixed pieces, thigh, drum and wing, with two dips. Feeds two.' },
  { id: 'wings-8', cat: 'fried', name: 'Hot wings, 8', art: 'wings', price: 7.8, heat: true, mins: 10,
    desc: 'Eight wings tossed in the heat you pick. Celery and a garlic mayo on the side.' },
  { id: 'tenders-5', cat: 'fried', name: 'Tender strips, 5', art: 'tenders', price: 7.2, heat: true, mins: 9,
    desc: 'Breast strips in a cornflake crumb. The one children ask for.' },
  { id: 'burger', cat: 'fried', name: 'Crispy chicken burger', art: 'burger', price: 6.9, heat: true, mins: 10,
    desc: 'A whole fried thigh, slaw, pickles and chili mayo in a toasted bun.' },

  { id: 'quarter', cat: 'grilled', name: 'Quarter grilled chicken', art: 'quarter', price: 6.4, heat: true, mins: 8,
    desc: 'Leg and thigh off the charcoal, with one side and one dip.' },
  { id: 'half', cat: 'grilled', name: 'Half grilled chicken', art: 'half', price: 10.5, heat: true, mins: 10,
    desc: 'Half a bird, butterflied and charred, with two sides.' },
  { id: 'whole', cat: 'grilled', name: 'Whole flame chicken', art: 'whole', price: 18.9, heat: true, mins: 16,
    desc: 'A whole bird for three or four, cut at the counter, three sides and three dips.' },
  { id: 'thigh-wrap', cat: 'grilled', name: 'Grilled thigh wrap', art: 'wrap', price: 7.4, heat: true, mins: 8,
    desc: 'Charred thigh, pickled onion, herbs and garlic mayo in a flatbread.' },
  { id: 'peri-skewers', cat: 'grilled', name: 'Peri skewers, 3', art: 'skewer', price: 7.9, heat: true, mins: 9,
    desc: 'Three skewers of thigh with peppers and onion, glazed as they come off.' },

  { id: 'mayo-salad', cat: 'mayo', name: 'Chicken mayo salad', art: 'salad', price: 6.2, heat: false, mins: 5,
    desc: 'Pulled grilled chicken folded through house mayo, herbs and crisp leaves.' },
  { id: 'mayo-rice', cat: 'mayo', name: 'Garlic mayo rice bowl', art: 'ricebowl', price: 7.6, heat: true, mins: 7,
    desc: 'Spiced rice, sliced grilled chicken, pickles and a pour of garlic mayo.' },
  { id: 'mayo-roll', cat: 'mayo', name: 'Mayo shawarma roll', art: 'roll', price: 6.8, heat: true, mins: 7,
    desc: 'Thin-sliced chicken, garlic mayo, pickles and fries rolled tight and toasted.' },
  { id: 'slaw', cat: 'mayo', name: 'Creamy coleslaw', art: 'slaw', price: 2.4, heat: false, mins: 2,
    desc: 'Cabbage, carrot and a light mayo dressing. Made twice a day.' },
  { id: 'mayo-fries', cat: 'mayo', name: 'Mayo fries', art: 'fries', price: 3.9, heat: false, mins: 5,
    desc: 'Skin-on fries under garlic mayo and chili flakes.' },

  { id: 'platter', cat: 'grill', name: 'Mixed grill platter for two', art: 'platter', price: 22.5, heat: true, mins: 18,
    desc: 'Half chicken, two suya skewers, two lamb chops, corn, rice and three dips.' },
  { id: 'suya', cat: 'grill', name: 'Beef suya skewers', art: 'suya', price: 9.2, heat: true, mins: 11,
    desc: 'Thin beef in a peanut and pepper rub, onion and tomato on the side.' },
  { id: 'chops', cat: 'grill', name: 'Lamb chops, 3', art: 'chops', price: 14.8, heat: false, mins: 14,
    desc: 'Three chops with rosemary and garlic, cooked medium unless you say.' },
  { id: 'corn', cat: 'grill', name: 'Grilled corn', art: 'corn', price: 2.8, heat: false, mins: 6,
    desc: 'Charred corn brushed with chili butter.' },
]
export const itemOf = (id) => ITEMS.find((i) => i.id === id)

// Four heat levels. `flames` drives the drawing and the steam on the dish.
export const HEAT = [
  { id: 'mild', name: 'Mild', flames: 1, note: 'Garlic, salt and lemon. No chili.' },
  { id: 'medium', name: 'Medium', flames: 2, note: 'Black pepper and smoked paprika.' },
  { id: 'hot', name: 'Hot', flames: 3, note: 'Cayenne and scotch bonnet. Most people stop here.' },
  { id: 'inferno', name: 'Inferno', flames: 4, note: 'Ghost pepper glaze. We will ask you twice.' },
]

export const DIPS = [
  { id: 'garlic', name: 'Garlic mayo' }, { id: 'chili', name: 'Chili mayo' }, { id: 'bbq', name: 'Smoky BBQ' },
  { id: 'herb', name: 'Green herb' }, { id: 'pepper', name: 'Pepper sauce' },
]
export const FREE_DIPS = 1
export const DIP_PRICE = 0.6

export const SIDES = [
  { id: 'none', name: 'No side', price: 0 }, { id: 'fries', name: 'Fries', price: 1.9 },
  { id: 'slaw', name: 'Coleslaw', price: 1.4 }, { id: 'corn', name: 'Grilled corn', price: 1.6 },
  { id: 'rice', name: 'Spiced rice', price: 1.8 },
]

export const SHOP = { name: 'Flock & Flame', branch: 'Ring Road', opens: '11:00', closes: '23:00', delivery: 2.5, deliveryMins: 20 }

// What the kitchen does to an order, in order. Grilled dishes go to the coals instead of the fryer.
export const STATIONS = [
  { id: 'received', name: 'Received', note: 'Your ticket is on the rail.' },
  { id: 'prep', name: 'On the line', note: 'Breading and marinade.' },
  { id: 'cook', name: 'Cooking', note: 'In the fryer and on the coals.' },
  { id: 'packed', name: 'Packed', note: 'Boxed, dips counted, sealed.' },
  { id: 'ready', name: 'Ready', note: 'At the counter under your number.' },
]
