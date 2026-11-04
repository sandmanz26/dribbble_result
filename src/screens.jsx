import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  MdSearch, MdMic, MdLocationOn, MdChevronLeft, MdChevronRight, MdSort, MdShare, MdCheck, MdAdd, MdAutoAwesome,
  MdSend, MdLocalShipping, MdBolt, MdSchedule, MdStorefront, MdOutlineSavings, MdSwapHoriz, MdDeleteOutline, MdPlaylistAdd, MdHistory, MdClose, MdCheckCircle,
} from 'react-icons/md'
import { useStore } from './store.jsx'
import { PRODUCTS, CATS, byId, priceOf, AISLES } from './data/products.js'
import { BRANCHES } from './data/brands.js'
import { search, norm } from './search.js'
import { t, kd, num } from './i18n.js'
import { Mark, Price, Stepper, ProductCard, BackBtn, useGo } from './ui.jsx'

const Chev = ({ lang }) => (lang === 'ar' ? <MdChevronLeft aria-hidden="true" /> : <MdChevronRight aria-hidden="true" />)

// A screen scrolls inside the phone; the large title collapses into the bar as you scroll.
export function Screen({ title, sub, back, actions, children, className = '', sticky }) {
  const ref = useRef(null)
  const onScroll = (e) => e.currentTarget.style.setProperty('--y', Math.min(1, e.currentTarget.scrollTop / 64).toFixed(3))
  return (
    <div className={`scr ${className}`} ref={ref} onScroll={onScroll}>
      <header className="bar">
        <div className="bar-row">
          {back ? <BackBtn /> : <span className="bar-spacer" />}
          <span className="bar-title" aria-hidden="true">{title}</span>
          <span className="bar-act">{actions}</span>
        </div>
        {sticky}
      </header>
      {title && <div className="big-title"><h1>{title}</h1>{sub && <p>{sub}</p>}</div>}
      <div className="scr-body">{children}</div>
    </div>
  )
}

export function Home() {
  const { lang, latin, brand, persona, lists, rate, orders } = useStore()
  const nav = useNavigate()
  const listItems = lists[0].items.filter((i) => i.id && !i.done).map((i) => byId(i.id))
  const deals = PRODUCTS.filter((p) => p.deal)
  const local = PRODUCTS.filter((p) => p.local)
  const spent = 412.350 + orders.reduce((s, o) => s + o.total, 0)
  const div = spent * 0.10
  return (
    <div className="scr home" onScroll={(e) => e.currentTarget.style.setProperty('--y', Math.min(1, e.currentTarget.scrollTop / 120).toFixed(3))}>
      <section className="hello">
        <div className="hello-top">
          <Mark brand={brand} size={30} />
          <div><span className="muted sm">{t('hello', lang)}</span><b className="brandname">{brand.name[lang]}</b></div>
          <Link to="/member" className="avatar" aria-label={t('member', lang)}>{lang === 'ar' ? 'ف' : 'F'}</Link>
        </div>
        <button className="addr" onClick={() => nav('/cart')}><MdLocationOn aria-hidden="true" />{t('deliverTo', lang)}: <b>{lang === 'ar' ? 'قطعة ٣، شارع ١٤، منزل ٧' : 'Block 3, Street 14, House 7'}</b></button>
      </section>
      <div className="search-sticky">
        <button className="searchbox" onClick={() => nav('/search')}><MdSearch aria-hidden="true" /><span>{t('searchPh', lang)}</span><MdMic aria-hidden="true" /></button>
      </div>
      {persona === 'shareholder' ? (
        <Link to="/member" className="share-card">
          <span className="sc-l"><MdOutlineSavings aria-hidden="true" /><span>{t('yourShare', lang)}</span></span>
          <b className="sc-v">{kd(div, lang, latin)}</b>
          <span className="sc-bar"><i style={{ width: `${Math.min(100, (spent / 600) * 100)}%` }} /></span>
          <span className="muted sm">{lang === 'ar' ? `من مشتريات ${kd(spent, lang, latin)} بنسبة ${num(10, lang, latin)}٪. ${t('estimated', lang)}` : `On ${kd(spent, lang, latin)} of shopping at 10%. ${t('estimated', lang)}`}</span>
        </Link>
      ) : (
        <Link to="/member" className="share-card points">
          <span className="sc-l"><MdOutlineSavings aria-hidden="true" /><span>{lang === 'ar' ? 'نقاطك' : 'Your points'}</span></span>
          <b className="sc-v">{num(1240, lang, latin)}</b>
          <span className="muted sm">{lang === 'ar' ? 'المساهمون يحصلون على أرباح مشتريات سنوية. اعرف كيف تساهم' : 'Shareholders earn a yearly purchase dividend. See how to join'}</span>
        </Link>
      )}

      <section className="row">
        <div className="row-h"><h2>{t('fromYourList', lang)}: {lists[0].name[lang]}</h2><Link to="/lists/home">{lang === 'ar' ? 'افتح' : 'Open'}<Chev lang={lang} /></Link></div>
        <div className="hscroll">{listItems.map((p) => <ProductCard key={p.id} p={p} />)}</div>
      </section>

      <section className="row">
        <div className="row-h"><h2>{t('deals', lang)}</h2></div>
        <div className="deal-strip">
          {deals.map((p, i) => <DealCard key={p.id} p={p} i={i} />)}
        </div>
      </section>

      <section className="row">
        <div className="row-h"><h2>{t('categories', lang)}</h2></div>
        <div className="cats">
          {CATS.map((c) => {
            const first = PRODUCTS.find((p) => p.cat === c.id)
            return <Link key={c.id} to={`/c/${c.id}`} className="cat"><img src={first.thumb} alt="" loading="lazy" /><span>{c[lang]}</span></Link>
          })}
        </div>
      </section>

      <section className="row">
        <div className="row-h"><h2>{t('local', lang)}</h2></div>
        <div className="hscroll">{local.map((p) => <ProductCard key={p.id} p={p} />)}</div>
      </section>
      <p className="foot-note">{rate ? (lang === 'ar' ? '+ المبلغ الأخضر تحت السعر هو ما يعود لك تقريبًا من أرباح المشتريات.' : '+ The green figure under a price is roughly what comes back to you as purchase dividend.') : ''}</p>
    </div>
  )
}

function DealCard({ p, i }) {
  const { lang, latin, dispatch } = useStore()
  const go = useGo()
  const img = useRef(null)
  const off = Math.round((1 - p.deal / p.price) * 100)
  return (
    <article className={`deal d${i % 3}`} onClick={() => go(`/p/${p.id}`, { shared: img.current })}>
      <div><span className="deal-off">-{num(off, lang, latin)}٪</span><b>{p[lang]}</b><Price p={p} lang={lang} latin={latin} /></div>
      <img ref={img} src={p.thumb} alt="" loading="lazy" />
      <button className="addbtn" onClick={(e) => { e.stopPropagation(); dispatch({ type: 'add', id: p.id }) }} aria-label={`${t('add', lang)} ${p[lang]}`}><MdAdd /></button>
    </article>
  )
}

export function Category() {
  const { id } = useParams()
  const { lang } = useStore()
  const c = CATS.find((x) => x.id === id) || CATS[0]
  const [cat, setCat] = useState(c.id)
  const items = PRODUCTS.filter((p) => p.cat === cat)
  return (
    <Screen title={CATS.find((x) => x.id === cat)[lang]} back sticky={
      <nav className="chips" aria-label={t('categories', lang)}>{CATS.map((x) => <button key={x.id} aria-pressed={x.id === cat} onClick={() => setCat(x.id)}>{x[lang]}</button>)}</nav>
    }>
      <div className="grid" key={cat}>{items.map((p, i) => <div key={p.id} className="rise" style={{ '--i': i }}><ProductCard p={p} /></div>)}</div>
    </Screen>
  )
}

export function Search() {
  const { lang, recent, dispatch } = useStore()
  const [q, setQ] = useState('')
  const ref = useRef(null)
  const nav = useNavigate()
  useEffect(() => { ref.current?.focus() }, [])
  const res = useMemo(() => search(q), [q])
  const suggestion = res[0] && res[0].how === 'typo' ? res[0].p[lang] : null
  return (
    <div className="scr search">
      <header className="bar sb">
        <BackBtn />
        <label className="searchbox live"><MdSearch aria-hidden="true" />
          <input ref={ref} value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && q && dispatch({ type: 'recent', q })} placeholder={t('searchPh', lang)} aria-label={t('search', lang)} dir="auto" />
          {q && <button onClick={() => setQ('')} aria-label="clear"><MdClose /></button>}
        </label>
      </header>
      <div className="scr-body">
        {!q && (
          <>
            <h2 className="mini-h"><MdHistory aria-hidden="true" />{t('recent', lang)}</h2>
            <div className="chips wrap">{recent.map((r) => <button key={r} onClick={() => setQ(r)} dir="auto">{r}</button>)}</div>
            <h2 className="mini-h">{lang === 'ar' ? 'جرّب' : 'Try'}</h2>
            <div className="chips wrap">{['labne', 'تمر', 'gahwa', 'halumi', 'عيش', 'هيل'].map((r) => <button key={r} onClick={() => setQ(r)} dir="auto">{r}</button>)}</div>
            <p className="hint">{lang === 'ar' ? 'البحث يفهم العربي والإنجليزي والكتابة باللاتيني، ويتسامح مع الأخطاء الإملائية.' : 'Search understands Arabic, English and Arabic typed in Latin letters, and forgives typos.'}</p>
          </>
        )}
        {q && (
          <>
            <p className="res-n" aria-live="polite">{num(res.length, lang)} {t('results', lang)}{suggestion && <> · {t('matchedTypo', lang)} <b>{suggestion}</b>?</>}</p>
            {res.length ? (
              <ul className="reslist">{res.map(({ p, how }, i) => (
                <li key={p.id} className="rise" style={{ '--i': i }}>
                  <ResRow p={p} how={how} q={q} />
                </li>
              ))}</ul>
            ) : (
              <div className="empty">
                <p>{t('noResults', lang)}</p>
                <button className="btn" onClick={() => nav(`/assistant?q=${encodeURIComponent(q)}`)}><MdAutoAwesome aria-hidden="true" />{t('askAssistant', lang)}</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function ResRow({ p, how }) {
  const { lang, latin, cart, dispatch } = useStore()
  const go = useGo()
  const img = useRef(null)
  const line = cart.find((l) => l.id === p.id)
  const other = lang === 'ar' ? p.en : p.ar
  return (
    <div className="resrow" onClick={() => go(`/p/${p.id}`, { shared: img.current })}>
      <img ref={img} src={p.thumb} alt="" />
      <span className="rr-t"><b>{p[lang]}</b><span className="muted sm" dir="auto">{other} · {p.unit[lang]}</span>{how === 'alt' && <span className="tag">{t('matchedAlt', lang)}</span>}</span>
      <span className="rr-p"><Price p={p} lang={lang} latin={latin} /></span>
      <span onClick={(e) => e.stopPropagation()}>{line ? <Stepper id={p.id} qty={line.qty} small /> : <button className="addbtn" onClick={() => dispatch({ type: 'add', id: p.id })} aria-label={`${t('add', lang)} ${p[lang]}`}><MdAdd /></button>}</span>
    </div>
  )
}

export function Product() {
  const { id } = useParams()
  const p = byId(id)
  const { lang, latin, cart, dispatch, rate, branch, lists } = useStore()
  const [toList, setToList] = useState(false)
  const [added, setAdded] = useState(null)
  if (!p) return <Screen title="404" back><p className="empty">{t('noResults', lang)}</p></Screen>
  const line = cart.find((l) => l.id === p.id)
  const subs = PRODUCTS.filter((x) => x.cat === p.cat && x.id !== p.id).slice(0, 4)
  return (
    <div className="scr pdp">
      <header className="bar floating"><div className="bar-row"><BackBtn /><span className="bar-spacer" /></div></header>
      <div className="pdp-img"><img src={p.img} alt={p[lang]} style={{ viewTransitionName: 'pimg' }} /></div>
      <div className="pdp-body">
        <h1>{p[lang]}</h1>
        <p className="muted" dir="auto">{lang === 'ar' ? p.en : p.ar} · {p.unit[lang]}</p>
        <div className="pdp-price"><Price p={p} lang={lang} latin={latin} big />{rate > 0 && <span className="back lg">{t('dividendBack', lang)}: +{kd(priceOf(p) * rate, lang, latin)}</span>}</div>
        <dl className="facts">
          {p.origin && <div><dt>{t('origin', lang)}</dt><dd>{p.origin[lang]}</dd></div>}
          <div><dt>{t('aisle', lang)}</dt><dd>{num(p.aisles[branch], lang, latin)} · {AISLES[p.aisles[branch]][lang]}</dd></div>
          <div><dt>{lang === 'ar' ? 'الفرع' : 'Branch'}</dt><dd>{BRANCHES.find((b) => b.id === branch).name[lang]}</dd></div>
        </dl>
        <button className="linkbtn" onClick={() => setToList((x) => !x)} aria-expanded={toList}><MdPlaylistAdd aria-hidden="true" />{t('addToList', lang)}</button>
        {toList && (
          <div className="sheet-inline">
            {lists.map((L) => <button key={L.id} onClick={() => { dispatch({ type: 'listAdd', list: L.id, item: { id: p.id } }); setAdded(L.name[lang]); setToList(false) }}>{L.name[lang]}<span className="muted sm">{num(L.items.length, lang, latin)}</span></button>)}
          </div>
        )}
        {added && <p className="ok" role="status"><MdCheck aria-hidden="true" />{lang === 'ar' ? `أضيف إلى ${added}` : `Added to ${added}`}</p>}
        <h2 className="mini-h">{lang === 'ar' ? 'من نفس القسم' : 'From the same department'}</h2>
        <div className="hscroll">{subs.map((x) => <ProductCard key={x.id} p={x} />)}</div>
      </div>
      <div className="buybar">
        {line ? <><Stepper id={p.id} qty={line.qty} /><Link to="/cart" className="btn primary">{t('cart', lang)} · {kd(priceOf(p) * line.qty, lang, latin)}</Link></> : (
          <button className="btn primary wide" onClick={() => dispatch({ type: 'add', id: p.id })}><MdAdd aria-hidden="true" />{t('addToCart', lang)} · {kd(priceOf(p), lang, latin)}</button>
        )}
      </div>
    </div>
  )
}

export function Lists() {
  const { lang, latin, lists, dispatch } = useStore()
  const nav = useNavigate()
  return (
    <Screen title={t('lists', lang)} sub={lang === 'ar' ? 'قوائم مشتركة مع العائلة، تتحول إلى سلة بلمسة.' : 'Lists shared with your family, turned into a basket in one tap.'}>
      <ul className="listcards">
        {lists.map((L, i) => {
          const open = L.items.filter((x) => !x.done).length
          return (
            <li key={L.id} className="rise" style={{ '--i': i }}>
              <Link to={`/lists/${L.id}`} className="listcard">
                <span className="lc-n"><b>{L.name[lang]}</b><span className="muted sm">{lang === 'ar' ? `${num(open, lang, latin)} من ${num(L.items.length, lang, latin)} متبقية` : `${open} of ${L.items.length} left`}</span></span>
                <span className="lc-thumbs">{L.items.filter((x) => x.id).slice(0, 4).map((x) => <img key={x.key} src={byId(x.id).thumb} alt="" />)}</span>
                {L.shared.length > 0 && <span className="lc-who">{L.shared.map((n) => <i key={n}>{n[0]}</i>)}</span>}
              </Link>
            </li>
          )
        })}
      </ul>
      <button className="btn ghost wide" onClick={() => { const id = `l${Date.now()}`; dispatch({ type: 'listNew', id, name: { ar: 'قائمة جديدة', en: 'New list' } }); nav(`/lists/${id}`) }}><MdAdd aria-hidden="true" />{lang === 'ar' ? 'قائمة جديدة' : 'New list'}</button>
    </Screen>
  )
}

export function ListDetail() {
  const { id } = useParams()
  const { lang, latin, lists, dispatch, branch } = useStore()
  const L = lists.find((x) => x.id === id) || lists[0]
  const [byAisle, setByAisle] = useState(true)
  const [txt, setTxt] = useState('')
  const [toast, setToast] = useState(false)
  const items = L.items
  const groups = byAisle
    ? Object.entries(items.reduce((g, i) => { const a = i.id ? byId(i.id).aisles[branch] : 99; (g[a] = g[a] || []).push(i); return g }, {})).sort((a, b) => a[0] - b[0])
    : [['all', items]]
  const sugg = txt ? search(txt).slice(0, 3) : []
  const total = items.filter((i) => i.id && !i.done).reduce((s, i) => s + priceOf(byId(i.id)) * i.qty, 0)
  const addFree = () => {
    if (!txt.trim()) return
    if (sugg[0] && sugg[0].score >= 80) dispatch({ type: 'listAdd', list: L.id, item: { id: sugg[0].p.id } })
    else dispatch({ type: 'listAdd', list: L.id, item: { text: txt.trim() } })
    setTxt('')
  }
  return (
    <Screen title={L.name[lang]} back sub={L.shared.length ? `${t('sharedWith', lang)}: ${L.shared.join('، ')}` : ''} actions={<button className="iconbtn" aria-label="share"><MdShare /></button>} sticky={
      <div className="seg" role="group"><button aria-pressed={byAisle} onClick={() => setByAisle(true)}><MdSort aria-hidden="true" />{t('sortAisle', lang)}</button><button aria-pressed={!byAisle} onClick={() => setByAisle(false)}>{t('sortAdded', lang)}</button></div>
    }>
      <form className="additem" onSubmit={(e) => { e.preventDefault(); addFree() }}>
        <input value={txt} onChange={(e) => setTxt(e.target.value)} placeholder={t('addItem', lang)} dir="auto" aria-label={t('addItem', lang)} />
        <button className="iconbtn solid" aria-label={t('add', lang)}><MdAdd /></button>
        {sugg.length > 0 && <div className="sugg">{sugg.map(({ p }) => <button type="button" key={p.id} onClick={() => { dispatch({ type: 'listAdd', list: L.id, item: { id: p.id } }); setTxt('') }}><img src={p.thumb} alt="" />{p[lang]}</button>)}</div>}
      </form>
      {groups.map(([a, its]) => (
        <section key={a} className="aisle">
          {byAisle && <h2 className="aisle-h">{a === '99' ? (lang === 'ar' ? 'خارج القائمة' : 'Not in the catalogue') : `${t('aisle', lang)} ${num(a, lang, latin)} · ${AISLES[a][lang]}`}</h2>}
          <ul>
            {its.map((i) => {
              const p = i.id && byId(i.id)
              return (
                <li key={i.key} className={`li ${i.done ? 'done' : ''}`}>
                  <button className="tick" onClick={() => dispatch({ type: 'listToggle', list: L.id, key: i.key })} aria-pressed={i.done} aria-label={p ? p[lang] : i.text}>{i.done ? <MdCheckCircle /> : <span className="ring" />}</button>
                  {p ? <img src={p.thumb} alt="" /> : <span className="noimg" />}
                  <span className="li-t"><b>{p ? p[lang] : i.text}</b><span className="muted sm">{p ? `${num(i.qty, lang, latin)} × ${p.unit[lang]}` : t('notInCatalog', lang)} · {i.by}</span></span>
                  {p && <span className="li-p">{kd(priceOf(p) * i.qty, lang, latin)}</span>}
                </li>
              )
            })}
          </ul>
        </section>
      ))}
      <div className="list-foot">
        <span><span className="muted sm">{lang === 'ar' ? 'المتبقي' : 'Left to buy'}</span><b>{kd(total, lang, latin)}</b></span>
        <button className="btn primary" onClick={() => { dispatch({ type: 'listToCart', list: L.id }); setToast(true); setTimeout(() => setToast(false), 2200) }}>{t('addAll', lang)}</button>
      </div>
      {toast && <p className="toast" role="status"><MdCheck aria-hidden="true" />{lang === 'ar' ? 'أضيفت إلى السلة' : 'Added to the basket'}</p>}
    </Screen>
  )
}

// Scripted assistant: it answers by building something you can use, a list or a basket, and shows its working.
const PLANS = [
  { keys: ['عشاء', 'مجبوس', 'عزيمه', 'ستة', '6', 'dinner', 'machboos', 'guests', 'six'], title: { ar: 'مجبوس دجاج لستة أشخاص', en: 'Chicken machboos for six' }, say: { ar: 'هذه مكونات مجبوس دجاج لستة أشخاص، بكميات تكفي مع خبز ولبن للمائدة. اخترت الأرز في العرض.', en: 'Here is chicken machboos for six, with bread and laban for the table. I picked the rice that is on offer.' }, items: [['rice', 1], ['chicken', 2], ['onions', 1], ['tomatoes', 1], ['saffron', 1], ['cardamom', 1], ['laban', 2], ['khubz', 2]] },
  { keys: ['فطور', 'ريوق', 'breakfast', 'morning'], title: { ar: 'فطور لأربعة', en: 'Breakfast for four' }, say: { ar: 'فطور خفيف لأربعة: بيض ولبنة وحلوم مع خبز وخضار.', en: 'A light breakfast for four: eggs, labneh and halloumi with bread and vegetables.' }, items: [['eggs', 1], ['labneh', 1], ['halloumi', 1], ['khubz', 1], ['tomatoes', 1], ['cucumbers', 1], ['mint', 1]] },
  { keys: ['عروض', 'تخفيض', 'deal', 'offer', 'cheap', 'sale'], title: { ar: 'عروض هذا الأسبوع', en: "This week's deals" }, say: { ar: 'هذه العروض الحالية مرتبة حسب نسبة التوفير.', en: 'These are the current deals, by how much you save.' }, items: PRODUCTS.filter((p) => p.deal).sort((a, b) => b.deal / b.price - a.deal / a.price).map((p) => [p.id, 1]) },
  { keys: ['ناقص', 'البيت', 'قائمه', 'restock', 'missing', 'list', 'home'], title: { ar: 'الناقص في قائمة البيت', en: 'Missing from the Home list' }, say: { ar: 'هذه البنود غير المشطوبة في قائمة البيت، ويمكن إضافتها إلى السلة دفعة واحدة.', en: 'These are the unticked items on your Home list, ready to add in one go.' }, fromList: 'home' },
]

export function Assistant() {
  const { lang, latin, dispatch, lists, rate } = useStore()
  const params = new URLSearchParams(window.location.hash.split('?')[1] || '')
  const [msgs, setMsgs] = useState(() => [{ who: 'bot', text: lang === 'ar' ? 'أهلًا فاطمة. قل لي ماذا تطبخين أو ما الذي ينقص البيت، وسأجهز لك القائمة.' : 'Hi Fatima. Tell me what you are cooking or what the house is missing, and I will put the list together.' }])
  const [q, setQ] = useState(params.get('q') || '')
  const [busy, setBusy] = useState(false)
  const end = useRef(null)
  useEffect(() => { end.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }) }, [msgs, busy])
  const ask = (text) => {
    if (!text.trim() || busy) return
    setMsgs((m) => [...m, { who: 'me', text }])
    setQ('')
    setBusy(true)
    const n = norm(text)
    const plan = PLANS.find((pl) => pl.keys.some((k) => n.includes(norm(k))))
    setTimeout(() => {
      setBusy(false)
      if (!plan) {
        const found = search(text).slice(0, 4)
        setMsgs((m) => [...m, found.length ? { who: 'bot', text: lang === 'ar' ? 'وجدت هذه المنتجات:' : 'I found these:', items: found.map((f) => [f.p.id, 1]) } : { who: 'bot', text: lang === 'ar' ? 'لا أجد هذا في المتجر. هل تريد أن أضيفه إلى قائمة البيت ليسأل عنه أحد في الفرع؟' : 'I cannot find that in the shop. Shall I add it to the Home list so someone asks at the branch?', note: text }])
        return
      }
      const items = plan.fromList ? lists.find((L) => L.id === plan.fromList).items.filter((i) => i.id && !i.done).map((i) => [i.id, i.qty]) : plan.items
      setMsgs((m) => [...m, { who: 'bot', title: plan.title[lang], text: plan.say[lang], items, stream: true }])
    }, 900)
  }
  const chips = lang === 'ar' ? ['عشاء لستة أشخاص', 'فطور لأربعة', 'ما الناقص في البيت؟', 'ما العروض؟'] : ['Dinner for six', 'Breakfast for four', 'What is missing at home?', "What's on offer?"]
  return (
    <div className="scr chat">
      <header className="bar"><div className="bar-row"><span className="bar-spacer" /><span className="bar-title show"><MdAutoAwesome aria-hidden="true" /> {t('assistant', lang)}</span><span className="bar-act" /></div></header>
      <div className="msgs">
        {msgs.map((m, i) => <Msg key={i} m={m} lang={lang} latin={latin} dispatch={dispatch} rate={rate} />)}
        {busy && <div className="msg bot typing" aria-label="…"><i /><i /><i /></div>}
        <div ref={end} />
      </div>
      <div className="composer">
        <div className="chips scroll">{chips.map((c) => <button key={c} onClick={() => ask(c)}>{c}</button>)}</div>
        <form onSubmit={(e) => { e.preventDefault(); ask(q) }}>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={lang === 'ar' ? 'اكتب أو تكلم…' : 'Type or speak…'} dir="auto" aria-label={t('assistant', lang)} />
          <button className="iconbtn solid" aria-label="send"><MdSend style={{ transform: lang === 'ar' ? 'scaleX(-1)' : undefined }} /></button>
        </form>
        <p className="muted xs">{lang === 'ar' ? 'المساعد يقترح فقط، ولا يطلب شيئًا دون موافقتك.' : 'The assistant only suggests. Nothing is ordered without you.'}</p>
      </div>
    </div>
  )
}

function Msg({ m, lang, latin, dispatch, rate }) {
  const [shown, setShown] = useState(m.stream ? 0 : (m.text || '').length)
  const [done, setDone] = useState(false)
  const nav = useNavigate()
  useEffect(() => {
    if (!m.stream) return
    let i = 0
    const id = setInterval(() => { i += 3; setShown(i); if (i >= m.text.length) clearInterval(id) }, 16)
    return () => clearInterval(id)
  }, [m])
  const total = (m.items || []).reduce((s, [id, q]) => s + priceOf(byId(id)) * q, 0)
  return (
    <div className={`msg ${m.who}`}>
      {m.title && <b className="msg-title">{m.title}</b>}
      <p>{m.text.slice(0, shown)}</p>
      {m.items && shown >= m.text.length && (
        <div className="msg-items">
          <ul>{m.items.map(([id, q], i) => { const p = byId(id); return <li key={id} className="rise" style={{ '--i': i }}><img src={p.thumb} alt="" /><span>{p[lang]}<span className="muted sm"> × {num(q, lang, latin)}</span></span><b>{kd(priceOf(p) * q, lang, latin)}</b></li> })}</ul>
          <div className="msg-total"><span>{t('total', lang)}</span><b>{kd(total, lang, latin)}</b></div>
          {rate > 0 && <p className="back">{t('dividendBack', lang)}: +{kd(total * rate, lang, latin)}</p>}
          <div className="msg-acts">
            <button className="btn primary" disabled={done} onClick={() => { m.items.forEach(([id, q]) => dispatch({ type: 'add', id, qty: q })); setDone(true) }}>{done ? (lang === 'ar' ? 'في السلة' : 'In the basket') : t('addAll', lang)}</button>
            <button className="btn ghost" onClick={() => { const id = `l${Date.now()}`; dispatch({ type: 'listNew', id, name: { ar: m.title || 'قائمة', en: m.title || 'List' }, items: m.items.map(([pid, q], k) => ({ key: `${id}${k}`, id: pid, qty: q, done: false, by: lang === 'ar' ? 'المساعد' : 'Assistant' })) }); nav(`/lists/${id}`) }}>{lang === 'ar' ? 'احفظها كقائمة' : 'Save as a list'}</button>
          </div>
        </div>
      )}
      {m.note && <div className="msg-acts"><button className="btn ghost" onClick={() => { dispatch({ type: 'listAdd', list: 'home', item: { text: m.note } }); nav('/lists/home') }}>{lang === 'ar' ? 'أضفها إلى قائمة البيت' : 'Add to the Home list'}</button></div>}
    </div>
  )
}

export function Cart() {
  const { lang, latin, lines, subtotal, dispatch, rate, persona, branch } = useStore()
  const [mode, setMode] = useState('express')
  const [busy, setBusy] = useState(false)
  const nav = useNavigate()
  const fee = mode === 'pickup' ? 0 : subtotal >= 10 ? 0 : 0.500
  const total = subtotal + fee
  if (!lines.length) return (
    <Screen title={t('cart', lang)}>
      <div className="empty big"><MdLocalShipping aria-hidden="true" /><p>{t('emptyCart', lang)}</p><Link className="btn primary" to="/lists/home">{lang === 'ar' ? 'من قائمة البيت' : 'From the Home list'}</Link><Link className="btn ghost" to="/assistant">{t('askAssistant', lang)}</Link></div>
    </Screen>
  )
  return (
    <Screen title={t('cart', lang)} sub={lang === 'ar' ? `${num(lines.length, lang, latin)} منتجات` : `${lines.length} items`}>
      <ul className="cartlist">
        {lines.map((l) => (
          <li key={l.id}>
            <img src={l.p.thumb} alt="" />
            <span className="cl-t"><b>{l.p[lang]}</b><span className="muted sm">{l.p.unit[lang]}</span>
              <button className={`swap ${l.swap ? 'on' : ''}`} onClick={() => dispatch({ type: 'swap', id: l.id })} aria-pressed={l.swap}><MdSwapHoriz aria-hidden="true" />{lang === 'ar' ? (l.swap ? 'يُستبدل إذا نفد' : 'لا تستبدل') : (l.swap ? 'Swap if out' : 'Do not swap')}</button>
            </span>
            <span className="cl-r"><b>{kd(priceOf(l.p) * l.qty, lang, latin)}</b><Stepper id={l.id} qty={l.qty} small /></span>
          </li>
        ))}
      </ul>
      <h2 className="mini-h">{t('delivery', lang)}</h2>
      <div className="modes" role="radiogroup">
        {[['express', MdBolt, t('express', lang)], ['scheduled', MdSchedule, t('scheduled', lang)], ['pickup', MdStorefront, `${t('pickup', lang)}: ${BRANCHES.find((b) => b.id === branch).name[lang]}`]].map(([k, I, label]) => (
          <label key={k} className={mode === k ? 'on' : ''}><input type="radio" name="mode" checked={mode === k} onChange={() => setMode(k)} /><I aria-hidden="true" /><span>{label}</span></label>
        ))}
      </div>
      {persona === 'shareholder' && <p className="member-line"><MdCheck aria-hidden="true" />{t('shareholderNo', lang)} <b>{num(20417, lang, latin)}</b> {lang === 'ar' ? 'مضاف تلقائيًا' : 'added automatically'}</p>}
      <dl className="sum">
        <div><dt>{t('subtotal', lang)}</dt><dd>{kd(subtotal, lang, latin)}</dd></div>
        <div><dt>{t('delivery', lang)}</dt><dd>{fee ? kd(fee, lang, latin) : t('free', lang)}</dd></div>
        <div className="tot"><dt>{t('total', lang)}</dt><dd>{kd(total, lang, latin)}</dd></div>
        {rate > 0 && <div className="back"><dt>{t('dividendBack', lang)}</dt><dd>+{kd(subtotal * rate, lang, latin)}</dd></div>}
      </dl>
      <button className="btn primary wide" disabled={busy} onClick={() => { setBusy(true); setTimeout(() => { const no = String(48000 + Math.floor(Math.random() * 999)); dispatch({ type: 'order', order: { no, total, mode, at: Date.now() } }); nav(`/done/${no}`) }, 900) }}>{busy ? '…' : `${t('placeOrder', lang)} · ${kd(total, lang, latin)}`}</button>
      <p className="muted xs center">{lang === 'ar' ? 'نموذج أولي: لا يتم أي دفع.' : 'Prototype: nothing is charged.'}</p>
    </Screen>
  )
}

export function Done() {
  const { no } = useParams()
  const { lang, latin, orders } = useStore()
  const o = orders.find((x) => x.no === no)
  const steps = lang === 'ar' ? ['استلمنا الطلب', 'يُجهّز في الفرع', 'مع السائق', 'وصل'] : ['Order received', 'Being picked at the branch', 'With the driver', 'Delivered']
  return (
    <Screen title={lang === 'ar' ? 'تم الطلب' : 'Order placed'} sub={`#${num(no, lang, latin)}`}>
      <div className="done-hero"><MdCheckCircle aria-hidden="true" /><p>{o?.mode === 'pickup' ? (lang === 'ar' ? 'سنرسل لك رسالة عندما يجهز في الفرع.' : 'We will message you when it is ready at the branch.') : (lang === 'ar' ? 'يصل خلال ٤٥ دقيقة تقريبًا.' : 'Arriving in about 45 minutes.')}</p></div>
      <ol className="track">{steps.map((s, i) => <li key={s} className={i === 0 ? 'on' : ''} style={{ '--i': i }}>{s}</li>)}</ol>
      <Link className="btn ghost wide" to="/">{t('home', lang)}</Link>
    </Screen>
  )
}

export function Member() {
  const { lang, latin, brand, persona, orders } = useStore()
  const spent = 412.350 + orders.reduce((s, o) => s + o.total, 0)
  const months = [38, 52, 41, 47, 66, 58, 44, 49, 61, 57]
  return (
    <Screen title={t('member', lang)} back>
      <div className="mcard" style={{ '--b': brand.primary }}>
        <span className="mc-top"><Mark brand={brand} size={26} />{brand.name[lang]}</span>
        <b className="mc-name">{lang === 'ar' ? 'فاطمة سالم العتيبي' : 'Fatima Salem Al-Otaibi'}</b>
        <span className="mc-no">{persona === 'shareholder' ? `${t('shareholderNo', lang)} ${num(20417, lang, latin)}` : (lang === 'ar' ? 'عضوية نقاط' : 'Points member')}</span>
        <span className="mc-code" aria-hidden="true">{Array.from({ length: 34 }, (_, i) => <i key={i} style={{ width: (i * 7) % 3 + 1 }} />)}</span>
      </div>
      {persona === 'shareholder' ? (
        <>
          <dl className="sum">
            <div><dt>{lang === 'ar' ? 'مشترياتك هذا العام' : 'Your shopping this year'}</dt><dd>{kd(spent, lang, latin)}</dd></div>
            <div className="tot"><dt>{t('yourShare', lang)}</dt><dd>{kd(spent * 0.1, lang, latin)}</dd></div>
          </dl>
          <p className="muted sm">{t('estimated', lang)}. {lang === 'ar' ? 'النسبة المفترضة في النموذج ١٠٪.' : 'The prototype assumes 10%.'}</p>
          <h2 className="mini-h">{lang === 'ar' ? 'المشتريات شهريًا' : 'Shopping by month'}</h2>
          <div className="bars" aria-hidden="true">{months.map((v, i) => <i key={i} style={{ height: `${v}%`, '--i': i }} />)}</div>
          <h2 className="mini-h">{lang === 'ar' ? 'أفراد العائلة على نفس الرقم' : 'Family on the same number'}</h2>
          <ul className="fam">{(lang === 'ar' ? ['أم سالم', 'سالم', 'نورة'] : ['Umm Salem', 'Salem', 'Noura']).map((n) => <li key={n}><i>{n[0]}</i>{n}</li>)}</ul>
        </>
      ) : (
        <p className="hint">{lang === 'ar' ? 'المساهمة متاحة لسكان المنطقة وفق شروط الجمعية. المساهمون يحصلون على أرباح مشتريات سنوية بدل النقاط.' : 'Shares are open to residents of the area under the co-op’s rules. Shareholders get a yearly purchase dividend instead of points.'}</p>
      )}
    </Screen>
  )
}
