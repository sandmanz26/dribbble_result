import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Wordmark } from '../ui/kit.jsx'
import LessonFlow from './LessonFlow.jsx'

// The free lesson. No account, no paywall between the student and their first mark.
export default function Taster() {
  const [step, setStep] = useState(0)
  return (
    <div className="taster">
      <header className="tbar">
        <Wordmark />
        <p className="tbar-note">
          <Icon name="unlock" size={18} />
          Free lesson. No account needed.
        </p>
        <Link to="/" className="tbar-exit">
          <Icon name="cross" size={20} />
          <span>Leave</span>
        </Link>
      </header>
      <main className="taster-main" data-step={step}>
        <LessonFlow mode="taster" onStepChange={setStep} />
      </main>
    </div>
  )
}
