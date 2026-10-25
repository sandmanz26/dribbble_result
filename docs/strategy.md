# Caravan: strategy notes

Brief (Dribbble, "Professional Travel App Design", under $100, a few days): a mobile app for
travellers to discover destinations, connect with like-minded groups, plan itineraries together
and stay safe through verified profiles and real-time communication. Four modules: Discover,
Connect (create, join, link groups), Plan Together (dates, budgets, itineraries, packing,
private discussion), Travel Safely (mobile and email verification, optional ID check, safety
preferences, blocking, reporting, notifications, community guidelines). Development support too.

## Product read
A group-travel app for solo travellers and small groups who want company but not risk. The two
jobs are "find people I can trust to go with" and "stop planning this trip across five apps".
Trust is the product; planning is the habit that keeps people in it.

## Competitor frame (desk research)
| Product | What it does well | Gap Caravan takes |
|---|---|---|
| Wanderlog | Collaborative itinerary, map, budget | No way to meet new people; trust is assumed |
| Troupe | Date and destination voting for friend groups | Friends only; nothing after the vote |
| Splitwise | Shared costs and settle-up | Not tied to the trip plan or its budget |
| Polarsteps | Trip tracking and sharing with family | After-the-fact, not group planning |
| Travello, GAFFL, Couchsurfing hangouts | Meeting travellers | Weak verification, open DMs, safety bolted on |
| Tourlina | Verified, women-only travel companions | Narrow audience; little planning |
| Bumble / Tinder (pattern only) | Photo and ID verification badges, block and report flows | We borrow the trust patterns, not the dating model |
| Airbnb (pattern only) | ID verification gating, reviews, safety centre | Same |

## The roast (what the brief gets wrong, and what we changed)
1. **"Travel Safely" as a fourth module is the wrong shape.** Safety that lives in its own tab is
   safety nobody opens. It is built into every surface instead: a trust badge on every person,
   the join rule on every group, a safety check before every join request, message requests for
   unverified strangers, a nudge when a message asks for a phone number or money, block and
   report from any profile or chat. The Safety screen (under You) only holds preferences.
2. **Four modules does not mean four tabs.** People think in trips and people, so the tabs are
   Discover, Groups (Connect), Trips (Plan Together), Chats and You.
3. **"Verified" needs levels, said in plain words.** Phone and email are the floor for joining any
   group. The ID check is optional, and hosts can make it required. The badge says which level
   ("ID verified", "Phone and email"), never just a vague tick.
4. **"Linking groups" is vague.** We defined it: two groups in the same place the same week can
   share day plans and a joint chat, while rooms, costs and member lists stay separate. Both hosts
   have to agree.
5. **Budgets in group travel fail at settle-up, not at planning.** The budget tab shows your share
   against the plan and the fewest transfers to settle, computed from every shared cost.
6. **Planning without a "what do you need from me" view becomes chat archaeology.** The trip
   overview leads with what is waiting on you: votes, payments, ideas, unclaimed packing.

## Information architecture
- Discover: search, month filter, groups going, places
  - Place: map, typical day cost (range), weather, best months, groups going
  - Group: dates, budget, spots, members with trust level, house rules, join or waitlist, linking
- Groups: joined, asked (pending or waitlist), hosting; start a group in three steps
- Trips: each trip with days to go and what needs you
  - Trip: Overview, Dates (poll), Budget (share, settle up, costs), Plan (days, ideas to vote on), Packing (shared claims, own list)
- Chats: groups and people; Requests for unverified strangers; block and report in every chat
- You: profile, ID verification, Safety, Notifications, Community guidelines, appearance

## Brand
The first pass read as a well-made kit with no brand. The brand layer now comes from the name:
a caravan is people from different places moving together.
- **Signature: the convergence map.** Every group is drawn as dashed routes from each member's home
  city to the destination, on a night-navy field. It is the welcome screen, the "your next
  trip" card, the group header and every trip card. No other travel app shows who is coming from where.
- **Mark:** three travellers on one dotted arc, the lead one larger. Wordmark in lowercase.
- **Type:** Bricolage Grotesque for headlines, countdowns and place names; Manrope for everything else.
- **Palette:** cool white ground (#f5f6fa) with white cards on a faint lift, a night-flight navy field
  (#0b1a33) for brand moments where the routes glow like flight paths, and one rose accent (#d81f5c)
  for actions and the destination. Sand and forest green from the first pass read muddy and were dropped.
- **Travel artefact:** group cards are tickets: the map is the stub, a perforated tear line, then the
  place in large type.
- **Voice:** short and plain. "Five cities. One trip." "Where to next, Nadia?"

## Design
- taste-skill app style "pastel consumer": pale tiles with the dark of their own hue, one 20px card
  radius, no shadows at rest. Its face here: one rose accent, each
  traveller a pale tint of their own hue, and destination art drawn from real geography (Natural
  Earth coastlines) instead of stock photos.
- Manrope only. Hugeicons (stroke). Light and dark.
- On a computer the app sits in a phone frame with a reviewer panel; on a phone it runs full screen.

## States covered
Loading (skeletons, "Slow network" in the panel), error with retry ("Network fails"), empty
(search with no match, no groups, no requests, no reports), success (toasts with undo), wrong
SMS code, ID check in progress, request pending, waitlist, group full, blocked person in a group.

## Not in scope / to replace
No backend: verification, SMS, ID scanning and host approval are simulated. All people, groups,
prices and messages are sample data. Photos: image hosts were blocked in the build environment,
so destinations are drawn as maps; real photography can drop into each card later.
