# Tech Leader Awards

## Status
- Third roast (motion, transitions, content, layout) done: view transitions between pages with the winner's portrait carried across, ribbon that unfurls, receipt that prints, pause control on the hero portraits, focus and tab title on every route change, Escape closes the menu, smooth accordions, deadline countdown, winners filter, what to prepare per category, the winner's mark, how jurors are chosen. Notes and competitor research in `docs/strategy.md` section 9.
- Done: home, categories with finder, 12 category pages, 2026 winners list and pages, jury, judging and rules, four-step entry, design notes (palette, logo, portraits), credits. Inspector 0 FAIL on all 11 routes; lint clean.
- Next: swap in the client's two prototypes and real palette on `#/notes`; replace sample people, companies, scores, dates, fees and venue.

Design and front-end prototype for the Dribbble brief "Elegant Tech Leader Awards Site Design". React 18, Vite 5,
HashRouter, Line Awesome icons (`react-icons/lia`), Hanken Grotesk, plain CSS. No backend; mock data in
`src/data/awards.js`, the entry draft is kept in localStorage `tla-entry-v1`.

## The idea
The citation card read on stage, with the award's striped ribbon, is the printed card every section is set on,
and the back of every winner's card carries the jury's published scorecard. Sand ground, paper cards, charcoal ink,
one laurel green. Portraits in black and white, 4:5. Research and the roast are in `docs/strategy.md`.

## Routes
| Route | What it shows |
|---|---|
| `#/` | Card hero with winners' portraits, citations as slips, categories and finder, judging receipt, jury chair's letter, fees, questions, reply card |
| `#/categories`, `#/categories/best-ai-agent` | All 12 awards in four groups; criteria and weights, jurors, last year's winner and finalists |
| `#/winners`, `#/winners/ana-ribeiro` | 2026 winners; citation card that turns over to the scorecard |
| `#/jury` | Six jurors with declared interests and recusals |
| `#/judging`, `#/enter`, `#/notes`, `#/credits` | Rules, entry in four steps, design notes for the client, photo credits |

Scores add up: weighted totals are computed from each juror's scores (`scoreOf` in `src/data/awards.js`).

## Run
```bash
npm ci && npm run dev    # npm run build → dist/
```

Photos: Open Images, CC BY 2.0, credited at `#/credits`. Portraits are placeholders; the people shown are not the
people named, and every name, company, score and date is a sample.
