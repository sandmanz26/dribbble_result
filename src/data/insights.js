// Three guides, written as sample editorial content. Facts are dated and sourced at the foot of each.
export const ARTICLES = [
  {
    id: 'saber-shipment-certificate', photo: 'container-yard', date: '2026-10-12',
    title: { ar: 'شهادة مطابقة الإرسالية من سابر: ما الذي تغيّر', en: 'The SABER shipment certificate: what changed' },
    dek: { ar: 'كل إرسالية تحتاج شهادتين قبل أن تخرج من الميناء. ما هما، ومتى تُطلبان، وكم تكلفان.', en: 'Every shipment needs two certificates before it leaves the port. What they are, when to apply, and what they cost.' },
    body: {
      ar: [
        'منصة سابر هي منصة الهيئة السعودية للمواصفات والمقاييس والجودة لإصدار شهادات المطابقة، وهي مرتبطة بمنصة فسح الجمركية منذ يوليو ٢٠٢٠. هذا الربط يعني أن البيان الجمركي لا يتقدم قبل أن تتحقق فسح من الشهادة آليًا.',
        'تحتاج كل إرسالية إلى شهادتين: شهادة مطابقة المنتج، وتصدر مرة واحدة للمنتج وتبقى سارية مدة محددة، وشهادة مطابقة الإرسالية، وتصدر لكل شحنة على حدة. ولم تعد خطابات التعهد مقبولة بديلًا عنهما.',
        'منذ أكتوبر ٢٠٢٥ أصبح طلب شهادة الإرسالية عبر سابر إلزاميًا على المستورد، برسم خدمة يعادل ٠٫١٥٪ من قيمة البضاعة، بحد أدنى ١٥ ريالًا وحد أعلى ٥٠٠ ريال.',
        'أكثر أسباب الرفض شيوعًا تصنيف المنتج تحت رمز منسّق خاطئ، ونقص تقارير الاختبار، مثل تقرير IECEE CB للأجهزة الكهربائية. لذلك نطلب التقارير مع أمر الشحن، لا عند وصول السفينة.',
      ],
      en: [
        'SABER is the Saudi Standards, Metrology and Quality Organization’s platform for certificates of conformity, and it has been linked to the FASAH customs platform since July 2020. That link means a customs declaration does not move until FASAH has checked the certificate automatically.',
        'Every shipment needs two certificates: the product certificate (PCoC), issued once per product and valid for a set period, and the shipment certificate (SCoC), issued for each shipment. Letters of undertaking are no longer accepted in their place.',
        'Since October 2025 the importer must apply for the shipment certificate through SABER, for a service fee of 0.15% of the goods value, with a minimum of 15 riyals and a maximum of 500.',
        'The commonest reasons for a rejection are a product classified under the wrong HS code and missing test reports, such as the IECEE CB report for electrical goods. That is why we ask for the reports with the booking, not when the ship arrives.',
      ],
    },
    sources: [['GTAI, Saudi Arabia customs report', 'https://www.gtai.de/de/trade/saudi-arabien/zoll/zollanmeldung-und-warenbegleitpapiere-621364'], ['QIMA, SASO conformity', 'https://www.qima.com/saso-conformity']],
  },
  {
    id: 'jeddah-or-dammam', photo: 'gantry-cranes', date: '2026-09-28',
    title: { ar: 'جدة أم الدمام: اختيار ميناء الوصول', en: 'Jeddah or Dammam: choosing the port of entry' },
    dek: { ar: 'المسافة على الطريق بعد الميناء تحسم القرار أكثر من مدة الإبحار.', en: 'The distance by road after the port decides more than the days at sea.' },
    body: {
      ar: [
        'تصل البضائع القادمة من آسيا إلى جدة عبر البحر الأحمر، وإلى الدمام بعد الدوران حول شبه الجزيرة. الفرق في الإبحار بضعة أيام، لكن الفرق على الطريق أكبر.',
        'من ميناء جدة الإسلامي إلى الرياض نحو ١٠٢٤ كم ويوم على الطريق. ومن الدمام إلى الرياض ١٠ إلى ١٢ ساعة بالشاحنة، أو يوم بالقطار اليومي إلى الميناء الجاف.',
        'جدة أكبر موانئ المملكة، وفي فترات الذروة تنتظر السفن أيامًا قبل الرسو وتقلّ الشاحنات المتاحة. ميناء الملك عبدالله في رابغ بديل أهدأ على البحر نفسه.',
        'القاعدة التي نعمل بها: إذا كانت الوجهة غرب المملكة فجدة أو رابغ، وإذا كانت الرياض أو المنطقة الشرقية فالدمام، ما لم يكن موعد السفينة إلى جدة أقرب بأسبوع أو أكثر.',
      ],
      en: [
        'Goods from Asia reach Jeddah through the Red Sea, and Dammam after sailing round the peninsula. The difference at sea is a few days; the difference on the road is bigger.',
        'From Jeddah Islamic Port to Riyadh is about 1,024 km and a day on the road. From Dammam to Riyadh is 10 to 12 hours by truck, or a day on the daily train to the dry port.',
        'Jeddah is the Kingdom’s largest port, and at peak times ships wait days to berth and trucks run short. King Abdullah Port at Rabigh is a quieter alternative on the same sea.',
        'The rule we work by: if the destination is in the west, Jeddah or Rabigh; if it is Riyadh or the Eastern Province, Dammam, unless the next sailing to Jeddah is a week or more earlier.',
      ],
    },
    sources: [['MSC, inland transport from Saudi ports', 'https://www.msc.com/-/media/files/msc-cargo/msc-solutions/trades/east-west-network/inland-gulf/inland-transport-to-middle-east-from-saudi.pdf'], ['ONE, Saudi inland services', 'https://me.one-line.com/sa-inland-services']],
  },
  {
    id: 'reading-a-bill-of-lading', photo: 'ship-bow', date: '2026-09-07',
    title: { ar: 'كيف تقرأ بوليصة الشحن', en: 'How to read a bill of lading' },
    dek: { ar: 'ورقة واحدة تثبت الشحن، وتصف البضاعة، وتنقل ملكيتها. خمسة حقول تستحق التدقيق.', en: 'One paper that proves shipment, describes the goods and transfers ownership. Five fields worth checking.' },
    body: {
      ar: [
        'الشاحن والمرسل إليه: يجب أن يطابق اسم المرسل إليه سجلك التجاري حرفيًا، وإلا توقّف الإفراج حتى يُعدَّل.',
        'جهة الإخطار: الطرف الذي يُبلَّغ بوصول السفينة. اكتب فيها وكيل التخليص حتى يبدأ العمل قبل وصولك إلى الخبر.',
        'ميناء التحميل وميناء التفريغ: تأكد أن ميناء التفريغ هو الميناء الذي ستخلّص فيه، فتغيير الميناء بعد الإبحار مكلف.',
        'وصف البضاعة والوزن: يجب أن يطابق الفاتورة وقائمة التعبئة والرمز المنسّق في شهادة سابر. أي اختلاف يعني معاينة.',
        'نوع البوليصة: الأصلية تحتاج تسليمًا ورقيًا قبل الإفراج، أما بوليصة الإفراج الإلكتروني فتختصر أيامًا.',
      ],
      en: [
        'Shipper and consignee: the consignee name must match your commercial registration exactly, or release stops until it is amended.',
        'Notify party: who is told when the ship arrives. Put your clearance agent here so work starts before the news reaches you.',
        'Port of loading and port of discharge: check that the port of discharge is the port you will clear at. Changing it after sailing is expensive.',
        'Description and weight: must match the invoice, the packing list and the HS code on the SABER certificate. Any difference means an inspection.',
        'Type of bill: an original bill must be handed over on paper before release; a telex or electronic release saves days.',
      ],
    },
    sources: [],
  },
]

export const articleOf = (id) => ARTICLES.find((a) => a.id === id)
