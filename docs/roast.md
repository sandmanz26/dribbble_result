# Roast: the brief, the category, and our first idea

## The brief
1. **"Emulates human brain processes" is a claim, not a feature.** Unless the UI shows the brain doing something
   (choosing a fast path, remembering, forming a habit, sleeping on it), it is marketing copy over a chat box.
   **Fix:** every answer shows the path it took and what that cost.
2. **"Up to 80% cheaper" will be read as a promise.** Users who see 40% will feel cheated; procurement will ask
   "cheaper than what?". **Fix:** a stated baseline (the same work done entirely by the reasoning model), savings
   per answer, per habit and per week, and a forecast instead of a slogan.
3. **"Fast at getting things done" contradicts a chat-only UI.** Getting things done means tasks, handovers and
   repeated work, not conversation. **Fix:** the home screen is a desk of tasks and routines; the composer accepts
   tasks ("draft the supplier reply"), not only questions.
4. **Web, desktop and mobile as three copies of one chat.** **Fix:** each surface gets a job. Web: the workspace
   where memory, habits and spend are managed. Desktop: a quick-ask overlay over the app you are in. Mobile:
   capture by voice or photo, approve habits, read the morning report.
5. **shadcn/ui and Tailwind.** Good for the engineers; dangerous for distinctiveness, because default shadcn looks
   like every AI dashboard. **Fix:** keep the component behaviour, replace the look: our own tokens, type, density
   and one signature element.
6. **"Contemporary or retro."** **Decision:** a retro reference with a reason. Neuroscience instruments: the
   polygraph and EEG chart recorder, phosphor-era displays. It turns "brain" into something measured, not drawn.

## The category (what we refuse to do)
- No glowing brain illustrations, neural-network node graphs, purple gradients or sparkle icons.
- No "Thinking..." spinner as the only feedback. Waiting is shown as a path with a reason.
- No model picker as the first decision. The system chooses; the user can overrule with "Think it through".
- No memory buried in settings. Memory is a first-class screen with strength, last use and the answers it shaped.

## Our first idea, roasted
- **v0: a three-lane "brain map" diagram on every answer.** Too heavy; after the tenth answer nobody reads it.
  **v1:** a one-line path chip on every answer ("Recall · 0.8 s · $0.0004 · saved 99%"), expandable into the full
  path only when someone asks why.
- **v0: savings as a big green number.** Reads like a growth dashboard and invites distrust. **v1:** the saving
  next to its baseline, with the share of work on each path, and the escalations listed (where it was not good
  enough).
- **v0: habits learned silently.** Creepy and risky. **v1:** habits are proposed with evidence ("you asked this six
  times, Reason gave the same structure each time"), approved by a person, and can be paused.
- **v0: fast path answers without caveats.** A fast wrong answer is worse than a slow right one. **v1:** each fast
  answer states its confidence and the memories it used; under the threshold it escalates by itself and says so.
- **v0: sleep as a cute moon animation.** **v1:** a plain morning report: what was merged, what faded, what needs a
  decision.

## What the prototype must prove
1. A person understands in five seconds why this AI is cheaper: the work goes down the cheapest good-enough path.
2. They can see and steer that path (escalate, correct, make a habit, set the budget).
3. Each surface has its own job, and all three feel like the same product.

## Improvements after the screen roast
- Hero headline cut to two lines; "saved 100%" replaced by "saved 99.x%" so no figure claims perfection.
- Icon cards on the overview replaced by a large-type list of surfaces; hairline rules removed; small text raised to 13px.
- Task detail no longer opens on an empty hero: the answer and "How it got here" share the first screen.
- Tables scroll inside their own box on phones; the task list shows only the time on phones.
- Rail keeps its one amber selection line through the tooltip wrapper.
- Inspector (app mode, mono allowed as the style's face): 0 fails on every screen. Defended warnings: light ink on dark ground, one Red Hat superfamily in three cuts, no footage (no honest clip reachable).

## Second UI roast (small details)
- Bug: the escalated task T-2177 read "Recall, then Recall"; it now ends on Reason, and its steps no longer repeat the same text.
- Bug: opening one task after another kept a stale "Recall" step (duplicate list keys); keys are unique now.
- "Saved −77%" read as a loss; it shows 77% with "$7.25 less".
- Disabled Send no longer looks like a muddy primary button; the keyboard hint hides on phones where it was cut off.
- Dead buttons wired up: mobile "Think it through", attach and camera say plainly they are outside the prototype.
- Mobile report lets you settle the memory conflict; the habit count on mobile Today follows approvals.
- Table headers no longer run together ("Last usedSource", "SavedState"); pinned memories show a filled amber pin.
- Habit proposals say "Saves a month" instead of a minus sign; "Keep thinking" became "Not now".
- Settings forecast for Balanced now matches what the month really cost; month names are fixed three-letter forms.
- Header budget links to Settings; the Spend chart scrolls on phones instead of shrinking to unreadable.
- Overview calculator gained team presets; the "Measured, not imagined" text column stays in view beside its photos.
