# Co-Ware, co-warehousing website

Dribbble brief "Bold Colorful Modern UI/UX for Co-Ware" ($1,000, a few weeks): UI/UX for a
co-warehousing website with bold, colourful, modern geometric aesthetics; show the collaborative nature
of the space with vibrant colour blocks and sharp shapes; navigation and layout clear and easy; the
project also needs development support.

## Idea
On this site, **the painted floor of a co-warehouse** becomes **the brand and the interface**. Each
colour is a kind of space (lemon shelf bays, teal pallets, cobalt private bays, tangerine packing
desks), so the colour blocks are not decoration: they are the map. The live thing is the floor plan
itself: filter by type, pick a free unit, see its price for the months you need, and book a tour of
that unit.

## Structure
Home: hero (headline, the floor photo cut by assembling shapes), four ways to take space (pinned
horizontal slabs), the floor plan explorer, shared kit (sticky photo stack that hands over as the list
scrolls), community and events, FAQ, tour call to action, footer name built from colour blocks.
Space pages per type with free units; tour booking with day, slot, type and confirmation.

## Motion
- Page change: a slab of the destination's colour sweeps up over the page and leaves through the top.
- Hero: headline lines rise, shapes pop into place, then drift apart and rotate with scroll; the photo
  zooms slowly.
- Four types: pinned horizontal track with a progress bar; swipe with snap on phones.
- Floor plan: units pop in with a stagger; free units lift on hover; selection draws an ink shadow.
- Shared kit: photo stack, the current photo straightens, the previous one tilts away.
- Community photos drift at different speeds; CTA shapes rotate and float with scroll.
- Reading bar in the four colours. Reduced motion turns everything off.

## Type, colour, images
Unbounded (display) and Outfit (text), css.gg icons (`react-icons/cg`). Ground #f3f0e8, ink #121212;
cobalt #2b3dff, tangerine #ff5b1f, lemon #ffd400, teal #00a88f as space types. The brief asks for many
colours, so the one-accent rule is applied as one action colour (ink buttons) while the four colours
mean something. Square corners and full circles only.

Ten photos generated with Higgsfield in one art direction (bright co-warehouse, painted floor zones in
the brand colours, no text or logos): one high quality hero and nine medium (7.25 credits). Unsplash
could not be reached from the build environment (bot check), so no stock photos were used.

## Development support
The prototype is plain React with no animation library; the same code can be the starting point for
the production front-end.
