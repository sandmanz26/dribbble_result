# AGENTS.md: project18, Rimba (restaurant landing page)

One project inside a multi-project repository. Repo-wide rules: `git show origin/main:AGENTS.md`
and `docs/COLLABORATION.md` on main.

## This project
- **Brief:** Dribbble restaurant landing page. Placeholder restaurant Rimba, Ubud: Indonesian
  cooking over wood fire. Sample content only.
- **Stack:** React 18, Vite 5 (`base: './'`), one page (no router), GSAP + ScrollTrigger, Lenis,
  `@mynaui/icons-react`, Instrument Sans variable (`wdth.css`, display at 75-85% width).
- **Look:** basalt dark ground #111311, rice-paper ink, one accent torch ginger pink #ec5a86
  (from the kecombrang flower in the photos). Light theme via prefers-color-scheme. Photos and
  panels 18px radius, controls pills. Fixed grain layer.
- **Scroll scenes:** hero frames into a window (`Top.jsx`), story words light up, five courses on
  one pinned plate with text driven by the timeline (`Evening.jsx`), horizontal rooms walk on
  desktop and swipe on phones (`Middle.jsx`). Reduced motion: no Lenis, no pins, plain list.
- **Photos:** 16 generated with Higgsfield (GPT Image 2.5), self-hosted in `public/photos/` at
  800 and 1600 wide. Sources kept out of git (`raw/`).
- **Storage:** none.
