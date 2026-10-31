// v2 photos: raw/v2/*.png to public/v2/photos at 800, 1600 and full width (for big screens).
import sharp from 'sharp'
import { readdirSync, mkdirSync } from 'node:fs'

const SRC = 'raw/v2', OUT = 'public/v2/photos'
mkdirSync(OUT, { recursive: true })
for (const f of readdirSync(SRC).filter((x) => x.endsWith('.png'))) {
  const name = f.replace('.png', '')
  for (const w of [800, 1600, 2400]) {
    await sharp(`${SRC}/${f}`).resize({ width: w, withoutEnlargement: true }).webp({ quality: w > 1000 ? 80 : 76 }).toFile(`${OUT}/${name}-${w}.webp`)
  }
}
console.log('done')
