// A label set the way Sri Lankan signboards stack their scripts: the reader's language
// first, the other one under it in a smaller size. Screen readers hear the first only.
export default function Dual({ v, as: Tag = 'span', className = '' }) {
  return (
    <Tag className={`v2-dual ${className}`}>
      <span className="v2-dual-main">{v.main}</span>
      {v.other !== v.main && <span className="v2-dual-other" aria-hidden="true">{v.other}</span>}
    </Tag>
  )
}
