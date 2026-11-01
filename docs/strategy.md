# Rolling: strategy, design decisions and roast log

Dribbble brief: "Film & TV Mobile App UI/UX Design". Budget $2,000, timeline a month or more.
The brief asks for a mobile app for the film and TV industry, minimalist, playful and professional,
for industry professionals and creatives alike, with user flows, wireframes and high-fidelity mockups
for the core functions and the brand. The brief does not name the core functions, so this prototype
proposes them.

"Rolling" is a placeholder name.

## 1. Problem

Freelance crew and creatives (most of the industry) run their working life across five places:
a PDF call sheet in email, WhatsApp threads with heads of department, a paper or phone diary of
"pencils", a crew directory or job board, and a CV or credits page. Production does the opposite side
of the same work in spreadsheets and phone calls.

Three questions come up every day:
1. Where do I need to be tomorrow, when, and what are we shooting? (the call sheet)
2. Which productions are holding which of my dates? (avails and pencils)
3. Who is this job with, and have I worked with them? (the network)

## 2. Competitor frame

| Product | What it does well | Gap this design answers |
|---|---|---|
| StudioBinder, Movie Magic, Yamdu | Production-side scheduling, stripboards and call sheets | Built for the production office on a laptop. Crew receive a PDF |
| SetHero, call sheet apps | Mobile call sheets with confirmations | Stops at the day. No diary, no next job |
| ProductionHUB, Staff Me Up, Mandy, The Talent Manager | Job boards and crew profiles | No idea of the person's diary, so every listing asks "are you free?" |
| Stage 32, Backstage | Networking, casting | Social feed first, not the working day |
| Phone calendar and WhatsApp | What crew actually use for pencils | No ranks (1st, 2nd pencil), no challenge, no expiry |

The opening: one app that joins the call sheet, the diary of holds and the job list, so a call can say
"Fits your diary" or "Clashes with Saltmarsh" before anyone asks.

## 3. Users

- **Crew** (gaffer, camera, grip, art, sound): need tomorrow's call, location safety details, and work
  that fits their dates. Persona: Mara, a gaffer on a feature.
- **Cast and creatives** (actors, directors, editors): same diary and network, different credits.
  Covered by onboarding and the same screens; not built out separately.
- **Production** (producers, line producers, ADs): crew up a show and see who is free. Persona: Kofi,
  line producer.

## 4. Information architecture

Crew: Today (call sheet), Calls (jobs), Avails (diary of holds), Inbox, Me (profile, reel, credits, rate).
Production: Today (with arrivals), Crew up (roles by department, replies ranked by fit), Inbox, Me.

## 5. UX decisions

- **The call time is the screen.** Before call, the first thing is your own call time (not the unit call),
  how long until it, and two actions: directions to the unit base, and "Running late", which tells the
  one person who needs to know (the 2nd AD) in two taps.
- **Safety is not buried.** The nearest A&E sits in the location card, set apart, as on a paper call sheet.
- **The stripboard stays a stripboard.** Scenes keep the industry colour code (day interior white, day
  exterior yellow, night interior blue), scene numbers, page eighths and cast numbers. These colours are
  data, not brand.
- **The day changes the screen.** Before call, rolling (live scene, pages shot, next job for my
  department) and wrapped (hours, overtime, turnaround and the earliest legal call tomorrow, timesheet).
- **Pencils are real objects.** 1st and 2nd pencil, expiry, release, and the challenge: a 2nd pencil that
  wants to book can challenge the 1st, who gets 24 hours to confirm or let go. Nobody else models this.
- **Calls know your diary.** Each call says whether it fits, clashes (and that you can still offer as 2nd
  pencil) or already holds you. The list sorts fitting work first.
- **"Offer my avails", not "Apply".** It is how crew talk, and it is honest: nothing is booked until
  production confirms.
- **Production ranks replies by fit, not speed.** Free for every date first, then people who have worked
  with the heads of department.
- **Rate privacy.** A day rate shows only to productions you have worked with, or to nobody.

## 6. Brand and visual language (version 1, replaced, see section 9)

- Minimal: warm paper ground like a printed call sheet, ink type, white cards, one dark card for the call.
- Playful: one chroma-key green (#00b140, the green screen) as the only accent, used for "go" actions,
  the live dot, 1st pencils and what fits. Rounded geometry (24/16/12 radius, pill buttons). Insider
  language with a tap-to-explain: "Abby Singer" (second to last shot) and "Martini shot" (last shot).
- Professional: Gabarito for headings, Golos Text for reading, Azeret Mono for every time, page count
  and rate, so numbers line up like a call sheet. Boxicons for icons.
- Photography: 27 Unsplash photos (sets, locations, portraits), all graded with one look in
  `public/photos/` (lifted blacks, warm mids, saturation down) so they read as one shoot. Credits at
  `#/credits` and in `src/data/credits.json`.
- Light and dark themes, system default, switchable.

## 7. Roast log

Round 1 (screenshots at 390 px, light):
1. "06 : 30" in the mono font had a wide colon. Fixed: colon tightened and set in the accent.
2. "Running late" wrapped to two lines. Fixed: no wrap, tighter padding.
3. Strip header read "INT Harbour warehouse DAY" with bold words at both ends. Fixed: one "INT/DAY" tag.
4. Wrapped day showed five struck-through scenes. Fixed: one summary line, notes hidden after wrap.
5. Wrap facts in four columns were cramped. Fixed: two by two.
6. Calendar booked days were heavy black tiles. Fixed: light tile with an ink bar, pencils stay readable.
7. Hold cards squeezed text beside the Release button. Fixed: button moved under the text.
8. "Get started" had the arrow before the label. Fixed: arrow after.
9. Crew up said "Free, Free all dates" and an editor replied to a gaffer call. Fixed copy and data.
10. Open-role circle had a double border. Fixed.
11. Chips, segmented control and the "Martini shot" tag were under 44 px. Fixed (44 px, tag 32 px inline).
12. Tablet (760 to 959 px) showed a stretched phone layout. Fixed: phone frame with the panel under it.

Round 2 (light, dark, tablet, desktop): call buttons stacked inside the framed phone. Fixed by
tightening padding. Saved state that is broken or old now falls back to the seed instead of crashing.

Checked with ui-ux-pro-max's pre-delivery checklist: no emoji icons, one icon family, 44 px targets,
visible focus rings, reduced motion respected, contrast tokens per theme, scrim at 45%.

## 8. Not done yet

- Higgsfield image generation was offered (10 credits) but the connector was not authorised in this
  session, so no images were generated. Unsplash covered every slot. If generated images are wanted later,
  good slots are: the welcome image and the five production stills (fictional productions should not use
  real set photos long term).
- Cast and creative versions of Today and Me, messaging threads, document uploads (contracts, deal memos),
  real maps.

## 9. Version 2: redesign after owner feedback

Owner, after seeing version 1: it still reads as AI slop; wants a more creative, unique layout and
interaction, researched on Dribbble and other creative platforms.

### Research (Dribbble, 1 Nov 2026)
Searches: film production app, film mobile app, cinema app, film festival app, editorial mobile app,
experimental mobile UI, brutalist mobile app, video editor app, timeline interaction. About 190 shots
scanned, 28 kept on a reference board. What separated the memorable shots from the rest:
- Type as the layout: huge condensed words (festival identities such as IFX "Artists Films About",
  the ATTN app "Ready to notice?"), not small headings over cards.
- Data-terminal precision: hairline rules, mono readouts, timecodes (brutalist weather "command
  center", Stark Weather), tables instead of cards.
- Poster thinking: full-bleed photo plus a billing block (film festival and production-company work).
- Tools that feel like tools: editors with a scrubbable timeline and a fixed playhead.

What version 1 shared with the forgettable majority (most cinema and streaming app shots): stacked
white rounded cards with soft shadows, pill chips, a floating pill tab bar, a friendly geometric sans,
and one success-green used like a fintech app. That is the "AI slop" read.

### Concept: a call sheet set like a poster
- Square corners, hairline and 2 px ink rules, numbered sections in a left rail like call-sheet rows.
- Sofia Sans Extra Condensed for display (huge, uppercase), Sofia Sans for reading, Azeret Mono for
  every time, page count, rate and label. Fonts not used in any other project.
- Chroma-key green as solid blocks (a challenge, an urgent message, the scene now rolling), never as a
  soft tint. Ink bar for safety (nearest A&E).
- Photos shown as on a camera monitor: corner frame lines and a burn-in label (clip, location).

### Signature interactions
1. **The day as an edit timeline.** Under the call time, the whole shoot day sits on a timeline with a
   fixed green playhead. Drag the day (touch, mouse or arrow keys) and the readout says what happens at
   that time: scene, set, cast, lunch, daylight left. Done scenes fade, the rolling one turns green.
2. **Calls as a deck of one-sheets.** Swipe through posters (photo, huge role, billing facts); cards
   settle as they snap (scroll-driven animation where supported). Flip a poster to see the billing block
   of who is already on the crew. A list view is one tap away.
3. **Avails as a stripboard over the diary.** Each hold is a strip across its days: ink for booked,
   green for 1st pencil, hatched for 2nd pencil, hatched green while a challenge runs.
4. **Hold to confirm.** Anything that tells someone else something (challenge, offer avails, book crew)
   is press and hold, so a slip of the thumb never sends it. Works with Enter or Space held.
5. **Profile ends in an end-credits crawl** that rolls and pauses on hover, focus or the Pause button.
6. Route changes cut with a short wipe; the tab bar is a slate strip with a tally light on the live tab.

### Roast of version 2
- Timeline rendered blank: flex and grid children grew to the track width. Fixed with min-width 0.
- Done and rolling scenes looked the same on the timeline. Fixed: done fades, now is green.
- Tab bar turned light in dark mode. Fixed: the slate stays black in both themes.
- Unit labels and pins collided on the timeline. Fixed: block labels sit at the bottom, pins at the top.
- Checked: a short tap on a hold button does nothing, a full hold sends; keyboard scrub moves 15 min.

