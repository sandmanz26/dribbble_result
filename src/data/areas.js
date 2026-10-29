// The coach's areas at Oslo Golf Club. Each photo carries what the AI read from it: the camera model
// (see lib/geo.js), what it found, how sure it is, and what it used for scale.
import { unproject } from '../lib/geo.js'

const putCam = { cx: 600, yh: 120, f: 1000, h: 1.6 }
const chipCam = { cx: 600, yh: 40, f: 1000, h: 1.5 }
const rangeCam = { cx: 655, yh: 160, f: 900, h: 1.63 }
const pitchCam = { cx: 600, yh: 205, f: 1000, h: 1.5 }

export const AREAS = [
  {
    id: 'putting', name: 'Putting green', where: 'By the clubhouse', type: 'putt', photo: 'putting-green', taken: 'Today, 08:12',
    cam: putCam, hole: unproject(putCam, 488, 580), holePx: { x: 488, y: 580 },
    seen: [
      { what: 'Hole and flag', how: 'Found the cup and the flagstick', sure: 'Sure' },
      { what: 'Scale', how: 'From the cup, 108 mm across', sure: 'Sure' },
      { what: 'Slope', how: 'Falls gently from right to left, from mowing lines and the flag’s shadow', sure: 'Estimate, check it' },
      { what: 'Usable ground', how: 'About 5 m wide and 6 m deep in view, nothing in the way', sure: 'Sure' },
    ],
  },
  {
    id: 'chipping', name: 'Chipping green', where: 'Behind the range', type: 'chip', photo: 'chipping-green', taken: 'Yesterday, 16:40',
    cam: chipCam, hole: unproject(chipCam, 190, 415), holePx: { x: 190, y: 415 }, start: { X: 0.9, Z: 2.1 },
    seen: [
      { what: 'Hole and flag', how: 'Nearest flag at the left; a second flag far back', sure: 'Sure' },
      { what: 'Scale', how: 'From the balls on the green, 42.7 mm each', sure: 'Sure' },
      { what: 'Fringe and slope', how: 'Green rises slowly towards the back', sure: 'Estimate, check it' },
      { what: 'Practice balls', how: 'About 60 balls further back; left out of the layout', sure: 'Sure' },
    ],
  },
  {
    id: 'range', name: 'Range bay 4', where: 'Driving range, covered end', type: 'range', photo: 'range-bay', taken: '12 Oct, 10:05',
    cam: rangeCam, ball: { X: -0.02, Z: 2.5 }, target: { X: 0, Z: 1 },
    seen: [
      { what: 'Hitting mat', how: 'Mat inside a wooden frame, facing the range', sure: 'Sure' },
      { what: 'Scale', how: 'From the mat, 1.5 m wide', sure: 'Sure' },
      { what: 'Target line', how: 'Straight down the range towards the 100 m flag', sure: 'Sure' },
      { what: 'Ground', how: 'Grass begins 0.8 m beyond the mat; sticks can go there', sure: 'Sure' },
    ],
  },
  {
    id: 'pitching', name: 'Short game area', where: 'Practice tee by hole 1', type: 'pitch', photo: 'short-game', taken: '9 Oct, 18:20',
    cam: pitchCam, ball: unproject(pitchCam, 515, 650), bag: unproject(pitchCam, 1000, 640),
    seen: [
      { what: 'Hitting spot', how: 'Tee marker in the foreground', sure: 'Sure' },
      { what: 'Scale', how: 'From the tee marker, 20 cm tall', sure: 'Fairly sure' },
      { what: 'Something in the way', how: 'A golf bag on the right; layout keeps 1 m clear of it', sure: 'Sure' },
      { what: 'Open ground', how: 'Flat for about 25 m straight ahead', sure: 'Sure' },
    ],
  },
  { id: 'trackman', name: 'Trackman room', where: 'Indoor studio', type: 'sim', photo: null, taken: null, seen: [] },
]
export const areaOf = (id) => AREAS.find((a) => a.id === id)
export const TYPE_NAME = { putt: 'Putting', chip: 'Chipping', range: 'Range', pitch: 'Pitching', sim: 'Trackman' }
