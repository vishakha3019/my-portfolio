/**
 * Stand-in for the 3D glass in browsers without WebGL2: a static, gradient-only orb
 * that keeps the page idle once it has loaded.
 */
export function GlassOrb({ className = '' }: { className?: string }) {
  return (
    <span aria-hidden="true" className={`orb-float pointer-events-none absolute top-1/2 left-1/2 ${className}`}>
      <span className="glass-orb block size-full" />
    </span>
  )
}
