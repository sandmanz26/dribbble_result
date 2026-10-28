# Flow Director: research notes

Done before designing, to make the prototype match how clinic operations and AI agents really work.
Flow Director and its founder are not publicly findable, so the research covers the job itself.

## Where front-office time goes
- MGMA Stat poll (March 2026): eligibility and prior authorization take about 45% of front-office
  staff time, scheduling 31%, intake 9%, refills 6%. So the critical screens are referral intake,
  insurance checks and booking, not a chat window.
- Electronic eligibility checks (X12 270 request, 271 reply) take about 4 minutes and $2.04 each
  against about 16 minutes and $12.95 by phone or portal (CAQH Index). Payer timeouts are common,
  so a failed check needs retries and a clean hand-off to a phone call.
- Most referrals still arrive by fax. AI document sorting and reading is how intake is automated,
  and partly unreadable pages and uncertain patient matches are everyday failures.
- Prior authorization agents gather documents, submit, track and escalate denials; payers often ask
  for clinical notes, which a person must write.

## How people and AI agents should share work
- Human-in-the-loop by risk: approval gates for irreversible or sensitive actions (money, patient
  messages, clinical content) and autonomy for low-risk ones, to avoid approval fatigue.
- Keep an activity log separate from chat: each entry says who, what, when, the result and whether
  it can be undone.
- A task board with an owner (agent or person), a state and a time target; failures stated
  specifically with recovery options; a "needs review" view with the evidence and confidence.
- Show what the agent will do before it does it (effects, reversibility), and give a short undo
  window after.

## What this changed in the design
- The queue is the home of work; Today summarises it. Chat with Patrick is not a primary surface.
- Eight job states shared by queue, run timeline, activity and spec, each with its own glyph.
- Every ask shows the rule that caused it; Rules for Patrick sets Do it, Ask first or Never per
  action, with two rows locked as clinic policy.
- Failures always offer two or three recovery paths, one suggested, plus the automatic retry plan.
- Approve is optimistic with an idempotent request, a realtime update or polling fallback, a timeout
  path and a 10 second undo.

## Sources
MGMA Stat (Mar 2026), CAQH Index, kore.ai, neuraltrust.ai, omnimd, cadenya, linear.health,
exploreagentic.ai, rovinghealth, neonhealth, hatchworks, towardsai, fuselabcreative, fast.io,
assorthealth (articles on AI agents for healthcare front offices, human-in-the-loop approval design
and agent activity logs).
