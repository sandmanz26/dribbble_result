# Oppsett (project13)

A golf coach's app: photograph an area at the club, pick an exercise, and see the equipment layout drawn on the real photo, in perspective and in metres.

Dribbble brief: "Golf Exercise Gen". Notes and research are in `docs/strategy.md`.

## Try
| Link | What it shows |
|---|---|
| `#/` | Setups |
| `#/new?area=putting` | The full flow |
| `#/new?area=range&exercise=OB-009` | Range bay, start line gate |
| `#/new?area=pitching&exercise=OB-022` | Keeps clear of a golf bag |
| `#/new?area=trackman` | An area with no photo yet |
| `#/bank` | Exercises from Øvelsesbanken |
| `#/club` | Club and preferences |
| `#/plan` | The build plan in plain steps |

In a setup, "Move" lets you drag markers, "Other option" shows a second layout, and "Image" downloads the photo with the markers on it. You can also upload your own photo and calibrate it with two taps.

## How it works
`src/lib/geo.js` holds a camera model per photo: horizon, focal length and camera height. Exercises in `src/data/exercises.js` place equipment in ground metres from their own rules. `src/ui/Overlay.jsx` projects the equipment onto the photo, so sticks lie flat, far cones are smaller, and a dragged marker stays on the ground.

## Stack
- React 18, Vite 5 (`base: './'`), HashRouter
- Ionicons 5 (react-icons)
- Schibsted Grotesk + DM Mono
- Stored on the phone under `og-state-v1`

Photos are from Open Images (CC BY 2.0); credits are at `#/credits`.

```
npm ci && npm run build
```
