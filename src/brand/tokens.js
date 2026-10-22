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
  },
  valvoline: {
    name: 'Valvoline',
    product: 'Mobile Brake Service',
    endorsement: 'From the team at NuBrakes',
    short: 'Valvoline',
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
export const shape = {
  nubrakes: {
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
    'shadow-1': '0 1px 2px rgb(0 0 0 / 0.06), 0 2px 8px rgb(0 0 0 / 0.05)',
    'shadow-2': '0 12px 32px rgb(0 0 0 / 0.14)',
  },
  valvoline: {
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
  'accent-soft': 'Selected row tint',
  focus: 'Focus ring',
  success: 'Confirmed, completed',
  warning: 'Needs attention, not blocking',
  danger: 'Errors and destructive actions',
  inverse: 'Dark band fill',
  'on-inverse': 'Text on inverse',
}

export function tokenVars(brand, scheme) {
  const vars = {}
  for (const [k, v] of Object.entries(semantic[brand][scheme])) vars[`--c-${k}`] = v
  for (const [k, v] of Object.entries(shape[brand])) vars[`--${k}`] = v
  return vars
}

// W3C design tokens format (DTCG), so the same file can feed Tokens Studio or Style Dictionary.
export function toDTCG() {
  const out = { core: {}, semantic: {}, shape: {} }
  for (const b of BRANDS) {
    out.core[b] = Object.fromEntries(Object.entries(core[b]).map(([k, v]) => [k, { $type: 'color', $value: v }]))
    out.semantic[b] = {}
    for (const s of SCHEMES) {
      out.semantic[b][s] = Object.fromEntries(
        Object.entries(semantic[b][s]).map(([k, v]) => [k, { $type: 'color', $value: v, $description: SEMANTIC_DOCS[k] }]),
      )
    }
    out.shape[b] = Object.fromEntries(Object.entries(shape[b]).map(([k, v]) => [k, { $value: v }]))
  }
  return out
}
