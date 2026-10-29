import { Link } from 'react-router-dom'
import { useLang } from '../i18n.jsx'
import * as I from '../ui/icons.jsx'

const WAYS = [
  [{ ar: 'شخص واحد لكل شحنة', en: 'One person per shipment' }, { ar: 'من الحجز حتى التسليم يبقى معك الموظف نفسه، يعرف بضاعتك ويرد عليك باسمه.', en: 'From booking to delivery the same person stays with you, knows your goods and answers you by name.' }],
  [{ ar: 'الأوراق قبل السفينة', en: 'Paperwork before the ship' }, { ar: 'نراجع المستندات وشهادات سابر قبل الإبحار، لأن ورقة ناقصة في الميناء تكلّف أيامًا.', en: 'We check the documents and SABER certificates before sailing, because a missing paper at the port costs days.' }],
  [{ ar: 'التأخير يُقال مبكرًا', en: 'Delays are said early' }, { ar: 'إن تأخرت سفينة أو شاحنة تعرف ذلك منا قبل أن تسأل، ومعه الخطة البديلة.', en: 'If a ship or a truck runs late you hear it from us before you ask, with the fallback plan.' }],
  [{ ar: 'السعر كما هو في العرض', en: 'The price you were quoted' }, { ar: 'العرض يذكر كل رسم متوقع: الميناء، والتخليص، والتخزين، والنقل. لا مفاجآت في الفاتورة.', en: 'The quote lists every expected charge: port, clearance, storage and trucking. No surprises on the invoice.' }],
]

export default function About() {
  const { t } = useLang()
  return (
    <div className="page">
      <section className="about-name wrap" aria-labelledby="ab-h">
        <h1 id="ab-h" className="sr">{t({ ar: 'من نحن', en: 'About Darb' })}</h1>
        <p className="about-word" lang="ar" aria-hidden="true">دَرْب</p>
        <div className="about-def" data-reveal>
          <p className="def-head">{t({ ar: 'دَرْب، اسم. جمعه دروب.', en: 'darb, noun. Plural: durub.' })}</p>
          <p className="lead">{t({ ar: 'الطريق الذي يُسلك حتى يُعرف. وكانت الدروب تربط موانئ البحر الأحمر بنجد قبل الطرق المعبّدة بقرون.', en: 'A path walked until it is known. Long before paved roads, the durub joined the Red Sea ports to Najd.' })}</p>
          <p>{t({ ar: 'بدأت درب في جدة مكتبًا للتخليص قرب الميناء، ثم أضافت النقل البري لأن العملاء أرادوا جهة واحدة تتسلم الحاوية من الرصيف وتسلّمها عند الباب. اليوم نعمل من جدة والرياض والدمام.', en: 'Darb began in Jeddah as a clearance office near the port, then added trucking because customers wanted one company to take the container from the quay to the door. Today we work from Jeddah, Riyadh and Dammam.' })}</p>
          <p className="fine">{t({ ar: 'نص تجريبي يُستبدل بقصة الشركة الفعلية.', en: 'Sample copy, to be replaced by the company’s own story.' })}</p>
        </div>
      </section>

      <section className="spread" aria-label={t({ ar: 'صور', en: 'Photographs' })}>
        <figure data-reveal><img src="photos/roshan-house.webp" alt={t({ ar: 'بيت قديم برواشين خشبية', en: 'An old house with wooden roshan windows' })} width="763" height="1024" loading="lazy" /><figcaption>{t({ ar: 'الرواشين، نوافذ البيوت القديمة في الحجاز', en: 'Roshan windows of the old Hejaz houses' })}</figcaption></figure>
        <figure data-reveal><img src="photos/laden-dhows.webp" alt={t({ ar: 'مراكب شراعية محمّلة بالبضائع', en: 'Dhows loaded with cargo' })} width="1024" height="683" loading="lazy" /><figcaption>{t({ ar: 'مراكب محمّلة على ساحل الخليج', en: 'Laden dhows on the Gulf coast' })}</figcaption></figure>
      </section>

      <section className="ways wrap" aria-labelledby="ways-h">
        <h2 id="ways-h" className="h-big">{t({ ar: 'كيف نعمل', en: 'How we work' })}</h2>
        <dl data-reveal>{WAYS.map(([h, d]) => <div key={h.en}><dt>{t(h)}</dt><dd>{t(d)}</dd></div>)}</dl>
      </section>

      <section className="licences wrap" aria-labelledby="lic-h" data-reveal>
        <h2 id="lic-h" className="h-small">{t({ ar: 'التراخيص', en: 'Licences' })}</h2>
        <ul>
          <li><I.Shield aria-hidden="true" />{t({ ar: 'السجل التجاري [رقم السجل]', en: 'Commercial registration [number]' })}</li>
          <li><I.Shield aria-hidden="true" />{t({ ar: 'ترخيص التخليص الجمركي من هيئة الزكاة والضريبة والجمارك [رقم الترخيص]', en: 'Customs broker licence from ZATCA [licence number]' })}</li>
          <li><I.Shield aria-hidden="true" />{t({ ar: 'ترخيص الهيئة العامة للنقل لنقل البضائع [رقم الترخيص]', en: 'Transport General Authority goods transport licence [licence number]' })}</li>
        </ul>
        <p className="fine">{t({ ar: 'تُملأ الأرقام من مستندات الشركة قبل النشر.', en: 'Numbers are filled from the company’s documents before launch.' })}</p>
        <Link to="/careers" className="link-arrow">{t({ ar: 'انضم إلى الفريق', en: 'Join the team' })} <I.Fwd /></Link>
      </section>
    </div>
  )
}
