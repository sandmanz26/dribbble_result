# Selvedge: research

Desk research done before any screen was drawn. It covers three questions:

1. How a luxury fashion retailer actually runs: the jobs, numbers and words of the trade.
2. What AI products for retail already do, and where they stop.
3. What the research on human-AI interaction says about trust, explanation and autonomy.

Sources are listed at the end. Vendor material is marked as such, because it describes what a product claims rather than what it measurably does.

## 1. The brief, read closely

The brief (Dribbble, ORVUM, budget USD 10,000, a month or more) asks for:

- **What the product is:** an operating system for retail, not another ERP. It brings together inventory, buying, sales, POS, CRM, finance, cash flow and analytics, with AI-powered decision-making on top.
- **The ambition:** help companies understand their operations, anticipate problems, optimise resources and *progressively* automate complex decisions.
- **The first market:** luxury fashion retail, and later retail broadly.
- **The design challenge:** enterprise software is complicated, outdated and hard to learn. This should feel like the best consumer apps.
- **Three people, each with one test:**
  - A new employee understands it quickly, with minimal training.
  - A store manager immediately sees what matters.
  - A business owner understands the whole company from a single interface.
- **AI throughout:** an assistant available everywhere to explain, guide and help people complete tasks.
- **The ask:** refine and elevate an existing design vision into a cohesive product. Information architecture, interaction design, a scalable design system, and dense data made simple.

My reading in one line: **the product is judged on whether the AI makes each of the three people faster at their own job without ever making them doubt the numbers.** Everything else (modules, charts, the design system) serves that.

## 2. How luxury fashion retail runs

### The numbers people use

- **Store managers** are measured on conversion rate, units per transaction, average transaction value and sell-through. They also run the inventory life cycle: replenishment, transfers, audits and shrinkage (from luxury store-manager role descriptions).
- **Apparel retail** tracks sell-through, inventory turnover, GMROI and sales per square metre.
- **Buying** is governed by open-to-buy: planned sales + planned markdowns + planned ending stock − opening stock − stock on order. OTB is the financial guardrail between the forecast and the purchase orders. It suits fashion because categories stay stable while the items change every season.

### The jobs particular to luxury

- **Clienteling replaces the paper "black book".** Advisors keep each client's preferences, sizes, past purchases, wish lists and appointments. Leading tools generate a daily follow-up list per advisor, which also helps new staff get up to speed. They keep VIP conversations on WhatsApp inside the system rather than on personal phones, and attribute sales to the advisor who influenced them.
- **Holds and transfers.** Boutiques commonly hold a piece for a client for about 48 hours. A hold at one boutique blocks a transfer from it. Transfers between boutiques are routine but not free, and a piece may be held in a boutique, in transit, or reserved for a very important client. Boutiques can fulfil orders, but never at the expense of display stock or scheduled appointments.
- **Scarce pieces are allocated, not sold first-come.** When two pieces of a sought-after bag arrive, who is offered them first is a judgement call, made from the waitlist, the relationship and the client's history. This is where an AI should rank and explain, and a person should decide.
- **Markdowns are a brand decision.** Luxury houses protect full-price sell-through. Moving stock to where it sells (rebalancing) is preferred to discounting it.

### The market for this case

The engagement is set in Indonesia: a luxury fashion group with six boutiques and one warehouse. Jakarta has four boutiques (Plaza Indonesia, Plaza Senayan, Pacific Place, Pondok Indah Mall), plus Tunjungan Plaza in Surabaya, Seminyak in Bali, and a distribution centre in Cikarang. The interface is in English, which is how such groups often run their head office, while people and places are Indonesian. VAT (PPN) is 12% on goods subject to the luxury-goods tax and effectively 11% on most other goods since January 2025. The prototype shows tax-inclusive prices and does not model tax.

## 3. What AI retail products already do

| Product | What it does | Where it stops |
|---|---|---|
| Nextail (vendor) | AI for allocation, replenishment and store-to-store transfers, driven by near real-time sell-through, stockouts and store performance, with size curves and display minimums | A merchandiser's tool. The store manager and the advisor never see why |
| Tulip (vendor) | Clienteling: 360° client profiles, daily task lists, WhatsApp and other channels kept in the system, appointment preparation, AI for on-brand messages | Selling only. No stock or money context in the same view |
| Microsoft Dynamics 365 Commerce Copilot (vendor docs) | Plain-language summaries of store reports, customer insights for associates (preferred categories, RFM, lifetime value), product insights on the product page | Summaries sit next to the report. No action, no explanation of method |
| Shopify Sidekick (developer docs, guides) | An assistant in the admin that answers questions and drafts changes; the merchant confirms before anything is written | Generic commerce, one store, no luxury workflows |

**The gap Selvedge fills:** one place where the AI's conclusion, its evidence and the action sit together. The owner, the manager and the advisor each get the same truth at their own altitude.

## 4. What the human-AI research says

- **Microsoft's 18 guidelines for human-AI interaction** (CHI 2019, tested against 20 AI products). Make clear what the system can do and how well, show contextually relevant information, support efficient correction and dismissal, explain why the system did what it did, remember recent interactions, let people control how it behaves globally, and notify them when it changes.
- **Google PAIR, Explainability + Trust.** The goal is calibrated trust, not maximum trust: people should know when to rely on a prediction and when to use their own judgement. When and how confidence is shown is a design decision, and the product must say what it cannot do.
- **Autonomy is set per action, not per assistant.** Practitioner frameworks converge on a ladder: suggest, ask before acting, act and notify with undo, act silently. The level is chosen by risk and reversibility. Irreversible or costly actions stay supervised whatever the model's quality. Reviewers must be able to approve, reject or edit a proposed action. Every gate, decision and outcome is logged. The agent can never raise its own autonomy.
- **Write actions need confirmation.** Shopify's model is that the assistant suggests and opens the right UI, and the merchant confirms the mutation.

## 5. What this means for the design

1. **Every AI claim carries its evidence.** Figures in an AI-written sentence are links to the rows they came from. A claim without a source is not shown.
2. **Confidence is shown in words, and only when it changes a decision.** For example: "likely, based on 8 weeks of sales", or "low, only 3 sales of this item".
3. **The ladder of autonomy is visible and owned by people.** Per decision type: suggest, ask first, or act within limits and tell. Limits are set in rupiah and by boutique. Only the owner can raise a level, and the change is logged.
4. **Proposals look the same everywhere.** Each one shows what, why, the expected effect with its range, what could go wrong, and Approve, Edit or Decline. A decline asks for a reason, which teaches the system.
5. **The assistant knows where you are.** Opened from a product, it starts from that product. Opened from a client, it starts from that client. From Today, it starts from today.
6. **It teaches as well as answers.** For new staff, "Show me" walks through the real screen instead of describing it.
7. **It never sends anything to a client.** Messages are drafted in the advisor's voice. The advisor sends them.
8. **It says what it doesn't know.** For example: a boutique's POS has been offline since 14:20, a forecast built on too little data, or a question outside its access.

## Sources

- Microsoft Research, Guidelines for Human-AI Interaction (CHI 2019): https://www.microsoft.com/en-us/research/publication/guidelines-for-human-ai-interaction/
- Microsoft HAX Toolkit, design library: https://www.microsoft.com/en-us/haxtoolkit/library/
- Google PAIR, People + AI Guidebook, Explainability + Trust: https://pair.withgoogle.com/chapter/People%20+%20AI%20Guidebook%20-%20Explainability%20+%20Trust.pdf
- Shopify developer docs, Sidekick: https://shopify.dev/docs/apps/build/sidekick/index.md
- Microsoft Learn, Copilot report insights in Store Commerce: https://learn.microsoft.com/en-us/dynamics365/commerce/copilot-pos-report-insights
- Microsoft Learn, Customer insights by Copilot: https://learn.microsoft.com/en-us/dynamics365/commerce/copilot-pos-customer-insights
- Nextail, allocation and replenishment (vendor): https://nextail.co/solution/allocation-and-replenishment/
- Tulip, clienteling features (vendor): https://www.tulip.com/wp-content/uploads/2022/04/Tulip_Clientelling_Features.pdf
- Tulip, clienteling 2026 (vendor): https://www.tulip.com/wp-content/uploads/2025/12/Tulip_Clienteling_2026.pdf
- HotWax, order management for luxury brands (vendor): https://www.hotwax.co/order-management-system-for-luxury-brands
- Board, What is open-to-buy: https://www.board.com/glossary/open-to-buy
- Shopify, open-to-buy plans: https://www.shopify.com/blog/open-to-buy-plans
- LogicERP, apparel retail KPIs: https://www.logicerp.com/blog/apparel-retail-kpis-a-complete-guide-to-measuring-success-in-fashion-retail-with-key-performance-indicators/
- Cleverence, luxury clienteling KPIs: https://www.cleverence.com/articles/business-blogs/clienteling-as-a-core-luxury-business-priority-4821/
- Prada Group, in-store clienteling manager role: https://jobs.pradagroup.com/job/sydney-in-store-clientelling-manager/1370292233
- SSEK, Indonesia 12% VAT: https://ssek.com/?p=5960
- Deloitte Indonesia tax alert, January 2025: https://www2.deloitte.com/content/dam/Deloitte/id/Documents/tax/id-tax-alert-jan2025-en.pdf
- Agent autonomy and approvals (practitioner articles): https://dev.to/brennhill/ai-agent-autonomy-levels-from-logged-to-locked-down-45am , https://connic.co/blog/agent-approvals-human-in-the-loop
