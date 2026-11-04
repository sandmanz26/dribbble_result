# Cooperative app redesign, Arabic and English

Dribbble brief "Cooperative Mobile Redesign AR/EN Figma" ($500, a few weeks): redesign a co-operative
society shopping app for Arabic and English users. Evaluate the current app, fix usability, refine
journeys and navigation; focus on product display, search, shopping list integration and an AI shopping
assistant; build a scalable white-label Figma design system so other co-ops can swap branding without
redesigning screens. Phase 1: UX discovery and architecture (audit, feature refinement, IA). Phase 2: UI
for iOS and Android, interactive prototypes, developer-ready files in RTL and LTR.

## Research (Gulf co-op apps)
- Kuwait co-ops run their own apps: ordering and delivery (some 24 hours, open to shareholders and
  non-shareholders, shareholder number entered at order), shareholder profit checks, e-wallet, digital
  shareholder card, profit history, offers, branches, complaints ([Arab Times, Rawda and Hawally](https://www.arabtimesonline.com/news/rawda-hawally-co-op-launches-247-delivery),
  [Shamia and Shuwaikh on the App Store](https://apps.apple.com/us/app/id6759379364), [Fahaheel](https://mwm.ai/apps/fahaheel/6751192477)).
- The purchase dividend for shareholders was raised to a maximum of 15% in a recent reform
  ([Kuwait Times](https://kuwaittimes.com/article/46370/kuwait/other-news/ministry-targets-payroll-waste-in-cooperative-sector-overhaul/amp)).
- Union Coop (Dubai): Gold card for shareholders, Silver for others, points per dirham, digital card
  only from 2026, wallet, 45-minute express, in-store pickup ([Union Coop](https://corporate.unioncoop.ae/en/?p=176063)).
- App ratings are too few to read sentiment; the audit is therefore framed as hypotheses to confirm.

## Idea
On this app, **the co-op's own promise (members own the shop and get a share of what they spend)**
becomes **the thing you see first**: the purchase dividend grows on Home and every price shows roughly
what comes back. Around it, the household's real behaviour: shared family lists that sort by the
branch's aisles and go to the basket in one tap, search that reads Arabic, English and Arabic typed in
Latin letters, and an assistant that answers with a list or a basket, not a paragraph.

## Decisions
- Five tabs: Home, Search, Lists, Assistant, Basket. Membership from the avatar.
- One layout in logical properties; Arabic first. Direction-bearing icons flip, object icons do not.
  Arabic-Indic digits by default, Latin digits as a setting.
- Alexandria (one family for Arabic and Latin), Material icons (`react-icons/md`).
- White-label: four colour tokens plus a mark and a name per co-op (Nakheel green, Bahar blue, Ward red,
  all sample names). Everything else is shared.
- Product pictures: 24 AI-generated studio packshots in one style (warm ground, soft top light), no
  brands or text; the style is part of the system and doubles as a supplier brief.
- Substitution chosen per basket line; shareholder number added automatically.
- Motion: direction-aware push and back, tab cross-fade, shared product picture, collapsing large
  titles, badge pop, assistant typing then writing, rising list items. Reduced motion turns it all off.

## Deliverables in the prototype
`#/` the app (phone frame with a reviewer panel on desktop), `#/audit` the Phase 1 audit,
`#/ia` information architecture and journeys, `#/system` the white-label system with Figma collections.
Figma files follow once the scope is agreed.
