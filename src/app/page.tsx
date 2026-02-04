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
        className="relative z-10 flex flex-col gap-6 md:gap-12  pointer-events-none select-none">
        <motion.section variants={itemVariants} className="px-8 md:px-16">
          {/* Manifesto */}
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-light text-white/50 leading-tight mb-4 text-center md:text-left">
            We give machines
            <br />
            <span className="text-white"> the wisdom to feel.</span>
          </h1>

          <p className="text-lg md:text-xl font-light text-white/50 leading-relaxed tracking-wider text-center md:text-left w-full md:w-fit">
            Information is not data, information is living, dying, feeling data.
          </p>
        </motion.section>

        <motion.nav
          variants={itemVariants}
          className="flex flex-wrap justify-center md:justify-start gap-12 py-6 px-8 md:py-12 md:px-16">
          {PROJECTS.map((project) => (
            <div
              key={project.id}
              className="group relative flex flex-col text-md md:text-base text-white/80 cursor-default">
              <span className="tracking-wide">{project.name}</span>
              <span className="text-xs font-sans text-white/50 whitespace-nowrap hidden md:inline-flex">
                {project.type}
              </span>
            </div>
          ))}
        </motion.nav>
      </motion.div>

      <FloatingLines
        enabledWaves={['top', 'middle', 'bottom']}
        middleWavePosition={{ x: 0.5, y: 0.5, rotate: 0.1 }}
        lineCount={4}
        lineDistance={24}
        bendRadius={24}
        bendStrength={12}
        interactive={false}
        parallax={true}
      />
    </>
  )
}
