import { useMemo } from 'react'
import { geoMercator, geoPath } from 'd3-geo'
import { feature } from 'topojson-client'
import world from 'world-atlas/countries-50m.json'

// Destination art drawn from real geography (Natural Earth via world-atlas), not stock photos:
// the coast around the place, its country one step darker, the place as a dot.
const countries = feature(world, world.objects.countries).features

const cache = new Map()

function shapes(at, span, iso, w, h) {
  const key = `${at}:${span}:${w}x${h}`
  if (cache.has(key)) return cache.get(key)
  // Scale so `span` km fits across the width. Mercator stretches by 1 / cos(lat), so undo that.
  const kmPerPx = span / w
  const scale = (6371 * Math.cos((at[1] * Math.PI) / 180)) / kmPerPx
  const projection = geoMercator().center(at).scale(scale).translate([w / 2, h / 2]).clipExtent([[-2, -2], [w + 2, h + 2]])
  const path = geoPath(projection)
  const near = countries
    .map((f) => ({ id: f.id, d: path(f) }))
    .filter((x) => x.d)
  const out = { home: near.filter((x) => x.id === iso), other: near.filter((x) => x.id !== iso), dot: projection(at) }
  cache.set(key, out)
  return out
}

export default function MapArt({ place, w = 360, h = 200, label = true, className = '', zoom = 1 }) {
  const { home, other, dot } = useMemo(() => shapes(place.at, place.span / zoom, place.iso, w, h), [place, w, h, zoom])
  return (
    <svg className={`map ${className}`} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid slice" role="img"
      aria-label={`Map of ${place.name}, ${place.country}`}>
      <rect width={w} height={h} className="map-sea" />
      {other.map((c) => <path key={c.id + 'o'} d={c.d} className="map-land" />)}
      {home.map((c) => <path key={c.id + 'h'} d={c.d} className="map-home" />)}
      <circle cx={dot[0]} cy={dot[1]} r="9" className="map-halo" />
      <circle cx={dot[0]} cy={dot[1]} r="4" className="map-dot" />
      {label && (
        <text x={dot[0] > w * 0.62 ? dot[0] - 12 : dot[0] + 12} y={dot[1] + 4} textAnchor={dot[0] > w * 0.62 ? 'end' : 'start'} className="map-label">{place.name}</text>
      )}
    </svg>
  )
}
