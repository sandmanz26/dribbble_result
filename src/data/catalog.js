// The shop's real stock on 3 Nov 2026 (kartenregal.ch), copied for the redesign prototype.
// Prices, stock counts, release data and the shop's own copy photos are theirs.
// `copies` lists the physical copies a customer can choose between when the shop photographed more than one.

export const FAECHER = [
  { id: 'neu', no: '01', name: 'Neu', short: 'Neu', line: 'Was diese Woche ins Regal kam' },
  { id: 'booster', no: '02', name: 'Booster', short: 'Booster', line: 'Einzelne Packs, im Brief ab CHF 2' },
  { id: 'bundles-boxen', no: '03', name: 'Bundles & Boxen', short: 'Boxen', line: 'Top-Trainer-Boxen, Bundles und Tins' },
  { id: 'einzelkarten', no: '04', name: 'Einzelkarten', short: 'Karten', line: 'In Sleeve und Toploader verschickt' },
]

const P = (f) => `products/${f}`

export const PRODUCTS = [
  {
    id: 'ascended-heroes-etb-de', fach: 'bundles-boxen', kind: 'box',
    name: 'Ascended Heroes ETB', de: 'Erhabene Helden Top-Trainer-Box', lang: 'DE', price: 169.0, stock: 1, added: '2026-10-28',
    facts: [['Produktart', 'Top-Trainer-Box'], ['Set', 'Erhabene Helden'], ['Serie', 'Mega-Entwicklung'], ['Erschienen', '30.01.2026'], ['Sprache', 'Deutsch'], ['Zustand', 'Neu, Folie intakt']],
    note: 'Neu und originalverpackt, Folie unbeschädigt.',
    hero: P('ascended-heroes-etb-de-0.webp'),
    photos: [
      { src: P('ascended-heroes-etb-de-0.webp'), label: 'Herstellerbild', maker: true },
      { src: P('ascended-heroes-etb-de-1.webp'), label: 'Vorderseite' },
      { src: P('ascended-heroes-etb-de-2.webp'), label: 'Rückseite' },
      { src: P('ascended-heroes-etb-de-3.webp'), label: 'Seite mit Siegel' },
      { src: P('ascended-heroes-etb-de-4.webp'), label: 'Seite, Logo' },
    ],
  },
  {
    id: '30-jahre-ttb', fach: 'bundles-boxen', kind: 'box',
    name: '30 Jahre Top-Trainer-Box', lang: 'DE', price: 159.0, stock: 2, added: '2026-10-28',
    facts: [['Produktart', 'Top-Trainer-Box'], ['Set', '30 Jahre Pokémon'], ['Sprache', 'Deutsch'], ['Zustand', 'Neu, Folie intakt']],
    note: 'Neu und originalverpackt, Folie unbeschädigt.',
    hero: P('30-jahre-ttb-0.webp'),
    photos: [
      { src: P('30-jahre-ttb-0.webp'), label: 'Vorderseite' },
      { src: P('30-jahre-ttb-1.webp'), label: 'Rückseite' },
      { src: P('30-jahre-ttb-2.webp'), label: 'Seite mit Siegel' },
    ],
  },
  {
    id: '30-jahre-boosterbundle-de', fach: 'bundles-boxen', kind: 'box',
    name: '30 Jahre Boosterbundle', lang: 'DE', price: 84.9, stock: 1, added: '2026-10-28', lowres: true,
    facts: [['Produktart', 'Boosterbundle, 6 Booster'], ['Set', '30 Jahre Pokémon'], ['Sprache', 'Deutsch'], ['Zustand', 'Neu, Folie intakt']],
    note: 'Neu und originalverpackt, Folie unbeschädigt.',
    hero: P('30-jahre-boosterbundle-de-0.webp'),
    photos: [{ src: P('30-jahre-boosterbundle-de-0.webp'), label: 'Vorderseite' }],
  },
  {
    id: 'pitch-black-etb-en', fach: 'bundles-boxen', kind: 'box',
    name: 'Pitch Black ETB', lang: 'EN', price: 81.9, stock: 2, added: '2026-11-01', isNew: true,
    facts: [['Produktart', 'Elite Trainer Box'], ['Set', 'Pitch Black'], ['Serie', 'Mega Evolution'], ['Sprache', 'Englisch'], ['Zustand', 'Neu, Seite leicht beschädigt']],
    note: 'Neu und originalverpackt. Beide Boxen sind an der Seite leicht beschädigt, das siehst du auf den Fotos.',
    flaw: 'Seite leicht eingedrückt',
    hero: P('pitch-black-etb-en-0.webp'),
    photos: [{ src: P('pitch-black-etb-en-0.webp'), label: 'Herstellerbild', maker: true }],
    copies: [
      { id: 'A', label: 'Exemplar A', flaw: 'Kante links oben leicht eingedrückt', photos: [
        { src: P('pitch-black-etb-en-1.webp'), label: 'Vorderseite' },
        { src: P('pitch-black-etb-en-2.webp'), label: 'Rückseite' },
        { src: P('pitch-black-etb-en-3.webp'), label: 'Seite, Folie' },
        { src: P('pitch-black-etb-en-4.webp'), label: 'Seite, Logo' },
        { src: P('pitch-black-etb-en-9.webp'), label: 'Unterseite' },
      ] },
      { id: 'B', label: 'Exemplar B', flaw: 'Folie an der Seite geknittert', photos: [
        { src: P('pitch-black-etb-en-5.webp'), label: 'Vorderseite' },
        { src: P('pitch-black-etb-en-6.webp'), label: 'Rückseite' },
        { src: P('pitch-black-etb-en-7.webp'), label: 'Seite, Folie' },
        { src: P('pitch-black-etb-en-8.webp'), label: 'Seite, Logo' },
        { src: P('pitch-black-etb-en-10.webp'), label: 'Unterseite' },
      ] },
    ],
  },
  {
    id: '151-mini-tin-en', fach: 'bundles-boxen', kind: 'box',
    name: '151 Mini-Tin', lang: 'EN', price: 49.9, stock: 0, added: '2026-10-29',
    facts: [['Produktart', 'Mini-Tin'], ['Set', 'Scarlet & Violet 151'], ['Sprache', 'Englisch'], ['Motiv', 'Zufällig']],
    note: 'Motiv zufällig: wir haben verschiedene Motive an Lager, du erhältst eines davon.',
    hero: P('151-mini-tin-en-0.webp'),
    photos: [
      { src: P('151-mini-tin-en-0.webp'), label: 'Herstellerbild', maker: true },
      { src: P('151-mini-tin-en-1.webp'), label: 'Beispiel' },
      { src: P('151-mini-tin-en-2.webp'), label: 'Rückseite, Beispiel' },
    ],
  },
  {
    id: '30-jahre-tech-sticker-kollektion-de', fach: 'bundles-boxen', kind: 'box',
    name: '30 Jahre Tech-Sticker-Kollektion', lang: 'DE', price: 35.9, stock: 2, added: '2026-10-28',
    facts: [['Produktart', 'Sticker-Kollektion'], ['Set', '30 Jahre Pokémon'], ['Sprache', 'Deutsch'], ['Zustand', 'Neu, Blister intakt']],
    note: 'Neu und originalverpackt, Blister unbeschädigt.',
    hero: P('30-jahre-tech-sticker-kollektion-de-0.webp'),
    photos: [
      { src: P('30-jahre-tech-sticker-kollektion-de-0.webp'), label: 'Vorderseite' },
      { src: P('30-jahre-tech-sticker-kollektion-de-1.webp'), label: 'Rückseite' },
    ],
  },
  {
    id: 'mega-moonlit-tin-mega-clefable-ex-en', fach: 'bundles-boxen', kind: 'box',
    name: 'Mega Moonlit Tin, Mega Clefable ex', lang: 'EN', price: 22.9, stock: 2, added: '2026-10-28',
    facts: [['Produktart', 'Tin'], ['Inhalt', 'Mega Clefable ex'], ['Sprache', 'Englisch'], ['Zustand', 'Neu, Folie intakt']],
    note: 'Neu und originalverpackt, Folie unbeschädigt.',
    hero: P('mega-moonlit-tin-mega-clefable-ex-en-0.webp'),
    photos: [
      { src: P('mega-moonlit-tin-mega-clefable-ex-en-0.webp'), label: 'Herstellerbild', maker: true },
      { src: P('mega-moonlit-tin-mega-clefable-ex-en-1.webp'), label: 'Vorderseite' },
      { src: P('mega-moonlit-tin-mega-clefable-ex-en-2.webp'), label: 'Rückseite' },
    ],
  },
  {
    id: '30-jahre-mini-tin-zapdos-de', fach: 'bundles-boxen', kind: 'box',
    name: '30 Jahre Mini-Tin Zapdos', lang: 'DE', price: 18.9, stock: 1, added: '2026-10-28',
    facts: [['Produktart', 'Mini-Tin'], ['Motiv', 'Zapdos'], ['Sprache', 'Deutsch'], ['Zustand', 'Neu, Folie intakt']],
    note: 'Neu und originalverpackt, Folie unbeschädigt.',
    hero: P('30-jahre-mini-tin-zapdos-de-0.webp'),
    photos: [
      { src: P('30-jahre-mini-tin-zapdos-de-0.webp'), label: 'Vorderseite' },
      { src: P('30-jahre-mini-tin-zapdos-de-1.webp'), label: 'Rückseite' },
    ],
  },
  {
    id: '30-jahre-booster-en', fach: 'booster', kind: 'booster',
    name: '30 Jahre Booster', lang: 'EN', price: 14.9, stock: 5, added: '2026-10-31',
    facts: [['Produktart', 'Booster, 10 Karten'], ['Set', '30th Celebration'], ['Sprache', 'Englisch'], ['Zustand', 'Neu, versiegelt']],
    note: 'Das Bild ist ein Herstellerbild. Motiv zufällig.',
    hero: P('30-jahre-booster-en-0.webp'),
    photos: [{ src: P('30-jahre-booster-en-0.webp'), label: 'Herstellerbild', maker: true }],
  },
  {
    id: 'booster-perfect-order-en', fach: 'booster', kind: 'booster',
    name: 'Perfect Order Booster', lang: 'EN', price: 11.9, stock: 18, added: '2026-10-28',
    facts: [['Produktart', 'Booster'], ['Set', 'Perfect Order'], ['Serie', 'Mega Evolution'], ['Sprache', 'Englisch'], ['Zustand', 'Neu, versiegelt']],
    note: 'Das erste Bild ist ein Herstellerbild, das zweite zeigt ein Pack aus dem Fach.',
    hero: P('booster-perfect-order-en-0.webp'),
    photos: [
      { src: P('booster-perfect-order-en-0.webp'), label: 'Herstellerbild', maker: true },
      { src: P('booster-perfect-order-en-1.webp'), label: 'Pack aus dem Fach' },
    ],
  },
  {
    id: 'pitch-black-booster-en', fach: 'booster', kind: 'booster',
    name: 'Pitch Black Booster', lang: 'EN', price: 10.9, stock: 18, added: '2026-11-01', isNew: true,
    facts: [['Produktart', 'Booster'], ['Set', 'Pitch Black'], ['Serie', 'Mega Evolution'], ['Sprache', 'Englisch'], ['Zustand', 'Neu, versiegelt']],
    note: 'Das Bild ist ein Herstellerbild.',
    hero: P('pitch-black-booster-en-0.webp'),
    photos: [{ src: P('pitch-black-booster-en-0.webp'), label: 'Herstellerbild', maker: true }],
  },
  {
    id: 'dunkelnacht-booster-de', fach: 'booster', kind: 'booster',
    name: 'Dunkelnacht Booster', lang: 'DE', price: 6.4, stock: 2, added: '2026-11-03', isNew: true,
    facts: [['Produktart', 'Booster'], ['Set', 'Dunkelnacht'], ['Sprache', 'Deutsch'], ['Motiv', 'Zufällig'], ['Zustand', 'Neu, versiegelt']],
    note: 'Motiv zufällig: wir haben verschiedene Motive an Lager, du erhältst eines davon.',
    hero: P('dunkelnacht-booster-de-0.webp'),
    photos: [
      { src: P('dunkelnacht-booster-de-0.webp'), label: 'Vorderseite, Beispiel' },
      { src: P('dunkelnacht-booster-de-1.webp'), label: 'Rückseite, Beispiel' },
    ],
  },
  {
    id: 'makuhita-mep-068-nm-en', fach: 'einzelkarten', kind: 'single',
    name: 'Makuhita', code: 'MEP 068', grade: 'NM', lang: 'EN', price: 2.9, stock: 1, added: '2026-11-01', isNew: true, holo: true,
    facts: [['Set', 'MEP Black Star Promos'], ['Kartennummer', '068'], ['Seltenheit', 'Promo'], ['Ausführung', 'Holo'], ['Zustand', 'Near Mint (NM)'], ['Typ', 'Fighting'], ['KP', '80'], ['Illustration', 'Takeshi Nakamura'], ['Sprache', 'Englisch']],
    note: 'Einzelkarte, Zustand Near Mint. Die Fotos zeigen genau das Exemplar, das du erhältst.',
    hero: P('makuhita-mep-068-nm-en-0.webp'),
    photos: [
      { src: P('makuhita-mep-068-nm-en-0.webp'), label: 'Vorderseite' },
      { src: P('makuhita-mep-068-nm-en-1.webp'), label: 'Rückseite' },
    ],
  },
  {
    id: 'mopex-paf-070-reverse-nm-de', fach: 'einzelkarten', kind: 'single',
    name: 'Mopex', code: 'PAF 070', grade: 'NM', finish: 'Reverse', lang: 'DE', price: 1.9, stock: 1, added: '2026-11-01', isNew: true, holo: true,
    facts: [['Set', 'Paldeas Schicksale'], ['Kartennummer', '070'], ['Ausführung', 'Reverse Holo'], ['Zustand', 'Near Mint (NM)'], ['Sprache', 'Deutsch']],
    note: 'Einzelkarte, Zustand Near Mint. Die Fotos zeigen genau das Exemplar, das du erhältst.',
    hero: P('mopex-paf-070-reverse-nm-de-0.webp'),
    photos: [
      { src: P('mopex-paf-070-reverse-nm-de-0.webp'), label: 'Vorderseite' },
      { src: P('mopex-paf-070-reverse-nm-de-1.webp'), label: 'Rückseite' },
    ],
  },
]

export const byId = (id) => PRODUCTS.find((p) => p.id === id)
export const inFach = (fach) =>
  fach === 'neu'
    ? PRODUCTS.filter((p) => p.isNew)
    : PRODUCTS.filter((p) => p.fach === fach)
export const fachOf = (id) => FAECHER.find((f) => f.id === id)

export const chf = (n) => `CHF ${n.toFixed(2)}`
export const stockText = (n) => (n === 0 ? 'Ausverkauft' : n === 1 ? 'Letztes Stück' : `${n} im Fach`)
export const langText = (l) => (l === 'DE' ? 'Deutsch' : 'Englisch')
export const title = (p) => p.kind === 'single' ? `${p.name} · ${p.code}${p.finish ? ' · ' + p.finish : ''} · ${p.grade}` : p.name
