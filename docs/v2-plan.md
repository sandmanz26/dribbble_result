# Rimba v2 → Osier: plan, research and three roasts

v1 stays at `/project18/`. v2 is a separate page at `/project18/v2/` with its own code and photos.

## Owner feedback on v1
1. Must be **fine dining**, and a **Western** restaurant.
2. Scroll interaction not good enough.
3. Hero image weak.
4. Font not minimalist (Instrument Sans condensed).
5. Minimalist, but the visitor must feel the right ambience.
6. Up to 20 generated images.
7. Research was too thin: learn from famous dining websites.

## Research: 15 fine-dining sites, visited and screenshotted (Nov 2026)
Eleven Madison Park, Noma, Alinea, Le Bernardin, SingleThread, L'Enclume, Geranium, Mirazur,
Osteria Francescana, Ynyshir, Atelier Crenn, Septime, The Fat Duck, Atomix, Lyle's (JKS).
The French Laundry, Core and Frantzén did not load (blocked or offline).

What the best of them have in common:
| Pattern | Seen at | What it teaches |
|---|---|---|
| One full-bleed image or film, almost no text | Mirazur, Osteria Francescana, Atelier Crenn, Ynyshir | The hero is a mood, not a pitch. A wordmark and one action |
| Booking at the very top, inline | Ynyshir (party, date, time in the hero), Noma ("Book a table"), Fat Duck | Fine-dining guests come to book; the action is never more than a glance away |
| Very few sections, lots of space | EMP, Le Bernardin, Septime, Alinea | Restraint signals confidence. Five or six sections, not ten |
| One quiet type family, light weights, small tracked caps for labels | Le Bernardin (Helvetica Neue Light and Thin), L'Enclume (Maison Neue), EMP (Inter Tight + serif) | Minimal means small, light, well-spaced type, not big condensed headlines |
| Dark, theatrical ground for the evening | Ynyshir (black velvet curtain film), Atelier Crenn (dish in darkness) | Ambience comes from darkness and one source of light |
| Menu as a typographic list with prices | Septime, Fat Duck | The menu is text, read slowly; no cards, no icons |
| Practical facts stated plainly | Ynyshir (price per person, no substitutions), SingleThread (release dates) | Fine-dining guests want the rules before they book |

What they get wrong (and v2 avoids): cookie walls and newsletter pop-ups covering the page
(Noma, SingleThread, Osteria), reservations hidden behind third-party buttons with no context
(Le Bernardin), and pages that are only a hero with nothing to read (Le Bernardin, Atomix).

## Plan A (first draft)
- Restaurant: Osier, modern British tasting menu, 24 seats, Marylebone, London. Sample content.
- Hero: black velvet curtains that part on scroll to reveal the dining room (after Ynyshir).
- Sections: hero, story, chef, six courses, full menu, the room, wine, reviews, press, booking,
  visit, footer.
- Type: Hanken Grotesk, light display at large sizes.
- Light and dark themes.

### Roast 1
- The curtain is theatre, not minimalism, and it hides the first thing a guest should see.
  It also delays the largest paint. **Cut.** The hero is the room itself, still and lit by candles.
- Twelve sections is a v1 habit. The research says five or six. **Merge** story and chef; merge
  wine into the room; **drop press** (any press quote would be invented).
- Huge light display type fights the "minimal" brief; the best sites set headings small.
  **Headings at 28 to 56px, light weight; the photos carry the scale.**
- A light theme kills the ambience the owner asked for. **Dark only**, stated as a brand choice.

## Plan B
- Hero: full-bleed dining room at blue hour, wordmark centered small and tracked, one line,
  one action. On scroll the image slowly settles (scale 1.08 to 1) and the wordmark lifts.
  A booking bar (guests, date, time) sits at the bottom of the hero, then docks to the bottom of
  the screen as a slim pill after the hero.
- Story: one paragraph by the chef, lines rise from behind a mask as they enter, with a portrait.
- Signature: six courses, each a full-bleed photograph revealed through a horizontal slit that
  opens from the center line, like eyes adjusting to candlelight. Name and one line of text.
- Menu: the full tasting menu as a quiet list with the price and wine pairing.
- The room: three spaces as a sticky stack (dining room, chef's table, cellar), each card scaling
  back as the next arrives.
- Booking, then visit and footer.

### Roast 2
- Six full-bleed course images will only feel like one sequence if they share one set: same
  plate, same linen, same light, same angle. **Write one prompt template and change only the food.**
- The slit reveal on all six can feel mechanical. **Alternate the timing slightly and let the
  outgoing image darken and scale back, so it reads as light moving, not a wipe.**
- A docked booking bar plus a nav "Reserve" plus a section "Reserve" is three of the same intent.
  Fine: one label, "Reserve", everywhere (taste rule: one label per intent).
- Reviews: fine-dining sites rarely show them, but the brief asks for them. **Two short guest
  words, small, in one quiet section, marked as sample in the footer.**
- Ordering: the brief says "reservations or place orders". For fine dining the honest version is
  **gift experiences**, not takeaway. One line in the visit section; no drawer.

## Plan C (to build)
1. **Hero** (100svh + 60vh scroll): candlelit dining room, wordmark OSIER, one line, Reserve.
   Scroll: image settles and dims slightly, wordmark letters drift apart and fade. Booking bar at
   the hero's foot docks into a pill.
2. **Story**: "Twenty-four seats, one menu, one sitting a night." Chef's paragraph with masked
   line reveal, portrait plating with tweezers, parallax at two speeds.
3. **Six courses** (pinned, 6 x 100vh): slit reveal from the center; outgoing photo dims and
   scales back; course name, one line, and a thin progress counter in words.
4. **The menu**: the full list in two columns (dishes, pairing), price per person, notes on
   dietary changes and timing. Static and calm after the pinned scene.
5. **The room**: sticky stack of three: dining room, chef's table, cellar.
6. **Guests**: two short quotes over a slow candle detail.
7. **Reserve**: guests, date, time, then two fields, confirmation, calendar file.
8. **Visit + footer**: address, hours, dress, gift experiences, link back to version 1.

### Roast 3 (final pass before building)
- Type: Hanken Grotesk Light at body sizes on near-black can thin out. **Body 400 at 17px, light
  300 only at 28px and above; labels 500 at 12px with 0.14em tracking.**
- Eyebrow budget: 8 sections allows 3 small labels. Use them only on Story, Menu and Reserve.
- Mobile: the slit scene works on phones because images are full-bleed; the sticky stack becomes
  a plain stack below 700px. The booking pill becomes a bottom bar.
- Reduced motion: no smooth scroll, no pins; courses render as a list.
- Accent: none. Ink and photographs only; the CTA is off-white on near-black. Zero accent is
  the most fine-dining choice and the cleanest answer to "minimal".

## Image plan (max 20)
Hero dining room; chef plating; six courses on one set; chef's table; cellar; private room;
wine pour; candle detail; townhouse at night; produce. 16 images, 4 spare for retakes.

## Built, then roasted with screenshots (desktop, phone, booking flow)
| Finding | Change |
|---|---|
| Lines in the story and quotes broke in odd places ("made to be / eaten slowly") | The splitter measured words as inline blocks without their spaces, and before the web font loaded. It now measures plain inline words after `document.fonts.ready` |
| Course text changed a beat after the slit had opened | Text switches as the new course is half open |
| The Reserve dock covered the last menu row and the course rail | Moved to the bottom right, and it steps out during the six courses |
| Wine pairings on phones sat far below their dish | Tighter row gap on small screens |

Generated 15 of the 20 allowed images (5 kept for retakes), all on one set for the courses.
