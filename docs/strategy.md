# GlobalTrade: strategy notes

## Brief
Premium black-and-gold broker website for forex and crypto: homepage (hero, market information,
live charts, company details, FAQs, contact), client registration, secure log-in, client dashboard
(balances, trading history, deposits, withdrawal requests) and a staff dashboard (client accounts,
identity checks, transaction monitoring, support tickets). Responsive. Inspiration named in the brief:
Crest Peak Markets, with an original layout and identity and no fabricated results or unverified
regulatory claims.

## A note on the reference
No firm called Crest Peak Markets could be found. Two similarly named firms, CrestPoint Markets and
Global Crest Markets, are on the UK FCA warning list (IOSCO I-SCAN alerts). Nothing was taken from
them. The design treats honesty as the product: no licence is claimed, no returns are shown, the
risk warning sits at the top of every page, and prices are labelled as a demo feed.

## Competitor frame (from public sites, no figures copied)
- eToro, IG, Pepperstone, Exness: lead with spreads, platforms and awards; risk warnings are legally
  required and often tucked into a footer strip.
- Coinbase, Kraken: calm, plain language, strong on security and verification steps.
- Gap: almost every broker sells excitement. A broker that shows the costs, the hours and the
  checks in plain numbers is easier to trust.

## Idea
Second redesign. The watch-counter version read as rough: Bodoni hairlines at large sizes, blunt
full-height colour blocks and a mobile-like stack. Research for the look and feel (the broker sites
themselves could not be opened from the build environment, so this is from search results):
- Large brokers (IG, Saxo, Swissquote, Pepperstone) lead with live prices, the platform itself and
  regulation; costs are the main claim.
- Private banks that read as luxury (Citi Private Bank, Goldman Sachs' dark pages) use a black
  ground, one refined serif with a quiet sans and gold only as a material, never as a gradient.
- The black-and-gold trading templates use bright yellow gradients and glows, which is what makes
  them look cheap. This site uses flat champagne gold on the action and the price, nothing else.

Direction "the sentence is the layout": one sentence at poster scale, "Trade gold on world time",
with the live gold price and its chart set inside the sentence where the word "gold" would be.
Gold is both the brand's colour and its flagship market. Every section after it is a short
statement with its proof beside it, and the proof is always a working piece of the platform:
a market screen (pick a market, change the range, hover for any minute), a cost line you type into
("$2,500 on gold" gives the largest position at the retail leverage limit, the spread cost and what
a 1% move against you does), price board, world-time dial, trade confirmation, withdrawal tracker,
and a slider through the four steps of opening an account.

## Decisions
- Gold only on the one action per screen and on price lines; everything else black and stone.
- One order shown placed, open (live profit worked out from the price on screen) and closed.
- Sign-up includes an experience check that explains a wrong answer instead of blocking.
- Log-in has a second step and a visible attempt limit.
- Withdrawals can only go back to where money came from, are checked by a person, and the amount
  available is worked out from equity minus margin and money already held.
- Staff see why a payment is held, in words, next to the payment; identity checks show their age
  against a 24-hour target; support shows the client's status and payments beside the thread.
- taste-skill: page direction "the sentence is the layout" (seed 1756251117). Type redrawn twice:
  the dealt Newsreader is used by project8, and Imbue capitals read as classic and stiff, so
  Stack Sans Headline (light, tight tracking, sentence case) with Stack Sans Text from the library. Hero redrawn in spirit: the dealt "controls on the sentence" demonstrates a
  variable font, so the live price chip takes its place. Sections: market screen, typed cost line,
  rows with proof fragments on one axis, slider through the stages, the offer as one sentence with
  the price on a gold block, about with the dial as a drop capital, indented FAQ, contact, email
  as the footer's display line. App style "data terminal" (seed 1273256742) kept.
- Leverage in the cost line uses the EU and UK retail limits (1:30 major pairs, 1:20 gold and
  minor pairs, 1:10 silver, 1:2 crypto), marked for GlobalTrade to confirm against its licence.
- No photographs: the open image collections were unreachable, and the subject's real pictures are
  its documents and interface, so every picture is a working fragment built in HTML or SVG.

## States
Empty client account (new sign-up), identity in review, wrong password with attempts left and
lockout, wrong code, deposit and withdrawal validation, withdrawal cancel, trade close with undo,
staff queues empty, decisions with undo, solved tickets, phone layouts.

## Round 4 (current)
Landing rebuilt after the owner's reference (a Starlight-style dark fintech page) and the client
and staff areas rebuilt on Tailwind with shadcn/ui patterns. Full detail, including where the
owner's direction overrides the house rules and the Higgsfield image prompts, in `docs/recap.md`.

