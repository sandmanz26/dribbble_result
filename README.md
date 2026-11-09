# Pamit, offboarding admin (prototype)

Internal offboarding system for an Indonesian company (sample: PT Arunika Daya Nusantara), in the spirit of Pelgo's
transition tooling. English UI, Indonesian rules. Front end only: Vite, Tailwind v4, plain JavaScript modules, mock data.

- `#/login` sign in: any work email or the single sign-on button signs in as the admin (Rani Wulandari, full access). Roles are hidden for the demo
- `#/` home with four cards: create, list, rules and documents, settings
- `#/new` create an offboarding (`?type=layoff`, `?workforce=external`, `?emp=ADN-1903-0142`)
- `#/offboarding` list with stages and filters; `#/offboarding/OFB-2026-032/response` case detail
- `#/rules/exit|templates|documents|checklist`, `#/settings/company|users|notifications|integrations|appearance`

State: localStorage `pmt-state-v1`, session `pmt-session-v1`. Demo clock Mon 9 Nov 2026.
Icons: Majesticons through `@iconify/tailwind4`. Fonts: Wix Madefor Display (headings) and Wix Madefor Text. One accent, blue `#2457d6`, on a cool ground `#eef2f8`. Rounded system: 24 to 28 px cards, 14 px fields, pill buttons, tabs and header.

```
npm ci && npm run build   # dist/
```

Login photo: Annie Spratt on Unsplash (photo hQEvJZ2FWVM), self-hosted in `public/img/` as WebP, credited on the login page.
