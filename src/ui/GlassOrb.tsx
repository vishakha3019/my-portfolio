/**
 * The light stand-in for the 3D glass on phones: a static, gradient-only orb, so phones
 * stay idle once the page has loaded.
 */
export function GlassOrb({ className = '' }: { className?: string }) {
  return (
    <span aria-hidden="true" className={`orb-float pointer-events-none absolute top-1/2 left-1/2 ${className}`}>
      <span className="glass-orb block size-full" />
    </span>
  )
}
