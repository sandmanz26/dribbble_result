import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store.jsx'
import { Back } from '../ui/kit.jsx'
import { prompt } from '../data/ritual.js'
import { TODAY } from '../data/history.js'

export default function Write() {
  const { s, set, notify } = useStore()
  const nav = useNavigate()
  const [text, setText] = useState('')
  const q = s.checkin ? prompt(s.checkin) : 'How did today feel?'
  const save = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    const entry = { id: `w${Date.now()}`, date: TODAY, mood: s.checkin?.mood || 'steady', prompt: q, text: text.trim() }
    set((c) => ({ journal: [entry, ...c.journal], done: [...new Set([...c.done, 'journal'])], minutesToday: c.minutesToday + 1 }))
    notify({ text: 'Saved. Only you can read your journal.', undo: () => set((c) => ({ journal: c.journal.filter((x) => x.id !== entry.id) })) })
    nav(s.checkin ? '/ritual' : '/journal')
  }
  return (
    <form className="write f-paper" onSubmit={save}>
      <header className="bar"><Back label="Close without saving" /><h1 className="bar-title">One line</h1><button className="btn small primary" disabled={!text.trim()}>Save</button></header>
      <label htmlFor="jt" className="write-prompt serif">{q}</label>
      <textarea id="jt" autoFocus rows={8} placeholder="Write as much or as little as you like" value={text} onChange={(e) => setText(e.target.value)} />
      <p className="meta small num">{text.trim() ? `${text.trim().split(/\s+/).length} words` : 'Private to this phone'}</p>
    </form>
  )
}
