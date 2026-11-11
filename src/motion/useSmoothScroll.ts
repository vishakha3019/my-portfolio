import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

let lenis: Lenis | null = null

/** Smooth-scrolls to an element or y offset, with or without Lenis running. */
export function scrollToTarget(target: HTMLElement | number) {
  if (lenis) return lenis.scrollTo(target, { duration: 1.6 })
  const y = typeof target === 'number' ? target : target.getBoundingClientRect().top + scrollY
  window.scrollTo({ top: y, behavior: 'smooth' })
}

/** Scrolls by a pixel delta immediately, used for drag-to-scroll. */
export function scrollByImmediate(delta: number) {
  if (lenis) lenis.scrollTo(lenis.targetScroll + delta, { immediate: true })
  else window.scrollBy(0, delta)
}

/** Pause page scrolling while a dialog owns the wheel. */
export const lockScroll = (locked: boolean) => (locked ? lenis?.stop() : lenis?.start())

/** Lenis drives the scroll, GSAP's ticker drives Lenis, so ScrollTrigger and the smooth scroll never drift apart. */
export function useSmoothScroll(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return
    const instance = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9, anchors: true })
    lenis = instance
    instance.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => instance.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(tick)
      instance.destroy()
      lenis = null
    }
  }, [enabled])
}
