'use client'

import { motion, Variants } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { PROJECTS } from './projects'

// --- ANIMATION VARIANTS ---
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.3,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
}

// --- NEURAL IMPULSE BACKGROUND ---
function NeuralImpulses() {
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

    // Impulse particles
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
        radius: Math.random() * 20 + 15, // Smaller: 15-35px
        alpha: 0,
        fadeSpeed: Math.random() * 0.006 + 0.003,
        maxAlpha: Math.random() * 0.12 + 0.04,
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
    <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} />
  )
}

export default function Home() {
  const [hoveredProject, setHoveredProject] = useState<string | null>(null)

  return (
    <>
      {/* Neural impulse background */}
      <NeuralImpulses />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10 min-h-screen bg-transparent text-[#E0E0E0] font-sans selection:bg-white selection:text-black flex flex-col">
        {/* MAIN CONTENT - pushes footer down */}
        <main className="flex-1 flex flex-col justify-end px-8 md:px-16 pb-8">
          {/* HERO - Left Bottom */}
          <motion.section variants={itemVariants} className="mb-12">
            {/* Cluster Logo */}
            <div className="flex items-center gap-4 mb-8">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
                <rect
                  x="2.5"
                  y="2.5"
                  width="19"
                  height="19"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <circle cx="12" cy="12" r="4" fill="currentColor" />
                <rect x="1" y="1" width="4" height="4" fill="#050505" />
              </svg>
              <span className="text-[10px] font-mono tracking-[0.4em] uppercase text-gray-500">
                Cluster 127
              </span>
            </div>

            {/* Manifesto */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-white leading-tight mb-4">
              Synthetic Biology
              <br />
              <span className="text-gray-500">for Software</span>
            </h1>

            <p className="text-base md:text-lg font-light text-gray-500 max-w-lg leading-relaxed">
              Information is not data. Information is living, dying, feeling data.
            </p>
          </motion.section>

          {/* PROJECT DOCK - horizontal text list */}
          <motion.nav variants={itemVariants} className="flex flex-wrap gap-x-8 gap-y-3">
            {PROJECTS.map((project) => (
              <a
                key={project.id}
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative"
                onMouseEnter={() => setHoveredProject(project.id)}
                onMouseLeave={() => setHoveredProject(null)}>
                {/* Project name */}
                <span
                  className={`text-sm md:text-base tracking-wide transition-colors duration-200 ${
                    hoveredProject === project.id
                      ? 'text-white'
                      : 'text-gray-600 hover:text-gray-200'
                  }`}>
                  {project.name}
                </span>

                {/* Tooltip on hover */}
                <span
                  className={`absolute left-0 -top-8 text-[10px] font-mono text-gray-500 whitespace-nowrap transition-all duration-200 ${
                    hoveredProject === project.id
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-1 pointer-events-none'
                  }`}>
                  {project.type}
                </span>
              </a>
            ))}
          </motion.nav>
        </main>

        {/* FOOTER */}
        <motion.footer
          variants={itemVariants}
          className="flex justify-between items-center px-8 md:px-16 py-6 border-t border-white/5">
          <p className="text-[10px] font-mono text-gray-700">
            We give machines the wisdom to forget.
          </p>

          <div className="flex gap-6 font-mono text-[10px] uppercase tracking-widest text-gray-700">
            <a
              href="https://github.com/cluster-127"
              target="_blank"
              className="hover:text-white transition-colors">
              Github
            </a>
            <a
              href="https://erdemarslan.hashnode.dev/"
              target="_blank"
              className="hover:text-white transition-colors">
              Blog
            </a>
            <a href="mailto:erdemarslan@ymail.com" className="hover:text-white transition-colors">
              Contact
            </a>
          </div>
        </motion.footer>
      </motion.div>
    </>
  )
}
