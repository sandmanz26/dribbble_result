// Ground-plane geometry for one photo. The AI's job in the real product is to find this camera
// model from the photo (the horizon, the camera height, the focal length) using things whose size is
// known: a hole is 108 mm across, a ball 42.7 mm, a mat 1.5 m. Here each area photo carries the model
// the AI would return, and every marker is placed in metres on the ground, then projected.
//
// Coordinates: the photo is 1200 x 900. On the ground, X is metres to the right of the camera, Z is
// metres straight ahead. cam = { cx, yh, f, h }: image centre x, horizon y, focal length in px, height in m.

export const W = 1200
export const H = 900

export function project(cam, X, Z) {
  return { x: cam.cx + (cam.f * X) / Z, y: cam.yh + (cam.f * cam.h) / Z }
}

export function unproject(cam, x, y) {
  const dy = Math.max(2, y - cam.yh)
  const Z = (cam.f * cam.h) / dy
  return { X: ((x - cam.cx) * Z) / cam.f, Z }
}

// Pixels per metre at a ground distance Z: used to size what stands on the ground.
export const scaleAt = (cam, Z) => cam.f / Z

export const dist = (a, b) => Math.hypot(a.X - b.X, a.Z - b.Z)
export const add = (a, dx, dz) => ({ X: a.X + dx, Z: a.Z + dz })
// A point at distance d from a, heading towards b (or along unit vector u).
export function toward(a, b, d) {
  const L = dist(a, b) || 1
  return { X: a.X + ((b.X - a.X) / L) * d, Z: a.Z + ((b.Z - a.Z) / L) * d }
}
export function perp(a, b) {
  const L = dist(a, b) || 1
  return { X: -(b.Z - a.Z) / L, Z: (b.X - a.X) / L }
}
export const offset = (p, u, d) => ({ X: p.X + u.X * d, Z: p.Z + u.Z * d })

// A circle or rectangle lying on the ground, as an image polygon.
export function groundCircle(cam, c, r, n = 28) {
  return Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2
    return project(cam, c.X + Math.cos(a) * r, c.Z + Math.sin(a) * r)
  })
}
export function groundRect(cam, c, w, d, along = { X: 0, Z: 1 }) {
  const side = { X: along.Z, Z: -along.X }
  const pts = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([s, t]) => ({ X: c.X + side.X * (w / 2) * s + along.X * (d / 2) * t, Z: c.Z + side.Z * (w / 2) * s + along.Z * (d / 2) * t }))
  return pts.map((p) => project(cam, p.X, p.Z))
}
export const poly = (pts) => pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')

// For a coach's own photo with no known object in it: two taps and the distance between them set
// the camera height, everything else is assumed (a typical phone lens, a horizon a quarter down).
export function calibrate(p1, p2, metres) {
  const base = { cx: W / 2, yh: H * 0.22, f: 1000, h: 1 }
  const a = unproject(base, p1.x, p1.y); const b = unproject(base, p2.x, p2.y)
  const d = dist(a, b) || 1
  return { ...base, h: metres / d }
}

export const fmtM = (m) => (m < 1 ? `${Math.round(m * 100)} cm` : `${m.toFixed(m < 10 ? 1 : 0)} m`)
