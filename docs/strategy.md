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
GlobalTrade's day is the world's trading day. The hero is a live chart of gold (the brand's gold is
also the instrument), and the first thing below it is the four trading sessions with a marker at the
visitor's real minute: what is open now and what that means. Dark room direction: one warm black
field and in it the lit things, which are the markets.

## Decisions
- Gold only on the one action per screen and on price lines; everything else black and stone.
- One order shown placed, open (live profit worked out from the price on screen) and closed.
- Sign-up includes an experience check that explains a wrong answer instead of blocking.
- Log-in has a second step and a visible attempt limit.
- Withdrawals can only go back to where money came from, are checked by a person, and the amount
  available is worked out from equity minus margin and money already held.
- Staff see why a payment is held, in words, next to the payment; identity checks show their age
  against a 24-hour target; support shows the client's status and payments beside the thread.
- taste-skill: page direction "the dark room" (seed 500430564; about section redrawn to side facts
  because there are no team portraits; type redrawn to Work Sans because the dealt fonts could not be
  self-hosted); app style "data terminal" (seed 1273256742) with every selection a 1px gold line.

## States
Empty client account (new sign-up), identity in review, wrong password with attempts left and
lockout, wrong code, deposit and withdrawal validation, withdrawal cancel, trade close with undo,
staff queues empty, decisions with undo, solved tickets, phone layouts.
