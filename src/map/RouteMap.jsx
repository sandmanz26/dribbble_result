import { useMemo } from 'react'
import { geoNaturalEarth1, geoPath } from 'd3-geo'
import { feature } from 'topojson-client'
import world from 'world-atlas/countries-110m.json'
import { PEOPLE, initials } from '../data/people.js'

// Caravan's signature: everyone in a group, drawn travelling from their home city to the same place.
const land = feature(world, world.objects.countries).features

export default function RouteMap({ dest, people, w = 360, h = 220, tone = 'light', pad = 26, showNames = true, label }) {
  const geo = useMemo(() => {
    const pts = [dest.at, ...people.map((id) => PEOPLE[id].at)]
    const projection = geoNaturalEarth1().fitExtent([[pad, pad], [w - pad, h - pad]], { type: 'MultiPoint', coordinates: pts })
    const path = geoPath(projection)
    return {
      land: land.map((f) => path(f)).filter(Boolean),
      arcs: people.map((id) => ({ id, d: path({ type: 'LineString', coordinates: [PEOPLE[id].at, dest.at] }), p: projection(PEOPLE[id].at) })),
      dest: projection(dest.at),
    }
  }, [dest, people, w, h, pad])
  return (
    <svg className={`route route-${tone}`} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid slice" role="img"
      aria-label={label || `${people.length} travellers heading to ${dest.name}`}>
      <rect width={w} height={h} className="route-sea" />
      {geo.land.map((d, i) => <path key={i} d={d} className="route-land" />)}
      {geo.arcs.map((a, i) => <path key={a.id} d={a.d} className="route-arc" style={{ animationDelay: `${i * 140}ms` }} />)}
      {geo.arcs.map((a) => (
        <g key={a.id + 'p'} transform={`translate(${a.p[0]} ${a.p[1]})`} className="route-home" style={{ '--h': PEOPLE[a.id].hue }}>
          <circle r="9" />
          {showNames && <text dy="3.5">{initials(a.id)[0]}</text>}
        </g>
      ))}
      <g transform={`translate(${geo.dest[0]} ${geo.dest[1]})`} className="route-dest">
        <circle r="13" className="route-dest-halo" />
        <circle r="6" />
      </g>
    </svg>
  )
}
