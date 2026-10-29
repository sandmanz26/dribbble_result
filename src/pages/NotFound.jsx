import { Link } from 'react-router-dom'
import { useLang } from '../i18n.jsx'
import * as I from '../ui/icons.jsx'

export default function NotFound() {
  const { t } = useLang()
  return (
    <div className="page">
      <section className="page-head wrap nf">
        <h1 className="h-big">{t({ ar: 'هذا الطريق لا يؤدي إلى شيء', en: 'This road leads nowhere' })}</h1>
        <p className="lead">{t({ ar: 'الصفحة غير موجودة. ربما تبحث عن إحدى هذه:', en: 'The page does not exist. You may be looking for one of these:' })}</p>
        <p className="row-btns"><Link className="btn" to="/track">{t({ ar: 'تتبع شحنة', en: 'Track a shipment' })}</Link><Link className="btn is-accent" to="/">{t({ ar: 'الرئيسية', en: 'Home' })} <I.Fwd /></Link></p>
      </section>
    </div>
  )
}
