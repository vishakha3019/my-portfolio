import { useEffect } from 'react'
import { world } from '../three/state'

/** Feeds pointer position and speed into the shared world state. */
export function usePointer() {
  useEffect(() => {
    let lx = 0
    let ly = 0
    const move = (e: PointerEvent) => {
      const x = e.clientX / innerWidth
      const y = 1 - e.clientY / innerHeight
      const v = Math.min(Math.hypot(x - lx, y - ly), 0.05) * 12
      world.pointerVel = Math.min(1.5, world.pointerVel + v)
      world.pointer.x = x
      world.pointer.y = y
      lx = x
      ly = y
    }
    addEventListener('pointermove', move, { passive: true })
    return () => removeEventListener('pointermove', move)
  }, [])
}

const isControl = (t: EventTarget | null) => t instanceof Element && !!t.closest('a,button,input,textarea,select,dialog')

/**
 * Generic drag gesture: pointer capture keeps the drag alive outside the element,
 * text selection and native image drag are suppressed, and cancel/up always end it.
 * Touch is left to the browser so vertical scrolling keeps working.
 */
export function useDrag(
  el: HTMLElement | null,
  handlers: { onMove: (dx: number, dy: number) => void; onTap?: () => void },
  enabled = true,
) {
  useEffect(() => {
    if (!el || !enabled) return
    let id: number | null = null
    let moved = 0
    let px = 0
    let py = 0
    const start = (e: PointerEvent) => {
      if (e.button !== 0 || isControl(e.target)) return
      moved = 0
      px = e.clientX
      py = e.clientY
      if (e.pointerType === 'touch') {
        id = e.pointerId
        return
      }
      e.preventDefault()
      id = e.pointerId
      el.setPointerCapture(id)
      el.dataset.dragging = 'true'
    }
    const move = (e: PointerEvent) => {
      if (e.pointerId !== id) return
      const dx = e.clientX - px
      const dy = e.clientY - py
      moved += Math.abs(dx) + Math.abs(dy)
      px = e.clientX
      py = e.clientY
      if (e.pointerType !== 'touch') handlers.onMove(dx, dy)
    }
    const end = (e: PointerEvent) => {
      if (e.pointerId !== id) return
      if (e.type === 'pointerup' && moved < 6) handlers.onTap?.()
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId)
      id = null
      delete el.dataset.dragging
    }
    const noNativeDrag = (e: DragEvent) => e.preventDefault()
    el.addEventListener('pointerdown', start)
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerup', end)
    el.addEventListener('pointercancel', end)
    el.addEventListener('dragstart', noNativeDrag)
    return () => {
      el.removeEventListener('pointerdown', start)
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerup', end)
      el.removeEventListener('pointercancel', end)
      el.removeEventListener('dragstart', noNativeDrag)
    }
    // handlers are stable module-level closures at every call site
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [el, enabled])
}

const spin = {
  onMove: (dx: number, dy: number) => {
    world.spin.x += dx * 0.0009
    world.spin.y += dy * 0.0009
  },
  onTap: () => (world.pulse = 1),
}

/** Drag on an element spins the glass; a click or tap without dragging sends a ripple through it. */
export const useDragSpin = (el: HTMLElement | null) => useDrag(el, spin)
