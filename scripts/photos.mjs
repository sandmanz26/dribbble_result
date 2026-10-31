// Turns the generated source photos in raw/ into self-hosted WebP renditions.
import sharp from 'sharp'
import { readdirSync, mkdirSync } from 'node:fs'

const SRC = 'raw', OUT = 'public/photos'
mkdirSync(OUT, { recursive: true })
for (const f of readdirSync(SRC).filter((x) => x.endsWith('.png'))) {
  const name = f.replace('.png', '')
  for (const w of [800, 1600]) {
    await sharp(`${SRC}/${f}`).resize({ width: w, withoutEnlargement: true }).webp({ quality: w > 1000 ? 78 : 74 }).toFile(`${OUT}/${name}-${w}.webp`)
  }
  console.log(name)
}
