# Skill-to-Research Bridge: strategy and design notes

Brief (Dribbble, under $100): a polished, responsive website that connects university students' demonstrated skills
with real research projects. Clean academic-tech style, warm off-white ground, deep navy text, bright teal or lime
accent. Screens: landing with hero, student dashboard, research project page, researcher dashboard and a portable
Contribution Passport. Simple, accessible, keyboard-friendly navigation; skill evidence, readiness scores and missing
skill detection; realistic sample content, meaningful states, transparent privacy controls.

## The problem
Undergraduate research places usually go to students who already know a professor. Grades say little about whether
someone can clean a sensor log or code an interview. Labs get many applications and no way to compare evidence, and
the work a student does on a project disappears when it ends.

## Decisions
- **Evidence, scored in the open.** Each project lists its skills with weights (adding to 100) and a level. A piece of
  evidence counts by strength: verified 100%, linked work 70%, a claim 30%, and half when below the level asked.
  Readiness is the weighted sum, and every screen that shows it can show the table that produced it.
- **Ready means 75%.** The line is drawn on every bar. Students can still apply below it; labs see the gaps.
- **Missing skill detection with a way to close it.** Each gap names the shortest honest route: a reviewed Bridge
  task, a workshop, or a record to upload, and how many points it would add on which projects.
- **Blind review by default.** Labs see evidence, not names or photos, until they shortlist. Grades are hidden unless
  the student shows them.
- **Contribution Passport in CRediT roles.** The 14 Contributor Roles Taxonomy roles journals use (data curation,
  software, investigation, and so on), signed by the supervising researcher, exportable as PDF and JSON, shared by a
  link with an expiry and per-section visibility, with a log of who viewed it.
- **Privacy controls** in plain words: who can find you, what labs see, who opened your profile, download or delete.
- **Keyboard:** skip links, visible focus (navy ring plus lime halo), g then a letter to move between screens,
  / to search projects, ? for the list, Escape closes dialogs, focus is trapped and returned in dialogs.
- **Type:** Atkinson Hyperlegible Next, drawn by the Braille Institute for low-vision readers.

## Taste-skill run
- Landing: direction "The sentence is the layout" (seed 1235694872). The headline is a sentence with a photograph set
  in it. Sections adapted with reasons: the pinned "three distances" showcase was replaced by the live readiness
  matcher (the product's real content); the "names as one sentence" proof section was dropped because there are no
  real partners to name; it became the labs section with an applicant fragment.
- App: style "Editorial greeting" (seed 1834523699): the greeting is the h1 with today's finding under it, tiles at
  regular weight, 9 + 3 and 6 + 6 rows on a 1100px column (12 x 77 + 11 x 16). Type redrawn from Instrument Sans and
  Serif to Atkinson Hyperlegible Next (the brief is about accessibility, and the owner avoids decorative serifs).
- Inspector: landing 0 FAIL; student home, project page and lab home 0 FAIL with --app. Defended warnings: the warm
  off-white is the client's stated ground; no video because the open video collections could not be reached.

## Sample data to replace
Northgate University, every lab, researcher, student, project, task and number. Photos are Open Images (CC BY 2.0)
of research and study in general, credited at `#/credits`.
