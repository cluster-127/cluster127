'use client'
export default function Footer() {
  return (
    <footer className="relative z-10 flex justify-between items-center px-8 md:px-16 py-6 border-t border-white/5 text-stone-600 font-mono text-xs font-bold">
      <p>Cluster 127 &copy; {new Date().getFullYear()}</p>
      <p>Synthetic Biology for Software.</p>
    </footer>
  )
}
