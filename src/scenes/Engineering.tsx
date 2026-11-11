import { useEffect, useRef, useState } from 'react'
import { domains, quality, workflow } from '../content/skills'
import { world } from '../three/state'

// Scene 06. The particles split into four connected clusters, one behind each domain.
export function Engineering({ clusters }: { clusters: boolean }) {
  const anchors = useRef<HTMLSpanElement[]>([])
  const [step, setStep] = useState(3)

  useEffect(() => {
    world.anchors = anchors.current
    return () => {
      world.anchors = []
      world.focus = -1
    }
  }, [])

  return (
    <section id="engineering" data-form="4" data-scene="Engineering" className="relative" aria-labelledby="eng-title">
      <div className="gutter flex min-h-svh flex-col pt-28 pb-16">
        <p className="label">05 · Engineering</p>
        <h2 id="eng-title" className="mt-4 max-w-[18ch] text-[clamp(36px,5vw,80px)] leading-[0.95] font-bold tracking-[-0.04em] [font-stretch:85%]">
          One system, <span className="font-serif font-normal italic text-ion">four layers.</span>
        </h2>
        <p className={`label mt-6 ${clusters ? '' : 'mb-4'}`}>● shipped in project work · ○ working knowledge</p>

        <ul className="mt-auto grid grid-cols-2 gap-x-6 gap-y-10 pt-10 lg:grid-cols-4">
          {domains.map((d, i) => (
            <li
              key={d.name}
              tabIndex={0}
              onPointerEnter={() => (world.focus = i)}
              onPointerLeave={() => (world.focus = -1)}
              onFocus={() => (world.focus = i)}
              onBlur={() => (world.focus = -1)}
              className="group outline-none"
            >
              {/* the cluster for this domain forms around this point */}
              <span ref={(el) => void (el && (anchors.current[i] = el))} className={clusters ? 'mx-auto block h-[22vh] min-h-[140px] w-full' : 'hidden'} aria-hidden="true" />
              <h3 className="border-t border-rule pt-4 text-2xl font-bold tracking-[-0.02em] transition-colors group-hover:text-ion group-focus-visible:text-ion">{d.name}</h3>
              <p className="label mt-2">{d.line}</p>
              <ul className="mt-5 space-y-1.5 text-[15px]">
                {d.skills.map((s) => (
                  <li key={s.name} className={s.level === 'shipped' ? 'text-ivory' : 'text-ivory/55'}>
                    <span aria-hidden="true" className="mr-2 text-ion">
                      {s.level === 'shipped' ? '●' : '○'}
                    </span>
                    {s.name}
                    <span className="sr-only">{s.level === 'shipped' ? ' (shipped in project work)' : ' (working knowledge)'}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        <p className="mt-10 border-t border-rule pt-5 text-[15px] text-ivory/60">
          <span className="label mr-3">Quality</span>
          {quality.join(' · ')}
        </p>
      </div>

      <div className="gutter py-[16vh]">
        <div className="mx-auto max-w-[1300px]">
          <p className="label">AI-native workflow</p>
          <h3 className="mt-4 max-w-[20ch] text-[clamp(32px,4.4vw,68px)] leading-[0.98] font-bold tracking-[-0.04em] [font-stretch:85%]">
            AI in the loop, <span className="font-serif font-normal italic text-ion">me on the hook.</span>
          </h3>
          <p className="mt-6 max-w-[56ch] text-lg text-ivory/75">
            Claude Code, OpenAI Codex, Cursor and GitHub Copilot speed up every step. The decisions, the review and the result stay with me.
          </p>

          <ol className="relative mt-14 grid gap-3 md:grid-cols-7 md:gap-0">
            <span aria-hidden="true" className="absolute top-[22px] right-[7%] left-[7%] hidden h-px bg-rule md:block" />
            <span
              aria-hidden="true"
              className="absolute top-[22px] left-[7%] hidden h-px origin-left bg-ion transition-transform duration-700 ease-expo md:block"
              style={{ width: '86%', transform: `scaleX(${step / (workflow.length - 1)})` }}
            />
            {workflow.map((w, i) => (
              <li key={w.step}>
                <button
                  type="button"
                  aria-pressed={i === step}
                  onClick={() => setStep(i)}
                  onPointerEnter={() => setStep(i)}
                  className="group relative flex w-full items-center gap-4 text-left md:flex-col md:text-center"
                >
                  <span
                    className={`grid size-11 shrink-0 place-items-center rounded-full border font-mono text-xs transition-all duration-500 ${
                      i <= step ? 'border-ion bg-ion text-void' : 'border-rule bg-void text-silver'
                    } ${i === step ? 'scale-110' : ''}`}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-sm font-semibold">{w.step}</span>
                </button>
              </li>
            ))}
          </ol>

          <div className="mt-12 grid gap-px overflow-hidden border border-rule bg-rule md:grid-cols-2" aria-live="polite">
            <div className="bg-void p-6">
              <p className="label">AI does</p>
              <p key={`ai${step}`} className="mt-3 text-xl leading-snug [animation:fade-up_0.7s_var(--ease-expo)]">
                {workflow[step].ai}
              </p>
            </div>
            <div className="bg-void p-6">
              <p className="label !text-ion">I own</p>
              <p key={`me${step}`} className="mt-3 text-xl leading-snug [animation:fade-up_0.7s_var(--ease-expo)]">
                {workflow[step].me}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
