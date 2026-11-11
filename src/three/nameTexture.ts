import { CanvasTexture, LinearFilter } from 'three'

const FONT = '"Bricolage Grotesque", ui-sans-serif, system-ui, sans-serif'

/** Draws the name full-bleed into a screen-sized canvas, so the backdrop and the glass sample the same pixels. */
export function drawName(texture: CanvasTexture, name: string, width: number, height: number, portraitY = 0.42) {
  const canvas = texture.image as HTMLCanvasElement
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!
  ctx.clearRect(0, 0, width, height)

  const portrait = height > width
  // setting ctx.font resets fontStretch and letterSpacing, so apply them after every font change
  const setFont = (px: number) => {
    ctx.font = `800 ${px}px ${FONT}`
    if ('fontStretch' in ctx) ctx.fontStretch = 'condensed'
    if ('letterSpacing' in ctx) ctx.letterSpacing = `${-px * 0.03}px`
  }
  const text = name.toUpperCase()
  setFont(100)
  const measured = ctx.measureText(text).width
  const size = (width * (portrait ? 0.92 : 0.86) * 100) / measured
  setFont(size)
  ctx.fillStyle = '#fff'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, width / 2, height * (portrait ? portraitY : 0.5))
  texture.needsUpdate = true
}

export function createNameTexture() {
  const texture = new CanvasTexture(document.createElement('canvas'))
  texture.minFilter = LinearFilter
  texture.generateMipmaps = false
  return texture
}

export const nameFontReady = () => document.fonts.load(`800 100px ${FONT}`).catch(() => undefined)
