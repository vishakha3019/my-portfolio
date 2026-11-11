/** Letters roll up to a second copy of themselves when the nearest `.group` is hovered or focused. */
export function RollText({ text, className = '' }: { text: string; className?: string }) {
  return (
    <span className={`roll ${className}`}>
      <span className="sr-only">{text}</span>
      {[...text].map((c, i) => (
        <span key={i} aria-hidden="true" className="roll-c" style={{ '--i': i } as React.CSSProperties}>
          <span>{c === ' ' ? ' ' : c}</span>
          <span>{c === ' ' ? ' ' : c}</span>
        </span>
      ))}
    </span>
  )
}
