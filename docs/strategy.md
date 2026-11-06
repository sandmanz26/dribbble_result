# Strategy notes

## Why this exists
The owner is applying for a UI/UX Designer role at Pelgo, an AI career transition platform (outplacement, reskilling, redeployment, human coaching). This is a self-initiated concept that shows the admin side of such a product, styled as it would have looked in 2022.

## Research (public sources)
- Pelgo: lower-cost outplacement sold to HR teams and universities; resume builder for ATS, job market heatmaps, 1:1 coaching scheduler, sentiment tracking, placement analytics, alumni community; seed round Feb 2026.
- Randstad RiseSmart: outplacement plus redeployment; RiseSmart Insight gives HR real-time landing rates, engagement and satisfaction in one dashboard. Used as the reference for the admin frame.
- Careerminds: workforce intelligence that maps skills to find redeployment paths before layoffs.

## Who uses the admin
1. Programme lead at the provider: health of every programme, who needs a check-in, coach capacity.
2. Coach (partly): sessions and caseload.
3. Employer HR: outcomes they pay for (landing rate, days to land, redeployment), seats, open internal roles. Never private data.

## Decisions
- Privacy is a feature: consent to share with HR, mood and notes private to coach, totals for the rest.
- Flags are explainable (no activity for N days, mood drop, many applications with few interviews, low resume score) instead of a black-box risk score.
- Redeployment as matching on skills with a person in the loop: the provider proposes, HR invites.
- Coach caseload limits with a concrete rebalance suggestion.
