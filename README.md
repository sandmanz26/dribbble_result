# Pathwell Admin (concept)

The owner's portfolio piece for UI/UX roles at career transition platforms (written for a Pelgo UI/UX Designer application). It is the admin side of an outplacement and redeployment service: the people who run programmes, coaches and employer HR. Built to look like a 2022 SaaS dashboard on purpose.

- React 18, Vite 5, HashRouter, Feather icons (`react-icons/fi`), ApexCharts (`react-apexcharts`), plain CSS. Poppins. Grey canvas, white cards with soft shadows, 16 px corners, one royal blue `#4c6fff`; stage colours are status, not accents. Light and dark from the system setting.
- Screens: Overview (KPIs, placements per week, journey funnel, flagged check-ins, today's sessions, seats, recently landed), Participants (stage tabs, filters, sort, bulk assign and nudge, CSV export, pagination), participant profile (stage stepper, mood trend, flags, skills, coach note, coach change, internal matches, activity, sessions), Programmes, Coaches (caseload limits with a rebalance suggestion), Sessions (week calendar with overlap lanes), Redeployment (open internal roles matched by skills, propose to HR), Job market (demand heatmap by metro), Reports (charts and exports), Settings (organisation, roles, privacy defaults, integrations).
- Two roles from the account menu: Pathwell programme lead (all programmes) and employer HR (Northwind only). HR sees names only for people who agreed to share, never moods or coach notes.
- Mock data in `src/data.js` from a fixed seed. Demo clock Thu 13 Oct 2022. Store `pw-state-v1`.
- Reference used for the product frame: Randstad RiseSmart and its RiseSmart Insight HR dashboard. Pathwell is not affiliated with Pelgo or Randstad; all companies, people and figures are samples.

`npm ci && npm run build` outputs to `dist/`.
