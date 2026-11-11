import { useEffect, useRef, type ReactNode } from 'react'

/** Wraps a control so it leans toward the pointer when it comes close. Off on touch screens. */
export function Magnetic({ children, strength = 0.15 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const el = ref.current!
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const dx = e.clientX - (r.left + r.width / 2)
      const dy = e.clientY - (r.top + r.height / 2)
      const near = Math.hypot(dx, dy) < Math.max(r.width, r.height) * 0.9
      el.style.transform = near ? `translate(${dx * strength}px, ${dy * strength}px)` : ''
    }
    addEventListener('pointermove', move, { passive: true })
    return () => removeEventListener('pointermove', move)
  }, [strength])
  return (
    <span ref={ref} className="inline-block transition-transform duration-500 ease-expo">
      {children}
    </span>
  )
}
