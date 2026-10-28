import type { Actor, LogEntry, Run, Task, Patient } from './types'

// Synthetic data only. The clinic, people, patients, payers' replies and numbers are invented for
// the prototype; no real patient information is used anywhere.

export const CLINIC = { name: 'Alder Street Physical Therapy', site: 'Main clinic' }

export const PATRICK: Actor = { kind: 'agent', name: 'Patrick' }
export const ME: Actor = { kind: 'human', id: 'u1', name: 'Maya Okafor', role: 'Front desk lead' }
export const DANIEL: Actor = { kind: 'human', id: 'u2', name: 'Daniel Reyes', role: 'Scheduler' }
export const PRIYA: Actor = { kind: 'human', id: 'u3', name: 'Priya Shah', role: 'Billing and authorizations' }
export const SAM: Actor = { kind: 'human', id: 'u4', name: 'Sam Whitaker, PT', role: 'Physical therapist' }

const P: Record<string, Patient> = {
  ellis: { id: 'p1', name: 'Jordan Ellis', dob: '12 Mar 1984', mrn: 'MRN 204118', payer: 'BlueCross PPO' },
  torres: { id: 'p2', name: 'Ana Torres', dob: '02 Jul 1991', mrn: 'MRN 204097', payer: 'Aetna Choice POS II' },
  bell: { id: 'p3', name: 'Marcus Bell', dob: '19 Nov 1969', mrn: 'MRN 198830', payer: 'Cigna Open Access' },
  kim: { id: 'p4', name: 'Grace Kim', dob: '27 Jan 1958', mrn: 'MRN 187402', payer: 'Aetna Medicare Advantage' },
  okoro: { id: 'p5', name: 'Daniel Okoro', dob: '08 Sep 1977', mrn: 'MRN 201560', payer: 'UnitedHealthcare Choice Plus' },
  ruiz: { id: 'p6', name: 'Lena Ruiz', dob: '15 May 2001', mrn: 'MRN 204120', payer: 'Unknown' },
  park: { id: 'p7', name: 'Henry Park', dob: '30 Apr 1949', mrn: 'MRN 176655', payer: 'Medicare Part B' },
}

export const TASKS: Task[] = [
  {
    id: 'T-2088', workflow: 'referral', title: 'Confirm which Jordan Ellis this referral is for', patient: P.ellis, state: 'needs_review', owner: ME,
    createdMin: 26, slaMin: 94, priority: 'high', confidence: 0.71, runId: 'R-5583',
    summary: 'New referral from Lakeside Orthopedics for lumbar radiculopathy. Two patients match the name; the date of birth on the fax is partly smudged.',
    candidates: [
      { id: 'p1', name: 'Jordan Ellis', dob: '12 Mar 1984', mrn: 'MRN 204118', match: 0.71, why: 'Name and phone match; birth year reads as 1984 or 1964' },
      { id: 'px', name: 'Jordan Ellis', dob: '12 Mar 1964', mrn: 'MRN 166702', match: 0.64, why: 'Name matches; seen here in 2022 for a knee' },
    ],
    evidence: [
      { label: 'Patient on fax', value: 'Jordan Ellis', source: 'Page 1, top', confidence: 0.98 },
      { label: 'Date of birth', value: '03/12/1984 (last two digits unclear)', source: 'Page 1', confidence: 0.58 },
      { label: 'Diagnosis', value: 'M54.16 Radiculopathy, lumbar region', source: 'Page 1', confidence: 0.96 },
      { label: 'Order', value: 'PT evaluate and treat, 2 times a week for 6 weeks', source: 'Page 2', confidence: 0.93 },
      { label: 'Referring provider', value: 'Dr. Ellen Hale, Lakeside Orthopedics', source: 'Cover sheet', confidence: 0.99 },
    ],
    proposal: { verb: 'Attach this referral to the chosen patient and start the insurance check', effects: ['Referral filed to the patient chart', 'Eligibility check (270) sent to BlueCross'], reversible: true, risk: 'medium', rule: 'Ask when a patient match is below 90%' },
  },
  {
    id: 'T-2086', workflow: 'scheduling', title: 'Book the initial evaluation for Ana Torres', patient: P.torres, state: 'needs_review', owner: ME,
    createdMin: 41, slaMin: 19, priority: 'urgent', confidence: 0.92, runId: 'R-5579',
    summary: 'Authorization is approved for 12 visits and the first must happen before 6 Nov. Patrick found the earliest slot that fits her stated mornings.',
    evidence: [
      { label: 'Authorization', value: 'Aetna #A-77310492, 12 visits, valid to 31 Dec', source: 'Payer portal, 28 Oct' },
      { label: 'Patient prefers', value: 'Weekday mornings, no Fridays', source: 'Intake call, 27 Oct' },
      { label: 'Therapist', value: 'Sam Whitaker, PT (spine caseload)', source: 'Referral order' },
    ],
    proposal: { verb: 'Book Tue 3 Nov, 09:30 to 10:30 with Sam Whitaker, Room 2, and text Ana a confirmation', effects: ['Appointment created in the schedule', 'Text message sent to the patient', 'Referring office notified by fax'], reversible: true, risk: 'medium', rule: 'Ask before booking an initial evaluation' },
  },
  {
    id: 'T-2084', workflow: 'eligibility', title: 'Coverage ended for Marcus Bell', patient: P.bell, state: 'needs_review', owner: ME,
    createdMin: 64, slaMin: 176, priority: 'high', confidence: 0.99, runId: 'R-5571',
    summary: 'The payer reply (271) shows his Cigna plan inactive since 30 Sep. He has a visit tomorrow at 15:00.',
    evidence: [
      { label: 'Payer reply', value: 'Coverage inactive, end date 30 Sep 2026', source: 'Cigna 271, 13:02' },
      { label: 'Next visit', value: 'Thu 29 Oct, 15:00 with Rosa Lin, PT', source: 'Schedule' },
      { label: 'Visits this plan year', value: '9 of 20 used', source: 'Billing' },
    ],
    proposal: { verb: 'Hold tomorrow\'s visit and text Marcus asking for his new insurance card', effects: ['Visit marked "on hold, insurance"', 'Text message to the patient about coverage'], reversible: true, risk: 'high', rule: 'Always ask before messaging a patient about money' },
  },
  {
    id: 'T-2081', workflow: 'prior_auth', title: 'Aetna wants progress notes for Grace Kim', patient: P.kim, state: 'needs_review', owner: SAM,
    createdMin: 190, slaMin: 1250, priority: 'normal', runId: 'R-5560',
    summary: 'Request for continued visits came back pended. The payer asks for the last two progress notes with functional scores. Patrick cannot write clinical notes; handed to Sam.',
    evidence: [
      { label: 'Payer request', value: 'Submit progress notes dated after 1 Oct with functional outcome scores', source: 'Aetna portal message' },
      { label: 'Due', value: 'Mon 2 Nov', source: 'Aetna portal' },
    ],
  },
  {
    id: 'T-2079', workflow: 'eligibility', title: 'Insurance check failed for Daniel Okoro', patient: P.okoro, state: 'failed', owner: PATRICK,
    createdMin: 38, slaMin: 82, priority: 'normal', runId: 'R-5576',
    summary: 'UnitedHealthcare did not answer three times in a row. Patrick will try again by itself; you can call instead.',
    failure: { code: 'PAYER_TIMEOUT', message: 'No reply from UnitedHealthcare within 60 seconds', attempts: 3, maxAttempts: 5, nextRetryInMin: 12,
      options: [
        { id: 'retry', label: 'Retry now', detail: 'Sends the same request again (attempt 4 of 5).', primary: true },
        { id: 'phone', label: 'I\'ll call the payer', detail: 'Patrick stops retrying and gives you the numbers and questions to ask.' },
        { id: 'skip', label: 'Check at the visit', detail: 'Mark as unverified; the front desk checks the card on arrival.' },
      ] },
  },
  {
    id: 'T-2077', workflow: 'referral', title: 'Two fax pages were unreadable', patient: P.ruiz, state: 'failed', owner: PATRICK,
    createdMin: 72, slaMin: 48, priority: 'high', runId: 'R-5573',
    summary: 'A referral for Lena Ruiz arrived with pages 2 and 3 almost blank. Without them Patrick has no order or diagnosis.',
    failure: { code: 'PAGES_UNREADABLE', message: 'Pages 2 and 3: less than 5% of text recovered', attempts: 1, maxAttempts: 1,
      options: [
        { id: 'resend', label: 'Ask the sender to fax again', detail: 'Patrick faxes Northgate Family Medicine a short request with the page numbers.', primary: true },
        { id: 'manual', label: 'Enter the referral by hand', detail: 'Opens the referral form with page 1 already filled in.' },
      ] },
  },
  {
    id: 'T-2090', workflow: 'referral', title: 'Reading a new referral fax', state: 'running', owner: PATRICK, createdMin: 2, priority: 'normal', runId: 'R-5585',
    summary: 'Four pages from Riverside Spine Center.', progress: { done: 2, total: 4, label: 'pages read' },
  },
  {
    id: 'T-2089', workflow: 'eligibility', title: 'Checking insurance for tomorrow\'s visits', state: 'running', owner: PATRICK, createdMin: 9, priority: 'normal',
    summary: 'Batch check for Thursday 29 Oct.', progress: { done: 11, total: 18, label: 'patients checked' },
  },
  {
    id: 'T-2087', workflow: 'prior_auth', title: 'Prior authorization for Henry Park', patient: P.park, state: 'waiting', owner: PATRICK, createdMin: 2830, priority: 'normal',
    summary: 'Submitted to Medicare contractor on Mon 26 Oct.', waitingOn: 'Payer decision, Patrick checks again at 16:00',
  },
  {
    id: 'T-2091', workflow: 'reminders', title: 'Reminder texts for Thursday', state: 'queued', owner: PATRICK, createdMin: 1, priority: 'normal',
    summary: '34 patients, sends at 17:00 so replies arrive before the clinic closes.',
  },
]

export const DONE_TODAY = [
  { id: 'T-2083', title: 'Referral filed for Amir Haddad', min: 52, by: PATRICK },
  { id: 'T-2082', title: 'Eligibility confirmed for 6 patients', min: 75, by: PATRICK },
  { id: 'T-2080', title: 'Rescheduled Ines Moreau to Fri 30 Oct', min: 96, by: DANIEL },
  { id: 'T-2078', title: 'Prior authorization approved for Tomás Vega', min: 130, by: PATRICK },
  { id: 'T-2076', title: 'Referral filed for Ruth Abara', min: 151, by: PATRICK },
]

export const RUNS: Run[] = [
  {
    id: 'R-5583', taskId: 'T-2088', workflow: 'referral', title: 'New referral, Jordan Ellis', source: 'Fax from Lakeside Orthopedics, 4 pages', patientId: 'p1',
    steps: [
      { id: 's1', name: 'Fax received', state: 'done', startedMin: 27, durationSec: 1, detail: '4 pages from the Lakeside Orthopedics fax line.' },
      { id: 's2', name: 'Pages read', state: 'done', startedMin: 27, durationSec: 18, detail: 'Text recovered from all 4 pages.', output: [{ label: 'Quality', value: '3 pages clear, 1 page partly smudged' }] },
      { id: 's3', name: 'Document sorted', state: 'done', startedMin: 26, durationSec: 2, detail: 'New patient referral, physical therapy.', output: [{ label: 'Confidence', value: '97%' }] },
      { id: 's4', name: 'Patient matched', state: 'needs_review', startedMin: 26, detail: 'Two possible patients. Asked Maya Okafor at 13:41.', output: [{ label: 'Best match', value: '71%, below the 90% rule' }] },
      { id: 's5', name: 'Insurance checked', state: 'queued', detail: 'Waits for the patient match.' },
      { id: 's6', name: 'Initial evaluation booked', state: 'queued', detail: 'Proposes the earliest slot that fits the order.' },
      { id: 's7', name: 'Patient and referrer told', state: 'queued', detail: 'Text to the patient, fax back to Lakeside Orthopedics.' },
    ],
  },
  {
    id: 'R-5576', taskId: 'T-2079', workflow: 'eligibility', title: 'Insurance check, Daniel Okoro', source: 'Visit Thu 29 Oct, 10:00', patientId: 'p5',
    steps: [
      { id: 's1', name: 'Request built', state: 'done', startedMin: 38, durationSec: 1, detail: 'Member ID and date of birth from the chart.' },
      { id: 's2', name: 'Sent to UnitedHealthcare (270)', state: 'failed', startedMin: 38, detail: 'No reply within 60 seconds, three attempts.',
        attempts: [
          { at: '13:29', result: 'Timed out after 60 s', ok: false },
          { at: '13:31', result: 'Timed out after 60 s (waited 2 min)', ok: false },
          { at: '13:35', result: 'Timed out after 60 s (waited 4 min)', ok: false },
        ] },
      { id: 's3', name: 'Reply read (271)', state: 'queued', detail: 'Benefits, copay and visit limits.' },
      { id: 's4', name: 'Result filed', state: 'queued', detail: 'Saved to the chart; problems become a task.' },
    ],
  },
]

export const LOG: LogEntry[] = [
  { id: 'l1', min: 1, actor: PATRICK, verb: 'queued', object: 'Reminder texts for Thursday (34 patients)', result: 'ok', taskId: 'T-2091' },
  { id: 'l2', min: 2, actor: PATRICK, verb: 'started reading', object: 'Fax from Riverside Spine Center', result: 'ok', taskId: 'T-2090' },
  { id: 'l3', min: 9, actor: PATRICK, verb: 'started checking', object: 'Insurance for 18 visits on Thu 29 Oct', result: 'ok', taskId: 'T-2089' },
  { id: 'l4', min: 26, actor: PATRICK, verb: 'asked Maya to confirm', object: 'Patient match for a Lakeside Orthopedics referral', result: 'asked', taskId: 'T-2088' },
  { id: 'l5', min: 34, actor: PATRICK, verb: 'retried', object: 'Insurance check for Daniel Okoro (attempt 3)', result: 'failed', taskId: 'T-2079' },
  { id: 'l6', min: 41, actor: PATRICK, verb: 'asked Maya to approve', object: 'Initial evaluation for Ana Torres', result: 'asked', taskId: 'T-2086' },
  { id: 'l7', min: 52, actor: PATRICK, verb: 'filed', object: 'Referral for Amir Haddad to his chart', result: 'ok', undo: true },
  { id: 'l8', min: 64, actor: PATRICK, verb: 'asked Maya to approve', object: 'Hold visit and text Marcus Bell about coverage', result: 'asked', taskId: 'T-2084' },
  { id: 'l9', min: 72, actor: PATRICK, verb: 'could not read', object: 'Pages 2 and 3 of a Northgate Family Medicine fax', result: 'failed', taskId: 'T-2077' },
  { id: 'l10', min: 75, actor: PATRICK, verb: 'confirmed coverage', object: '6 patients for Wed 28 Oct', result: 'ok' },
  { id: 'l11', min: 96, actor: DANIEL, verb: 'rescheduled', object: 'Ines Moreau to Fri 30 Oct, 11:00', result: 'ok', undo: true },
  { id: 'l12', min: 130, actor: PATRICK, verb: 'recorded approval', object: 'Prior authorization for Tomás Vega, 8 visits', result: 'ok' },
  { id: 'l13', min: 151, actor: PATRICK, verb: 'filed', object: 'Referral for Ruth Abara to her chart', result: 'ok', undo: true },
  { id: 'l14', min: 190, actor: PATRICK, verb: 'handed to Sam', object: 'Progress notes requested for Grace Kim', result: 'asked', taskId: 'T-2081' },
  { id: 'l15', min: 212, actor: PRIYA, verb: 'changed rule', object: '"Book follow-up visits" from Ask first to Do it', result: 'ok' },
]

// Work by hour for the Today chart: items finished by Patrick and by people, 08:00 to 14:00.
export const HOURS = [
  { h: '08', agent: 9, human: 3 }, { h: '09', agent: 14, human: 5 }, { h: '10', agent: 12, human: 6 },
  { h: '11', agent: 10, human: 4 }, { h: '12', agent: 7, human: 2 }, { h: '13', agent: 11, human: 4 },
]

export const UPCOMING = [
  { path: 'scheduling', label: 'Schedule', what: 'The day and week view with Patrick\'s proposed bookings shown as drafts until approved.' },
  { path: 'authorizations', label: 'Authorizations', what: 'Every open prior authorization with payer, visits approved and used, and the date it runs out.' },
  { path: 'patients', label: 'Patients', what: 'Patient record with referrals, coverage history and every action Patrick took for them.' },
  { path: 'messages', label: 'Messages', what: 'Texts and replies Patrick sends and reads, with the hand-off point to staff.' },
  { path: 'reports', label: 'Reports', what: 'Time to first visit, referrals lost, denials and how much work Patrick finished alone.' },
  { path: 'integrations', label: 'Integrations', what: 'EHR, fax line, payer clearinghouse and text provider connections with their health.' },
]
