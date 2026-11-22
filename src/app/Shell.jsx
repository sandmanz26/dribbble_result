import { NavLink } from 'react-router-dom'
import { Icon, Wordmark } from '../ui/kit.jsx'

const NAVS = {
  student: [
    ['/app', 'Today', 'home'],
    ['/app/lesson', 'Lessons', 'book'],
    ['/app#answers', 'Marked answers', 'clipboard'],
    ['/app#spec', 'My spec', 'rows'],
  ],
  parent: [
    ['/parent', 'This week', 'home'],
    ['/parent#marks', 'Marks', 'clipboard'],
    ['/parent#sharing', 'What Maya shares', 'eye'],
    ['/parent#billing', 'Plan and billing', 'invoice'],
  ],
  teacher: [
    ['/teacher', '13E Economics', 'home'],
    ['/teacher/review', 'Check marks', 'edit'],
    ['/teacher#homework', 'Homework', 'calendar'],
    ['/teacher#class', 'Class by AO', 'users'],
  ],
}

const WHO = {
  student: { name: 'Maya Patel', sub: 'Year 13 · AQA', initials: 'MP' },
  parent: { name: 'Priya Patel', sub: 'Parent of Maya', initials: 'PP' },
  teacher: { name: 'Daniel Mensah', sub: 'Riverside Sixth Form', initials: 'DM' },
}

export default function Shell({ role, title, sentence, action, children }) {
  const who = WHO[role]
  return (
    <div className="app">
      <aside className="side" aria-label="App navigation">
        <Wordmark to="/" />
        <nav className="side-nav">
          {NAVS[role].map(([to, label, icon]) => (
            <NavLink key={to} to={to} end className="side-link">
              <Icon name={icon} size={20} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="side-who">
          <span className="who-mark" aria-hidden="true">
            {who.initials}
          </span>
          <span>
            <strong>{who.name}</strong>
            <small>{who.sub}</small>
          </span>
        </div>
      </aside>
      <div className="canvas">
        <header className="title-row">
          <div>
            <h1 className="title">{title}</h1>
            {sentence && <p className="title-sentence">{sentence}</p>}
          </div>
          {action}
        </header>
        <main className="canvas-main">{children}</main>
      </div>
      <nav className="tabbar" aria-label="App navigation">
        {NAVS[role].map(([to, label, icon]) => (
          <NavLink key={to} to={to} end className="tab">
            <Icon name={icon} size={22} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

export function Panel({ title, id, aside, className = '', children }) {
  return (
    <section className={`panel ${className}`} id={id} aria-labelledby={id ? `${id}-h` : undefined}>
      <div className="panel-head">
        <h2 id={id ? `${id}-h` : undefined}>{title}</h2>
        {aside}
      </div>
      {children}
    </section>
  )
}
