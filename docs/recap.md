# Oppsett (project13): recap
- **Brief:** Dribbble "Golf Exercise Gen" (under USD 100). Slug `project13`, password `og-7q0a-vvo8`.
- **Concept:** measure from known objects (cup, ball, mat), place the equipment in metres, and project it with perspective.
  - Reasons are given for every position.
  - Estimates are labelled.
  - Markers can be dragged and stay on the ground.
  - Exercises that cannot fit say why.
- **Photos:** Open Images, CC BY 2.0. The open collections (Openverse, Commons) could not be reached from the build environment.
- **Roast fixes:**
  - Markers and badges were too small on a phone, so they are now larger.
  - Badges overlapped, so collision placement and leader lines were added.
  - Hoops had no numbers.
  - The Setup and "What it saw" switch covered the range markers, so it moved to the top.
  - A seen-label was cut off at the edge.
- **Open:**
  - A real vision model call (see `#/plan`).
  - The Øvelsesbanken CSV import.


## UI refresh: livelier colour (v2)

Owner feedback: the first version felt only white, with a golf app reference that uses deep green cards, a photo hero, pale green chips with icons and a floating tab bar. Changes:

- Palette: deep fairway green surfaces, pale green ground, grass-tint chips, pin-flag yellow stays the one accent.
- Home: photo hero with the main action, area tiles as photos with labels, saved setups as green photo cards with tags.
- Exercises and Club: green band header, photo thumbnails per row.
- New setup: green header with the step bar; the result photo tucks under it; the setup legend is a green card.
- Tabs: floating rounded green bar, active tab filled with its label.
