# Strategy notes

## Brief
Bold, colourful, retro landing page for KhangoSupps: product images, videos, reviews, storytelling. Product images in the spirit of Promix and Bare Performance Nutrition, simple ingredients and great taste, performance nutrition and the "stay ready" mindset. Must support persona-specific squeeze pages consistent across a national expansion. Development support.

## Idea
"Stay ready" is a time of day. The page is built around the hours when real people need to be ready (05:00 on the track, 07:10 after a night shift, 06:30 before the school run), and each hour becomes its own squeeze page.

## What the references teach (public sites, general patterns)
- Promix: product on flat bold colour, ingredient honesty up front, short copy.
- Bare Performance Nutrition: americana and retro type, the mindset as the story, community and athletes.
- Both: taste is sold as hard as protein; the label is shown, not hidden.

## Decisions
- One live control: the flavour picker repaints the whole page (field, pop, tub, label). Bold colour that also does a job.
- The nutrition panel is set large as a design object; five ingredients each with a reason.
- Video is muted, loops only while visible and has a pause button.
- Reviews are sample placeholders, labelled as such, to be replaced with verified store reviews.
- Squeeze pages share every block; a new persona or a state launch is a new data entry in `src/data.js`.
- The offer is a low-risk starter pack (four sachets and a shaker) with one email field, the usual first step for a protein brand that sells on taste.

## Open items for the client
Real product line, nutrition from the lab sheet, testing programme, prices, verified reviews, founder story, which personas and states come first.
