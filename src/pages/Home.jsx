import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../i18n.jsx'
import { FAQ, SCHEDULE, HOURS } from '../data/site.js'
import RoutePlanner from '../ui/RoutePlanner.jsx'
import Faq from '../ui/Faq.jsx'
import * as I from '../ui/icons.jsx'

// The route a container takes, one photograph per stage, under the pinned name.
const STAGES = [
  { photo: 'ship-tug', ground: '#e3e9ea', place: { ar: 'البحر', en: 'At sea' }, line: { ar: 'الحاوية تقترب من الرصيف', en: 'The container nears the quay' } },
  { photo: 'gantry-cranes', ground: '#e6e7e3', place: { ar: 'الرصيف', en: 'At the quay' }, line: { ar: 'التفريغ، ثم البيان على فسح', en: 'Discharge, then the FASAH declaration' } },
  { photo: 'container-yard', ground: '#e9e6df', place: { ar: 'ساحة الحاويات', en: 'In the yard' }, line: { ar: 'الإفراج بعد اكتمال شهادات سابر', en: 'Release once the SABER certificates clear' } },
  { photo: 'desert-road', ground: '#ece5d9', place: { ar: 'على الطريق', en: 'On the road' }, line: { ar: 'نحو ١٠٢٤ كم من جدة إلى الرياض', en: 'About 1,024 km from Jeddah to Riyadh' } },
  { photo: 'riyadh-dusk', ground: '#e7e1da', place: { ar: 'الرياض', en: 'Riyadh' }, line: { ar: 'التسليم إلى مستودعك', en: 'Delivered to your warehouse' } },
]

const CAPS = [
  { g: { ar: 'عبر البحر', en: 'By sea' }, items: [
    ['sea', { ar: 'حاوية كاملة', en: 'Full container' }, { ar: '٢٠ و٤٠ قدمًا، ومبرّدة عند الطلب.', en: '20 and 40 ft, reefer on request.' }],
    ['sea', { ar: 'حاوية مجمّعة', en: 'Shared container' }, { ar: 'إغلاق أسبوعي من شنغهاي ونينغبو وجبل علي.', en: 'Weekly cut-offs from Shanghai, Ningbo and Jebel Ali.' }],
    ['sea', { ar: 'بضائع مبرّدة', en: 'Reefer cargo' }, { ar: 'سجل حرارة من التحميل حتى الرصيف.', en: 'A temperature log from loading to the quay.' }],
    ['project', { ar: 'بضائع عامة ودحرجة', en: 'Breakbulk and ro-ro' }, { ar: 'لما لا يدخل في حاوية.', en: 'For what does not fit in a box.' }],
    ['project', { ar: 'معدّات المشاريع', en: 'Project cargo' }, { ar: 'دراسة مسار وتصاريح ومرافقة.', en: 'Route survey, permits and escort.' }],
  ] },
  { g: { ar: 'عبر البر والجو', en: 'By land and air' }, items: [
    ['land', { ar: 'شاحنة كاملة', en: 'Full truckload' }, { ar: 'من الرصيف إلى مستودعك مباشرة.', en: 'From the quay straight to your warehouse.' }],
    ['land', { ar: 'شحن بري مجمّع', en: 'Shared truckload' }, { ar: 'منصات قليلة، رحلات يومية بين المدن الكبرى.', en: 'A few pallets, daily runs between the big cities.' }],
    ['land', { ar: 'شاحنات مبرّدة', en: 'Chilled trucks' }, { ar: 'للأغذية والأدوية، بين صفر و٨ درجات.', en: 'For food and medicine, 0 to 8 °C.' }],
    ['land', { ar: 'العبور الخليجي', en: 'GCC crossings' }, { ar: 'البطحاء إلى الإمارات، والجسر إلى البحرين.', en: 'Al Batha to the UAE, the Causeway to Bahrain.' }],
    ['air', { ar: 'الشحن الجوي', en: 'Air freight' }, { ar: 'الرياض وجدة والدمام، للعاجل.', en: 'Riyadh, Jeddah and Dammam, for what is urgent.' }],
  ] },
  { g: { ar: 'على الأرض', en: 'On the ground' }, items: [
    ['customs', { ar: 'التخليص الجمركي', en: 'Customs clearance' }, { ar: 'البيان على فسح، والرسوم مع الهيئة.', en: 'FASAH declarations and duties with ZATCA.' }],
    ['customs', { ar: 'شهادات سابر', en: 'SABER certificates' }, { ar: 'شهادة المنتج وشهادة الإرسالية.', en: 'Product and shipment certificates.' }],
    ['customs', { ar: 'التصنيف الجمركي', en: 'HS classification' }, { ar: 'الرمز الصحيح قبل الإبحار.', en: 'The right code before sailing.' }],
    ['warehousing', { ar: 'التخزين المبرّد', en: 'Cold storage' }, { ar: 'مبرّد ومجمّد في المدن الثلاث.', en: 'Chilled and frozen in all three cities.' }],
    ['warehousing', { ar: 'التوزيع', en: 'Distribution' }, { ar: 'طلبات متاجرك في اليوم التالي.', en: 'Your store orders the next day.' }],
  ] },
]

const SLIP = [
  { h: { ar: 'قبل الإبحار', en: 'Before sailing' }, rows: [[{ ar: 'تأكيد الحجز ومراجعة المستندات', en: 'Booking confirmed, documents checked' }, { ar: 'اليوم الأول', en: 'Day 1' }], [{ ar: 'شهادتا سابر', en: 'Both SABER certificates' }, { ar: '٢ إلى ٥ أيام', en: '2 to 5 days' }]] },
  { h: { ar: 'في البحر', en: 'At sea' }, rows: [[{ ar: 'شنغهاي إلى جدة عبر البحر الأحمر', en: 'Shanghai to Jeddah through the Red Sea' }, { ar: '٢٢ إلى ٢٦ يومًا', en: '22 to 26 days' }]] },
  { h: { ar: 'في جدة', en: 'In Jeddah' }, rows: [[{ ar: 'الرسو والتفريغ', en: 'Berth and discharge' }, { ar: '١ إلى ٣ أيام', en: '1 to 3 days' }], [{ ar: 'البيان على فسح والمعاينة', en: 'FASAH declaration and inspection' }, { ar: '١ إلى ٣ أيام', en: '1 to 3 days' }]] },
  { h: { ar: 'على الطريق', en: 'On the road' }, rows: [[{ ar: 'جدة إلى الرياض، ١٠٢٤ كم', en: 'Jeddah to Riyadh, 1,024 km' }, { ar: 'يوم واحد', en: '1 day' }]] },
]

const FIGURES = [
  [{ ar: '١٠٢٤ كم', en: '1,024 km' }, { ar: 'من ميناء جدة الإسلامي إلى الرياض على الطريق، أي يوم واحد للشاحنة.', en: 'from Jeddah Islamic Port to Riyadh by road, a day for the truck.' }],
  [{ ar: '١٢ ساعة', en: '12 hours' }, { ar: 'أقصى مدة من الدمام إلى الرياض بالشاحنة، أو يوم بالقطار إلى الميناء الجاف.', en: 'at most from Dammam to Riyadh by truck, or a day by train to the dry port.' }],
  [{ ar: '٢', en: '2' }, { ar: 'شهادتان من سابر تحتاجهما كل إرسالية قبل أن يتحرك بيانها على فسح.', en: 'SABER certificates every shipment needs before its FASAH declaration moves.' }],
  [{ ar: '٠٫١٥٪', en: '0.15%' }, { ar: 'رسم شهادة الإرسالية من قيمة البضاعة، بين ١٥ و٥٠٠ ريال.', en: 'of the goods value is the shipment certificate fee, between 15 and 500 riyals.' }],
]

function Hero() {
  const { t } = useLang()
  const ref = useRef(null)
  const [k, setK] = useState(0)
  useEffect(() => {
    const on = () => {
      const el = ref.current; if (!el) return
      const r = el.getBoundingClientRect(); const span = el.offsetHeight - window.innerHeight
      const p = Math.min(0.999, Math.max(0, -r.top / span))
      setK(Math.floor(p * STAGES.length))
    }
    on(); window.addEventListener('scroll', on, { passive: true }); window.addEventListener('resize', on)
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on) }
  }, [])
  const s = STAGES[k]
  return (
    <section className="hero" ref={ref} style={{ '--n': STAGES.length }} aria-labelledby="hero-title">
      <div className="hero-pin" style={{ background: s.ground }}>
        <div className="hero-photos" aria-hidden="true">
          {STAGES.map((x, i) => <img key={x.photo} src={`photos/${x.photo}.webp`} alt="" className={i === k ? 'is-on' : ''} width="800" height="1200" fetchpriority={i === 0 ? 'high' : 'low'} />)}
        </div>
        <h1 id="hero-title" className="monument"><span lang="ar">درب</span><span className="sr">{t({ ar: ' للخدمات اللوجستية: شحن وتخليص جمركي في المملكة', en: ' Logistics: freight and customs clearance in Saudi Arabia' })}</span></h1>
        <p className="hero-stage" aria-live="polite"><b>{t(s.place)}</b><span>{t(s.line)}</span></p>
        <div className="hero-copy">
          <p className="hero-name">{t({ ar: 'درب للخدمات اللوجستية', en: 'Darb Logistics' })}</p>
          <p className="hero-sub">{t({ ar: 'شحن بحري وبري وجوي، وتخليص جمركي وتخزين، من موانئ البحر الأحمر والخليج إلى كل مدينة في المملكة.', en: 'Sea, land and air freight, customs clearance and storage, from the Red Sea and Gulf ports to every city in the Kingdom.' })}</p>
          <Link to="/track" className="link-arrow">{t({ ar: 'تتبع شحنة', en: 'Track a shipment' })} <I.Fwd /></Link>
        </div>
        <Link to="/quote" className="btn is-accent hero-cta">{t({ ar: 'اطلب عرض سعر', en: 'Get a quote' })} <I.Fwd /></Link>
      </div>
    </section>
  )
}

function Capabilities() {
  const { t } = useLang()
  const [on, setOn] = useState(null)
  return (
    <section className="caps wrap" aria-labelledby="caps-h">
      <h2 id="caps-h" className="h-sec">{t({ ar: 'ما ننقله وكيف', en: 'What we move, and how' })}</h2>
      <div className="caps-grid" data-reveal>
        {CAPS.map((c) => (
          <div key={c.g.en} className="caps-col">
            <h3>{t(c.g)}</h3>
            <ul>
              {c.items.map(([id, n, d]) => (
                <li key={n.en}><Link to={`/services/${id}`} onMouseEnter={() => setOn(d)} onFocus={() => setOn(d)} onMouseLeave={() => setOn(null)} onBlur={() => setOn(null)}>{t(n)}</Link><span className="caps-d">{t(d)}</span></li>
              ))}
            </ul>
          </div>
        ))}
        <p className="caps-hint" aria-live="polite">{on ? t(on) : t({ ar: 'مرّر على أي خدمة لترى ما تشمله، أو افتحها.', en: 'Point at any service to see what it covers, or open it.' })}</p>
      </div>
    </section>
  )
}

export default function Home() {
  const { t } = useLang()
  return (
    <>
      <Hero />

      <section className="intro wrap" aria-labelledby="intro-h">
        <div className="intro-col" data-reveal>
          <h2 id="intro-h" className="h-small">{t({ ar: 'من الميناء إلى بابك', en: 'From the port to your door' })}</h2>
          <p className="strong">{t({ ar: 'درب شركة سعودية للخدمات اللوجستية. نستلم بضاعتك من ميناء التحميل في الصين أو الهند أو أوروبا، ونسلّمها إلى بابك في أي مدينة بالمملكة.', en: 'Darb is a Saudi logistics company. We take your goods at the port of loading in China, India or Europe and hand them over at your door in any city in the Kingdom.' })}</p>
          <p>{t({ ar: 'بين النقطتين سفينة، ورصيف، وبيان جمركي على فسح، وشهادتان من سابر، وشاحنة، ومستودع. نتولى ذلك كله بعقد واحد، ويبقى معك موظف واحد يعرف شحنتك.', en: 'Between the two there is a ship, a quay, a FASAH declaration, two SABER certificates, a truck and a warehouse. We handle all of it under one contract, with one person who knows your shipment.' })}</p>
          <p>{t({ ar: 'اسمنا يعني الطريق الذي يُسلك حتى يُعرف. وهذا ما نقدّمه: معرفة الطريق.', en: 'Our name means a path walked until it is known. That is what we offer: knowing the way.' })}</p>
          <p><Link to="/about" className="link">{t({ ar: 'قصة درب', en: 'The story of Darb' })}</Link></p>
        </div>
        <figure className="intro-fig" data-reveal>
          <img src="photos/old-jeddah.webp" alt={t({ ar: 'بيوت جدة القديمة', en: 'Old houses of Jeddah' })} width="1024" height="768" loading="lazy" />
          <figcaption>{t({ ar: 'جدة القديمة، بوابة الحجاز على البحر الأحمر', en: 'Old Jeddah, the Hejaz gateway on the Red Sea' })}</figcaption>
        </figure>
      </section>

      <Capabilities />

      <RoutePlanner />

      <section className="slip-sec" aria-labelledby="slip-h">
        <div className="wrap slip-in">
          <div className="slip-text" data-reveal>
            <h2 id="slip-h" className="h-big">{t({ ar: 'من شنغهاي إلى الرياض', en: 'Shanghai to Riyadh' })}</h2>
            <p>{t({ ar: 'حاوية واحدة من الحجز حتى التسليم، بالمدد التي نخطط عليها. كل خطوة لها مسؤول عندنا، وكل تأخير تعرفه قبل أن يحدث.', en: 'One container from booking to delivery, with the durations we plan on. Each step has an owner on our side, and you hear about a delay before it happens.' })}</p>
            <Link to="/services/sea" className="link-arrow">{t({ ar: 'الشحن البحري', en: 'Sea freight' })} <I.Fwd /></Link>
          </div>
          <div className="slip" data-reveal>
            {SLIP.map((g) => (
              <div key={g.h.en} className="slip-g">
                <h3>{t(g.h)}</h3>
                {g.rows.map(([a, b]) => <p key={a.en} className="slip-row"><span>{t(a)}</span><i aria-hidden="true" /><span>{t(b)}</span></p>)}
              </div>
            ))}
            <p className="slip-total"><span>{t({ ar: 'الحاوية في مستودعك', en: 'Container at your warehouse' })}</span><span>{t({ ar: 'نحو ٤ أسابيع', en: 'About 4 weeks' })}</span></p>
          </div>
        </div>
      </section>

      <section className="figs wrap" aria-labelledby="figs-h">
        <div className="figs-list" data-reveal>
          <h2 id="figs-h" className="h-small">{t({ ar: 'أرقام نخطط عليها', en: 'Numbers we plan around' })}</h2>
          <dl>{FIGURES.map(([f, s]) => <div key={s.en}><dt>{t(f)}</dt><dd>{t(s)}</dd></div>)}</dl>
        </div>
        <figure className="figs-ph" data-reveal>
          <img src="photos/camel-sign.webp" alt={t({ ar: 'لوحة تحذير من عبور الإبل على طريق صحراوي', en: 'Camel crossing sign on a desert road' })} width="1024" height="768" loading="lazy" />
        </figure>
      </section>

      <section className="lineup" aria-labelledby="lineup-h">
        <div className="wrap">
          <div className="lineup-head">
            <h2 id="lineup-h" className="h-big">{t({ ar: 'مواعيد الإغلاق هذا الأسبوع', en: 'This week’s cut-offs' })}</h2>
            <p>{t({ ar: 'جدول نموذجي للشحن المجمّع والبري. المدد بالأيام من الإغلاق حتى الرصيف.', en: 'A sample schedule for shared containers and trucks. Days from cut-off to the quay.' })}</p>
          </div>
          {SCHEDULE.map((g) => (
            <div key={g.day.en} className="lineup-g">
              <h3>{t(g.day)}</h3>
              <table>
                <thead className="sr"><tr><th>{t({ ar: 'المسار', en: 'Route' })}</th><th>{t({ ar: 'النوع', en: 'Mode' })}</th><th>{t({ ar: 'الإغلاق', en: 'Cut-off' })}</th><th>{t({ ar: 'المدة', en: 'Transit' })}</th></tr></thead>
                <tbody>{g.rows.map((r) => <Sailing key={r.from.en + r.to.en} r={r} />)}</tbody>
              </table>
            </div>
          ))}
        </div>
      </section>

      <section className="faq wrap" aria-labelledby="faq-h">
        <h2 id="faq-h" className="h-huge">{t({ ar: 'أسئلة قبل الشحن', en: 'Before you ship' })}</h2>
        <Faq items={FAQ} />
      </section>

      <section className="say" aria-labelledby="say-h">
        <h2 id="say-h" className="say-top">{t({ ar: 'اكتب لنا ماذا تشحن، ومن أين، وإلى أين. نرد بعرض سعر خلال يوم عمل.', en: 'Tell us what you ship, from where and to where. We reply with a quote within a working day.' })}</h2>
        <Link to="/contact" className="say-mail" dir="ltr" lang="en">sales@darb.sa</Link>
        <div className="say-foot">
          <p>{t({ ar: 'جدة · الرياض · الدمام', en: 'Jeddah · Riyadh · Dammam' })}<br />{t(HOURS.office)}</p>
          <p><Link to="/quote">{t({ ar: 'نموذج عرض السعر', en: 'Quote form' })}</Link><Link to="/careers">{t({ ar: 'الوظائف', en: 'Careers' })}</Link></p>
        </div>
      </section>
    </>
  )
}

function Sailing({ r }) {
  const { t, n } = useLang()
  return (
    <tr>
      <td>{t(r.from)} <I.Fwd className="tiny" /> {t(r.to)}</td>
      <td>{t(r.mode)}</td>
      <td>{t(r.cut)}</td>
      <td>{n(r.days[0])} {t({ ar: 'إلى', en: 'to' })} {n(r.days[1])} {t({ ar: 'يومًا', en: 'days' })}</td>
    </tr>
  )
}
