// Sample catalogue. Prices in Kuwaiti dinar (3 decimals). Aisles per branch drive the in-store list order.
// `alt` holds the other ways people type the product: transliteration, dialect, common misspellings.
export const CATS = [
  { id: 'fresh', ar: 'خضار وفواكه', en: 'Fruit & veg' },
  { id: 'dairy', ar: 'ألبان وبيض', en: 'Dairy & eggs' },
  { id: 'bakery', ar: 'مخبز', en: 'Bakery' },
  { id: 'meat', ar: 'لحوم وأسماك', en: 'Meat & fish' },
  { id: 'pantry', ar: 'مواد غذائية', en: 'Pantry' },
  { id: 'home', ar: 'منزل', en: 'Home' },
]

const P = (id, cat, ar, en, price, unit, aisles, alt = [], extra = {}) => ({ id, cat, ar, en, price, unit, aisles, alt, img: `p/${id}.webp`, thumb: `p/${id}-s.webp`, ...extra })

export const PRODUCTS = [
  P('tomatoes', 'fresh', 'طماطم', 'Vine tomatoes', 0.450, { ar: 'كيلو', en: 'kg' }, { main: 1, b4: 2 }, ['tamatem', 'banadora', 'بندورة', 'tomato', 'tomatos'], { origin: { ar: 'الأردن', en: 'Jordan' } }),
  P('cucumbers', 'fresh', 'خيار', 'Cucumbers', 0.390, { ar: 'كيلو', en: 'kg' }, { main: 1, b4: 2 }, ['khiyar', 'cucumber'], { origin: { ar: 'الكويت', en: 'Kuwait' }, local: true }),
  P('dates', 'fresh', 'تمر مجدول', 'Medjool dates', 3.250, { ar: '١ كيلو', en: '1 kg' }, { main: 6, b4: 5 }, ['tamr', 'tamer', 'majdool', 'date', 'تمور'], { origin: { ar: 'السعودية', en: 'Saudi Arabia' }, deal: 2.900 }),
  P('bananas', 'fresh', 'موز', 'Bananas', 0.350, { ar: 'كيلو', en: 'kg' }, { main: 1, b4: 2 }, ['mooz', 'banana', 'bananna']),
  P('oranges', 'fresh', 'برتقال', 'Oranges', 0.420, { ar: 'كيلو', en: 'kg' }, { main: 1, b4: 2 }, ['burtuqal', 'portugal', 'orange'], { origin: { ar: 'مصر', en: 'Egypt' } }),
  P('lemons', 'fresh', 'ليمون', 'Lemons', 0.480, { ar: 'كيلو', en: 'kg' }, { main: 1, b4: 2 }, ['laymoon', 'lemon', 'lime', 'لومي']),
  P('onions', 'fresh', 'بصل', 'Onions', 0.280, { ar: 'كيلو', en: 'kg' }, { main: 1, b4: 2 }, ['basal', 'onion']),
  P('mint', 'fresh', 'نعناع', 'Mint bunch', 0.150, { ar: 'ربطة', en: 'bunch' }, { main: 1, b4: 2 }, ['naana', 'nana', 'mint', 'نعناع طازج'], { local: true }),
  P('strawberries', 'fresh', 'فراولة', 'Strawberries', 1.100, { ar: '٢٥٠ غ', en: '250 g' }, { main: 1, b4: 2 }, ['farawla', 'strawberry', 'strawbery'], { deal: 0.950 }),
  P('laban', 'dairy', 'لبن', 'Laban', 0.300, { ar: '١ لتر', en: '1 L' }, { main: 3, b4: 3 }, ['laban', 'leban', 'buttermilk', 'لبن رائب']),
  P('milk', 'dairy', 'حليب طازج', 'Fresh milk', 0.380, { ar: '١ لتر', en: '1 L' }, { main: 3, b4: 3 }, ['haleeb', 'halib', 'milk', 'حليب']),
  P('eggs', 'dairy', 'بيض', 'Brown eggs', 1.250, { ar: '٣٠ حبة', en: '30 pcs' }, { main: 3, b4: 3 }, ['bayd', 'baid', 'egg', 'eggs'], { local: true }),
  P('labneh', 'dairy', 'لبنة', 'Labneh', 0.750, { ar: '٤٠٠ غ', en: '400 g' }, { main: 3, b4: 3 }, ['labne', 'labna', 'labneh']),
  P('halloumi', 'dairy', 'جبن حلوم', 'Halloumi', 1.450, { ar: '٢٥٠ غ', en: '250 g' }, { main: 3, b4: 3 }, ['halloum', 'hallomi', 'halumi', 'جبنة حلوم', 'cheese', 'جبن']),
  P('khubz', 'bakery', 'خبز عربي', 'Arabic bread', 0.150, { ar: '٦ أرغفة', en: '6 loaves' }, { main: 2, b4: 1 }, ['khubz', 'khobz', 'bread', 'خبز', 'pita'], { local: true }),
  P('chicken', 'meat', 'صدر دجاج', 'Chicken breast', 1.950, { ar: '١ كيلو', en: '1 kg' }, { main: 4, b4: 4 }, ['dajaj', 'djaj', 'chicken', 'دجاج'], { origin: { ar: 'الكويت', en: 'Kuwait' }, local: true }),
  P('hammour', 'meat', 'سمك هامور', 'Hammour', 4.800, { ar: '١ كيلو', en: '1 kg' }, { main: 4, b4: 4 }, ['hamour', 'hamoor', 'grouper', 'fish', 'سمك']),
  P('rice', 'pantry', 'أرز بسمتي', 'Basmati rice', 2.150, { ar: '٥ كيلو', en: '5 kg' }, { main: 5, b4: 6 }, ['ruz', 'aish', 'عيش', 'rice', 'basmati', 'رز'], { deal: 1.890 }),
  P('oliveoil', 'pantry', 'زيت زيتون', 'Olive oil', 2.400, { ar: '٧٥٠ مل', en: '750 ml' }, { main: 5, b4: 6 }, ['zeit', 'zait', 'olive', 'oil', 'زيت']),
  P('saffron', 'pantry', 'زعفران', 'Saffron', 3.900, { ar: '٤ غ', en: '4 g' }, { main: 6, b4: 5 }, ['zafaran', 'zaafaran', 'saffron', 'safron']),
  P('cardamom', 'pantry', 'هيل', 'Cardamom', 1.600, { ar: '١٠٠ غ', en: '100 g' }, { main: 6, b4: 5 }, ['hail', 'heel', 'cardamon', 'cardamom', 'هال']),
  P('coffee', 'pantry', 'قهوة عربية', 'Arabic coffee', 2.750, { ar: '٥٠٠ غ', en: '500 g' }, { main: 6, b4: 5 }, ['gahwa', 'qahwa', 'kahwa', 'coffee', 'قهوه']),
  P('water', 'pantry', 'ماء', 'Water, 6 pack', 0.600, { ar: '٦ × ١.٥ لتر', en: '6 × 1.5 L' }, { main: 7, b4: 7 }, ['mai', 'maya', 'water', 'مياه', 'مي']),
  P('dishsoap', 'home', 'سائل غسيل صحون', 'Dish soap', 0.850, { ar: '٧٥٠ مل', en: '750 ml' }, { main: 8, b4: 8 }, ['dish', 'soap', 'sabun', 'صابون', 'فيري']),
]

export const byId = (id) => PRODUCTS.find((p) => p.id === id)
export const priceOf = (p) => p.deal ?? p.price

// Aisle names per branch, so the in-store list reads like the shop floor.
export const AISLES = {
  1: { ar: 'الخضار والفواكه', en: 'Fruit & veg' },
  2: { ar: 'المخبز', en: 'Bakery' },
  3: { ar: 'الألبان', en: 'Dairy' },
  4: { ar: 'اللحوم والأسماك', en: 'Meat & fish' },
  5: { ar: 'الأرز والزيوت', en: 'Rice & oils' },
  6: { ar: 'التمور والبهارات', en: 'Dates & spices' },
  7: { ar: 'المياه والمشروبات', en: 'Water & drinks' },
  8: { ar: 'المنظفات', en: 'Cleaning' },
}
