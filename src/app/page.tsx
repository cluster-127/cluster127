'use client'

import { motion, Variants } from 'framer-motion'
import FloatingLines from './components/floating-lines'
import { PROJECTS } from './projects'

// Impulse particles

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

export default function Home() {
  return (
    <>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10 min-h-screen bg-transparent text-white font-sans selection:bg-white selection:text-black flex flex-col">
        <div className="absolute top-8 left-8 md:top-16 md:left-16 flex items-center gap-4 mb-8 pointer-events-none select-none">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
            <rect x="2.5" y="2.5" width="19" height="19" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="12" cy="12" r="4" fill="currentColor" />
            <rect x="1" y="1" width="4" height="4" fill="#050505" />
          </svg>
          <span className="font-mono tracking-[0.4em] uppercase text-white">Cluster 127</span>
        </div>

        <main className="relative z-10 flex-1 flex flex-col justify-end px-8 md:px-16 pb-8">
          {/* HERO - Left Bottom */}
          <motion.section variants={itemVariants} className="mb-24">
            {/* Manifesto */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-stone-500 leading-tight mb-4">
              We give machines
              <br />
              <span className="text-white"> the wisdom to feel.</span>
            </h1>

            <p className="text-base md:text-lg font-light text-stone-500 max-w-lg leading-relaxed">
              Information is not data, information is living, dying, feeling data.
            </p>
          </motion.section>

          {/* PROJECT DOCK - horizontal text list */}
          <motion.nav variants={itemVariants} className="flex flex-wrap gap-x-10">
            {PROJECTS.map((project) => (
              <a
                key={project.id}
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col text-md md:text-base font-semibold text-stone-600 hover:text-stone-200 duration-200 transition-all hover:-translate-y-1">
                <span className="tracking-wider">{project.name}</span>
                <span className="text-[10px] font-mono text-stone-500 whitespace-nowrap transition-all duration-200">
                  {project.type}
                </span>
              </a>
            ))}
          </motion.nav>
        </main>

        {/* FOOTER */}
        <motion.footer
          variants={itemVariants}
          className="relative z-10 flex justify-between items-center px-8 md:px-16 py-6 border-t border-white/5 text-stone-600 font-mono text-xs font-bold">
          <p>Synthetic Biology for Software.</p>

          <div className="flex gap-6 uppercase tracking-widest">
            <a
              href="https://github.com/cluster-127"
              target="_blank"
              className="hover:text-white transition-colors">
              Github
            </a>
            <a
              href="https://erdem.work/"
              target="_blank"
              className="hover:text-white transition-colors">
              Blog
            </a>
            <a href="mailto:me@erdem.work" className="hover:text-white transition-colors">
              Contact
            </a>
          </div>
        </motion.footer>
      </motion.div>

      <div className="absolute bottom-0 left-0 w-full h-full overflow-hidden z-0 opacity-5 pointer-events-none">
        <FloatingLines
          enabledWaves={['top', 'middle', 'bottom']}
          // Array - specify line count per wave; Number - same count for all waves
          lineCount={12}
          // Array - specify line distance per wave; Number - same distance for all waves
          lineDistance={7}
          bendRadius={12}
          bendStrength={2}
          interactive={false}
          parallax={true}
        />
      </div>
    </>
  )
}
