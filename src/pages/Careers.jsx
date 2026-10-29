import { Link } from 'react-router-dom'
import { useLang } from '../i18n.jsx'
import { JOBS } from '../data/site.js'
import * as I from '../ui/icons.jsx'

export default function Careers() {
  const { t } = useLang()
  return (
    <div className="page">
      <header className="page-head wrap is-photo" data-reveal>
        <div>
          <h1 className="h-big">{t({ ar: 'الوظائف', en: 'Careers' })}</h1>
          <p className="lead">{t({ ar: 'نوظف من يحب أن يعرف أين البضاعة الآن، ولماذا لم تتحرك بعد. أغلب فريقنا سعوديون بدأوا معنا في الميناء.', en: 'We hire people who like knowing where the goods are now, and why they have not moved yet. Most of our team are Saudis who started with us at the port.' })}</p>
        </div>
        <img src="photos/terminal-night.webp" alt={t({ ar: 'محطة حاويات ليلًا', en: 'A container terminal at night' })} width="1024" height="768" />
      </header>
      <section className="jobs wrap" aria-labelledby="jobs-h">
        <h2 id="jobs-h" className="h-small">{t({ ar: 'الوظائف المتاحة', en: 'Open roles' })}</h2>
        <ul>
          {JOBS.map((j) => (
            <li key={j.id} data-reveal>
              <details>
                <summary><span className="job-t">{t(j.title)}</span><span className="job-m">{t(j.city)} · {t(j.type)}</span><I.Down aria-hidden="true" /></summary>
                <p>{t(j.body)}</p>
                <Link to={`/contact?topic=careers&role=${j.id}`} className="btn is-accent">{t({ ar: 'قدّم على الوظيفة', en: 'Apply for this role' })} <I.Fwd /></Link>
              </details>
            </li>
          ))}
        </ul>
        <p className="fine">{t({ ar: 'وظائف نموذجية للعرض.', en: 'Sample roles for the prototype.' })}</p>
      </section>
    </div>
  )
}
