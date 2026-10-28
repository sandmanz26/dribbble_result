# Flow Director (Upwork): recap

- Brief (Upwork, Nick Murphy, clinician and founder; founding engineer Jon): polished screens and
  clickable prototypes for real clinic workflows, interaction specs, consistent navigation, reusable
  components, responsive layouts, loading / empty / error / pending / approval / recovery states,
  clear AI and human hand-offs, developer-ready handoff. Their stack: React, TypeScript, Tailwind,
  Radix, Laravel. Synthetic data only.
- Owner's direction: use shadcn as the base but improve on it; research the topic deeply first to
  show maturity; build only the critical pages and keep the others in the menu as Upcoming; give the
  Upwork project its own URL, not a projectN slug.
- Hub: slug `flowdirector`, password `fd-w8tq-3jxc`.
- taste-skill app style "framed sheet" (tinted frame, white sheet). IBM Plex was dealt but is used
  in project3, so Mona Sans + Commit Mono. Inspector: 0 FAIL on every built screen.
- Improvements over stock shadcn: one job-state vocabulary with glyphs, pending buttons that keep
  their width, a Patrick mark distinct from people, proposal + evidence + rule on every ask,
  recovery cards, toast with undo countdown, keyboard triage, review links for every state.
- Roast before shipping: mobile frame left a blank band (grid rows fixed); a failed plan still read
  "If you approve" (now struck through as "Original plan, not done"); the plan text did not update
  after recovery (fixed); rings read as shadows (now borders); grey text under 4.5:1 (darkened);
  counts in the sidebar card and Today disagreed (one definition).
