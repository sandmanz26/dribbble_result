import { useEffect } from 'react'
import { Link } from 'react-router-dom'

export function Pickup() {
  return (
    <div className="wrap doc">
      <nav className="crumbs" aria-label="Pfad"><Link to="/">Regal</Link><span aria-hidden="true">/</span><span aria-current="page">Abholung</span></nav>
      <h1 className="lead-h">Gratis abholen in Wetzikon ZH</h1>
      <p className="lead-p">Wähle im Korb «Abholung» und eine Wunschzeit. Du zahlst beim Bestellen, vor Ort brauchst du nur die Bestellnummer.</p>
      <h2>So läuft es</h2>
      <ol className="steps-list">
        <li><span><b>Bestellen und bezahlen</b>Im Shop wie gewohnt, mit TWINT oder Karte. Wähle als Lieferung «Abholung» und, wenn du willst, eine Wunschzeit.</span></li>
        <li><span><b>Wir legen bereit</b>Das dauert normalerweise zwei bis vier Tage.</span></li>
        <li><span><b>E-Mail mit Adresse und Termin</b>Wir bestätigen deine Wunschzeit oder schlagen eine andere vor.</span></li>
        <li><span><b>Abholen und Folie prüfen</b>Prüf die Folie versiegelter Ware gleich vor Ort. Geöffnete versiegelte Ware nehmen wir nicht zurück.</span></li>
      </ol>
      <h2>Gut zu wissen</h2>
      <p style={{ marginTop: 16 }}>Die Abholung kostet nichts. Fragen dazu beantworten wir per E-Mail. Die Wunschzeiten in diesem Prototyp sind Beispiele und werden mit dem Shop abgestimmt.</p>
      <Link className="btn buy" to="/" style={{ marginTop: 32 }}>Zum Regal</Link>
    </div>
  )
}

export function Shipping() {
  const rows = [
    ['1 bis 2 Booster', 'B-Post Brief im gepolsterten Couvert', 'CHF 2.00'],
    ['3 bis 6 Booster', 'B-Post Brief im gepolsterten Couvert', 'CHF 4.00'],
    ['Bundles, Boxen, ab 7 Boostern', 'B-Post Paket', 'CHF 9.00'],
    ['Einzelkarten unter CHF 50', 'B-Post Brief, Sleeve und Toploader', 'CHF 2.00'],
    ['Einzelkarten ab CHF 50', 'Einschreiben mit Sendungsnummer', 'im Checkout'],
    ['Abholung in Wetzikon', 'Termin nach der Bestellung', 'gratis'],
  ]
  return (
    <div className="wrap doc">
      <nav className="crumbs" aria-label="Pfad"><Link to="/">Regal</Link><span aria-hidden="true">/</span><span aria-current="page">Versand und Rückgabe</span></nav>
      <h1 className="lead-h">Versand und Rückgabe</h1>
      <p className="lead-p">Wir liefern nur an Adressen in der Schweiz und versenden innert drei Werktagen nach Zahlungseingang. Alles kommt in einer Sendung.</p>
      <h2>Was es kostet</h2>
      <table className="tbl"><thead><tr><th>Bestellung</th><th>Versandart</th><th>Preis</th></tr></thead><tbody>{rows.map((r) => <tr key={r[0]}><td>{r[0]}</td><td>{r[1]}</td><td className="num">{r[2]}</td></tr>)}</tbody></table>
      <h2>Wenn etwas nicht stimmt</h2>
      <p style={{ marginTop: 16 }}>Melde dich innert 14 Tagen nach Erhalt. Die Rücksendung geht auf unsere Kosten und du erhältst den vollen Betrag zurück. Geöffnete versiegelte Ware nehmen wir nicht zurück.</p>
    </div>
  )
}

export function NotFound() {
  useEffect(() => { document.title = 'Leeres Fach | Kartenregal TCG' }, [])
  return (
    <div className="wrap doc">
      <h1 className="lead-h">Dieses Fach ist leer.</h1>
      <p className="lead-p">Die Seite gibt es nicht, oder das Produkt ist nicht mehr im Regal.</p>
      <Link className="btn buy" to="/" style={{ marginTop: 24 }}>Zum ganzen Regal</Link>
    </div>
  )
}
