import { useState } from 'react'
import { ImageBroken } from '@phosphor-icons/react'

// Reserves its box (no layout shift), shows the surface as a skeleton while loading,
// and a quiet fallback if the image fails.
export default function Photo({ src, alt = '', className = '', style, eager }) {
  const [state, setState] = useState(src ? 'loading' : 'error')
  return (
    <div className={`photo ${className}`} style={style}>
      {state !== 'error' && (
        <img
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          fetchpriority={eager ? 'high' : undefined}
          className={state === 'ready' ? 'ready' : ''}
          onLoad={() => setState('ready')}
          onError={() => setState('error')}
        />
      )}
      {state === 'error' && (
        <div className="fail"><ImageBroken size={22} /><span>Photo unavailable</span></div>
      )}
    </div>
  )
}
