# Strategy notes: Retro Illustrated Travel Blog

## 1. Problem and goals
| Stakeholder | Goal | Design response |
|---|---|---|
| Visitors (friends, family, travel-curious strangers) | Find "the trip I care about" fast | Photo banner of recent trips + a yearly calendar, both one click from a trip |
| The gang (authors) | A shared archive that feels like theirs | Poster-style identity, bylines, per-trip facts |
| Long term | Turn readers into a returning audience | Subscription with topic choice, "next trip" teaser, subscribe at the end of every trip/post |

Primary conversion: email subscription. Secondary: posts read per visit.

## 2. Information architecture
```
Home: banner (recent trips) > statement + next trip > calendar > this year > latest posts > crew > subscribe
Calendar (/calendar)       full-year view with year tabs; every trip day links to its trip
Trip (/trip/:slug)         facts, trip blog (posts by day), who went, prev/next trip
Post (/trip/:slug/:post)   article, prev/next post, subscribe at the end
Journal (/journal)         all posts, year filter
Subscribe, Photo credits
```

## 3. Design system (v2, after the anti-slop audit)
- Read: editorial travel blog, vintage travel-poster language. Dials: variance 6, motion 4, density 3.
- Type: Big Shoulders Display (condensed poster sans, self-hosted) + Figtree. No serif.
- Colour: paper, navy ink, one cobalt accent. Light and dark themes (system default + toggle).
- Shape: interactive = pill, surfaces/images = 6px.
- Photos: real, location-matched Commons photos with a light print treatment and one fixed grain layer.
- Motion: banner crossfade + progress, scroll reveals; all disabled under reduced motion.

### Audit of v1 (what was removed and why)
| v1 pattern | Problem | v2 |
|---|---|---|
| Eyebrow label above every section (7/7) | Templated rhythm | No eyebrows; headlines carry sections |
| Hand-drawn SVG scenes as "photos" | Brief asks for a photo banner; reads as placeholder | Real photos, credited |
| Stamps/pills overlaid on images | Clutter, AI tell | Metadata sits below images |
| Three equal trip cards | Generic feature-row | Asymmetric 1 + 2 layout |
| Dark calendar block on a light page | Theme flips mid-page | One theme per page |
| Em/en dashes in copy and dates | AI tell | Removed everywhere |
| Emoji glyphs as icons, hard ink shadows everywhere | Inconsistent, noisy | Phosphor icons, flat surfaces |
| Google Fonts `<link>`, serif by default | Perf + taste | Self-hosted fonts, poster sans |
| Hero taller than the viewport | CTA below the fold | Banner fits 100dvh with CTA visible |

## 4. Competitor research frame (to be filled from your screenshots/PDFs)
Candidates to verify: Polarsteps, Nomadic Matt, Lonely Planet stories, Substack/Ghost travel newsletters, Atlas Obscura.

| Question | Why it matters |
|---|---|
| Is content organised by place, date or author? | Validates the calendar-first IA |
| Where is the subscribe prompt, and what is the incentive? | Placement and copy |
| How are trips shown: map, timeline, cards? | Navigation model |
| How do they make money: ads, affiliates, memberships? | Options beyond this brief |
| Post template: length, media, budget transparency | Content pattern for the gang |

## 5. Out of scope
CMS, auth, email delivery, analytics. Suggested next step: Ghost or Sanity for posts and a mailing tool for subscribers.
