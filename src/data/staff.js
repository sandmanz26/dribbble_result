// Back-office sample data for the staff dashboard: clients, identity checks, money movements
// under review and support tickets. Every rule that raises a flag is written in plain words
// so staff can see why a transaction is in the queue.
import { FUNDS, balances } from './account.js'

const PEOPLE = [
  ['GT-104882', 'Sofia Brandt', 'Germany', '2026-09-01', 'Verified', balances(FUNDS).balance],
  ['GT-104901', 'Tomás Ferreira', 'Portugal', '2026-09-03', 'Verified', 12540.0],
  ['GT-104915', 'Aiko Mori', 'Japan', '2026-09-05', 'Verified', 820.45],
  ['GT-104933', 'Daniel Osei', 'Ghana', '2026-09-08', 'Verified', 2210.3],
  ['GT-104950', 'Lucía Romero', 'Spain', '2026-09-10', 'Restricted', 0],
  ['GT-104967', 'Ravi Menon', 'India', '2026-09-14', 'Verified', 5604.18],
  ['GT-104988', 'Hannah Kowalski', 'Poland', '2026-09-17', 'Verified', 1499.0],
  ['GT-105002', 'Omar Haddad', 'Jordan', '2026-09-20', 'Verified', 31020.77],
  ['GT-105019', 'Chloé Martin', 'France', '2026-09-24', 'Verified', 640.0],
  ['GT-105034', 'Ingrid Solberg', 'Norway', '2026-09-29', 'Verified', 7350.25],
  ['GT-105051', 'Mateo Rossi', 'Italy', '2026-10-02', 'Verified', 980.6],
  ['GT-105070', 'Nkechi Eze', 'Nigeria', '2026-10-06', 'Rejected', 0],
  ['GT-105088', 'Kenji Watanabe', 'Japan', '2026-10-09', 'Verified', 2045.0],
  ['GT-105103', 'Elif Yıldız', 'Türkiye', '2026-10-13', 'Verified', 410.9],
  ['GT-105121', 'Jonas Becker', 'Austria', '2026-10-16', 'Verified', 15200.0],
  ['GT-105140', 'Priya Natarajan', 'Singapore', '2026-10-19', 'Pending', 0],
  ['GT-105158', 'Marcus Lindqvist', 'Sweden', '2026-10-21', 'Pending', 0],
  ['GT-105172', 'Zanele Dube', 'South Africa', '2026-10-23', 'Pending', 0],
  ['GT-105190', 'Felipe Araújo', 'Brazil', '2026-10-25', 'Pending', 0],
  ['GT-105207', 'Wei Ling Tan', 'Malaysia', '2026-10-26', 'Pending', 0],
  ['GT-105219', 'Yusuf Demir', 'Türkiye', '2026-10-27', 'Pending', 0],
  ['GT-105233', 'Grace Mwangi', 'Kenya', '2026-10-27', 'Pending', 0],
]
export const CLIENTS = PEOPLE.map(([id, name, country, joined, status, balance]) => ({ id, name, country, joined, status, balance }))

// Identity checks waiting for a person. Submitted times are on the demo day, 28 Oct 2026.
export const KYC = [
  { id: 'K-3301', client: 'GT-105140', submitted: '2026-10-26 09:12', docs: ['Passport', 'Utility bill'], check: 'Address on the bill is a P.O. box', risk: 'Look closer' },
  { id: 'K-3305', client: 'GT-105158', submitted: '2026-10-26 16:40', docs: ['National ID card', 'Bank statement'], check: 'Documents match', risk: 'Clear' },
  { id: 'K-3309', client: 'GT-105172', submitted: '2026-10-27 08:05', docs: ['Passport', 'Bank statement'], check: 'Statement is older than 3 months', risk: 'Look closer' },
  { id: 'K-3311', client: 'GT-105190', submitted: '2026-10-27 11:30', docs: ['Driving licence', 'Utility bill'], check: 'Documents match', risk: 'Clear' },
  { id: 'K-3314', client: 'GT-105207', submitted: '2026-10-27 19:48', docs: ['Passport', 'Tenancy agreement'], check: 'Selfie and passport photo match', risk: 'Clear' },
  { id: 'K-3316', client: 'GT-105219', submitted: '2026-10-28 07:22', docs: ['National ID card', 'Utility bill'], check: 'Name spelled differently on the bill', risk: 'Look closer' },
  { id: 'K-3318', client: 'GT-105233', submitted: '2026-10-28 09:51', docs: ['Passport', 'Bank statement'], check: 'Documents match', risk: 'Clear' },
]
// Target: a decision within 24 hours of submission.
export const KYC_TARGET_H = 24

export const RULES = {
  newPayee: 'Withdrawal to a bank account added in the last 7 days',
  large: 'Single deposit of $10,000 or more',
  name: 'Name on the card or account differs from the client',
  quick: 'Withdrawal within 48 hours of a deposit, with no trading in between',
}

export const MOVES = [
  { id: 'W-0788', client: 'GT-104882', at: '2026-10-27 18:02', kind: 'Withdrawal', amount: 400, method: 'Bank transfer', flags: [], status: 'In review' },
  { id: 'D-2954', client: 'GT-105002', at: '2026-10-27 20:15', kind: 'Deposit', amount: 15000, method: 'Bank transfer', flags: ['large'], status: 'Held' },
  { id: 'W-0791', client: 'GT-104967', at: '2026-10-27 22:40', kind: 'Withdrawal', amount: 2300, method: 'Bank transfer', flags: ['newPayee'], status: 'Held' },
  { id: 'D-2960', client: 'GT-105121', at: '2026-10-28 06:58', kind: 'Deposit', amount: 5000, method: 'Card', flags: ['name'], status: 'Held' },
  { id: 'W-0795', client: 'GT-105088', at: '2026-10-28 07:31', kind: 'Withdrawal', amount: 1950, method: 'Card refund', flags: ['quick'], status: 'Held' },
  { id: 'D-2963', client: 'GT-104915', at: '2026-10-28 08:10', kind: 'Deposit', amount: 300, method: 'Card', flags: [], status: 'Completed' },
  { id: 'D-2967', client: 'GT-105034', at: '2026-10-28 08:44', kind: 'Deposit', amount: 2500, method: 'Bank transfer', flags: [], status: 'Completed' },
  { id: 'W-0798', client: 'GT-104901', at: '2026-10-28 09:05', kind: 'Withdrawal', amount: 800, method: 'Bank transfer', flags: [], status: 'In review' },
  { id: 'D-2971', client: 'GT-105051', at: '2026-10-28 09:37', kind: 'Deposit', amount: 150, method: 'Card', flags: [], status: 'Completed' },
  { id: 'W-0801', client: 'GT-104933', at: '2026-10-28 10:02', kind: 'Withdrawal', amount: 500, method: 'Bank transfer', flags: [], status: 'In review' },
]

export const TICKETS = [
  { id: 'S-8812', client: 'GT-104882', subject: 'When will my withdrawal arrive?', opened: '2026-10-27 18:20', last: 'client', status: 'Open',
    thread: [
      { from: 'client', at: '2026-10-27 18:20', text: 'Hi, I asked for $400 to my Sparkasse account yesterday evening. The dashboard says In review. How long does that usually take?' },
    ] },
  { id: 'S-8815', client: 'GT-105140', subject: 'Which documents count as proof of address?', opened: '2026-10-27 09:02', last: 'client', status: 'Open',
    thread: [
      { from: 'client', at: '2026-10-27 09:02', text: 'My bill shows my P.O. box because that is where I get mail. Is that ok or do you need something else?' },
    ] },
  { id: 'S-8819', client: 'GT-104967', subject: 'New bank account for withdrawals', opened: '2026-10-27 22:45', last: 'client', status: 'Open',
    thread: [
      { from: 'client', at: '2026-10-27 22:45', text: 'I changed banks this week, so I added the new account and requested $2,300. Do you need anything from me?' },
    ] },
  { id: 'S-8803', client: 'GT-104988', subject: 'Spread on gold looked wider on Friday night', opened: '2026-10-25 08:11', last: 'staff', status: 'Waiting on client',
    thread: [
      { from: 'client', at: '2026-10-25 08:11', text: 'On Friday around 21:50 UTC the gold spread was much wider than usual. Why?' },
      { from: 'staff', at: '2026-10-25 10:30', text: 'Hi Hannah, spreads widen in the last minutes before the weekly close because fewer banks are quoting. Would it help if we sent you the session times?' },
    ] },
  { id: 'S-8797', client: 'GT-105019', subject: 'Change my email address', opened: '2026-10-24 12:40', last: 'staff', status: 'Solved',
    thread: [
      { from: 'client', at: '2026-10-24 12:40', text: 'Please change my login email to my new address.' },
      { from: 'staff', at: '2026-10-24 13:05', text: 'Done, Chloé. You will get a confirmation at the new address.' },
    ] },
]
