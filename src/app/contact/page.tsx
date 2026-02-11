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
      className="relative z-10 flex-1 flex flex-col px-8 md:px-16 pt-32 pb-16 max-w-6xl">
      <motion.section variants={itemVariants} className="mb-16">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-white leading-tight mb-8">
          Contact Us
        </h1>

        <p className="text-white/50 text-lg leading-relaxed mb-12 max-w-2xl">
          Whether you&apos;re interested in collaboration, have questions about our technology, or
          want to explore integration possibilities—we&apos;d love to hear from you.
        </p>
      </motion.section>

      <motion.section variants={itemVariants} className="grid gap-8 md:grid-cols-3">
        {/* X */}
        <a
          href="https://x.com/cluster127"
          className="group border border-white/10 p-8 hover:border-white/30 transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-3 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 300 300.251"
              width="20"
              height="20"
              fill="currentColor"
              className="text-white/50 group-hover:text-white transition-colors">
              <path d="M178.57 127.15 290.27 0h-26.46l-97.03 110.38L89.34 0H0l117.13 166.93L0 300.25h26.46l102.4-116.59 81.8 116.59H300M36.01 19.54h40.65l187.13 262.13h-40.66" />
            </svg>
            <span className="text-white font-medium">X</span>
          </div>
          <p className="text-white/50 text-sm mb-2">Say hello to us</p>
          <span className="text-white/50 font-sans text-sm group-hover:text-white transition-colors">
            @cluster127
          </span>
        </a>

        <a
          href="https://www.linkedin.com/company/cluster-127"
          className="group border border-white/10 p-8 hover:border-white/30 transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-3 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 382 382"
              fill="currentColor"
              className="text-white/50 group-hover:text-white transition-colors">
              <path d="M347.445 0H34.555C15.471 0 0 15.471 0 34.555v312.889C0 366.529 15.471 382 34.555 382h312.889C366.529 382 382 366.529 382 347.444V34.555C382 15.471 366.529 0 347.445 0zM118.207 329.844c0 5.554-4.502 10.056-10.056 10.056H65.345c-5.554 0-10.056-4.502-10.056-10.056V150.403c0-5.554 4.502-10.056 10.056-10.056h42.806c5.554 0 10.056 4.502 10.056 10.056v179.441zM86.748 123.432c-22.459 0-40.666-18.207-40.666-40.666S64.289 42.1 86.748 42.1s40.666 18.207 40.666 40.666-18.206 40.666-40.666 40.666zM341.91 330.654a9.247 9.247 0 0 1-9.246 9.246H286.73a9.247 9.247 0 0 1-9.246-9.246v-84.168c0-12.556 3.683-55.021-32.813-55.021-28.309 0-34.051 29.066-35.204 42.11v97.079a9.246 9.246 0 0 1-9.246 9.246h-44.426a9.247 9.247 0 0 1-9.246-9.246V149.593a9.247 9.247 0 0 1 9.246-9.246h44.426a9.247 9.247 0 0 1 9.246 9.246v15.655c10.497-15.753 26.097-27.912 59.312-27.912 73.552 0 73.131 68.716 73.131 106.472v86.846z" />
            </svg>
            <span className="text-white font-medium">LinkedIn</span>
          </div>
          <p className="text-white/50 text-sm mb-2">For general inquiries and collaboration</p>
          <span className="text-white/50 font-sans text-sm group-hover:text-white transition-colors">
            @cluster-127
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
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-white/50 group-hover:text-white transition-colors">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            <span className="text-white font-medium">GitHub</span>
          </div>
          <p className="text-white/50 text-sm mb-2">Explore our open-source projects</p>
          <span className="text-white/50 font-sans text-sm group-hover:text-white transition-colors">
            @cluster-127
          </span>
        </a>
      </motion.section>

      <motion.section variants={itemVariants} className="mt-16 pt-8 border-t border-white/5">
        <p className="text-white/50 text-sm">We typically respond within 24-48 hours.</p>
      </motion.section>
    </motion.div>
  )
}
