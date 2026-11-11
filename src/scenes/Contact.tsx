import { useState } from 'react'
import { ArrowUpRight, Check, Copy } from 'lucide-react'
import { mailto, profile } from '../content/profile'
import { RollText } from '../ui/RollText'
import { GlassOrb } from '../ui/GlassOrb'

// Scene 07. The particles fold back into the glass, which now refracts the closing headline: the response.
export function Contact({ webgl }: { webgl: boolean }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch {
      // clipboard blocked: the address is still on screen to select by hand
    }
  }

  return (
    <section id="contact" data-form="5" data-scene="Contact" className="gutter relative flex min-h-svh flex-col pt-24 pb-6" aria-labelledby="contact-title">
      <div className="flex flex-wrap justify-between gap-4">
        <p className="label">07 · Contact</p>
        <p className="label max-w-[36ch] text-right">Have a role, a project or a question? Write to me.</p>
      </div>

      {webgl ? (
        <h2 id="contact-title" className="sr-only">
          {profile.contactWord}
        </h2>
      ) : (
        <div className="relative my-auto py-10">
          <h2 id="contact-title" className="text-center text-[17vw] leading-[0.8] font-extrabold tracking-[-0.05em] uppercase [font-stretch:75%]">
            {profile.contactWord}
          </h2>
          <GlassOrb className="size-[38vw] max-h-[300px] max-w-[300px]" />
        </div>
      )}

      <div className="mt-auto">
        <div>
          <p className="label">Email</p>
          <div className="mt-3 flex flex-wrap items-center gap-4">
            <a href={mailto} className="text-[clamp(24px,3.4vw,52px)] leading-none font-bold tracking-[-0.03em] break-all transition-colors hover:text-ion">
              {profile.email}
            </a>
            <button type="button" onClick={copy} className="grid size-11 place-items-center rounded-full border border-rule transition-colors hover:border-ivory" aria-label="Copy email address">
              {copied ? <Check size={16} className="text-ion" /> : <Copy size={16} />}
            </button>
            <span className="label" aria-live="polite">
              {copied ? 'Copied' : ''}
            </span>
          </div>
          <ul className="mt-8 flex gap-8">
            {[
              ['LinkedIn', profile.links.linkedin],
              ['GitHub', profile.links.github],
            ].map(([label, href]) => (
              <li key={label}>
                <a href={href} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-1.5 text-lg">
                  <RollText text={label} />
                  <ArrowUpRight size={16} className="text-silver transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <footer className="mt-16 flex flex-wrap justify-between gap-3 border-t border-rule pt-5">
        <span className="label">© {new Date().getFullYear()} {profile.name}</span>
        <span className="label">Built with React, Three.js, GLSL and GSAP</span>
      </footer>
    </section>
  )
}
