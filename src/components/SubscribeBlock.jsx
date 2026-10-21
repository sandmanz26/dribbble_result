import SubscribeForm from './SubscribeForm.jsx'

export default function SubscribeBlock() {
  return (
    <div className="subscribe" id="subscribe">
      <div>
        <span className="eyebrow">Stay in the loop</span>
        <h2>New adventure? You’ll hear first.</h2>
        <p className="lede">Get a short postcard when we announce a trip, publish a story, or find a bakery worth crossing a country for.</p>
        <ul className="perks">
          <li>Trip announcements before they hit the calendar</li>
          <li>Honest budget breakdowns, no sponsored fluff</li>
          <li>The occasional packing list. Theo’s snack rules included.</li>
        </ul>
      </div>
      <SubscribeForm />
    </div>
  )
}
