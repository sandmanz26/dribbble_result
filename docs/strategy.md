# Selvedge: strategy

## Position
Selvedge is presented as a portfolio piece: an AI operating system for a luxury fashion group in Indonesia, designed as product designer and product manager. The client is under NDA, so the client's name is redacted and about 30% of the product is shown as redacted modules. What is shown in full is the part the brief cares about most: **the AI experience**.

The codename comes from the trade. A selvedge is the finished edge of a fabric that stops it unravelling. In the interface it becomes the mark of the AI: every sentence, number or proposal the AI wrote carries a thin selvedge edge in the one accent red, so people always know what came from the machine and what came from the books.

## The three people and their one test

| Person | Who, in this case | Opens it | Test from the brief | Their home answers |
|---|---|---|---|---|
| Owner | Ratna Wijaya, founder and CEO | Mornings, on a laptop, 10 minutes | Understand the whole company from one interface | "How is the group doing, and what needs me?" |
| Store manager | Dimas Prakoso, Plaza Senayan | All day, on the counter tablet | Immediately see what matters | "What matters in my boutique today?" |
| New employee | Sekar Ayuningtyas, client advisor, day 4 | Between clients, on a phone or the counter tablet | Understand the system quickly, with little training | "Who am I seeing, and what do I do next?" |

## Information architecture

- **Today**: one home per person, the same data at three altitudes.
- **Ask**: the assistant as a full page, also a side panel from every screen (Ctrl or Cmd + J).
- **Decisions**: every AI proposal in one queue, each with its evidence. Transfers, replenishment, allocation of scarce pieces, staffing, markdown holds.
- **Stock**: the collection by boutique, each product with its history, holds, transfers and forecast.
- **Clients**: the advisor's book, each client with preferences, purchases, holds and a briefing before visits.
- **Selling**: a lean POS. A client on the sale, items, stock elsewhere, payment and receipt.
- **Autopilot**: how much the AI may do on its own, per decision type, with limits and the activity log.
- **Redacted under NDA**: Buying and open-to-buy, Finance, Cash flow, Analytics, Settings and integrations.
- **Case notes**: the story of the work, for portfolio readers.

## AI experience principles
These are drawn from the research; see `docs/research.md`.
1. Every AI claim carries its evidence.
2. Confidence is shown in words, and only when it changes a decision.
3. Autonomy is set per decision type, owned by people and logged.
4. Every proposal has the same shape: what, why, effect and range, what could go wrong, then Approve, Edit or Decline with a reason.
5. The assistant starts from where you are.
6. It teaches as well as answers ("Show me").
7. It never contacts a client on its own.
8. It says what it doesn't know.

## Visual system
- taste-skill app style **achromatic ledger**: no colour in the chrome, money and counts in ink, one hue. The shell was redrawn to an **open plane** with a labelled sidebar, because the product has more destinations than a top bar can hold.
- The face: a warm stone ground (#f5f4f1) like a boutique's stockroom paper. Figures are set in Fragment Mono, as on a price ticket. The text face is Albert Sans.
- The one hue is selvedge red (#a32a24). It is used on the AI's own marks (the selvedge edge, the forecast line, the AI's proposals) and on nothing else in the chrome.
- Signature element: the **selvedge edge**, a 3px stitched edge (red and white dashes) on everything the AI wrote.
- Real product photographs (Open Images, CC BY 2.0) as thumbnails. The client's products are not shown, and the house name is redacted.
- Icons: Fluent UI System Icons, regular, 20px.

## What is sample data
All people, clients, figures, products and stores are synthetic. The demo clock is fixed at Thursday 29 October 2026, 09:40 WIB, so every number agrees across screens.
