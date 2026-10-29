// Sample content for the prototype. Distances are road estimates; times are indicative and say so on the page.

export const PORTS = [
  { id: 'jeddah', pt: 'jeddah', name: { ar: 'ميناء جدة الإسلامي', en: 'Jeddah Islamic Port' }, sea: { ar: 'البحر الأحمر', en: 'Red Sea' }, clear: [2, 4],
    note: { ar: 'أكبر موانئ المملكة وأكثرها ازدحامًا. نحجز موعد الشاحنة قبل التفريغ.', en: 'The Kingdom’s largest and busiest port. We book the truck slot before discharge.' } },
  { id: 'dammam', pt: 'dammam', name: { ar: 'ميناء الملك عبدالعزيز بالدمام', en: 'King Abdulaziz Port, Dammam' }, sea: { ar: 'الخليج العربي', en: 'Arabian Gulf' }, clear: [1, 3],
    note: { ar: 'الأقرب إلى الرياض، وله خط قطار يومي إلى الميناء الجاف.', en: 'Closest to Riyadh, with a daily train to the dry port.' } },
  { id: 'rabigh', pt: 'rabigh', name: { ar: 'ميناء الملك عبدالله برابغ', en: 'King Abdullah Port, Rabigh' }, sea: { ar: 'البحر الأحمر', en: 'Red Sea' }, clear: [1, 3],
    note: { ar: 'بديل أهدأ لجدة على البحر الأحمر، شمالها بنحو ١٥٠ كم.', en: 'A quieter Red Sea alternative to Jeddah, about 150 km north of it.' } },
]

export const CITIES = [
  { id: 'riyadh', name: { ar: 'الرياض', en: 'Riyadh' } },
  { id: 'jeddah', name: { ar: 'جدة', en: 'Jeddah' } },
  { id: 'dammam', name: { ar: 'الدمام', en: 'Dammam' } },
  { id: 'jubail', name: { ar: 'الجبيل', en: 'Jubail' } },
  { id: 'madinah', name: { ar: 'المدينة المنورة', en: 'Madinah' } },
  { id: 'buraydah', name: { ar: 'بريدة', en: 'Buraydah' } },
  { id: 'hail', name: { ar: 'حائل', en: 'Hail' } },
  { id: 'tabuk', name: { ar: 'تبوك', en: 'Tabuk' } },
  { id: 'abha', name: { ar: 'أبها', en: 'Abha' } },
]

// Road kilometres from each port to each city (rounded estimates).
export const KM = {
  jeddah: { riyadh: 1024, jeddah: 15, dammam: 1360, jubail: 1430, madinah: 420, buraydah: 980, hail: 850, tabuk: 1040, abha: 620 },
  dammam: { riyadh: 410, jeddah: 1360, dammam: 10, jubail: 95, madinah: 1310, buraydah: 680, hail: 980, tabuk: 1630, abha: 1330 },
  rabigh: { riyadh: 1080, jeddah: 150, dammam: 1420, jubail: 1470, madinah: 330, buraydah: 900, hail: 790, tabuk: 900, abha: 760 },
}

// Cities a truck passes through, for drawing the route on the map.
export const VIA = { 'jeddah-dammam': ['riyadh'], 'jeddah-jubail': ['riyadh'], 'rabigh-dammam': ['riyadh'], 'rabigh-jubail': ['riyadh'], 'dammam-jeddah': ['riyadh'], 'dammam-madinah': ['buraydah'], 'dammam-tabuk': ['hail'], 'dammam-abha': ['riyadh'] }

export function plan(port, city) {
  const km = KM[port][city]
  const p = PORTS.find((x) => x.id === port)
  const road = km < 120 ? [0, 1] : km < 650 ? [1, 1] : km < 1150 ? [1, 2] : [2, 3]
  return { km, clear: p.clear, road, total: [p.clear[0] + road[0], p.clear[1] + road[1]] }
}

export const OFFICES = [
  { id: 'jeddah', pt: 'jeddah', city: { ar: 'جدة', en: 'Jeddah' }, role: { ar: 'المكتب الرئيسي والتخليص في ميناء جدة الإسلامي', en: 'Head office and clearance at Jeddah Islamic Port' },
    addr: { ar: 'حي الحمراء، طريق الكورنيش', en: 'Al Hamra district, Corniche Road' }, photo: 'roshan-house' },
  { id: 'riyadh', pt: 'riyadh', city: { ar: 'الرياض', en: 'Riyadh' }, role: { ar: 'المبيعات والمستودع المركزي قرب الميناء الجاف', en: 'Sales and the central warehouse near the dry port' },
    addr: { ar: 'حي العليا، طريق الملك فهد', en: 'Al Olaya district, King Fahd Road' }, photo: 'riyadh-dusk' },
  { id: 'dammam', pt: 'dammam', city: { ar: 'الدمام', en: 'Dammam' }, role: { ar: 'التخليص في ميناء الملك عبدالعزيز والعبور إلى الخليج', en: 'Clearance at King Abdulaziz Port and GCC crossings' },
    addr: { ar: 'المدينة الصناعية الثانية', en: 'Second Industrial City' }, photo: 'over-dammam' },
]

export const HOURS = {
  office: { ar: 'الأحد إلى الخميس، ٨ صباحًا إلى ٥ مساءً', en: 'Sunday to Thursday, 8 am to 5 pm' },
  ops: { ar: 'العمليات في الموانئ على مدار الساعة، والمستودعات تعمل يوم السبت', en: 'Port operations around the clock; warehouses open on Saturday' },
}

export const SCHEDULE = [
  { day: { ar: 'من الصين', en: 'From China' }, rows: [
    { from: { ar: 'شنغهاي', en: 'Shanghai' }, to: { ar: 'جدة', en: 'Jeddah' }, mode: { ar: 'حاوية مجمّعة', en: 'Shared container' }, cut: { ar: 'إغلاق الأحد', en: 'Cut-off Sunday' }, days: [24, 28] },
    { from: { ar: 'نينغبو', en: 'Ningbo' }, to: { ar: 'الدمام', en: 'Dammam' }, mode: { ar: 'حاوية مجمّعة', en: 'Shared container' }, cut: { ar: 'إغلاق الثلاثاء', en: 'Cut-off Tuesday' }, days: [26, 30] },
    { from: { ar: 'شنتشن', en: 'Shenzhen' }, to: { ar: 'جدة', en: 'Jeddah' }, mode: { ar: 'حاوية كاملة', en: 'Full container' }, cut: { ar: 'إغلاق الخميس', en: 'Cut-off Thursday' }, days: [22, 26] },
  ] },
  { day: { ar: 'من الهند والخليج', en: 'From India and the Gulf' }, rows: [
    { from: { ar: 'نافا شيفا', en: 'Nhava Sheva' }, to: { ar: 'جدة', en: 'Jeddah' }, mode: { ar: 'حاوية مجمّعة', en: 'Shared container' }, cut: { ar: 'إغلاق الإثنين', en: 'Cut-off Monday' }, days: [9, 12] },
    { from: { ar: 'جبل علي', en: 'Jebel Ali' }, to: { ar: 'الدمام', en: 'Dammam' }, mode: { ar: 'شاحنة عبر البطحاء', en: 'Truck via Al Batha' }, cut: { ar: 'يوميًا', en: 'Daily' }, days: [2, 3] },
    { from: { ar: 'المنامة', en: 'Manama' }, to: { ar: 'الرياض', en: 'Riyadh' }, mode: { ar: 'شاحنة عبر الجسر', en: 'Truck via the Causeway' }, cut: { ar: 'يوميًا', en: 'Daily' }, days: [1, 2] },
  ] },
  { day: { ar: 'من أوروبا', en: 'From Europe' }, rows: [
    { from: { ar: 'روتردام', en: 'Rotterdam' }, to: { ar: 'الدمام', en: 'Dammam' }, mode: { ar: 'حاوية مجمّعة', en: 'Shared container' }, cut: { ar: 'إغلاق الأربعاء', en: 'Cut-off Wednesday' }, days: [24, 30] },
    { from: { ar: 'جنوة', en: 'Genoa' }, to: { ar: 'جدة', en: 'Jeddah' }, mode: { ar: 'حاوية كاملة', en: 'Full container' }, cut: { ar: 'إغلاق الجمعة', en: 'Cut-off Friday' }, days: [10, 14] },
  ] },
]

export const FAQ = [
  { q: { ar: 'ما المستندات التي أحتاجها لاستيراد شحنة إلى المملكة؟', en: 'Which documents do I need to import a shipment into the Kingdom?' },
    a: { ar: 'بوليصة الشحن، والفاتورة التجارية، وقائمة التعبئة، وشهادة المنشأ، وشهادتا سابر: شهادة مطابقة المنتج وشهادة مطابقة الإرسالية. ونحتاج سجلك التجاري ورقمك الضريبي وتفويضًا جمركيًا. نراجعها كلها قبل الإبحار.', en: 'The bill of lading, commercial invoice, packing list, certificate of origin and both SABER certificates: the product certificate and the shipment certificate. We also need your commercial registration, VAT number and a customs power of attorney. We check all of it before sailing.' } },
  { q: { ar: 'جدة أم الدمام: أي ميناء أختار؟', en: 'Jeddah or Dammam: which port should I choose?' },
    a: { ar: 'إن كانت بضاعتك قادمة من آسيا عبر البحر الأحمر ووجهتها الغرب، فجدة أو رابغ. وإن كانت وجهتها الرياض أو المنطقة الشرقية، فالدمام أقرب بنحو ٦٠٠ كم على الطريق. أداة المسار في الصفحة الرئيسية تقارن بينهما.', en: 'If your goods come from Asia through the Red Sea and are going west, use Jeddah or Rabigh. If they are going to Riyadh or the Eastern Province, Dammam is about 600 km closer by road. The route tool on the home page compares them.' } },
  { q: { ar: 'كم يستغرق التخليص الجمركي؟', en: 'How long does customs clearance take?' },
    a: { ar: 'بين يوم وثلاثة أيام عمل عادة عندما تكون المستندات كاملة. أكثر ما يؤخره نقص شهادة سابر أو خطأ في الرمز المنسّق، وهذا ما نراجعه مبكرًا.', en: 'Usually one to three working days when the documents are complete. A missing SABER certificate or a wrong HS code is what delays it most, which is what we check early.' } },
  { q: { ar: 'هل تنقلون البضائع المبرّدة؟', en: 'Do you move chilled and frozen goods?' },
    a: { ar: 'نعم، بحاويات ومقطورات مبرّدة مع سجل لدرجة الحرارة طوال الرحلة، وتخزين مبرّد ومجمّد في الرياض وجدة والدمام.', en: 'Yes, in reefer containers and trailers with a temperature log for the whole trip, and chilled and frozen storage in Riyadh, Jeddah and Dammam.' } },
  { q: { ar: 'كيف أتابع شحنتي؟', en: 'How do I follow my shipment?' },
    a: { ar: 'أدخل رقم الشحنة في صفحة التتبع. يظهر لك كل حدث من التحميل حتى التسليم، والخطوة التالية، وما إذا كان شيء ينتظر منك.', en: 'Enter the shipment number on the tracking page. You see every event from loading to delivery, the next step, and whether anything is waiting on you.' } },
  { q: { ar: 'هل تقدّمون خدماتكم لدول الخليج؟', en: 'Do you serve the other GCC countries?' },
    a: { ar: 'ننقل بالشاحنات إلى الإمارات عبر منفذ البطحاء، وإلى البحرين عبر جسر الملك فهد، ونخلّص الشحنات العابرة.', en: 'We truck to the UAE through Al Batha and to Bahrain over the King Fahd Causeway, and clear goods in transit.' } },
]

// Demo tracking numbers. Times are in Riyadh time.
export const SHIPMENTS = {
  'DRB-240117': {
    mode: 'sea', from: { ar: 'شنغهاي، الصين', en: 'Shanghai, China' }, to: { ar: 'الرياض', en: 'Riyadh' }, port: 'jeddah', dest: 'riyadh',
    goods: { ar: 'حاوية ٤٠ قدمًا، أدوات منزلية، ١٨٫٤ طن', en: '40 ft container, household goods, 18.4 t' }, ref: 'MSKU 704 1129',
    state: 'road', eta: '2026-10-31',
    events: [
      { at: '2026-09-27T14:20', what: { ar: 'تم تحميل الحاوية على السفينة في شنغهاي', en: 'Container loaded on board in Shanghai' }, done: true },
      { at: '2026-10-02T09:00', what: { ar: 'إصدار شهادة مطابقة الإرسالية من سابر', en: 'SABER shipment certificate issued' }, done: true },
      { at: '2026-10-24T06:40', what: { ar: 'وصلت السفينة إلى ميناء جدة الإسلامي', en: 'Vessel arrived at Jeddah Islamic Port' }, done: true },
      { at: '2026-10-26T11:15', what: { ar: 'تقديم البيان الجمركي على فسح', en: 'Customs declaration filed on FASAH' }, done: true },
      { at: '2026-10-28T13:50', what: { ar: 'تم الإفراج الجمركي ودفع الرسوم', en: 'Released by customs, duties paid' }, done: true },
      { at: '2026-10-29T05:30', what: { ar: 'غادرت الشاحنة جدة متجهة إلى الرياض', en: 'Truck left Jeddah for Riyadh' }, done: true, now: true },
      { at: '2026-10-30T10:00', what: { ar: 'التسليم إلى مستودعك في الرياض', en: 'Delivery to your Riyadh warehouse' }, done: false },
    ],
  },
  'DRB-240233': {
    mode: 'sea', from: { ar: 'نينغبو، الصين', en: 'Ningbo, China' }, to: { ar: 'الدمام', en: 'Dammam' }, port: 'dammam', dest: 'dammam',
    goods: { ar: 'حاوية مجمّعة، ٦ منصات، أجهزة كهربائية', en: 'Shared container, 6 pallets, electrical appliances' }, ref: 'LCL-NGB-0419',
    state: 'hold', eta: null,
    hold: { ar: 'الشحنة متوقفة في الميناء: شهادة مطابقة الإرسالية من سابر لم تصدر بعد لأن تقرير الاختبار IECEE CB لأحد الأصناف منتهي. أرسل لنا تقريرًا ساريًا لنكمل الطلب.', en: 'Held at the port: the SABER shipment certificate is not issued yet because the IECEE CB test report for one item has expired. Send us a valid report and we complete the request.' },
    events: [
      { at: '2026-09-30T16:00', what: { ar: 'تم تحميل الحاوية في نينغبو', en: 'Container loaded in Ningbo' }, done: true },
      { at: '2026-10-27T08:10', what: { ar: 'وصلت السفينة إلى ميناء الملك عبدالعزيز', en: 'Vessel arrived at King Abdulaziz Port' }, done: true },
      { at: '2026-10-28T12:30', what: { ar: 'طلب شهادة مطابقة الإرسالية مرفوض: تقرير اختبار منتهي', en: 'Shipment certificate request returned: expired test report' }, done: true, now: true, warn: true },
      { at: null, what: { ar: 'التخليص على فسح', en: 'Clearance on FASAH' }, done: false },
      { at: null, what: { ar: 'التسليم في الدمام', en: 'Delivery in Dammam' }, done: false },
    ],
  },
  'DRB-239981': {
    mode: 'land', from: { ar: 'جبل علي، الإمارات', en: 'Jebel Ali, UAE' }, to: { ar: 'الرياض', en: 'Riyadh' }, port: 'dammam', dest: 'riyadh',
    goods: { ar: 'شاحنة كاملة، مواد غذائية مبرّدة عند ٤ درجات', en: 'Full truck, chilled food at 4 °C' }, ref: 'FTL-JEA-2211',
    state: 'done', eta: '2026-10-21',
    events: [
      { at: '2026-10-19T07:00', what: { ar: 'التحميل في جبل علي', en: 'Loaded in Jebel Ali' }, done: true },
      { at: '2026-10-19T19:40', what: { ar: 'العبور من منفذ البطحاء', en: 'Crossed at Al Batha' }, done: true },
      { at: '2026-10-20T15:10', what: { ar: 'الإفراج الجمركي', en: 'Released by customs' }, done: true },
      { at: '2026-10-21T09:25', what: { ar: 'تم التسليم في الرياض، وقّع المستلم', en: 'Delivered in Riyadh, signed for' }, done: true, now: true },
    ],
  },
}

export const JOBS = [
  { id: 'broker', title: { ar: 'مخلّص جمركي معتمد', en: 'Licensed customs broker' }, city: { ar: 'جدة', en: 'Jeddah' }, type: { ar: 'دوام كامل', en: 'Full time' },
    body: { ar: 'تقديم البيانات على فسح ومتابعتها، وحضور المعاينة في ميناء جدة الإسلامي. رخصة مخلّص سارية وخبرة سنتين.', en: 'File and follow declarations on FASAH and attend inspections at Jeddah Islamic Port. A valid broker licence and two years of experience.' } },
  { id: 'dispatch', title: { ar: 'منسّق أسطول', en: 'Fleet dispatcher' }, city: { ar: 'الرياض', en: 'Riyadh' }, type: { ar: 'دوام كامل، مناوبات', en: 'Full time, shifts' },
    body: { ar: 'توزيع الشاحنات على الطلبات، ومتابعة السائقين على الطريق، والتواصل مع العملاء عند أي تأخير.', en: 'Assign trucks to orders, follow drivers on the road, and keep customers informed of any delay.' } },
  { id: 'wh', title: { ar: 'مشرف مستودع مبرّد', en: 'Cold store supervisor' }, city: { ar: 'الدمام', en: 'Dammam' }, type: { ar: 'دوام كامل', en: 'Full time' },
    body: { ar: 'إدارة فريق الاستلام والتجهيز في المستودع المبرّد، والجرد الدوري، وسجلات درجات الحرارة.', en: 'Run the receiving and picking team in the cold store, cycle counts and temperature records.' } },
  { id: 'sales', title: { ar: 'مدير حسابات، شحن بحري', en: 'Account manager, sea freight' }, city: { ar: 'الرياض', en: 'Riyadh' }, type: { ar: 'دوام كامل', en: 'Full time' },
    body: { ar: 'العناية بعملاء الاستيراد من آسيا، من عرض السعر حتى التسليم، وزيارتهم في مواقعهم.', en: 'Look after importers bringing goods from Asia, from quote to delivery, and visit them on site.' } },
  { id: 'grad', title: { ar: 'برنامج الخريجين في اللوجستيات', en: 'Logistics graduate programme' }, city: { ar: 'جدة والرياض والدمام', en: 'Jeddah, Riyadh and Dammam' }, type: { ar: '١٢ شهرًا', en: '12 months' },
    body: { ar: 'سنة تتنقل فيها بين التخليص والنقل والمستودعات، مع مشرف في كل محطة. للخريجين السعوديين الجدد.', en: 'A year rotating through clearance, trucking and warehousing, with a mentor at each stop. For new Saudi graduates.' } },
]
