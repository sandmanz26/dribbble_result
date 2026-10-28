# GlobalTrade: forex, gold and crypto broker (project9)

Clickable prototype for the GlobalTrade brief: a premium black-and-gold broker website with sign-up,
secure log-in, a client area and a staff back office. React 18, Vite 5, react-router (HashRouter),
Carbon icons, Bodoni Moda and Jost. No backend: prices are a simulated demo feed and all data is in `src/data/`.

- `#/` website: live trading-session clock, labelled demo charts, one order from placed to closed,
  markets, sign-up steps, one account, company facts, questions, contact.
- `#/register` four steps: account, about you, experience check, identity.
- `#/login` email and password, then a six-digit code (demo code `482913`). Demo accounts are on the page.
- `#/client?demo=client` overview with live equity and open trades, trade history, deposits and withdrawals.
- `#/staff?demo=staff` back office: queues, identity checks, money movements with written rules,
  clients (restrict or lift), support inbox. A withdrawal requested in the client area appears in the
  staff money queue, and releasing it completes it for the client.
- Saved state: one localStorage key, `gt-state-v1`.

Placeholders in square brackets (regulator, licence, company name, address, support hours, the
regulator-required risk figure) must be supplied by GlobalTrade. Nothing on the site claims a
licence, a result or a statistic that has not been given to us.

```bash
npm ci && npm run dev
npm run build   # dist/
```
