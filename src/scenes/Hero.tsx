import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { profile } from '../content/profile'
import { world } from '../three/state'
import { useDragSpin } from '../hooks/usePointer'
import { GlassOrb } from '../ui/GlassOrb'

export function Hero({ webgl }: { webgl: boolean }) {
  const [section, setSection] = useState<HTMLElement | null>(null)
  const root = useRef<HTMLDivElement>(null)
  useDragSpin(section)

  // scroll choreography: progress feeds the 3D world, the timeline moves the type.
  // Layout effect so the lines are hidden before first paint.
  useLayoutEffect(() => {
    if (!section) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
          onUpdate: (st) => {
            world.progress = st.progress
          },
        },
      })
      tl.to('[data-intro-out]', { opacity: 0, y: -40, duration: 0.1 }, 0.02)
        // phones: the CSS name and orb ghost out before the scene-02 headline arrives
        .to('[data-fallback]', { opacity: 0.08, scale: 0.94, duration: 0.12 }, 0.04)
        // GSAP owns the lines' initial offset; a CSS translate here gets cached as pixels and breaks the exit
        .fromTo('[data-line]', { yPercent: 110 }, { yPercent: 0, duration: 0.1, stagger: 0.025 }, 0.1)
        .to('[data-line]', { yPercent: -110, duration: 0.08, stagger: 0.015 }, 0.4)
        .fromTo('[data-outro]', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.1 }, 0.62)
        .to('[data-outro]', { opacity: 0, duration: 0.08 }, 0.9)
        .to({}, { duration: 0.02 }, 0.98)
    }, root)
    return () => ctx.revert()
  }, [section])

  // entrance for the copy on first paint; it doesn't wait for the 3D world, so slow networks never see the text vanish and return
  useLayoutEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.from('[data-enter]', { opacity: 0, y: 24, duration: 1.4, ease: 'expo.out', stagger: 0.12, delay: 0.3 })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="top"
      ref={setSection}
      className="relative h-[340vh] select-none max-md:h-[280vh]"
      data-scene="Intro"
      aria-labelledby="hero-title"
    >
      <div ref={root} className="gutter sticky top-0 flex h-svh min-h-[560px] flex-col justify-between pt-24 pb-8">
        <h1 id="hero-title" className="sr-only">
          {profile.name}, full-stack software engineer
        </h1>

        <div data-intro-out className="flex flex-wrap justify-between gap-3">
          <span data-enter className="label">{profile.role}</span>
          <span data-enter className="label">
            {profile.location}
          </span>
        </div>

        {!webgl && (
          <div data-fallback className="relative">
            <p aria-hidden="true" className="text-center text-[17vw] leading-[0.8] font-extrabold tracking-[-0.04em] uppercase [font-stretch:75%]">
              {profile.name}
            </p>
            <GlassOrb className="size-[44vw] max-h-[340px] max-w-[340px]" />
          </div>
        )}

        {/* scene 02: the object moves right, the identity takes the left */}
        <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 gutter max-md:top-[64%]">
          <div className="max-w-[46rem] text-[clamp(44px,7.4vw,124px)] leading-[0.9] font-bold tracking-[-0.04em] [font-stretch:80%]">
            <div className="overflow-hidden pb-[0.06em]"><div data-line>Full-stack</div></div>
            <div className="overflow-hidden pb-[0.06em]"><div data-line>engineer,</div></div>
            <div className="overflow-hidden pb-[0.1em]">
              <div data-line className="font-serif font-normal italic tracking-[-0.01em] text-ion">AI-native by habit.</div>
            </div>
            <div className="mt-5 overflow-hidden">
              <div data-line className="label !text-[12px] leading-[1.6]">{profile.stack.join(' · ')}</div>
            </div>
          </div>
        </div>

        {/* scene 03 lead-in: the surface breaks apart into the next scene */}
        <div data-outro className="pointer-events-none absolute inset-x-0 bottom-[14vh] gutter text-center opacity-0">
          <p className="mx-auto max-w-[22ch] text-[clamp(26px,3.4vw,52px)] leading-[1.05] font-semibold tracking-[-0.03em]">
            Every feature is thousands of small decisions.{' '}
            <span className="font-serif font-normal italic text-ion">Here are mine.</span>
          </p>
        </div>

        {/* bottom row mirrors the top row: stack on the left, statement on the right */}
        <div data-intro-out className="grid items-end gap-6 md:grid-cols-2">
          <p data-enter className="label hidden md:block">
            {profile.stack.join(' · ')}
          </p>
          <p data-enter className="max-w-[32rem] text-[clamp(17px,1.4vw,20px)] leading-snug text-ivory/90 md:justify-self-end md:text-right">
            {profile.statement}
          </p>
        </div>

      </div>
    </section>
  )
}
