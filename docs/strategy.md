# Tech Leader Awards: strategy, research and roast

Brief (Dribbble, $1,100, a few weeks): a professional, elegant UI/UX for the Tech Leader Awards website.
Categories such as Best FinTech Innovation, Best AI Agent and Most User-Friendly. It must convey
credibility and trust while staying approachable for SaaS and tech companies worldwide, US first.
Photos of recipients and jury should lead. Improve the current palette, merge two prototypes into one
aesthetic, navigate many categories easily. Logo feedback welcome.

## 1. What the research says

The client's own site and its two prototypes were not shared, and no public "Tech Leader Awards" with
these categories could be found. So the research looks at the category and at what makes an award
believable.

| Program | What it does well | What it gets wrong for this brief |
|---|---|---|
| The Webby Awards | Two winners per category, one from a named academy and one from a public vote; judging criteria are published ([judging process](https://www.webbyawards.com/judging-process/), [season explainer](https://www.webbyawards.com/webby-awards-season-explainer)) | Huge category list that only insiders navigate; scores are never shown |
| The SaaS Awards (Cloud Awards) | Clear deadlines, early-entry pricing, a stated four-stage judging process; entrants can enter several categories under one fee ([FAQ](https://www.cloud-awards.com/faqs), [judging process](https://www.cloud-awards.com/?p=10532)) | Judging is "primarily based on the quality of your submission", so winning rewards writing, not product; jurors and scores are not public |
| Generic business awards | Ceremony photography, trophies, sponsor walls | The category has a trust problem: critics point to entry fees, sponsor packages and winners' packages that look like paying to win, and to judges who are never named ([how to spot genuine awards](https://www.greatbritishbusinessshow.co.uk/blog-library/spot-genuine-business-awards-tips-avoid-fake-ones), [separating wheat from chaff](https://www.agcc.co.uk/news-article/business-awards-how-to-separate-the-wheat-from-the-chaff), [AV awards critique](https://ravepubs.com/cant-trust-av-awards-except-inavate-rave/)) |

**Finding.** The brief asks for "credibility and trust". In this category, trust is not a colour or a
serif; it is evidence. The guides above agree on the tests: named judges, transparent fees, no
guaranteed wins, no link between sponsorship and results. An awards site that passes those tests in
public, on every winner, is more credible than one that only looks expensive.

## 2. Roast of the first ideas (before building)

| First idea | Roast | Kept or dropped |
|---|---|---|
| Black and gold gala, trophy hero, spotlight glow | Every award looks like this, and project9 in this portfolio is already black and gold. Gold gradients read "pay-to-win plaque", the exact suspicion the brief must beat | Dropped |
| SaaS blue with a gradient and logo wall of "as seen in" | Looks like the entrants, not the judge. Logos of companies we cannot claim would be invented proof | Dropped |
| Didone serif (Bodoni) as the dealt display face | Elegant, but fashion-magazine luxury, and the owner dislikes decorative serifs. Too cold for "approachable" | Redrawn to Hanken Grotesk |
| Biro blue accent on white (dealt palette) | Clean but generic; blue is the default trust colour of every fintech entrant | Redrawn to sand and laurel |
| Hero of three equal category cards with icons | The most common awards template; says nothing about why these awards are worth winning | Dropped |
| Stock portraits as winners with fictional names | Needed for a prototype, but many open portraits are of politicians and public figures. Only private people's portraits are used, every name is a sample, and the credits say so | Kept with care |

## 3. The idea

**On this page, the citation card read on stage, with the award's striped ribbon, becomes the printed
card every section is set on, and the back of every winner's card carries the jury's published
scorecard.**

Competitor test: the Webbys or the SaaS Awards could print a card, but neither publishes scores. The
back of the card is this award's promise made visible, so the idea belongs to this client.

- **The artefact:** the citation card (what a presenter reads: category, name, one sentence "for...").
- **The ribbon:** award medals hang on striped grosgrain ribbon. The ribbon's laurel and paper stripes
  are the only ornament, used on the card's top edge and in the button on hover.
- **The laurel:** sand ground, charcoal ink, one laurel green. Laurel is the oldest sign of a win, and
  it is not the gold every competitor uses.
- **Photography leads:** portraits in one treatment (black and white, 4:5, same crop height), a
  crossfading winners' portrait beside the hero card, ceremony rooms as atmosphere.
- **The live thing:** turn any winner's card over to read how each juror scored it. Second helper: a
  category finder that answers "where does my product fit?".

## 4. Information architecture

| Route | Job |
|---|---|
| `#/` | The awards in one page: card hero, 2026 citations, categories, how judging works, the jury chair's letter, fees, questions, enter |
| `#/categories` | Finder and all 12 categories in four groups |
| `#/categories/:slug` | Criteria and weights, the jurors on it, last year's winner and finalists, how to enter |
| `#/winners/:slug` | Portrait, citation, and the full scorecard by juror and criterion |
| `#/jury` | Every juror with their declarations of interest and recusals |
| `#/judging` | Rounds, rules, and what the fee never buys |
| `#/enter` | Entry in four steps (eligibility, category, product, review); no payment in the prototype |
| `#/notes` | Design notes for the client: palette before and after, logo feedback, photography direction |
| `#/credits` | Photo credits |

## 5. UX decisions

1. **Dates in the first screen.** Entry deadline and ceremony date are in the hero sentence, not in a footer.
2. **Categories by what the product does,** grouped (Innovation, Experience, Growth, Leadership), with a
   finder that matches words to categories, so a first-time entrant never scrolls a list of 12.
3. **Every score is shown.** Weighted totals are computed from the jurors' scores in the data, so the
   numbers on the page always add up.
4. **Recusals are visible.** A juror with a conflict is shown as recused on that category's card.
5. **Fees are flat and public,** with a list of what the fee never buys (a better score, a shortlist
   place, a trophy).
6. **One accent,** laurel green, only on actions and the ribbon.

## 6. Business model (assumed, to confirm)

Flat entry fees per category, ceremony tickets, and partners who sponsor the evening but never a
category. Revenue lines are written so none of them can touch a result.

## 7. Sample content to replace

All people's names, companies, citations, scores, dates, the New York venue and fees are samples.
Portraits are placeholders from Open Images (CC BY 2.0); the people shown are not the named people.

## 8. Roast after building, and what changed
| Found in the screenshots | Fix |
|---|---|
| The ribbon's 40 stripes forced a minimum width, squeezing the hero photo and breaking the phone layout | The ribbon no longer contributes width (`contain: inline-size`), grid children may shrink |
| Category name above the winner's name read as an eyebrow label | The category is part of the card's heading, in laurel |
| Citation slips ran off the right edge on phones | Phones show three slips stacked under the words |
| Inner pages had almost no people in them | Winners' strip on Categories, larger juror portraits, last year's winner beside the finalists, the evening in three photographs |
| Twenty font sizes | Five steps: small, body, lead, title, head |
| Back of the card set the card's height, leaving a gap on the front | The card takes the height of the face being read |
| Entry steps overflowed on phones | Steps not in use shrink to bars |
| Low-contrast grey on the sand surfaces | Muted ink darkened to pass 4.5:1 |

Still short: the ceremony photographs are 1024 px originals, soft when full-bleed; the same three are reused on
three pages. Both go away with the client's own photography.
