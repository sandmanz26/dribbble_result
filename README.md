# Rawat: clinic operations for Indonesian primary clinics

A portfolio design and front-end project: an operations platform for a klinik pratama (primary
clinic) that serves BPJS, self-pay and insurance patients, with an AI assistant, Asa, that handles
routine administration and asks staff where a rule says so. The clinic (Klinik Pratama Kenanga
Medika, Bandung), its staff and patients are fictional; all data is synthetic.

Hosted on the portfolio hub at `/rawat/` (password protected, never indexed). The earlier link
`/flowdirector/` serves the same build.

## Modules
- **Today**: the clinic floor as one line (patients at each station, longest wait), the role's own
  work, Asa's asks, system health, contact rate.
- **Front desk**: patient search by name, NIK, BPJS or RM; live BPJS participant check (active,
  inactive, registered at another FKTP, with what to do); new medical record with NIK validation;
  Mobile JKN bookings check-in; queue ticket; one open visit per patient.
- **Queue board** and a **waiting room screen** (`#/display`).
- **Vitals and triage**: out-of-range flags as you type, BMI, suggested triage, red jumps the queue.
- **Consultations**: doctor's queue with call next; SOAP with an Asa draft that the doctor must sign;
  ICD-10 search; flags for the 144 diagnoses a primary clinic treats to completion; prescriptions
  checked against allergies, stock and the national formulary; lab orders; procedures; BPJS referral
  with medical indication.
- **Lab**: point-of-care results with reference ranges, back to the ordering doctor.
- **Pharmacy**: review, pick by batch (first expiry first out), label, counsel, hand over.
- **Cashier**: bill per visit; capitation, non-capitation claim, insurance, or self-pay by QRIS,
  cash (with change) or debit.
- **Patients**: records with identity, cover, allergies, Prolanis, visits; record opening is logged.
- **Doctor schedule** (published to Mobile JKN), **Drug stock** (batches, expiry, minimums,
  purchase orders), **BPJS and SATUSEHAT** (every sync as a job with state, error, fix and retry),
  **Reports** (KBK indicators, income by payer, waits, LB1 top diagnoses), **Asa** (asks, done,
  rules), **Activity log**, **Settings** (staff IHS numbers, roles, connections).
- **Roles**: switch between manager, front desk, nurse, doctor, pharmacist and cashier from the top
  right; the menu and access change. Screens show loading, empty, error and no-access states
  (`?state=loading|empty|error`).

## Stack
React 18 + TypeScript, Vite 5 (`base: './'`), HashRouter, Tailwind v4, Radix (dialog, popover,
select, tabs, tooltip, switch), class-variance-authority, Radix Icons. Plus Jakarta Sans and Commit
Mono (IDs), self-hosted. In-memory state; the selected demo role is kept under `rw-role`.

Docs: `docs/research.md` (regulations, business model, competitors), `docs/strategy.md`,
`docs/handoff.md`, `docs/recap.md`.

```bash
npm ci && npm run dev
npm run build   # type-checks, then builds dist/
```
