import { lazy, Suspense, useEffect, useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { profile } from './content/profile'
import { useDeviceTier } from './hooks/useDeviceTier'
import { usePointer } from './hooks/usePointer'
import { useSmoothScroll } from './motion/useSmoothScroll'
import { Cursor } from './ui/Cursor'
import { Nav } from './ui/Nav'
import { Hero } from './scenes/Hero'
import { About } from './scenes/About'
import { Experience } from './scenes/Experience'
import { Projects } from './scenes/projects/Projects'
import { Engineering } from './scenes/Engineering'
import { Certifications } from './scenes/Certifications'
import { Contact } from './scenes/Contact'

// the 3D world ships in its own chunk so the page paints before three.js arrives
const World = lazy(() => import('./three/World'))

/** True once the page has loaded and the main thread is idle, so the 3D world never competes with first paint. */
function useIdle() {
  const [idle, setIdle] = useState(false)
  useEffect(() => {
    let cancel = () => {}
    const go = () => {
      if ('requestIdleCallback' in window) {
        const id = requestIdleCallback(() => setIdle(true), { timeout: 1500 })
        cancel = () => cancelIdleCallback(id)
      } else {
        const id = setTimeout(() => setIdle(true), 300)
        cancel = () => clearTimeout(id)
      }
    }
    if (document.readyState === 'complete') go()
    else addEventListener('load', go, { once: true })
    return () => {
      removeEventListener('load', go)
      cancel()
    }
  }, [])
  return idle
}

export default function App() {
  const { webgl, tier, reducedMotion } = useDeviceTier()
  const idle = useIdle()
  useSmoothScroll(!reducedMotion)
  usePointer()

  // web fonts change the height of the big headlines, so pinned sections re-measure once they land
  useEffect(() => {
    document.fonts.ready.then(() => ScrollTrigger.refresh())
  }, [])

  return (
    <>
      <a href="#about" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:bg-ivory focus:px-4 focus:py-2 focus:text-void">
        Skip to content
      </a>
      {webgl && idle && (
        <Suspense fallback={null}>
          <World name={profile.name} contactWord={profile.contactWord} tier={tier} reducedMotion={reducedMotion} />
        </Suspense>
      )}
      {/* without the 3D world, a quiet fixed glow keeps the page from looking flat */}
      {!webgl && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 bg-[radial-gradient(60%_45%_at_70%_30%,rgb(139_151_255/0.12),transparent_70%),radial-gradient(50%_40%_at_15%_85%,rgb(237_232_222/0.05),transparent_70%)]"
        />
      )}
      <Cursor />
      <Nav />
      <main className="relative">
        <Hero webgl={webgl} />
        <About />
        <Experience />
        <Projects />
        <Engineering clusters={webgl} />
        <Certifications />
        <Contact webgl={webgl} />
      </main>
    </>
  )
}
