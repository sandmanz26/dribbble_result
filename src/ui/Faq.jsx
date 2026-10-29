import { useLang } from '../i18n.jsx'
import * as I from './icons.jsx'

export default function Faq({ items }) {
  const { t } = useLang()
  return (
    <div className="qa">
      {items.map((x) => (
        <details key={x.q.en}>
          <summary><span>{t(x.q)}</span><I.Down aria-hidden="true" /></summary>
          <p>{t(x.a)}</p>
        </details>
      ))}
    </div>
  )
}
