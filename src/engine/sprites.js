import { C } from './palette.js'
import { FONT } from './font.js'

// Sprites are stored 2 bits per pixel: at most 4 palette entries each, and one of
// them may be KEY (fully transparent). No other transparency exists on the device.
// `.` is always KEY. Other characters map to palette indexes per sprite.

const s = (name, map, rows, group = 'ui') => ({ name, group, w: rows[0].length, h: rows.length, map: { '.': C.KEY, ...map }, rows })

const ICONS = [
  s('camera', { '#': C.PAPER, o: C.SAFE }, [
    '............',
    '...####.....',
    '.##########.',
    '.#......oo#.',
    '.#..####..#.',
    '.#.#....#.#.',
    '.#.#....#.#.',
    '.#..####..#.',
    '.#........#.',
    '.##########.',
    '............',
    '............',
  ], 'status'),
  s('wifi', { '#': C.PAPER }, [
    '............',
    '...######...',
    '.##......##.',
    '#..######..#',
    '..#......#..',
    '.#..####..#.',
    '...#....#...',
    '....####....',
    '............',
    '.....##.....',
    '.....##.....',
    '............',
  ], 'status'),
  s('usb', { '#': C.PAPER }, [
    '.....##.....',
    '....####....',
    '.....##.....',
    '.##..##..##.',
    '.##..##..##.',
    '..#..##..#..',
    '..#..##..#..',
    '...#.##.#...',
    '....####....',
    '.....##.....',
    '....####....',
    '....####....',
  ], 'status'),
  s('card', { '#': C.PAPER, o: C.DIM }, [
    '...######...',
    '..#o.o.o.#..',
    '.#.o.o.o.#..',
    '.#.......#..',
    '.#.......#..',
    '.#.......#..',
    '.#.......#..',
    '.#.......#..',
    '.#.......#..',
    '.#########..',
    '............',
    '............',
  ], 'status'),
  s('sync', { '#': C.PAPER }, [
    '....####....',
    '..##....##.#',
    '.#........##',
    '.#......####',
    '#...........',
    '#...........',
    '...........#',
    '...........#',
    '####......#.',
    '##........#.',
    '#.##....##..',
    '....####....',
  ]),
  s('shutter', { '#': C.PAPER, o: C.SAFE }, [
    '....####....',
    '..##....##..',
    '.#........#.',
    '.#..oooo..#.',
    '#..oooooo..#',
    '#..oooooo..#',
    '#..oooooo..#',
    '#..oooooo..#',
    '.#..oooo..#.',
    '.#........#.',
    '..##....##..',
    '....####....',
  ]),
  s('gear', { '#': C.PAPER }, [
    '.....##.....',
    '..#.####.#..',
    '.##########.',
    '..###..###..',
    '.##......##.',
    '####....####',
    '####....####',
    '.##......##.',
    '..###..###..',
    '.##########.',
    '..#.####.#..',
    '.....##.....',
  ]),
  s('chip', { '#': C.PAPER, o: C.DIM }, [
    '..o.o..o.o..',
    '............',
    'o.########.o',
    '..#......#..',
    'o.#.####.#.o',
    '..#.#..#.#..',
    '..#.#..#.#..',
    'o.#.####.#.o',
    '..#......#..',
    'o.########.o',
    '............',
    '..o.o..o.o..',
  ]),
  s('link', { '#': C.PAPER }, [
    '............',
    '......####..',
    '.....#....#.',
    '.....#....#.',
    '....###..#..',
    '...#..#.#...',
    '...#.#..#...',
    '..#..###....',
    '.#....#.....',
    '.#....#.....',
    '..####......',
    '............',
  ]),
  s('check', { '#': C.OK }, [
    '............',
    '............',
    '..........##',
    '.........##.',
    '........##..',
    '.##....##...',
    '..##..##....',
    '...####.....',
    '....##......',
    '............',
    '............',
    '............',
  ], 'state'),
  s('cross', { '#': C.SAFE }, [
    '............',
    '.##......##.',
    '..##....##..',
    '...##..##...',
    '....####....',
    '.....##.....',
    '....####....',
    '...##..##...',
    '..##....##..',
    '.##......##.',
    '............',
    '............',
  ], 'state'),
  s('warn', { '#': C.WARN, o: C.VOID }, [
    '.....##.....',
    '....####....',
    '....#oo#....',
    '...##oo##...',
    '...##oo##...',
    '..###oo###..',
    '..###oo###..',
    '.####oo####.',
    '.##########.',
    '#####oo#####',
    '############',
    '............',
  ], 'state'),
  s('clock', { '#': C.PAPER, o: C.SAFE }, [
    '....####....',
    '..##....##..',
    '.#....o...#.',
    '.#....o...#.',
    '#.....o....#',
    '#.....oooo.#',
    '#..........#',
    '#..........#',
    '.#........#.',
    '.#........#.',
    '..##....##..',
    '....####....',
  ]),
  s('image', { '#': C.PAPER, o: C.SOFT }, [
    '############',
    '#..........#',
    '#.......oo.#',
    '#.......oo.#',
    '#..........#',
    '#....o.....#',
    '#...ooo....#',
    '#..ooooo.o.#',
    '#.ooooooooo#',
    '############',
    '............',
    '............',
  ]),
  s('bolt', { '#': C.SAFE }, [
    '......###...',
    '.....###....',
    '....###.....',
    '...###......',
    '..#######...',
    '.....###....',
    '....###.....',
    '...###......',
    '..##........',
    '.#..........',
    '............',
    '............',
  ]),
]

// Round buttons: a 13px disc with the label knocked out of it.
function disc(name, label, fill) {
  const rows = []
  for (let y = 0; y < 13; y++) {
    let r = ''
    for (let x = 0; x < 13; x++) {
      const dx = x - 6, dy = y - 6
      r += dx * dx + dy * dy <= 40 ? '#' : '.'
    }
    rows.push([...r])
  }
  const g = FONT[label]
  for (let y = 0; y < 7; y++) for (let x = 0; x < 5; x++) if (g[y][x]) rows[3 + y][4 + x] = 'o'
  return s(name, { '#': fill, o: C.VOID }, rows.map((r) => r.join('')), 'input')
}

function pill(name, fill) {
  const rows = [
    '.###########.',
    '#############',
    '##ooooooooo##',
    '#############',
    '##ooooooooo##',
    '#############',
    '##ooooooooo##',
    '#############',
    '.###########.',
  ]
  return s(name, { '#': fill, o: C.VOID }, rows, 'input')
}

function power(name, fill) {
  return s(name, { '#': fill, o: C.VOID }, [
    '....#####....',
    '..#########..',
    '.#####o#####.',
    '.###o#o#o###.',
    '###o##o##o###',
    '##o###o###o##',
    '##o#######o##',
    '##o#######o##',
    '###o#####o###',
    '.###ooooo###.',
    '.###########.',
    '..#########..',
    '....#####....',
  ], 'input')
}

// D-pad with one arm lit.
function dpad(name, dir) {
  const base = [
    '....#####....',
    '....#####....',
    '....#####....',
    '....#####....',
    '#############',
    '#############',
    '#############',
    '#############',
    '#############',
    '....#####....',
    '....#####....',
    '....#####....',
    '....#####....',
  ].map((r) => [...r])
  const lit = { up: [[4, 0, 5, 4]], down: [[4, 9, 5, 4]], left: [[0, 4, 4, 5]], right: [[9, 4, 4, 5]], all: [] }[dir]
  for (const [x0, y0, w, h] of lit) for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) base[y][x] = 'o'
  return s(name, { '#': C.LINE, o: C.SAFE }, base.map((r) => r.join('')), 'input')
}

export const INPUTS = [
  dpad('dpad', 'all'), dpad('dpad-up', 'up'), dpad('dpad-down', 'down'), dpad('dpad-left', 'left'), dpad('dpad-right', 'right'),
  disc('btn-a', 'A', C.PAPER), disc('btn-a-on', 'A', C.SAFE), disc('btn-b', 'B', C.SOFT), disc('btn-b-on', 'B', C.SAFE),
  pill('btn-menu', C.SOFT), pill('btn-menu-on', C.SAFE), power('btn-pwr', C.SOFT), power('btn-pwr-on', C.SAFE),
]

// Battery: 15x8, level 0 to 4 bars.
export function battery(level, charging) {
  const rows = []
  const fill = level <= 1 ? C.WARN : C.PAPER
  for (let y = 0; y < 8; y++) {
    let r = ''
    for (let x = 0; x < 15; x++) {
      const edge = y === 0 || y === 7 || x === 0 || x === 13
      if (x === 14) r += y >= 2 && y <= 5 ? '#' : '.'
      else if (edge) r += '#'
      else if (y >= 2 && y <= 5 && x >= 2 && x <= 11) {
        const bar = Math.floor((x - 2) / 2.5)
        r += bar < level && (x - 2) % 5 !== 4 ? 'o' : '.'
      } else r += '.'
    }
    rows.push(r)
  }
  return s(`battery-${level}${charging ? '-c' : ''}`, { '#': C.SOFT, o: charging ? C.OK : fill }, rows, 'status')
}

export const SPRITES = Object.fromEntries([...ICONS, ...INPUTS].map((sp) => [sp.name, sp]))

export function colorsIn(sp) {
  const used = new Set()
  for (const row of sp.rows) for (const ch of row) used.add(sp.map[ch])
  return used
}

// 2bpp storage: 4 pixels per byte, plus a 4-entry palette header.
export const spriteBytes = (sp) => Math.ceil((sp.w * sp.h) / 4) + 4
