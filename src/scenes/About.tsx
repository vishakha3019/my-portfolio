import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { profile } from '../content/profile'

// Scene 03. The orbit ring formed by the hero dissolve circles behind this section.
export function About() {
  const root = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // portrait opens from a slit as it scrolls in, then drifts slower than the page
      gsap.fromTo(
        '[data-portrait]',
        { clipPath: 'inset(22% 8% 22% 8%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: { trigger: '[data-portrait]', start: 'top 100%', end: 'top 55%', scrub: 0.6 } },
      )
      gsap.fromTo('[data-portrait] img', { yPercent: -8, scale: 1.15 }, { yPercent: 8, scale: 1, ease: 'none', scrollTrigger: { trigger: '[data-portrait]', start: 'top bottom', end: 'bottom top', scrub: true } })
      // the statement fills in word by word as you read it; it starts silver (still readable, 6:1 contrast), never faded out
      const fill = { trigger: '[data-statement]', start: 'top 80%', end: 'bottom 45%', scrub: true }
      gsap.fromTo('[data-word="plain"]', { color: '#8e9097' }, { color: '#ede8de', stagger: 0.05, ease: 'none', scrollTrigger: fill })
      gsap.fromTo('[data-word="ion"]', { color: '#8e9097' }, { color: '#8b97ff', stagger: 0.05, ease: 'none', scrollTrigger: fill })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="about" ref={root} data-form="1" data-scene="About" className="gutter relative pt-[6vh] pb-[14vh]" aria-labelledby="about-title">
      <div className="mx-auto grid max-w-[1400px] items-center gap-12 md:grid-cols-12">
        {/* plain photo: a gentle zoom on hover, nothing that distorts it */}
        <figure data-portrait className="group relative aspect-[4/5] overflow-hidden rounded-2xl md:col-span-5">
          {/* zoom lives on the wrapper: GSAP owns the image's own transform for the scroll parallax */}
          <div className="size-full transition-transform duration-1000 ease-expo group-hover:scale-[1.04]">
            <img
              src={profile.portrait}
              srcSet={`${profile.portrait.replace('.jpg', '-480.jpg')} 480w, ${profile.portrait} 720w`}
              sizes="(min-width: 768px) 40vw, 100vw"
              alt="Portrait of Vishakha smiling, wearing a black jacket"
              width={720}
              height={720}
              loading="lazy"
              decoding="async"
              className="size-full object-cover object-[50%_30%] [filter:brightness(0.95)_contrast(1.04)_saturate(0.96)]"
            />
          </div>
          {/* natural colour, graded for the dark page: a cool ion cast on the bright wall, and a dark vignette that keeps the face lit */}
          <div className="pointer-events-none absolute inset-0 bg-[rgb(70_80_160/0.1)] mix-blend-multiply" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_65%_at_50%_34%,transparent_45%,rgb(7_7_8/0.3)_100%)]" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-void/80 to-transparent" />
          <figcaption className="label absolute bottom-4 left-4 !text-ivory">Vishakha · Software Engineer</figcaption>
        </figure>

        <div className="md:col-span-7 md:pl-8">
          <p className="label mb-8">02 · About</p>
          <h2 id="about-title" className="sr-only">About Vishakha</h2>
          <p data-statement className="text-[clamp(28px,3.4vw,54px)] leading-[1.08] font-semibold tracking-[-0.03em]">
            {profile.about.map((line, li) => (
              <span key={li} className={li === 2 ? 'font-serif font-normal italic tracking-[-0.01em] text-ion' : ''}>
                {line.split(' ').map((word, wi) => (
                  <span key={wi} data-word={li === 2 ? 'ion' : 'plain'} className="inline-block">
                    {word}&nbsp;
                  </span>
                ))}
              </span>
            ))}
          </p>
          <dl className="mt-14 grid grid-cols-1 gap-6 border-t border-rule pt-8 sm:grid-cols-3">
            {profile.facts.map((f) => (
              <div key={f.label}>
                <dt className="label">{f.label}</dt>
                <dd className="mt-2 text-lg">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
