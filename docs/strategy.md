# Oppsett: strategy notes

## Brief
"Golf Exercise Gen" on Dribbble, budget under USD 100, within the next few weeks.
- A native app for iPhone and Android, for one golf coach at Oslo Golf Club, this season.
- The coach photographs an area (range bay, chipping green, putting green, Trackman room), then picks an exercise from the exercise bank.
- AI vision works out the best equipment layout for that exercise in that exact area and draws it as markers on the real photo.
- The app must be built so it can later become a multi-coach subscription app, connected to the coach's separate exercise-bank web app, Øvelsesbanken.
- The coach has little coding experience and wants each step explained simply, with a stop wherever there is something to do by hand.

## Reading of the brief
The hard part is not drawing markers. It is that a single photo has no scale, so "1.8 m from the hole" means nothing until the app knows how big things are. The product therefore does three things:
1. **Measures from things of known size.** A cup is 108 mm, a ball 42.7 mm, a mat 1.5 m. If none are in the photo, it asks for two taps and a distance. It never guesses quietly.
2. **Places equipment in metres on the ground.** The rules come from the exercise (the gate is 30 cm ahead and 2 cm wider than the putter). The equipment is then projected into the photo with perspective, so sticks lie flat and the far cones get smaller.
3. **Explains every choice and lets the coach move things.** It gives the reasons for each position, an estimate label where it is unsure (slope), and drag to adjust with the marker staying on the ground.

## Research
- Drills and their standard measurements:
  - Gate: tees just wider than the putter head, close to the ball, stepped from 4 to 10 feet.
  - Clock: 12 balls at 3 feet.
  - Train-track alignment sticks.
  - Full-swing gate: sticks 6 to 12 inches apart, about 10 feet ahead.
  - Distance ladder: 10, 20, 30, 40 feet.
  - Sources: PGA.com putting drills; GolfZon Leadbetter; Bruce Bolt alignment drills.
- AR plane detection and measuring:
  - ARKit and ARCore detect planes and hit-test distances.
  - Accuracy is good on flat ground in good light and drops without a depth sensor.
  - So version 1 uses the photo plus a known object. AR capture is a version 2 option for better accuracy.
  - Sources: Apple ARKit docs; Grid Dynamics; Nomtek.
- Coach apps (BirdieFit, Sportplan, Skillest, CoachNow):
  - Drill libraries and planners exist; Sportplan even has a drill designer.
  - None places the drill on a photo of the coach's own facility. That is the gap.

## Information architecture
- **Setups** (home): a new setup button, the coach's areas with their last photo, and saved setups.
- **New setup**, in five steps:
  1. Area.
  2. Photo: reuse today's photo, take a new one, or calibrate with two taps.
  3. Read: what the AI found, with "Sure" or "Estimate, check it".
  4. Exercise: from the bank, filtered to the area. Exercises that cannot fit say why.
  5. Setup: the markers on the photo, a numbered legend with distances, the reasons, what to bring, move, another option, export the image, save for a group.
- **Exercises**: imported from Øvelsesbanken. Each exercise shows the layout rules the AI follows. Changing a rule happens in Øvelsesbanken, the one source.
- **Club**: areas, the coach's preferences (putter head width feeds the gate rule), the data model ready for more coaches (club, coach, areas, setups), and the build plan.
- **Build plan**: eleven steps marked You or Me, with exactly what to click. It answers the brief's request to explain each step simply.

## Visual language
- **Name:** Oppsett, Norwegian for setup.
- **Type:** Schibsted Grotesk (a Norwegian publisher's face) with DM Mono for figures.
- **Icons:** Ionicons 5.
- **Colour:** field ink on a cool off-white. The one colour is the yellow of a pin flag, which the putting-green photo shows. It is used for the equipment on the photo and for the main action, and it stays readable on grass.
- **Photos:** real ones from Open Images (CC BY 2.0). The range bay is a Swedish club in November.

## Prototype limits
- The AI step is simulated. Each sample photo carries the camera model and the findings a vision model would return.
- A photo the coach uploads is calibrated with two taps.
- Saved setups and preferences are stored on the phone (`og-state-v1`).
