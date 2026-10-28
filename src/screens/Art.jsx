import Food, { ART } from '../ui/Food.jsx'

// Every drawn dish on one sheet, for checking the drawings and for the photo shoot list.
export default function Art() {
  return (
    <div className="art-sheet">
      {Object.keys(ART).map((k) => <figure key={k}><span className="tile tile-md" style={{ '--field': '#F2A93B' }}><Food art={k} /></span><figcaption>{k}</figcaption></figure>)}
    </div>
  )
}
