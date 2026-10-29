import { useLang } from '../i18n.jsx'
import PHOTOS from '../data/photos.json'

export default function Credits() {
  const { t } = useLang()
  return (
    <div className="page">
      <header className="page-head wrap">
        <h1 className="h-big">{t({ ar: 'مصادر الصور', en: 'Photo credits' })}</h1>
        <p className="lead">{t({ ar: 'صور حقيقية من مجموعة Open Images على Flickr، برخصة CC BY 2.0، تحل محل صور الشركة إلى أن تصل.', en: 'Real photographs from the Open Images set on Flickr, licensed CC BY 2.0, standing in for the company’s own until they arrive.' })}</p>
      </header>
      <ul className="credits wrap">
        {PHOTOS.map((p) => (
          <li key={p.file}>
            <img src={`photos/${p.file}.webp`} alt="" width="120" height="90" loading="lazy" />
            <span dir="auto"><b>{p.title}</b><span>{p.author} · <a href={p.src} target="_blank" rel="noreferrer">Flickr</a> · {p.lic}</span></span>
          </li>
        ))}
      </ul>
    </div>
  )
}
