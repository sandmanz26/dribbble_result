# Strategy notes: NuBrakes dual-brand customer experience

## 1. Read of the brief
NuBrakes sends certified technicians to fix brakes at homes and workplaces. After Valvoline acquired it,
the customer-facing experience has to move onto Valvoline's design system, and the system has to grow to
serve two brands at once. The work is three things in one: a reskin, a design system extension, and a
flow redesign driven by a path-to-purchase study.

Design read: trustworthy consumer service site, website plus booking flow, mobile first. Visual language is
dictated by the client (Valvoline), so the design effort goes into structure, flows, states and the token
architecture rather than a new look.

Constraints at build time:
- The Valvoline design system reference site was not reachable from the build environment. Brand values in
  `src/brand/tokens.js` are placeholders: Valvoline is a red and navy brand with condensed type; NuBrakes is
  given a brake-caliper yellow. The token structure is the deliverable; values swap in one file.
- The path-to-purchase study was not shared. Findings below are hypotheses from public reviews of NuBrakes
  and other mobile repair services, each tied to a design change so it is easy to confirm or rewrite.

## 2. Hypotheses and design responses
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
