# Strategy notes: Proof (photo & video marketplace)

## 1. Read of the brief
Two-sided marketplace, mobile first. Clients want confidence (is this person good, available, and
what will it cost?) and creators want qualified bookings without back-and-forth. The design goal is to
remove the three classic marketplace frictions: unclear pricing, unclear availability, payment risk.

Design read: photo-first, minimal and elegant; monochrome UI with one vermilion accent so the work is
the colour. Platform patterns follow Apple HIG (tab bar, sheets, sticky bottom actions).
Dials: variance 4, motion 5, density 4.

## 2. Business model (proposed)
| Lever | Mechanism in the prototype |
|---|---|
| Client service fee | 6% added at checkout (sample value) |
| Creator commission | Taken from payout (not shown to clients) |
| Escrow | Payment held, released 48h after delivery: lowers client risk, enables the fee |
| Supply quality | Reviews only from completed bookings; response time on profiles |
| Upsell later | Featured placement, Pro plan for creators (calendar sync, contracts) |

## 3. Key flows in the prototype
1. Welcome > create account (choose hire or creator) or browse as a guest.
2. Discover: search, categories, filters (type, price, rating), "free this week", ranked feed.
3. Creator profile: portfolio (photo + video), packages with fixed prices, reviews, sticky "Check availability".
4. Booking: package > real open dates and time slots > location/notes > pay (card, Apple Pay, PayPal), with validation, decline state and confirmation.
5. Bookings: upcoming/past, details sheet, free cancellation window.
6. Creator studio: incoming requests (accept/decline), earnings, portfolio upload.

Guests can browse everything but must create an account to book (keeps discovery open, captures intent at the right moment).

## 4. UX decisions
- Fixed-price packages instead of "request a quote": the biggest drop-off in service marketplaces is waiting for a price.
- Availability is shown before details or payment, so nobody fills a form for a date that is taken.
- Price is always visible in the sticky bar and updates as choices change; fees are itemised before payment.
- States designed: loading (shimmer), empty (search, saved, bookings), errors (form fields, card declined), success.
- Accessibility: labelled inputs, error text tied to inputs, radio/tab roles, reduced-motion support, light and dark themes.

## 5. Competitor research frame (to be filled from your screenshots/PDFs)
Candidates to verify: Snappr, Flytographer, Thumbtack, Bark, Fiverr, Behance, Instagram (the de facto discovery channel).

| Question | Why it matters |
|---|---|
| Fixed packages vs quotes vs hourly | Pricing model and checkout design |
| How is quality signalled: vetting, reviews, badges? | Trust on profiles |
| When do they ask for sign-up and payment? | Funnel friction |
| Take rate and who pays it | Fee presentation |
| How do creators manage availability? | Calendar design for the creator side |

## 6. Out of scope
Real auth, payments (e.g. Stripe Connect for split payouts), messaging, video hosting, notifications.
