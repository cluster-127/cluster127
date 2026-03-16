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
        className="relative z-10 flex flex-col gap-6 md:gap-8 p-8 md:p-16 pointer-events-none select-none">
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-light text-white/50 leading-tight text-center md:text-left">
          High-end technology with <br />
          <span className="text-white"> a human touch.</span>
        </h1>

        <div className="flex flex-col gap-2 md:max-w-6xl">
          <p className="text-lg md:text-xl font-light text-white/50 leading-relaxed tracking-wider text-center md:text-left w-full md:w-fit">
            We are a team of passionate individuals dedicated to creating innovative solutions that
            blend cutting-edge technology with a human-centered approach. Our mission is to empower
            businesses and individuals alike by providing high-quality products and services that
            enhance everyday life.
          </p>
        </div>
      </motion.section>

      <FloatingLines
        enabledWaves={['top', 'middle', 'bottom']}
        middleWavePosition={{ x: 0.5, y: 0.35, rotate: 0.5 }}
        lineCount={6}
        lineDistance={48}
        bendRadius={48}
        bendStrength={24}
        interactive={false}
        parallax={true}
      />
    </main>
  )
}
