import { SearchX } from 'lucide-react'
import { Button, Empty } from '../ui/index.jsx'

export default function NotFound() {
  return (
    <section className="section">
      <div className="wrap narrow">
        <Empty icon={SearchX} title="This page does not exist" action={<Button to="/">Go to the home page</Button>}>
          The link may be old. Everything else is still here.
        </Empty>
      </div>
    </section>
  )
}
