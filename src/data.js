// Mock data for Pamit. Everything here is a sample: the company, people, wages and cases are invented.

export const COMPANY = {
  name: 'PT Arunika Daya Nusantara',
  short: 'Arunika',
  npwp: '[NPWP placeholder]',
  address: 'Menara Kuningan Lt. 18, Jl. HR Rasuna Said Kav. 5, Jakarta Selatan 12940',
  workweek: 5,
}

export const DEMO_TODAY = '2026-11-09'

export const DIVISIONS = [
  { id: 'fin', name: 'Finance & Accounting', head: 'Lina Marlina' },
  { id: 'ppl', name: 'People & Culture', head: 'Rani Wulandari' },
  { id: 'tech', name: 'Technology', head: 'Arif Setiawan' },
  { id: 'ops', name: 'Operations', head: 'Bambang Sutrisno' },
  { id: 'sales', name: 'Sales & Commercial', head: 'Clara Situmorang' },
  { id: 'scm', name: 'Supply Chain', head: 'Joko Susilo' },
  { id: 'legal', name: 'Legal & Compliance', head: 'Teguh Santoso' },
  { id: 'cs', name: 'Customer Care', head: 'Wulan Sari' },
]

export const LOCATIONS = {
  jkt: 'Jakarta HQ, Kuningan',
  sby: 'Surabaya branch',
  bdg: 'Bandung branch',
  ckr: 'Cikarang distribution centre',
  mdn: 'Medan warehouse',
}

export const VENDORS = {
  mks: { name: 'PT Mitra Karya Sejahtera', service: 'Security and facility staff', pic: 'Pak Yusuf (account manager)' },
  tlt: { name: 'PT Talenta Layanan Terpadu', service: 'Contact centre agents', pic: 'Bu Indah (account manager)' },
  free: { name: 'Direct freelance contract', service: 'Project-based freelancers', pic: 'Procurement' },
}

// Asset kinds. `dept` is who signs the return.
export const ASSET_KINDS = {
  lt: { label: 'Laptop', dept: 'IT', value: 18500000, model: ['ThinkPad T14 Gen 4', 'MacBook Air 13 M2', 'Latitude 5440'] },
  mon: { label: 'Monitor', dept: 'IT', value: 3200000, model: ['Dell P2423 24"'] },
  ph: { label: 'Company phone', dept: 'IT', value: 4900000, model: ['Galaxy A55', 'Redmi Note 13'] },
  sim: { label: 'Corporate SIM (postpaid)', dept: 'IT', value: 0, model: ['Telkomsel Halo'] },
  tab: { label: 'Tablet', dept: 'IT', value: 6400000, model: ['Galaxy Tab S9 FE'] },
  scn: { label: 'Handheld scanner', dept: 'GA', value: 9800000, model: ['Zebra TC21'] },
  id: { label: 'ID and access card', dept: 'GA', value: 75000, model: ['RFID badge'] },
  key: { label: 'Locker and drawer keys', dept: 'GA', value: 0, model: ['Key set'] },
  car: { label: 'Operational car', dept: 'GA', value: 265000000, model: ['Toyota Avanza 1.5 G'] },
  mtr: { label: 'Operational motorbike', dept: 'GA', value: 21000000, model: ['Honda Vario 125'] },
  uni: { label: 'Uniform set', dept: 'GA', value: 650000, model: ['3 shirts, 1 jacket'] },
  cc: { label: 'Corporate card', dept: 'Finance', value: 0, model: ['Expense card, limit Rp 25 jt'] },
}

export const SYSTEMS = {
  mail: 'Email and workspace',
  hris: 'HRIS (self-service)',
  erp: 'ERP finance module',
  crm: 'CRM',
  repo: 'Code repository',
  cloud: 'Cloud console',
  vpn: 'VPN',
  wms: 'Warehouse system',
  tix: 'Ticketing desk',
  bank: 'Bank portal (approver)',
}

// [empNo, name, type, contract, div, position, grade, loc, joinDate, contractEnd, base, allowance, leaveLeft, manager, vendor, assets, systems, loans, skills]
const ROWS = [
  ['ADN-1903-0142', 'Dimas Pratama', 'internal', 'PKWTT', 'tech', 'Senior Backend Engineer', 'G6', 'jkt', '2019-03-11', null, 27500000, 2500000, 9, 'Arif Setiawan', null, 'lt mon ph id', 'mail hris repo cloud vpn', 0, 'backend payments go postgres'],
  ['ADN-2107-0388', 'Rizky Firmansyah', 'internal', 'PKWTT', 'tech', 'QA Engineer', 'G4', 'bdg', '2021-07-05', null, 14200000, 1200000, 6, 'Arif Setiawan', null, 'lt id', 'mail hris repo vpn tix', 0, 'testing automation sql data'],
  ['ADN-2302-0611', 'Yoga Prasetyo', 'internal', 'PKWTT', 'tech', 'Mobile Engineer', 'G5', 'bdg', '2023-02-13', null, 19800000, 1500000, 11, 'Arif Setiawan', null, 'lt ph id', 'mail hris repo vpn', 0, 'android kotlin mobile'],
  ['ADN-2009-0207', 'Kevin Halim', 'internal', 'PKWTT', 'tech', 'Data Analyst', 'G4', 'jkt', '2020-09-01', null, 15500000, 1200000, 4, 'Arif Setiawan', null, 'lt id', 'mail hris cloud vpn', 0, 'sql data dashboards python'],
  ['ADN-2405-0702', 'Galih Ramadhan', 'internal', 'PKWT', 'tech', 'IT Support Specialist', 'G3', 'jkt', '2024-05-02', '2026-12-31', 8900000, 800000, 3, 'Arif Setiawan', null, 'lt ph id key', 'mail hris tix vpn', 0, 'support hardware network'],

  ['ADN-1608-0051', 'Siti Rahmawati', 'internal', 'PKWTT', 'ops', 'Branch Operations Supervisor', 'G5', 'bdg', '2016-08-15', null, 16800000, 2000000, 14, 'Bambang Sutrisno', null, 'lt ph id key mtr', 'mail hris erp wms', 3500000, 'operations scheduling people-lead logistics'],
  ['ADN-1811-0119', 'Hendra Gunawan', 'internal', 'PKWTT', 'ops', 'Fleet Coordinator', 'G4', 'ckr', '2018-11-19', null, 12400000, 1500000, 8, 'Bambang Sutrisno', null, 'ph id car', 'mail hris wms', 0, 'fleet logistics scheduling'],
  ['ADN-2201-0455', 'Eko Purnomo', 'internal', 'PKWTT', 'ops', 'Operations Admin', 'G2', 'bdg', '2022-01-10', null, 7200000, 600000, 5, 'Siti Rahmawati', null, 'lt id', 'mail hris wms', 0, 'admin data-entry scheduling'],
  ['ADN-2206-0490', 'Ratna Sari Dewi', 'internal', 'PKWTT', 'ops', 'Dispatcher', 'G2', 'bdg', '2022-06-06', null, 6900000, 600000, 7, 'Siti Rahmawati', null, 'ph id uni', 'mail hris wms', 1200000, 'dispatch logistics customer'],

  ['ADN-1505-0022', 'Andi Saputra', 'internal', 'PKWTT', 'sales', 'Key Account Manager', 'G6', 'sby', '2015-05-04', null, 24000000, 4500000, 2, 'Clara Situmorang', null, 'lt ph id car cc', 'mail hris crm erp', 0, 'sales negotiation accounts'],
  ['ADN-1910-0168', 'Fajar Nugroho', 'internal', 'PKWTT', 'sales', 'Area Sales Manager', 'G6', 'sby', '2019-10-07', null, 22500000, 4000000, 6, 'Clara Situmorang', null, 'lt ph id car cc', 'mail hris crm', 0, 'sales people-lead negotiation'],
  ['ADN-2303-0624', 'Bella Anastasia', 'internal', 'PKWT', 'sales', 'Sales Executive', 'G3', 'jkt', '2023-03-20', '2027-03-19', 9500000, 1800000, 5, 'Clara Situmorang', null, 'lt ph id', 'mail hris crm', 0, 'sales customer presentations'],
  ['ADN-2104-0340', 'Irfan Hakim', 'internal', 'PKWTT', 'sales', 'Pricing Analyst', 'G4', 'jkt', '2021-04-12', null, 15000000, 1200000, 9, 'Clara Situmorang', null, 'lt id', 'mail hris crm erp', 0, 'pricing data sql excel'],

  ['ADN-0907-0004', 'Budi Hartono', 'internal', 'PKWTT', 'scm', 'Warehouse Manager', 'G6', 'mdn', '2009-07-01', null, 21000000, 3500000, 18, 'Joko Susilo', null, 'lt ph id key car', 'mail hris wms erp', 0, 'warehouse people-lead logistics'],
  ['ADN-2008-0190', 'Taufik Hidayat', 'internal', 'PKWTT', 'scm', 'Inventory Controller', 'G3', 'ckr', '2020-08-17', null, 9800000, 900000, 10, 'Joko Susilo', null, 'scn id uni', 'mail hris wms', 0, 'inventory data logistics'],
  ['ADN-2502-0731', 'Wahyu Kurniawan', 'internal', 'PKWT', 'scm', 'Warehouse Staff', 'G1', 'ckr', '2025-02-03', '2026-11-30', 5600000, 400000, 6, 'Taufik Hidayat', null, 'scn id uni', 'wms', 0, 'warehouse forklift'],
  ['ADN-1712-0098', 'Sri Mulyani Putri', 'internal', 'PKWTT', 'scm', 'Procurement Officer', 'G4', 'jkt', '2017-12-04', null, 14600000, 1300000, 12, 'Joko Susilo', null, 'lt id', 'mail hris erp', 0, 'procurement negotiation vendors'],

  ['ADN-2011-0221', 'Maya Anggraini', 'internal', 'PKWTT', 'fin', 'Senior Accountant', 'G5', 'jkt', '2020-11-02', null, 19500000, 1800000, 7, 'Lina Marlina', null, 'lt id', 'mail hris erp bank', 0, 'accounting tax reporting'],
  ['ADN-2209-0512', 'Arief Rachman', 'internal', 'PKWTT', 'fin', 'Tax Officer', 'G4', 'jkt', '2022-09-12', null, 14000000, 1100000, 9, 'Lina Marlina', null, 'lt id', 'mail hris erp', 0, 'tax accounting'],
  ['ADN-2401-0680', 'Citra Ayu Lestari', 'internal', 'PKWT', 'fin', 'AP Staff', 'G2', 'jkt', '2024-01-15', '2027-01-14', 7800000, 600000, 4, 'Maya Anggraini', null, 'lt id', 'mail hris erp', 0, 'accounting data-entry'],

  ['ADN-1802-0101', 'Dewi Kusuma', 'internal', 'PKWTT', 'ppl', 'HR Business Partner', 'G5', 'jkt', '2018-02-05', null, 18500000, 1700000, 0, 'Rani Wulandari', null, 'lt id', 'mail hris', 0, 'hr people coaching'],
  ['ADN-2306-0640', 'Annisa Rahma', 'internal', 'PKWTT', 'ppl', 'Payroll Specialist', 'G4', 'jkt', '2023-06-05', null, 13200000, 1100000, 8, 'Rani Wulandari', null, 'lt id', 'mail hris erp', 0, 'payroll tax data'],

  ['ADN-2105-0352', 'Lukman Hakim', 'internal', 'PKWTT', 'legal', 'Legal Counsel', 'G5', 'jkt', '2021-05-17', null, 23000000, 2000000, 6, 'Teguh Santoso', null, 'lt ph id', 'mail hris', 0, 'legal contracts compliance'],

  ['ADN-2407-0711', 'Putri Lestari', 'internal', 'PKWT', 'cs', 'Customer Care Officer', 'G2', 'sby', '2024-07-01', '2026-11-30', 6200000, 500000, 2, 'Wulan Sari', null, 'id', 'mail hris tix', 0, 'customer support'],
  ['ADN-2102-0311', 'Rudi Hermawan', 'internal', 'PKWTT', 'cs', 'Customer Care Team Lead', 'G4', 'sby', '2021-02-08', null, 11800000, 1200000, 10, 'Wulan Sari', null, 'lt ph id', 'mail hris tix crm', 0, 'customer people-lead support'],
  ['ADN-2309-0655', 'Intan Permatasari', 'internal', 'PKWT', 'cs', 'Customer Care Officer', 'G2', 'jkt', '2023-09-04', '2027-09-03', 6400000, 500000, 9, 'Rudi Hermawan', null, 'id', 'mail hris tix', 0, 'customer support'],

  ['EXT-MKS-1187', 'Agus Wijaya', 'external', 'Outsourced', 'ops', 'Security Officer', '-', 'jkt', '2022-03-01', '2026-12-31', 5900000, 0, 0, 'Bambang Sutrisno', 'mks', 'id uni key', '', 0, ''],
  ['EXT-MKS-1203', 'Slamet Riyadi', 'external', 'Outsourced', 'ops', 'Facility Technician', '-', 'ckr', '2023-01-09', '2026-12-31', 6100000, 0, 0, 'Bambang Sutrisno', 'mks', 'id uni', '', 0, ''],
  ['EXT-MKS-1240', 'Joko Prabowo', 'external', 'Outsourced', 'scm', 'Forklift Operator', '-', 'ckr', '2024-04-15', '2026-12-31', 5800000, 0, 0, 'Taufik Hidayat', 'mks', 'id uni', 'wms', 0, ''],
  ['EXT-TLT-0562', 'Nurul Hidayah', 'external', 'Outsourced', 'cs', 'Contact Centre Agent', '-', 'sby', '2024-08-05', '2027-02-04', 5500000, 0, 0, 'Rudi Hermawan', 'tlt', 'id', 'tix', 0, ''],
  ['EXT-TLT-0571', 'Dian Puspita', 'external', 'Outsourced', 'cs', 'Contact Centre Agent', '-', 'sby', '2024-08-05', '2027-02-04', 5500000, 0, 0, 'Rudi Hermawan', 'tlt', 'id', 'tix', 0, ''],
  ['EXT-TLT-0603', 'Fikri Maulana', 'external', 'Outsourced', 'cs', 'Contact Centre Agent', '-', 'jkt', '2025-01-13', '2027-01-12', 5500000, 0, 0, 'Rudi Hermawan', 'tlt', 'id', 'tix', 0, ''],
  ['EXT-FRL-0031', 'Aditya Nugraha', 'external', 'Freelance', 'tech', 'UI Designer (freelance)', '-', 'jkt', '2026-04-01', '2026-12-31', 16000000, 0, 0, 'Arif Setiawan', 'free', 'lt', 'mail repo', 0, ''],
  ['EXT-FRL-0034', 'Sarah Wijayanti', 'external', 'Freelance', 'sales', 'Content Writer (freelance)', '-', 'jkt', '2026-06-01', '2026-11-30', 9000000, 0, 0, 'Clara Situmorang', 'free', '', 'mail crm', 0, ''],
]

function serial(empNo, k) {
  let h = 0
  for (const c of empNo + k) h = (h * 31 + c.charCodeAt(0)) % 99991
  return k.toUpperCase().slice(0, 2) + '-' + String(h).padStart(5, '0')
}

export const EMPLOYEES = ROWS.map((r, i) => {
  const [empNo, name, type, contract, div, position, grade, loc, joinDate, contractEnd, base, allowance, leaveLeft, manager, vendor, assets, systems, loan, skills] = r
  const first = name.split(' ')[0].toLowerCase()
  const last = name.split(' ').slice(-1)[0].toLowerCase()
  return {
    id: empNo,
    empNo, name, type, contract, div, position, grade, loc, joinDate, contractEnd, base, allowance, leaveLeft, manager, vendor,
    email: `${first}.${last}@arunika.co.id`,
    personalEmail: `${first}${String(i * 7 + 11)}@mail.example`,
    phone: '+62 8' + String(1200000000 + i * 7919193).slice(0, 2) + ' **** ' + String(1000 + i * 37).slice(-4),
    assets: assets ? assets.split(' ').map((k, j) => {
      const kind = ASSET_KINDS[k]
      return { tag: serial(empNo, k), kind: k, label: kind.label, model: kind.model[(i + j) % kind.model.length], dept: kind.dept, value: kind.value }
    }) : [],
    systems: systems ? systems.split(' ') : [],
    loan,
    skills: skills ? skills.split(' ') : [],
  }
})

export const OPENINGS = [
  { id: 'REQ-2611', title: 'Data Quality Analyst', div: 'tech', loc: 'jkt', grade: 'G4', skills: ['sql', 'data', 'testing', 'dashboards'] },
  { id: 'REQ-2614', title: 'Customer Onboarding Specialist', div: 'cs', loc: 'sby', grade: 'G3', skills: ['customer', 'support', 'presentations'] },
  { id: 'REQ-2619', title: 'Hub Operations Lead', div: 'ops', loc: 'ckr', grade: 'G5', skills: ['operations', 'people-lead', 'logistics', 'scheduling'] },
  { id: 'REQ-2622', title: 'Demand Planner', div: 'scm', loc: 'jkt', grade: 'G4', skills: ['data', 'inventory', 'excel', 'logistics'] },
  { id: 'REQ-2625', title: 'Payroll Analyst', div: 'ppl', loc: 'jkt', grade: 'G4', skills: ['payroll', 'tax', 'accounting', 'data'] },
  { id: 'REQ-2627', title: 'Platform Engineer', div: 'tech', loc: 'jkt', grade: 'G5', skills: ['backend', 'cloud', 'go'] },
]

export const EXIT_TYPES = [
  { id: 'resign', label: 'Resignation', for: 'internal', who: 'Employee initiated', icon: 'resign' },
  { id: 'layoff', label: 'Layoff (efficiency)', for: 'internal', who: 'Company initiated', icon: 'layoff' },
  { id: 'termination', label: 'Termination for cause', for: 'internal', who: 'Company initiated', icon: 'termination' },
  { id: 'contract', label: 'Contract end (PKWT)', for: 'internal', who: 'Contract expires', icon: 'contract' },
  { id: 'mutual', label: 'Mutual agreement', for: 'internal', who: 'Both sides agree', icon: 'mutual' },
  { id: 'retire', label: 'Retirement', for: 'internal', who: 'Retirement age', icon: 'retire' },
  { id: 'ext-end', label: 'End of assignment', for: 'external', who: 'Assignment finishes', icon: 'contract' },
  { id: 'ext-replace', label: 'Replacement request', for: 'external', who: 'Ask vendor to replace', icon: 'mutual' },
  { id: 'ext-cause', label: 'Return for cause', for: 'external', who: 'Conduct or safety issue', icon: 'termination' },
]

export const REASONS = {
  resign: ['Better offer elsewhere', 'Relocation or family', 'Career change', 'Further study', 'Health', 'Work environment', 'Compensation', 'Other'],
  layoff: ['Efficiency to prevent loss', 'Efficiency due to loss', 'Branch or unit closure', 'Restructuring, role removed', 'Merger or takeover'],
  termination: ['Serious violation under the PKB (urgent)', 'Violation after third warning letter (SP3)', 'Absent 5 working days without notice', 'Detained by authorities, over 6 months'],
  contract: ['Contract ends, not renewed', 'Project finished', 'Role not budgeted for next year'],
  mutual: ['Performance, agreed exit', 'Role change declined', 'Restructuring, agreed exit', 'Other'],
  retire: ['Normal retirement age (56, per PKB)', 'Early retirement on request'],
  'ext-end': ['Vendor contract ends', 'Headcount reduction', 'Project finished'],
  'ext-replace': ['Performance below SLA', 'Skill mismatch', 'Attendance'],
  'ext-cause': ['Safety breach', 'Theft or fraud', 'Conduct'],
}

// The lifecycle. `stage` groups the list tabs.
export const STATUSES = {
  draft: { label: 'Draft', stage: 'draft', tone: 'stone', next: 'Review and send the notice' },
  sent: { label: 'Awaiting response', stage: 'response', tone: 'amber', next: 'Employee to accept, counter or ask questions' },
  negotiating: { label: 'Negotiating', stage: 'response', tone: 'orange', next: 'Answer the counter-proposal' },
  redeploy: { label: 'Redeployment offered', stage: 'response', tone: 'teal', next: 'Employee to accept or decline the internal role' },
  bipartite: { label: 'Bipartite', stage: 'dispute', tone: 'rose', next: 'Reach agreement within 30 days or go to mediation' },
  mediation: { label: 'Mediation (Disnaker)', stage: 'dispute', tone: 'red', next: 'Follow the mediator’s recommendation' },
  accepted: { label: 'Accepted', stage: 'exit', tone: 'green', next: 'Start clearance' },
  clearance: { label: 'Clearance', stage: 'exit', tone: 'lime', next: 'Collect assets, revoke access, hand over work' },
  settlement: { label: 'Final settlement', stage: 'exit', tone: 'emerald', next: 'Pay out and issue the certificate of employment' },
  completed: { label: 'Completed', stage: 'closed', tone: 'ink', next: 'Closed' },
  withdrawn: { label: 'Withdrawn', stage: 'closed', tone: 'stone', next: 'Closed, employee stays' },
}

export const STAGES = [
  { id: 'all', label: 'All' },
  { id: 'response', label: 'Waiting on employee' },
  { id: 'dispute', label: 'In dispute' },
  { id: 'exit', label: 'Exiting' },
  { id: 'closed', label: 'Closed' },
  { id: 'draft', label: 'Drafts' },
]

export const MERGE_FIELDS = [
  ['employee_name', 'Full name'],
  ['first_name', 'First name'],
  ['position', 'Position'],
  ['division', 'Division'],
  ['last_day', 'Last working day'],
  ['response_deadline', 'Response deadline'],
  ['severance_total', 'Settlement estimate'],
  ['manager', 'Line manager'],
  ['hr_contact', 'HR contact'],
  ['vendor', 'Vendor'],
  ['company', 'Company'],
]

export const EMAIL_TEMPLATES = [
  {
    id: 'tpl-resign', name: 'Resignation acknowledgment', types: ['resign'], updated: '2026-09-14', status: 'published',
    subject: 'Your resignation, next steps before {{last_day}}',
    body: `Dear {{first_name}},

Thank you for letting us know about your decision. We have recorded your resignation from the position of {{position}} in {{division}}, with your last working day on {{last_day}}.

Before then we will:
1. Agree a handover plan with {{manager}}.
2. Arrange the return of company assets and the closing of system access.
3. Prepare your final pay, unused leave and your certificate of employment.

Please confirm the last working day by replying to this email or in the self-service portal by {{response_deadline}}.

Thank you for your work with us.

{{hr_contact}}
People & Culture, {{company}}`,
  },
  {
    id: 'tpl-layoff', name: 'Layoff notice, efficiency', types: ['layoff'], updated: '2026-10-02', status: 'published',
    subject: 'Important: changes to your role, meeting invitation',
    body: `Dear {{first_name}},

Following the restructuring announced this month, the company has decided that the role of {{position}} in {{division}} will end. This is a decision about the role, not about your performance.

We would like to meet you in person to explain the decision, the settlement and the support available, including internal openings you may apply for first.

The settlement estimate under PP 35/2021 is {{severance_total}}. Details are in the attached letter.

Please let us know by {{response_deadline}} whether you accept, or if you would like to discuss the terms. You are welcome to bring a representative from the union to the meeting.

{{hr_contact}}
People & Culture, {{company}}`,
  },
  {
    id: 'tpl-termination', name: 'Termination notice', types: ['termination'], updated: '2026-08-21', status: 'published',
    subject: 'Notice of termination of employment',
    body: `Dear {{employee_name}},

Following the investigation and the meeting held with you, the company has decided to end your employment as {{position}}, effective {{last_day}}, on the grounds stated in the attached letter and the Collective Labour Agreement (PKB).

You are entitled to the payments set out in the attached settlement statement. Please return all company assets by your last day.

If you do not agree with this decision, you may respond in writing by {{response_deadline}}, and we will hold a bipartite meeting.

{{hr_contact}}
People & Culture, {{company}}`,
  },
  {
    id: 'tpl-contract', name: 'Contract end notice', types: ['contract'], updated: '2026-07-30', status: 'published',
    subject: 'Your contract ends on {{last_day}}',
    body: `Dear {{first_name}},

This is to confirm that your fixed-term contract (PKWT) as {{position}} ends on {{last_day}} and will not be renewed.

You will receive contract compensation (uang kompensasi) as required by PP 35/2021, together with your final pay. The estimate is {{severance_total}}.

Please work with {{manager}} on the handover and return your company assets by your last day.

{{hr_contact}}
People & Culture, {{company}}`,
  },
  {
    id: 'tpl-mutual', name: 'Mutual separation offer', types: ['mutual', 'layoff'], updated: '2026-10-11', status: 'published',
    subject: 'A proposal for your consideration',
    body: `Dear {{first_name}},

Thank you for the conversation earlier. As discussed, we would like to offer an agreed separation, with your last working day on {{last_day}}.

The proposed settlement is {{severance_total}}, set out in the attached draft Mutual Agreement (Perjanjian Bersama). You are free to take advice before you decide.

Please reply by {{response_deadline}}. If you would like to discuss any part of the offer, we are happy to meet.

{{hr_contact}}
People & Culture, {{company}}`,
  },
  {
    id: 'tpl-retire', name: 'Retirement notice', types: ['retire'], updated: '2026-05-18', status: 'published',
    subject: 'Preparing for your retirement on {{last_day}}',
    body: `Dear {{first_name}},

As you reach retirement age under our PKB, your last working day will be {{last_day}}. Thank you for your many years with {{company}}.

We will meet you to go through your retirement benefits, the BPJS old-age savings (JHT) claim and the handover with {{manager}}.

{{hr_contact}}
People & Culture, {{company}}`,
  },
  {
    id: 'tpl-vendor', name: 'Vendor notification', types: ['ext-end', 'ext-replace', 'ext-cause'], updated: '2026-09-03', status: 'published',
    subject: 'Assignment change: {{employee_name}}',
    body: `Dear {{vendor}},

We would like to inform you that the assignment of {{employee_name}} ({{position}}) at {{company}} will end on {{last_day}}.

Please confirm by {{response_deadline}}, and arrange the collection of the ID card and uniform on the last day. Settlement of the worker's rights remains with the vendor under our service agreement.

{{hr_contact}}
People & Culture, {{company}}`,
  },
  {
    id: 'tpl-clearance', name: 'Clearance reminder', types: [], updated: '2026-06-10', status: 'published',
    subject: 'Reminder: items to return before {{last_day}}',
    body: `Hi {{first_name}},

A friendly reminder that a few clearance items are still open. Please return them before {{last_day}} so we can process your final pay on time.

{{hr_contact}}`,
  },
  {
    id: 'tpl-retention', name: 'Retention conversation invite', types: ['resign'], updated: '2026-10-27', status: 'draft',
    subject: 'Can we talk before you go?',
    body: `Hi {{first_name}},

We received your resignation and we respect your decision. Before we process it, {{manager}} would like 30 minutes to understand your reasons and see whether anything could change.

{{hr_contact}}`,
  },
]

export const DOCUMENTS = [
  { id: 'doc-ack', name: 'Resignation acceptance letter', local: 'Surat Penerimaan Pengunduran Diri', types: ['resign'], signer: 'Head of People & Culture', lang: 'ID / EN', version: 4 },
  { id: 'doc-notice', name: 'Termination notice', local: 'Surat Pemberitahuan PHK', types: ['layoff', 'termination'], signer: 'Director', lang: 'ID / EN', version: 6 },
  { id: 'doc-pb', name: 'Mutual agreement', local: 'Perjanjian Bersama (PB)', types: ['layoff', 'mutual'], signer: 'Director and employee', lang: 'ID / EN', version: 3 },
  { id: 'doc-contract', name: 'Contract end letter and compensation statement', local: 'Surat Berakhirnya PKWT', types: ['contract'], signer: 'Head of People & Culture', lang: 'ID / EN', version: 2 },
  { id: 'doc-retire', name: 'Retirement letter', local: 'Surat Keterangan Pensiun', types: ['retire'], signer: 'Director', lang: 'ID / EN', version: 2 },
  { id: 'doc-bast', name: 'Asset handover record', local: 'Berita Acara Serah Terima (BAST)', types: ['resign', 'layoff', 'termination', 'contract', 'mutual', 'retire', 'ext-end', 'ext-replace', 'ext-cause'], signer: 'Employee, IT and GA', lang: 'ID / EN', version: 5 },
  { id: 'doc-clear', name: 'Exit clearance form', local: 'Formulir Bebas Tanggungan', types: ['resign', 'layoff', 'termination', 'contract', 'mutual', 'retire'], signer: 'All departments', lang: 'EN', version: 3 },
  { id: 'doc-settle', name: 'Final settlement statement', local: 'Rincian Hak Akhir', types: ['resign', 'layoff', 'termination', 'contract', 'mutual', 'retire'], signer: 'Payroll and employee', lang: 'ID / EN', version: 3 },
  { id: 'doc-pak', name: 'Certificate of employment', local: 'Surat Keterangan Kerja (Paklaring)', types: ['resign', 'layoff', 'contract', 'mutual', 'retire'], signer: 'Head of People & Culture', lang: 'ID / EN', version: 7 },
  { id: 'doc-jkp', name: 'Job loss benefit letter', local: 'Surat Keterangan untuk Klaim JKP', types: ['layoff', 'mutual', 'contract'], signer: 'Head of People & Culture', lang: 'ID', version: 1 },
  { id: 'doc-bpjs', name: 'BPJS deactivation report', local: 'Laporan Non-aktif BPJS Ketenagakerjaan & Kesehatan', types: ['resign', 'layoff', 'termination', 'contract', 'mutual', 'retire'], signer: 'Payroll', lang: 'ID', version: 2 },
  { id: 'doc-vendor', name: 'Vendor end-of-assignment letter', local: 'Surat Pengembalian Tenaga Kerja', types: ['ext-end', 'ext-replace', 'ext-cause'], signer: 'Head of People & Culture', lang: 'ID / EN', version: 2 },
]

// Formula keys: see severance.js
export const RULES = [
  { type: 'resign', noticeDays: 30, responseDays: 5, formula: 'resign', template: 'tpl-resign', approvals: ['HRBP', 'Line manager'], note: 'PP 35/2021: the employee applies in writing at least 30 days before the last day. Gets leave payout and separation pay (uang pisah) per PKB, no severance.' },
  { type: 'layoff', noticeDays: 30, responseDays: 7, formula: 'layoff', template: 'tpl-layoff', approvals: ['HRBP', 'Head of People & Culture', 'Legal', 'Director'], note: 'Notice must reach the employee at least 14 working days before the last day. Check internal openings first. Eligible for JKP.' },
  { type: 'termination', noticeDays: 14, responseDays: 7, formula: 'termination', template: 'tpl-termination', approvals: ['HRBP', 'Legal', 'Director'], note: 'Needs the investigation record and warning letters on file. If the employee disagrees, bipartite talks start.' },
  { type: 'contract', noticeDays: 30, responseDays: 5, formula: 'contract', template: 'tpl-contract', approvals: ['HRBP', 'Line manager'], note: 'Pay contract compensation: one month per 12 months worked, prorated (PP 35/2021, art. 15 and 16).' },
  { type: 'mutual', noticeDays: 30, responseDays: 10, formula: 'mutual', template: 'tpl-mutual', approvals: ['HRBP', 'Head of People & Culture', 'Legal'], note: 'Settlement is agreed. Register the signed PB at the Industrial Relations Court within the area.' },
  { type: 'retire', noticeDays: 90, responseDays: 14, formula: 'retire', template: 'tpl-retire', approvals: ['HRBP', 'Head of People & Culture'], note: 'Retirement age 56 per PKB. 1.75 times severance unless the pension fund already covers it.' },
  { type: 'ext-end', noticeDays: 14, responseDays: 3, formula: 'vendor', template: 'tpl-vendor', approvals: ['Line manager', 'Procurement'], note: 'Vendor pays the worker’s rights. We only collect assets and close access.' },
  { type: 'ext-replace', noticeDays: 7, responseDays: 3, formula: 'vendor', template: 'tpl-vendor', approvals: ['Line manager'], note: 'Vendor sends a replacement within the SLA in the service agreement.' },
  { type: 'ext-cause', noticeDays: 0, responseDays: 1, formula: 'vendor', template: 'tpl-vendor', approvals: ['Line manager', 'Legal'], note: 'Access revoked on the same day. Attach the incident report.' },
]

export const CLEARANCE_STANDARD = [
  { id: 'handover', label: 'Work handover document signed by line manager', dept: 'Manager', for: 'internal' },
  { id: 'exit-interview', label: 'Exit interview held', dept: 'HR', for: 'internal' },
  { id: 'bpjs', label: 'BPJS Ketenagakerjaan and Kesehatan deactivation reported', dept: 'HR', for: 'internal' },
  { id: 'pph21', label: 'Final PPh 21 calculated, form 1721-A1 prepared', dept: 'Finance', for: 'internal' },
  { id: 'vendor-confirm', label: 'Vendor confirmed the end of assignment', dept: 'HR', for: 'external' },
]

export const USERS = [
  { name: 'Rani Wulandari', email: 'rani.wulandari@arunika.co.id', role: 'HR Admin', title: 'Head of People & Culture' },
  { name: 'Yudha Pratama', email: 'yudha.pratama@arunika.co.id', role: 'HRBP', title: 'HR Business Partner' },
  { name: 'Teguh Santoso', email: 'teguh.santoso@arunika.co.id', role: 'Legal', title: 'Head of Legal & Compliance' },
  { name: 'Annisa Rahma', email: 'annisa.rahma@arunika.co.id', role: 'Payroll', title: 'Payroll Specialist' },
  { name: 'Galih Ramadhan', email: 'galih.ramadhan@arunika.co.id', role: 'IT', title: 'IT Support Specialist' },
  { name: 'Sri Handayani', email: 'sri.handayani@arunika.co.id', role: 'GA', title: 'General Affairs Officer' },
]

// Existing cases. Dates are relative to the demo clock (Mon 9 Nov 2026).
export const CASES = [
  { id: 'OFB-2026-031', emp: 'ADN-1903-0142', type: 'resign', reason: 'Better offer elsewhere', note: 'Joining a fintech in Jakarta. Open to a short consulting arrangement for the payments migration.', notice: '2026-10-21', lastDay: '2026-11-20', deadline: '2026-10-26', status: 'clearance', template: 'tpl-resign', owner: 'Yudha Pratama', created: '2026-10-21',
    log: [['2026-10-20', 'Dimas Pratama', 'Resignation letter received, last day 20 Nov', 'employee'], ['2026-10-21', 'Yudha Pratama', 'Case created and acknowledgment sent', 'system'], ['2026-10-23', 'Dimas Pratama', 'Confirmed last day in self-service', 'employee'], ['2026-11-02', 'Yudha Pratama', 'Clearance started', 'system']],
    talks: [], clear: { 'handover': 'done', 'exit-interview': 'pending', 'asset-lt': 'done', 'asset-mon': 'done', 'access-repo': 'done' }, docs: { 'doc-ack': 'signed', 'doc-bast': 'generated' } },
  { id: 'OFB-2026-032', emp: 'ADN-1608-0051', type: 'layoff', reason: 'Branch or unit closure', note: 'Bandung branch operations merge into Cikarang from January. Role removed.', notice: '2026-10-26', lastDay: '2026-12-31', deadline: '2026-11-02', status: 'negotiating', template: 'tpl-layoff', owner: 'Yudha Pratama', created: '2026-10-26', redeployOffered: false,
    log: [['2026-10-26', 'Yudha Pratama', 'Notice meeting held, letter and estimate handed over', 'system'], ['2026-10-30', 'Siti Rahmawati', 'Asked for two extra months of pay and to keep the motorbike', 'employee']],
    talks: [['2026-10-26', 'company', 'Settlement under PP 35/2021, efficiency to prevent loss', null], ['2026-10-30', 'employee', 'Requests 2 additional months of wages and transfer of the operational motorbike at book value', 33600000]], clear: {}, docs: { 'doc-notice': 'sent' } },
  { id: 'OFB-2026-033', emp: 'ADN-1505-0022', type: 'termination', reason: 'Serious violation under the PKB (urgent)', note: 'Expense claims for client visits that did not take place, total Rp 41,2 jt over 7 months. Investigation record INV-2026-014.', notice: '2026-10-19', lastDay: '2026-11-18', deadline: '2026-10-26', status: 'bipartite', template: 'tpl-termination', owner: 'Rani Wulandari', created: '2026-10-19', bipartiteStart: '2026-10-28',
    log: [['2026-10-19', 'Rani Wulandari', 'Termination notice delivered after investigation', 'system'], ['2026-10-26', 'Andi Saputra', 'Disputes the findings in writing', 'employee'], ['2026-10-28', 'Rani Wulandari', 'First bipartite meeting held, minutes signed', 'system']],
    talks: [['2026-10-26', 'employee', 'Disputes three of the seven claims, asks for severance instead of separation pay', null], ['2026-10-28', 'company', 'Bipartite meeting 1: company keeps the decision, offers to drop recovery of disputed claims', null]], clear: {}, docs: { 'doc-notice': 'sent' } },
  { id: 'OFB-2026-034', emp: 'ADN-2407-0711', type: 'contract', reason: 'Contract ends, not renewed', note: 'Surabaya team size fixed at 6 for 2027.', notice: '2026-10-30', lastDay: '2026-11-30', deadline: '2026-11-04', status: 'accepted', template: 'tpl-contract', owner: 'Yudha Pratama', created: '2026-10-30',
    log: [['2026-10-30', 'Yudha Pratama', 'Contract end notice sent', 'system'], ['2026-11-03', 'Putri Lestari', 'Accepted, asked for a reference letter', 'employee']],
    talks: [], clear: {}, docs: { 'doc-contract': 'signed' } },
  { id: 'OFB-2026-035', emp: 'ADN-0907-0004', type: 'retire', reason: 'Normal retirement age (56, per PKB)', note: 'Successor Taufik Hidayat shadowing since August.', notice: '2026-08-03', lastDay: '2026-10-31', deadline: '2026-08-17', status: 'settlement', template: 'tpl-retire', owner: 'Rani Wulandari', created: '2026-08-03',
    log: [['2026-08-03', 'Rani Wulandari', 'Retirement notice sent', 'system'], ['2026-08-05', 'Budi Hartono', 'Acknowledged', 'employee'], ['2026-10-12', 'Rani Wulandari', 'Clearance started', 'system'], ['2026-10-31', 'Sri Handayani', 'Car and keys returned, BAST signed', 'system']],
    talks: [], clear: 'all', docs: { 'doc-retire': 'signed', 'doc-bast': 'signed', 'doc-clear': 'signed', 'doc-settle': 'generated' } },
  { id: 'OFB-2026-036', emp: 'ADN-2107-0388', type: 'layoff', reason: 'Restructuring, role removed', note: 'Manual QA merged into the platform team. Strong SQL, good fit for the open Data Quality Analyst role.', notice: '2026-11-02', lastDay: '2026-12-31', deadline: '2026-11-12', status: 'redeploy', template: 'tpl-layoff', owner: 'Yudha Pratama', created: '2026-11-02', redeployRole: 'REQ-2611',
    log: [['2026-11-02', 'Yudha Pratama', 'Notice meeting held', 'system'], ['2026-11-04', 'Yudha Pratama', 'Offered REQ-2611 Data Quality Analyst, Jakarta, same grade', 'system']],
    talks: [['2026-11-04', 'company', 'Internal role REQ-2611 offered, same grade, relocation allowance Rp 7,5 jt', null]], clear: {}, docs: { 'doc-notice': 'sent' } },
  { id: 'OFB-2026-037', emp: 'ADN-2011-0221', type: 'resign', reason: 'Relocation or family', note: 'Moving to Yogyakarta with family.', notice: '2026-11-05', lastDay: '2026-12-07', deadline: '2026-11-10', status: 'sent', template: 'tpl-resign', owner: 'Yudha Pratama', created: '2026-11-05',
    log: [['2026-11-04', 'Maya Anggraini', 'Resignation letter received', 'employee'], ['2026-11-05', 'Yudha Pratama', 'Acknowledgment sent', 'system']],
    talks: [], clear: {}, docs: { 'doc-ack': 'generated' } },
  { id: 'OFB-2026-038', emp: 'EXT-MKS-1187', type: 'ext-end', reason: 'Headcount reduction', note: 'Night shift at HQ reduced from 4 to 3 guards.', notice: '2026-10-12', lastDay: '2026-10-31', deadline: '2026-10-15', status: 'completed', template: 'tpl-vendor', owner: 'Yudha Pratama', created: '2026-10-12',
    log: [['2026-10-12', 'Yudha Pratama', 'Vendor notified', 'system'], ['2026-10-14', 'PT Mitra Karya Sejahtera', 'Vendor confirmed', 'employee'], ['2026-10-31', 'Sri Handayani', 'ID card, uniform and keys collected', 'system'], ['2026-11-01', 'Yudha Pratama', 'Case closed', 'system']],
    talks: [], clear: 'all', docs: { 'doc-vendor': 'signed', 'doc-bast': 'signed' } },
  { id: 'OFB-2026-029', emp: 'ADN-1910-0168', type: 'mutual', reason: 'Performance, agreed exit', note: 'Two quarters below target after a performance plan. Agreed exit discussed in September.', notice: '2026-09-28', lastDay: '2026-11-30', deadline: '2026-10-08', status: 'mediation', template: 'tpl-mutual', owner: 'Rani Wulandari', created: '2026-09-28', bipartiteStart: '2026-10-09',
    log: [['2026-09-28', 'Rani Wulandari', 'Mutual separation offer sent', 'system'], ['2026-10-06', 'Fajar Nugroho', 'Countered with 4 additional months', 'employee'], ['2026-10-09', 'Rani Wulandari', 'Bipartite started', 'system'], ['2026-11-06', 'Rani Wulandari', 'No agreement after 30 days, registered for mediation at Disnaker Surabaya', 'system']],
    talks: [['2026-09-28', 'company', 'Layoff-equivalent settlement plus 1 month', null], ['2026-10-06', 'employee', 'Asks for 4 additional months and to keep the car until March', 90000000], ['2026-10-20', 'company', 'Offers 2 additional months, car returned on the last day', 53000000]], clear: {}, docs: { 'doc-pb': 'generated' } },
  { id: 'OFB-2026-028', emp: 'ADN-1802-0101', type: 'resign', reason: 'Career change', note: '', notice: '2026-09-01', lastDay: '2026-09-30', deadline: '2026-09-05', status: 'completed', template: 'tpl-resign', owner: 'Rani Wulandari', created: '2026-09-01',
    log: [['2026-09-01', 'Rani Wulandari', 'Acknowledgment sent', 'system'], ['2026-09-30', 'Rani Wulandari', 'Clearance complete', 'system'], ['2026-10-25', 'Annisa Rahma', 'Final pay transferred, paklaring issued', 'system']],
    talks: [], clear: 'all', docs: { 'doc-ack': 'signed', 'doc-bast': 'signed', 'doc-clear': 'signed', 'doc-settle': 'signed', 'doc-pak': 'signed', 'doc-bpjs': 'signed' } },
  { id: 'OFB-2026-027', emp: 'ADN-1811-0119', type: 'resign', reason: 'Compensation', note: 'Retained with a grade review and fleet allowance.', notice: '2026-08-18', lastDay: '2026-09-18', deadline: '2026-08-22', status: 'withdrawn', template: 'tpl-resign', owner: 'Yudha Pratama', created: '2026-08-18',
    log: [['2026-08-18', 'Yudha Pratama', 'Acknowledgment sent', 'system'], ['2026-08-21', 'Bambang Sutrisno', 'Retention offer made: grade G5 from October', 'system'], ['2026-08-24', 'Hendra Gunawan', 'Withdrew resignation', 'employee']],
    talks: [], clear: {}, docs: {} },
  { id: 'OFB-2026-039', emp: 'EXT-TLT-0562', type: 'ext-replace', reason: 'Performance below SLA', note: 'Quality score under 70% for three months.', notice: '2026-11-06', lastDay: '2026-11-20', deadline: '2026-11-09', status: 'sent', template: 'tpl-vendor', owner: 'Yudha Pratama', created: '2026-11-06',
    log: [['2026-11-06', 'Yudha Pratama', 'Vendor notified, replacement requested', 'system']],
    talks: [], clear: {}, docs: { 'doc-vendor': 'sent' } },
  { id: 'OFB-2026-040', emp: 'ADN-2302-0611', type: 'layoff', reason: 'Restructuring, role removed', note: 'Android app moves to a cross-platform team. Check REQ-2627 first.', notice: '2026-11-09', lastDay: '2027-01-15', deadline: '2026-11-16', status: 'draft', template: 'tpl-layoff', owner: 'Rani Wulandari', created: '2026-11-08',
    log: [['2026-11-08', 'Rani Wulandari', 'Draft created', 'system']],
    talks: [], clear: {}, docs: {} },
]
