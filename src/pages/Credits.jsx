import { Link } from 'react-router-dom'
import PHOTOS from '../data/photos.json'

export default function Credits() {
  return (
    <main className="mx-auto max-w-[860px] px-5 py-12">
      <Link to="/" className="text-[13px] text-muted underline underline-offset-4">Back to the overview</Link>
      <h1 className="mt-4 text-[26px] font-semibold">Photo credits</h1>
      <p className="mt-2 text-[14px] text-muted">Real photographs from the Open Images set on Flickr, licensed CC BY 2.0. They show old instruments and machines, not Myelin.</p>
      <ul className="mt-6 grid gap-2">
        {PHOTOS.map((p) => (
          <li key={p.file} className="flex items-center gap-4 rounded-card bg-surface p-3">
            <img src={`photos/${p.file}.webp`} alt="" width="96" height="72" className="h-[72px] w-24 rounded-[4px] object-cover" loading="lazy" />
            <span className="min-w-0"><b className="block truncate">{p.title}</b><span className="text-[13px] text-muted">{p.author} · <a className="underline" href={p.src} target="_blank" rel="noreferrer">Flickr</a> · {p.lic}</span></span>
          </li>
        ))}
      </ul>
    </main>
  )
}
