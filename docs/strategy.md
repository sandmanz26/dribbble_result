# Kartenregal TCG: review and redesign prototype

Dribbble brief "Swiss TCG Card Shop Website Design" ($300, within days). The owner built kartenregal.ch
with AI assistance and wants a designer's view: what works, what feels generic, and better layout,
typography, spacing and hierarchy. Keep the three brand colours (lightness and saturation may move,
green must stay green). Start with a review, then revised designs; desktop and mobile usability matter.
Preferred deliverable: an editable Figma file with desktop and mobile layouts, components and
interaction notes. The proposal must include two specific observations about the current site.

This prototype is the review plus the revised design, built in React so every interaction can be
tried. Routes `#/review` and `#/system` (English) are the written deliverables for the client.

## 1. What the shop is (kartenregal.ch, 3 Nov 2026)
- Shopify shop, German (Swiss), CHF. Pokémon only, 14 products: 4 boosters, 8 bundles and boxes
  (one sold out), 2 single cards. Independent seller from Wetzikon ZH.
- Navigation as a shelf: 01 Neu, 02 Booster, 03 Bundles & Boxen, 04 Einzelkarten, 05 Abholung.
  "2 im Fach", "Letztes Stück", "Ganzes Fach", breadcrumb "Regal / Fach 03".
- Promise: "Genau dieses Exemplar": photos of the exact copy, manufacturer images marked.
  Pitch Black ETB has two physical copies photographed separately, both with side damage.
- Shipping (policy page): 1 to 2 boosters B-Post letter CHF 2, 3 to 6 CHF 4, boxes or 7+ parcel CHF 9,
  singles under CHF 50 letter in sleeve and toploader, from CHF 50 registered. Ships within 3 working
  days of payment. Switzerland only. Free pickup in Wetzikon, appointment by email after ordering.
- Pay: TWINT, card, Apple Pay, Google Pay. 14 days to report a problem, return at the shop's cost.
- Brand CSS variables: `--kr-rot #e10600`, `--kr-lime #bfe23a`, `--kr-gruen #276642`, ground
  `#e4d3cf`, surface `#f3e8e5`, ink `#2b1d1c`. Fonts Archivo and Archivo narrow width.

## 2. Competitors (Swiss TCG shops)
| Shop | What it does | Gap Kartenregal can own |
|---|---|---|
| The Uncommon Shop | "#1 TCG store in Switzerland", every game, mystery boxes, advent calendar, free shipping from CHF 79, next-day cut-off 16:00 | Big catalogue, stock photos, no exact-copy promise |
| TwoMoons (Zürich) | Game bar for 100 guests, events, merch, filament, PCs | A venue, not a careful seller |
| TCG-Schweiz (Wil) | Shop open Saturdays, free shipping from CHF 150, buys collections | Generic Shopify layout |
| TCG Treasure (Zürich) | Pre-orders with release dates, A-Post 1 to 3 days, plastic-free packing, free shipping from CHF 200 | Pre-order focus, no small-order pricing |

Finding: the bigger shops compete on range and free-shipping thresholds. Kartenregal is small, and
its advantages are exactly the small things: one booster for CHF 2 by letter, the exact copy shown,
an honest count. The design should lead with those, not imitate a big catalogue.

## 3. Review (summary; full version with screenshots at `#/review`)
Keep: the shelf language, honest stock, exact-copy photos, the three colours, plain copy, square
ink-edged buttons.
Change:
1. First screen names the category ("Pokémon-Karten: Booster, Bundles und Boxen", five lines) and
   hides the reasons to buy here in small text.
2. Fourteen full-width lime "In den Korb" bars: lime stops meaning "buy"; prices louder than names.
3. The shelf exists only in words; the page is a standard grid.
4. Product title is a SKU in capitals ("... ETB DE – NEU & VERSIEGELT"), the German set name missing.
5. Exact-copy photos unlabelled and laid out at mixed sizes.
6. Desktop sticky buy bar covers "Gut zu wissen" and delivery prices.
7. The cheapest shipping (CHF 2 letter) is only on the policy page.
8. Phone: 14 products are about 5,500 px of scrolling; no German or English filter.
9. Bundles & Boxen mixes three layouts.
10. Pickup is an email exchange in two round trips.

Two observations for the proposal: 2 (lime on every card) and 5 plus 6 (exact-copy photos without
labels, under a sticky bar that covers the text).

## 4. Idea
On this page, **the shop's own name and shelf (Regal, numbered Fächer, the count in each)** becomes
**the object, large**: the top product stands large on the red field with its price tag hanging on a
pin, the whole shelf is one list with the product standing on a shelf board beside it, and every
compartment page puts products on drawn shelf boards. Competitor test: no other Swiss shop has
numbered compartments or photographs each copy, so the sentence fails for them.

Live thing: the **envelope meter**. In the basket (and on the home page as a scroll scene) the letter
fills with boosters: 1 to 2 CHF 2, 3 to 6 CHF 4, then a parcel; it says how many more still fit.

## 5. Roast of the first ideas
| First idea | Roast | Decision |
|---|---|---|
| Clone trek.cards (dark fantasy, purple glows, chapters) | Trek is a game launch with invented creatures; a Swiss shop selling sealed Pokémon product needs trust and prices, and the owner must keep three colours. A clone also reads as someone else's site | Borrowed the motion vocabulary only: fanned cards that lean toward the pointer, chapter-like numbered sections, a pinned story while you scroll, foil sheen that follows the pointer, card flip |
| Keep Archivo condensed caps for everything | Shouting product titles were part of the generic feel, and Archivo is used by another project here | Switzer, a Swiss neo-grotesk with a free commercial licence, heavy for headlines, tabular figures for prices |
| Product grid on the home page | 14 products do not need browsing | The whole shelf as a list with a sticky photo |
| Free-shipping banner like the competitors | The shop's rules are cheaper for small orders than any threshold | The rules became the envelope scene and meter |
| Lime on every add button | Same problem as today | Lime only for buying, small square on lists, one full button per screen |

## 6. Roast after building, and fixes
| Found in screenshots | Fix |
|---|---|
| Hero headline broke "Pokémon-" over two lines, box cropped by the header | Smaller display size, no wrapping inside a line, box sized to the stage |
| Images ignored width and height and stretched | `height: auto` on all images |
| Exemplar zoom showed the black photo background | Three real views instead: front, back, seal |
| Envelope hid the boosters | Packs raised so they peek out of the letter |
| Shelf rows and drawer lines were hairlines | Rows separated by space and a tone change on the active row |
| Hanging price tag used a drop shadow | 2 px ink edge instead |
| Exemplar pin ran three screens | Section shortened, frame and words smaller so they never touch |
| Phone tab row scrolled sideways | Short names (Neu, Booster, Boxen, Karten) on one line |
| Related products on the product page never appeared | Each item reveals itself |
| Phone buy bar never appeared (intersection only fires on change) | Driven by scroll position: shows only while the real button is off screen |

Inspector notes defended: the numbers 01 to 05 are the client's own compartment system and the
heading of each compartment, not decoration; text passing under the sticky header is normal page
scrolling; no honest video of this shop exists; font size count is high because a shop has prices,
labels and table text at their own sizes.

## 7. Colour, type, motion
- Red `#e10600` brand field and shelf numbers; `#a30400` for red text on the rose ground (4.5:1).
- Lime `#bfe23a` only for buying. Green `#276642` only for stock. Ground `#e4d3cf`, surface `#f3e8e5`,
  ink `#2b1d1c`. Dark mode on the shop's brown with the same three colours.
- Switzer 400 to 800. Square corners, one button shape with a 1.5 px ink edge.
- Motion table at `#/system`. All motion off under `prefers-reduced-motion`.

## 8. Open items for the client
- Pickup windows ("Werktags ab 18 Uhr", "Samstag 10 bis 12 Uhr", "Samstag 14 bis 16 Uhr") are examples.
- Registered-mail price for singles from CHF 50 is not on the site; shown as "im Checkout".
- Flaw text per Pitch Black copy is read from the photos; confirm.
- Figma file follows once the pages to cover are agreed.

## 9. Scroll and transition pass (owner request: more scroll effects, better transitions)
One shared scroll loop (`useScroll` in `src/motion.js`) writes progress variables (`--p`, `--pin`,
`--out`, `--in`, page `--read`, scroll speed `--vel`) and CSS does the moving, so React does not
re-render while scrolling.

| Effect | Where | What it shows |
|---|---|---|
| Hero parallax | first screen | Text lifts and fades, the box sinks and shrinks, the booster fan opens outwards, the price tag swings on its pin |
| Stacking compartments | "Vier Fächer, ein Regal" | Booster, Bundles & Boxen, Einzelkarten, Abholung as boards that slide up and settle; the one underneath shrinks and darkens like a drawer pushed in; pictures rise into each board |
| Horizontal track | "Neu im Regal" | Vertical scroll moves the six new arrivals sideways (pinned), lime progress line; phones swipe with snap |
| Marquee | before "Gut zu wissen" | Two bands of the shop's facts move with the scroll in opposite directions and lean with its speed |
| Photo parallax | "Gut zu wissen", footer | The copy photo drifts inside its shape; the footer photo drifts and the name rises letter by letter |
| Reading line | header | Lime line under the dark bar shows how far down the page you are |

Route transitions (View Transitions API, every in-app link and the checkout steps): the old page lifts
away, the new page is uncovered from the bottom like a drawer pulled out; the header holds still; the
compartment number travels from its stacking board into the compartment page header; product pictures
travel from lists into the product page; pictures that only exist on the new page wait until it is
uncovered. Browsers without view transitions get the short rise-in. All of it is off under reduced
motion (stack becomes a list, the track becomes a swipe row).

Higgsfield: the first connector could only read; after the owner added a second Higgsfield connector,
five atmosphere images were generated (model gpt_image_2_5, high quality, 2K, 2.75 credits each, 13.75
of the 30 credits offered). Four are used, self-hosted in `public/mood/` and credited in the footer as
made with AI: `toploader` (single card into a toploader), `couvert` (unprinted packs into a padded
envelope), `karton` (box in paper padding), `pfaeffikersee` (Lake Pfäffikon near Wetzikon). The fifth
(phone photographing a box on a red and white round mat) was left out because the mat reads as a
trademarked shape. Prompts asked for no logos, no text and unprinted packs; generated images never stand
in for the shop's products, which stay the shop's own photos.

New section "So verpacken wir": the heading stays pinned while three photo columns drift at different
speeds (parallax), one per way of shipping. The pickup board shows the lake behind the Wetzikon sign,
and the pickup page opens with the same picture.

## 10. Image quality pass (owner: some pictures still looked bad)
Audit of every picture against its display size. Worst was the footer, a 750 px phone photo stretched
across the screen.

- New generated images (gpt_image_2_5, high, 2K, 2.75 credits each): `mood/regal` (a pale oak wall
  shelf with five open compartments of plain sealed boxes and packs, dusk, a Swiss village outside) now
  the footer photo behind the name; `mood/siegel` (hands checking the film seam of a plain sealed box)
  replaces the 483 px copy photo in "Gut zu wissen".
- Upscaled the shop's own low-resolution copy photos with Higgsfield (bytedance upscale to 2K,
  2 credits each), then checked every result for changed text: kept Ascended Heroes front, seal side and
  logo side, the 30 Jahre TTB seal side and the 151 Mini-Tin example; rejected four (Boosterbundle front,
  Perfect Order pack, both box backs) because the upscaler rewrote small print ("Herausforderung" became
  "Heraustorderang", "Trading Card Game" became nonsense). For exact-copy photos, invented text is not
  acceptable, so those stay at their original resolution.
- The 360 px Boosterbundle picture is flagged `lowres` and is never shown larger than it can carry.
- Footer credit names the AI-made mood pictures and the AI upscaling.

Credits: second round 23.5 (9 upscales, 2 images); both rounds together 37.25 of the 45 offered.
