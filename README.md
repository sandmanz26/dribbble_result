# Selvedge: retail operating system (portfolio case)

An AI operating system for a luxury fashion group in Indonesia, built as a portfolio piece. It answers the Dribbble brief "Retail Management ERP". The client and about 30% of the product are presented as redacted under NDA. What is shown in full is the AI experience.

- Research with sources: `docs/research.md`
- Strategy, personas, IA, principles and visual system: `docs/strategy.md`
- Recap for whoever continues: `docs/recap.md`

## What is in it
- **Case notes** (`#/`): the story, the three people and their tests, eight AI principles, and links to try.
- **Today**, one home per person (switch in the sidebar under "View as"):
  - Ratna, owner: a morning brief written by the AI, with inline evidence; decisions waiting; KPIs; the month against plan with the AI forecast; boutiques yesterday.
  - Dimas, store manager: "What matters today" ranked by the AI; appointments; KPIs; stock to watch; who is on the floor.
  - Sekar, a new advisor on day 4: a briefing before her next client, follow-ups drafted but not sent, and "Learn as you go" lessons with "Show me".
- **Ask**: the assistant as a side panel from any screen (Ctrl or Cmd + J) or as a page. It starts from where you are, shows what it looked at, answers with charts, tables and sources, and offers the next step. It refuses honestly when something is outside its data or role.
- **Decisions**: AI proposals (transfer, allocation of scarce pieces, reorder, staffing, markdown request), each with why, evidence, effect and range, risk and confidence. Approve, edit or decline with a reason, then undo.
- **Stock** and the product page: stock by boutique, holds, forecast, and "What Selvedge sees".
- **Clients**: the client book, a briefing before a visit, and a message drafted in the advisor's voice.
- **Selling**: a lean POS with AI notes about the client and stock elsewhere.
- **Autopilot**: autonomy per decision type (suggest, ask first, act and tell), limits, locked policies, trust figures and the activity log with undo.
- **Redacted under NDA**: Buying, Finance, Cash flow, Analytics, Settings.

Review links:
- `#/today?as=owner`, `#/today?as=manager`, `#/today?as=advisor`
- `#/decisions/D-119`
- `#/stock/laras-mini`
- `#/autopilot`

## Stack
- React 18, Vite 5 (`base: './'`), react-router HashRouter.
- Fluent UI System Icons. Albert Sans + Fragment Mono (figures).
- Charts are hand-drawn SVG with no library.
- State is kept in localStorage under `sv-state-v1`.
- Product photos are real photographs from Open Images (CC BY 2.0), credited at `#/credits`.
- All people, figures and products are synthetic. The demo clock is fixed at Thursday 29 October 2026, 10:40 WIB.

```
npm ci && npm run build   # dist/
```
