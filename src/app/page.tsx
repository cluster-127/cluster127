'use client'

import { motion, Variants } from 'framer-motion'
import FloatingLines from './components/floating-lines'

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
    <main className="flex-1 flex flex-col justify-end">
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10 flex flex-col gap-6 md:gap-12 p-8 md:p-16 pointer-events-none select-none">
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-light text-white/50 leading-tight text-center md:text-left">
          We give machines
          <br />
          <span className="text-white"> the wisdom to feel.</span>
        </h1>

        <div className="flex flex-col gap-2 md:max-w-3xl">
          <p className="text-lg md:text-xl font-light text-white/50 leading-relaxed tracking-wider text-center md:text-left w-full md:w-fit">
            Information is not data, information is living, dying, feeling data.
          </p>
          <p className="text-base md:text-lg font-light text-white/40 leading-relaxed tracking-wider text-center md:text-left w-full md:w-fit">
            We build deterministic physics engines for distributed systems. <br />
            Our stack models software as living organisms — with reflexes, memory, and the wisdom to
            forget.
          </p>
        </div>
      </motion.section>

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
    </main>
  )
}
