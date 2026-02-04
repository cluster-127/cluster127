'use client'

import { useEffect, useRef } from 'react'
import {
  Clock,
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three'
import { fragmentShader, vertexShader } from './shader'

const MAX_GRADIENT_STOPS = 8

type WavePosition = {
  x: number
  y: number
  rotate: number
}

type FloatingLinesProps = {
  linesGradient?: string[]
  enabledWaves?: Array<'top' | 'middle' | 'bottom'>
  lineCount?: number | number[]
  lineDistance?: number | number[]
  topWavePosition?: WavePosition
  middleWavePosition?: WavePosition
  bottomWavePosition?: WavePosition
  animationSpeed?: number
  interactive?: boolean
  bendRadius?: number
  bendStrength?: number
  mouseDamping?: number
  parallax?: boolean
  parallaxStrength?: number
  mixBlendMode?: React.CSSProperties['mixBlendMode']
}

function hexToVec3(hex: string): Vector3 {
  let value = hex.trim()

  if (value.startsWith('#')) {
    value = value.slice(1)
  }

  let r = 255
  let g = 255
  let b = 255

  if (value.length === 3) {
    r = parseInt(value[0] + value[0], 16)
    g = parseInt(value[1] + value[1], 16)
    b = parseInt(value[2] + value[2], 16)
  } else if (value.length === 6) {
    r = parseInt(value.slice(0, 2), 16)
    g = parseInt(value.slice(2, 4), 16)
    b = parseInt(value.slice(4, 6), 16)
  }

  return new Vector3(r / 255, g / 255, b / 255)
}

export default function FloatingLines({
  linesGradient,
  enabledWaves = ['top', 'middle', 'bottom'],
  lineCount = [6],
  lineDistance = [5],
  topWavePosition,
  middleWavePosition,
  bottomWavePosition = { x: 2.0, y: -0.7, rotate: -1 },
  animationSpeed = 1,
  interactive = true,
  bendRadius = 5.0,
  bendStrength = -0.5,
  mouseDamping = 0.05,
  parallax = true,
  parallaxStrength = 0.2,
  mixBlendMode = 'screen',
}: FloatingLinesProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const targetMouseRef = useRef<Vector2>(new Vector2(-1000, -1000))
  const currentMouseRef = useRef<Vector2>(new Vector2(-1000, -1000))
  const targetInfluenceRef = useRef<number>(0)
  const currentInfluenceRef = useRef<number>(0)
  const targetParallaxRef = useRef<Vector2>(new Vector2(0, 0))
  const currentParallaxRef = useRef<Vector2>(new Vector2(0, 0))

  const getLineCount = (waveType: 'top' | 'middle' | 'bottom'): number => {
    if (typeof lineCount === 'number') return lineCount
    if (!enabledWaves.includes(waveType)) return 0
    const index = enabledWaves.indexOf(waveType)
    return lineCount[index] ?? 6
  }

  const getLineDistance = (waveType: 'top' | 'middle' | 'bottom'): number => {
    if (typeof lineDistance === 'number') return lineDistance
    if (!enabledWaves.includes(waveType)) return 0.1
    const index = enabledWaves.indexOf(waveType)
    return lineDistance[index] ?? 0.1
  }

  const topLineCount = enabledWaves.includes('top') ? getLineCount('top') : 0
  const middleLineCount = enabledWaves.includes('middle') ? getLineCount('middle') : 0
  const bottomLineCount = enabledWaves.includes('bottom') ? getLineCount('bottom') : 0

  const topLineDistance = enabledWaves.includes('top') ? getLineDistance('top') * 0.01 : 0.01
  const middleLineDistance = enabledWaves.includes('middle')
    ? getLineDistance('middle') * 0.01
    : 0.01
  const bottomLineDistance = enabledWaves.includes('bottom')
    ? getLineDistance('bottom') * 0.01
    : 0.01

  useEffect(() => {
    if (!containerRef.current) return

    const scene = new Scene()

    const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1)
    camera.position.z = 1

    const renderer = new WebGLRenderer({ antialias: true, alpha: false })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    containerRef.current.appendChild(renderer.domElement)

    const uniforms = {
      iTime: { value: 0 },
      iResolution: { value: new Vector3(1, 1, 1) },
      animationSpeed: { value: animationSpeed },

      enableTop: { value: enabledWaves.includes('top') },
      enableMiddle: { value: enabledWaves.includes('middle') },
      enableBottom: { value: enabledWaves.includes('bottom') },

      topLineCount: { value: topLineCount },
      middleLineCount: { value: middleLineCount },
      bottomLineCount: { value: bottomLineCount },

      topLineDistance: { value: topLineDistance },
      middleLineDistance: { value: middleLineDistance },
      bottomLineDistance: { value: bottomLineDistance },

      topWavePosition: {
        value: new Vector3(
          topWavePosition?.x ?? 10.0,
          topWavePosition?.y ?? 0.5,
          topWavePosition?.rotate ?? -0.4,
        ),
      },
      middleWavePosition: {
        value: new Vector3(
          middleWavePosition?.x ?? 5.0,
          middleWavePosition?.y ?? 0.0,
          middleWavePosition?.rotate ?? 0.2,
        ),
      },
      bottomWavePosition: {
        value: new Vector3(
          bottomWavePosition?.x ?? 2.0,
          bottomWavePosition?.y ?? -0.7,
          bottomWavePosition?.rotate ?? 0.4,
        ),
      },

      iMouse: { value: new Vector2(-1000, -1000) },
      interactive: { value: interactive },
      bendRadius: { value: bendRadius },
      bendStrength: { value: bendStrength },
      bendInfluence: { value: 0 },

      parallax: { value: parallax },
      parallaxStrength: { value: parallaxStrength },
      parallaxOffset: { value: new Vector2(0, 0) },

      lineGradient: {
        value: Array.from({ length: MAX_GRADIENT_STOPS }, () => new Vector3(1, 1, 1)),
      },
      lineGradientCount: { value: 0 },
    }

    if (linesGradient && linesGradient.length > 0) {
      const stops = linesGradient.slice(0, MAX_GRADIENT_STOPS)
      uniforms.lineGradientCount.value = stops.length

      stops.forEach((hex, i) => {
        const color = hexToVec3(hex)
        uniforms.lineGradient.value[i].set(color.x, color.y, color.z)
      })
    }

    const material = new ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
    })

    const geometry = new PlaneGeometry(2, 2)
    const mesh = new Mesh(geometry, material)
    scene.add(mesh)

    const clock = new Clock()

    const setSize = () => {
      const el = containerRef.current
      if (!el) return

      const width = el.clientWidth || 1
      const height = el.clientHeight || 1

      renderer.setSize(width, height, false)

      const canvasWidth = renderer.domElement.width
      const canvasHeight = renderer.domElement.height
      uniforms.iResolution.value.set(canvasWidth, canvasHeight, 1)
    }

    setSize()

    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(setSize) : null

    if (ro && containerRef.current) {
      ro.observe(containerRef.current)
    }

    const handlePointerMove = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      const dpr = renderer.getPixelRatio()

      targetMouseRef.current.set(x * dpr, (rect.height - y) * dpr)
      targetInfluenceRef.current = 1.0

      if (parallax) {
        const centerX = rect.width / 2
        const centerY = rect.height / 2
        const offsetX = (x - centerX) / rect.width
        const offsetY = -(y - centerY) / rect.height
        targetParallaxRef.current.set(offsetX * parallaxStrength, offsetY * parallaxStrength)
      }
    }

    const handlePointerLeave = () => {
      targetInfluenceRef.current = 0.0
    }

    if (interactive) {
      renderer.domElement.addEventListener('pointermove', handlePointerMove)
      renderer.domElement.addEventListener('pointerleave', handlePointerLeave)
    }

    let raf = 0
    const renderLoop = () => {
      uniforms.iTime.value = clock.getElapsedTime()

      if (interactive) {
        currentMouseRef.current.lerp(targetMouseRef.current, mouseDamping)
        uniforms.iMouse.value.copy(currentMouseRef.current)

        currentInfluenceRef.current +=
          (targetInfluenceRef.current - currentInfluenceRef.current) * mouseDamping
        uniforms.bendInfluence.value = currentInfluenceRef.current
      }

      if (parallax) {
        currentParallaxRef.current.lerp(targetParallaxRef.current, mouseDamping)
        uniforms.parallaxOffset.value.copy(currentParallaxRef.current)
      }

      renderer.render(scene, camera)
      raf = requestAnimationFrame(renderLoop)
    }
    renderLoop()

    return () => {
      cancelAnimationFrame(raf)
      if (ro && containerRef.current) {
        ro.disconnect()
      }

      if (interactive) {
        renderer.domElement.removeEventListener('pointermove', handlePointerMove)
        renderer.domElement.removeEventListener('pointerleave', handlePointerLeave)
      }

      geometry.dispose()
      material.dispose()
      renderer.dispose()
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement)
      }
    }
  }, [
    linesGradient,
    enabledWaves,
    lineCount,
    lineDistance,
    topWavePosition,
    middleWavePosition,
    bottomWavePosition,
    animationSpeed,
    interactive,
    bendRadius,
    bendStrength,
    mouseDamping,
    parallax,
    parallaxStrength,
  ])

  return (
    <div className="absolute bottom-0 left-0 w-full h-full overflow-hidden z-0">
      <div
        ref={containerRef}
        className="w-full h-full relative overflow-hidden floating-lines-container"
        style={{
          mixBlendMode: mixBlendMode,
        }}
      />
    </div>
  )
}
