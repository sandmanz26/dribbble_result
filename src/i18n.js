// Every string in both languages. Arabic is written first because most members read Arabic first.
export const T = {
  home: { ar: 'الرئيسية', en: 'Home' },
  search: { ar: 'بحث', en: 'Search' },
  lists: { ar: 'القوائم', en: 'Lists' },
  assistant: { ar: 'المساعد', en: 'Assistant' },
  cart: { ar: 'السلة', en: 'Basket' },
  hello: { ar: 'مساء الخير', en: 'Good evening' },
  yourShare: { ar: 'نصيبك من أرباح المشتريات هذا العام', en: 'Your purchase dividend this year' },
  estimated: { ar: 'تقديري، تحدده الجمعية العمومية', en: 'Estimate, set by the general assembly' },
  deliverTo: { ar: 'التوصيل إلى', en: 'Deliver to' },
  searchPh: { ar: 'ابحث بالعربي أو English', en: 'Search in English or عربي' },
  deals: { ar: 'عروض هذا الأسبوع', en: "This week's deals" },
  local: { ar: 'من مزارع الكويت', en: 'From Kuwaiti farms' },
  categories: { ar: 'الأقسام', en: 'Departments' },
  fromYourList: { ar: 'من قائمتك', en: 'From your list' },
  add: { ar: 'أضف', en: 'Add' },
  addToCart: { ar: 'أضف إلى السلة', en: 'Add to basket' },
  addToList: { ar: 'أضف إلى قائمة', en: 'Add to a list' },
  inCart: { ar: 'في السلة', en: 'in basket' },
  back: { ar: 'رجوع', en: 'Back' },
  aisle: { ar: 'ممر', en: 'Aisle' },
  origin: { ar: 'المنشأ', en: 'Origin' },
  dividendBack: { ar: 'يعود لك تقريبًا', en: 'About this back to you' },
  substitute: { ar: 'إذا نفد، استبدله بمنتج مشابه', en: 'If out of stock, swap for a similar item' },
  results: { ar: 'نتيجة', en: 'results' },
  matchedAlt: { ar: 'وجدناه بكتابة أخرى', en: 'Found under another spelling' },
  matchedTypo: { ar: 'هل تقصد', en: 'Did you mean' },
  noResults: { ar: 'لم نجد شيئًا بهذا الاسم.', en: 'Nothing by that name.' },
  askAssistant: { ar: 'اسأل المساعد', en: 'Ask the assistant' },
  recent: { ar: 'عمليات بحث سابقة', en: 'Recent searches' },
  sortAisle: { ar: 'رتّب حسب ممرات الفرع', en: 'Sort by branch aisles' },
  sortAdded: { ar: 'حسب الإضافة', en: 'As added' },
  sharedWith: { ar: 'مشتركة مع', en: 'Shared with' },
  addAll: { ar: 'أضف الكل إلى السلة', en: 'Add all to basket' },
  notInCatalog: { ar: 'غير موجود في المتجر، اسأل الموظف', en: 'Not in the shop, ask staff' },
  addItem: { ar: 'أضف إلى القائمة…', en: 'Add to the list…' },
  checkout: { ar: 'إتمام الطلب', en: 'Checkout' },
  subtotal: { ar: 'المجموع', en: 'Subtotal' },
  delivery: { ar: 'التوصيل', en: 'Delivery' },
  total: { ar: 'الإجمالي', en: 'Total' },
  emptyCart: { ar: 'السلة فارغة', en: 'Your basket is empty' },
  express: { ar: 'سريع خلال ٤٥ دقيقة', en: 'Express in 45 min' },
  scheduled: { ar: 'في موعد تختاره', en: 'At a time you choose' },
  pickup: { ar: 'استلام من الفرع', en: 'Pick up at the branch' },
  shareholderNo: { ar: 'رقم المساهم', en: 'Shareholder no.' },
  placeOrder: { ar: 'تأكيد الطلب', en: 'Place order' },
  member: { ar: 'العضوية', en: 'Membership' },
  kd: { ar: 'د.ك', en: 'KD' },
  free: { ar: 'مجاني', en: 'Free' },
}

export const t = (k, lang) => (T[k] ? T[k][lang] : k)

// Kuwaiti dinar has three decimals. Arabic shows Arabic-Indic digits by default; a setting can switch to Latin.
export function kd(n, lang, latinDigits = false) {
  const s = n.toFixed(3)
  if (lang === 'ar' && !latinDigits) return `${toArDigits(s.replace('.', '٫'))} د.ك`
  return `${s} KD`
}
export const toArDigits = (s) => String(s).replace(/[0-9]/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d])
export const num = (n, lang, latin = false) => (lang === 'ar' && !latin ? toArDigits(n) : String(n))
