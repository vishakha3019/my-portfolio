import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import gsap from 'gsap'
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  Group,
  IcosahedronGeometry,
  MathUtils,
  Quaternion,
  ShaderMaterial,
  Vector2,
  Vector3,
  Vector4,
} from 'three'
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { readForm, world } from './state'
import { createNameTexture, drawName, nameFontReady } from './nameTexture'
import {
  backdropFragment,
  backdropVertex,
  glassFragment,
  glassVertex,
  particleFragment,
  particleVertex,
} from './shaders'
import type { DeviceTier } from '../hooks/useDeviceTier'

type Props = { name: string; contactWord: string; tier: DeviceTier; reducedMotion: boolean }

/** One fixed canvas for the whole page: the glass, its particles and the backdrop travel through every scene. */
export default function World(props: Props) {
  return (
    <Canvas
      className="!fixed inset-0"
      style={{ pointerEvents: 'none' }}
      dpr={[1, props.tier === 'high' ? 1.75 : 1.25]}
      camera={{ fov: 35, position: [0, 0, 6], near: 0.1, far: 50 }}
      gl={{ antialias: true, powerPreference: 'high-performance', alpha: false }}
      aria-hidden="true"
    >
      <Scene {...props} />
    </Canvas>
  )
}

const smooth = (a: number, b: number, x: number) => MathUtils.smoothstep(x, a, b)
const ION = new Color('#8b97ff')

function Scene({ name, contactWord, tier, reducedMotion }: Props) {
  const { gl, size, camera } = useThree()
  const glassGroup = useRef<Group>(null!)
  const pointsGroup = useRef<Group>(null!)
  const textTexture = useMemo(createNameTexture, [])

  // uniforms shared by reference across all three materials
  const shared = useMemo(
    () => ({
      uTime: { value: 0 },
      uLift: { value: 0 },
      uText: { value: textTexture },
      uRes: { value: new Vector2(1, 1) },
      uReveal: { value: 0 },
      uTextFade: { value: 0 },
      uAmp: { value: 0.2 },
      uFreq: { value: 1.1 },
      uPulse: { value: 0 },
      uPointerDir: { value: new Vector3(0, 0, 1) },
      uPointerStrength: { value: 0 },
      uTint: { value: ION.clone() },
    }),
    [textTexture],
  )

  const { backdrop, glass, particles, glassGeo, particleGeo } = useMemo(() => {
    const backdrop = new ShaderMaterial({
      vertexShader: backdropVertex,
      fragmentShader: backdropFragment,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        ...shared,
        uPointer: { value: new Vector2(0.5, 0.5) },
        uPointerVel: { value: 0 },
        uGlow: { value: new Vector2(0.5, 0.5) },
        uGlowAmt: { value: 0.16 },
      },
    })
    const glass = new ShaderMaterial({
      vertexShader: glassVertex,
      fragmentShader: glassFragment,
      uniforms: { ...shared, uDissolve: { value: 0 } },
    })
    const particles = new ShaderMaterial({
      vertexShader: particleVertex,
      fragmentShader: particleFragment,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      uniforms: {
        ...shared,
        uForm: { value: 0 },
        uSize: { value: 20 },
        uOpacity: { value: 0 },
        uClusters: { value: [new Vector3(-3, 0, 0), new Vector3(-1, 0, 0), new Vector3(1, 0, 0), new Vector3(3, 0, 0)] },
        uFocusW: { value: new Vector4() },
      },
    })

    // indexed sphere: the vertex shader runs once per unique vertex instead of six times
    const raw = new IcosahedronGeometry(1, tier === 'high' ? 48 : 32)
    raw.deleteAttribute('normal')
    raw.deleteAttribute('uv')
    const glassGeo = mergeVertices(raw)
    raw.dispose()

    const count = tier === 'high' ? 16000 : 6000
    const pos = new Float32Array(count * 3)
    const rand = new Float32Array(count)
    const seed = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const u = Math.random() * 2 - 1
      const a = Math.random() * Math.PI * 2
      const r = Math.sqrt(1 - u * u)
      pos.set([r * Math.cos(a), u, r * Math.sin(a)], i * 3)
      seed.set([Math.random(), Math.random(), Math.random()], i * 3)
      rand[i] = Math.random()
    }
    const particleGeo = new BufferGeometry()
    particleGeo.setAttribute('position', new BufferAttribute(pos, 3))
    particleGeo.setAttribute('aRand', new BufferAttribute(rand, 1))
    particleGeo.setAttribute('aSeed', new BufferAttribute(seed, 3))
    return { backdrop, glass, particles, glassGeo, particleGeo }
  }, [shared, tier])

  // free GPU memory when the scene unmounts
  useEffect(
    () => () => {
      ;[backdrop, glass, particles, glassGeo, particleGeo, textTexture].forEach((r) => r.dispose())
    },
    [backdrop, glass, particles, glassGeo, particleGeo, textTexture],
  )

  // the texture holds the name in the hero and the contact headline at the end; redrawn on resize or word change
  const word = useRef(name)
  const draw = useRef<() => void>(() => {})
  const textReady = useRef(false)
  const frames = useRef(0)
  const introTween = useRef<gsap.core.Tween | null>(null)
  useEffect(() => {
    let cancelled = false
    const buf = gl.getDrawingBufferSize(new Vector2())
    shared.uRes.value.copy(buf)
    draw.current = () => drawName(textTexture, word.current, buf.x, buf.y, word.current === name ? 0.42 : 0.34)
    nameFontReady().then(() => {
      if (cancelled) return
      draw.current()
      textReady.current = true
    })
    return () => {
      cancelled = true
    }
  }, [gl, size.width, size.height, name, shared, textTexture])

  // cinematic entrance, driven by time not scroll. It starts only once the name is drawn and a couple of frames
  // have rendered, so a slow shader compile on the first frame can't swallow the animation.
  useEffect(() => {
    if (reducedMotion) world.intro = 1
    return () => {
      introTween.current?.kill()
    }
  }, [reducedMotion])

  const s = useRef({ p: 0, form: 0, rx: 0.25, ry: 0, vel: 0 })
  const tmp = useMemo(
    () => ({
      q: new Quaternion(),
      dir: new Vector3(),
      proj: new Vector3(),
      hue: new Color(),
      flatQ: new Quaternion(),
      v: new Vector3(),
      focus: new Vector4(),
    }),
    [],
  )

  useFrame((state, dt) => {
    if (!introTween.current && !reducedMotion && textReady.current && ++frames.current > 2) {
      introTween.current = gsap.to(world, { intro: 1, duration: 3.2, ease: 'expo.out' })
    }
    const st = s.current
    const k = 1 - Math.exp(-dt * 6)
    const t = reducedMotion ? 0 : state.clock.elapsedTime
    st.p += (world.progress - st.p) * k
    st.form += (readForm() - st.form) * (1 - Math.exp(-dt * 3.2))
    st.vel += (world.pointerVel - st.vel) * k
    world.pointerVel *= 0.9
    world.pulse *= Math.exp(-dt * 1.8)

    const p = st.p
    const form = st.form
    const intro = world.intro
    const desktop = size.width >= 768
    const heroPhase = 1 - smooth(1.2, 1.8, form)
    const move = smooth(0.06, 0.38, p) * heroPhase
    const contact = smooth(4.35, 4.95, form)
    const dissolve = form < 2.5 ? smooth(0.46, 0.8, p) : 1 - contact
    const dolly = smooth(0.48, 1, p) * heroPhase

    // swap the texture word while it is invisible (mid-page)
    const wanted = form > 3 ? contactWord : name
    if (wanted !== word.current) {
      word.current = wanted
      draw.current()
    }

    // glass: drag spin with inertia, pointer tilt on top
    st.ry += world.spin.x + (reducedMotion ? 0 : dt * 0.08)
    st.rx += world.spin.y
    world.spin.x *= 0.94
    world.spin.y *= 0.94
    const tiltX = (world.pointer.y - 0.5) * -0.5
    const tiltY = (world.pointer.x - 0.5) * 0.7
    const g = glassGroup.current
    g.rotation.x += (st.rx + tiltX + dolly * 0.3 - g.rotation.x) * k
    g.rotation.y += (st.ry + tiltY - g.rotation.y) * k
    g.visible = dissolve < 0.999

    const introScale = MathUtils.lerp(0.35, 1, intro)
    if (form > 2.5) {
      // contact: the glass reforms in the middle of the frame, over the closing headline
      g.scale.setScalar((desktop ? 0.68 : 0.38) * MathUtils.lerp(0.6, 1, contact))
      g.position.set(0, desktop ? 0 : 0.6, 0)
    } else if (desktop) {
      g.scale.setScalar(introScale * (1 + move * 0.18 + dolly * 0.25))
      g.position.set(move * 1.35 * (1 - dolly), 0, 0)
    } else {
      // portrait: smaller glass that rises above the headline, and a tighter ring that fits the narrow frame
      g.scale.setScalar(0.48 * introScale * (1 - move * 0.15) * (1 - dolly * 0.5))
      g.position.set(0, 0.25 + move * 0.55 * (1 - dolly), 0)
    }

    // particles leave from the glass skin, flatten to the screen for the middle scenes, and return to the glass
    const flat = smooth(1, 2, form) * (1 - smooth(4, 5, form))
    const pg = pointsGroup.current
    tmp.flatQ.setFromAxisAngle(tmp.v.set(1, 0, 0), (world.pointer.y - 0.5) * -0.08)
    pg.quaternion.copy(g.quaternion).slerp(tmp.flatQ, flat)
    pg.position.copy(g.position).lerp(tmp.v.set(0, 0, 0), flat)
    pg.scale.copy(g.scale).lerp(tmp.v.set(1, 1, 1), flat)
    pg.visible = form > 0.05 && form < 4.97

    const camZ = desktop ? 6 - dolly * 1.4 : 6
    camera.position.set((world.pointer.x - 0.5) * 0.25, (world.pointer.y - 0.5) * 0.18, camZ)
    camera.lookAt(0, 0, 0)

    // pointer direction in the glass's own space, so the bulge follows the cursor while it spins
    tmp.dir.set((world.pointer.x - 0.5) * 2.4 - g.position.x * 0.4, (world.pointer.y - 0.5) * 2, 1).normalize()
    tmp.q.copy(g.quaternion).invert()
    tmp.dir.applyQuaternion(tmp.q)

    // project tint inside the projects scene, ion everywhere else
    tmp.hue.set(form > 2.55 && form < 3.45 ? world.hue : '#8b97ff')
    shared.uTint.value.lerp(tmp.hue, k * 0.5)

    shared.uTime.value = t
    shared.uLift.value = smooth(0, 0.6, p) * heroPhase
    shared.uReveal.value = smooth(0.12, 1, intro)
    shared.uTextFade.value =
      form < 2.5 ? smooth(0.08, 0.3, p) * 0.78 + smooth(0.5, 0.8, p) * 0.22 : 1 - smooth(4.5, 4.95, form)
    shared.uAmp.value = 0.24 + move * 0.12 + (1 - intro) * 0.5 + world.pulse * 0.06
    shared.uFreq.value = 0.85 + move * 0.4
    shared.uPulse.value = world.pulse
    shared.uPointerDir.value.copy(tmp.dir)
    shared.uPointerStrength.value = 0.1 + Math.min(st.vel, 1.5) * 0.18

    glass.uniforms.uDissolve.value = dissolve
    particles.uniforms.uForm.value = form
    particles.uniforms.uOpacity.value = smooth(0.25, 0.6, form) * (1 - smooth(4.6, 4.97, form)) * 0.9
    particles.uniforms.uSize.value = (form > 2.6 && form < 3.4 ? 14 : 20) * state.viewport.dpr

    // engineering clusters gather around their DOM labels, wherever the layout put them
    if (form > 3.2 && world.anchors.length === 4) {
      const vh = 2 * Math.tan(MathUtils.degToRad(35 / 2)) * camZ
      const vw = vh * (size.width / size.height)
      const clusters = particles.uniforms.uClusters.value as Vector3[]
      world.anchors.forEach((el, i) => {
        const r = el.getBoundingClientRect()
        clusters[i].set(((r.left + r.width / 2) / size.width - 0.5) * vw, -((r.top + r.height / 2) / size.height - 0.5) * vh, 0)
      })
    }
    tmp.focus.set(world.focus === 0 ? 1 : 0, world.focus === 1 ? 1 : 0, world.focus === 2 ? 1 : 0, world.focus === 3 ? 1 : 0)
    ;(particles.uniforms.uFocusW.value as Vector4).lerp(tmp.focus, k)

    backdrop.uniforms.uPointer.value.set(world.pointer.x, world.pointer.y)
    backdrop.uniforms.uPointerVel.value = Math.min(st.vel, 1.5)
    backdrop.uniforms.uGlowAmt.value = 0.16 + flat * 0.06
    tmp.proj.copy(g.position).project(camera)
    backdrop.uniforms.uGlow.value.set(tmp.proj.x * 0.5 + 0.5, tmp.proj.y * 0.5 + 0.5)
  })

  return (
    <>
      <mesh frustumCulled={false} renderOrder={-1} material={backdrop}>
        <planeGeometry args={[2, 2]} />
      </mesh>
      <group ref={glassGroup}>
        <mesh geometry={glassGeo} material={glass} />
      </group>
      <group ref={pointsGroup}>
        <points geometry={particleGeo} material={particles} frustumCulled={false} />
      </group>
    </>
  )
}
