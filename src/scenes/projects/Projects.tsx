import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight } from 'lucide-react'
import { projects } from '../../content/projects'
import { world } from '../../three/state'
import { scrollToTarget } from '../../motion/useSmoothScroll'
import { Magnetic } from '../../ui/Magnetic'
import { Mock } from './Mock'
import { CaseStudy } from './CaseStudy'

const n = projects.length

// Scene 05. Each project takes the stage in turn and tints the whole world with its colour.
export function Projects() {
  const root = useRef<HTMLElement>(null)
  const frame = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [openCase, setOpenCase] = useState<number | null>(null)

  useLayoutEffect(() => {
    const st = ScrollTrigger.create({
      trigger: root.current,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => setActive(Math.min(n - 1, Math.floor(self.progress * n))),
    })
    return () => st.kill()
  }, [])

  useEffect(() => {
    world.hue = projects[active].hue
  }, [active])

  // the browser leans toward the pointer; floating layers at different depths give it parallax
  useEffect(() => {
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return
    let rx = 0
    let ry = 0
    let tx = 0
    let ty = 0
    let raf = 0
    const move = (e: PointerEvent) => {
      tx = (e.clientX / innerWidth - 0.5) * 18
      ty = (e.clientY / innerHeight - 0.5) * -12
    }
    const loop = () => {
      rx += (ty - rx) * 0.08
      ry += (tx - ry) * 0.08
      frame.current?.style.setProperty('transform', `rotateX(${8 + rx}deg) rotateY(${-16 + ry}deg)`)
      raf = requestAnimationFrame(loop)
    }
    // only animate while the section is on screen
    const io = new IntersectionObserver(([e]) => {
      cancelAnimationFrame(raf)
      if (e.isIntersecting) raf = requestAnimationFrame(loop)
    })
    io.observe(root.current!)
    addEventListener('pointermove', move, { passive: true })
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
      removeEventListener('pointermove', move)
    }
  }, [])

  const jump = (i: number) => {
    const el = root.current!
    const top = el.getBoundingClientRect().top + scrollY
    scrollToTarget(top + ((i + 0.5) / n) * (el.offsetHeight - innerHeight))
  }

  const p = projects[active]
  return (
    <section
      id="work"
      ref={root}
      data-form="3"
      data-scene="Work"
      className="relative"
      style={{ height: `${n * 85 + 40}vh` }}
      aria-labelledby="work-title"
    >
      <div className="gutter sticky top-0 flex h-svh min-h-[600px] flex-col pt-24 pb-8">
        <div className="flex items-baseline justify-between">
          <h2 id="work-title" className="label">
            04 · Selected work
          </h2>
          <p className="label tabular-nums" aria-live="polite">
            <span className="!text-ivory">{String(active + 1).padStart(2, '0')}</span> / {String(n).padStart(2, '0')}
          </p>
        </div>

        <div className="relative grid flex-1 items-center gap-8 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          {/* copy: every project is stacked, only the active one is on stage */}
          <div className="relative min-h-[300px] md:min-h-[420px]">
            {projects.map((pr, i) => (
              <div
                key={pr.slug}
                data-state={i === active ? 'active' : i < active ? 'past' : 'next'}
                aria-hidden={i !== active}
                className={`absolute inset-x-0 top-0 md:top-1/2 md:-translate-y-1/2 ${i === active ? '' : 'pointer-events-none'}`}
              >
                <p data-fade className="label" style={{ color: pr.hue }}>
                  {pr.kind}
                </p>
                <h3 className="mt-4 text-[clamp(44px,7.4vw,128px)] leading-[0.86] font-extrabold tracking-[-0.05em] [font-stretch:75%]">
                  <span className="sr-only">{pr.title}</span>
                  {pr.title.split(' ').map((word, wi, words) => (
                    <span key={wi} aria-hidden="true" className="inline-block whitespace-nowrap">
                      {[...word].map((c, ci) => (
                        <span key={ci} className="pt-c" style={{ '--i': wi * 6 + ci } as React.CSSProperties}>
                          <span>{c}</span>
                        </span>
                      ))}
                      {wi < words.length - 1 && ' '}
                    </span>
                  ))}
                </h3>
                <p data-fade className="mt-4 max-w-[40ch] text-[15px] leading-snug text-ivory/80 md:mt-6 md:text-[17px]">
                  {pr.summary}
                </p>
                {pr.results.length > 0 && (
                  <dl data-fade className="mt-6 flex flex-wrap gap-8">
                    {pr.results.slice(0, 2).map((r) => (
                      <div key={r.label}>
                        <dd className="text-2xl font-bold tracking-[-0.02em]" style={{ color: pr.hue }}>
                          {r.value}
                        </dd>
                        <dt className="label mt-1">{r.label}</dt>
                      </div>
                    ))}
                  </dl>
                )}
                <div data-fade className="mt-8">
                  <Magnetic>
                    <button
                      type="button"
                      tabIndex={i === active ? 0 : -1}
                      onClick={() => setOpenCase(i)}
                      className="group inline-flex items-center gap-3 rounded-full py-3 pr-5 pl-6 text-sm font-semibold text-void transition-transform"
                      style={{ background: pr.hue }}
                    >
                      Open case study
                      <ArrowUpRight size={18} className="transition-transform duration-500 group-hover:rotate-45" />
                    </button>
                  </Magnetic>
                </div>
              </div>
            ))}
          </div>

          {/* stage: a browser frame in perspective with layers floating in front of it */}
          <div className="relative [perspective:1600px]" data-cursor="view">
            <div
              ref={frame}
              className="relative mx-auto w-full max-w-[760px] [transform-style:preserve-3d] [transform:rotateX(8deg)_rotateY(-16deg)]"
              onClick={() => setOpenCase(active)}
            >
              <div className="overflow-hidden rounded-xl border border-ivory/10 bg-[#0e0e11] shadow-[0_60px_120px_-40px_rgb(0_0_0/0.9)]">
                <div className="flex items-center gap-1.5 border-b border-ivory/10 px-4 py-2.5">
                  <i className="size-2 rounded-full bg-ivory/20" />
                  <i className="size-2 rounded-full bg-ivory/20" />
                  <i className="size-2 rounded-full bg-ivory/20" />
                  <span className="ml-3 truncate rounded bg-ivory/5 px-3 py-0.5 font-mono text-[10px] text-silver">{p.slug}.app</span>
                </div>
                <div className="relative aspect-[16/10]">
                  {projects.map((pr, i) => (
                    <div key={pr.slug} className="screen absolute inset-0 bg-[#0e0e11]" data-on={i === active} data-past={i < active}>
                      <Mock kind={pr.mock} hue={pr.hue} on={i === active} />
                    </div>
                  ))}
                </div>
              </div>
              <div
                aria-hidden="true"
                className="absolute right-4 -bottom-6 rounded-lg border border-ivory/10 bg-graphite/90 px-4 py-3 backdrop-blur [animation:float-y_5s_ease-in-out_infinite] [transform:translateZ(90px)]"
              >
                <div className="label">Stack</div>
                <div className="mt-1 text-sm">{p.stack.slice(0, 3).join(' · ')}</div>
              </div>
              <div
                aria-hidden="true"
                className="absolute -top-6 -left-4 hidden rounded-lg px-4 py-3 text-void [animation:float-y_6s_ease-in-out_1s_infinite] [transform:translateZ(140px)] md:block"
                style={{ background: p.hue }}
              >
                <div className="font-mono text-[10px] tracking-widest uppercase opacity-70">{p.results[0]?.label ?? 'Role'}</div>
                <div className="text-lg font-bold">{p.results[0]?.value ?? 'Full stack'}</div>
              </div>
            </div>
            <p className="label mt-6 text-center md:mt-10">Illustrative interface · not a production screenshot</p>
          </div>
        </div>

        <nav aria-label="Projects" className="flex gap-2">
          {projects.map((pr, i) => (
            <button
              key={pr.slug}
              type="button"
              onClick={() => jump(i)}
              aria-label={`Show ${pr.title}`}
              aria-current={i === active}
              className="group h-8 flex-1"
            >
              <span className="block h-px bg-rule transition-colors group-hover:bg-ivory/50">
                <span className="block h-px origin-left transition-transform duration-700 ease-expo" style={{ background: pr.hue, transform: `scaleX(${i <= active ? 1 : 0})` }} />
              </span>
              <span className="label mt-2 hidden text-left lg:block">{pr.title}</span>
            </button>
          ))}
        </nav>
      </div>

      <CaseStudy project={openCase === null ? null : projects[openCase]} onClose={() => setOpenCase(null)} onNext={() => setOpenCase(((openCase ?? 0) + 1) % n)} />
    </section>
  )
}
