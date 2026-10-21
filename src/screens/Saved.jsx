import { Link } from 'react-router-dom'
import { IconHeart } from '@tabler/icons-react'
import { TopBar, TabBar, Empty } from '../components/ui.jsx'
import CreatorCard from '../components/CreatorCard.jsx'
import { getCreator } from '../data/creators.js'
import { useStore } from '../app/store.jsx'

export default function Saved() {
  const { saved } = useStore()
  const list = saved.map(getCreator).filter(Boolean)
  return (
    <>
      <div className="screen has-tabs">
        <TopBar title="Saved" left back={false} />
        {list.length
          ? <div className="feed" style={{ marginTop: 12 }}>{list.map((c, n) => <CreatorCard key={c.id} c={c} index={n} />)}</div>
          : <Empty icon={IconHeart} title="No saved creators" text="Tap the heart on any profile to keep it here for later." action={<Link to="/" className="btn sm">Discover creators</Link>} />}
      </div>
      <TabBar />
    </>
  )
}
