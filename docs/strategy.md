# Pamit, strategy notes

## Brief (owner, 8 Nov 2026)
Same job as pelgo.com, but an internal tool for an Indonesian company. English system language. Tailwind admin
panel, front end only with mock data. Login, no sidebar (four home cards), create offboarding (internal or external,
division, employee, reason, email template, exit status), employee assets and data shown on pick, list with
statuses (accepted, negotiating, and more), rules and documents, settings.

## Decisions (HR and product)
- **Internal vs external** means workforce: internal is on our payroll (PKWTT, PKWT); external is outsourced or
  freelance, where the vendor settles the worker's rights and we only collect assets and close access.
- **Exit types** follow PP 35/2021: resignation, layoff (efficiency), termination for cause, PKWT contract end,
  mutual agreement, retirement; external: end of assignment, replacement request, return for cause.
- **Pelgo idea kept:** for layoffs the form checks internal openings against the person's skills first and can
  offer a role (status "Redeployment offered"); accepting closes the case as withdrawn, redeployed.
- **Statuses** (thought through beyond accepted/negotiating): Draft, Awaiting response, Negotiating, Redeployment
  offered, Bipartite (30-day limit, UU 2/2004), Mediation (Disnaker), Accepted, Clearance, Final settlement,
  Completed, Withdrawn. List tabs group them: waiting on employee, in dispute, exiting, closed, drafts.
- **Settlement estimate** under PP 35/2021: severance months by tenure, UPMK, leave payout (wage/21 or /25 by work
  week), separation pay per PKB, PKWT compensation, PPh 21 final brackets, loan and lost-asset deductions. Labelled
  as an estimate everywhere.
- **Clearance** builds itself from the employee record: every asset (IT or GA signs), every system (IT closes),
  loans (Finance), plus standard items (handover, exit interview, BPJS, PPh 21 / 1721-A1).
- **Documents** are bilingual where Indonesian is required (UU 24/2009): acceptance letter, Surat PHK, Perjanjian
  Bersama, BAST, clearance form, settlement statement, paklaring, JKP letter, BPJS report, vendor letter.
- Login has no password field (an earlier project was flagged as phishing): SSO button, one-time code, demo users.

## Login pass (9 Nov 2026)
Owner asked for an image on the login page. Picked an Unsplash photo of an empty desk by a window with a letter left on it (the desk someone leaves behind), warm light that matches the clay accent. A Jakarta skyline was rejected because bank and hotel logos were visible. Split layout: photo with headline and the legal frame on the left, sign-in form on the right; on phones the photo is a banner above the form. Still no password field (phishing flag risk for the shared domain): email with one-time code, or single sign-on.

## Open
- Uang pisah formula is a sample PKB rule; the client's PKB decides.
- Wages, cases and the company are invented. Legal review needed before real use.
