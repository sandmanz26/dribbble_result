import { useEffect, useRef } from 'react'
import { NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { useStore } from './store.jsx'
import { Bag, Ticket, Chef, List, Offline, Signal } from './ui/icons.js'
import Menu from './screens/Menu.jsx'
import Item from './screens/Item.jsx'
import BagScreen from './screens/Bag.jsx'
import Orders from './screens/Orders.jsx'
import Order from './screens/Order.jsx'
import Manage from './screens/Manage.jsx'
import Panel from './Panel.jsx'
import Credits from './screens/Credits.jsx'
import Checkout from './screens/Checkout.jsx'

function Tabs() {
  const { count, active } = useStore()
  const tab = (to, Icon, label, badge) => (
    <NavLink to={to} end={to === '/'} className="tab">
      <span className="tab-icon"><Icon size={24} />{badge ? <b className="badge" key={badge}>{badge}</b> : null}</span>
      <span>{label}</span>
    </NavLink>
  )
  return (
    <nav className="tabs" aria-label="Main">
      {tab('/', List, 'Menu')}
      {tab('/bag', Bag, 'Bag', count)}
      {tab('/orders', Ticket, 'Orders', active)}
      {tab('/manage', Chef, 'Manage')}
    </nav>
  )
}

export default function App() {
  const loc = useLocation()
  const nav = useNavigate()
  const { online, net, waiting, dispatch } = useStore()
  const scroller = useRef(null)
  const onItem = loc.pathname.startsWith('/item/') || loc.pathname === '/checkout'

  // Review links: #/?demo=offline starts with no signal.
  useEffect(() => {
    const q = new URLSearchParams(loc.search)
    if (q.get('demo') === 'offline' || q.get('demo') === 'weak') dispatch({ type: 'set', patch: { net: q.get('demo') } })
    if (q.get('demo') === 'reset') { dispatch({ type: 'reset' }); nav('/', { replace: true }) }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { scroller.current?.scrollTo(0, 0) }, [loc.pathname])

  return (
    <div className="stage">
      <div className="phone">
        <div className="app">
          {!online ? <p className="netbar" role="status"><Offline size={16} /> No signal. {waiting ? `${waiting} order${waiting > 1 ? 's' : ''} waiting on this phone, not sent yet.` : 'You can browse and build your bag. Orders wait here until you are back online.'}</p>
            : net === 'weak' ? <p className="netbar is-weak" role="status"><Signal size={16} /> Weak signal. Things may take a few seconds.</p> : null}
          <main className="screen" ref={scroller} key={loc.pathname} data-route={loc.pathname.split('/')[1] || 'menu'}>
            <Routes>
              <Route path="/" element={<Menu scroller={scroller} />} />
              <Route path="/item/:id" element={<Item />} />
              <Route path="/bag" element={<BagScreen />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/order/:id" element={<Order />} />
              <Route path="/manage" element={<Manage />} />
              <Route path="/credits" element={<Credits />} />
              <Route path="*" element={<Menu scroller={scroller} />} />
            </Routes>
          </main>
          {!onItem && <Tabs />}
        </div>
      </div>
      <Panel />
    </div>
  )
}
