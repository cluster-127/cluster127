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

export default function Contact() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="relative z-10 flex-1 flex flex-col px-8 md:px-16 pt-32 pb-16 max-w-4xl">
      <motion.section variants={itemVariants} className="mb-16">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-white leading-tight mb-8">
          Contact Us
        </h1>

        <p className="text-stone-400 text-lg leading-relaxed mb-12 max-w-2xl">
          Whether you&apos;re interested in collaboration, have questions about our technology, or
          want to explore integration possibilities—we&apos;d love to hear from you.
        </p>
      </motion.section>

      <motion.section variants={itemVariants} className="grid gap-8 md:grid-cols-2">
        {/* Email */}
        <a
          href="mailto:me@erdem.work"
          className="group border border-white/10 p-8 hover:border-white/30 transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-3 mb-4">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-stone-500 group-hover:text-white transition-colors">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            <span className="text-white font-medium">Email</span>
          </div>
          <p className="text-stone-500 text-sm mb-2">For general inquiries and collaboration</p>
          <span className="text-stone-300 font-mono text-sm group-hover:text-white transition-colors">
            me@erdem.work
          </span>
        </a>

        {/* GitHub */}
        <a
          href="https://github.com/cluster-127"
          target="_blank"
          rel="noopener noreferrer"
          className="group border border-white/10 p-8 hover:border-white/30 transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-3 mb-4">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-stone-500 group-hover:text-white transition-colors">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            <span className="text-white font-medium">GitHub</span>
          </div>
          <p className="text-stone-500 text-sm mb-2">Explore our open-source projects</p>
          <span className="text-stone-300 font-mono text-sm group-hover:text-white transition-colors">
            github.com/cluster-127
          </span>
        </a>
      </motion.section>

      <motion.section variants={itemVariants} className="mt-16 pt-8 border-t border-white/5">
        <p className="text-stone-600 text-sm">We typically respond within 24-48 hours.</p>
      </motion.section>
    </motion.div>
  )
}
