# Tend: strategy notes

The full research report with competitor table, findings and sources is `docs/research.pdf`.

## Read
Mobile-first wellness app. A short check-in becomes a personalised ritual of breathwork,
meditation and herbal guidance. Scope: conversational intake, onboarding, profile, ritual,
dashboard, breath and meditation players, herbal protocol, journal. Milestone one: design
system plus three core screens (check-in, ritual, breath player).

## Competitor frame
Headspace, Calm, Balance, Insight Timer (meditation), Othership and Breathwrk (breathwork),
HealisticMD and Herbal Natural Care (herbal). Gaps: every leader is a library first;
personalisation is set at onboarding, not per day; modalities live in separate apps; herbal apps
do not check a herb against the person's profile or show evidence and source together.

## Decisions
- Mood as weather (bright, steady, heavy, stormy, tired): quicker and more honest than a scale.
- Check-in as a conversation, one tap per question, five questions.
- The ritual explains each step ("Why this?") from the check-in answers.
- Herbs are checked against health flags before they are shown; clashes are swapped and explained.
- Apothecary label for the herbal protocol: Latin name, part, preparation, amount, steep, when,
  how often, cautions, evidence in words, source.
- Breath player as a tide; meditation player as a filling moon with rain or hum made in the browser.
- The tea steeps while you sit, so it adds no time.
- No streaks or red: missed days are blank.
- Colour means place: sky, sage, clay, night, paper fields; one teal accent for the next action.

## Design system
taste-skill app style "editorial greeting" (serif greeting as h1, regular-weight figures on tonal
panels), with its face from the brief: one calm field per practice, and the home turning to night
after dark. Instrument Serif and Sans. Heroicons.

## States
Empty journal, unanswered check-in, ritual not started, in progress and complete, players idle,
running, paused and finished, steep timer, herb swapped, profile clash warnings, light and dark,
morning and evening, reduced motion.
