import { M } from './materials.js'

// Shared SVG definitions. Rendered once per <svg>; ids are prefixed so several panels
// (for example the state sheet) can share one page.
export function Defs({ p = 'bz' }) {
  return (
    <defs>
      <radialGradient id={`${p}-cap`} cx="38%" cy="32%" r="75%">
        <stop offset="0" stopColor={M.bakeliteHi} />
        <stop offset="0.45" stopColor={M.bakelite} />
        <stop offset="1" stopColor={M.bakeliteDeep} />
      </radialGradient>
      <radialGradient id={`${p}-skirt`} cx="50%" cy="45%" r="60%">
        <stop offset="0.6" stopColor={M.bakelite} />
        <stop offset="1" stopColor={M.bakeliteDeep} />
      </radialGradient>
      <linearGradient id={`${p}-metal`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#D8D3C8" />
        <stop offset="0.5" stopColor={M.metal} />
        <stop offset="1" stopColor={M.metalDark} />
      </linearGradient>
      <linearGradient id={`${p}-glass`} x1="0" y1="0" x2="0.4" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity="0.35" />
        <stop offset="0.35" stopColor="#fff" stopOpacity="0.06" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
      <radialGradient id={`${p}-led`} cx="50%" cy="50%" r="50%">
        <stop offset="0" stopColor={M.accentHot} />
        <stop offset="0.5" stopColor={M.accent} />
        <stop offset="1" stopColor={M.accent} stopOpacity="0" />
      </radialGradient>
      <linearGradient id={`${p}-copper`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#D9A27A" />
        <stop offset="1" stopColor="#8A5636" />
      </linearGradient>
      {/* Paint wear: noise eats into silkscreen and enamel. */}
      <filter id={`${p}-wear-worn`} x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" result="n" />
        <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -9 6.1" result="m" />
        <feComposite in="SourceGraphic" in2="m" operator="in" />
      </filter>
      <filter id={`${p}-wear-busted`} x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="3" seed="9" result="n" />
        <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -6 3.9" result="m" />
        <feComposite in="SourceGraphic" in2="m" operator="in" />
      </filter>
      <filter id={`${p}-grime`} x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.012 0.03" numOctaves="4" seed="21" result="n" />
        <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.09  0 0 0 0 0.07  0 0 0 0 0.04  0 0 0 1.1 -0.35" />
      </filter>
      <filter id={`${p}-speckle`} x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="1" seed="5" result="n" />
        <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.1  0 0 0 0 0.08  0 0 0 0 0.06  0 0 0 2.2 -1.25" />
      </filter>
      <filter id={`${p}-dim`}>
        <feColorMatrix type="saturate" values="0.15" />
      </filter>
      <filter id={`${p}-glow`} x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3" />
      </filter>
    </defs>
  )
}

// Silkscreen wear filter for a wear stage.
export const inkFilter = (p, wear) => (wear === 'mint' ? undefined : `url(#${p}-wear-${wear})`)
