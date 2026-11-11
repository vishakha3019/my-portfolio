import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Check, Copy, X } from 'lucide-react'
import { mailto, profile } from '../content/profile'
import { lockScroll, scrollToTarget } from '../motion/useSmoothScroll'
import { RollText } from './RollText'
import { raiseCursor } from './raiseCursor'

const links = [
  { label: 'Home', href: '#top', scene: 'Intro', note: 'The glass and the name' },
  { label: 'About', href: '#about', scene: 'About', note: 'Who I am and how I work' },
  { label: 'Experience', href: '#experience', scene: 'Experience', note: 'My role and projects, 2024 to now' },
  { label: 'Work', href: '#work', scene: 'Work', note: 'Six projects, each with a case study' },
  { label: 'Engineering', href: '#engineering', scene: 'Engineering', note: 'Skills and AI workflow' },
  { label: 'Certifications', href: '#credentials', scene: 'Credentials', note: 'Education and certificates' },
  { label: 'Contact', href: '#contact', scene: 'Contact', note: 'Email, LinkedIn, GitHub' },
]

export function Nav() {
  const [open, setOpen] = useState(false)
  const [scene, setScene] = useState('Intro')
  const [copied, setCopied] = useState(false)
  const bar = useRef<HTMLDivElement>(null)
  const dialog = useRef<HTMLDialogElement>(null)

  // which scene is on screen, and how far through the page we are
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setScene((e.target as HTMLElement).dataset.scene ?? '')),
      { rootMargin: '-45% 0px -45% 0px' },
    )
    document.querySelectorAll('[data-scene]').forEach((el) => io.observe(el))
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - innerHeight
      bar.current?.style.setProperty('transform', `scaleX(${max > 0 ? scrollY / max : 0})`)
    }
    addEventListener('scroll', onScroll, { passive: true })
    return () => {
      io.disconnect()
      removeEventListener('scroll', onScroll)
    }
  }, [])

  // the menu is a native modal: focus is trapped, Escape closes it, the page behind can't scroll
  useEffect(() => {
    const d = dialog.current!
    if (open && !d.open) {
      d.showModal()
      raiseCursor()
    }
    if (!open && d.open) d.close()
    lockScroll(open)
  }, [open])

  const go = (href: string) => {
    setOpen(false)
    const target = document.querySelector<HTMLElement>(href)
    // wait a frame so scrolling is unlocked before it starts
    if (target) requestAnimationFrame(() => scrollToTarget(href === '#top' ? 0 : target))
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard blocked: the address stays visible to select by hand
    }
  }

  const current = links.find((l) => l.scene === scene)?.label ?? ''
  return (
    <>
      <div ref={bar} aria-hidden="true" className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left scale-x-0 bg-ion" />
      <header className="gutter fixed inset-x-0 top-0 z-40 grid grid-cols-[1fr_auto_1fr] items-center pt-[max(18px,env(safe-area-inset-top))] pb-4">
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault()
            go('#top')
          }}
          className="justify-self-start font-mono text-[13px] tracking-wide text-ivory"
        >
          vishakha<span className="text-ion">/</span>dev
        </a>
        <span className="label hidden items-center gap-2 md:flex" aria-live="polite">
          <span className="size-1.5 rounded-full bg-ion" aria-hidden="true" />
          {current}
        </span>
        <div className="col-start-3 flex items-center gap-2 justify-self-end">
          <button
            type="button"
            aria-haspopup="dialog"
            aria-expanded={open}
            onClick={() => setOpen(true)}
            className="group label inline-flex items-center gap-2.5 rounded-full bg-ivory px-4 py-2.5 !text-void"
          >
            <span aria-hidden="true" className="flex flex-col gap-[3px]">
              <i className="block h-px w-3.5 bg-void transition-transform duration-500 group-hover:translate-x-0.5" />
              <i className="block h-px w-3.5 bg-void transition-transform duration-500 group-hover:-translate-x-0.5" />
            </span>
            <RollText text="Menu" />
          </button>
        </div>
      </header>

      <dialog
        ref={dialog}
        data-lenis-prevent
        onClose={() => setOpen(false)}
        aria-label="Site menu"
        className="menu m-0 h-dvh max-h-none w-screen max-w-none overflow-y-auto bg-void/95 p-0 text-ivory backdrop-blur-xl"
      >
        <div className="gutter mx-auto flex min-h-full max-w-[1400px] flex-col pt-[max(18px,env(safe-area-inset-top))] pb-8">
          <div className="flex items-center justify-between pb-6">
            <span className="font-mono text-[13px] tracking-wide">
              vishakha<span className="text-ion">/</span>dev
            </span>
            <button
              type="button"
              autoFocus
              onClick={() => setOpen(false)}
              className="group label inline-flex items-center gap-2 rounded-full border border-ivory/25 px-4 py-2.5 !text-ivory transition-colors hover:border-ivory"
            >
              <X size={14} className="transition-transform duration-500 group-hover:rotate-90" />
              Close
            </button>
          </div>

          <div className="grid flex-1 gap-12 border-t border-rule pt-10 lg:grid-cols-[1.5fr_1fr] lg:gap-20">
            <nav aria-label="Sections">
              <p className="label mb-4">Navigate</p>
              <ol>
                {links.map((l, i) => {
                  const here = l.scene === scene
                  return (
                    <li key={l.href} className="menu-item border-b border-rule" style={{ '--i': i } as React.CSSProperties}>
                      <a
                        href={l.href}
                        aria-current={here ? 'location' : undefined}
                        onClick={(e) => {
                          e.preventDefault()
                          go(l.href)
                        }}
                        className="group grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 py-3.5 md:py-4"
                      >
                        <span className={`font-mono text-xs ${here ? 'text-ion' : 'text-silver'}`}>{String(i + 1).padStart(2, '0')}</span>
                        <span>
                          <span className="block text-[clamp(26px,3.4vw,44px)] leading-none font-bold tracking-[-0.03em] transition-colors group-hover:text-ion">
                            <RollText text={l.label} />
                          </span>
                          <span className="label mt-1.5 block">{l.note}</span>
                        </span>
                        <span className="flex items-center gap-3">
                          {here && <span className="label hidden !text-ion sm:inline">You are here</span>}
                          <ArrowUpRight
                            size={20}
                            className="text-silver opacity-0 transition-all duration-500 group-hover:rotate-45 group-hover:text-ivory group-hover:opacity-100"
                          />
                        </span>
                      </a>
                    </li>
                  )
                })}
              </ol>
            </nav>

            <aside className="menu-item flex flex-col gap-10" style={{ '--i': 4 } as React.CSSProperties}>
              <div>
                <p className="label mb-4">Get in touch</p>
                <div className="flex items-center gap-3">
                  <a href={mailto} className="text-lg break-all transition-colors hover:text-ion">
                    {profile.email}
                  </a>
                  <button type="button" onClick={copy} aria-label="Copy email address" className="grid size-9 shrink-0 place-items-center rounded-full border border-rule hover:border-ivory">
                    {copied ? <Check size={14} className="text-ion" /> : <Copy size={14} />}
                  </button>
                  <span className="label" aria-live="polite">
                    {copied ? 'Copied' : ''}
                  </span>
                </div>
              </div>
              <div>
                <p className="label mb-3">Elsewhere</p>
                <ul className="divide-y divide-rule border-y border-rule">
                  {[
                    ['LinkedIn', profile.links.linkedin],
                    ['GitHub', profile.links.github],
                  ].map(([name, href]) => (
                    <li key={name}>
                      <a href={href} target="_blank" rel="noreferrer" className="group flex items-center justify-between py-3 text-lg">
                        <RollText text={name} />
                        <ArrowUpRight size={18} className="text-silver transition-transform duration-500 group-hover:rotate-45 group-hover:text-ivory" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-auto">
                <p className="label">Based in</p>
                <p className="mt-1">{profile.location}</p>
                <p className="label mt-4">Currently</p>
                <p className="mt-1">
                  {profile.role}
                </p>
              </div>
            </aside>
          </div>
        </div>
      </dialog>
    </>
  )
}
