import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { chapters, role } from '../content/experience'
import { RollText } from '../ui/RollText'
import { useDrag } from '../hooks/usePointer'
import { scrollByImmediate } from '../motion/useSmoothScroll'

// dragging the track sideways scrolls the page, which is what moves the track
const dragScroll = { onMove: (dx: number) => scrollByImmediate(-dx * 1.2) }
const wide = () => matchMedia('(min-width: 900px) and (pointer: fine)').matches

// Scene 04. The particles stretch into a flowing ribbon while the role plays out sideways.
export function Experience() {
  const root = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const [trackEl, setTrackEl] = useState<HTMLDivElement | null>(null)
  const [open, setOpen] = useState<number | null>(null)
  useDrag(trackEl, dragScroll, wide())

  useLayoutEffect(() => {
    const mm = gsap.matchMedia()
    mm.add('(min-width: 900px)', () => {
      const distance = () => track.current!.scrollWidth - innerWidth
      const tween = gsap.to(track.current, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: () => `+=${distance()}`, pin: true, scrub: 0.8, invalidateOnRefresh: true },
      })
      // tags drift at their own speed inside the moving track
      gsap.utils.toArray<HTMLElement>('[data-drift]').forEach((el, i) => {
        gsap.fromTo(el, { y: 40 + (i % 3) * 20 }, { y: -40 - (i % 3) * 20, ease: 'none', scrollTrigger: { trigger: el, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } })
      })
      gsap.fromTo('[data-rail]', { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: () => `+=${distance()}`, scrub: true } })
    })
    return () => mm.revert()
  }, [])

  return (
    <section id="experience" ref={root} data-form="2" data-scene="Experience" className="relative min-h-svh overflow-hidden" aria-labelledby="exp-title">
      <div className="gutter flex flex-wrap items-end justify-between gap-6 pt-[14vh] min-[900px]:absolute min-[900px]:inset-x-0 min-[900px]:top-0">
        <div>
          <p className="label">03 · Experience</p>
          <h2 id="exp-title" className="mt-4 text-[clamp(36px,4.6vw,72px)] leading-none font-bold tracking-[-0.04em] [font-stretch:85%]">
            {role.title} <span className="font-serif font-normal italic text-ion">at {role.company}</span>
          </h2>
        </div>
        <p className="label">
          {role.period} · {role.place}
        </p>
      </div>

      <div
        ref={(el) => {
          track.current = el
          setTrackEl(el)
        }}
        className="gutter flex select-none flex-col gap-16 py-16 min-[900px]:h-svh min-[900px]:w-max min-[900px]:flex-row min-[900px]:items-center min-[900px]:gap-0 min-[900px]:py-0 min-[900px]:pt-[18vh]">
        {/* decorative years are CSS-generated so they stay out of the accessibility tree and contrast checks */}
        <div
          aria-hidden="true"
          data-year={role.start}
          className="hidden shrink-0 pr-[6vw] text-[22vw] leading-[0.8] font-extrabold tracking-[-0.06em] text-ivory/[0.06] [font-stretch:75%] before:content-[attr(data-year)] min-[900px]:block"
        />

        {chapters.map((c, i) => (
          <article key={c.title} className="group relative shrink-0 border-rule min-[900px]:w-[min(34vw,520px)] min-[900px]:border-l min-[900px]:px-10">
            <div className="flex items-baseline justify-between gap-4">
              <span className="font-mono text-sm text-ion">{String(i + 1).padStart(2, '0')}</span>
              <span className="label">{c.kind}</span>
            </div>
            <h3 className="mt-6 text-[clamp(30px,3vw,48px)] leading-none font-bold tracking-[-0.035em] [font-stretch:85%]">
              <RollText text={c.title} />
            </h3>
            <p className="mt-5 max-w-[34ch] text-lg leading-snug text-ivory/80">{c.line}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {c.tags.map((t) => (
                <span key={t} data-drift className="label rounded-full border border-rule px-3 py-1.5">
                  {t}
                </span>
              ))}
            </div>
            <button
              type="button"
              aria-expanded={open === i}
              aria-controls={`chapter-${i}`}
              onClick={() => setOpen(open === i ? null : i)}
              className="label mt-8 inline-flex items-center gap-3 !text-ivory transition-colors hover:!text-ion"
            >
              <span className={`grid size-7 place-items-center rounded-full border border-ivory/40 transition-transform duration-500 ${open === i ? 'rotate-45' : ''}`}>+</span>
              {open === i ? 'Hide details' : 'Read details'}
            </button>
            <div id={`chapter-${i}`} className="reveal" data-open={open === i} inert={open !== i}>
              <ul className="space-y-3 pt-6 text-[15px] leading-relaxed text-ivory/75">
                {c.details.map((d) => (
                  <li key={d} className="border-l border-ion/50 pl-4">
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}

        <div
          aria-hidden="true"
          data-year={role.end}
          className="hidden shrink-0 pl-[6vw] pr-[10vw] text-[22vw] leading-[0.8] font-extrabold tracking-[-0.06em] text-ivory/[0.06] [font-stretch:75%] before:content-[attr(data-year)] min-[900px]:block"
        />
      </div>

      <div className="gutter absolute inset-x-0 bottom-8 hidden min-[900px]:block" aria-hidden="true">
        <div className="h-px bg-rule">
          <div data-rail className="h-px origin-left bg-ion" />
        </div>
      </div>
    </section>
  )
}
