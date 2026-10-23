# Strategy: Student Management System (Dribbble brief)

## Brief
Minimalist, responsive web design for a Student Management System. Bilingual UI (English and
Sinhala). Dark corporate background with subtle academic motifs. Primary #0B2545, accent #134074.
Arial or Inter. Top bar with a language selection view: heading "Student Management System",
subtitle "Select your preferred language / භාෂාව තෝරන්න", two buttons (English, Sinhala). Then a
grade selection module, grades 1 to 13, with a high-contrast "Enter Portal" button leading to the
dashboard. Semantic HTML, flexbox, responsive.

## Reading
Grades 1 to 13 and Sinhala place this in the Sri Lankan school system. The person choosing a grade
and entering a portal is most likely staff: a grade head or sectional head who looks after one grade.
So the dashboard answers the grade head's morning question: **is my grade in class and covered right
now?**

## What belongs to this subject (inventory)
- Grades 1 to 13 in four stages: Primary 1-5, Junior secondary 6-9, Senior secondary 10-11,
  Collegiate (A/L) 12-13.
- Three national exams inside the 13 years: Grade 5 Scholarship, G.C.E. O/L at grade 11, G.C.E. A/L
  at grade 13.
- A/L classes are streams (Maths, Bio, Commerce, Arts, Technology), not letters.
- Three terms a year, a term test at the end of each; 35 is the pass mark.
- The daily register is marked by the class teacher before the first period ends.
- Relief periods: when a teacher is on leave, a free teacher covers the class. Finding them is a daily
  chore for the grade head.
- 80% attendance is required for A/L school candidates to sit the exam.
- Sri Lankan signboards stack their scripts (Sinhala, Tamil, English) one above the other.
- White school uniforms.
- Sri Lankan-designed typefaces that carry both scripts: Gemunu Libre, Yaldevi, Abhaya Libre.

## Screens and their one question
| Screen | Question | Main job |
|---|---|---|
| Language | Which language do you read? | Choose one |
| Grade | Which grade do you look after? | Enter Portal |
| V1 Overview | Is the grade in class and covered right now? | Assign relief to an open period |
| V1 Students | Who in this grade needs following up? | Find a student, filter below 80% |
| V2 Today | What does today need from me? | Assign relief, open a class register |

The finding line under each title is computed from the data, for example "2 periods today still have
no teacher. 10-B is at 82% attendance, the lowest in the grade."

## V1: the brief, done properly
- Entry: navy field, the two scripts' alphabets set faintly behind as the "academic motif" (a classroom
  alphabet chart), a top bar with the language view, then a grade dropdown grouped by stage and a
  white, high-contrast Enter Portal button.
- Portal: the taste-skill app style "achromatic ledger": chrome in ink, the brand blue on the main data
  (present today, the attendance bars), red only on what is wrong. KPI strip, attendance by class,
  relief list with one-click assignment from the teachers free in that period, the timetable with
  the current period and uncovered periods marked, second term results weakest first, and the
  students below 80%.
- Inter is used because the client named it. It has no Sinhala, so Noto Sans Sinhala covers that
  script.

## V2: the concept
- **The two scripts are the two buttons.** The language step is the words "English" and "සිංහල" at
  poster size, each half of the screen.
- **The grade picker is a chart of the school.** Thirteen columns, each as tall as that grade's
  headcount, with the four stages and the three national exams on the same grid. Choosing a grade
  also tells you when its next national exam is.
- **The day is the screen.** Each class is a lane through 07:30 to 13:30. The register sits at the head
  of the lane as one square per student (filled present, hollow absent, dashed not marked). Periods sit
  on a real time axis with the interval and a "now" line. A period without a teacher is marigold and
  is the button that assigns relief.
- **Every mark is a dot.** The second term test shows each student's mark on a 0 to 100 line per
  subject, with the average and the pass mark of 35, so the spread and the failures are visible, not
  only an average.
- **Signboard labels.** Every heading carries the other script beneath it, as Sri Lankan signs do, so
  a teacher and a parent can read the same screen.
- One accent (marigold) that only means "needs you or chosen", square corners, two typefaces.

## Deliberate departures from the taste-skill inspector
- Fonts: the dealt face was Geist. V1 uses the client's Inter; V2 uses Sri Lankan faces because they
  carry both scripts in one design.
- V2 uses heavy ink rules and a 44px title on purpose: the signboard is the concept.

## States
Live, loading (layout kept, grey bars), error (inside each block, with Retry), and "before 07:50"
(no register marked yet), switchable from the Prototype panel. Empty search results keep their frame.
Light and dark themes. Reduced motion respected.

## Not in scope
Backend, login, real data, Tamil (the third national language; the structure supports a third
string set).
