# Strategy notes: NuBrakes dual-brand customer experience

## 1. Read of the brief and the role description
Sources: the Dribbble brief and the role description PDF ("Contract Product Designer (UI/UX)").

NuBrakes sends certified technicians to fix brakes at homes and workplaces. After Valvoline acquired it,
the customer-facing experience moves onto Valvoline's design system, in Figma, and the system grows to
serve two brands with shared components and brand themes.

What the role description adds to the brief:
- **It is a reskin first.** "The structure and logic of most flows already exist." The job is to bring
  them to a high, consistent standard in the new design language and to **flag where small UX
  improvements would make a real difference**, with clear, reasoned recommendations, not a reinvention.
- **Path-to-purchase findings** should become "clear, measurable improvements to how customers quote
  and book". So every recommendation carries a metric.
- **People:** the NuBrakes PM owns requirements; Valvoline's UX lead sets direction and signs off.
- **Output:** polished, developer-ready UI in Figma (components, variants, auto layout), responsive,
  with empty, loading and error states; gaps in the system for mobile service proposed as components.
- **Engagement:** contract, hourly, 20 to 40 hours a week through November and December, async with
  some US East Coast overlap. They want someone AI-native who explains how they use it.

How the prototype answers this:
- A **UX notes** layer (on by default, toggle in the Prototype panel) puts numbered markers on the
  screens. Each opens the recommendation, the reason and the metric. Source list: `src/data/uxnotes.js`.
- The Notes page maps each line of the role description to where it is answered, lists the twelve
  recommendations, the Figma file setup, an eight-week plan and questions for the PM and UX lead.
- The System page lists the Figma variants and properties for each component.

Constraints at build time:
- The Valvoline design system site, the current NuBrakes screens and the path-to-purchase study were not
  available. Brand values in `src/brand/tokens.js` are placeholders; recommendations are written so the
  study can confirm, reprioritise or drop them.

## 2. Hypotheses behind the recommendations
| Hypothesis | Design response |
|---|---|
| Price is the first question; asking for contact details before price loses people | Vehicle + ZIP in the hero, price on step 4, contact on step 6. "No phone number or email until you book" |
| Customers know the symptom, not the repair | "What I am noticing" maps symptoms to a service with a short reason; "I know what I need" skips to the list |
| Failed visits come from the location (apartment rules, slopes, keys), not the technician | Location type and access notes before scheduling, specific warnings, "Will you be there?" asked up front |
| Trust drops when a stranger comes to the house | Technician card: name, certification, years, van to look for; texts at assignment and 30 min out |
| Fear of on-site upselling | ApprovalRequest: reading, reason and price in the app; "Not now" never changes the quote |
| Acquisition confusion (does my booking/warranty still count?) | One plain sentence on home and in the FAQ, same wording in both brands |
| Reviews mention cancellations from technician shortages | Reschedule is free and two taps; full days show an empty state with "Show the next open day" |

## 3. Information architecture
```
Home            hero quote starter, acquisition note, how a visit works, services, symptom helper,
                reviews, where we work (ZIP check), FAQ
Services        price table by vehicle type
Service detail  what is included, signs, price by vehicle, quote starter (preselects the service)
Quote flow      vehicle > brakes > location > price > time > book   (/quote/:step, resumable draft)
Booking         visit tracker: status timeline, technician, approval, report, reschedule, cancel
My bookings     list with loading and empty states
System          token tiers, brands side by side, token tables, proposed components, states, handoff
Notes           this document in short, for the client
```

## 4. Dual-brand system
- **Tiers:** core (raw brand values) > semantic (roles, one collection with four modes: NuBrakes light/dark,
  Valvoline light/dark) > component (only where brands differ: button case, control radius, display width).
- **Brand architecture:** NuBrakes keeps its name with "A Valvoline company". The Valvoline version runs the
  same product as "Mobile Brake Service". Markets can switch brand without a redesign.
- **Found while theming:** Valvoline red reads as both "primary" and "error". Errors use a deeper red and
  always an icon and text. To confirm with the Valvoline UX lead.
- **Handoff:** tokens export as W3C DTCG JSON (System page). Component props mirror Figma properties.

## 5. Proposed components for mobile service
ServiceAreaCheck, ArrivalWindowPicker, VehicleChip, QuoteBreakdown, TechnicianCard, StatusTimeline,
ApprovalRequest, LocationSummary. Each has loading, empty and error states where it loads data.

## 6. Competitor frame
| Service | Pattern worth noting |
|---|---|
| YourMechanic | Upfront estimate in seconds, then time, location and mechanic; 12-month guarantee message |
| RepairSmith | Vehicle and location first, symptom or service, instant quote, then date and payment |
| Shop chains (Valvoline Instant Oil Change, Firestone) | Strong brand, but the visit model is drive-in; no arrival windows or at-home trust signals |
| UK comparison sites (BookMyGarage) | Plate + postcode first; pay after the work |
NuBrakes' gap: the strongest at-home trust and transparency story, carried by a larger brand.

## 7. Open questions for the client
1. Does Valvoline's system define an error colour separate from brand red?
2. Is payment taken after the job today, or is a card held at booking?
3. Which markets stay NuBrakes and which move to the Valvoline brand, and when?
4. Can the technician app send measurements, so approval requests carry real readings?
5. Can the path-to-purchase study and current funnel numbers be shared to replace section 2?

## 8. Two design directions
Switchable in the Prototype panel. Same components, data, brands and recommendations.
| | V1 Editorial | V2 Job ticket |
|---|---|---|
| Type | Archivo display, Public Sans body | IBM Plex Sans (variable width), Plex Mono for figures |
| Shape | Rounded (NuBrakes) or 4px (Valvoline), soft surfaces | Square, 2px ruled lines, no tinted fills |
| Home | Headline with quote card beside it, service rows, symptom chips | Full-width quote strip, price board, visit timeline with times, symptom table |
| Flow | Steps in a left column, summary in a right column | Steps as a numbered rail on top, quote as a ticket on the right |
| Fits | Consumer brand voice, closer to NuBrakes today | Service desk tone, closer to Valvoline retail and fleet |
Mechanism: V2 is a third token dimension (style) next to brand and scheme, plus scoped layout rules.
