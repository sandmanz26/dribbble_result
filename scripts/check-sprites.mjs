// Fails the build if a sprite breaks the hardware rules: more than 4 palette entries,
// ragged rows, or a character with no palette mapping.
import { SPRITES, colorsIn } from '../src/engine/sprites.js'
import { PALETTE } from '../src/engine/palette.js'

let bad = 0
for (const sp of Object.values(SPRITES)) {
  const used = colorsIn(sp)
  if (used.size > 4) { console.error(`${sp.name}: ${used.size} colours, max 4`); bad++ }
  if (sp.rows.some((r) => r.length !== sp.w)) { console.error(`${sp.name}: rows are not all ${sp.w} wide`); bad++ }
  if ([...used].some((c) => c == null)) { console.error(`${sp.name}: unmapped character`); bad++ }
}
if (PALETTE.length !== 16) { console.error(`palette has ${PALETTE.length} entries`); bad++ }
console.log(bad ? `${bad} problem(s)` : `${Object.keys(SPRITES).length} sprites, all within 4 colours. Palette 16.`)
process.exit(bad ? 1 : 0)
