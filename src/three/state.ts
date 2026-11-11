// Mutable state shared between DOM events, GSAP and the render loop.
// Kept outside React on purpose: it changes every frame and must not trigger re-renders.
export const world = {
  /** 0 → 1 cinematic entrance */
  intro: 0,
  /** 0 → 1 scroll progress through the pinned hero */
  progress: 0,
  /** pointer in screen uv (0..1, y up) */
  pointer: { x: 0.5, y: 0.5 },
  /** smoothed pointer speed, drives text distortion */
  pointerVel: 0,
  /** click ripple, decays to 0 */
  pulse: 0,
  /** drag spin velocity in radians per frame */
  spin: { x: 0, y: 0 },
  /** colour of the active project, tints the particles in the projects scene */
  hue: '#8b97ff',
  /** hovered engineering domain, -1 for none */
  focus: -1,
  /** DOM anchors the engineering clusters gather around */
  anchors: [] as HTMLElement[],
}

/**
 * Particle formation for the current scroll position.
 * 0 glass skin · 1 orbit ring · 2 ribbon · 3 landscape · 4 clusters · 5 glass skin again.
 * Each [data-form] section blends in from the previous formation while its top crosses the viewport.
 */
let sections: HTMLElement[] = []

export function readForm() {
  const p = world.progress
  let form = Math.min(1, Math.max(0, (p - 0.46) / 0.44))
  // the scene sections never change, so they are looked up once instead of every frame
  if (!sections.length) sections = [...document.querySelectorAll<HTMLElement>('[data-form]')]
  for (const el of sections) {
    const t = Math.min(1, Math.max(0, 1 - el.getBoundingClientRect().top / innerHeight))
    if (t <= 0) break
    form += (Number(el.dataset.form) - form) * t
  }
  return form
}
