# Strategy notes — Retro Illustrated Travel Blog

## 1. Problem & goals
| Stakeholder | Goal | Design response |
|---|---|---|
| Visitors (friends, family, trip-curious strangers) | Quickly find "the trip I care about" and read it | Banner of recent trips + year calendar, both one click to a trip |
| The gang (authors) | Keep a shared archive that feels like *theirs* | Retro illustrated identity, per-author bylines, trip stats |
| Business (long-term) | Turn readers into a returning audience | Subscription form in 3 places, interest-based opt-in, "next trip" teaser |

Primary conversion = **email subscription**. Secondary = depth (entries read per visit).

## 2. Information architecture
```
Home ── banner (recent trips) → calendar (year tabs) → trip cards → latest dispatches → crew → subscribe
 ├─ Trip /trip/:slug ── facts, crew, blog entries list, prev/next trip
 │    └─ Post /trip/:slug/:postId ── article, prev/next entry, subscribe nudge at end
 ├─ Journal ── all entries, year filter
 └─ Subscribe
```
The brief's "calendar allows direct navigation to individual trip pages" is satisfied literally: each
trip day in the calendar is a link; the legend repeats the trips for discoverability and touch.

## 3. Key UX decisions
- **Calendar over archive list**: spatial/temporal memory ("that was in spring") matches how friends recall trips.
- **Banner has visible tabs + pause on hover/focus**, respects `prefers-reduced-motion` (accessibility, avoids carousel traps).
- **Subscription form asks *what* to receive** (trip announcements / every post / digest / budget notes) — improves relevance and lowers unsubscribe rate; name optional to reduce friction.
- **Retro aesthetic with function**: stamps = category labels, postcards = trip cards, hard shadows = affordance for clickable surfaces; high ink-on-paper contrast.
- Photos are illustrated SVG scenes (no network dependency); swap `Scene` for `<img>` when real photos exist.

## 4. Competitor research frame (to be filled from your screenshots/PDFs)
Candidate comparison set: Polarsteps, Nomadic Matt, Lonely Planet blog, shared-trip blogs (Substack/Ghost), Atlas Obscura. To be confirmed against the material you send.

| Question | Why it matters |
|---|---|
| How do they structure content: by place, by date, by author? | Validates calendar-first IA |
| Where/when is the subscribe CTA shown, and what's the incentive? | Conversion placement & copy |
| How do they show trips visually (map, calendar, cards)? | Navigation model |
| Monetisation: ads, affiliates, memberships | Business model options beyond $350 scope |
| Post template: length, media, budget transparency | Content pattern for the gang |

## 5. Out of scope (the brief notes "development support")
Real CMS, auth, email delivery, analytics. Suggested next step: Ghost/Sanity for posts + a mailing tool for subscribers.
