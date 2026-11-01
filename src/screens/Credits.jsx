import { useNavigate } from 'react-router-dom'
import { BiArrowBack } from 'react-icons/bi'
import credits from '../data/credits.json'
import { IconButton } from '../ui/kit.jsx'

export default function Credits() {
  const nav = useNavigate()
  return (
    <div className="page">
      <header className="mast mast--back">
        <IconButton icon={BiArrowBack} label="Back" onClick={() => nav(-1)} />
      </header>
      <h1 className="display">Photo credits</h1>
      <p className="row__s">Photos from Unsplash under the Unsplash License, graded to one look for this prototype. People shown are not the people named in the app; every name, production and rate is a sample.</p>
      <ul className="creditlist">
        {credits.map((c) => (
          <li key={c.file}>
            <img src={`photos/${c.file}${c.file.startsWith('p-') ? '' : '-sm'}.webp`} alt="" loading="lazy" />
            <a href={c.url} target="_blank" rel="noreferrer">{c.author}</a>
          </li>
        ))}
      </ul>
    </div>
  )
}
