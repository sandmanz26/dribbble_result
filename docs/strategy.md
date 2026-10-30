# Roll: strategy, research and roast

## Brief
Dribbble, "School Student Database App Design". Mobile app. Budget $50,000, timeline not set.
A mobile database for school students: personal details and examination records. Intuitive data
entry, secure storage, robust search, follows the school's branding guidelines, user-friendly for
administrators and staff.

## Design read
Mobile work tool for school office staff and teachers, trust-first and calm, neutral surfaces that
take one accent from whichever school buys it. Dials: variance 3, motion 3, density 5.

## Problem
Student records live in a desktop SIS that staff can't use away from a desk, so phone calls,
corridor conversations and trips run on memory or paper. The two people who touch records most
want different things:
- **Registrar / office**: keep records complete and correct, add new students, approve marks,
  answer "who changed this?".
- **Teacher**: find a student in seconds, know health alerts before a lesson or trip, enter marks
  quickly, never see more personal data than the job needs.

## Research (what competitors do and where they fall short)
- **PowerSchool SIS**: staff search by surname or school ID, with a separate quick search and
  stored advanced searches. Search is built for a desktop and exact input; partial surnames return
  long lists. Mobile apps are mostly for parents. The separate eSchoolPLUS admin app rates 1.5 stars
  on the App Store.
- **Arbor MIS**: a responsive web app on phones rather than a native app for staff work. Parents get
  the app; profiles show attendance and attainment.
- **ClassCharts Teachers**: native, but scoped to seating plans and behaviour, not records or marks.
- **Privacy practice (FERPA-style guidance)**: least-privilege access, separate view/edit/export
  rights, and an audit trail of *which records were opened*, not only log-ins. Shared logins make
  the trail useless.

Gap: nobody does a phone-first tool that is both fast to search and strict about who sees what.

## Product decisions
1. **Search forgives**: part of a name, one-letter typos ("amra"), admission number, class ("9B"),
   a parent's name or the last digits of a parent's phone. Each result says *why* it matched.
   ID card scan as a shortcut. Recent searches and browse-by-class when empty.
2. **Two roles, enforced in one place** (`visible` in `src/store.jsx`): teachers see only their
   classes; addresses, IDs, emails and health details are office only. Health *alerts* (allergy,
   condition) are visible to everyone because a teacher on a trip needs them.
3. **Reveal with a reason**: national ID and health details are masked even for the registrar.
   Showing them asks why, and the reason goes into the access log.
4. **Access log**: every view, reveal, edit, export, call and mark publication, per student and
   school-wide.
5. **Teachers suggest, office applies**: a teacher can't edit records but can send a correction
   ("mother called, new number"). The registrar applies or declines it from Today.
6. **Data entry that survives interruptions**: five short steps, autosaved draft, inline validation,
   day/month/year boxes instead of a calendar, and a **duplicate check** on name before anything
   is saved ("Amara Okafor" in the panel shows it).
7. **Incomplete is a status, not an error**: a record can be saved without address or ID; it shows
   as Incomplete and counts on the registrar's Today until fixed.
8. **Marks with a review step**: teacher enters marks in a roster (Enter jumps to the next student,
   A absent, X exempt, out-of-range flagged), sees average and spread, submits; the registrar
   approves and publishes or returns with a note. Published sheets lock.
9. **Offline honest**: changes save on the phone and wait in a visible queue until online.
10. **Branding**: the school supplies name, crest letters and one accent. Everything else is neutral
    so any brand fits. Three sample schools in the panel prove it.
11. **Security basics**: PIN lock, auto-lock after 5 minutes idle, withdrawn students are kept, not
    deleted.

## Visual language
Mona Sans (variable width, expanded for headings) + Spline Sans Mono for admission numbers, class
codes and marks. Iconsax icons. Neutral grey ground, white surfaces, ink text; the only colour is the
school accent (default plum #a3195b). Status colours (amber incomplete, green enrolled, red health)
are semantic, not decoration. Surfaces 14px, controls pills. Light and dark.
Students are shown with initials, not photos: these are minors, and stock photos of children would
be misleading in a records product. The real app would use the school's own ID photos.

## Roast (round 1) and what changed
| Finding | Change |
|---|---|
| 65 incomplete records incomplete looked like a broken school, not a busy office | Lowered the missing-data rates in the mock (now about 27) |
| Demo date in October with a "Term 2 midterm" and Term 1 finals made no sense | Moved the demo clock to 18 Feb 2027 |
| Native date picker for birth date (owner rejects browser-default controls; calendars are slow for dates years back) | Day, month, year number boxes |
| Copy promised "locks after 5 minutes away" with nothing behind it | Real idle lock |
| Mark counter counted invalid entries as "in" | Counts valid marks only |
| Review links (`?as=teacher`) only worked on first load | Work on every navigation |
| Dark mode avatars were pale discs | Dedicated dark tints |

Still open: the profile tab row scrolls sideways for the registrar (five tabs); the bulk import
from the old SIS (CSV) is not designed yet; parent-facing app is out of scope.
