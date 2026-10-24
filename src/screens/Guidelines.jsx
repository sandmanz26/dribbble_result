import { TopBar } from '../ui/kit.jsx'

export default function Guidelines() {
  return (
    <div className="page detail">
      <TopBar title="Community guidelines" />
      <ol className="guide">
        <li><strong>Be who you say you are.</strong><p>One account per person, with your real name and a recent photo. Hosts can see which checks you passed.</p></li>
        <li><strong>Meet in public first.</strong><p>The first meet-up with a new group happens in a public place, with the group, not one to one.</p></li>
        <li><strong>Say no, and hear no.</strong><p>Anyone can leave a plan, a chat or a group without giving a reason. Pressure to stay is a reason to report.</p></li>
        <li><strong>Money stays in the trip.</strong><p>Shared costs live in the trip budget. Never send money to someone for anything outside it.</p></li>
        <li><strong>Respect the places you visit.</strong><p>Follow local rules, ask before photographing people, leave rooms as you found them.</p></li>
        <li><strong>Report what feels wrong.</strong><p>A person on our safety team reads every report within 24 hours. The person you report is not told who reported them.</p></li>
      </ol>
    </div>
  )
}
