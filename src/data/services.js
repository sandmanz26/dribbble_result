// The six services. Copy is sample copy written for the prototype; the client's content drafts replace it.
export const SERVICES = [
  {
    id: 'sea', group: 'sea', photo: 'ship-tug', icon: 'ship',
    name: { ar: 'الشحن البحري', en: 'Sea freight' },
    short: { ar: 'حاويات كاملة ومجمّعة إلى جدة والدمام ورابغ.', en: 'Full and shared containers into Jeddah, Dammam and Rabigh.' },
    lead: {
      ar: 'نحجز لك المساحة على السفينة، ونتابع الحاوية من ميناء التحميل حتى رصيف الميناء السعودي، ثم نسلّمها للتخليص والنقل البري دون أن تنتقل المسؤولية إلى طرف آخر.',
      en: 'We book the space on the ship, follow the container from the port of loading to the Saudi quay, then hand it to clearance and the road without the job changing hands.',
    },
    includes: {
      ar: ['حاوية كاملة FCL بمقاسات ٢٠ و٤٠ قدمًا، ومبرّدة عند الطلب', 'شحن مجمّع LCL أسبوعي من شنغهاي ونينغبو وجبل علي', 'حجز ومتابعة مع خطوط الملاحة الرئيسية', 'إشعار الوصول وطلب الإفراج من ميناء الوصول', 'تخزين مؤقت قرب الميناء عند تأخر الاستلام'],
      en: ['Full container load in 20 and 40 ft, reefer on request', 'Weekly shared container (LCL) from Shanghai, Ningbo and Jebel Ali', 'Booking and tracking with the main ocean carriers', 'Arrival notice and release request at the port of entry', 'Short-term storage near the port when collection is late'],
    },
    steps: [
      { ar: 'الحجز وشهادات سابر', en: 'Booking and SABER certificates', d: { ar: 'قبل الإبحار', en: 'Before sailing' } },
      { ar: 'الإبحار', en: 'At sea', d: { ar: '٢٠ إلى ٢٨ يومًا من الصين', en: '20 to 28 days from China' } },
      { ar: 'الرسو والتفريغ', en: 'Berth and discharge', d: { ar: '١ إلى ٣ أيام', en: '1 to 3 days' } },
      { ar: 'التخليص عبر فسح', en: 'Clearance on FASAH', d: { ar: '١ إلى ٣ أيام', en: '1 to 3 days' } },
    ],
    docs: { ar: ['بوليصة الشحن', 'الفاتورة التجارية', 'قائمة التعبئة', 'شهادة المنشأ', 'شهادة مطابقة الإرسالية من سابر'], en: ['Bill of lading', 'Commercial invoice', 'Packing list', 'Certificate of origin', 'SABER shipment certificate (SCoC)'] },
  },
  {
    id: 'land', group: 'land', photo: 'desert-road', icon: 'truck',
    name: { ar: 'النقل البري', en: 'Land freight' },
    short: { ar: 'شاحنات كاملة ومجمّعة بين مدن المملكة وإلى دول الخليج.', en: 'Full and shared trucks between Saudi cities and across the GCC.' },
    lead: {
      ar: 'من رصيف جدة إلى مستودعك في الرياض خلال يوم تقريبًا. أسطول بمقطورات مسطحة ومغلقة ومبرّدة، وسائقون يعرفون الطريق ونقاط التفتيش والمنافذ.',
      en: 'From the Jeddah quay to your warehouse in Riyadh in about a day. Flatbed, box and refrigerated trailers, and drivers who know the road, the checkpoints and the borders.',
    },
    includes: {
      ar: ['شاحنة كاملة FTL وشحن مجمّع LTL', 'مقطورات مبرّدة للأغذية والأدوية', 'عبور منفذ البطحاء إلى الإمارات وجسر الملك فهد إلى البحرين', 'تتبع لحظي لموقع الشاحنة', 'إثبات تسليم موقّع بالصورة'],
      en: ['Full truckload (FTL) and shared loads (LTL)', 'Refrigerated trailers for food and medicine', 'Crossings at Al Batha to the UAE and the King Fahd Causeway to Bahrain', 'Live truck location', 'Signed proof of delivery with photo'],
    },
    steps: [
      { ar: 'التحميل من الميناء أو المستودع', en: 'Loading at the port or warehouse', d: { ar: 'نفس اليوم', en: 'Same day' } },
      { ar: 'جدة إلى الرياض، نحو ١٠٢٤ كم', en: 'Jeddah to Riyadh, about 1,024 km', d: { ar: 'يوم واحد تقريبًا', en: 'About 1 day' } },
      { ar: 'الدمام إلى الرياض', en: 'Dammam to Riyadh', d: { ar: '١٠ إلى ١٢ ساعة', en: '10 to 12 hours' } },
      { ar: 'التسليم وإثباته', en: 'Delivery and proof', d: { ar: 'عند الوصول', en: 'On arrival' } },
    ],
    docs: { ar: ['أمر النقل', 'بوليصة الشحن البري', 'البيان الجمركي للعبور الخليجي'], en: ['Transport order', 'Road waybill', 'Customs declaration for GCC transit'] },
  },
  {
    id: 'air', group: 'land', photo: 'approach-riyadh', icon: 'plane',
    name: { ar: 'الشحن الجوي', en: 'Air freight' },
    short: { ar: 'عبر مطارات الرياض وجدة والدمام للشحنات العاجلة.', en: 'Through Riyadh, Jeddah and Dammam airports for urgent cargo.' },
    lead: {
      ar: 'قطع غيار متوقفة عليها خطوط إنتاج، وأدوية بدرجة حرارة محددة، وعينات لا تحتمل الانتظار. نحجز على أقرب رحلة ونخلّص في مطار الوصول.',
      en: 'Spare parts that a production line is waiting on, medicine at a set temperature, samples that cannot wait. We book the next flight and clear at the arrival airport.',
    },
    includes: {
      ar: ['من الباب إلى الباب أو من مطار إلى مطار', 'شحنات مبرّدة ومراقبة الحرارة', 'بضائع خطرة بتصنيف IATA', 'تخليص في مطار الملك خالد والملك عبدالعزيز والملك فهد'],
      en: ['Door to door or airport to airport', 'Cool chain with temperature logging', 'Dangerous goods under IATA rules', 'Clearance at King Khalid, King Abdulaziz and King Fahd airports'],
    },
    steps: [
      { ar: 'الحجز والاستلام', en: 'Booking and pick-up', d: { ar: 'خلال ٢٤ ساعة', en: 'Within 24 hours' } },
      { ar: 'الرحلة', en: 'Flight', d: { ar: '١ إلى ٣ أيام', en: '1 to 3 days' } },
      { ar: 'التخليص في المطار', en: 'Airport clearance', d: { ar: '٤ إلى ٢٤ ساعة', en: '4 to 24 hours' } },
    ],
    docs: { ar: ['بوليصة الشحن الجوي', 'الفاتورة التجارية', 'قائمة التعبئة'], en: ['Air waybill', 'Commercial invoice', 'Packing list'] },
  },
  {
    id: 'customs', group: 'ground', photo: 'container-yard', icon: 'doc',
    name: { ar: 'التخليص الجمركي', en: 'Customs clearance' },
    short: { ar: 'البيان على منصة فسح، وشهادات سابر، والرسوم مع هيئة الزكاة والضريبة والجمارك.', en: 'Declarations on FASAH, SABER certificates and duties with ZATCA.' },
    lead: {
      ar: 'معظم تأخير الحاويات في الموانئ سببه ورقة ناقصة أو رمز منسّق خاطئ. نراجع مستنداتك قبل الإبحار، ونصدر شهادات سابر، ونقدّم البيان على فسح فور وصول البيان الملاحي.',
      en: 'Most containers held at Saudi ports are held for a missing paper or a wrong HS code. We check your documents before sailing, issue the SABER certificates, and file on FASAH as soon as the manifest lands.',
    },
    includes: {
      ar: ['تصنيف البضائع بالرمز المنسّق الصحيح', 'شهادة مطابقة المنتج PCoC وشهادة مطابقة الإرسالية SCoC عبر سابر', 'تقديم البيان الجمركي ومتابعته على فسح', 'دفع الرسوم والضريبة نيابة عنك', 'حضور المعاينة في الميناء'],
      en: ['Classification under the right HS code', 'Product (PCoC) and shipment (SCoC) certificates on SABER', 'Customs declaration filed and followed on FASAH', 'Duties and VAT paid on your behalf', 'Attendance at port inspection'],
    },
    steps: [
      { ar: 'مراجعة المستندات', en: 'Document check', d: { ar: 'قبل الإبحار', en: 'Before sailing' } },
      { ar: 'شهادات سابر', en: 'SABER certificates', d: { ar: '٢ إلى ٥ أيام عمل', en: '2 to 5 working days' } },
      { ar: 'البيان على فسح', en: 'Declaration on FASAH', d: { ar: 'عند الوصول', en: 'On arrival' } },
      { ar: 'المعاينة والإفراج', en: 'Inspection and release', d: { ar: '١ إلى ٣ أيام', en: '1 to 3 days' } },
    ],
    docs: { ar: ['السجل التجاري والرقم الضريبي', 'الفاتورة التجارية مصدّقة', 'شهادة المنشأ', 'شهادتا سابر', 'التفويض الجمركي'], en: ['Commercial registration and VAT number', 'Attested commercial invoice', 'Certificate of origin', 'Both SABER certificates', 'Customs power of attorney'] },
  },
  {
    id: 'warehousing', group: 'ground', photo: 'forklift', icon: 'box',
    name: { ar: 'التخزين والتوزيع', en: 'Warehousing and distribution' },
    short: { ar: 'مستودعات عامة ومبرّدة في الرياض وجدة والدمام، وتوزيع على المتاجر.', en: 'General and cold storage in Riyadh, Jeddah and Dammam, with store delivery.' },
    lead: {
      ar: 'نستلم الحاوية، نفرغها ونعدّ محتواها، ونخزّنها على الرفوف بموقع معروف لكل منصة. ثم نجهّز طلبات متاجرك ونوصلها في المواعيد التي تحددها.',
      en: 'We receive the container, unload and count it, and rack every pallet at a known location. Then we pick your store orders and deliver them on the days you set.',
    },
    includes: {
      ar: ['تخزين عام ومبرّد ومجمّد', 'استلام وعدّ وتصوير عند التفريغ', 'تجهيز الطلبات والتغليف وإعادة التعبئة', 'جرد دوري وتقرير مخزون أسبوعي', 'توزيع يومي داخل المدن'],
      en: ['Ambient, chilled and frozen storage', 'Receiving with count and photos at unloading', 'Order picking, packing and relabelling', 'Cycle counts and a weekly stock report', 'Daily distribution inside the cities'],
    },
    steps: [
      { ar: 'الاستلام والعدّ', en: 'Receive and count', d: { ar: 'خلال ٢٤ ساعة', en: 'Within 24 hours' } },
      { ar: 'التخزين', en: 'Put away', d: { ar: 'نفس اليوم', en: 'Same day' } },
      { ar: 'تجهيز الطلب', en: 'Pick and pack', d: { ar: 'قبل الثانية ظهرًا', en: 'Before 2 pm' } },
      { ar: 'التسليم', en: 'Delivery', d: { ar: 'اليوم التالي', en: 'Next day' } },
    ],
    docs: { ar: ['عقد التخزين', 'قائمة الأصناف', 'جدول التوزيع'], en: ['Storage agreement', 'Item master list', 'Distribution schedule'] },
  },
  {
    id: 'project', group: 'sea', photo: 'ship-crane', icon: 'crane',
    name: { ar: 'شحن المشاريع والمعدّات الثقيلة', en: 'Project and heavy cargo' },
    short: { ar: 'معدّات كبيرة الحجم تحتاج مسارًا وتصاريح ومرافقة.', en: 'Oversized equipment that needs a route plan, permits and escort.' },
    lead: {
      ar: 'محوّل كهربائي أو خط إنتاج كامل لا يُشحن في حاوية. نخطط المسار مسبقًا، ونستخرج تصاريح الحمولات الاستثنائية، ونرتّب الرافعات والمرافقة حتى موقع التركيب.',
      en: 'A transformer or a whole production line does not fit in a container. We survey the route, obtain the oversize permits, and arrange the cranes and escort to the installation site.',
    },
    includes: {
      ar: ['دراسة المسار والجسور والارتفاعات', 'تصاريح الحمولات الاستثنائية', 'شحن على سفن البضائع العامة والدحرجة', 'رافعات ومقطورات منخفضة متعددة المحاور', 'مرافقة أمنية على الطريق'],
      en: ['Route survey of bridges and clearances', 'Oversize load permits', 'Breakbulk and roll-on roll-off shipping', 'Cranes and multi-axle low-bed trailers', 'Road escort'],
    },
    steps: [
      { ar: 'دراسة المسار', en: 'Route survey', d: { ar: '١ إلى ٢ أسبوع', en: '1 to 2 weeks' } },
      { ar: 'التصاريح', en: 'Permits', d: { ar: '٢ إلى ٤ أسابيع', en: '2 to 4 weeks' } },
      { ar: 'الشحن والتفريغ', en: 'Shipping and discharge', d: { ar: 'حسب السفينة', en: 'By vessel' } },
      { ar: 'النقل والتركيب', en: 'Haul and set down', d: { ar: 'حسب الموقع', en: 'By site' } },
    ],
    docs: { ar: ['مخططات الأبعاد والأوزان', 'خطة الرفع', 'تصاريح الطرق'], en: ['Dimension and weight drawings', 'Lift plan', 'Road permits'] },
  },
]

export const GROUPS = [
  { id: 'sea', name: { ar: 'عبر البحر', en: 'By sea' }, sum: { ar: 'من موانئ التحميل إلى أرصفة البحر الأحمر والخليج.', en: 'From ports of loading to the Red Sea and Gulf quays.' } },
  { id: 'land', name: { ar: 'عبر البر والجو', en: 'By land and air' }, sum: { ar: 'من الرصيف أو المطار إلى أي مدينة في المملكة.', en: 'From the quay or the airport to any city in the Kingdom.' } },
  { id: 'ground', name: { ar: 'على الأرض', en: 'On the ground' }, sum: { ar: 'الأوراق قبل الوصول، والرفوف بعده.', en: 'The paperwork before arrival, the racks after it.' } },
]

export const serviceOf = (id) => SERVICES.find((s) => s.id === id)
