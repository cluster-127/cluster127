'use client'

import { motion, Variants } from 'framer-motion'
import FloatingLines from './components/floating-lines'
import { PROJECTS } from './projects'

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
        className="relative z-10 flex flex-col h-[calc(100vh-113px)] justify-end px-8 md:px-16">
        <motion.section variants={itemVariants} className="mb-24">
          {/* Manifesto */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-stone-500 leading-tight mb-4 text-center md:text-left">
            We give machines
            <br />
            <span className="text-white"> the wisdom to feel.</span>
          </h1>

          <p className="text-lg font-light text-stone-500 md:max-w-lg leading-relaxed text-center md:text-left w-full md:w-fit">
            Information is not data, information is living, dying, feeling data.
          </p>
        </motion.section>

        <motion.nav
          variants={itemVariants}
          className="flex flex-wrap justify-center md:justify-start gap-10">
          {PROJECTS.map((project) => (
            <a
              key={project.id}
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex flex-col text-md md:text-base font-semibold text-stone-600 hover:text-white duration-300 transition-all hover:-translate-y-1 hover:[text-shadow:0_0_20px_rgba(255,255,255,0.5),0_0_40px_rgba(255,255,255,0.3)]">
              <span className="tracking-wider">{project.name}</span>
              <span className="text-[10px] font-mono text-stone-500 group-hover:text-stone-400 whitespace-nowrap transition-all duration-300 hidden md:inline-flex">
                {project.type}
              </span>
            </a>
          ))}
        </motion.nav>
      </motion.div>

      <div className="absolute bottom-0 left-0 w-full h-full overflow-hidden z-0 opacity-5 pointer-events-none">
        <FloatingLines
          enabledWaves={['top', 'middle', 'bottom']}
          lineCount={12}
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
