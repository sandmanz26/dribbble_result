// The exercise bank, as imported from Øvelsesbanken. Each exercise carries the coach's own layout
// rules in metres; the AI's job is to apply those rules to the ground it found in the photo.
import { add, toward, perp, offset, dist } from '../lib/geo.js'

export const BANK = {
  source: 'Øvelsesbanken',
  imported: '12 Oct 2026, 21:14',
}

// Each layout returns markers in ground metres, plus the reasons for where they went.
export const EXERCISES = [
  {
    id: 'OB-031', options: 2, name: 'Start line gate', type: 'putt', minutes: 15, players: '1 to 3',
    goal: 'Start the ball on line. A gate of two tees just wider than the putter head, close to the ball.',
    rules: ['Straight putt, about 1.8 m', 'Gate 30 cm in front of the ball', 'Gate 2 cm wider than the putter head (14 cm)'],
    layout(area, v = 0) {
      const hole = area.hole
      const dir = v === 0 ? { X: 0.15, Z: 1 } : { X: -0.6, Z: 0.8 }
      const ball = offset(hole, norm(dir), 1.8)
      const g = toward(ball, hole, 0.3); const s = perp(ball, hole)
      return {
        markers: [
          { kind: 'ball', at: ball, label: 'Ball', n: 1 },
          { kind: 'tee', at: offset(g, s, 0.07), label: 'Gate tee', n: 2 },
          { kind: 'tee', at: offset(g, s, -0.07), label: 'Gate tee', n: 2 },
          { kind: 'line', from: ball, to: hole, label: 'Start line' },
        ],
        why: v === 0
          ? ['Ball straight behind the hole as you look at the photo, where the green is flattest: the straightest putt here, so the gate tests start line only.', 'Gate 30 cm out, where a pushed or pulled stroke shows on the tees.']
          : ['Second option from the left side, across the slope: the gate stays, but the putt now breaks about 5 cm.'],
      }
    },
  },
  {
    id: 'OB-012', options: 2, name: 'Clock drill, 1 m', type: 'putt', minutes: 20, players: '1 to 4',
    goal: 'Make 8 short putts in a row from every side of the hole.',
    rules: ['8 tees in a circle around the hole', 'Radius 90 cm (3 feet)', 'Start at 12 o’clock, go round'],
    layout(area, v = 0) {
      const r = v === 0 ? 0.9 : 1.2
      const tees = Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2; return { kind: 'tee', at: add(area.hole, Math.sin(a) * r, -Math.cos(a) * r), label: `${i + 1} o’clock spot`, n: i + 1 } })
      return {
        markers: [...tees, { kind: 'ring', c: area.hole, r, label: 'Circle' }],
        why: [`All 8 spots fit on the green with ${r === 0.9 ? 'at least 1.5 m' : 'about 1 m'} to the fringe.`, 'Spot 1 is on the flattest side of the hole, so the round starts with the straightest putt.'],
      }
    },
  },
  {
    id: 'OB-018', options: 2, name: 'Speed zone', type: 'putt', minutes: 15, players: '1 to 4',
    goal: 'Finish every putt between the hole and 45 cm past it.',
    rules: ['Stick lying 45 cm past the hole, across the line', 'Balls from 4 m', 'Uphill first'],
    layout(area, v = 0) {
      const dir = v === 0 ? { X: 0.1, Z: 1 } : { X: 0.6, Z: 0.8 }
      const start = offset(area.hole, norm(dir), 4)
      const past = toward(area.hole, start, -0.45); const s = perp(start, area.hole)
      return {
        markers: [
          { kind: 'stick', from: offset(past, s, -0.6), to: offset(past, s, 0.6), label: 'Speed stick', n: 1 },
          { kind: 'zone', pts: [offset(area.hole, s, -0.3), offset(area.hole, s, 0.3), offset(past, s, 0.3), offset(past, s, -0.3)], label: 'Good speed zone' },
          ...[0, 1, 2].map((k) => ({ kind: 'ball', at: offset(start, s, (k - 1) * 0.25), label: 'Ball', n: 2 })),
        ],
        why: ['Balls 4 m from the hole on the far side, where the green is flattest in this photo.', 'Stick across the line 45 cm past the hole: the zone a putt should finish in.'],
      }
    },
  },
  {
    id: 'OB-044', options: 2, name: 'Landing spot', type: 'chip', minutes: 20, players: '1 to 4',
    goal: 'Land the chip on a spot a third of the way, and let it roll out.',
    rules: ['Towel a third of the way from ball to hole', 'Ball on the fringe', '5 balls'],
    layout(area, v = 0) {
      const start = v === 0 ? area.start : add(area.start, -0.6, 0.6)
      const land = toward(start, area.hole, dist(start, area.hole) / 3)
      const s = perp(start, area.hole)
      return {
        markers: [
          ...[-2, -1, 0, 1, 2].map((k) => ({ kind: 'ball', at: offset(start, s, k * 0.12), label: 'Ball', n: 1 })),
          { kind: 'towel', c: land, w: 0.5, d: 0.35, along: unit(start, area.hole), label: 'Landing towel', n: 2 },
          { kind: 'line', from: start, to: area.hole, label: 'Chip line' },
        ],
        why: [`Ball on the fringe, ${dist(start, area.hole).toFixed(1)} m from the near flag.`, 'Towel a third of the way, on the flat part before the green starts to rise.', 'Practice balls further back stay out of the way.'],
      }
    },
  },
  {
    id: 'OB-047', options: 2, name: 'Three hoops', type: 'chip', minutes: 20, players: '2 to 6',
    goal: 'Land chips in hoops at three distances. Pairs compete: first to land all three.',
    rules: ['3 hoops, 80 cm across', 'Short, middle, long', 'Leave 1 m between hoops'],
    layout(area, v = 0) {
      const start = area.start
      const far = add(area.hole, v === 0 ? 0.8 : 2.2, 1.5)
      const L = dist(start, far)
      return {
        markers: [
          { kind: 'ball', at: start, label: 'Hitting spot', n: 1 },
          ...[0.3, 0.55, 0.85].map((t, i) => ({ kind: 'ring', c: toward(start, far, L * t), r: 0.4, label: ['Short hoop', 'Middle hoop', 'Long hoop'][i], n: i + 2, solid: true })),
        ],
        why: ['Hoops follow a line that stays on the flat front of the green.', `Distances ${(L * 0.3).toFixed(1)}, ${(L * 0.55).toFixed(1)} and ${(L * 0.85).toFixed(1)} m, at least 1 m apart.`],
      }
    },
  },
  {
    id: 'OB-005', name: 'Train tracks', type: 'range', minutes: 15, players: '1',
    goal: 'Aim the club and the body. One stick along the ball line, one along the feet.',
    rules: ['Two sticks parallel to the target line', 'Ball stick 10 cm outside the ball', 'Feet stick 45 cm inside'],
    layout(area) {
      const b = area.ball
      return {
        markers: [
          { kind: 'ball', at: b, label: 'Ball', n: 1 },
          { kind: 'stick', from: add(b, 0.12, -0.5), to: add(b, 0.12, 0.7), label: 'Target line stick', n: 2 },
          { kind: 'stick', from: add(b, -0.45, -0.5), to: add(b, -0.45, 0.7), label: 'Feet line stick', n: 3 },
          { kind: 'line', from: b, to: add(b, 0, 40), label: 'To the 100 m flag' },
        ],
        why: ['Both sticks on the mat, parallel to the line to the 100 m flag.', 'Ball stick on the target side so it does not get hit.'],
      }
    },
  },
  {
    id: 'OB-009', options: 2, name: 'Start line gate, full swing', type: 'range', minutes: 20, players: '1',
    goal: 'Start the ball through a gate of two sticks a few metres ahead.',
    rules: ['Gate 3 m in front of the ball', 'Sticks 25 cm apart, upright', 'Aimed at the target'],
    layout(area, v = 0) {
      const b = area.ball; const g = add(b, 0, v === 0 ? 3 : 4.5)
      return {
        markers: [
          { kind: 'ball', at: b, label: 'Ball', n: 1 },
          { kind: 'upright', at: add(g, -0.125, 0), label: 'Gate stick', n: 2 },
          { kind: 'upright', at: add(g, 0.125, 0), label: 'Gate stick', n: 2 },
          { kind: 'line', from: b, to: add(b, 0, 40), label: 'Target line' },
        ],
        why: [`Gate ${v === 0 ? '3' : '4.5'} m out, just past the end of the mat, so the sticks go into grass.`, 'Gate centred on the line to the 100 m flag.'],
      }
    },
  },
  {
    id: 'OB-022', options: 2, name: 'Distance ladder, 10 to 20 m', type: 'pitch', minutes: 25, players: '1 to 4',
    goal: 'Pitch to three cones at 10, 15 and 20 m. Score by how close.',
    rules: ['Cones at 10, 15 and 20 m', 'Straight line from the hitting spot', 'Keep 1 m clear of anything in the way'],
    layout(area, v = 0) {
      const b = area.ball; const dirX = v === 0 ? -0.08 : 0.12
      return {
        markers: [
          { kind: 'ball', at: b, label: 'Hitting spot', n: 1 },
          ...[10, 15, 20].map((d, i) => ({ kind: 'cone', at: add(b, dirX * d, d), label: `${d} m cone`, n: i + 2 })),
          { kind: 'ring', c: area.bag, r: 1, label: 'Kept clear: golf bag', avoid: true },
        ],
        why: ['Line angled slightly left to keep more than 1 m from the golf bag.', 'All three cones on the flat ground the photo shows.'],
      }
    },
  },
  { id: 'OB-061', name: 'Combine test, 10 shots', type: 'sim', minutes: 30, players: '1', goal: 'Trackman combine for a baseline. Needs a photo of the Trackman room first.', rules: ['Ball 2.4 m from the radar', 'Target screen centred'], layout: null },
  { id: 'OB-036', name: 'Lag ladder, 6 to 12 m', type: 'putt', minutes: 20, players: '1 to 4', goal: 'Lag putts to finish inside a 1 m circle. Needs a longer green than this photo shows.', rules: ['Balls at 6, 9 and 12 m', '1 m circle around the hole'], layout: null, needs: 'More green than this photo shows. Take the photo from further back.' },
]
export const exerciseOf = (id) => EXERCISES.find((e) => e.id === id)

function norm(v) { const L = Math.hypot(v.X, v.Z) || 1; return { X: v.X / L, Z: v.Z / L } }
function unit(a, b) { const L = dist(a, b) || 1; return { X: (b.X - a.X) / L, Z: (b.Z - a.Z) / L } }

// What the coach needs to carry for a layout.
export function packList(markers) {
  const count = {}
  for (const m of markers) {
    const k = { tee: 'Tees', ball: 'Balls', stick: 'Alignment sticks', upright: 'Alignment sticks', cone: 'Cones', towel: 'Towel', ring: m.solid ? 'Hoops' : null }[m.kind]
    if (k) count[k] = (count[k] || 0) + 1
  }
  return Object.entries(count)
}
