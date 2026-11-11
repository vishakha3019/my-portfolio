import { useMemo } from 'react'

export type DeviceTier = 'high' | 'low'

/**
 * Decides once per load whether the 3D world runs and at what quality.
 * Phones and touch devices run it on the 'low' tier; only browsers without WebGL2 get the CSS fallback.
 */
export function useDeviceTier() {
  return useMemo(() => {
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches
    let webgl = false
    try {
      const probe = document.createElement('canvas').getContext('webgl2')
      webgl = !!probe
      // release the probe context: browsers cap how many a page may hold
      probe?.getExtension('WEBGL_lose_context')?.loseContext()
    } catch {
      webgl = false
    }
    const nav = navigator as Navigator & { deviceMemory?: number }
    const weak =
      (nav.deviceMemory !== undefined && nav.deviceMemory <= 4) ||
      navigator.hardwareConcurrency < 4 ||
      matchMedia('(pointer: coarse)').matches
    const tier: DeviceTier = weak ? 'low' : 'high'
    return { webgl, tier, reducedMotion }
  }, [])
}
