'use client'

import { motion, Variants } from 'framer-motion'

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.2,
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

export default function About() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="relative z-10 flex-1 flex flex-col px-8 md:px-16 pt-32 pb-16 max-w-4xl">
      <motion.section variants={itemVariants} className="mb-16">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-white leading-tight mb-8">
          About Us
        </h1>

        <div className="space-y-6 text-white/50 text-lg leading-relaxed">
          <p>
            <span className="text-white font-medium">Cluster 127</span> is a research-driven
            organization dedicated to building cognitive infrastructure for the next generation of
            intelligent systems.
          </p>

          <p>
            We believe that true machine intelligence requires more than algorithms—it demands a{' '}
            <span className="text-white/50">biological understanding</span> of how information
            lives, evolves, and dies within systems.
          </p>

          <p>
            Our work spans deterministic physics engines, cognitive memory substrates, and
            resilience frameworks—all unified by a single vision:
            <span className="text-white italic"> giving machines the wisdom to feel.</span>
          </p>
        </div>
      </motion.section>

      <motion.section variants={itemVariants} className="mb-16">
        <h2 className="text-2xl font-light tracking-tight text-white/50 mb-6">Our Philosophy</h2>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="border border-white/10 p-6 hover:border-white/20 transition-colors">
            <h3 className="text-white font-medium mb-2">Determinism Over Chaos</h3>
            <p className="text-white/50 text-sm">
              Every behavior is predictable. Every state is recoverable. We build systems that can
              explain themselves.
            </p>
          </div>

          <div className="border border-white/10 p-6 hover:border-white/20 transition-colors">
            <h3 className="text-white font-medium mb-2">Biology as Blueprint</h3>
            <p className="text-white/50 text-sm">
              Information isn&apos;t static data—it&apos;s living tissue that grows, decays, and
              regenerates based on cognitive pressure.
            </p>
          </div>

          <div className="border border-white/10 p-6 hover:border-white/20 transition-colors">
            <h3 className="text-white font-medium mb-2">Physics, Not Magic</h3>
            <p className="text-white/50 text-sm">
              We reject black-box solutions. Our systems operate on transparent, mathematical
              principles.
            </p>
          </div>

          <div className="border border-white/10 p-6 hover:border-white/20 transition-colors">
            <h3 className="text-white font-medium mb-2">Resilience First</h3>
            <p className="text-white/50 text-sm">
              Systems must survive chaos. We engineer for failure, recovery, and graceful
              degradation.
            </p>
          </div>
        </div>
      </motion.section>
    </motion.div>
  )
}
