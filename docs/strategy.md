# Rawat: strategy

## Problem
A primary clinic juggles three payers, two national systems (BPJS, SATUSEHAT), a pharmacy and a
queue that decides whether patients come back. Staff re-type data between systems, find out about
rejected submissions days later, and nobody sees the whole floor at once.

## Goals
1. Every patient through the clinic in under 60 minutes, visibly.
2. Nothing sent to BPJS or SATUSEHAT fails silently; every failure says how to fix it.
3. Capitation kept whole: KBK indicators visible daily, not at month end.
4. Administrative work moved to Asa; clinical decisions stay with clinicians.

## Information architecture
Patient flow (front desk, queue, vitals, consultation, lab, pharmacy, cashier) in the order a
patient walks; records (patients, schedule); operations (stock, integrations, reports); clinic (Asa,
activity, settings). Each role sees only its part.

## Key UX decisions
- One line for the whole floor, reused on Today, the queue board and every visit (the patient path).
- BPJS status is checked the moment a patient is chosen, with the next step for each outcome.
- One open visit per patient; one patient in the room per doctor.
- Asa drafts but never signs; asks show the proposal, its effects and the rule that stopped it.
- Background jobs share eight states and always show attempts, error code and fix.
- Rupiah, NIK, BPJS and RM formats as staff know them; identifiers masked on screen.

## Visual language
Framed sheet: a stone-tinted frame, white working sheet, pine green as the only brand colour, status
colour only where state matters. Plus Jakarta Sans (designed for Jakarta) with Commit Mono for IDs.
