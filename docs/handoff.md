# Rawat: handoff notes

## Structure
- `src/data/`: synthetic clinic, patients, drugs (batches), visits, jobs, Asa tasks, month figures.
- `src/store.tsx`: the API stand-in. Every write is optimistic; jobs to BPJS and SATUSEHAT run as
  background jobs (`queued, running, waiting, needs_review, approving, failed, done, cancelled`).
- `src/lib/billing.ts`: bill per visit by payer (capitation, non-capitation, insurance, self-pay).
- `src/lib/access.ts`: role permissions; the router guards each module.
- `src/components/kit.tsx`: state glyphs and pills, patient line, payer pill, stage path, form
  controls (Radix select, segmented), sheet, toasts with undo.

## Suggested API (Laravel)
- `POST /visits` (register), `POST /visits/:id/check-in`, `PUT /visits/:id/vitals`,
  `POST /visits/:id/consultation` (signs SOAP, dx, rx, labs, referral), `PUT /visits/:id/labs`,
  `POST /visits/:id/dispense`, `POST /visits/:id/payment`.
- Each consultation sign dispatches queued jobs: `pcare.visit`, `pcare.referral`,
  `satusehat.encounter`, `.condition`, `.observation`, `.medication_request`. Jobs retry with
  backoff (1, 2, 4, 8 min), then fail with `{ code, message, fix }`; `POST /jobs/:id/retry`.
- Realtime: `visit.updated` and `job.updated` over Laravel Reverb / Echo for the queue board and
  waiting-room screen; poll every 10 s as fallback.
- Every write carries an Idempotency-Key and the record version (409 on conflict).
