'use client'

import { useEffect, useRef } from 'react'

interface Impulse {
  x: number
  y: number
  baseX: number
  baseY: number
  radius: number
  alpha: number
  fadeSpeed: number
  maxAlpha: number
  color: string
  vibrationSpeed: number
  vibrationAmount: number
  phase: number
}

export function NeuralImpulses() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Resize canvas
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const impulses: Impulse[] = []
    const colors = ['#7c3aed', '#6366f1', '#8b5cf6', '#a78bfa']

    // Spawn new impulse
    const spawnImpulse = () => {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      impulses.push({
        x,
        y,
        baseX: x,
        baseY: y,
        radius: Math.random() * 30 + 15, // Smaller: 15-35px
        alpha: 0,
        fadeSpeed: Math.random() * 0.006 + 0.003,
        maxAlpha: Math.random() * 0.16 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
        vibrationSpeed: Math.random() * 0.08 + 0.03,
        vibrationAmount: Math.random() * 3 + 1,
        phase: Math.random() * Math.PI * 2,
      })
    }

    // Animation loop
    let animationId: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Spawn occasionally
      if (Math.random() < 0.015 && impulses.length < 12) {
        spawnImpulse()
      }

      // Update and draw
      for (let i = impulses.length - 1; i >= 0; i--) {
        const imp = impulses[i]

        // Vibration movement
        imp.phase += imp.vibrationSpeed
        imp.x = imp.baseX + Math.sin(imp.phase) * imp.vibrationAmount
        imp.y = imp.baseY + Math.cos(imp.phase * 1.3) * imp.vibrationAmount

        // Fade in then out
        if (imp.alpha < imp.maxAlpha && imp.fadeSpeed > 0) {
          imp.alpha += imp.fadeSpeed
          if (imp.alpha >= imp.maxAlpha) {
            imp.fadeSpeed = -imp.fadeSpeed * 0.4 // Slower fade out
          }
        } else {
          imp.alpha += imp.fadeSpeed
        }

        // Remove dead impulses
        if (imp.alpha <= 0) {
          impulses.splice(i, 1)
          continue
        }

        // Draw glow
        const gradient = ctx.createRadialGradient(imp.x, imp.y, 0, imp.x, imp.y, imp.radius)
        gradient.addColorStop(
          0,
          `${imp.color}${Math.floor(imp.alpha * 255)
            .toString(16)
            .padStart(2, '0')}`,
        )
        gradient.addColorStop(1, 'transparent')

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(imp.x, imp.y, imp.radius, 0, Math.PI * 2)
        ctx.fill()
      }

      animationId = requestAnimationFrame(animate)
    }

    // Start with a few impulses
    for (let i = 0; i < 3; i++) spawnImpulse()
    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none mix-blend-color-dodge-burn"
      style={{ zIndex: 0 }}
    />
  )
}
