# ExamAce: strategy, research and design notes

Dribbble brief "User Design" ($5,000, within the next few weeks). The client is ExamAce (examace.co.uk), an AI-powered A-Level revision
platform for Business, Economics, Psychology and Sociology. It is live and built in Lovable, which the client wants to keep.
Their goals are a simpler homepage, an easier sign-up, and a clear route from landing page to first lesson to first marked answer.
Engagement on the free taster lessons is low.

The brief has three stages, and this prototype answers all three:

1. A UX audit walked as a student, a parent and a teacher (`#/audit`). This is the paid first job.
2. The marketing site and design system:
   - user flows and wireframes (`#/flows`)
   - homepage, sign-up, taster lesson, pricing and team (`#/`, `#/start`, `#/taster/economics`, `#/pricing`, `#/team`)
   - the design system with a Lovable handoff (`#/system`)
3. The dashboards: student, parent and teacher, plus the lesson experience (`#/app`, `#/app/lesson`, `#/parent`, `#/teacher`, `#/teacher/review`).

Roles taken for this work: head of design, head of creative, head of product and education consultant.

## 1. What the live site does today (22 Nov 2026)

There are 14 findings, ordered by priority, in `src/data/audit.js`. They are shown with screenshots of the live site at `#/audit`.
The four P1 findings explain the low taster engagement:

- **Taster links hit a sign-in wall.** Every "Try free lessons, no account needed" link goes to `/learn`, which redirects to the sign-in page.
- **The taster ends at a paywall.** The exam questions at the end of the free lesson are locked ("Subscribe to Economics… from £7.99/month"). This is exactly where a marked answer would win the student over.
- **The free marking demo starts blank.** The student has to bring their own question (up to 150 words) and their own answer (up to 400 words).
- **The phone homepage is broken.** The headline and the button run off the screen at 390px, and the cookie banner covers a third of it.

The route today takes eight steps and ends at a paywall. The proposed route takes six steps, needs no account and takes about ten minutes.

## 2. Research: what to take from the best education products

Products studied: Up Learn, Seneca, Save My Exams (Smart Mark), Atom Learning, Duolingo, Brilliant, Khan Academy (Khanmigo), Quizlet,
tutor2u Examiner AI, EconAStar, Physics & Maths Tutor and Oak National. We took their strategy only. Their interfaces were not copied.

### Strategies taken

| Strategy | From | Where it is in the prototype |
|---|---|---|
| Value before an account; ask for sign-up at "save" | Duolingo (moving sign-up later lifted daily users by about 20%), Oak, PMT | The taster needs nothing; "Save my mark and carry on" leads to sign-up |
| The first marked answer is the aha moment | EconAStar "first essay free", tutor2u "try free" | The taster ends on a 9-mark question with its mark |
| Ask only for subject, board and exam year | Seneca, Atom | `#/start`: role first, then subjects, board and exam year, then email |
| Show level, mark, AO breakdown, then "how to reach the next level" | tutor2u AO breakdown, AQA level grids | Result screen: Level, mark, AO bars, margin codes, one next step |
| Retry the same question after feedback | Save My Exams Smart Mark | "Rewrite with this step", with the change in marks shown (for example 5/9 to 8/9) |
| Free parent account linked to the child | Seneca, Atom Track, Khanmigo parents | `#/parent`: time, levels, one thing worth asking, and sharing chosen by the student |
| Teachers stay in control of AI marks | tutor2u (formative, alongside human judgement) | `#/teacher/review`: least-sure marks first, AO steppers, release |
| Tutor after a mistake, not in a separate chat tab | Khan's own lesson from Khanmigo | "Ask the tutor" on the result screen: "Why did I lose marks?" |
| Say plainly what AI marking is | tutor2u, EconAStar | Copy: "a guide to your level, not a grade"; "not affiliated with any exam board" |
| Clear prices, one way everywhere | The opposite of Save My Exams' hidden pricing | Receipt: per subject, adds up the subjects chosen |

### Anti-patterns avoided

- Clawing back free features (Quizlet, Seneca)
- Upgrade nags in the student's flow
- A sign-up wall and a paywall before any value (Brilliant teardown)
- A tutor that refuses to help
- Generic AI comments: every comment points to a sentence the student wrote and to an AO
- Unqualified outcome claims such as "C to A in two months"

### Domain facts used in the mock data

- **Assessment objectives.** Economics and Business use AO1 to AO4. Psychology and Sociology use AO1 to AO3.
- **AQA 25-mark levels.** Level 5 is 21 to 25, Level 4 is 16 to 20 and Level 3 is 11 to 15.
- **2027 exam dates (provisional).** Exams start the week of 10 May 2027 and results day is Thursday 12 August 2027.
- **Mark splits.** The taster question uses a 9-mark split of AO1 3, AO2 2 and AO3 4. This is a sample split written for the prototype; an examiner on the client's team should confirm it.

## 3. Head of product: the decisions

- **One route, one action.** Every marketing screen has one filled button, "Mark my first answer", and it leads to the taster.
- **Account after value.** There is no password anywhere: sign-in is by an emailed link. The student is asked "How did you hear about us" after week one, not at sign-up.
- **Parents are a free view.** They see time, levels and a conversation prompt. They do not see essays unless the student shares one. The parent is usually the payer, so the parent view is the retention tool.
- **Teachers.** The AI marks first and the teacher checks the uncertain marks before release. Class weakness is shown by AO, with a one-click drill for the students who stopped at Level 3.
- **Pricing.** The real prices are kept (Core £9.99, Ace It £12.99, Complete £20.99, per subject, per month). Each plan's first line now says what it is for.
  - Open business question for the client: the lessons the taster sells are only in Complete. Test putting lessons in every plan, or a pass that runs to the last exam (Up Learn's model).
- **What to measure.** Seven funnel numbers are listed at `#/audit`, from lesson start rate to paid conversion by route.

## 4. Design direction (taste-skill)

The direction was dealt by taste-skill as "Dressed as something else" (seed 525314963).

- **Type.** Redrawn because Archivo is already used by NuBrakes. Cabinet Grotesk is now the only family, self-hosted.
- **Palette.** Redrawn because warm black and gold is project9's look and also the client's current navy and gold. The new palette is "Oxblood and grey".
- **The borrowed category is the sports club.** Exam season is the fixture list and the paper is match day. That gives the headline "Train for the paper." and a club palette of claret and grey.
- **The idea.** On this page the examiner's red pen in the margin of a script becomes the page's only colour and its annotation layer. Red always means marks: margin codes (K, APP, AN, EV, ?), AO bars with one cell per mark, and the one action.
- **The live thing.** On the homepage, pick one of three answers to the same question and watch the margin codes and the mark change. In the taster, write your own answer and get it marked.
- **Photography.** Ten documentary photographs were generated with Higgsfield in one style (35mm, muted) and shown in greyscale, so oxblood stays the only colour. An eleventh shows a petrol station for the worked example. 8.25 credits were used in total.
- **Icons.** Basil Icons (CC BY 4.0), extracted at build time to `src/ui/icons.js`.

## 5. Roast log

### Round 1: homepage, via the taste-skill inspector, then screenshots at 1440, 768 and 390

| Problem | Fix |
|---|---|
| Headline "Written by people who mark the real thing" ran to 3 lines | "Written by examiners" |
| Families photos overlapped their text on phones | Photos moved into their own frames above the text, with the heading above the panels |
| Blank stretches of 400 to 500px | Section gap cut to 96 to 160px, reply section shortened, footer tightened |
| Nav showed every hash link as active | Hash links use plain links |
| Prototype button covered the hero call to action | Moved to a vertical tab on the right edge |
| Receipt read as an eyebrow | Plan inclusions moved under the total |

### Round 2: flow and app screens

| Problem | Fix |
|---|---|
| AO bars stretched across the result card | Bar no longer stretched |
| Taster opened already scrolled | No scroll on first load |
| Phone ledgers scrolled sideways | AO columns hidden on phones, mark kept |
| Muted text was 4.4:1 | Darkened to pass AA |
| Lesson had no picture and no first-screen action | Petrol station photo; "I know this, go to the question" in the header |

### Remaining warnings, defended

- The four route cards are the blueprint's single product card shown at four stages.
- There is no video, because no honest clip exists. Generating one would spend credits on decoration.
- 19 type sizes are counted, because the app fragments (cards, ledgers) are counted with the page.
- The lesson and the sign-up have fewer than four photos, because they are working screens.

## 6. Sample content to confirm with the client

- All student, parent and teacher names, the school (Riverside Sixth Form) and every mark are samples.
- Extract A figures (140p, about 53p duty, PED −0.2 short run and −0.6 long run) are sample figures labelled as such on screen.
- The 9-mark AO split and the level descriptors on the taster need sign-off from the examiners.
- The prototype marker in `src/data/marker.js` is rule-based. It stands in for the live AI so the route can be clicked end to end.
- Team bios and quotes are the client's own, from examace.co.uk. Portraits are to come from the client; initials stand in until then.
- The parent view, the teacher confidence queue and the drill are proposals. They are new features, not existing ones.

### Round 3: owner asked for tidier UI, smoother UX, and every brief item done properly (23 Nov 2026)

Brief check:

| Brief item | Before this round | Now |
|---|---|---|
| UX audit as a short, prioritised list | 14 findings | A "Fix these five first" list added at the top, each with its effort in Lovable and who it helps |
| User flows | Missing | `#/flows`: student, parent and teacher flows, with each choice point and the moment that matters |
| Wireframes | Missing | `#/flows`: lo-fi wireframes of homepage, taster, sign-up, pricing and team, with the reasoning, linked to the final screens |
| Design system: colours, type, components, navigation | Done | Unchanged |
| Retain Lovable | Not addressed | `#/system` "Keep it in Lovable": shadcn CSS variables, a Tailwind extension, a component map to shadcn, and a four-week rollout |
| Dashboards and lesson experience from the same system | Done | The in-app lesson now has the tutor beside the examiner's note; the result offers "Back to Today"; the new mark appears as the first row of the ledger |

UX smoothing:

- **Answer drafting.** The draft answer is saved as you type. Ctrl or Cmd + Enter marks it. There is an optional exam timer (11 minutes).
- **Steps.** Finished steps can be clicked to go back, and each step change scrolls smoothly to the top.
- **Sign-up.** Email is checked inline, with a plain message.
- **Subject links.** Each subject's free-lesson link opens that subject and explains honestly that Economics is the built example.
- **Page changes.** Pages fade in on a route change.
- **Entrances.** Section entrances now trigger per element, including elements jumped past by anchor links. Before, tall sections could stay hidden.

UI tidying:

- **Subjects card.** The card was squeezed by its section, so the exam-hall photo covered the Economics row. Photos now carry their own aspect ratio.
- **Reply section.** The reply card no longer hangs over the footer seam.
- **Route section.** The fields and cards are larger.
- **Examiners panel.** It is shorter.
- **Lesson bar on phones.** It is shortened.
- **Spec numbering.** It is aligned to A-Level AQA 4.1.3.2.
