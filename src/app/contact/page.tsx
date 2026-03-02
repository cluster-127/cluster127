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
      className="relative z-10 flex-1 flex flex-col px-8 md:px-16 pt-32 pb-16">
      <motion.section variants={itemVariants} className="mb-16 max-w-4xl">
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
              width="32"
              height="32"
              fill="currentColor"
              className="text-white/50 group-hover:text-white transition-colors"
              viewBox="0 0 256 256">
              <path d="M214.75,211.71l-62.6-98.38,61.77-67.95a8,8,0,0,0-11.84-10.76L143.24,99.34,102.75,35.71A8,8,0,0,0,96,32H48a8,8,0,0,0-6.75,12.3l62.6,98.37-61.77,68a8,8,0,1,0,11.84,10.76l58.84-64.72,40.49,63.63A8,8,0,0,0,160,224h48a8,8,0,0,0,6.75-12.29ZM164.39,208,62.57,48h29L193.43,208Z"></path>
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
              width="32"
              height="32"
              fill="currentColor"
              className="text-white/50 group-hover:text-white transition-colors"
              viewBox="0 0 256 256">
              <path d="M216,24H40A16,16,0,0,0,24,40V216a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V40A16,16,0,0,0,216,24Zm0,192H40V40H216V216ZM96,112v64a8,8,0,0,1-16,0V112a8,8,0,0,1,16,0Zm88,28v36a8,8,0,0,1-16,0V140a20,20,0,0,0-40,0v36a8,8,0,0,1-16,0V112a8,8,0,0,1,15.79-1.78A36,36,0,0,1,184,140ZM100,84A12,12,0,1,1,88,72,12,12,0,0,1,100,84Z"></path>
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
              width="32"
              height="32"
              fill="currentColor"
              className="text-white/50 group-hover:text-white transition-colors"
              viewBox="0 0 256 256">
              <path d="M208.31,75.68A59.78,59.78,0,0,0,202.93,28,8,8,0,0,0,196,24a59.75,59.75,0,0,0-48,24H124A59.75,59.75,0,0,0,76,24a8,8,0,0,0-6.93,4,59.78,59.78,0,0,0-5.38,47.68A58.14,58.14,0,0,0,56,104v8a56.06,56.06,0,0,0,48.44,55.47A39.8,39.8,0,0,0,96,192v8H72a24,24,0,0,1-24-24A40,40,0,0,0,8,136a8,8,0,0,0,0,16,24,24,0,0,1,24,24,40,40,0,0,0,40,40H96v16a8,8,0,0,0,16,0V192a24,24,0,0,1,48,0v40a8,8,0,0,0,16,0V192a39.8,39.8,0,0,0-8.44-24.53A56.06,56.06,0,0,0,216,112v-8A58.14,58.14,0,0,0,208.31,75.68ZM200,112a40,40,0,0,1-40,40H112a40,40,0,0,1-40-40v-8a41.74,41.74,0,0,1,6.9-22.48A8,8,0,0,0,80,73.83a43.81,43.81,0,0,1,.79-33.58,43.88,43.88,0,0,1,32.32,20.06A8,8,0,0,0,119.82,64h32.35a8,8,0,0,0,6.74-3.69,43.87,43.87,0,0,1,32.32-20.06A43.81,43.81,0,0,1,192,73.83a8.09,8.09,0,0,0,1,7.65A41.72,41.72,0,0,1,200,104Z"></path>
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
