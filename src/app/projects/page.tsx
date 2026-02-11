'use client'

import { motion, Variants } from 'framer-motion'
import { PROJECTS } from './projects'
import { groupByCategory } from './util'

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

export default function Projects() {
  const projects = groupByCategory(PROJECTS)

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="relative z-10 flex-1 flex flex-col px-8 md:px-16 pt-32 pb-16 max-w-7xl">
      <motion.section variants={itemVariants} className="mb-16 max-w-3xl">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-white leading-tight mb-8">
          Projects
        </h1>

        <p className="space-y-6 text-white/50 text-lg leading-relaxed mb-4">
          We build substrates, runtimes, and primitives — not products. Our mental model treats
          software as living, cognitive, and physical: systems have metabolism, memory, and
          behavior; they occupy space and time; they need backpressure, policy, and behavioral
          control.
        </p>
        <p className="space-y-6 text-white/50 text-lg leading-relaxed">
          We focus on deterministic, reproducible foundations — cryptographic and policy gates,
          streaming engines, concurrency as physics — so that higher layers can be predictable and
          safe.
        </p>
      </motion.section>

      <motion.section variants={itemVariants} className="mb-16">
        <h2 className="text-2xl font-light tracking-tight text-white/50 mb-6">Our Experiments</h2>

        <div className="grid gap-6 md:grid-cols-3">
          {projects.experiments.map((project) => (
            <a
              key={project.id}
              href={project.link}
              target="_blank"
              className="relative overflow-hidden border border-white/10 py-6 pl-10 pr-6 hover:border-white/20 transition-colors">
              <figure className="absolute -left-1.5 -top-3 text-7xl font-light text-white/10">
                {project.number}
              </figure>
              <aside className="flex flex-col gap-1 flex-1">
                <h3 className="text-white font-medium mb-2">{project.name}</h3>
                <p className="text-white/50 text-sm">{project.description}</p>
                <span className="absolute top-2 right-2 px-2 py-1 text-xs text-white/40 bg-white/5 rounded-sm">
                  {project.type}
                </span>
              </aside>
            </a>
          ))}
        </div>
      </motion.section>

      <motion.section variants={itemVariants} className="mb-16">
        <h2 className="text-2xl font-light tracking-tight text-white/50 mb-6">Our Products</h2>

        <div className="grid gap-6 md:grid-cols-3">
          {projects.products.map((project) => (
            <a
              key={project.id}
              href={project.link}
              target="_blank"
              className="relative overflow-hidden border border-white/10 py-6 pl-10 pr-6 hover:border-white/20 transition-colors">
              <figure className="absolute -left-1.5 -top-3 text-7xl font-light text-white/10">
                {project.number}
              </figure>
              <aside className="flex flex-col gap-1">
                <h3 className="text-white font-medium mb-2">{project.name}</h3>
                <p className="text-white/50 text-sm">{project.description}</p>
                <span className="absolute top-2 right-2 px-2 py-1 text-xs text-white/40 bg-white/5 rounded-sm">
                  {project.type}
                </span>
              </aside>
            </a>
          ))}
        </div>
      </motion.section>
    </motion.div>
  )
}
