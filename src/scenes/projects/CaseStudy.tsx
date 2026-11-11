import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import type { Project } from '../../content/projects'
import { lockScroll } from '../../motion/useSmoothScroll'
import { raiseCursor } from '../../ui/raiseCursor'

type Props = { project: Project | null; onClose: () => void; onNext: () => void }

/** Full case study in a native modal dialog: focus is trapped and Escape closes it. */
export function CaseStudy({ project, onClose, onNext }: Props) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const d = ref.current!
    if (project && !d.open) {
      d.showModal()
      raiseCursor()
    }
    if (!project && d.open) d.close()
    lockScroll(!!project)
  }, [project])

  return (
    <dialog
      ref={ref}
      data-lenis-prevent
      onClose={onClose}
      aria-labelledby="case-title"
      className="m-0 h-dvh max-h-none w-screen max-w-none overflow-y-auto bg-void p-0 text-ivory"
      style={{ '--hue': project?.hue } as React.CSSProperties}
    >
      {project && (
        <article key={project.slug} className="gutter mx-auto max-w-[1200px] pt-8 pb-24">
          <header className="sticky top-0 z-10 -mx-5 flex items-center justify-between bg-void/85 px-5 py-4 backdrop-blur">
            <span className="label">Case study</span>
            <button type="button" onClick={onClose} className="grid size-11 place-items-center rounded-full border border-rule transition-colors hover:border-ivory" aria-label="Close case study">
              <X size={18} />
            </button>
          </header>

          <p className="label mt-10" style={{ color: project.hue }}>
            {project.kind}
          </p>
          <h2 id="case-title" className="mt-4 text-[clamp(56px,10vw,160px)] leading-[0.85] font-extrabold tracking-[-0.03em] [font-stretch:75%]">
            {project.title}
          </h2>
          <p className="mt-8 max-w-[52ch] text-[clamp(19px,1.8vw,26px)] leading-snug">{project.summary}</p>

          {project.results.length > 0 && (
            <dl className="mt-14 grid grid-cols-2 gap-px overflow-hidden border border-rule bg-rule md:grid-cols-3">
              {project.results.map((r) => (
                <div key={r.label} className="bg-void p-6">
                  <dt className="label">{r.label}</dt>
                  <dd className="mt-3 text-[clamp(28px,3vw,44px)] leading-none font-bold tracking-[-0.03em]" style={{ color: project.hue }}>
                    {r.value}
                  </dd>
                </div>
              ))}
            </dl>
          )}

          <div className="mt-20 grid gap-12 md:grid-cols-2">
            <section>
              <h3 className="label">The problem</h3>
              <p className="mt-4 text-lg leading-relaxed text-ivory/85">{project.problem}</p>
            </section>
            <section>
              <h3 className="label">What it does</h3>
              <p className="mt-4 text-lg leading-relaxed text-ivory/85">{project.solution}</p>
            </section>
          </div>

          <section className="mt-20">
            <h3 className="label">Architecture</h3>
            <ol className="mt-6 flex flex-col gap-3 md:flex-row md:items-stretch">
              {project.architecture.map((layer, i) => (
                <li key={layer.label} className="flex flex-1 items-center gap-3 md:flex-col md:items-stretch">
                  <div className="flex-1 rounded-lg border border-rule p-4">
                    <div className="font-mono text-xs" style={{ color: project.hue }}>
                      {String(i + 1).padStart(2, '0')} · {layer.label}
                    </div>
                    <ul className="mt-3 flex flex-wrap gap-1.5">
                      {layer.items.map((it) => (
                        <li key={it} className="rounded bg-ivory/[0.06] px-2 py-1 text-sm">
                          {it}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {i < project.architecture.length - 1 && (
                    <span aria-hidden="true" className="hidden text-center text-silver md:block">
                      →
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </section>

          <div className="mt-20 grid gap-12 md:grid-cols-[3fr_2fr]">
            <section>
              <h3 className="label">My role and contribution</h3>
              <ul className="mt-6 space-y-4">
                {project.role.map((r) => (
                  <li key={r} className="border-l-2 pl-4 text-[17px] leading-relaxed text-ivory/85" style={{ borderColor: project.hue }}>
                    {r}
                  </li>
                ))}
              </ul>
            </section>
            <div className="space-y-12">
              <section>
                <h3 className="label">Stack</h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {project.stack.map((s) => (
                    <li key={s} className="label rounded-full border border-rule px-3 py-1.5 !text-ivory">
                      {s}
                    </li>
                  ))}
                </ul>
              </section>
              <section>
                <h3 className="label">Key features</h3>
                <ul className="mt-4 grid grid-cols-2 gap-2 text-[15px] text-ivory/85">
                  {project.features.map((f) => (
                    <li key={f}>· {f}</li>
                  ))}
                </ul>
              </section>
            </div>
          </div>

          <section className="mt-20">
            <h3 className="label">Challenges and approach</h3>
            <dl className="mt-6 divide-y divide-rule border-y border-rule">
              {project.focus.map((f) => (
                <div key={f.challenge} className="grid gap-2 py-5 md:grid-cols-2 md:gap-10">
                  <dt className="text-lg">{f.challenge}</dt>
                  <dd className="text-lg text-ivory/70">{f.approach}</dd>
                </div>
              ))}
            </dl>
          </section>

          <footer className="mt-20 flex flex-wrap items-center justify-between gap-6 border-t border-rule pt-10">
            <p className="label">Interfaces shown on the main page are illustrative, not production screenshots.</p>
            <button type="button" onClick={onNext} className="group text-2xl font-bold tracking-[-0.02em]">
              Next project <span className="inline-block transition-transform duration-500 group-hover:translate-x-2">→</span>
            </button>
          </footer>
        </article>
      )}
    </dialog>
  )
}
