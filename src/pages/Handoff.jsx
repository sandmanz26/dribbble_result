import { Link } from 'react-router-dom'
import { useLang } from '../i18n.jsx'
import * as I from '../ui/icons.jsx'

const COLOURS = [
  ['--ground', '#eeede9', { ar: 'الخلفية: حجر جيري', en: 'Ground: limestone' }],
  ['--surface', '#e3e1db', { ar: 'سطح بدرجة أغمق', en: 'Surface, one step darker' }],
  ['--ink', '#121417', { ar: 'النص: بازلت', en: 'Ink: basalt' }],
  ['--muted', '#4e5459', { ar: 'نص ثانوي', en: 'Secondary text' }],
  ['--field', '#0e2430', { ar: 'الحقل الداكن: البحر الأحمر ليلًا', en: 'Dark field: Red Sea at night' }],
  ['--accent', '#0b7a71', { ar: 'اللون الوحيد: أخضر الرواشين، للفعل الأساسي والمسار', en: 'The one accent: roshan teal, for the main action and the route' }],
  ['--accent-on-field', '#57c2b6', { ar: 'اللون نفسه على الحقل الداكن', en: 'The same accent on the dark field' }],
]
const TYPE = [
  ['monument', 'clamp(9rem, 36vw, 34rem)', '700', '0.9', { ar: 'اسم درب فقط', en: 'The name only' }],
  ['h-huge', 'clamp(2.75rem, 6vw, 5.75rem)', '600', '1.05 / 1.2 ar', { ar: 'عنوان قسم كبير', en: 'Large section heading' }],
  ['h-big', 'clamp(2.25rem, 4.2vw, 4rem)', '600', '1.08 / 1.25 ar', { ar: 'عنوان الصفحة', en: 'Page title' }],
  ['h-mid', 'clamp(1.5rem, 2.2vw, 2.125rem)', '500', '1.2 / 1.4 ar', { ar: 'عنوان فرعي', en: 'Sub heading' }],
  ['lead', 'clamp(1.125rem, 1.4vw, 1.375rem)', '400', '1.5 / 1.75 ar', { ar: 'فقرة افتتاحية', en: 'Lead paragraph' }],
  ['body', '1.0625rem', '400', '1.55 / 1.8 ar', { ar: 'النص', en: 'Body' }],
  ['small', '0.875rem', '400', '1.5', { ar: 'ملاحظات', en: 'Notes' }],
]
const RULES = [
  [{ ar: 'الاتجاه من وسم html', en: 'Direction comes from the html tag' }, { ar: 'dir="rtl" وlang="ar-SA" للعربية، وdir="ltr" للإنجليزية. لا نكرر الاتجاه على العناصر إلا للمحتوى اللاتيني داخل صفحة عربية.', en: 'dir="rtl" and lang="ar-SA" for Arabic, dir="ltr" for English. Never repeat it on elements, except Latin content inside an Arabic page.' }],
  [{ ar: 'خصائص منطقية فقط', en: 'Logical properties only' }, { ar: 'margin-inline-start وpadding-inline وinset-inline-start وtext-align: start. لا left أو right في CSS.', en: 'margin-inline-start, padding-inline, inset-inline-start, text-align: start. No left or right in the CSS.' }],
  [{ ar: 'الأيقونات التي تنعكس', en: 'Icons that mirror' }, { ar: 'الأسهم، وأسهم الرجوع، ومؤشرات الخطوات. لا تنعكس: الساعة، وعلامة الصح، والطائرة، والشاحنة، والشعارات.', en: 'Arrows, back arrows, step indicators. Not mirrored: the clock, the check mark, the plane, the truck, logos.' }],
  [{ ar: 'الأرقام', en: 'Numerals' }, { ar: 'أرقام عربية مشرقية في النص العربي عبر Intl بلغة ar-SA. أرقام لاتينية دائمًا في أرقام الشحنات والحاويات والبريد والجوال، داخل bdi أو dir="ltr".', en: 'Arabic-Indic digits in Arabic text through Intl with ar-SA. Latin digits always for shipment and container numbers, email and mobile, inside bdi or dir="ltr".' }],
  [{ ar: 'التاريخ', en: 'Dates' }, { ar: 'ميلادي أولًا، وهجري (أم القرى) بجانبه في التتبع والأدلة.', en: 'Gregorian first, with Hijri (Umm al-Qura) beside it in tracking and guides.' }],
  [{ ar: 'لا تباعد بين الحروف العربية', en: 'No letter-spacing on Arabic' }, { ar: 'التباعد يقطع اتصال الحروف. التباعد السالب للعناوين اللاتينية فقط.', en: 'Tracking breaks the joins between letters. Negative tracking applies to Latin headings only.' }],
  [{ ar: 'ارتفاع السطر', en: 'Line height' }, { ar: 'العربية تحتاج سطرًا أطول: ١٫٨ للنص و١٫٢٥ للعناوين.', en: 'Arabic needs taller lines: 1.8 for text and 1.25 for headings.' }],
  [{ ar: 'خط واحد للغتين', en: 'One family for both scripts' }, { ar: 'Readex Pro متغير الوزن، صُمم للعربية واللاتينية معًا فتتطابق الأوزان والارتفاعات.', en: 'Readex Pro, variable weight, drawn for Arabic and Latin together so weights and heights match.' }],
]
const STATES = [
  ['/track?id=DRB-240117', { ar: 'تتبع: شحنة على الطريق', en: 'Tracking: on the road' }],
  ['/track?id=DRB-240233', { ar: 'تتبع: متوقفة تنتظر مستندًا', en: 'Tracking: held for a document' }],
  ['/track?id=DRB-239981', { ar: 'تتبع: تم التسليم', en: 'Tracking: delivered' }],
  ['/track?id=DRB-000000', { ar: 'تتبع: رقم غير موجود', en: 'Tracking: number not found' }],
  ['/quote?port=dammam&city=riyadh', { ar: 'عرض سعر: مسار معبأ مسبقًا', en: 'Quote: route prefilled' }],
  ['/contact?topic=careers&role=broker', { ar: 'تواصل: تقديم على وظيفة', en: 'Contact: job application' }],
  ['/no-such-page', { ar: 'صفحة غير موجودة', en: 'Page not found' }],
]

export default function Handoff() {
  const { t } = useLang()
  return (
    <div className="page handoff">
      <header className="page-head wrap">
        <h1 className="h-big">{t({ ar: 'دليل المطورين', en: 'Developer handoff' })}</h1>
        <p className="lead">{t({ ar: 'القيم والقواعد التي بُني عليها هذا النموذج، ليُنفَّذ الموقع منها كما هو بالعربية والإنجليزية.', en: 'The values and rules this prototype is built on, so the site can be built from them as it is, in Arabic and English.' })}</p>
      </header>

      <section className="wrap ho-sec" aria-labelledby="ho-c">
        <h2 id="ho-c" className="h-mid">{t({ ar: 'الألوان', en: 'Colour' })}</h2>
        <ul className="swatches">{COLOURS.map(([k, v, d]) => <li key={k}><span style={{ background: v }} /><code>{k}</code><code>{v}</code><small>{t(d)}</small></li>)}</ul>
      </section>

      <section className="wrap ho-sec" aria-labelledby="ho-t">
        <h2 id="ho-t" className="h-mid">{t({ ar: 'الخط والمقاسات', en: 'Type and sizes' })}</h2>
        <div className="specimen"><p lang="ar" dir="rtl">شحن بحري وبري وجوي ١٢٣٤٥٦٧٨٩٠</p><p lang="en" dir="ltr">Sea, land and air freight 1234567890</p></div>
        <div className="tscroll"><table>
          <thead><tr><th>{t({ ar: 'الدور', en: 'Role' })}</th><th>{t({ ar: 'المقاس', en: 'Size' })}</th><th>{t({ ar: 'الوزن', en: 'Weight' })}</th><th>{t({ ar: 'ارتفاع السطر', en: 'Line height' })}</th><th>{t({ ar: 'الاستخدام', en: 'Use' })}</th></tr></thead>
          <tbody>{TYPE.map(([r, s, w, l, u]) => <tr key={r}><td><code>{r}</code></td><td dir="ltr"><code>{s}</code></td><td>{w}</td><td dir="ltr">{l}</td><td>{t(u)}</td></tr>)}</tbody>
        </table></div>
        <p className="fine">{t({ ar: 'الزوايا مربعة في كل مكان. الهوامش الخارجية clamp(20px, 3vw, 44px). المسافة بين الأقسام clamp(96px, 14vw, 200px).', en: 'Square corners everywhere. Outer margins clamp(20px, 3vw, 44px). Section gap clamp(96px, 14vw, 200px).' })}</p>
      </section>

      <section className="wrap ho-sec" aria-labelledby="ho-r">
        <h2 id="ho-r" className="h-mid">{t({ ar: 'قواعد الكتابة من اليمين', en: 'Right-to-left rules' })}</h2>
        <dl className="ho-rules">{RULES.map(([h, d]) => <div key={h.en}><dt>{t(h)}</dt><dd>{t(d)}</dd></div>)}</dl>
      </section>

      <section className="wrap ho-sec" aria-labelledby="ho-s">
        <h2 id="ho-s" className="h-mid">{t({ ar: 'المكونات والحالات', en: 'Components and states' })}</h2>
        <div className="ho-comps">
          <div><Link to="/quote" className="btn is-accent">{t({ ar: 'زر أساسي', en: 'Primary button' })} <I.Fwd /></Link><button className="btn">{t({ ar: 'زر ثانوي', en: 'Secondary button' })}</button><button className="btn" disabled>{t({ ar: 'معطّل', en: 'Disabled' })}</button></div>
          <div className="notice is-warn"><I.Warn aria-hidden="true" /><div><h3>{t({ ar: 'تنبيه', en: 'Notice' })}</h3><p>{t({ ar: 'للحالات التي تنتظر شيئًا من العميل.', en: 'For anything waiting on the customer.' })}</p></div></div>
        </div>
        <h3 className="h-small">{t({ ar: 'روابط مباشرة لكل حالة', en: 'Direct links to each state' })}</h3>
        <ul className="ho-links">{STATES.map(([to, l]) => <li key={to}><Link to={to}>{t(l)}</Link> <code dir="ltr">#{to}</code></li>)}</ul>
        <p className="fine">{t({ ar: 'أضف ?lang=en أو ?lang=ar إلى أي رابط لفتحه بلغة محددة. نقاط الانكسار: ٣٩٠ و٧٦٨ و١٠٢٤ و١٤٤٠.', en: 'Add ?lang=en or ?lang=ar to any link to open it in that language. Breakpoints: 390, 768, 1024, 1440.' })}</p>
      </section>

      <section className="wrap ho-sec" aria-labelledby="ho-p">
        <h2 id="ho-p" className="h-mid">{t({ ar: 'ما يُستبدل قبل النشر', en: 'Replace before launch' })}</h2>
        <ul className="ticks">
          <li><I.Doc aria-hidden="true" />{t({ ar: 'اسم درب والشعار، إلى أن تصل هوية الشركة.', en: 'The Darb name and mark, until the company identity arrives.' })}</li>
          <li><I.Doc aria-hidden="true" />{t({ ar: 'الصور: صور Open Images مكان صور الشركة وفيديوهاتها.', en: 'Photos: Open Images pictures stand in for the company’s photos and video.' })}</li>
          <li><I.Doc aria-hidden="true" />{t({ ar: 'العناوين والبريد sales@darb.sa وأرقام التراخيص.', en: 'Addresses, the sales@darb.sa address and licence numbers.' })}</li>
          <li><I.Doc aria-hidden="true" />{t({ ar: 'جدول الإغلاق والمدد: نموذجية حتى يربطها فريق العمليات.', en: 'Cut-off schedule and transit times: samples until operations connect them.' })}</li>
          <li><I.Doc aria-hidden="true" />{t({ ar: 'التتبع ونماذج الطلب: بيانات وهمية، بلا خادم.', en: 'Tracking and forms: mock data, no server.' })}</li>
        </ul>
      </section>
    </div>
  )
}
