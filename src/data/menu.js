// Sample menu for the prototype. Names, prices and descriptions are placeholders for the shop to
// replace; they are written at full density so the design is reviewed with real-length content.
// Everything the owner edits in Manage is stored as an override on top of this file.

export const CURRENCY = '$'
export const money = (n) => `${CURRENCY}${n.toFixed(2)}`

// Four boards. Each has a cover photo used on its tab and its section header.
export const CATS = [
  { id: 'fried', name: 'Fried', long: 'Fried chicken', cover: 'fried-hero', line: 'Brined for twelve hours, double dredged, fried to order.' },
  { id: 'grilled', name: 'Grilled', long: 'Grilled chicken', cover: 'grill-hero', line: 'Marinated overnight, finished over charcoal.' },
  { id: 'mayo', name: 'Mayo', long: 'Wraps and mayo', cover: 'wrap-open', line: 'House mayonnaise, made every morning: garlic, chili or plain.' },
  { id: 'grill', name: 'Grill specials', long: 'Grill specials', cover: 'satay-grill', line: 'Skewers and platters from the big grill, every evening after six.' },
]
export const catOf = (id) => CATS.find((c) => c.id === id)

// photo: file in public/food (real photographs, credits in src/data/credits.json).
// heat: whether the dish takes a heat level. mins: minutes on the line, used for the ready time.
export const ITEMS = [
  { id: 'drums-2', cat: 'fried', name: 'Crunch drumsticks, 2', photo: 'drumstick', price: 5.9, heat: true, mins: 12, desc: 'Two bone-in drumsticks, a soft roll and one dip.' },
  { id: 'bucket-8', cat: 'fried', name: 'Family bucket, 8 pieces', photo: 'bucket', price: 19.9, heat: true, mins: 15, desc: 'Thighs, drums and wings, mixed. Three dips and a large slaw. Feeds three or four.' },
  { id: 'wings-8', cat: 'fried', name: 'Hot wings, 8', photo: 'wings', price: 7.8, heat: true, mins: 10, desc: 'Eight wings tossed in the heat you pick, with celery and a garlic mayo.' },
  { id: 'bites', cat: 'fried', name: 'Crispy bites', photo: 'bites', price: 6.4, heat: true, mins: 8, desc: 'Boneless thigh pieces in a cornflake crumb with spring onion. The one children ask for.' },
  { id: 'glazed', cat: 'fried', name: 'Sweet chili glazed', photo: 'glazed', price: 8.2, heat: true, mins: 11, desc: 'Fried thigh pieces in a sticky chili glaze with sesame, on a slaw of green papaya.' },
  { id: 'crunch-box', cat: 'fried', name: 'Crunch box, 5 pieces', photo: 'box', price: 11.5, heat: true, mins: 13, desc: 'Five mixed pieces in a paper-lined box with two dips. The lunch order.' },

  { id: 'quarter', cat: 'grilled', name: 'Flame-grilled quarter', photo: 'quarter', price: 6.4, heat: true, mins: 8, desc: 'Leg and thigh off the charcoal, with one side and one dip.' },
  { id: 'half', cat: 'grilled', name: 'Half bird', photo: 'half', price: 10.5, heat: true, mins: 10, desc: 'Half a chicken, butterflied, glazed and charred, with two sides.' },
  { id: 'whole', cat: 'grilled', name: 'Whole roast chicken', photo: 'whole', price: 18.9, heat: true, mins: 16, desc: 'A whole bird for three or four, carved at the counter, three sides and three dips.' },
  { id: 'thighs', cat: 'grilled', name: 'Charcoal thighs, 4', photo: 'thighs', price: 8.9, heat: true, mins: 10, desc: 'Four boneless thighs, smoky and blackened at the edges.' },
  { id: 'satay', cat: 'grilled', name: 'Chicken satay, 10 sticks', photo: 'satay', price: 7.5, heat: true, mins: 9, desc: 'Ten thigh skewers with peanut sauce, rice cake and pickled cucumber.' },
  { id: 'strips', cat: 'grilled', name: 'Grill strips', photo: 'grill-strips', price: 7.2, heat: true, mins: 8, desc: 'Breast strips straight off the grate, sliced, with a herb dip.' },

  { id: 'shawarma', cat: 'mayo', name: 'Garlic mayo shawarma', photo: 'wrap-open', price: 6.8, heat: true, mins: 7, desc: 'Thin-sliced grilled chicken, garlic mayo, pickles and lettuce rolled tight and toasted.' },
  { id: 'wrap', cat: 'mayo', name: 'Grilled thigh wrap', photo: 'wrap', price: 7.4, heat: true, mins: 8, desc: 'Charred thigh, pickled onion, herbs and chili mayo in a flatbread.' },
  { id: 'loaded-roll', cat: 'mayo', name: 'Loaded roll', photo: 'roll', price: 7.9, heat: true, mins: 8, desc: 'Pulled chicken, chickpeas and mayo in a soft roll. A two-hand meal.' },
  { id: 'mayo-fries', cat: 'mayo', name: 'Mayo fries', photo: 'mayo-fries', price: 3.9, heat: false, mins: 5, desc: 'Skin-on fries with a pot of garlic mayo for dipping.' },
  { id: 'slaw', cat: 'mayo', name: 'Creamy coleslaw', photo: 'slaw', price: 2.4, heat: false, mins: 2, desc: 'Red and white cabbage, carrot and parsley in a light mayo dressing.' },
  { id: 'green-slaw', cat: 'mayo', name: 'Green slaw', photo: 'slaw-green', price: 2.4, heat: false, mins: 2, desc: 'Fine cabbage, lime and coriander, no mayo. Cuts through the fried.' },

  { id: 'beef-skewers', cat: 'grill', name: 'Beef skewers, 4', photo: 'beef-skewers', price: 9.2, heat: true, mins: 11, desc: 'Sweet soy glazed beef, charred over coals.' },
  { id: 'chicken-skewers', cat: 'grill', name: 'Chicken skewers, 4', photo: 'chicken-skewers', price: 7.9, heat: true, mins: 9, desc: 'Thigh and onion, grilled and brushed with lemon butter.' },
  { id: 'satay-platter', cat: 'grill', name: 'Satay grill platter', photo: 'satay-grill', price: 21.5, heat: true, mins: 18, desc: 'Twenty mixed skewers for the table with rice, peanut sauce and pickles.' },
  { id: 'glazed-wings', cat: 'grill', name: 'Glazed wings platter', photo: 'glazed-wings', price: 14.8, heat: true, mins: 14, desc: 'Sixteen wings, sticky BBQ glaze, charred on the big grill.' },
  { id: 'corn', cat: 'grill', name: 'Grilled corn', photo: 'corn-grill', price: 2.8, heat: false, mins: 6, desc: 'Charred corn brushed with chili butter.' },
  { id: 'corn-plate', cat: 'grill', name: 'Corn and rice plate', photo: 'corn-plate', price: 6.2, heat: false, mins: 7, desc: 'Grilled corn, lime, rice and beans with a grilled chicken patty.' },
]
export const itemOf = (id) => ITEMS.find((i) => i.id === id)

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
