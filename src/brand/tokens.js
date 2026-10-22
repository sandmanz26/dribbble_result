// Dual-brand token system.
//
// Three tiers, the same shape Figma variables would use:
//   core       raw values per brand (palette, type, radius). Never used by components directly.
//   semantic   role-based tokens (bg, ink, accent, danger...). One collection, modes = brand x scheme.
//   component  a few per-component decisions that differ by brand (button case, control radius).
//
// Components only read semantic and component tokens as CSS variables, so a brand swap is a
// token swap: no component forks. Brand values below are placeholders until the Valvoline
// design system file is shared; the structure is the deliverable.

export const BRANDS = ['nubrakes', 'valvoline']
export const SCHEMES = ['light', 'dark']

export const BRAND_META = {
  nubrakes: {
    name: 'NuBrakes',
    product: 'NuBrakes',
    endorsement: 'A Valvoline company',
    short: 'NuBrakes',
    // Brand content tokens: what the customer sees on ids, statements and the van.
    fullName: 'NuBrakes Mobile Brake Repair',
    bookingPrefix: 'NB-',
    statementName: 'NUBRAKES MOBILE BRAKE',
    vanLivery: 'NuBrakes livery',
  },
  valvoline: {
    name: 'Valvoline',
    product: 'Mobile Brake Service',
    endorsement: 'From the team at NuBrakes',
    short: 'Valvoline',
    fullName: 'Valvoline Mobile Brake Service',
    bookingPrefix: 'VMB-',
    statementName: 'VALVOLINE MOBILE BRAKE',
    // Vans are repainted market by market, so the livery can lag behind the brand on the booking.
    vanLivery: 'NuBrakes livery',
  },
}

export const core = {
  nubrakes: {
    'yellow-300': '#FFD54D',
    'yellow-400': '#FFC61A',
    'yellow-500': '#F5B800',
    'yellow-700': '#7A5900',
    'ink-950': '#121212',
    'ink-800': '#2B2B2B',
    'stone-50': '#F7F6F2',
    'stone-100': '#EFEDE6',
    'stone-500': '#6B6A64',
    'night-900': '#111214',
    'night-800': '#1A1B1E',
    'night-700': '#24262A',
  },
  valvoline: {
    'red-500': '#E0353B',
    'red-600': '#D2232A',
    'red-700': '#B51C23',
    'red-900': '#8F1218',
    'navy-950': '#07142B',
    'navy-900': '#0B1F44',
    'navy-800': '#122A57',
    'navy-600': '#3A4E78',
    'mist-50': '#F3F5F9',
    'mist-100': '#E6EAF2',
    'mist-400': '#9AA6BF',
  },
}

const c = core

export const semantic = {
  nubrakes: {
    light: {
      bg: '#FFFFFF',
      sunken: c.nubrakes['stone-50'],
      surface: '#FFFFFF',
      raised: '#FFFFFF',
      ink: c.nubrakes['ink-950'],
      muted: c.nubrakes['stone-500'],
      line: 'rgb(18 18 18 / 0.12)',
      'line-strong': 'rgb(18 18 18 / 0.28)',
      accent: c.nubrakes['yellow-500'],
      'on-accent': c.nubrakes['ink-950'],
      'accent-text': c.nubrakes['yellow-700'],
      'accent-soft': '#FFF4CC',
      'selected-bg': '#FFF4CC',
      'selected-line': c.nubrakes['ink-950'],
      focus: c.nubrakes['ink-950'],
      success: '#1D7446',
      'success-soft': '#E3F3EA',
      warning: '#8A5300',
      'warning-soft': '#FDF0D9',
      danger: '#B42318',
      'danger-soft': '#FDE8E6',
      inverse: c.nubrakes['ink-950'],
      'on-inverse': '#FFFFFF',
    },
    dark: {
      bg: c.nubrakes['night-900'],
      sunken: '#0B0C0D',
      surface: c.nubrakes['night-800'],
      raised: c.nubrakes['night-700'],
      ink: '#F3F2EE',
      muted: '#A3A29C',
      line: 'rgb(243 242 238 / 0.12)',
      'line-strong': 'rgb(243 242 238 / 0.3)',
      accent: c.nubrakes['yellow-400'],
      'on-accent': c.nubrakes['ink-950'],
      'accent-text': c.nubrakes['yellow-300'],
      'accent-soft': 'rgb(255 198 26 / 0.14)',
      'selected-bg': 'rgb(255 198 26 / 0.12)',
      'selected-line': '#F3F2EE',
      focus: c.nubrakes['yellow-400'],
      success: '#5CC98C',
      'success-soft': 'rgb(92 201 140 / 0.14)',
      warning: '#F2B04A',
      'warning-soft': 'rgb(242 176 74 / 0.14)',
      danger: '#FF8A7A',
      'danger-soft': 'rgb(255 138 122 / 0.14)',
      inverse: '#F3F2EE',
      'on-inverse': c.nubrakes['ink-950'],
    },
  },
  valvoline: {
    light: {
      bg: '#FFFFFF',
      sunken: c.valvoline['mist-50'],
      surface: '#FFFFFF',
      raised: '#FFFFFF',
      ink: c.valvoline['navy-900'],
      muted: c.valvoline['navy-600'],
      line: 'rgb(11 31 68 / 0.14)',
      'line-strong': 'rgb(11 31 68 / 0.32)',
      accent: c.valvoline['red-600'],
      'on-accent': '#FFFFFF',
      'accent-text': c.valvoline['red-700'],
      'accent-soft': '#FCE9EA',
      // Selection is navy, not red: a red-tinted choice next to an error field read as a mistake.
      'selected-bg': c.valvoline['mist-100'],
      'selected-line': c.valvoline['navy-900'],
      focus: c.valvoline['navy-900'],
      success: '#17704A',
      'success-soft': '#E2F2EA',
      warning: '#8A5300',
      'warning-soft': '#FCEFD8',
      // Brand red and error red are too close to tell apart. Errors use a deeper red and always
      // carry an icon and text, never colour alone.
      danger: c.valvoline['red-900'],
      'danger-soft': '#F9E3E4',
      inverse: c.valvoline['navy-900'],
      'on-inverse': '#FFFFFF',
    },
    dark: {
      bg: c.valvoline['navy-950'],
      sunken: '#040C1C',
      surface: '#0E1F3D',
      raised: c.valvoline['navy-800'],
      ink: '#EEF2F8',
      muted: c.valvoline['mist-400'],
      line: 'rgb(238 242 248 / 0.13)',
      'line-strong': 'rgb(238 242 248 / 0.32)',
      accent: c.valvoline['red-600'],
      'on-accent': '#FFFFFF',
      'accent-text': '#FF7D82',
      'accent-soft': 'rgb(224 53 59 / 0.16)',
      'selected-bg': 'rgb(154 166 191 / 0.16)',
      'selected-line': '#EEF2F8',
      focus: '#FFFFFF',
      success: '#5CC98C',
      'success-soft': 'rgb(92 201 140 / 0.14)',
      warning: '#F2B04A',
      'warning-soft': 'rgb(242 176 74 / 0.14)',
      danger: '#FF9A9E',
      'danger-soft': 'rgb(255 154 158 / 0.14)',
      inverse: '#EEF2F8',
      'on-inverse': c.valvoline['navy-900'],
    },
  },
}

// Type, shape and component tokens do not change with the colour scheme.
// Display sizes are fluid: clamp(min, viewport share, max).
const TYPE_RAMP = {
  'display-xl-size': 'clamp(42px, 6.4vw, 76px)',
  'display-xl-leading': '1.04',
  'display-lg-size': 'clamp(34px, 4.6vw, 54px)',
  'display-md-size': 'clamp(28px, 3.4vw, 40px)',
  'display-sm-size': 'clamp(22px, 2.4vw, 28px)',
  'display-xs-size': '20px',
}
// Spacing for stacks and layouts. Same for both brands.
const SPACE = {
  'space-1': '2px',
  'space-2': '6px',
  'space-3': '10px',
  'space-4': '14px',
  'space-5': '20px',
  'space-6': '28px',
  'space-7': '40px',
  'space-8': '56px',
}

export const shape = {
  nubrakes: {
    ...TYPE_RAMP,
    ...SPACE,
    'font-display': "'Archivo Variable', 'Arial Narrow', sans-serif",
    'font-body': "'Public Sans Variable', system-ui, sans-serif",
    'display-wdth': '100',
    'display-wght': '760',
    'display-case': 'none',
    'display-track': '-0.025em',
    'radius-sm': '8px',
    'radius-md': '12px',
    'radius-lg': '20px',
    'radius-control': '12px',
    'button-case': 'none',
    'button-track': '0',
    'button-wght': '650',
    // Destructive buttons: a red fill is fine next to a yellow primary, not next to a red one.
    'button-danger-style': 'filled',
    'shadow-1': '0 1px 2px rgb(0 0 0 / 0.06), 0 2px 8px rgb(0 0 0 / 0.05)',
    'shadow-2': '0 12px 32px rgb(0 0 0 / 0.14)',
  },
  valvoline: {
    ...TYPE_RAMP,
    // Condensed uppercase reads smaller at the same size, so the hero size goes up.
    'display-xl-size': 'clamp(48px, 7.4vw, 92px)',
    'display-xl-leading': '0.95',
    ...SPACE,
    'font-display': "'Archivo Variable', 'Arial Narrow', sans-serif",
    'font-body': "'Public Sans Variable', system-ui, sans-serif",
    'display-wdth': '72',
    'display-wght': '820',
    'display-case': 'uppercase',
    'display-track': '0.005em',
    'radius-sm': '2px',
    'radius-md': '4px',
    'radius-lg': '6px',
    'radius-control': '4px',
    'button-case': 'uppercase',
    'button-track': '0.06em',
    'button-wght': '720',
    'button-danger-style': 'outline',
    'shadow-1': '0 0 0 1px rgb(11 31 68 / 0.06)',
    'shadow-2': '0 10px 28px rgb(4 12 28 / 0.22)',
  },
}

export const SEMANTIC_DOCS = {
  bg: 'Page background',
  sunken: 'Bands and wells behind content',
  surface: 'Cards, sheets, inputs',
  raised: 'Popovers, menus',
  ink: 'Primary text and icons',
  muted: 'Secondary text',
  line: 'Dividers, input borders',
  'line-strong': 'Hover and selected borders',
  accent: 'Primary action fill. One per view',
  'on-accent': 'Text on accent fill',
  'accent-text': 'Accent used as text (AA on bg)',
  'accent-soft': 'Tags and highlights',
  'selected-bg': 'Selected choice background',
  'selected-line': 'Selected choice border',
  focus: 'Focus ring',
  success: 'Confirmed, completed',
  warning: 'Needs attention, not blocking',
  danger: 'Errors and destructive actions',
  inverse: 'Dark band fill',
  'on-inverse': 'Text on inverse',
}

// Design direction. V1 "Editorial": large type, soft surfaces, side summary.
// V2 "Job ticket": square edges, ruled lines instead of fills, IBM Plex with mono figures,
// dense price board. Same components and brand colours; only type, shape and layout change.
export const STYLES = ['v1', 'v2']
export const STYLE_META = {
  v1: { name: 'V1', label: 'Editorial' },
  v2: { name: 'V2', label: 'Job ticket' },
}

const V2_BASE = {
  'font-display': "'IBM Plex Sans Variable', 'Arial Narrow', sans-serif",
  'font-body': "'IBM Plex Sans Variable', system-ui, sans-serif",
  'font-mono': "'IBM Plex Mono', ui-monospace, Menlo, monospace",
  'radius-sm': '0px',
  'radius-md': '2px',
  'radius-lg': '2px',
  'radius-control': '2px',
  'shadow-1': 'none',
  'shadow-2': '0 12px 32px rgb(0 0 0 / 0.18)',
}

export const styleShape = {
  v1: { nubrakes: {}, valvoline: {} },
  v2: {
    nubrakes: { ...V2_BASE, 'display-xl-size': 'clamp(40px, 6vw, 80px)', 'display-xl-leading': '0.98', 'display-wdth': '88', 'display-wght': '640', 'display-track': '-0.015em', 'button-wght': '600' },
    valvoline: { ...V2_BASE, 'display-xl-size': 'clamp(44px, 6.8vw, 92px)', 'display-xl-leading': '0.94', 'display-wdth': '75', 'display-wght': '700', 'display-track': '0', 'button-wght': '650' },
  },
}

export function shapeFor(brand, style = 'v1') {
  return { 'font-mono': shape[brand]['font-body'], ...shape[brand], ...styleShape[style][brand] }
}

export function tokenVars(brand, scheme, style = 'v1') {
  const vars = {}
  for (const [k, v] of Object.entries(semantic[brand][scheme])) vars[`--c-${k}`] = v
  for (const [k, v] of Object.entries(shapeFor(brand, style))) vars[`--${k}`] = v
  return vars
}

// DTCG $type for shape and component tokens. Values that are CSS expressions (clamp) or
// keywords get no $type, which DTCG tools read as a plain string.
function shapeType(k, v) {
  if (k.startsWith('font-')) return 'fontFamily'
  if (k.endsWith('-wght')) return 'fontWeight'
  if (k.startsWith('shadow-')) return 'shadow'
  if (/^-?[\d.]+(px|em|rem)$/.test(v)) return 'dimension'
  if (/^[\d.]+$/.test(v)) return 'number'
  return undefined
}

// W3C design tokens format (DTCG), so the same file can feed Tokens Studio or Style Dictionary.
// Semantic colours that equal a core colour are written as aliases ({core.brand.key}), so the
// tiers stay linked in Figma variables.
export function toDTCG() {
  const out = { core: {}, semantic: {}, shape: {} }
  for (const b of BRANDS) {
    out.core[b] = Object.fromEntries(Object.entries(core[b]).map(([k, v]) => [k, { $type: 'color', $value: v }]))
    const byHex = Object.fromEntries(Object.entries(core[b]).map(([k, v]) => [v.toUpperCase(), k]))
    out.semantic[b] = {}
    for (const s of SCHEMES) {
      out.semantic[b][s] = Object.fromEntries(
        Object.entries(semantic[b][s]).map(([k, v]) => {
          const alias = byHex[v.toUpperCase()]
          return [k, { $type: 'color', $value: alias ? `{core.${b}.${alias}}` : v, $description: SEMANTIC_DOCS[k] }]
        }),
      )
    }
    out.shape[b] = Object.fromEntries(
      STYLES.map((st) => [
        st,
        Object.fromEntries(
          Object.entries(shapeFor(b, st)).map(([k, v]) => {
            const t = shapeType(k, v)
            return [k, t ? { $type: t, $value: v } : { $value: v }]
          }),
        ),
      ]),
    )
  }
  return out
}

// WCAG 2 contrast ratio. Colours with alpha (rgb(r g b / a)) are composited over `base` first,
// which is how they render on the page.
function rgbOf(color, base = '#FFFFFF') {
  if (color.startsWith('#')) return [1, 3, 5].map((i) => parseInt(color.slice(i, i + 2), 16))
  const m = color.match(/rgb\((\d+) (\d+) (\d+)(?: \/ ([\d.]+))?\)/)
  if (!m) return [0, 0, 0]
  const a = m[4] === undefined ? 1 : Number(m[4])
  const under = rgbOf(base)
  return [1, 2, 3].map((i, k) => Math.round(Number(m[i]) * a + under[k] * (1 - a)))
}
const luminance = (rgb) => {
  const [r, g, b] = rgb.map((v) => {
    const x = v / 255
    return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
export function contrast(fg, bg, base = '#FFFFFF') {
  const back = rgbOf(bg, base)
  const backHex = `#${back.map((v) => v.toString(16).padStart(2, '0')).join('')}`
  const [x, y] = [luminance(rgbOf(fg, backHex)), luminance(back)].sort((p, q) => q - p)
  return (x + 0.05) / (y + 0.05)
}

// Text and fill pairs that must stay readable, checked in every brand and scheme on the System page.
export const CONTRAST_PAIRS = [
  ['ink', 'bg'],
  ['muted', 'bg'],
  ['muted', 'sunken'],
  ['accent-text', 'bg'],
  ['on-accent', 'accent'],
  ['danger', 'danger-soft'],
  ['selected-line', 'selected-bg'],
]

export function contrastFor(brand, scheme, [fg, bg]) {
  const t = semantic[brand][scheme]
  return contrast(t[fg], t[bg], t.bg.startsWith('#') ? t.bg : '#FFFFFF')
}
