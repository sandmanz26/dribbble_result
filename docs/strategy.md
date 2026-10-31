# Rimba: strategy, scroll design and roast

## Design read
Landing page for a destination restaurant, for travellers deciding where to spend one evening
in Ubud. Dark, warm, photographic; the page should feel like arriving at dusk. Dials: variance 7,
motion 7, density 3.

## What the research said
- Menus as PDFs or images are the most cited reason restaurant sites lose people on phones.
  Here the menu is HTML, tabbed, with prices and dietary marks, and a PDF only as an extra.
- Reservation entry points must be high-contrast, above the fold, and sticky on mobile; every
  extra field costs completions. Here: one label everywhere ("Book a table"), a sticky bar on
  phones that steps aside at the form, and two fields only (name, phone).
- Hours, address, click-to-call and maps should be easy to find. Here: a Visit section with all
  of it, plus the nav link.
- Award-listed restaurant sites (Genesis, Völlerei, Bar.on) tell the evening as chapters. That
  became the structure: arrive, the story, the courses, the menu, the room, guests, book, visit.

## The scroll, section by section
| Section | Motion | Why |
|---|---|---|
| Hero | The full-bleed room shrinks into a framed window, headline lifts away | Moves you from atmosphere to story without a hard cut |
| Story | Words light up at reading pace, photos drift at two speeds | Makes a long sentence feel read, not skimmed |
| The evening | One plate position; each course turns in and the last turns away; text, origin and rail follow the plate | The signature dish moment the brief asks for, as the meal unfolds |
| Menu | Items list in on tab change; the photo on the right follows hover and focus | Lets the food sell the menu without a carousel |
| The room | Vertical scroll walks sideways through five spaces, entrance first | Shows where you could sit, which is a booking choice |
| Reviews | Quotes rise in at different speeds over slow embers | Calm proof before the ask |
| Book | Photo settles as the form arrives | The ask, with nothing competing |

## Roast (round 1) and what changed
| Finding | Change |
|---|---|
| Course text was one step behind the plate (scrub keeps easing after the wheel stops, and the scroll callback had stopped) | Text now follows the timeline itself; plate i lands at time i |
| Hero headline lingered as a ghost over the shrinking photo | Fades in the first 30% of the scene |
| Nav text vanished over the light ground once the hero framed | Nav turns solid after 24px |
| Booking panel overflowed: the date strip widened the grid and pushed the guest stepper off screen | min-width 0 on the panel and its grid children |
| Phone placeholder looked like a filled value | Placeholder says what to enter |
| A review score "4.8 from 1,240 reviews" was invented proof | Removed; reviews are marked as sample content in the footer |
| On phones the hero second button hid under the booking bar, and Book a table showed twice | Hero copy lifted, nav button hidden on phones, bar hides at the form |
| Plate cropped and rail hidden on phones | Smaller plate, padded scene |
| Add to calendar did nothing | Downloads a real .ics |
| Reduced-motion list read "From The garden" and "overnight.." | Fixed copy |

Open: Figma file from the same tokens (brief deliverable), real photos and menu from the client.
