# Tend: strategy notes

The competitor report (ten apps, strengths and weaknesses of each, sources) is `docs/research.pdf`.
Every design decision with what we saw, what we did and why is in `docs/design-decisions.md`
and on the design system page.

## Read
Mobile-first wellness app. A short check-in becomes a personalised ritual of breathwork,
meditation and herbal guidance. Scope: conversational intake, onboarding, profile, ritual,
dashboard, breath and meditation players, herbal protocol, journal. Milestone one: design
system plus three core screens (check-in, ritual, breath player).

## Competitor frame
Headspace, Calm, Balance, Insight Timer (meditation), Othership, Breathwrk and Open (breathwork),
Stoic (journal), HealisticMD and Herbal Natural Care (herbal). Gaps: every leader is a library first;
personalisation is set at onboarding, not per day; modalities live in separate apps; herbal apps
do not check a herb against the person's profile or show evidence and source together.

## Decisions
- Each day is a cyanotype: the weather from the check-in sets the depth of one Prussian blue,
  and the day's herb is printed on it as a white silhouette. Two weeks become a row of prints;
  the journal files each line beside its print.
- Mood as weather (bright, steady, heavy, stormy, tired): quicker and more honest than a scale.
- Check-in: one question per screen under today's print, which develops as you answer.
- The ritual is a dated label; each step explains itself ("Why this?") from the check-in answers.
- Herbs are checked against health flags before they are shown; clashes are swapped and explained.
- Herbal protocol: the plant's own print and Latin name, then a label with amount, steep, when,
  how often, cautions, evidence in words, source.
- Breath player as a tide of light on today's print; the sit on the night print with a filling moon.
- The tea steeps while you sit, so it adds no time.
- No streaks or red: missed days are empty frames.

## Design system
Paper, ink and one Prussian blue in five exposures. Besley (a Clarendon, the face of old chemists'
labels) for what Tend says, Hanken Grotesk for what you read and tap, a single 6 px corner.
Heroicons outline. The full log is in `docs/design-decisions.md` and on `#/system`.

## States
Empty journal, unanswered check-in, ritual not started, in progress and complete, players idle,
running, paused and finished, steep timer, herb swapped, profile clash warnings, light and dark,
morning and evening, reduced motion.
