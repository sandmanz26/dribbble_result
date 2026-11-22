import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Icon, Wordmark } from '../ui/kit.jsx'
import LessonFlow from './LessonFlow.jsx'
import { SUBJECTS } from '../data/taster.js'

// The free lesson. No account, no paywall between the student and their first mark.
export default function Taster() {
  const [step, setStep] = useState(0)
  const { subject } = useParams()
  const wanted = SUBJECTS.find((x) => x.id === subject)
  const stand = wanted && !wanted.ready
  return (
    <div className="taster">
      <header className="tbar">
        <Wordmark />
        <p className="tbar-note">
          <Icon name="check" size={18} />
          Free lesson<span className="long">. No account needed.</span>
        </p>
        <Link to="/" className="tbar-exit">
          <Icon name="cross" size={20} />
          <span>Leave</span>
        </Link>
      </header>
      <main className="taster-main" data-step={step}>
        {stand && step === 0 && (
          <p className="taster-stand" role="note">
            <strong>{wanted.name}: “{wanted.taster}”</strong> uses this same route. This prototype has the Economics lesson built, so try that one to see how it works.
          </p>
        )}
        <LessonFlow mode="taster" onStepChange={setStep} />
      </main>
    </div>
  )
}
