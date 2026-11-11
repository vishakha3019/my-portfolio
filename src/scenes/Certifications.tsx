import { useLayoutEffect, useRef, type CSSProperties, type PointerEvent, type ReactNode } from 'react'
import gsap from 'gsap'
import { Award, GraduationCap } from 'lucide-react'
import { certifications, education } from '../content/skills'

// Scene 06. Education and certificates as tactile cards that tilt toward the pointer.
export function Certifications() {
  const root = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.from('[data-cert]', {
        opacity: 0,
        y: 80,
        rotateX: -28,
        transformOrigin: '50% 100%',
        duration: 1.3,
        ease: 'expo.out',
        stagger: 0.09,
        scrollTrigger: { trigger: '[data-cert-grid]', start: 'top 82%' },
      })
      gsap.from('[data-cert-head] > *', { opacity: 0, y: 30, duration: 1.1, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: root.current, start: 'top 75%' } })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="credentials" ref={root} data-scene="Credentials" className="gutter relative py-[16vh]" aria-labelledby="cred-title">
      <div className="mx-auto max-w-[1300px]">
        <div data-cert-head className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="label">06 · Certifications</p>
            <h2 id="cred-title" className="mt-4 max-w-[16ch] text-[clamp(36px,5vw,80px)] leading-[0.95] font-bold tracking-[-0.04em] [font-stretch:85%]">
              Always learning, <span className="font-serif font-normal italic text-ion">on the record.</span>
            </h2>
          </div>
          <p className="label">
            {certifications.length} certifications · 1 degree
          </p>
        </div>

        <ul data-cert-grid className="mt-14 grid gap-5 [perspective:1400px] sm:grid-cols-2 lg:grid-cols-3">
          <li data-cert>
            <Card featured index="Degree" icon={<GraduationCap size={18} />} kicker={education.year}>
              <h3 className="text-[26px] leading-[1.1] font-bold tracking-[-0.02em] text-void">{education.degree}</h3>
              <p className="mt-3 text-[15px] text-void/70">{education.school}</p>
              <p className="mt-auto pt-6 text-3xl font-extrabold tracking-[-0.03em] text-void">{education.score}</p>
            </Card>
          </li>
          {certifications.map((c, i) => (
            <li key={c.title} data-cert>
              <Card index={String(i + 1).padStart(2, '0')} icon={<Award size={18} />} kicker={c.distinction ? `${c.distinction} certification` : 'Certification'}>
                <h3 className="text-[22px] leading-[1.15] font-semibold tracking-[-0.015em]">{c.title}</h3>
                <div className="mt-auto flex flex-wrap items-center gap-2 pt-6">
                  {c.issuer && <span className="label !text-ivory">{c.issuer}</span>}
                  {c.issuer && <span className="text-silver" aria-hidden="true">·</span>}
                  <span className="label">{c.topic}</span>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

type CardProps = { index: string; icon: ReactNode; kicker: string; featured?: boolean; children: ReactNode }

/** Tilts toward the pointer with a glare that follows it; the seal turns slowly while hovered. */
function Card({ index, icon, kicker, featured, children }: CardProps) {
  const fine = typeof matchMedia !== 'undefined' && matchMedia('(hover: hover) and (pointer: fine)').matches
  const move = (e: PointerEvent<HTMLDivElement>) => {
    if (!fine) return
    const el = e.currentTarget
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width
    const y = (e.clientY - r.top) / r.height
    el.style.setProperty('--rx', `${(0.5 - y) * 12}deg`)
    el.style.setProperty('--ry', `${(x - 0.5) * 14}deg`)
    el.style.setProperty('--gx', `${x * 100}%`)
    el.style.setProperty('--gy', `${y * 100}%`)
  }
  const leave = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.style.setProperty('--rx', '0deg')
    e.currentTarget.style.setProperty('--ry', '0deg')
  }
  return (
    <div
      onPointerMove={move}
      onPointerLeave={leave}
      className={`cert group relative flex h-full min-h-[300px] flex-col overflow-hidden rounded-2xl border p-7 ${
        featured ? 'border-transparent bg-ivory text-void' : 'border-ivory/10 bg-graphite/70 backdrop-blur-sm'
      }`}
      style={{ '--rx': '0deg', '--ry': '0deg', '--gx': '50%', '--gy': '50%' } as CSSProperties}
    >
      <Seal featured={featured} />
      <div className="cert-glare pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="relative flex items-center justify-between">
        <span className={`font-mono text-xs ${featured ? 'text-void/60' : 'text-ion'}`}>{index}</span>
        <span className={`grid size-9 place-items-center rounded-full ${featured ? 'bg-void text-ivory' : 'bg-ion/15 text-ion'}`}>{icon}</span>
      </div>
      <p className={`label relative mt-10 ${featured ? '!text-void/60' : ''}`}>{kicker}</p>
      <div className="relative mt-3 flex flex-1 flex-col">{children}</div>
    </div>
  )
}

/** A guilloché rosette, like the security pattern on a printed certificate. */
function Seal({ featured }: { featured?: boolean }) {
  return (
    <svg
      viewBox="0 0 200 200"
      aria-hidden="true"
      className={`cert-seal pointer-events-none absolute -right-16 -bottom-16 size-64 ${featured ? 'text-void/10' : 'text-ion/15'}`}
    >
      {Array.from({ length: 18 }, (_, i) => (
        <ellipse key={i} cx="100" cy="100" rx="88" ry="34" fill="none" stroke="currentColor" strokeWidth="0.8" transform={`rotate(${i * 10} 100 100)`} />
      ))}
      <circle cx="100" cy="100" r="22" fill="none" stroke="currentColor" strokeWidth="1" />
    </svg>
  )
}
