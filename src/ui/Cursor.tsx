import { useEffect, useRef } from 'react'
import { raiseCursor } from './raiseCursor'

const SIZE = 30
const TRAIL = 10

/**
 * A dot that always sits exactly on the pointer (the real click point), a ring that follows it closely,
 * and a short, faint ion trail. Over clickable things the ring grows and turns ion; it never leaves the pointer.
 * Fine pointers only: touch screens keep their native behaviour.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLSpanElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    const root = document.documentElement
    root.classList.add('has-cursor')
    raiseCursor()

    const cv = canvas.current!
    const ctx = cv.getContext('2d')!
    const dpr = Math.min(devicePixelRatio, 2)
    const resize = () => {
      cv.width = innerWidth * dpr
      cv.height = innerHeight * dpr
    }
    resize()

    const p = { x: innerWidth / 2, y: innerHeight / 2 }
    const r = { x: p.x, y: p.y, size: SIZE, s: 1 }
    const trail = Array.from({ length: TRAIL }, () => ({ x: p.x, y: p.y }))
    let mode: '' | 'link' | 'label' = ''
    let down = false
    let shown = false

    const move = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      p.x = e.clientX
      p.y = e.clientY
      // the dot moves in the event itself, so it never lags behind the real pointer
      dot.current!.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`
      if (!shown) {
        shown = true
        r.x = p.x
        r.y = p.y
        trail.forEach((t) => Object.assign(t, p))
        root.dataset.cursorShown = 'true'
      }
      const t = e.target instanceof Element ? e.target : null
      const control = t?.closest('a, button, [role="button"], label, [tabindex="0"]')
      const tag = t?.closest<HTMLElement>('[data-cursor]')?.dataset.cursor ?? ''
      mode = control ? 'link' : tag ? 'label' : ''
      label.current!.textContent = mode === 'label' ? tag : ''
    }
    const leave = (e: PointerEvent) => {
      if (!e.relatedTarget) {
        shown = false
        root.dataset.cursorShown = 'false'
      }
    }
    const press = () => (down = true)
    const release = () => (down = false)

    let raf = 0
    let last = performance.now()
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop)
      // time-based easing: the same feel at 60Hz and 120Hz
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      const follow = 1 - Math.exp(-dt * 28)
      const grow = 1 - Math.exp(-dt * 14)

      const target = mode === 'link' ? 46 : mode === 'label' ? 64 : SIZE
      r.x += (p.x - r.x) * follow
      r.y += (p.y - r.y) * follow
      r.size += (target - r.size) * grow
      r.s += ((down ? 0.82 : 1) - r.s) * grow

      const el = ring.current!
      el.style.transform = `translate3d(${r.x - r.size / 2}px, ${r.y - r.size / 2}px, 0) scale(${r.s})`
      el.style.width = el.style.height = `${r.size}px`
      el.dataset.mode = mode

      // short trail: each point chases the one ahead, drawn as a thin tapering stroke
      ctx.clearRect(0, 0, cv.width, cv.height)
      if (reduce || !shown) return
      const chase = 1 - Math.exp(-dt * 30)
      trail[0].x += (p.x - trail[0].x) * chase
      trail[0].y += (p.y - trail[0].y) * chase
      for (let i = 1; i < TRAIL; i++) {
        trail[i].x += (trail[i - 1].x - trail[i].x) * chase
        trail[i].y += (trail[i - 1].y - trail[i].y) * chase
      }
      if (Math.hypot(trail[0].x - trail[TRAIL - 1].x, trail[0].y - trail[TRAIL - 1].y) < 3) return
      ctx.lineCap = 'round'
      ctx.shadowColor = 'rgba(139,151,255,0.6)'
      ctx.shadowBlur = 8 * dpr
      for (let i = 0; i < TRAIL - 1; i++) {
        const f = 1 - i / TRAIL
        ctx.strokeStyle = `rgba(160,170,255,${f * f * 0.35})`
        ctx.lineWidth = f * 2.5 * dpr
        ctx.beginPath()
        ctx.moveTo(trail[i].x * dpr, trail[i].y * dpr)
        ctx.lineTo(trail[i + 1].x * dpr, trail[i + 1].y * dpr)
        ctx.stroke()
      }
    }

    addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerout', leave)
    addEventListener('pointerdown', press)
    addEventListener('pointerup', release)
    addEventListener('resize', resize)
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      root.classList.remove('has-cursor')
      removeEventListener('pointermove', move)
      document.removeEventListener('pointerout', leave)
      removeEventListener('pointerdown', press)
      removeEventListener('pointerup', release)
      removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div aria-hidden="true" popover="manual" className="cursor pointer-events-none fixed inset-0 z-[100]">
      <canvas ref={canvas} className="absolute inset-0 size-full" />
      <div ref={ring} className="cursor-ring absolute top-0 left-0 grid place-items-center rounded-full">
        <span ref={label} className="font-mono text-[10px] tracking-[0.14em] text-ivory uppercase" />
      </div>
      <div ref={dot} className="cursor-dot absolute top-0 left-0" />
    </div>
  )
}
